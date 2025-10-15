const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const createLyHon = async (req, res) => {
    const { SO_CCCD_CHONG, SO_CCCD_VO, NGAY_LY_HON } = req.body;
    const ID_LY_HON = uuidv4();
    try {
        const ketHonQuery = 'SELECT * FROM ket_hon WHERE so_cccd_vo = ? AND so_cccd_chong = ?';
        const ketHonResult = await client.execute(ketHonQuery, [SO_CCCD_VO, SO_CCCD_CHONG], { prepare: true });
        const honNhan = ketHonResult.rows[0];

        if (!honNhan || honNhan.trang_thai !== 'KET_HON') {
            return res.status(404).json({ message: 'Không tìm thấy thông tin kết hôn hợp lệ.' });
        }

        const queries = [
            {
                query: 'INSERT INTO ly_hon (id_ly_hon, so_cccd_chong, so_cccd_vo, ngay_ly_hon) VALUES (?, ?, ?, ?)',
                params: [ID_LY_HON, SO_CCCD_CHONG, SO_CCCD_VO, NGAY_LY_HON],
            },
            {
                query: 'UPDATE ket_hon SET trang_thai = ? WHERE so_cccd_vo = ? AND so_cccd_chong = ?',
                params: ['DA_LY_HON', SO_CCCD_VO, SO_CCCD_CHONG],
            },
            {
                query: 'UPDATE cong_dan SET tinh_trang_hon_nhan = ? WHERE so_cccd = ?',
                params: ['DOC_THAN', SO_CCCD_CHONG],
            },
            {
                query: 'UPDATE cong_dan SET tinh_trang_hon_nhan = ? WHERE so_cccd = ?',
                params: ['DOC_THAN', SO_CCCD_VO],
            },
        ];

        await client.batch(queries, { prepare: true });
        res.status(201).json({ message: 'Đăng ký ly hôn thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống.', error: error.message });
    }
};

module.exports = { createLyHon };