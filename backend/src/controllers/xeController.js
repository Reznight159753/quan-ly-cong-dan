const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Lấy tất cả xe
const getAllXe = async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM DANG_KY_XE');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

// Đăng ký xe mới
const dangKyXe = async (req, res) => {
  const { SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY } = req.body;
  
  if (!SO_CCCD_CHU_XE || !BIEN_SO || !LOAI_XE || !HANG_XE || !NGAY_DANG_KY) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Kiểm tra xem biển số đã tồn tại chưa
    const checkQuery = 'SELECT * FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?';
    const checkResult = await client.execute(checkQuery, [BIEN_SO], { prepare: true });
    
    if (checkResult.rowLength > 0) {
      return res.status(400).json({ message: 'Biển số xe đã tồn tại trong hệ thống' });
    }

    // Kiểm tra CCCD chủ xe có tồn tại không
    const checkCCCD = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
    const cccdResult = await client.execute(checkCCCD, [SO_CCCD_CHU_XE], { prepare: true });
    
    if (cccdResult.rowLength === 0) {
      return res.status(400).json({ message: 'Số CCCD chủ xe không tồn tại trong hệ thống' });
    }

    // Tạo UUID cho SO_DANG_KY_XE
    const SO_DANG_KY_XE = uuidv4();

    // Thêm xe mới vào cả 3 bảng
    const queries = [
      {
        query: `
          INSERT INTO DANG_KY_XE (SO_DANG_KY_XE, SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        params: [SO_DANG_KY_XE, SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY]
      },
      {
        query: `
          INSERT INTO XE_BY_CHU_XE (SO_CCCD_CHU_XE, BIEN_SO, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        params: [SO_CCCD_CHU_XE, BIEN_SO, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY]
      },
      {
        query: `
          INSERT INTO XE_BY_BIEN_SO (BIEN_SO, SO_CCCD_CHU_XE, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        params: [BIEN_SO, SO_CCCD_CHU_XE, SO_DANG_KY_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY]
      }
    ];

    // Thực thi batch để đảm bảo tính nhất quán
    await client.batch(queries, { prepare: true });
    
    res.status(201).json({ message: 'Đăng ký xe thành công', SO_DANG_KY_XE });
  } catch (error) {
    console.error('Lỗi đăng ký xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

// Tra cứu xe theo biển số
const traCuuXeTheoBienSo = async (req, res) => {
  const { bienso } = req.params;
  
  if (!bienso) {
    return res.status(400).json({ message: 'Vui lòng nhập biển số xe' });
  }

  try {
    const query = 'SELECT * FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?';
    const result = await client.execute(query, [bienso], { prepare: true });
    
    if (result.rowLength > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'Không tìm thấy xe với biển số này' });
    }
  } catch (error) {
    console.error('Lỗi tra cứu xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

// Xóa xe
const xoaXe = async (req, res) => {
  const { bienso } = req.params;
  
  try {
    // Lấy thông tin xe để lấy SO_DANG_KY_XE và SO_CCCD_CHU_XE
    const xeQuery = 'SELECT SO_DANG_KY_XE, SO_CCCD_CHU_XE FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?';
    const xeResult = await client.execute(xeQuery, [bienso], { prepare: true });

    if (xeResult.rowLength === 0) {
      return res.status(404).json({ message: 'Không tìm thấy xe với biển số này' });
    }

    const { SO_DANG_KY_XE, SO_CCCD_CHU_XE } = xeResult.rows[0];

    // Xóa xe khỏi cả 3 bảng
    const queries = [
      {
        query: 'DELETE FROM DANG_KY_XE WHERE SO_DANG_KY_XE = ?',
        params: [SO_DANG_KY_XE]
      },
      {
        query: 'DELETE FROM XE_BY_CHU_XE WHERE SO_CCCD_CHU_XE = ? AND BIEN_SO = ?',
        params: [SO_CCCD_CHU_XE, bienso]
      },
      {
        query: 'DELETE FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?',
        params: [bienso]
      }
    ];

    // Thực thi batch để đảm bảo tính nhất quán
    await client.batch(queries, { prepare: true });
    
    res.json({ message: 'Xóa xe thành công' });
  } catch (error) {
    console.error('Lỗi xóa xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

// Cập nhật thông tin xe
const capNhatXe = async (req, res) => {
  const { so_dang_ky_xe } = req.params;
  const { SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY } = req.body;

  if (!SO_CCCD_CHU_XE || !BIEN_SO || !LOAI_XE || !HANG_XE || !NGAY_DANG_KY) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Kiểm tra xem xe có tồn tại không
    const checkQuery = 'SELECT * FROM DANG_KY_XE WHERE SO_DANG_KY_XE = ?';
    const checkResult = await client.execute(checkQuery, [so_dang_ky_xe], { prepare: true });

    if (checkResult.rowLength === 0) {
      return res.status(404).json({ message: 'Không tìm thấy xe với số đăng ký này' });
    }

    const oldVehicle = checkResult.rows[0];

    // Kiểm tra CCCD chủ xe có tồn tại không
    const checkCCCD = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
    const cccdResult = await client.execute(checkCCCD, [SO_CCCD_CHU_XE], { prepare: true });
    
    if (cccdResult.rowLength === 0) {
      return res.status(400).json({ message: 'Số CCCD chủ xe không tồn tại trong hệ thống' });
    }

    // Nếu biển số thay đổi, kiểm tra xem biển số mới đã tồn tại chưa
    if (BIEN_SO !== oldVehicle.bien_so) {
      const checkBienSo = 'SELECT * FROM XE_BY_BIEN_SO WHERE BIEN_SO = ?';
      const bienSoResult = await client.execute(checkBienSo, [BIEN_SO], { prepare: true });
      
      if (bienSoResult.rowLength > 0) {
        return res.status(400).json({ message: 'Biển số xe đã tồn tại trong hệ thống' });
      }
    }

    // Cập nhật thông tin xe trong cả 3 bảng
    const queries = [
      {
        query: `
          UPDATE DANG_KY_XE 
          SET SO_CCCD_CHU_XE = ?, BIEN_SO = ?, LOAI_XE = ?, HANG_XE = ?, NGAY_DANG_KY = ?
          WHERE SO_DANG_KY_XE = ?
        `,
        params: [SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY, so_dang_ky_xe]
      },
      {
        query: `
          UPDATE XE_BY_CHU_XE 
          SET SO_CCCD_CHU_XE = ?, BIEN_SO = ?, LOAI_XE = ?, HANG_XE = ?, NGAY_DANG_KY = ?
          WHERE SO_DANG_KY_XE = ?
        `,
        params: [SO_CCCD_CHU_XE, BIEN_SO, LOAI_XE, HANG_XE, NGAY_DANG_KY, so_dang_ky_xe]
      },
      {
        query: `
          UPDATE XE_BY_BIEN_SO 
          SET SO_CCCD_CHU_XE = ?, LOAI_XE = ?, HANG_XE = ?, NGAY_DANG_KY = ?
          WHERE BIEN_SO = ?
        `,
        params: [SO_CCCD_CHU_XE, LOAI_XE, HANG_XE, NGAY_DANG_KY, BIEN_SO]
      }
    ];

    // Thực thi batch để đảm bảo tính nhất quán
    await client.batch(queries, { prepare: true });
    
    res.json({ message: 'Cập nhật thông tin xe thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật xe:', error);
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

module.exports = {
  getAllXe,
  dangKyXe,
  traCuuXeTheoBienSo,
  xoaXe,
  capNhatXe
};