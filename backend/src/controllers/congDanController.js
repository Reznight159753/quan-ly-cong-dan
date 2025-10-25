// Modified congDanController.js
const { client } = require('../config/database');

// Tất cả câu truy vấn đã được đổi sang chữ thường
const getAllCongDan = async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM cong_dan');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

const getCongDanById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.execute('SELECT * FROM cong_dan WHERE so_cccd = ?', [id]);
    if (result.rowLength > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy công dân' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

const createCongDan = async (req, res) => {
  const { SO_CCCD, HO_TEN, NGAY_SINH, NAM_SINH, QUE_QUAN, GIOI_TINH, DIA_CHI_THUONG_TRU, TINH, PHUONG, NGHE_NGHIEP, TINH_TRANG_HON_NHAN, SO_DIEN_THOAI, TRANG_THAI_CCCD } = req.body;
  try {
    const query = 'INSERT INTO cong_dan (so_cccd, ho_ten, ngay_sinh, nam_sinh, que_quan, gioi_tinh, dia_chi_thuong_tru, tinh, phuong, nghe_nghiep, tinh_trang_hon_nhan, so_dien_thoai, trang_thai_cccd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await client.execute(query, [SO_CCCD, HO_TEN, NGAY_SINH, NAM_SINH, QUE_QUAN, GIOI_TINH, DIA_CHI_THUONG_TRU, TINH, PHUONG, NGHE_NGHIEP, TINH_TRANG_HON_NHAN, SO_DIEN_THOAI, TRANG_THAI_CCCD], { prepare: true });
    res.status(201).json({ message: 'Tạo công dân thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

const updateCongDan = async (req, res) => {
    const { id } = req.params;
    const { HO_TEN, NGAY_SINH, NAM_SINH, QUE_QUAN, GIOI_TINH, DIA_CHI_THUONG_TRU, TINH, PHUONG, NGHE_NGHIEP, TINH_TRANG_HON_NHAN, SO_DIEN_THOAI, TRANG_THAI_CCCD } = req.body;
    try {
        const query = 'UPDATE cong_dan SET ho_ten = ?, ngay_sinh = ?, nam_sinh = ?, que_quan = ?, gioi_tinh = ?, dia_chi_thuong_tru = ?, tinh = ?, phuong = ?, nghe_nghiep = ?, tinh_trang_hon_nhan = ?, so_dien_thoai = ?, trang_thai_cccd = ? WHERE so_cccd = ?';
        await client.execute(query, [HO_TEN, NGAY_SINH, NAM_SINH, QUE_QUAN, GIOI_TINH, DIA_CHI_THUONG_TRU, TINH, PHUONG, NGHE_NGHIEP, TINH_TRANG_HON_NHAN, SO_DIEN_THOAI, TRANG_THAI_CCCD, id], { prepare: true });
        res.json({ message: 'Cập nhật thông tin công dân thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const deleteCongDan = async (req, res) => {
    const { id } = req.params;
    try {
        await client.execute('DELETE FROM cong_dan WHERE so_cccd = ?', [id]);
        res.json({ message: 'Xóa công dân thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const searchCongDan = async (req, res) => {
    const { term } = req.query;
    if (!term) {
        return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm.' });
    }

    try {
        const queryById = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
        const resultById = await client.execute(queryById, [term], { prepare: true });

        if (resultById.rowLength > 0) {
            return res.json(resultById.rows);
        }

        const queryByName = "SELECT * FROM cong_dan WHERE ho_ten LIKE ? ALLOW FILTERING";
        const resultByName = await client.execute(queryByName, ['%' + term + '%'], { prepare: true });

        if (resultByName.rowLength > 0) {
            return res.json(resultByName.rows);
        }

        res.json([]);

    } catch (error) {
        console.error("Lỗi khi tìm kiếm công dân:", error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// ĐIỀU TRA LÝ LỊCH 3 ĐỜI
const parseChaMe = (chaMeStr) => {
  const result = { so_cccd_cha: null, so_cccd_me: null };
  if (!chaMeStr) return result;

  const parts = chaMeStr.split(', ');
  parts.forEach(part => {
    if (part.startsWith('CHA:')) {
      result.so_cccd_cha = part.replace('CHA:', '').trim().split(' ')[0]; // Lấy CCCD cha
    } else if (part.startsWith('ME:')) {
      result.so_cccd_me = part.replace('ME:', '').trim().split(' ')[0]; // Lấy CCCD mẹ
    }
  });
  return result;
};

const dieuTraLyLich3Doi = async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy thông tin công dân chính
    const congDanQuery = 'SELECT so_cccd, ho_ten, ngay_sinh, gioi_tinh, que_quan, nghe_nghiep, tinh_trang_hon_nhan FROM cong_dan WHERE so_cccd = ?';
    const congDanResult = await client.execute(congDanQuery, [id], { prepare: true });

    if (congDanResult.rowLength === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công dân' });
    }

    const congDan = congDanResult.rows[0];

    let lyLich = {
      congDan: congDan,
      cha: null,
      me: null,
      ongNoi: null,
      baNoi: null,
      ongNgoai: null,
      baNgoai: null
    };

    // Tìm cha mẹ (Đời 1) từ GIAY_KHAI_SINH
    const khaiSinhQuery = 'SELECT so_cccd_cha, so_cccd_me FROM giay_khai_sinh WHERE so_giay = ? ALLOW FILTERING';
    const khaiSinhResult = await client.execute(khaiSinhQuery, [id], { prepare: true });

    if (khaiSinhResult.rowLength > 0) {
      const { so_cccd_cha, so_cccd_me } = khaiSinhResult.rows[0];

      // Lấy thông tin chi tiết cha
      if (so_cccd_cha) {
        const chaResult = await client.execute(congDanQuery, [so_cccd_cha], { prepare: true });
        if (chaResult.rowLength > 0) {
          lyLich.cha = chaResult.rows[0];

          // Tìm ông bà nội (Đời 2 - cha mẹ của cha)
          const ongBaNoiResult = await client.execute(khaiSinhQuery, [so_cccd_cha], { prepare: true });
          if (ongBaNoiResult.rowLength > 0) {
            const { so_cccd_cha: so_cccd_ong_noi, so_cccd_me: so_cccd_ba_noi } = ongBaNoiResult.rows[0];

            if (so_cccd_ong_noi) {
              const ongNoiResult = await client.execute(congDanQuery, [so_cccd_ong_noi], { prepare: true });
              if (ongNoiResult.rowLength > 0) lyLich.ongNoi = ongNoiResult.rows[0];
            }

            if (so_cccd_ba_noi) {
              const baNoiResult = await client.execute(congDanQuery, [so_cccd_ba_noi], { prepare: true });
              if (baNoiResult.rowLength > 0) lyLich.baNoi = baNoiResult.rows[0];
            }
          }
        }
      }

      // Lấy thông tin chi tiết mẹ
      if (so_cccd_me) {
        const meResult = await client.execute(congDanQuery, [so_cccd_me], { prepare: true });
        if (meResult.rowLength > 0) {
          lyLich.me = meResult.rows[0];

          // Tìm ông bà ngoại (Đời 2 - cha mẹ của mẹ)
          const ongBaNgoaiResult = await client.execute(khaiSinhQuery, [so_cccd_me], { prepare: true });
          if (ongBaNgoaiResult.rowLength > 0) {
            const { so_cccd_cha: so_cccd_ong_ngoai, so_cccd_me: so_cccd_ba_ngoai } = ongBaNgoaiResult.rows[0];

            if (so_cccd_ong_ngoai) {
              const ongNgoaiResult = await client.execute(congDanQuery, [so_cccd_ong_ngoai], { prepare: true });
              if (ongNgoaiResult.rowLength > 0) lyLich.ongNgoai = ongNgoaiResult.rows[0];
            }

            if (so_cccd_ba_ngoai) {
              const baNgoaiResult = await client.execute(congDanQuery, [so_cccd_ba_ngoai], { prepare: true });
              if (baNgoaiResult.rowLength > 0) lyLich.baNgoai = baNgoaiResult.rows[0];
            }
          }
        }
      }
    }

    res.json(lyLich);

  } catch (error) {
    console.error("Lỗi khi điều tra lý lịch:", error);
    res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
  }
};

module.exports = {
  getAllCongDan,
  getCongDanById,
  createCongDan,
  updateCongDan,
  deleteCongDan,
  searchCongDan,
  dieuTraLyLich3Doi
};