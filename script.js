// Portfolio Website JavaScript
// Following security best practices and modern JS patterns

'use strict';

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initContactForm();
    initSmoothScrolling();
    initAnimations();
});

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('nav');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background blur effect when scrolled
        if (scrollTop > 100) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects and Animations
function initScrollEffects() {
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

// Intersection Observer for Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .stat, .about-text, .about-skills'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: sanitizeInput(formData.get('name')),
            email: sanitizeInput(formData.get('email')),
            subject: sanitizeInput(formData.get('subject')),
            message: sanitizeInput(formData.get('message'))
        };
        
        // Validate form
        const validation = validateForm(data);
        if (!validation.isValid) {
            displayFormErrors(validation.errors);
            return;
        }
        
        // Show loading state
        setFormLoading(true);
        
        try {
            // Attempt real form submission to FormSubmit service
            const nativeSubmit = () => {
                // Fallback: native form submit will redirect but ensures delivery
                form.submit();
            };
            try {
                await submitContactForm(data);
            } catch (ajaxErr) {
                // Already logged inside submitContactForm
                nativeSubmit();
                return; // Stop further success handling (native submission takes over)
            }
            
            // Show success message
            showSuccessMessage('Thank you! Your message has been sent successfully.');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        } finally {
            setFormLoading(false);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state when user starts typing
            this.classList.remove('error');
            const errorElement = document.getElementById(`${this.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

// Form Validation Functions
function validateForm(data) {
    const errors = {};
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim().length < 5) {
        errors.subject = 'Subject must be at least 5 characters long';
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
        isValid = false;
    }
    
    return { isValid, errors };
}

function validateField(field) {
    const value = sanitizeInput(field.value);
    const name = field.name;
    let error = '';
    
    switch (name) {
        case 'name':
            if (!value || value.length < 2) {
                error = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (!value || value.length < 5) {
                error = 'Subject must be at least 5 characters long';
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                error = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    const errorElement = document.getElementById(`${name}-error`);
    if (errorElement) {
        errorElement.textContent = error;
    }
    
    if (error) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
    
    return !error;
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.textContent = '');
    
    const inputElements = document.querySelectorAll('.form-input, .form-textarea');
    inputElements.forEach(el => el.classList.remove('error'));
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = errors[fieldName];
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    });
}

function setFormLoading(isLoading) {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (isLoading) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function showSuccessMessage(message) {
    const form = document.getElementById('contact-form');
    const existingMessage = form.querySelector('.form-success');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const form = document.getElementById('contact-form');
    const existingMessage = form.querySelector('.form-error-global');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-global';
    errorDiv.style.cssText = `
        background-color: var(--accent-color);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-lg);
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Real form submission via FormSubmit.co
// NOTE: The FormSubmit email address should be set in a separate configuration script as `window.FORMSUBMIT_EMAIL`
async function submitContactForm(data) {
    if (!window.FORMSUBMIT_EMAIL) {
        throw new Error('FormSubmit email address is not configured. Please set window.FORMSUBMIT_EMAIL.');
    }
    const endpoint = `https://formsubmit.co/ajax/${window.FORMSUBMIT_EMAIL}`;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('_subject', `Portfolio Contact: ${data.subject}`);
    formData.append('message', data.message);
    formData.append('_captcha', 'false');
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error('Form submission failed');
        }
        return result;
    } catch (err) {
        console.warn('AJAX FormSubmit attempt failed:', err);
        throw err; // Let caller decide fallback
    }
}

// Performance Utilities
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send error reports to monitoring service
});

// Analytics placeholder (replace with actual analytics)
function trackEvent(category, action, label) {
    // Example: Google Analytics 4
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
    
    console.log('Analytics event:', { category, action, label });
}

// Track important interactions
document.addEventListener('click', function(e) {
    const element = e.target.closest('a, button');
    if (!element) return;
    
    if (element.classList.contains('btn-primary')) {
        trackEvent('engagement', 'click', 'primary-button');
    } else if (element.classList.contains('social-link')) {
        trackEvent('social', 'click', element.getAttribute('aria-label'));
    } else if (element.classList.contains('nav-link')) {
        trackEvent('navigation', 'click', element.textContent.trim());
    }
});
