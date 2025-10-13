const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware kiểm tra JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token không tồn tại' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

// Áp dụng middleware cho các route chỉnh sửa
app.use('/api/congdan/dangky', authenticateJWT, requireAdmin);
app.use('/api/congdan/:so_cccd/capnhat', authenticateJWT, requireAdmin);
app.use('/api/congdan/:so_cccd/xuly-cccd', authenticateJWT, requireAdmin);
app.use('/api/kethon/dangky', authenticateJWT, requireAdmin);
app.use('/api/kethon/lyhon', authenticateJWT, requireAdmin);
app.use('/api/xe/dangky', authenticateJWT, requireAdmin);
app.use('/api/tru/dangky', authenticateJWT, requireAdmin);
app.use('/api/giay/khaisinh', authenticateJWT, requireAdmin);
app.use('/api/giay/chungtu', authenticateJWT, requireAdmin);
app.use('/api/hokhau/dangky', authenticateJWT, requireAdmin);
app.use('/api/hokhau/:so_ho_khau/capnhat', authenticateJWT, requireAdmin);
app.use('/api/taikhoan/dangky-admin', authenticateJWT, requireAdmin);

// Route cần ADMIN để xem thống kê
app.use('/api/congdan/thongke', authenticateJWT, requireAdmin);

// Các route tra cứu/xem không cần kiểm tra vai trò
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));