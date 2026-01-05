// Global variables
let currentLanguage = 'tr';
let translations = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Mark that JavaScript has loaded
    document.body.classList.add('js-loaded');
    
    // CRITICAL: Ensure content is visible immediately
    showAllContent();
    
    initializeApp();
    setupEventListeners();
    setupScrollAnimations();
    setupSmoothScrolling();
});

// Backup: Also try on window load in case DOMContentLoaded fails
window.addEventListener('load', function() {
    // Mark that JavaScript has loaded (backup)
    document.body.classList.add('js-loaded');
    
    // Double-check content visibility
    if (document.querySelectorAll('.hidden-fade-in').length > 0) {
        showAllContent();
    }
});

// Initialize application
function initializeApp() {
    // Check for saved language preference, default to Turkish
    const savedLanguage = localStorage.getItem('preferred-language') || 'tr';
    
    // Set default dark theme
    document.body.setAttribute('data-theme', 'dark');
    
    // CRITICAL FIX: Make content visible immediately
    showAllContent();
    
    // Load language (always load, default to Turkish)
    currentLanguage = savedLanguage;
    loadLanguage(savedLanguage);
    updateLanguageButtons(savedLanguage);
}

// CRITICAL FIX: Function to make all content visible immediately
function showAllContent() {
    // Remove hidden-fade-in class from all elements and add fade-in
    document.querySelectorAll('.hidden-fade-in').forEach(element => {
        element.classList.remove('hidden-fade-in');
        element.classList.add('fade-in');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Language switch buttons (navbar)
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            selectLanguage(selectedLang);
            updateLanguageButtons(selectedLang);
        });
    });
    
    // Email functionality
    setupEmailFunctionality();
    setupContactEmailFunctionality();
}

// Language functions
function selectLanguage(lang) {
    console.log('Selecting language:', lang); // Debug log
    currentLanguage = lang;
    localStorage.setItem('preferred-language', lang);
    loadLanguage(lang);
    updateLanguageButtons(lang);
}

function updateLanguageButtons(activeLang) {
    console.log('Updating language buttons, active:', activeLang); // Debug log
    // Update navbar language buttons
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        btn.classList.remove('active'); // Remove active from all first
        if (btnLang === activeLang) {
            btn.classList.add('active');
        }
    });
}

async function loadLanguage(lang) {
    console.log('Loading language:', lang); // Debug log
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${response.status}`);
        }
        
        translations = await response.json();
        console.log('Translations loaded:', translations); // Debug log
        updatePageContent();
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Ensure content is visible after loading
        showAllContent();
        
    } catch (error) {
        console.error('Error loading language:', error);
        
        // CRITICAL: Fallback - show content even if language loading fails
        showAllContent();
        
        // Try to load Turkish if English fails, but don't create infinite loop
        if (lang !== 'tr') {
            console.log('Falling back to Turkish');
            loadLanguage('tr');
        } else {
            // If Turkish also fails, use hardcoded fallback
            console.warn('Using fallback content - language files not available');
            // Content will still be visible due to showAllContent()
        }
    }
}

function updatePageContent() {
    // Update all elements with data-i18n-key attribute
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        const translation = getNestedTranslation(translations, key);
        
        if (translation) {
            // Check if element contains HTML (like links or formatting)
            if (translation.includes('<')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
}



// Scroll animations using Intersection Observer
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only add fade-in if not already visible
                if (!entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in');
                }
                entry.target.classList.remove('hidden-fade-in');
            }
        });
    }, observerOptions);
    
    // Only observe elements that are still hidden (not already made visible)
    document.querySelectorAll('.hidden-fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.9)';
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('.project-link');
            if (link) {
                // You can add actual project links here
                console.log('Project clicked:', this.querySelector('h3').textContent);
            }
        });
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add some particle effects (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--primary-neon);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.5;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        hero.appendChild(particle);
    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    .particle {
        animation: float 3s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Initialize particles after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createParticles, 1000);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.9)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Email functionality
function setupEmailFunctionality() {
    const emailBtn = document.getElementById('email-btn');
    const emailTooltip = document.getElementById('email-tooltip');
    const copyBtn = document.getElementById('copy-email');
    const emailText = document.getElementById('email-text');
    
    let tooltipTimeout;
    
    // Show/hide email tooltip
    emailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (emailTooltip.classList.contains('show')) {
            hideEmailTooltip();
        } else {
            showEmailTooltip();
        }
    });
    
    // Copy email to clipboard
    copyBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        
        try {
            await navigator.clipboard.writeText('nihattekiner@gmail.com');
            
            // Visual feedback
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.classList.add('copied');
            
            setTimeout(() => {
                this.innerHTML = originalIcon;
                this.classList.remove('copied');
            }, 2000);
            
            // Show success message
            window.showCopySuccess();
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = 'nihattekiner@gmail.com';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            window.showCopySuccess();
        }
    });
    
    // Hide tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (!emailBtn.contains(e.target) && !emailTooltip.contains(e.target)) {
            hideEmailTooltip();
        }
    });
    
    function showEmailTooltip() {
        emailTooltip.classList.add('show');
        clearTimeout(tooltipTimeout);
        
        // Auto-hide after 5 seconds
        tooltipTimeout = setTimeout(() => {
            hideEmailTooltip();
        }, 5000);
    }
    
    function hideEmailTooltip() {
        emailTooltip.classList.remove('show');
        clearTimeout(tooltipTimeout);
    }
}
}

// Contact email functionality
function setupContactEmailFunctionality() {
    const contactEmailBtn = document.getElementById('contact-email-btn');
    
    if (contactEmailBtn) {
        contactEmailBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                await navigator.clipboard.writeText('nihattekiner@gmail.com');
                window.showCopySuccess();
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = 'nihattekiner@gmail.com';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                window.showCopySuccess();
            }
        });
    }
}

// Add CSS animations for success message
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Global function for showCopySuccess to be used by both email functions
window.showCopySuccess = function() {
    // Create temporary success message
    const successMsg = document.createElement('div');
    const message = currentLanguage === 'en' ? 'Email copied!' : 'Email kopyalandı!';
    successMsg.textContent = message;
    successMsg.className = 'toast-notification';
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 300);
    }, 2000);
};