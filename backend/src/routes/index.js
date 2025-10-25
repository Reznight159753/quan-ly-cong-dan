// Modified routes/index.js
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
const thongKeController = require('../controllers/thongKeController');

// ============ CÔNG DÂN ============
router.get('/congdan', congDanController.getAllCongDan);
router.post('/congdan', congDanController.createCongDan);
router.get('/congdan/search', congDanController.searchCongDan);
router.get('/congdan/lylich3doi/:id', congDanController.dieuTraLyLich3Doi);
router.get('/congdan/:id', congDanController.getCongDanById);
router.put('/congdan/:id', congDanController.updateCongDan);
router.delete('/congdan/:id', congDanController.deleteCongDan);

// ============ THỐNG KÊ ============
router.get('/thongke/gioitinh', thongKeController.thongKeTheoGioiTinh);
router.get('/thongke/dotuoi', thongKeController.thongKeTheoDoTuoi);
router.get('/thongke/honnhan', thongKeController.thongKeTheoTinhTrangHonNhan);
router.get('/thongke/tinh', thongKeController.thongKeTheoTinh);
router.get('/thongke/nghenghiep', thongKeController.thongKeTheoNgheNghiep);
router.get('/thongke/trangthaicccd', thongKeController.thongKeTheoTrangThaiCCCD);
router.get('/thongke/kethonnam', thongKeController.thongKeKetHonTheoNam);
router.get('/thongke/kethontinh', thongKeController.thongKeKetHonTheoTinh);
router.get('/thongke/lyhonnam', thongKeController.thongKeLyHonTheoNam);
router.get('/thongke/xeloai', thongKeController.thongKeXeTheoLoai);
router.get('/thongke/xehang', thongKeController.thongKeXeTheoHang);
router.get('/thongke/xenam', thongKeController.thongKeXeTheoNam);
router.get('/thongke/truloai', thongKeController.thongKeTruTheoLoai);
router.get('/thongke/trutrangthai', thongKeController.thongKeTruTheoTrangThai);
router.get('/thongke/trutinh', thongKeController.thongKeTruTheoTinh);
router.get('/thongke/sinhnam', thongKeController.thongKeSinhTheoNam);
router.get('/thongke/sinhnoi', thongKeController.thongKeSinhTheoNoi);
router.get('/thongke/tunam', thongKeController.thongKeTuTheoNam);
router.get('/thongke/tunguyennhan', thongKeController.thongKeTuTheoNguyenNhan);
router.get('/thongke/tunoi', thongKeController.thongKeTuTheoNoi);
router.get('/thongke/hokhautinh', thongKeController.thongKeHoKhauTheoTinh);
router.get('/thongke/hokhaukichthuoc', thongKeController.thongKeKichThuocHoKhau);
router.get('/thongke/taikhoanrole', thongKeController.thongKeTaiKhoanTheoRole);

// ============ TÀI KHOẢN ============
router.post('/taikhoan/login', taiKhoanController.login);

// ============ HỘ KHẨU ============
router.get('/hokhau', hoKhauController.getAllHoKhau);
router.post('/hokhau', hoKhauController.dangKyHoKhau);
router.put('/hokhau/:sohokhau', hoKhauController.capNhatHoKhau);
router.delete('/hokhau/:sohokhau', hoKhauController.deleteHoKhau);

// ============ TẠM TRÚ, TẠM VẮNG ============
router.get('/tru/tamtru', truController.getAllTamTru);
router.get('/tru/tamvang', truController.getAllTamVang);
router.post('/tru', truController.dangKyTru);
router.get('/tru/tracuu/:cccd', truController.traCuuTru);

// ============ XE ============
router.get('/xe', xeController.getAllXe);
router.post('/xe', xeController.dangKyXe);
router.get('/xe/tracuu/:bienso', xeController.traCuuXeTheoBienSo);
router.delete('/xe/:bienso', xeController.xoaXe);

// ============ GIẤY TỜ ============
router.get('/giayto/chungtu', giayToController.getAllChungTu);
router.post('/giayto/chungtu', giayToController.dangKyChungTu);

// ============ HÔN NHÂN & GIA ĐÌNH ============
router.get('/kethon', ketHonController.getAllKetHon);
router.post('/kethon', ketHonController.createKetHon);
router.post('/lyhon', lyHonController.createLyHon);

// ============ KHAI SINH ============
router.get('/khaisinh', giayToController.getAllKhaiSinh);
router.post('/khaisinh', khaiSinhController.createKhaiSinh);
router.put('/khaisinh/:so_giay', khaiSinhController.updateKhaiSinh);
router.delete('/khaisinh/:so_giay', khaiSinhController.deleteKhaiSinh);

module.exports = router;