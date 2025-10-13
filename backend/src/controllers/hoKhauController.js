const client = require('../config/database');

exports.dangKyHoKhau = async (req, res) => {
  const { SO_HO_KHAU, CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH } = req.body;
  const query = 'INSERT INTO HO_KHAU (SO_HO_KHAU, CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH) VALUES (?, ?, ?, ?, ?)';
  try {
    await client.execute(query, [SO_HO_KHAU, CHU_HO, new Set(DANH_SACH_THANH_VIEN), DIA_CHI, TINH]);
    res.status(201).json({ message: 'Đăng ký hộ khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xemHoKhau = async (req, res) => {
  const { so_ho_khau } = req.params;
  const query = 'SELECT * FROM HO_KHAU WHERE SO_HO_KHAU = ?';
  try {
    const result = await client.execute(query, [so_ho_khau]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.capNhatHoKhau = async (req, res) => {
  const { so_ho_khau } = req.params;
  const { DANH_SACH_THANH_VIEN } = req.body; // Ví dụ cập nhật thành viên
  const query = 'UPDATE HO_KHAU SET DANH_SACH_THANH_VIEN = ? WHERE SO_HO_KHAU = ?';
  try {
    await client.execute(query, [new Set(DANH_SACH_THANH_VIEN), so_ho_khau]);
    res.json({ message: 'Cập nhật hộ khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};