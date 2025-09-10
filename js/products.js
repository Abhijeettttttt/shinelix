// Sample product data
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        category: "rings",
        price: 99999.00,
        description: "Elegant 1-carat diamond solitaire ring in 14k white gold. Perfect for engagements and special occasions.",
        image: "placeholder",
        featured: true,
        inStock: true
    },
    {
        id: 2,
        name: "Pearl Necklace Classic",
        category: "necklaces",
        price: 22999.00,
        description: "Timeless freshwater pearl necklace with sterling silver clasp. A classic piece for any jewelry collection.",
        image: "placeholder",
        featured: true,
        inStock: true
    },
    {
        id: 3,
        name: "Gold Hoop Earrings",
        category: "earrings",
        price: 14999.00,
        description: "14k gold hoop earrings with a brushed finish. Lightweight and perfect for everyday wear.",
        image: "placeholder",
        featured: true,
        inStock: true
    },
    {
        id: 4,
        name: "Tennis Bracelet",
        category: "bracelets",
        price: 69999.00,
        description: "Sparkling tennis bracelet with cubic zirconia stones in sterling silver setting.",
        image: "placeholder",
        featured: true,
        inStock: true
    },
    {
        id: 5,
        name: "Emerald Cocktail Ring",
        category: "rings",
        price: 175999.00,
        description: "Stunning 3-carat emerald cocktail ring surrounded by diamonds in 18k yellow gold.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 6,
        name: "Statement Necklace",
        category: "necklaces",
        price: 35999.00,
        description: "Bold statement necklace with mixed gemstones and gold-plated chain.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 7,
        name: "Diamond Stud Earrings",
        category: "earrings",
        price: 62999.00,
        description: "Classic diamond stud earrings, 0.5 carat each, in 14k white gold settings.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 8,
        name: "Charm Bracelet",
        category: "bracelets",
        price: 11999.00,
        description: "Sterling silver charm bracelet with heart charm. Add your own charms to personalize.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 9,
        name: "Sapphire Pendant",
        category: "necklaces",
        price: 52999.00,
        description: "Beautiful blue sapphire pendant with diamond accents on a delicate gold chain.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 10,
        name: "Wedding Band Set",
        category: "rings",
        price: 47999.00,
        description: "Matching wedding band set in 14k rose gold with subtle diamond details.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 11,
        name: "Vintage Brooch",
        category: "other",
        price: 15999.00,
        description: "Vintage-inspired brooch with intricate filigree work and pearl center.",
        image: "placeholder",
        featured: false,
        inStock: true
    },
    {
        id: 12,
        name: "Chain Bracelet",
        category: "bracelets",
        price: 18999.00,
        description: "Delicate chain bracelet in 14k gold with adjustable length closure.",
        image: "placeholder",
        featured: false,
        inStock: true
    }
];

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image" onclick="openProductModal(${product.id})">
                <i class="fas fa-gem"></i>
                <p>Product Image</p>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 80)}...</p>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Function to display products
function displayProducts(productsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

// Function to filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (!categoryFilter || !priceFilter || !sortFilter) return products;
    
    let filtered = products;
    
    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price
    const selectedPriceRange = priceFilter.value;
    if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        if (selectedPriceRange === '1000+') {
            filtered = filtered.filter(product => product.price >= 1000);
        } else {
            filtered = filtered.filter(product => product.price >= min && product.price <= max);
        }
    }
    
    // Sort products
    const sortBy = sortFilter.value;
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
    }
    
    return filtered;
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to get featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Function to open product modal
function openProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <i class="fas fa-gem"></i>
                <p>Product Image</p>
            </div>
            <div class="product-modal-info">
                <h2>${product.name}</h2>
                <div class="product-modal-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="product-modal-description">
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <p><strong>Availability:</strong> ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <div class="product-modal-actions">
                    <div class="quantity-selector">
                        <button onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="modal-quantity" value="1" min="1" max="10">
                        <button onclick="changeQuantity(1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCartFromModal(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Function to close product modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
}

// Function to change quantity in modal
function changeQuantity(change) {
    const quantityInput = document.getElementById('modal-quantity');
    if (!quantityInput) return;
    
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;
    
    if (currentQuantity < 1) currentQuantity = 1;
    if (currentQuantity > 10) currentQuantity = 10;
    
    quantityInput.value = currentQuantity;
}

// Function to add to cart from modal
function addToCartFromModal(productId) {
    const quantityInput = document.getElementById('modal-quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    addToCart(productId, quantity);
    closeProductModal();
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display featured products on home page
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        displayProducts(getFeaturedProducts(), 'featured-products');
    }
    
    // Display all products on products page
    const productsContainer = document.getElementById('products-grid');
    if (productsContainer) {
        displayProducts(products, 'products-grid');
        
        // Add event listeners for filters
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                displayProducts(filterProducts(), 'products-grid');
            });
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', function() {
                displayProducts(filterProducts(), 'products-grid');
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                displayProducts(filterProducts(), 'products-grid');
            });
        }
        
        // Check for category in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam && categoryFilter) {
            categoryFilter.value = categoryParam;
            displayProducts(filterProducts(), 'products-grid');
        }
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            closeProductModal();
        }
    });
});

// Export functions for use in other scripts
window.products = products;
window.getProductById = getProductById;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addToCartFromModal = addToCartFromModal;
window.changeQuantity = changeQuantity;
