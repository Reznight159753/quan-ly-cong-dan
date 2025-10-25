import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import KetHon from './components/KetHon';
import LyHon from './components/LyHon';
import KhaiSinh from './components/KhaiSinh';
import QuanLyCongDan from './components/QuanLyCongDan';
import ChiTietCongDan from './components/ChiTietCongDan';
import AddCongDan from './components/AddCongDan';
import EditCongDan from './components/EditCongDan';
import ThongKe from './components/ThongKe';
import QuanLyHoKhau from './components/QuanLyHoKhau';
import QuanLyCuTru from './components/QuanLyCuTru';
import QuanLyXe from './components/QuanLyXe';
import QuanLyGiayTo from './components/QuanLyGiayTo';
import DieuTraLyLich from './components/DieuTraLyLich';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/quan-ly-cong-dan" />} />
            <Route path="/add-cong-dan" element={<AddCongDan />} />
            <Route path="/edit-cong-dan/:cccd" element={<EditCongDan />} />
            <Route path="/quan-ly-cong-dan" element={<QuanLyCongDan />} />
            <Route path="/cong-dan/:cccd" element={<ChiTietCongDan />} />
            <Route path="/ket-hon" element={<KetHon />} />
            <Route path="/ly-hon" element={<LyHon />} />
            <Route path="/khai-sinh" element={<KhaiSinh />} />
            <Route path="/thong-ke" element={<ThongKe />} />
            <Route path="/quan-ly-ho-khau" element={<QuanLyHoKhau />} />
            <Route path="/quan-ly-cu-tru" element={<QuanLyCuTru />} />
            <Route path="/quan-ly-xe" element={<QuanLyXe />} />
            <Route path="/quan-ly-giay-to" element={<QuanLyGiayTo />} />
            <Route path="/dieu-tra-ly-lich" element={<DieuTraLyLich />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;