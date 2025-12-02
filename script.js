// script.js
// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollReveal();
    initializeFormValidation();
    updateCurrentYear();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Navigation & Smooth Scrolling
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile hamburger toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', 
            hamburger.classList.contains('active').toString());
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for scroll reveal animations
function initializeScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('active');
                    
                    // Animate skill progress bars
                    if (entry.target.classList.contains('skill-card')) {
                        animateProgressBar(entry.target);
                    }
                }, parseInt(delay));
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
}

// Animate skill progress bars
function animateProgressBar(skillCard) {
    const progressFill = skillCard.querySelector('.progress-fill');
    if (!progressFill) return;
    
    const targetWidth = progressFill.dataset.width + '%';
    progressFill.style.width = '0%';
    
    setTimeout(() => {
        progressFill.style.width = targetWidth;
    }, 300);
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    // Clear previous errors on input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            clearError(this.id);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous state
        successMessage.style.display = 'none';
        let isValid = true;
        
        // Validate each field
        isValid = validateField('name', 'Please enter your name') && isValid;
        isValid = validateField('email', 'Please enter a valid email', validateEmail) && isValid;
        isValid = validateField('message', 'Please enter your message') && isValid;
        
        if (isValid) {
            // Simulate form submission
            successMessage.style.display = 'block';
            form.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    });
    
    // Field validation helper
    function validateField(fieldId, errorMessage, validationFn) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        const value = field.value.trim();
        
        if (!value) {
            showError(fieldId, errorMessage);
            return false;
        }
        
        if (validationFn && !validationFn(value)) {
            showError(fieldId, errorMessage);
            return false;
        }
        
        return true;
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show error message
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        const field = document.getElementById(fieldId);
        
        errorElement.textContent = message;
        field.style.borderColor = 'var(--error)';
    }
    
    // Clear error message
    function clearError(fieldId) {
        const errorElement = document.getElementById(fieldId + '-error');
        const field = document.getElementById(fieldId);
        
        errorElement.textContent = '';
        field.style.borderColor = '';
    }
}

// Update current year in footer
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize skill progress bars on page load for visible elements
window.addEventListener('load', function() {
    document.querySelectorAll('.skill-card.active').forEach(card => {
        animateProgressBar(card);
    });
});