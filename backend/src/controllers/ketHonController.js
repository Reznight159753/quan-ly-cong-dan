const client = require('../config/database');

exports.dangKyKetHon = async (req, res) => {
  const { SO_CCCD_VO, SO_CCCD_CHONG, NGAY_DANG_KY, NOI_DANG_KY, TINH } = req.body;
  const queryKetHon = 'INSERT INTO KET_HON (SO_CCCD_VO, SO_CCCD_CHONG, NGAY_DANG_KY, NOI_DANG_KY, TINH, TRANG_THAI) VALUES (?, ?, ?, ?, ?, ?)';
  const queryByChong = 'INSERT INTO KET_HON_BY_CHONG (SO_CCCD_CHONG, SO_CCCD_VO, NGAY_DANG_KY, NOI_DANG_KY, TINH, TRANG_THAI) VALUES (?, ?, ?, ?, ?, ?)';
  const updateCongDan = 'UPDATE CONG_DAN SET TINH_TRANG_HON_NHAN = ? WHERE SO_CCCD = ?';
  try {
    await client.batch([
      { query: queryKetHon, params: [SO_CCCD_VO, SO_CCCD_CHONG, NGAY_DANG_KY, NOI_DANG_KY, TINH, 'KET_HON'] },
      { query: queryByChong, params: [SO_CCCD_CHONG, SO_CCCD_VO, NGAY_DANG_KY, NOI_DANG_KY, TINH, 'KET_HON'] },
      { query: updateCongDan, params: ['KET_HON', SO_CCCD_VO] },
      { query: updateCongDan, params: ['KET_HON', SO_CCCD_CHONG] }
    ], { prepare: true });
    res.status(201).json({ message: 'Đăng ký kết hôn thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xemTinhTrangHonNhan = async (req, res) => {
  const { so_cccd } = req.params;
  const queryCongDan = 'SELECT TINH_TRANG_HON_NHAN FROM CONG_DAN WHERE SO_CCCD = ?';
  const queryKetHon = 'SELECT * FROM KET_HON WHERE SO_CCCD_VO = ?';
  const queryByChong = 'SELECT * FROM KET_HON_BY_CHONG WHERE SO_CCCD_CHONG = ?';
  try {
    const congDan = await client.execute(queryCongDan, [so_cccd]);
    let voChong = await client.execute(queryKetHon, [so_cccd]);
    let vaiTro = 'VO';
    if (voChong.rows.length === 0) {
      voChong = await client.execute(queryByChong, [so_cccd]);
      vaiTro = 'CHONG';
    }
    res.json({
      data: {
        so_cccd,
        tinh_trang_hon_nhan: congDan.rows[0]?.tinh_trang_hon_nhan || 'DOC_THAN',
        thong_tin_vo_chong: voChong.rows[0] ? { ...voChong.rows[0], vai_tro: vaiTro, so_cccd_vo_chong: vaiTro === 'VO' ? voChong.rows[0].so_cccd_chong : voChong.rows[0].so_cccd_vo, ho_ten_vo_chong: 'Tên giả định' } : null // Thay ho_ten_vo_chong bằng query CONG_DAN nếu cần
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.lyHon = async (req, res) => {
  const { so_cccd_vo, so_cccd_chong } = req.body;
  const queryKetHon = 'UPDATE KET_HON SET TRANG_THAI = ? WHERE SO_CCCD_VO = ? AND SO_CCCD_CHONG = ?';
  const queryByChong = 'UPDATE KET_HON_BY_CHONG SET TRANG_THAI = ? WHERE SO_CCCD_CHONG = ? AND SO_CCCD_VO = ?';
  const updateCongDan = 'UPDATE CONG_DAN SET TINH_TRANG_HON_NHAN = ? WHERE SO_CCCD = ?';
  try {
    await client.batch([
      { query: queryKetHon, params: ['LY_HON', so_cccd_vo, so_cccd_chong] },
      { query: queryByChong, params: ['LY_HON', so_cccd_chong, so_cccd_vo] },
      { query: updateCongDan, params: ['LY_HON', so_cccd_vo] },
      { query: updateCongDan, params: ['LY_HON', so_cccd_chong] }
    ], { prepare: true });
    res.json({ message: 'Ly hôn thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.timKiemKetHon = async (req, res) => {
  const { so_cccd_vo, so_cccd_chong, tinh } = req.query;
  let query = 'SELECT * FROM KET_HON WHERE ';
  const params = [];
  if (so_cccd_vo) { query += 'SO_CCCD_VO = ? '; params.push(so_cccd_vo); }
  if (so_cccd_chong) { query = 'SELECT * FROM KET_HON_BY_CHONG WHERE SO_CCCD_CHONG = ?'; params.push(so_cccd_chong); }
  if (tinh) { query += 'TINH = ? ALLOW FILTERING'; params.push(tinh); }
  try {
    const result = await client.execute(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};