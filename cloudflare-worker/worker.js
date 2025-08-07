// Cloudflare Worker for handling contact form submissions
// Uses SendGrid to send emails. Configure a secret named SENDGRID_API_KEY.
// Deploy with: wrangler deploy
// After deployment, update the endpoint URL in script.js (CONTACT_ENDPOINT).

function escapeHTML(str = '') {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function sanitize(v, max = 2000) {
  return (v || '').toString().trim().slice(0, max);
}

async function sendEmail(env, { name, email, subject, message, ip }) {
  const body = {
    personalizations: [
      {
        to: [{ email: 'kiefertaylorland@gmail.com' }],
        subject: `Portfolio Contact: ${subject}`
      }
    ],
    from: { email: 'no-reply@contact.kiefertaylorland.com', name: 'Portfolio Contact' },
    reply_to: { email, name },
    content: [
      {
        type: 'text/html',
        value: `<h2>New Portfolio Message</h2>
          <p><b>Name:</b> ${escapeHTML(name)}</p>
          <p><b>Email:</b> ${escapeHTML(email)}</p>
          <p><b>Subject:</b> ${escapeHTML(subject)}</p>
          <p><b>Message:</b><br>${escapeHTML(message).replace(/\n/g,'<br>')}</p>
          <hr><p style="font-size:12px;color:#666">IP: ${escapeHTML(ip || '')}</p>`
      }
    ]
  };

  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.SENDGRID_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('SendGrid error ' + resp.status + ': ' + text);
  }
}

async function handlePost(request, env, ctx) {
  let form;
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await request.json();
    form = json;
  } else if (contentType.includes('form')) {
    const fd = await request.formData();
    form = Object.fromEntries(fd.entries());
  } else {
    return jsonResponse({ error: 'Unsupported Content-Type' }, 415); 
  }

  const honeypot = form._honey || form.honey || '';
  if (honeypot) {
    return jsonResponse({ success: true }); // silently accept spam
  }

  const name = sanitize(form.name, 120);
  const email = sanitize(form.email, 180);
  const subject = sanitize(form.subject, 180) || 'No Subject';
  const message = sanitize(form.message, 4000);

  if (!name || name.length < 2) return jsonResponse({ error: 'Invalid name' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse({ error: 'Invalid email' }, 400);
  if (!message || message.length < 10) return jsonResponse({ error: 'Invalid message' }, 400);

  try {
    await sendEmail(env, { name, email, subject, message, ip: request.headers.get('CF-Connecting-IP') });
    return jsonResponse({ success: true });
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: 'Email send failed' }, 500);
  }
}

function jsonResponse(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const allowed = ['https://kiefertaylorland.github.io', 'http://localhost:5500']; // adjust dev origin
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : 'https://kiefertaylorland.github.io',
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === 'POST') {
      const resp = await handlePost(request, env, ctx);
      // merge CORS headers
      for (const [k,v] of Object.entries(corsHeaders)) resp.headers.set(k,v);
      return resp;
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }
};
