const client = require('../config/database');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

exports.dangKyCCCD = async (req, res) => {
  const { so_cccd, ho_ten, ngay_sinh, gioi_tinh, quoc_tich, que_quan, tinh, huyen, xa } = req.body;
  
  if (!validator.isLength(so_cccd, { min: 12, max: 12 })) {
    return res.status(400).json({ error: 'SO_CCCD phải có 12 số' });
  }
  if (!['Nam', 'Nữ'].includes(gioi_tinh)) {
    return res.status(400).json({ error: 'Giới tính không hợp lệ' });
  }

  const queryCheck = 'SELECT so_cccd FROM CONG_DAN WHERE so_cccd = ?';
  const queryInsert = 'INSERT INTO CONG_DAN (so_cccd, ho_ten, ngay_sinh, gioi_tinh, quoc_tich, que_quan, tinh, huyen, xa, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const queryInsertByTinh = 'INSERT INTO CONG_DAN_BY_TINH (tinh, so_cccd, ho_ten) VALUES (?, ?, ?)';
  
  try {
    const check = await client.execute(queryCheck, [so_cccd], { prepare: true });
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'SO_CCCD đã tồn tại' });
    }
    
    await client.execute(queryInsert, [so_cccd, ho_ten, ngay_sinh, gioi_tinh, quoc_tich, que_quan, tinh, huyen, xa, 'Hợp lệ'], { prepare: true });
    await client.execute(queryInsertByTinh, [tinh, so_cccd, ho_ten], { prepare: true });
    res.status(201).json({ message: 'Đăng ký CCCD thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xemThongTinCCCD = async (req, res) => {
  const { so_cccd } = req.params;
  
  const query = 'SELECT * FROM CONG_DAN WHERE so_cccd = ?';
  try {
    const result = await client.execute(query, [so_cccd], { prepare: true });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công dân' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.capNhatThongTin = async (req, res) => {
  const { so_cccd } = req.params;
  const { ho_ten, ngay_sinh, gioi_tinh, quoc_tich, que_quan, tinh, huyen, xa } = req.body;
  
  const queryUpdate = 'UPDATE CONG_DAN SET ho_ten = ?, ngay_sinh = ?, gioi_tinh = ?, quoc_tich = ?, que_quan = ?, tinh = ?, huyen = ?, xa = ? WHERE so_cccd = ?';
  const queryUpdateByTinh = 'UPDATE CONG_DAN_BY_TINH SET ho_ten = ?, tinh = ? WHERE so_cccd = ?';
  
  try {
    await client.execute(queryUpdate, [ho_ten, ngay_sinh, gioi_tinh, quoc_tich, que_quan, tinh, huyen, xa, so_cccd], { prepare: true });
    await client.execute(queryUpdateByTinh, [ho_ten, tinh, so_cccd], { prepare: true });
    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.xuLyLamLaiMat = async (req, res) => {
  const { so_cccd } = req.params;
  const { trang_thai } = req.body;
  
  const query = 'UPDATE CONG_DAN SET trang_thai = ? WHERE so_cccd = ?';
  try {
    await client.execute(query, [trang_thai, so_cccd], { prepare: true });
    res.json({ message: 'Cập nhật trạng thái CCCD thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.timKiemCongDan = async (req, res) => {
    const { searchType, searchValue } = req.query;

    if (!searchType || !searchValue) {
        // Mặc định trả về danh sách 10 công dân đầu tiên nếu không có tham số
        const defaultQuery = 'SELECT so_cccd, ho_ten, ngay_sinh, gioi_tinh, tinh FROM CONG_DAN LIMIT 10';
        try {
            const result = await client.execute(defaultQuery, [], { prepare: true });
            return res.json(result.rows);
        } catch (err) {
            console.error('Lỗi lấy danh sách mặc định:', err);
            return res.status(500).json({ error: 'Lỗi truy vấn CSDL.' });
        }
    }

    let query = '';
    let params = [];

    // Xây dựng câu lệnh query dựa trên searchType
    switch (searchType) {
        case 'so_cccd':
            // Tìm kiếm chính xác trên Primary Key là nhanh nhất
            query = 'SELECT * FROM CONG_DAN WHERE so_cccd = ?';
            params.push(searchValue);
            break;
        case 'ho_ten':
            // Tìm kiếm trên secondary index, Cassandra không hỗ trợ LIKE, 
            // nên ta sẽ tìm chính xác hoặc phải dùng giải pháp khác (vd: Elaticsearch)
            // Tạm thời ở đây ta tìm kiếm chính xác
            query = 'SELECT * FROM CONG_DAN WHERE ho_ten = ? ALLOW FILTERING';
            params.push(searchValue);
            break;
        case 'nam_sinh':
            // Tìm kiếm trên secondary index
            query = 'SELECT * FROM CONG_DAN WHERE nam_sinh = ? ALLOW FILTERING';
            // Cần chuyển đổi searchValue sang kiểu INT
            const namSinh = parseInt(searchValue, 10);
            if (isNaN(namSinh)) {
                return res.status(400).json({ error: 'Năm sinh phải là một con số.' });
            }
            params.push(namSinh);
            break;
        case 'tinh':
            // Tìm kiếm trên secondary index
            query = 'SELECT * FROM CONG_DAN WHERE tinh = ? ALLOW FILTERING';
            params.push(searchValue);
            break;
        case 'gioi_tinh':
            // Tìm kiếm trên secondary index
            query = 'SELECT * FROM CONG_DAN WHERE gioi_tinh = ? ALLOW FILTERING';
            params.push(searchValue);
            break;
        default:
            return res.status(400).json({ error: 'Loại tìm kiếm không hợp lệ.' });
    }

    try {
        const result = await client.execute(query, params, { prepare: true });
        if (result.rowLength === 0) {
            return res.status(404).json({ message: 'Không tìm thấy công dân nào phù hợp.' });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(`Lỗi khi tìm kiếm theo ${searchType}:`, err);
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tìm kiếm.' });
    }
};

exports.thongKeDanCu = async (req, res) => {
  try {
    // Total citizens
    const totalQuery = 'SELECT COUNT(*) AS count FROM CONG_DAN';
    const totalResult = await client.execute(totalQuery, [], { prepare: true });
    const totalCitizens = Number(totalResult.rows[0].count);
    console.log('Total citizens:', totalCitizens);

    // Citizens by province
    const provinceQuery = 'SELECT tinh, COUNT(*) AS count FROM CONG_DAN_BY_TINH GROUP BY tinh';
    const provinceResult = await client.execute(provinceQuery, [], { prepare: true });
    const citizensByProvince = provinceResult.rows.map(row => ({
      tinh: row.tinh,
      count: Number(row.count)
    }));
    console.log('Citizens by province:', citizensByProvince);

    // Marital status
    const marriedQuery = 'SELECT COUNT(*) AS count FROM KET_HON';
    const marriedResult = await client.execute(marriedQuery, [], { prepare: true });
    const marriedCount = Number(marriedResult.rows[0].count);
    const singleCount = totalCitizens - marriedCount;
    console.log('Married count:', marriedCount, 'Single count:', singleCount);

    res.json({
      total_citizens: totalCitizens,
      citizens_by_province: citizensByProvince,
      marital_status: { married: marriedCount, single: singleCount }
    });
  } catch (err) {
    console.error('Error in thongKeDanCu:', err);
    res.status(500).json({ error: err.message });
  }
};