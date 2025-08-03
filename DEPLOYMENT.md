# Deployment Guide

This document provides step-by-step instructions for deploying your portfolio website.

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended)

1. **Create Account**: Sign up at [netlify.com](https://netlify.com)
2. **Connect Repository**: 
   - Push your code to GitHub
   - Connect your GitHub account to Netlify
   - Select your portfolio repository
3. **Deploy Settings**:
   - Build command: `echo 'No build required'`
   - Publish directory: `.` (root)
   - The `netlify.toml` file will handle the rest
4. **Custom Domain** (Optional):
   - Add your custom domain in Netlify settings
   - Update DNS records as instructed

### Option 2: GitHub Pages

1. **Repository Setup**:
   - Push code to GitHub repository
   - Go to repository Settings → Pages
   - Select source: Deploy from a branch
   - Choose `main` branch and `/` (root) folder
2. **Access**: Your site will be available at `https://yourusername.github.io/repository-name`

### Option 3: Vercel

1. **Import Project**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Use default settings (no build step needed)
2. **Deploy**: Automatic deployment on every push

## 🔧 Local Development

### Prerequisites
- Python 3.x (for development server)
- Modern web browser
- Text editor (VS Code recommended)

### Running Locally

```bash
# Navigate to project directory
cd portfolio

# Start development server (Python 3)
python3 -m http.server 8000

# Alternative methods
python -m http.server 8000  # Python 2.7
npx serve .                 # Node.js serve package
```

Visit `http://localhost:8000` in your browser.

## 📝 Customization Guide

### Content Updates

1. **Personal Information**:
   - Update contact details in `index.html`
   - Modify hero section content
   - Update about me section

2. **Projects**:
   - Add/remove project cards in the projects section
   - Update project descriptions and technologies

3. **Services**:
   - Customize service offerings
   - Update service descriptions and icons

### Styling Changes

1. **Color Scheme**:
   - Modify CSS custom properties in `styles.css`
   - Update `:root` variables for consistent theming

2. **Layout**:
   - Adjust grid layouts and spacing
   - Modify responsive breakpoints

3. **Typography**:
   - Change fonts in CSS
   - Update font sizes and weights

### Adding Features

1. **Blog Section**:
   - Add new HTML section
   - Create blog post template
   - Add to navigation

2. **Portfolio Filtering**:
   - Add filter buttons
   - Implement JavaScript filtering logic

3. **Dark Mode**:
   - Add theme toggle button
   - Implement CSS custom properties for themes
   - Add JavaScript for theme switching

## 🔒 Security Checklist

- [ ] Content Security Policy configured
- [ ] HTTPS enforced
- [ ] Security headers implemented
- [ ] Input validation on forms
- [ ] No sensitive data in client-side code

## 📊 Performance Optimization

- [ ] Images optimized (WebP format recommended)
- [ ] CSS and JS minified for production
- [ ] Lazy loading implemented
- [ ] Caching headers configured
- [ ] CDN setup (automatic with Netlify/Vercel)

## 🧪 Testing

### Manual Testing
- [ ] Test all navigation links
- [ ] Verify form validation
- [ ] Check responsive design on different devices
- [ ] Test in different browsers

### Automated Testing
```bash
# HTML validation (requires html-validate)
npm install -g @html-validate/html-validate
html-validate index.html

# Accessibility testing (requires axe-cli)
npm install -g @axe-core/cli
axe http://localhost:8000
```

## 📈 Analytics & Monitoring

### Google Analytics 4
1. Create GA4 property
2. Add tracking code to `index.html`
3. Configure events in `script.js`

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: '.'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Support

For technical support or questions:
- Email: kland7@wgu.edu
- LinkedIn: [Kiefer Land](https://www.linkedin.com/in/kiefertaylorland)

## 📋 Maintenance Schedule

### Monthly
- [ ] Update dependencies
- [ ] Check for broken links
- [ ] Review analytics data
- [ ] Update content as needed

### Quarterly
- [ ] Performance audit
- [ ] Security review
- [ ] Backup website
- [ ] Update portfolio projects

---

*Last updated: January 2025*
