// =============================================
// JELLYFISH BACKGROUND ANIMATION
// =============================================
(function () {
    const canvas = document.getElementById('jellyfish-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS = [
        { r: 255, g: 0,   b: 127 },  // neon pink
        { r: 157, g: 0,   b: 255 },  // neon purple
        { r: 0,   g: 240, b: 255 },  // neon blue
    ];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Jellyfish {
        constructor(spreadY) {
            this._init(spreadY);
        }

        _init(spreadY) {
            this.size   = 9 + Math.random() * 18;          // small – 9 to 27px bell radius
            this.col    = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha  = 0.06 + Math.random() * 0.10;     // very subtle
            this.speed  = 0.22 + Math.random() * 0.38;     // slow drift upward
            this.startX = Math.random() * canvas.width;
            this.x      = this.startX;
            this.y      = spreadY !== undefined ? spreadY : canvas.height + this.size * 4;

            // Horizontal sine drift
            this.driftAmp   = 12 + Math.random() * 18;
            this.driftFreq  = 0.0025 + Math.random() * 0.003;
            this.driftPhase = Math.random() * Math.PI * 2;

            // Bell pulse
            this.pulse      = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.022 + Math.random() * 0.018;

            this.time = 0;

            // Pre-generate tentacles (avoids per-frame randomness / flicker)
            const count = 5 + Math.floor(Math.random() * 5);
            this.tentacles = Array.from({ length: count }, (_, i) => ({
                xOff   : -this.size * 0.85 + (this.size * 1.7 / Math.max(count - 1, 1)) * i,
                len    : this.size * (0.9 + Math.random() * 0.9),
                amp    : 2.5 + Math.random() * 4,
                phase  : Math.random() * Math.PI * 2,
                width  : 0.5 + Math.random() * 0.8,
            }));
        }

        update() {
            this.time  += 1;
            this.y     -= this.speed;
            this.pulse += this.pulseSpeed;
            this.x      = this.startX + Math.sin(this.time * this.driftFreq + this.driftPhase) * this.driftAmp;

            if (this.y < -this.size * 5) {
                this._init();   // respawn at bottom
            }
        }

        draw() {
            const { r, g, b } = this.col;
            const a  = this.alpha;
            const pf = 1 + Math.sin(this.pulse) * 0.09;    // pulse factor
            const bw = this.size * pf;                      // bell width
            const bh = this.size * 0.55;                    // bell height

            ctx.save();
            ctx.translate(this.x, this.y);

            // -- Outer glow halo --
            ctx.beginPath();
            ctx.ellipse(0, 0, bw * 1.45, bh * 1.45, 0, Math.PI, 0);
            ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.12})`;
            ctx.fill();

            // -- Bell body (radial gradient) --
            ctx.beginPath();
            ctx.ellipse(0, 0, bw, bh, 0, Math.PI, 0);
            const grad = ctx.createRadialGradient(0, -bh * 0.25, 0, 0, 0, bw);
            grad.addColorStop(0,   `rgba(${r},${g},${b},${a * 2.0})`);
            grad.addColorStop(0.55,`rgba(${r},${g},${b},${a * 1.0})`);
            grad.addColorStop(1,   `rgba(${r},${g},${b},${a * 0.1})`);
            ctx.fillStyle = grad;
            ctx.fill();

            // -- Inner dome highlight (white shimmer) --
            ctx.beginPath();
            ctx.ellipse(0, -bh * 0.08, bw * 0.48, bh * 0.30, 0, Math.PI, 0);
            ctx.fillStyle = `rgba(255,255,255,${a * 0.28})`;
            ctx.fill();

            // -- Tentacles --
            this.tentacles.forEach(t => {
                const wave = Math.sin(this.pulse * 1.4 + t.phase) * t.amp;
                ctx.beginPath();
                ctx.moveTo(t.xOff, 0);
                ctx.bezierCurveTo(
                    t.xOff + wave * 0.4, t.len * 0.33,
                    t.xOff + wave * 0.85, t.len * 0.66,
                    t.xOff + wave * 1.15, t.len
                );
                ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.75})`;
                ctx.lineWidth   = t.width;
                ctx.stroke();
            });

            ctx.restore();
        }
    }

    // Spawn ~28 jellyfish, spread randomly across full page height on load
    const jellies = Array.from({ length: 28 }, () =>
        new Jellyfish(Math.random() * (canvas.height + 200))
    );

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        jellies.forEach(j => { j.update(); j.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();

// --- COMPLETE MENU DATA ---
const menuData = {
    frutas: [
        { name: 'Fresas con Crema', hasSizes: true },
        { name: 'Uvas con Crema', hasSizes: true },
        { name: 'Duraznos con Crema', hasSizes: true }
    ],
    especiales: [
        { name: 'Flan', price: 40, hasSizes: false },
        { name: 'Flan de Chocolate', price: 40, hasSizes: false }
    ],
    snacks: [
        { name: 'Alitas', price: 70, hasSizes: false, hasFlavors: true },
        { name: 'Alitas con Papas', price: 90, hasSizes: false, hasFlavors: true },
        { name: 'Salchipulpos', price: 40, hasSizes: false },
        { name: 'Plátanos Macho', price: 35, hasSizes: false },
        { name: 'Salchipapas', price: 50, hasSizes: false },
        { name: 'Papas Fritas', price: 35, hasSizes: false },
        { name: 'Banderilla', price: 25, hasSizes: false },
        { name: 'Banderilla Mixta', price: 30, hasSizes: false },
        { name: 'Banderilla de Queso', price: 35, hasSizes: false }
    ]
};

const WA_NUMBER = "525642831842";

// --- Carousel Logic ---
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const dots = Array.from(document.querySelectorAll('.bullet'));
let currentSlideIndex = 0;

function updateSlide(targetIndex) {
    if (!slides[targetIndex]) return;
    slides.forEach(s => s.classList.remove('current-slide'));
    dots.forEach(d => d.classList.remove('active'));
    slides[targetIndex].classList.add('current-slide');
    dots[targetIndex].classList.add('active');
    currentSlideIndex = targetIndex;
}

function autoPlay() { 
    if (slides.length > 0) {
        updateSlide((currentSlideIndex + 1) % slides.length); 
    }
}
let carouselTimer = setInterval(autoPlay, 4000);

// --- Scroll Progress ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// --- Modal & Builder ---
const modal = document.getElementById('order-modal');
const catSelect = document.getElementById('cat-select');
const prodSelect = document.getElementById('prod-select');
const sizeGroup = document.getElementById('size-group');
const flavorGroup = document.getElementById('flavor-group');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');

let cart = [];
let deliveryMethod = 'delivery';

let map;
let marker;

function setDeliveryMethod(method) {
    deliveryMethod = method;
    const btnDelivery = document.getElementById('btn-delivery');
    const btnPickup = document.getElementById('btn-pickup');
    const mapSection = document.getElementById('map-section');
    const customerInfoTitle = document.getElementById('customer-info-title');

    if (method === 'delivery') {
        btnDelivery.classList.add('active');
        btnPickup.classList.remove('active');
        mapSection.style.display = 'block';
        customerInfoTitle.textContent = 'Tus datos para el envío';
        
        if (map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 50);
        }
    } else {
        btnDelivery.classList.remove('active');
        btnPickup.classList.add('active');
        mapSection.style.display = 'none';
        customerInfoTitle.textContent = 'Tus datos para pasar al puesto';
    }
}

function initMap() {
    // Default coordinates (Mexico City: 19.4326, -99.1332)
    const defaultLat = 19.4326;
    const defaultLng = -99.1332;

    document.getElementById('lat-input').value = defaultLat;
    document.getElementById('lng-input').value = defaultLng;

    map = L.map('map', { attributionControl: false }).setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: customIcon
    }).addTo(map);

    marker.on('dragend', function (e) {
        const position = marker.getLatLng();
        document.getElementById('lat-input').value = position.lat.toFixed(6);
        document.getElementById('lng-input').value = position.lng.toFixed(6);
    });

    // Try to auto-locate on init
    getCurrentLocationGPS();
}

function getCurrentLocationGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('lat-input').value = lat.toFixed(6);
            document.getElementById('lng-input').value = lng.toFixed(6);
            
            if (map && marker) {
                const newLatLng = new L.LatLng(lat, lng);
                marker.setLatLng(newLatLng);
                map.setView(newLatLng, 16);
            }
        }, function (error) {
            console.warn("Error getting geolocation, trying IP fallback...", error);
            fallbackIPLocation();
        });
    } else {
        console.warn("Geolocation not supported, trying IP fallback...");
        fallbackIPLocation();
    }
}

function fallbackIPLocation() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.latitude && data.longitude) {
                const lat = data.latitude;
                const lng = data.longitude;
                document.getElementById('lat-input').value = lat.toFixed(6);
                document.getElementById('lng-input').value = lng.toFixed(6);
                
                if (map && marker) {
                    const newLatLng = new L.LatLng(lat, lng);
                    marker.setLatLng(newLatLng);
                    map.setView(newLatLng, 14);
                }
            }
        })
        .catch(err => {
            console.error("IP Geolocation failed:", err);
            // Default to Mexico City center if everything fails
            const defaultLat = 19.4326;
            const defaultLng = -99.1332;
            document.getElementById('lat-input').value = defaultLat;
            document.getElementById('lng-input').value = defaultLng;
            if (map && marker) {
                const newLatLng = new L.LatLng(defaultLat, defaultLng);
                marker.setLatLng(newLatLng);
                map.setView(newLatLng, 13);
            }
        });
}

function openOrderModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize map on first open after a small delay so DOM is ready
    setTimeout(() => {
        if (!map) {
            initMap();
        } else {
            map.invalidateSize();
            getCurrentLocationGPS();
        }
    }, 300);
}

function closeOrderModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    cart = [];
    updateCartUI();
    resetModalInputs();
}

function resetModalInputs() {
    catSelect.value = "";
    prodSelect.innerHTML = '<option value="" disabled selected>Primero categoría</option>';
    prodSelect.disabled = true;
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';
    setDeliveryMethod('delivery');
}

function updateProductOptions() {
    const category = catSelect.value;
    const products = menuData[category];
    prodSelect.disabled = false;
    prodSelect.innerHTML = '<option value="" disabled selected>Elige producto...</option>';
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = `${p.name} ${p.price ? `($${p.price})` : ''}`;
        prodSelect.appendChild(option);
    });
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';
}

function handleProductSelection() {
    const category = catSelect.value;
    const productName = prodSelect.value;
    const product = menuData[category].find(p => p.name === productName);
    
    // Reset subgroups
    sizeGroup.style.display = 'none';
    flavorGroup.style.display = 'none';

    if (product.hasSizes) {
        sizeGroup.style.display = 'block';
    } else if (product.hasFlavors) {
        flavorGroup.style.display = 'block';
    } else {
        addItemToCartDirect(product.name, product.price);
    }
}

function addWithSize(size, price) {
    const productName = prodSelect.value;
    addItemToCartDirect(`${productName} (${size})`, price);
}

function addWithFlavor(flavor) {
    const category = catSelect.value;
    const productName = prodSelect.value;
    const product = menuData[category].find(p => p.name === productName);
    addItemToCartDirect(`${productName} [${flavor}]`, product.price);
}

function addItemToCartDirect(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`¡${name} añadido! 🍓`);
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

function updateCartUI() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-text">El carrito está vacío.</p>';
        cartTotalAmount.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
        `;
        cartItemsContainer.appendChild(itemEl);
        total += item.price;
    });
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Vaciar todo el carrito?')) {
        cart = [];
        updateCartUI();
    }
}

function sendOrderWhatsApp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('whatsapp-input').value;
    const lat = document.getElementById('lat-input').value;
    const lng = document.getElementById('lng-input').value;

    if (!name || !phone) return alert('Por favor completa tus datos (Nombre y Teléfono)');
    if (phone.length !== 10) return alert('El número de WhatsApp debe tener exactamente 10 dígitos');
    if (cart.length === 0) return alert('Añade productos a tu carrito');

    let total = 0;
    let itemsText = '';
    cart.forEach(item => {
        itemsText += `- ${item.name}: $${item.price.toFixed(2)}%0A`;
        total += item.price;
    });

    let message = '';
    if (deliveryMethod === 'delivery') {
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        message = `*NUEVO PEDIDO ALUME 👾*%0A%0A*Nombre:* ${name}%0A*WhatsApp:* ${phone}%0A*Entrega:* Envío a domicilio 🚀%0A*Ubicación GPS:* ${googleMapsUrl}%0A%0A*PRODUCTOS:*%0A${itemsText}%0A*TOTAL: $${total.toFixed(2)}*`;
    } else {
        message = `*NUEVO PEDIDO ALUME 👾*%0A%0A*Nombre:* ${name}%0A*WhatsApp:* ${phone}%0A*Entrega:* Pasar al puesto 🏪%0A%0A*PRODUCTOS:*%0A${itemsText}%0A*TOTAL: $${total.toFixed(2)}*`;
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');
}

const revealElements = document.querySelectorAll('[data-reveal]');
function reveal() {
    revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('revealed');
    });
}
window.addEventListener('scroll', reveal);
reveal();

// --- CYBERPUNK GALLERY CAROUSEL LOGIC ---
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dots .dot');

function showSlide(index) {
    if (slides.length === 0) return;
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides.forEach((slide, i) => {
        if (i === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(index) {
    showSlide(index);
    resetSlideTimer();
}

function startSlideTimer() {
    slideInterval = setInterval(nextSlide, 5500);
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
}

// Initialize Carousel Events
(function initCarousel() {
    const nextBtn = document.getElementById('carousel-next-btn');
    const prevBtn = document.getElementById('carousel-prev-btn');
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });
        
        const wrapper = document.querySelector('.carousel-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
            wrapper.addEventListener('mouseleave', startSlideTimer);
        }
        
        startSlideTimer();
    }
})();
