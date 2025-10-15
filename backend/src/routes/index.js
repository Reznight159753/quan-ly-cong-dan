const express = require('express');
const router = express.Router();

const congDanController = require('../controllers/congDanController');
const taiKhoanController = require('../controllers/taiKhoanController');
const hoKhauController = require('../controllers/hoKhauController');
const truController = require('../controllers/truController');
const xeController = require('../controllers/xeController');
const giayToController = require('../controllers/giayToController');
const ketHonController = require('../controllers/ketHonController');
const lyHonController = require('../controllers/lyHonController');
const khaiSinhController = require('../controllers/khaiSinhController');

// Công dân
router.get('/congdan', congDanController.getAllCongDan);
router.post('/congdan', congDanController.createCongDan);
router.get('/congdan/search', congDanController.searchCongDan);
router.get('/congdan/:id', congDanController.getCongDanById);
router.put('/congdan/:id', congDanController.updateCongDan);
router.delete('/congdan/:id', congDanController.deleteCongDan);

// Thống kê
router.get('/thongke/gioitinh', congDanController.thongKeTheoGioiTinh);
router.get('/thongke/dothuoi', congDanController.thongKeTheoDoTuoi);
router.get('/thongke/honnhan', congDanController.thongKeTheoTinhTrangHonNhan);

// Tài khoản
router.post('/taikhoan/login', taiKhoanController.login);

// Hộ khẩu
router.get('/hokhau', hoKhauController.getAllHoKhau);
router.post('/hokhau', hoKhauController.dangKyHoKhau);
router.put('/hokhau/:sohokhau', hoKhauController.capNhatHoKhau);

// Tạm trú, Tạm vắng
router.get('/tru/tamtru', truController.getAllTamTru);
router.get('/tru/tamvang', truController.getAllTamVang);
router.post('/tru', truController.dangKyTru);
router.get('/tru/tracuu/:cccd', truController.traCuuTru);

// Xe
router.get('/xe', xeController.getAllXe);
router.post('/xe', xeController.dangKyXe);
router.get('/xe/tracuu/:bienso', xeController.traCuuXeTheoBienSo);
// Giấy tờ
router.get('/giayto/khaisinh', giayToController.getAllKhaiSinh);
router.get('/giayto/chungtu', giayToController.getAllChungTu);
router.post('/giayto/chungtu', giayToController.dangKyChungTu);

// Hôn nhân & Gia đình
router.get('/kethon', ketHonController.getAllKetHon);
router.post('/kethon', ketHonController.createKetHon);
router.post('/lyhon', lyHonController.createLyHon);
router.post('/khaisinh', khaiSinhController.createKhaiSinh);

module.exports = router;