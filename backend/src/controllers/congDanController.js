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
        // Ưu tiên tìm kiếm theo Số CCCD trước (vì đây là khóa chính, rất nhanh)
        const queryById = 'SELECT * FROM cong_dan WHERE so_cccd = ?';
        const resultById = await client.execute(queryById, [term], { prepare: true });

        if (resultById.rowLength > 0) {
            // Nếu tìm thấy bằng CCCD, trả về kết quả ngay lập tức
            return res.json(resultById.rows);
        }

        // Nếu không tìm thấy bằng CCCD, tiếp tục tìm kiếm theo Họ Tên
        const queryByName = "SELECT * FROM cong_dan WHERE ho_ten LIKE ? ALLOW FILTERING";
        const resultByName = await client.execute(queryByName, ['%' + term + '%'], { prepare: true });

        if (resultByName.rowLength > 0) {
            return res.json(resultByName.rows);
        }

        res.json([]); // Trả về một mảng rỗng nếu không tìm thấy kết quả 

    } catch (error) {
        console.error("Lỗi khi tìm kiếm công dân:", error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê theo giới tính 
const thongKeTheoGioiTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT gioi_tinh FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const gioiTinh = row.gioi_tinh;
            if (gioiTinh) {
                thongKe[gioiTinh] = (thongKe[gioiTinh] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            gioi_tinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê theo độ tuổi 
const thongKeTheoDoTuoi = async (req, res) => {
    try {
        const result = await client.execute('SELECT nam_sinh FROM cong_dan');
        const namHienTai = new Date().getFullYear();
        const thongKe = { 'Duoi 18': 0, '18-30': 0, '31-50': 0, 'Tren 50': 0 };
        result.rows.forEach(row => {
            const tuoi = namHienTai - row.nam_sinh;
            if (tuoi < 18) thongKe['Duoi 18']++;
            else if (tuoi <= 30) thongKe['18-30']++;
            else if (tuoi <= 50) thongKe['31-50']++;
            else thongKe['Tren 50']++;
        });
        res.json(thongKe);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê theo tình trạng hôn nhân 
const thongKeTheoTinhTrangHonNhan = async (req, res) => {
    try {
        const result = await client.execute('SELECT tinh_trang_hon_nhan FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const honNhan = row.tinh_trang_hon_nhan;
            if (honNhan) {
                thongKe[honNhan] = (thongKe[honNhan] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            tinh_trang_hon_nhan: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
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
  thongKeTheoGioiTinh,
  thongKeTheoDoTuoi,
  thongKeTheoTinhTrangHonNhan
};
