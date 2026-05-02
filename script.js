// ===== MENU DATA =====
const menuItems = [
    {
        id: 1, name: "Butter Chicken", price: 320,
        desc: "Tender chicken simmered in rich, creamy tomato-butter sauce with aromatic spices.",
        image: "butter-chicken.png", category: "mains", badge: "Bestseller"
    },
    {
        id: 2, name: "Hyderabadi Biryani", price: 280,
        desc: "Fragrant basmati rice layered with spiced meat, saffron, and caramelized onions.",
        image: "biryani.png", category: "mains", badge: "Chef's Pick"
    },
    {
        id: 3, name: "Paneer Tikka", price: 220,
        desc: "Chargrilled cottage cheese cubes marinated in tandoori spices with bell peppers.",
        image: "paneer-tikka.png", category: "starters", badge: "Veg"
    },
    {
        id: 4, name: "Masala Dosa", price: 150,
        desc: "Crispy golden crepe stuffed with spiced potato filling, served with sambar & chutney.",
        image: "masala-dosa.png", category: "mains", badge: "South Indian"
    },
    {
        id: 5, name: "Gulab Jamun", price: 120,
        desc: "Golden fried milk dumplings soaked in rose-flavored sugar syrup with pistachios.",
        image: "gulab-jamun.png", category: "desserts", badge: "Sweet"
    },
    {
        id: 6, name: "Garlic Naan", price: 60,
        desc: "Soft, fluffy bread baked in tandoor oven with garlic butter and fresh coriander.",
        image: "butter-chicken.png", category: "breads", badge: ""
    },
    {
        id: 7, name: "Chicken Tikka", price: 260,
        desc: "Juicy chicken pieces marinated in yogurt and spices, grilled to perfection.",
        image: "paneer-tikka.png", category: "starters", badge: "Popular"
    },
    {
        id: 8, name: "Mango Lassi", price: 90,
        desc: "Creamy yogurt-based mango drink blended with cardamom and saffron.",
        image: "gulab-jamun.png", category: "beverages", badge: "Refreshing"
    },
    {
        id: 9, name: "Dal Makhani", price: 200,
        desc: "Black lentils slow-cooked overnight with cream, butter, and secret spices.",
        image: "biryani.png", category: "mains", badge: "Veg"
    }
];

// ===== DEFAULT REVIEWS =====
const defaultReviews = [
    {
        name: "Priya Sharma", rating: 5,
        text: "The butter chicken here is absolutely divine! Best I've had outside of a home kitchen. The flavors are rich, authentic, and every bite is heavenly.",
        date: "2 weeks ago"
    },
    {
        name: "Rahul Verma", rating: 5,
        text: "Zaika Cafe has become our family's favorite weekend spot. The biryani is fragrant and perfectly spiced. Excellent service and warm ambiance!",
        date: "1 month ago"
    },
    {
        name: "Anita Desai", rating: 4,
        text: "Wonderful vegetarian options! The paneer tikka and masala dosa are outstanding. Love the cozy atmosphere and the friendly staff.",
        date: "3 weeks ago"
    },
    {
        name: "Mohammed Ali", rating: 5,
        text: "The gulab jamun melts in your mouth — absolutely the best dessert I've tried. The whole dining experience is top-notch, will definitely come again!",
        date: "1 week ago"
    }
];

// ===== STATE =====
let cart = [];
let currentReviewIndex = 0;
let selectedRating = 0;
let allReviews = [...defaultReviews];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    renderMenu('all');
    renderReviews();
    setupNavigation();
    setupFilters();
    setupStarRating();
    setupForms();
    setupScrollAnimations();
    animateStats();
});

// ===== MENU RENDERING =====
function renderMenu(filter) {
    const grid = document.getElementById('menuGrid');
    const items = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);

    grid.innerHTML = items.map(item => `
        <div class="menu-card animate-on-scroll visible" data-category="${item.category}">
            <div class="menu-card-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}
            </div>
            <div class="menu-card-body">
                <h3 class="menu-card-title">${item.name}</h3>
                <p class="menu-card-desc">${item.desc}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">₹${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})" aria-label="Add ${item.name} to cart">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== FILTERS =====
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(btn.dataset.filter);
        });
    });
}

// ===== CART =====
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    showToast(`${item.name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <span>🍽️</span>
                <p>Your cart is empty</p>
                <a href="#menu" onclick="closeCart()" class="btn btn-secondary">Browse Menu</a>
            </div>`;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price * item.qty}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
        cartTotal.textContent = `₹${totalPrice}`;
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function placeOrder() {
    if (cart.length === 0) return;

    const orderData = {
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: cart.reduce((s, c) => s + c.price * c.qty, 0),
        date: new Date().toISOString()
    };

    // Try backend first, fallback to localStorage
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => {
        showToast(`Order placed successfully! Order #${data.id}`, 'success');
    })
    .catch(() => {
        // Fallback: save to localStorage
        const orders = JSON.parse(localStorage.getItem('zaika_orders') || '[]');
        orderData.id = orders.length + 1;
        orders.push(orderData);
        localStorage.setItem('zaika_orders', JSON.stringify(orders));
        showToast(`Order placed successfully! Order #${orderData.id}`, 'success');
    });

    cart = [];
    updateCartUI();
    closeCart();
}

// ===== REVIEWS =====
function renderReviews() {
    const track = document.getElementById('reviewsTrack');
    track.innerHTML = allReviews.map(r => `
        <div class="review-card">
            <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <p class="review-text">"${r.text}"</p>
            <p class="review-author">${r.name}</p>
            <p class="review-date">${r.date}</p>
        </div>
    `).join('');

    currentReviewIndex = 0;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('reviewsTrack');
    track.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
}

document.getElementById('prevReview').addEventListener('click', () => {
    currentReviewIndex = currentReviewIndex > 0 ? currentReviewIndex - 1 : allReviews.length - 1;
    updateCarousel();
});

document.getElementById('nextReview').addEventListener('click', () => {
    currentReviewIndex = currentReviewIndex < allReviews.length - 1 ? currentReviewIndex + 1 : 0;
    updateCarousel();
});

// Auto-rotate reviews
setInterval(() => {
    currentReviewIndex = (currentReviewIndex + 1) % allReviews.length;
    updateCarousel();
}, 6000);

// ===== STAR RATING =====
function setupStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.dataset.value) <= selectedRating);
            });
        });
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.style.color = parseInt(s.dataset.value) <= val ? '#FFD700' : '';
            });
        });
    });
    document.getElementById('starRating').addEventListener('mouseleave', () => {
        const stars = document.querySelectorAll('#starRating .star');
        stars.forEach(s => {
            s.style.color = s.classList.contains('selected') ? '#FFD700' : '';
        });
    });
}

// ===== FORMS =====
function setupForms() {
    // Review form
    document.getElementById('reviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewerName').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        if (!name || !text || !selectedRating) {
            showToast('Please fill all fields and select a rating.', 'error');
            return;
        }

        const review = { name, text, rating: selectedRating, date: 'Just now' };

        // Try backend, fallback to local
        fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        }).catch(() => {});

        allReviews.unshift(review);
        renderReviews();
        showToast('Thank you for your review! 🎉', 'success');

        document.getElementById('reviewForm').reset();
        document.querySelectorAll('#starRating .star').forEach(s => s.classList.remove('selected'));
        selectedRating = 0;
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent! We\'ll get back to you soon. 📧', 'success');
        e.target.reset();
    });

    // Newsletter form
    document.getElementById('newsletterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Subscribed! Watch your inbox for exclusive deals. 🎉', 'success');
        e.target.reset();
    });
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) current = section.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ===== STAT COUNTER ANIMATION =====
function animateStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nums = entry.target.querySelectorAll('.stat-number');
                nums.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    let current = 0;
                    const increment = target / 60;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            num.textContent = target;
                            clearInterval(timer);
                        } else {
                            num.textContent = Math.ceil(current);
                        }
                    }, 25);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

