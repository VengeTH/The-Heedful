// * Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // * Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // * Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // * Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    // * Form handling
    const contactForm = document.querySelector('#contactForm');
    
    if (contactForm) {
        // * Ctrl+Enter functionality for message textarea
        const messageTextarea = document.querySelector('#message');
        if (messageTextarea) {
            messageTextarea.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    contactForm.dispatchEvent(new Event('submit'));
                }
            });
        }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Get submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Use a simple approach that works without CORS issues
            // Create a hidden iframe to submit the form
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'form-submit-iframe';
            document.body.appendChild(iframe);
            
            // Create a temporary form that submits to the iframe
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = 'https://api.web3forms.com/submit';
            tempForm.target = 'form-submit-iframe';
            
            // Add all form data
            for (let [key, value] of formData.entries()) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                tempForm.appendChild(input);
            }
            
            // Add form to DOM, submit, and clean up
            document.body.appendChild(tempForm);
            tempForm.submit();
            
            // Remove the temporary form and iframe after submission
            setTimeout(() => {
                document.body.removeChild(tempForm);
                document.body.removeChild(iframe);
                
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // * Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.story-card, .service-card, .value-card, .goal-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // * Floating particles animation enhancement
    createFloatingParticles();

    // * Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// * Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;

    // Create additional floating particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random positioning
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 4 + 4;
        const delay = Math.random() * 2;
        
        Object.assign(particle.style, {
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #f97316)',
            borderRadius: '50%',
            opacity: '0.6',
            filter: 'blur(1px)',
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`
        });
        
        particleContainer.appendChild(particle);
    }
}

// * Add CSS for animations
const animationStyles = `
.story-card,
.service-card,
.value-card,
.goal-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.story-card.animate-in,
.service-card.animate-in,
.value-card.animate-in,
.goal-item.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.nav-link.active {
    color: var(--text-white);
}

.nav-link.active:after {
    width: 100%;
}

.navbar.scrolled {
    background: rgba(15, 16, 32, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* Mobile menu styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        right: -100%;
        width: 300px;
        height: calc(100vh - 70px);
        background: rgba(15, 16, 32, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 2rem 0;
        transition: right 0.3s ease;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-menu.active {
        right: 0;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
}

/* Stagger animation delays for cards */
.story-card:nth-child(1) { transition-delay: 0.1s; }
.story-card:nth-child(2) { transition-delay: 0.2s; }
.story-card:nth-child(3) { transition-delay: 0.3s; }

.service-card:nth-child(1) { transition-delay: 0.1s; }
.service-card:nth-child(2) { transition-delay: 0.2s; }
.service-card:nth-child(3) { transition-delay: 0.3s; }
.service-card:nth-child(4) { transition-delay: 0.4s; }
.service-card:nth-child(5) { transition-delay: 0.5s; }
.service-card:nth-child(6) { transition-delay: 0.6s; }

.value-card:nth-child(1) { transition-delay: 0.1s; }
.value-card:nth-child(2) { transition-delay: 0.2s; }
.value-card:nth-child(3) { transition-delay: 0.3s; }
.value-card:nth-child(4) { transition-delay: 0.4s; }
`;

// Add the animation styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// * Performance optimization: Throttle scroll events
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
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // highlight function scoped inside DOMContentLoaded; no-op here
}, 100));
