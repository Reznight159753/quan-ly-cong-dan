// Updated thongKeController.js
const { client } = require('../config/database');

// Thống kê theo giới tính 
const thongKeTheoGioiTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT gioi_tinh FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.gioi_tinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
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
            const key = row.tinh_trang_hon_nhan || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
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

// Thống kê theo tỉnh
const thongKeTheoTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT tinh FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.tinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            tinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê theo nghề nghiệp
const thongKeTheoNgheNghiep = async (req, res) => {
    try {
        const result = await client.execute('SELECT nghe_nghiep FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.nghe_nghiep || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nghe_nghiep: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê theo trạng thái CCCD
const thongKeTheoTrangThaiCCCD = async (req, res) => {
    try {
        const result = await client.execute('SELECT trang_thai_cccd FROM cong_dan');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.trang_thai_cccd || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            trang_thai_cccd: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê kết hôn theo năm
const thongKeKetHonTheoNam = async (req, res) => {
    try {
        const result = await client.execute('SELECT ngay_dang_ky FROM ket_hon');
        const thongKe = {};
        result.rows.forEach(row => {
            if (row.ngay_dang_ky) {
                const nam = row.ngay_dang_ky.year;
                thongKe[nam] = (thongKe[nam] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nam: parseInt(key),
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê kết hôn theo tỉnh
const thongKeKetHonTheoTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT tinh FROM ket_hon');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.tinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            tinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê ly hôn theo năm
const thongKeLyHonTheoNam = async (req, res) => {
    try {
        const result = await client.execute('SELECT ngay_ly_hon FROM ly_hon');
        const thongKe = {};
        result.rows.forEach(row => {
            if (row.ngay_ly_hon) {
                const nam = row.ngay_ly_hon.year;
                thongKe[nam] = (thongKe[nam] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nam: parseInt(key),
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê xe theo loại
const thongKeXeTheoLoai = async (req, res) => {
    try {
        const result = await client.execute('SELECT loai_xe FROM dang_ky_xe');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.loai_xe || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            loai_xe: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê xe theo hãng
const thongKeXeTheoHang = async (req, res) => {
    try {
        const result = await client.execute('SELECT hang_xe FROM dang_ky_xe');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.hang_xe || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            hang_xe: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê xe theo năm đăng ký
const thongKeXeTheoNam = async (req, res) => {
    try {
        const result = await client.execute('SELECT ngay_dang_ky FROM dang_ky_xe');
        const thongKe = {};
        result.rows.forEach(row => {
            if (row.ngay_dang_ky) {
                const nam = row.ngay_dang_ky.year;
                thongKe[nam] = (thongKe[nam] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nam: parseInt(key),
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê trú theo loại
const thongKeTruTheoLoai = async (req, res) => {
    try {
        const result = await client.execute('SELECT loai_tru FROM tru');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.loai_tru || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            loai_tru: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê trú theo trạng thái
const thongKeTruTheoTrangThai = async (req, res) => {
    try {
        const result = await client.execute('SELECT trang_thai FROM tru');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.trang_thai || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            trang_thai: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê trú theo tỉnh
const thongKeTruTheoTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT tinh FROM tru');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.tinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            tinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê sinh theo năm
const thongKeSinhTheoNam = async (req, res) => {
    try {
        const result = await client.execute('SELECT ngay_sinh FROM giay_khai_sinh');
        const thongKe = {};
        result.rows.forEach(row => {
            if (row.ngay_sinh) {
                const nam = row.ngay_sinh.year;
                thongKe[nam] = (thongKe[nam] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nam: parseInt(key),
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê sinh theo nơi
const thongKeSinhTheoNoi = async (req, res) => {
    try {
        const result = await client.execute('SELECT noi_sinh FROM giay_khai_sinh');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.noi_sinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            noi_sinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê tử theo năm
const thongKeTuTheoNam = async (req, res) => {
    try {
        const result = await client.execute('SELECT ngay_mat FROM giay_chung_tu');
        const thongKe = {};
        result.rows.forEach(row => {
            if (row.ngay_mat) {
                const nam = row.ngay_mat.year;
                thongKe[nam] = (thongKe[nam] || 0) + 1;
            }
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nam: parseInt(key),
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê tử theo nguyên nhân
const thongKeTuTheoNguyenNhan = async (req, res) => {
    try {
        const result = await client.execute('SELECT nguyen_nhan FROM giay_chung_tu');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.nguyen_nhan || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            nguyen_nhan: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê tử theo nơi
const thongKeTuTheoNoi = async (req, res) => {
    try {
        const result = await client.execute('SELECT noi_mat FROM giay_chung_tu');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.noi_mat || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            noi_mat: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê hộ khẩu theo tỉnh
const thongKeHoKhauTheoTinh = async (req, res) => {
    try {
        const result = await client.execute('SELECT tinh FROM ho_khau');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.tinh || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            tinh: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê kích thước hộ khẩu
const thongKeKichThuocHoKhau = async (req, res) => {
    try {
        const result = await client.execute('SELECT danh_sach_thanh_vien FROM ho_khau');
        let total = 0;
        let count = result.rowLength;

        result.rows.forEach(row => {
            // Handle danh_sach_thanh_vien as a SET<TEXT>
            const thanhVien = row.danh_sach_thanh_vien ? Array.from(row.danh_sach_thanh_vien) : [];
            total += thanhVien.length;
        });

        const average = count > 0 ? total / count : 0;

        res.json({
            so_ho_khau: count,
            kich_thuoc_trung_binh: average
        });
    } catch (error) {
        console.error("Lỗi khi thống kê kích thước hộ khẩu:", error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

// Thống kê tài khoản theo role
const thongKeTaiKhoanTheoRole = async (req, res) => {
    try {
        const result = await client.execute('SELECT role FROM tai_khoan');
        const thongKe = {};
        result.rows.forEach(row => {
            const key = row.role || 'Unknown';
            thongKe[key] = (thongKe[key] || 0) + 1;
        });
        const formattedResult = Object.entries(thongKe).map(([key, value]) => ({
            role: key,
            so_luong: value
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

module.exports = {
  thongKeTheoGioiTinh,
  thongKeTheoDoTuoi,
  thongKeTheoTinhTrangHonNhan,
  thongKeTheoTinh,
  thongKeTheoNgheNghiep,
  thongKeTheoTrangThaiCCCD,
  thongKeKetHonTheoNam,
  thongKeKetHonTheoTinh,
  thongKeLyHonTheoNam,
  thongKeXeTheoLoai,
  thongKeXeTheoHang,
  thongKeXeTheoNam,
  thongKeTruTheoLoai,
  thongKeTruTheoTrangThai,
  thongKeTruTheoTinh,
  thongKeSinhTheoNam,
  thongKeSinhTheoNoi,
  thongKeTuTheoNam,
  thongKeTuTheoNguyenNhan,
  thongKeTuTheoNoi,
  thongKeHoKhauTheoTinh,
  thongKeKichThuocHoKhau,
  thongKeTaiKhoanTheoRole
};