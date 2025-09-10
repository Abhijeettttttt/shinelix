// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('shinelix-cart')) || [];

// Function to add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartDisplay();
    updateCartCount();
    showCartNotification(product.name);
}

// Function to remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Function to update item quantity in cart
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Function to clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('shinelix-cart', JSON.stringify(cart));
}

// Function to get cart total
function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Function to get cart item count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const count = getCartItemCount();
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; color: #666;">Add some beautiful jewelry to get started!</p>
            </div>
        `;
        cartTotalElement.textContent = '₹0';
        return;
    }
    
    let cartHTML = '';
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            cartHTML += `
                <div class="cart-item" data-product-id="${product.id}">
                    <div class="cart-item-image">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <div class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</div>
                        <div class="quantity-controls">
                            <button onclick="updateCartQuantity(${product.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartQuantity(${product.id}, ${item.quantity + 1})">+</button>
                            <button class="remove-item" onclick="removeFromCart(${product.id})" title="Remove item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = '₹' + getCartTotal().toLocaleString('en-IN');
}

// Function to toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
        
        // Add/remove body scroll lock
        if (cartSidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Function to show cart notification
function showCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} added to cart!</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // In a real application, this would redirect to a payment processor
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    
    const confirmed = confirm(
        `Ready to checkout?\n\n` +
        `Items: ${itemCount}\n` +
        `Total: $${total.toFixed(2)}\n\n` +
        `This is a demo - no actual payment will be processed.`
    );
    
    if (confirmed) {
        // Simulate order processing
        alert('Order placed successfully! Thank you for your purchase.');
        clearCart();
        toggleCart();
        
        // In a real application, you would:
        // 1. Send order data to server
        // 2. Process payment
        // 3. Send confirmation email
        // 4. Redirect to order confirmation page
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateCartCount();
    
    // Add event listener to checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target)) {
                toggleCart();
            }
        }
    });
    
    // Handle escape key to close cart
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar && cartSidebar.classList.contains('open')) {
                toggleCart();
            }
        }
    });
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.toggleCart = toggleCart;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
