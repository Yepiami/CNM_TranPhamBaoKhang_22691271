// File: routes/auth.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

// 1. Hiện form login
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// 2. Xử lý đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Tìm user trong DB
    const [users] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    if (users.length > 0) {
        // Đăng nhập thành công -> Lưu vào session
        req.session.user = users[0];
        res.redirect('/');
    } else {
        // Sai thông tin -> Báo lỗi
        res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
    }
});

// 3. Đăng xuất
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;