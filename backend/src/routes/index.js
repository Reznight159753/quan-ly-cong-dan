const express = require('express');
const congDanController = require('../controllers/congDanController');
const ketHonController = require('../controllers/ketHonController');
const xeController = require('../controllers/xeController');
const truController = require('../controllers/truController');
const giayToController = require('../controllers/giayToController');
const hoKhauController = require('../controllers/hoKhauController');
const taiKhoanController = require('../controllers/taiKhoanController');

const router = express.Router();

// Tài khoản
router.post('/taikhoan/dangky', taiKhoanController.dangKyTaiKhoan);
router.post('/taikhoan/dangky-admin', taiKhoanController.dangKyTaiKhoanAdmin);
router.post('/taikhoan/dangnhap', taiKhoanController.dangNhap);

// Công dân
router.post('/congdan/dangky', congDanController.dangKyCCCD);
router.get('/congdan/:so_cccd', congDanController.xemThongTinCCCD);
router.put('/congdan/:so_cccd/capnhat', congDanController.capNhatThongTin);
router.put('/congdan/:so_cccd/xuly-cccd', congDanController.xuLyLamLaiMat);
router.get('/congdan/timkiem', congDanController.timKiemCongDan);
router.get('/congdan/thongke', congDanController.thongKeDanCu);

// Kết hôn
router.post('/kethon/dangky', ketHonController.dangKyKetHon);
router.get('/kethon/:so_cccd', ketHonController.xemTinhTrangHonNhan);
router.put('/kethon/lyhon', ketHonController.lyHon);
router.get('/kethon/timkiem', ketHonController.timKiemKetHon);

// Xe
router.post('/xe/dangky', xeController.dangKyXe);
router.get('/xe/chuxe/:so_cccd_chu_xe', xeController.traCuuXeTheoChuXe);
router.get('/xe/bien/:bien_so', xeController.traCuuXeTheoBienSo);

// Trú
router.post('/tru/dangky', truController.dangKyTru);
router.get('/tru/:so_cccd', truController.traCuuTru);

// Giấy khai sinh/chứng tử
router.post('/giay/khaisinh', giayToController.dangKyKhaiSinh);
router.post('/giay/chungtu', giayToController.dangKyChungTu);
router.get('/giay/khaisinh/:so_giay', giayToController.xemKhaiSinh);
router.get('/giay/chungtu/:so_giay', giayToController.xemChungTu);

// Hộ khẩu
router.post('/hokhau/dangky', hoKhauController.dangKyHoKhau);
router.get('/hokhau/:so_ho_khau', hoKhauController.xemHoKhau);
router.put('/hokhau/:so_ho_khau/capnhat', hoKhauController.capNhatHoKhau);

module.exports = router;