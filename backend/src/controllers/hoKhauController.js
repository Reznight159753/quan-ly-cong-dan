const { client } = require('../config/database');

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
        const query = 'INSERT INTO ho_khau (so_ho_khau, chu_ho, danh_sach_thanh_vien, dia_chi, tinh) VALUES (?, ?, ?, ?, ?)';
        await client.execute(query, [SO_HO_KHAU, CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH], { prepare: true });
        res.status(201).json({ message: 'Đăng ký hộ khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const capNhatHoKhau = async (req, res) => {
    const { sohokhau } = req.params;
    const { CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH } = req.body;
    try {
        const query = 'UPDATE ho_khau SET chu_ho = ?, danh_sach_thanh_vien = ?, dia_chi = ?, tinh = ? WHERE so_ho_khau = ?';
        await client.execute(query, [CHU_HO, DANH_SACH_THANH_VIEN, DIA_CHI, TINH, sohokhau], { prepare: true });
        res.json({ message: 'Cập nhật hộ khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { getAllHoKhau, dangKyHoKhau, capNhatHoKhau };