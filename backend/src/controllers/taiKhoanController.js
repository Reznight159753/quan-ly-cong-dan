const client = require('../config/database');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.dangKyTaiKhoan = async (req, res) => {
    const { username, password, so_cccd, ho_ten } = req.body;

    if (!validator.isLength(username, { min: 3 }) || !validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ error: 'Username tối thiểu 3 ký tự, mật khẩu tối thiểu 6 ký tự' });
    }
    if (!validator.isLength(so_cccd, { min: 12, max: 12 })) {
        return res.status(400).json({ error: 'SO_CCCD phải có 12 số' });
    }

    const queryCheck = 'SELECT username FROM TAI_KHOAN WHERE username = ?';
    // SỬA: Thay 'password' thành 'pass' để khớp với CSDL
    const queryInsert = 'INSERT INTO TAI_KHOAN (username, pass, role, so_cccd, ho_ten) VALUES (?, ?, ?, ?, ?)';
    
    try {
        const check = await client.execute(queryCheck, [username], { prepare: true });
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Username đã tồn tại' });
        }
        
        await client.execute(queryInsert, [username, password, 'USER', so_cccd, ho_ten], { prepare: true });
        res.status(201).json({ message: 'Đăng ký tài khoản thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.dangKyTaiKhoanAdmin = async (req, res) => {
    const { username, password, so_cccd, ho_ten, role } = req.body;
    
    // Giả sử middleware đã xác thực và gắn req.user
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Chỉ ADMIN được phép đăng ký tài khoản ADMIN' });
    }
    
    if (!validator.isLength(username, { min: 3 }) || !validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ error: 'Username tối thiểu 3 ký tự, mật khẩu tối thiểu 6 ký tự' });
    }
    if (!validator.isLength(so_cccd, { min: 12, max: 12 })) {
        return res.status(400).json({ error: 'SO_CCCD phải có 12 số' });
    }
    if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Vai trò không hợp lệ' });
    }

    const queryCheck = 'SELECT username FROM TAI_KHOAN WHERE username = ?';
    // SỬA: Thay 'password' thành 'pass' để khớp với CSDL
    const queryInsert = 'INSERT INTO TAI_KHOAN (username, pass, role, so_cccd, ho_ten) VALUES (?, ?, ?, ?, ?)';
    
    try {
        const check = await client.execute(queryCheck, [username], { prepare: true });
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Username đã tồn tại' });
        }
        
        await client.execute(queryInsert, [username, password, role, so_cccd, ho_ten], { prepare: true });
        res.status(201).json({ message: 'Đăng ký tài khoản ADMIN thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.dangNhap = async (req, res) => {
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM TAI_KHOAN WHERE username = ?';
    try {
        const result = await client.execute(query, [username], { prepare: true });
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Username không tồn tại' });
        }
        
        const user = result.rows[0];
        // SỬA: so sánh với user.pass thay vì user.password
        if (user.pass !== password) {
            return res.status(401).json({ error: 'Mật khẩu không đúng' });
        }
        
        // SỬA: Thêm ho_ten vào token payload
        const token = jwt.sign({ 
            username: user.username, 
            role: user.role, 
            so_cccd: user.so_cccd,
            ho_ten: user.ho_ten 
        }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ 
            token, 
            user: { 
                username: user.username, 
                ho_ten: user.ho_ten, 
                role: user.role, 
                so_cccd: user.so_cccd 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

