const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllXe = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM dang_ky_xe');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const dangKyXe = async (req, res) => {
    const { SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY } = req.body;
    const SO_DANG_KY_XE = uuidv4();
    try {
        const query = 'INSERT INTO dang_ky_xe (so_dang_ky_xe, so_cccd_chu_xe, bien_so, loai_xe, hang_xe, ngay_dang_ky) VALUES (?, ?, ?, ?, ?, ?)';
        await client.execute(query, [SO_DANG_KY_XE, SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY], { prepare: true });
        res.status(201).json({ message: 'Đăng ký xe thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const traCuuXeTheoBienSo = async (req, res) => {
    const { bienso } = req.params;
    try {
        // CSDL không có bảng `xe_by_bien_so`, nên phải ALLOW FILTERING
        const query = 'SELECT * FROM dang_ky_xe WHERE bien_so = ? ALLOW FILTERING';
        const result = await client.execute(query, [bienso], { prepare: true });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { getAllXe, dangKyXe, traCuuXeTheoBienSo };