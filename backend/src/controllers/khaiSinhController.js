const { client } = require('../config/database');

const createKhaiSinh = async (req, res) => {
    const { SO_GIAY, SO_CCCD, NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME } = req.body;
    try {
        const chaQuery = 'SELECT ho_ten FROM cong_dan WHERE so_cccd = ?';
        const meQuery = 'SELECT ho_ten FROM cong_dan WHERE so_cccd = ?';
        const [chaResult, meResult] = await Promise.all([
            client.execute(chaQuery, [SO_CCCD_CHA], { prepare: true }),
            client.execute(meQuery, [SO_CCCD_ME], { prepare: true }),
        ]);

        const tenCha = chaResult.rows[0]?.ho_ten || 'Không rõ';
        const tenMe = meResult.rows[0]?.ho_ten || 'Không rõ';
        const chaMeInfo = `CHA: ${tenCha}, ME: ${tenMe}`;

        const insertQuery = 'INSERT INTO giay_khai_sinh (so_giay, so_cccd, ngay_sinh, noi_sinh, cha_me) VALUES (?, ?, ?, ?, ?)';
        await client.execute(insertQuery, [SO_GIAY, SO_CCCD, NGAY_SINH, NOI_SINH, chaMeInfo], { prepare: true });

        res.status(201).json({ message: 'Đăng ký khai sinh thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống.', error: error.message });
    }
};

module.exports = { createKhaiSinh };