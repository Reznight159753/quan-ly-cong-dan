const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(bodyParser.json());

// Middleware kiểm tra JWT (nếu cần)
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token không tồn tại' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra vai trò ADMIN
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Chỉ ADMIN được phép thực hiện hành động này' });
  }
  next();
};

// ===== TẠM THỜI BỎ QUA AUTHENTICATION ĐỂ TEST =====
// Nếu muốn bật lại, uncomment các dòng dưới

// Các route cần ADMIN (tạo, sửa, xóa)
// app.use('/api/congdan', authenticateJWT, requireAdmin);
// app.use('/api/kethon', authenticateJWT, requireAdmin);
// app.use('/api/xe', authenticateJWT, requireAdmin);
// app.use('/api/tru', authenticateJWT, requireAdmin);
// app.use('/api/giayto', authenticateJWT, requireAdmin);
// app.use('/api/hokhau', authenticateJWT, requireAdmin);

// Mount routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Có lỗi xảy ra!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});