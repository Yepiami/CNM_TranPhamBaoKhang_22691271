// File: app.js
const express = require('express');
const session = require('express-session'); // 1. Import thư viện
const app = express();

// 2. Cấu hình View Engine và đọc dữ liệu Form
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// --- QUAN TRỌNG: Cấu hình Session PHẢI nằm ở đây (trước khi dùng routes) ---
app.use(session({
  secret: 'secret_key_bat_ky',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 * 60 } // 60 phút
}));
// --------------------------------------------------------------------------

// 3. Khai báo Middleware Check Login (Sau khi đã có session)
const requireLogin = (req, res, next) => {
  // Lúc này req.session đã tồn tại nên không bị lỗi undefined nữa
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// 4. Import Routes
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');

// 5. Đăng ký Routes
// Route Login/Logout (Không chặn, ai cũng vào được)
app.use('/', authRoutes);

// Route Sản phẩm (Bị chặn bởi requireLogin, phải đăng nhập mới thấy)
app.use('/', requireLogin, productRoutes);

// 6. Chạy Server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});