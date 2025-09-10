// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFormValidation();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in a real app, this would send to a server)
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showFormMessage('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
        
        // Reset form
        form.reset();
        
        // In a real application, you would:
        // 1. Send the form data to your server
        // 2. Handle server response
        // 3. Show appropriate success/error messages
        // 4. Possibly redirect or update the page
        
    }, 2000); // Simulate 2-second delay
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous error messages
    clearFormErrors(form);
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            // Additional validation based on field type
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[-\s\(\)]/g, ''));
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// Clear form errors
function clearFormErrors(form) {
    // Remove error classes
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(message => message.remove());
}

// Show form message
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert message at the top of the form
    const form = document.getElementById('contact-form');
    if (form) {
        form.insertBefore(messageElement, form.firstChild);
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }
}

// Initialize form validation with real-time feedback
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on focus
        input.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorMessage = this.parentNode.querySelector('.field-error');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
        
        // Special handling for email field
        if (input.type === 'email') {
            input.addEventListener('input', debounce(function() {
                if (this.value && !isValidEmail(this.value)) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            }, 500));
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    // Clear existing errors
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Validate email
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Validate phone
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

// Character counter for textarea
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #666;
            margin-top: 0.5rem;
        `;
        
        messageField.parentNode.insertBefore(counter, messageField.nextSibling);
        
        // Update counter
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 100) {
                counter.style.color = '#d4af37';
            } else if (remaining < 50) {
                counter.style.color = '#ff4757';
            } else {
                counter.style.color = '#666';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }
}

// Auto-save form data to localStorage
function initializeAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const formId = 'contact-form-data';
    
    // Load saved data
    const savedData = localStorage.getItem(formId);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'submit') {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.warn('Could not load saved form data');
        }
    }
    
    // Save data on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            localStorage.setItem(formId, JSON.stringify(data));
        }, 1000));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem(formId);
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCounter();
    initializeAutoSave();
});

// Utility function for debouncing (reused from main.js)
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Add CSS for form validation styles
const formStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ff4757;
        box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2);
    }
    
    .field-error {
        color: #ff4757;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
        font-size: 0.9rem;
    }
    
    .form-message {
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
    }
    
    .form-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .form-message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .form-message i {
        font-size: 1.2rem;
    }
    
    .character-counter {
        transition: color 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .form-message {
            font-size: 0.9rem;
            padding: 0.8rem;
        }
    }
`;

// Add the styles to the document
const contactStyleSheet = document.createElement('style');
contactStyleSheet.textContent = formStyles;
document.head.appendChild(contactStyleSheet);
