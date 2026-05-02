const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Data file paths
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
if (!fs.existsSync(REVIEWS_FILE)) fs.writeFileSync(REVIEWS_FILE, '[]');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// ===== ORDERS API =====
app.get('/api/orders', (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    const order = {
        id: orders.length + 1,
        ...req.body,
        status: 'received',
        createdAt: new Date().toISOString()
    };
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    console.log(`✅ New order #${order.id} — ₹${order.total}`);
    res.status(201).json(order);
});

// ===== REVIEWS API =====
app.get('/api/reviews', (req, res) => {
    const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
    res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
    const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
    const review = {
        id: reviews.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    reviews.push(review);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
    console.log(`⭐ New review from ${review.name} — ${review.rating} stars`);
    res.status(201).json(review);
});

// ===== CONTACT API =====
app.post('/api/contact', (req, res) => {
    console.log('📧 New contact message:', req.body);
    res.json({ success: true, message: 'Message received!' });
});

// ===== START SERVER =====
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════╗
║        🍽️  Zaika Cafe Server        ║
║                                      ║
║   Running at http://localhost:${PORT}   ║
║                                      ║
╚══════════════════════════════════════╝
        `);
    });
}

module.exports = app;
