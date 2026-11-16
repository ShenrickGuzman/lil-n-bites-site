const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
    }
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

const products = {
    individual: [
        { name: 'Classic Choco Chip', price: 35 },
        { name: 'Red Velvet', price: 45 },
        { name: 'Choco S\'mores', price: 40 },
        { name: 'Choco Crinkles', price: 20 },
        { name: 'Choco Oreo Munchkins', price: 15 },
        { name: 'Choco Ball', price: 10 },
        { name: 'Rainbow Munchkins', price: 10 },
        { name: 'OG Brownies', price: 30 },
        { name: 'OG Banana Bread', price: 120 },
        { name: 'Chocolate Almond Bars', price: 40 },
        { name: 'Almond Banana Bread', price: 130 },
        { name: 'Cashew Banana Bread', price: 140 },
        { name: 'Cinnamon Rolls', price: 50 },
        { name: 'Spanish Bread', price: 15 }
    ],
    boxes: [
        { name: 'Classic Choco Chip (Box of 4)', price: 130 },
        { name: 'Red Velvet (Box of 4)', price: 170 },
        { name: 'Choco S\'mores (Box of 4)', price: 150 },
        { name: 'Choco Crinkles (Box of 10)', price: 180 },
        { name: 'Choco Oreo Munchkins (Box of 10)', price: 160 },
        { name: 'Choco Ball (Box of 10)', price: 90 },
        { name: 'Rainbow Munchkins (Box of 10)', price: 90 },
        { name: 'OG Brownies (Box of 6)', price: 170 },
        { name: 'Chocolate Almond Bars (Box of 6)', price: 230 },
        { name: 'Spanish Bread (Box of 10)', price: 140 },
        { name: 'Cinnamon Rolls (Box of 4)', price: 190 }
    ]
};

// ─── Cart ───
let cart = [];

const categoryEl = document.getElementById('category');
const productEl = document.getElementById('product');
const itemPriceEl = document.getElementById('itemPrice');
const itemQtyEl = document.getElementById('itemQty');
const addItemBtn = document.getElementById('addItemBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const orderSummary = document.getElementById('orderSummary');
const custNameEl = document.getElementById('custName');
const custEmailEl = document.getElementById('custEmail');
const remarksEl = document.getElementById('remarks');
const orderForm = document.getElementById('orderForm');
const orderStatus = document.getElementById('orderStatus');

// ─── EmailJS Config ───
const EMAILJS_PUBLIC_KEY = 'ygyA-0gFFOkhnUzi8';
const EMAILJS_SERVICE_ID = 'service_5p9hvml';
const EMAILJS_TEMPLATE_ID = 'template_lzj078q';

function getCatKey(label) {
    if (label === 'Individual') return 'individual';
    if (label === 'Boxes &amp; Bundles' || label === 'Boxes & Bundles') return 'boxes';
    return null;
}

function populateProducts() {
    const cat = categoryEl.value;
    productEl.innerHTML = '<option value="">Select product</option>';
    itemPriceEl.value = '';
    if (!cat) return;
    const key = getCatKey(cat);
    if (!key) return;
    const items = products[key];
    items.forEach((item, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = item.name + ' (\u20B1' + item.price + ')';
        productEl.appendChild(opt);
    });
}

function updateItemPrice() {
    const cat = categoryEl.value;
    const idx = productEl.value;
    if (!cat || idx === '') { itemPriceEl.value = ''; return; }
    const key = getCatKey(cat);
    if (!key) return;
    const item = products[key][idx];
    itemPriceEl.value = '\u20B1' + item.price.toFixed(2);
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">No items yet. Add products above.</p>';
        cartTotal.innerHTML = '';
        updateSidebarSummary();
        return;
    }
    let html = '';
    let grandTotal = 0;
    cart.forEach((entry, i) => {
        const subtotal = entry.price * entry.qty;
        grandTotal += subtotal;
        html += '<div class="cart-item">' +
            '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + entry.product + '</div>' +
            '<div class="cart-item-detail">' + entry.category + ' &times; ' + entry.qty + ' @ \u20B1' + entry.price.toFixed(2) + '</div>' +
            '</div>' +
            '<span class="cart-item-subtotal">\u20B1' + subtotal.toFixed(2) + '</span>' +
            '<button class="cart-remove" data-index="' + i + '">&times;</button>' +
            '</div>';
    });
    cartItems.innerHTML = html;
    cartTotal.innerHTML = 'Total: \u20B1' + grandTotal.toFixed(2);
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            cart.splice(idx, 1);
            renderCart();
        });
    });
    updateSidebarSummary();
}

function updateSidebarSummary() {
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p class="summary-placeholder">Add items to see the summary.</p>';
        return;
    }
    let html = '';
    let grandTotal = 0;
    cart.forEach(entry => {
        const subtotal = entry.price * entry.qty;
        grandTotal += subtotal;
        html += '<div class="summary-item"><span class="summary-label">' + entry.product + ' x' + entry.qty + '</span><span class="summary-value">\u20B1' + subtotal.toFixed(2) + '</span></div>';
    });
    html += '<div class="summary-item"><span class="summary-label">Total</span><span class="summary-value">\u20B1' + grandTotal.toFixed(2) + '</span></div>';
    orderSummary.innerHTML = html;
}

if (categoryEl) {
    categoryEl.addEventListener('change', () => {
        populateProducts();
        updateItemPrice();
    });
    productEl.addEventListener('change', updateItemPrice);
}

if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
        const cat = categoryEl.value;
        const idx = productEl.value;
        const qty = parseInt(itemQtyEl.value) || 1;
        if (!cat || idx === '') { alert('Please select a category and product.'); return; }
        const key = getCatKey(cat);
        if (!key) return;
        const item = products[key][idx];
        cart.push({ category: cat, product: item.name, price: item.price, qty: qty });
        renderCart();
        categoryEl.value = '';
        productEl.innerHTML = '<option value="">Select category first</option>';
        itemPriceEl.value = '';
        itemQtyEl.value = '1';
    });
}

if (orderForm) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        orderStatus.className = 'order-status';
        orderStatus.style.display = 'none';
        const name = custNameEl.value.trim();
        const email = custEmailEl.value.trim();
        const remarks = remarksEl.value.trim();
        if (cart.length === 0) { orderStatus.textContent = 'Please add at least one item to your order.'; orderStatus.className = 'order-status error'; orderStatus.style.display = 'block'; return; }
        if (!name) { orderStatus.textContent = 'Please enter your name.'; orderStatus.className = 'order-status error'; orderStatus.style.display = 'block'; return; }
        if (!email) { orderStatus.textContent = 'Please enter your Gmail address.'; orderStatus.className = 'order-status error'; orderStatus.style.display = 'block'; return; }
        let grandTotal = 0;
        let itemsList = '';
        cart.forEach((entry, i) => {
            const subtotal = entry.price * entry.qty;
            grandTotal += subtotal;
            itemsList += (i + 1) + '. ' + entry.product + ' (' + entry.category + ') x' + entry.qty + ' = \u20B1' + subtotal.toFixed(2) + '\n';
        });
        orderStatus.textContent = '\u23f3 Sending your order...';
        orderStatus.className = 'order-status';
        orderStatus.style.display = 'block';
        const templateParams = {
            name: name,
            email: email,
            items: itemsList,
            total_cost: '\u20B1' + grandTotal.toFixed(2),
            remarks: remarks || 'None',
            message: 'Customer: ' + name + ' (' + email + ')\n\nItems:\n' + itemsList + '\nTotal: \u20B1' + grandTotal.toFixed(2) + '\nRemarks: ' + (remarks || 'None')
        };
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                orderStatus.textContent = '\u2705 Order placed! Receipt sent to ynaguzman4@gmail.com.';
                orderStatus.className = 'order-status success';
                cart = [];
                renderCart();
                custNameEl.value = '';
                custEmailEl.value = '';
                remarksEl.value = '';
            })
            .catch(() => {
                orderStatus.textContent = '\u274c Failed to send. Check your EmailJS config and try again.';
                orderStatus.className = 'order-status error';
            });
    });
}
