/**
 * HH.RU Partner Program Landing Page
 * JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initAccordion();
    initTabs();
    initSmoothScroll();
    initFormValidation();
    initHeaderScroll();
});

/**
 * Accordion functionality
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion__item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        const content = item.querySelector('.accordion__content');
        
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('accordion__item--open');
            
            // Close all other items in the same accordion
            const accordion = item.closest('.accordion');
            accordion.querySelectorAll('.accordion__item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('accordion__item--open');
                    otherItem.querySelector('.accordion__content').classList.remove('accordion__content--visible');
                }
            });
            
            // Toggle current item
            item.classList.toggle('accordion__item--open');
            content.classList.toggle('accordion__content--visible');
        });
    });
}

/**
 * Registration form tabs
 */
function initTabs() {
    const tabs = document.querySelectorAll('.registration__tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('registration__tab--active'));
            
            // Add active class to clicked tab
            tab.classList.add('registration__tab--active');
            
            // Here you could switch form content based on tab
            const tabType = tab.dataset.tab;
            console.log('Selected tab:', tabType);
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Form validation
 */
function initFormValidation() {
    const form = document.querySelector('.registration__form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]');
            const phone = form.querySelector('input[type="tel"]');
            const passwords = form.querySelectorAll('input[type="password"]');
            
            let isValid = true;
            
            // Validate email
            if (!validateEmail(email.value)) {
                showError(email, 'Введите корректный email');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Validate phone
            if (phone.value.length < 10) {
                showError(phone, 'Введите корректный номер телефона');
                isValid = false;
            } else {
                clearError(phone);
            }
            
            // Validate passwords
            if (passwords[0].value.length < 6) {
                showError(passwords[0], 'Пароль должен быть не менее 6 символов');
                isValid = false;
            } else {
                clearError(passwords[0]);
            }
            
            if (passwords[0].value !== passwords[1].value) {
                showError(passwords[1], 'Пароли не совпадают');
                isValid = false;
            } else {
                clearError(passwords[1]);
            }
            
            if (isValid) {
                // Update progress bar
                const progressFill = document.querySelector('.progress-bar__fill');
                progressFill.style.width = '66%';
                
                // Here you would typically submit the form
                console.log('Form is valid, ready to submit');
                
                // Show success message
                showNotification('Данные успешно отправлены!', 'success');
            }
        });
        
        // Real-time validation
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            input.addEventListener('input', () => {
                clearError(input);
            });
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateField(input) {
    const type = input.type;
    const value = input.value;
    
    if (type === 'email' && value && !validateEmail(value)) {
        showError(input, 'Введите корректный email');
    }
    
    if (type === 'tel' && value && value.length < 10) {
        showError(input, 'Введите корректный номер телефона');
    }
    
    if (type === 'password' && value && value.length < 6) {
        showError(input, 'Пароль должен быть не менее 6 символов');
    }
}

function showError(input, message) {
    const group = input.closest('.form-group');
    
    // Remove existing error
    const existingError = group.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling and message
    input.style.borderColor = '#D6001C';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #D6001C; font-size: 12px; margin-top: 4px;';
    group.appendChild(errorDiv);
}

function clearError(input) {
    const group = input.closest('.form-group');
    
    input.style.borderColor = '';
    
    const existingError = group.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#21A038' : '#0057FF'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '';
        }
        
        lastScroll = currentScroll;
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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
document.head.appendChild(style);
