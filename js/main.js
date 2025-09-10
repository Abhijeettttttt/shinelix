// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeScrollEffects();
    initializeAnimations();
    checkForMobileDevice();
});

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change hamburger icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            showSearchModal();
        });
    }
}

// Function to show search modal
function showSearchModal() {
    // Create search modal if it doesn't exist
    let searchModal = document.getElementById('search-modal');
    
    if (!searchModal) {
        searchModal = document.createElement('div');
        searchModal.id = 'search-modal';
        searchModal.className = 'modal';
        searchModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeSearchModal()">&times;</span>
                <div class="modal-body">
                    <h2>Search Products</h2>
                    <div class="search-form">
                        <input type="text" id="search-input" placeholder="Search for jewelry..." autofocus>
                        <button onclick="performSearch()">Search</button>
                    </div>
                    <div id="search-results"></div>
                </div>
            </div>
        `;
        document.body.appendChild(searchModal);
        
        // Add search input event listener
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    performSearch();
                } else {
                    // Perform live search after 300ms delay
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(performSearch, 300);
                }
            });
        }
    }
    
    searchModal.style.display = 'block';
    
    // Focus on search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.focus();
    }
}

// Function to close search modal
function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.style.display = 'none';
    }
}

// Function to perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    // Search through products
    const results = window.products ? window.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ) : [];
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No products found matching your search.</p>';
        return;
    }
    
    // Display search results
    let resultsHTML = '<h3>Search Results:</h3><div class="search-results-grid">';
    results.forEach(product => {
        resultsHTML += `
            <div class="search-result-item" onclick="selectSearchResult(${product.id})">
                <div class="result-image">
                    <i class="fas fa-gem"></i>
                </div>
                <div class="result-info">
                    <h4>${product.name}</h4>
                    <p>$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
    resultsHTML += '</div>';
    
    searchResults.innerHTML = resultsHTML;
}

// Function to select search result
function selectSearchResult(productId) {
    closeSearchModal();
    
    // If we're on the products page, highlight the product
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productCard.style.animation = 'highlight 2s ease-in-out';
        setTimeout(() => {
            productCard.style.animation = '';
        }, 2000);
    } else {
        // If not on products page, open product modal
        if (window.openProductModal) {
            window.openProductModal(productId);
        }
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations
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
    const animateElements = document.querySelectorAll('.category-card, .product-card, .value-card, .team-member');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Mobile device detection
function checkForMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Add touch-friendly improvements
        const buttons = document.querySelectorAll('button, .btn, .cta-btn');
        buttons.forEach(button => {
            button.style.minHeight = '44px'; // iOS accessibility guideline
        });
    }
}

// Utility functions
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

// Lazy loading for images (if any are added later)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance logging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
}

// Global error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    // In production, you might want to send this to an error tracking service
});

// Add CSS for search modal and animations
const additionalStyles = `
    .search-results-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 1rem;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .search-result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .search-result-item:hover {
        background: #f8f9fa;
    }
    
    .result-image {
        width: 50px;
        height: 50px;
        background: #f0f0f0;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .result-image i {
        color: #d4af37;
        font-size: 1.5rem;
    }
    
    .result-info h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
    }
    
    .result-info p {
        margin: 0;
        color: #d4af37;
        font-weight: 600;
    }
    
    .search-form {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .search-form input {
        flex: 1;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .search-form button {
        background: #d4af37;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
    }
    
    @keyframes highlight {
        0%, 100% { background: transparent; }
        50% { background: rgba(212, 175, 55, 0.2); }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.closeSearchModal = closeSearchModal;
window.selectSearchResult = selectSearchResult;
