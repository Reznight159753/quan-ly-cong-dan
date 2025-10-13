const client = require('../config/database');

exports.dangKyTru = async (req, res) => {
  const { SO_CCCD, LOAI_TRU, NOI_TRU, TU_NGAY, DEN_NGAY, TINH, TRANG_THAI = 'HOAT_DONG' } = req.body;
  const query = 'INSERT INTO TRU (SO_CCCD, LOAI_TRU, NOI_TRU, TU_NGAY, DEN_NGAY, TINH, TRANG_THAI) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    await client.execute(query, [SO_CCCD, LOAI_TRU, NOI_TRU, TU_NGAY, DEN_NGAY || null, TINH, TRANG_THAI]);
    res.status(201).json({ message: 'Đăng ký trú thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.traCuuTru = async (req, res) => {
  const { so_cccd } = req.params;
  const { tinh, trang_thai } = req.query;
  let query = 'SELECT * FROM TRU WHERE SO_CCCD = ?';
  const params = [so_cccd];
  if (tinh) { query += ' AND TINH = ?'; params.push(tinh); }
  if (trang_thai) { query += ' AND TRANG_THAI = ?'; params.push(trang_thai); }
  query += ' ALLOW FILTERING';
  try {
    const result = await client.execute(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};