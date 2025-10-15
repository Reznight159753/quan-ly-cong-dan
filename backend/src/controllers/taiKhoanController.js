const { client } = require('../config/database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { USERNAME, PASS } = req.body;
  try {
    const query = 'SELECT * FROM TAI_KHOAN WHERE USERNAME = ?';
    const result = await client.execute(query, [USERNAME]);
    if (result.rowLength === 0 || result.rows[0].pass !== PASS) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    const user = result.rows[0];
    const token = jwt.sign({ username: user.username, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
    res.json({ token, role: user.role, ho_ten: user.ho_ten });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

module.exports = { login };