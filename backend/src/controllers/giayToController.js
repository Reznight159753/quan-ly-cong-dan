const { client } = require('../config/database');

const getAllKhaiSinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM giay_khai_sinh');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const getAllChungTu = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM giay_chung_tu');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const dangKyChungTu = async (req, res) => {
    const { SO_GIAY, SO_CCCD, NGAY_MAT, NOI_MAT, NGUYEN_NHAN } = req.body;
    try {
        const queries = [
            {
                query: 'INSERT INTO giay_chung_tu (so_giay, so_cccd, ngay_mat, noi_mat, nguyen_nhan) VALUES (?, ?, ?, ?, ?)',
                params: [SO_GIAY, SO_CCCD, NGAY_MAT, NOI_MAT, NGUYEN_NHAN]
            },
            {
                query: "UPDATE cong_dan SET tinh_trang_hon_nhan = 'DA_MAT' WHERE so_cccd = ?",
                params: [SO_CCCD]
            }
        ];
        await client.batch(queries, { prepare: true });
        res.status(201).json({ message: 'Đăng ký chứng tử thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { getAllKhaiSinh, getAllChungTu, dangKyChungTu };