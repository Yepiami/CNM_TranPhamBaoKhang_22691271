const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// Home
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM products');
    res.render('products', { products: rows });
});

// Add product
router.post('/add', async (req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
        [name, price, quantity]
    );
    res.redirect('/');
});
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/');
});

// --- TÍNH NĂNG SỬA (Bước 1: Hiện form sửa) ---
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length > 0) {
        res.render('edit', { product: rows[0] });
    } else {
        res.redirect('/');
    }
});

// --- TÍNH NĂNG SỬA (Bước 2: Lưu thay đổi) ---
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { name, price, quantity } = req.body;

    await db.query(
        'UPDATE products SET name=?, price=?, quantity=? WHERE id=?',
        [name, price, quantity, id]
    );
    res.redirect('/');
});

module.exports = router;
