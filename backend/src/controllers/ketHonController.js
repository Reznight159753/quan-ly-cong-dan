const { client } = require('../config/database');

const getAllKetHon = async (req, res) => {
    try {
        const result = await client.execute('SELECT * FROM ket_hon');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const createKetHon = async (req, res) => {
    const { SO_CCCD_CHONG, SO_CCCD_VO, NGAY_DANG_KY, NOI_DANG_KY, TINH } = req.body;
    try {
        const chongQuery = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
        const voQuery = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
        const [chongResult, voResult] = await Promise.all([
            client.execute(chongQuery, [SO_CCCD_CHONG], { prepare: true }),
            client.execute(voQuery, [SO_CCCD_VO], { prepare: true }),
        ]);

        const nguoiChong = chongResult.rows[0];
        const nguoiVo = voResult.rows[0];

        if (!nguoiChong || !nguoiVo) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin công dân.' });
        }
        if (nguoiChong.tinh_trang_hon_nhan !== 'DOC_THAN' || nguoiVo.tinh_trang_hon_nhan !== 'DOC_THAN') {
            return res.status(400).json({ message: 'Công dân không đủ điều kiện kết hôn.' });
        }

        const queries = [
            {
                query: 'INSERT INTO ket_hon (so_cccd_chong, so_cccd_vo, ngay_dang_ky, noi_dang_ky, tinh, trang_thai) VALUES (?, ?, ?, ?, ?, ?)',
                params: [SO_CCCD_CHONG, SO_CCCD_VO, NGAY_DANG_KY, NOI_DANG_KY, TINH, 'KET_HON'],
            },
            {
                query: 'UPDATE cong_dan SET tinh_trang_hon_nhan = ? WHERE so_cccd = ?',
                params: ['KET_HON', SO_CCCD_CHONG],
            },
            {
                query: 'UPDATE cong_dan SET tinh_trang_hon_nhan = ? WHERE so_cccd = ?',
                params: ['KET_HON', SO_CCCD_VO],
            },
        ];

        await client.batch(queries, { prepare: true });
        res.status(201).json({ message: 'Đăng ký kết hôn thành công.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống.', error: error.message });
    }
};

module.exports = { getAllKetHon, createKetHon };