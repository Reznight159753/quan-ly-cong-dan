// Updated hoKhauController.js
const { client } = require('../config/database');

const checkCCCDExists = async (cccd) => {
  const query = 'SELECT so_cccd FROM cong_dan WHERE so_cccd = ?';
  const result = await client.execute(query, [cccd], { prepare: true });
  return result.rowLength > 0;
};

const validateMembers = async (chuHo, danhSachThanhVien) => {
  const missing = [];
  if (!(await checkCCCDExists(chuHo))) {
    missing.push(chuHo);
  }
  for (const cccd of danhSachThanhVien) {
    if (!(await checkCCCDExists(cccd))) {
      missing.push(cccd);
    }
  }
  return missing;
};

const getAllHoKhau = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM ho_khau');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const dangKyHoKhau = async (req, res) => {
    const { SO_HO_KHAU, CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH } = req.body;
    try {
        const missing = await validateMembers(CHU_HO, DANH_SACH_THANH_VIEN);
        if (missing.length > 0) {
            return res.status(400).json({ message: `Không tìm thấy CCCD trong hệ thống: ${missing.join(', ')}` });
        }
        const query = 'INSERT INTO ho_khau (so_ho_khau, chu_ho, danh_sach_thanh_vien, dia_chi, tinh) VALUES (?, ?, ?, ?, ?)';
        await client.execute(query, [SO_HO_KHAU, CHU_HO, new Set(DANH_SACH_THANH_VIEN), DIA_CHI, TINH], { prepare: true });
        res.status(201).json({ message: 'Đăng ký hộ khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const capNhatHoKhau = async (req, res) => {
    const { sohokhau } = req.params;
    const { CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH } = req.body;
    try {
        const missing = await validateMembers(CHU_HO, DANH_SACH_THANH_VIEN);
        if (missing.length > 0) {
            return res.status(400).json({ message: `Không tìm thấy CCCD trong hệ thống: ${missing.join(', ')}` });
        }
        const query = 'UPDATE ho_khau SET chu_ho = ?, danh_sach_thanh_vien = ?, dia_chi = ?, tinh = ? WHERE so_ho_khau = ?';
        await client.execute(query, [CHU_HO, new Set(DANH_SACH_THANH_VIEN), DIA_CHI, TINH, sohokhau], { prepare: true });
        res.json({ message: 'Cập nhật hộ khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const deleteHoKhau = async (req, res) => {
    const { sohokhau } = req.params;
    try {
        await client.execute('DELETE FROM ho_khau WHERE so_ho_khau = ?', [sohokhau]);
        res.json({ message: 'Xóa hộ khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { getAllHoKhau, dangKyHoKhau, capNhatHoKhau, deleteHoKhau };