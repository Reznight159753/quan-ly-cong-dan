const client = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.dangKyXe = async (req, res) => {
  const SO_DANG_KY_XE = uuidv4();
  const { SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY } = req.body;
  const queryDangKy = 'INSERT INTO DANG_KY_XE (SO_DANG_KY_XE, SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY) VALUES (?, ?, ?, ?, ?, ?)';
  const queryByChuXe = 'INSERT INTO XE_BY_CHU_XE (SO_CCCD_CHU_XE, BIEN_SO, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY) VALUES (?, ?, ?, ?, ?, ?)';
  const queryByBienSo = 'INSERT INTO XE_BY_BIEN_SO (BIEN_SO, SO_CCCD_CHU_XE, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY) VALUES (?, ?, ?, ?, ?, ?)';
  try {
    await client.batch([
      { query: queryDangKy, params: [SO_DANG_KY_XE, SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY] },
      { query: queryByChuXe, params: [SO_CCCD_CHU_XE, BIEN_SO, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY] },
      { query: queryByBienSo, params: [BIEN_SO, SO_CCCD_CHU_XE, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY] }
    ], { prepare: true });
    res.status(201).json({ message: 'Đăng ký xe thành công', so_dang_ky_xe: SO_DANG_KY_XE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.traCuuXeTheoChuXe = async (req, res) => {
  const { so_cccd_chu_xe } = req.params;
  const query = 'SELECT * FROM XE_BY_CHU_XE WHERE SO_CCCD_CHU_XE = ?';
  try {
    const result = await client.execute(query, [so_cccd_chu_xe]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.traCuuXeTheoBienSo = async (req, res) => {
  const { bien_so } = req.params;
  const query = 'SELECT * FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?';
  try {
    const result = await client.execute(query, [bien_so]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};