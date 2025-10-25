const { client } = require('../config/database');

const createKhaiSinh = async (req, res) => {
    const { SO_GIAY, NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME } = req.body;
    try {
        const insertQuery = 'INSERT INTO GIAY_KHAI_SINH (SO_GIAY, NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME) VALUES (?, ?, ?, ?, ?)';
        await client.execute(insertQuery, [SO_GIAY, NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME], { prepare: true });
        res.status(201).json({ message: 'Đăng ký khai sinh thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi tạo giấy khai sinh.', error: error.message });
    }
};

const getAllKhaiSinh = async (req, res) => {
    try {
        const khaiSinhResult = await client.execute('SELECT * FROM GIAY_KHAI_SINH');
        const khaiSinhs = khaiSinhResult.rows;

        if (khaiSinhs.length === 0) {
            return res.json([]);
        }

        const cccdSet = new Set();
        khaiSinhs.forEach(ks => {
            if (ks.so_cccd_cha) cccdSet.add(ks.so_cccd_cha);
            if (ks.so_cccd_me) cccdSet.add(ks.so_cccd_me);
        });
        const cccdList = Array.from(cccdSet);
        
        if (cccdList.length === 0) {
            return res.json(khaiSinhs);
        }

        const congDanQuery = 'SELECT so_cccd, ho_ten FROM cong_dan WHERE so_cccd IN ?';
        const congDanResult = await client.execute(congDanQuery, [cccdList], { prepare: true });

        const cccdToNameMap = new Map();
        congDanResult.rows.forEach(cd => {
            cccdToNameMap.set(cd.so_cccd, cd.ho_ten);
        });

        const resultsWithNames = khaiSinhs.map(ks => {
            const tenCha = cccdToNameMap.get(ks.so_cccd_cha) || 'Không rõ';
            const tenMe = cccdToNameMap.get(ks.so_cccd_me) || 'Không rõ';
            return {
                ...ks,
                cha_me: `CHA: ${tenCha}, ME: ${tenMe}`
            };
        });

        res.json(resultsWithNames);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi lấy danh sách khai sinh', error: error.message });
    }
};

const updateKhaiSinh = async (req, res) => {
    const { so_giay } = req.params;
    const { NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME } = req.body;

    if (!NGAY_SINH || !NOI_SINH || !SO_CCCD_CHA || !SO_CCCD_ME) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const updateQuery = 'UPDATE GIAY_KHAI_SINH SET NGAY_SINH = ?, NOI_SINH = ?, SO_CCCD_CHA = ?, SO_CCCD_ME = ? WHERE SO_GIAY = ?';
        await client.execute(updateQuery, [NGAY_SINH, NOI_SINH, SO_CCCD_CHA, SO_CCCD_ME, so_giay], { prepare: true });
        res.json({ message: 'Cập nhật giấy khai sinh thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật giấy khai sinh', error: error.message });
    }
};

const deleteKhaiSinh = async (req, res) => {
    const { so_giay } = req.params;
    try {
        const query = 'DELETE FROM GIAY_KHAI_SINH WHERE SO_GIAY = ?';
        await client.execute(query, [so_giay], { prepare: true });
        res.json({ message: 'Xóa giấy khai sinh thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi xóa giấy khai sinh', error: error.message });
    }
};

module.exports = { createKhaiSinh, getAllKhaiSinh, updateKhaiSinh, deleteKhaiSinh };