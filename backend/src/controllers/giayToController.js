const client = require('../config/database');

exports.dangKyKhaiSinh = async (req, res) => {
  const { SO_GIAY, SO_CCCD, NGAY_SINH, NOI_SINH, CHA_ME } = req.body;
  const query = 'INSERT INTO GIAY_KHAI_SINH (SO_GIAY, SO_CCCD, NGAY_SINH, NOI_SINH, CHA_ME) VALUES (?, ?, ?, ?, ?)';
  try {
    await client.execute(query, [SO_GIAY, SO_CCCD, NGAY_SINH, NOI_SINH, CHA_ME]);
    res.status(201).json({ message: 'Đăng ký khai sinh thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dangKyChungTu = async (req, res) => {
  const { SO_GIAY, SO_CCCD, NGAY_MAT, NOI_MAT, NGUYEN_NHAN } = req.body;
  const query = 'INSERT INTO GIAY_CHUNG_TU (SO_GIAY, SO_CCCD, NGAY_MAT, NOI_MAT, NGUYEN_NHAN) VALUES (?, ?, ?, ?, ?)';
  try {
    await client.execute(query, [SO_GIAY, SO_CCCD, NGAY_MAT, NOI_MAT, NGUYEN_NHAN]);
    res.status(201).json({ message: 'Đăng ký chứng tử thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xemKhaiSinh = async (req, res) => {
  const { so_giay } = req.params;
  const query = 'SELECT * FROM GIAY_KHAI_SINH WHERE SO_GIAY = ?';
  try {
    const result = await client.execute(query, [so_giay]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xemChungTu = async (req, res) => {
  const { so_giay } = req.params;
  const query = 'SELECT * FROM GIAY_CHUNG_TU WHERE SO_GIAY = ?';
  try {
    const result = await client.execute(query, [so_giay]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};