const { client } = require('../config/database');

const getAllTamTru = async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM tru WHERE loai_tru = 'TAM_TRU' ALLOW FILTERING");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const getAllTamVang = async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM tru WHERE loai_tru = 'TAM_VANG' ALLOW FILTERING");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const dangKyTru = async (req, res) => {
    const { SO_CCCD, LOAI_TRU, NOI_TRU, TU_NGAY, DEN_NGAY, TINH, TRANG_THAI } = req.body;
    try {
        const query = 'INSERT INTO tru (so_cccd, loai_tru, noi_tru, tu_ngay, den_ngay, tinh, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await client.execute(query, [SO_CCCD, LOAI_TRU, NOI_TRU, TU_NGAY, DEN_NGAY || null, TINH, TRANG_THAI], { prepare: true });
        res.status(201).json({ message: 'Đăng ký cư trú thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const traCuuTru = async (req, res) => {
    const { cccd } = req.params;
    try {
        const query = 'SELECT * FROM tru WHERE so_cccd = ?';
        const result = await client.execute(query, [cccd], { prepare: true });
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = { getAllTamTru, getAllTamVang, dangKyTru, traCuuTru };