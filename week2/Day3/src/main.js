/**
 * Cart Management System
 */
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.badge = document.getElementById('cart-badge');
        this.modal = document.getElementById('cart-modal');
        this.itemsContainer = document.getElementById('cart-items-list');
        this.totalDisplay = document.getElementById('cart-total-amount');
        this.modalContent = this.modal.querySelector('.active-modal');
        
        this.init();
        this.updateUI();
    }

    init() {
        document.getElementById('cart-btn').addEventListener('click', () => this.toggleModal(true));
        document.getElementById('close-cart').addEventListener('click', () => this.toggleModal(false));
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.toggleModal(false);
        });
    }

    toggleModal(show) {
        if (show) {
            this.modal.classList.add('active');
            // Small delay to trigger animation
            requestAnimationFrame(() => {
                this.modalContent.classList.remove('scale-95', 'opacity-0');
                this.modalContent.classList.add('scale-100', 'opacity-100');
            });
            document.body.style.overflow = 'hidden';
            this.renderItems();
        } else {
            this.modalContent.classList.remove('scale-100', 'opacity-100');
            this.modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                this.modal.classList.remove('active');
            }, 300);
            document.body.style.overflow = 'auto';
        }
    }

    addItem(id) {
        const product = allProducts.find(p => p.id === id);
        if (!product) return;

        const existing = this.items.find(item => item.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.save();
        this.updateUI();
        this.playBadgeAnimation();
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.items = this.items.filter(i => i.id !== productId);
            }
            this.save();
            this.updateUI();
            this.renderItems();
        }
    }

    updateUI() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.badge.textContent = count;
        this.totalDisplay.textContent = `GBP ${total.toFixed(2)}`;
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    playBadgeAnimation() {
        this.badge.classList.remove('animate-badge');
        void this.badge.offsetWidth; // trigger reflow
        this.badge.classList.add('animate-badge');
    }

    renderItems() {
        this.itemsContainer.innerHTML = this.items.length ? this.items.map(item => `
            <div class="flex items-center gap-6 py-6 group border-b border-gray-50 last:border-0">
                <div class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <h4 class="font-black italic text-xl mb-1">${item.name}</h4>
                    <p class="text-text-muted font-medium mb-3">${item.category}</p>
                    <div class="flex items-center gap-4">
                        <div class="flex bg-gray-100 rounded-full p-1 items-center shadow-inner">
                            <button onclick="cart.updateQuantity(${item.id}, -1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all text-xl font-bold">-</button>
                            <span class="w-8 text-center font-black">${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, 1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all text-xl font-bold">+</button>
                        </div>
                        <span class="font-black italic text-lg text-primary-orange">GBP ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="cart.removeItem(${item.id})" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all text-2xl">×</button>
            </div>
        `).join('') : '<div class="text-center py-20"><p class="text-2xl font-bold text-gray-300 italic">Your cart is empty</p></div>';
    }
}

/**
 * Global State and App Initialization
 */
let cart;
let allProducts = [];
let reviews = [];
let currentReviewIndex = 0;

async function initApp() {
    try {
        const response = await fetch('./src/data.json');
        const data = await response.json();
        
        allProducts = data.products;
        reviews = data.reviews;
        cart = new Cart();
        window.cart = cart;

        // Render all categories by default on the same page
        renderFullMenu(data.categories);
        renderReviews();
        renderSimilarRestaurants(data.similar_restaurants);
        initCategoryNavigation();
    } catch (error) {
        console.error('Failed to load menu data:', error);
    }
}

/**
 * Menu Rendering Logic (Show All Categories)
 */
function renderFullMenu(categories) {
    const container = document.getElementById('menu-container');
    container.innerHTML = categories.map(cat => {
        const products = allProducts.filter(p => p.category === cat);
        if (products.length === 0) return '';

        return `
            <div id="cat-${cat.replace(/\s+/g, '-').toLowerCase()}" class="category-section mb-20 scroll-mt-60">
                <h3 class="text-4xl font-extrabold italic mb-10 pb-4 border-b-2 border-gray-50 flex justify-between items-center">
                    ${cat}
                    <span class="text-xs uppercase tracking-widest text-text-muted opacity-50">${products.length} Items</span>
                </h3>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${products.map(p => `
                        <div class="bg-white rounded-[32px] p-6 shadow-premium transition-all flex justify-between gap-6 group border-2 border-primary-orange/10">
                            <div class="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <h4 class="text-xl font-black italic mb-3 leading-tight">${p.name}</h4>
                                    <p class="text-sm text-text-muted font-medium mb-4 line-clamp-3 leading-relaxed">${p.description}</p>
                                </div>
                                <p class="text-2xl font-black italic">GBP ${p.price.toFixed(2)}</p>
                            </div>
                            <div class="relative w-44 h-44 shrink-0">
                                <img src="${p.image}" class="    w-full h-full object-cover rounded-3xl shadow-md">
                                <button onclick="cart.addItem(${p.id})" class="absolute bottom-[-0px] right-[-0px] w-14 h-14 bg-white rounded-tl-[28px] rounded-br-[22px] flex items-center justify-center shadow-lg group/btn active:scale-90 transition-all border-l-4 border-t-4 border-white">
                                    <div class="w-10 h-10 bg-primary-black rounded-full flex items-center justify-center transition-colors">
                                        <img src="assets/add_to_cart.png" class="w-6 h-6">  
                                    </div>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function initCategoryNavigation() {
    const btns = document.querySelectorAll('.cat-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            
            // UI Feedback
            btns.forEach(b => {
                b.classList.remove('bg-dark-blue', 'text-white');
                b.classList.add('text-white', 'hover:bg-black/10');
            });
            btn.classList.add('bg-dark-blue', 'text-white');
            btn.classList.remove('hover:bg-black/10');

            // Scroll to section
            const sectionId = `cat-${cat.replace(/\s+/g, '-').toLowerCase()}`;
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Review Slider Fix
 */
function renderReviews() {
    const container = document.getElementById('reviews-slider');
    container.innerHTML = reviews.map(rev => `
        <div class="bg-white border-2 border-gray-50 p-10 rounded-[40px] shadow-soft min-w-[420px] shrink-0 transition-all hover:shadow-premium group">
            <div class="flex justify-between items-start mb-8">
                <div class="flex gap-4">
                    <img src="${rev.image}" class="w-16 h-16 rounded-full border-4 border-gray-50 object-cover shadow-sm">
                    <div class="border-l-2 border-primary-orange pl-4">
                        <h4 class="font-black italic text-xl leading-tight">${rev.user}</h4>
                        <p class="text-primary-orange text-sm font-bold uppercase tracking-wider">${rev.location}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <div class="flex gap-1 mb-2">
                        ${Array(5).fill(0).map((_, i) => `
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="${i < rev.rating ? '#FC8A06' : '#E2E8F0'}" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <p class="text-xs text-text-muted font-bold italic flex items-center gap-2">
                        <span class="w-2 h-2 bg-primary-orange rounded-full"></span> ${rev.date}
                    </p>
                </div>
            </div>
            <p class="text-lg leading-relaxed font-semibold text-dark-blue/80 line-clamp-4 group-hover:line-clamp-none transition-all">${rev.comment}</p>
        </div>
    `).join('');
    
    document.getElementById('next-review').onclick = () => moveSlider(1);
    document.getElementById('prev-review').onclick = () => moveSlider(-1);
    
    // Initial position
    updateSliderPosition();
}

function moveSlider(delta) {
    currentReviewIndex = (currentReviewIndex + delta + reviews.length) % reviews.length;
    updateSliderPosition();
}

function updateSliderPosition() {
    const slider = document.getElementById('reviews-slider');
    const firstCard = slider.children[0];
    if (!firstCard) return;
    
    // Calculate gap dynamically
    const gap = 32; // match gap-8
    const cardWidth = firstCard.offsetWidth + gap;
    
    slider.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
}

/**
 * Similar Restaurants
 */
function renderSimilarRestaurants(restaurants) {
    const container = document.getElementById('similar-grid');
    container.innerHTML = restaurants.map(rest => `
        <a href="#" class="shrink-0 flex flex-col items-center">
            <div class="w-56 h-56 rounded-[40px] p-10 flex items-center justify-center shadow-soft border border-gray-50" style="background: ${rest.bgColor}">
                <img src="${rest.image}" class="w-full h-full object-contain filter drop-shadow-sm">
            </div>
            <p class="text-center mt-6 font-black italic text-lg text-primary-orange">${rest.name}</p>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('resize', updateSliderPosition);
