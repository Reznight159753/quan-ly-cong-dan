import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ThongKe() {
  const [gioiTinh, setGioiTinh] = useState([]);
  const [honNhan, setHonNhan] = useState([]);
  const [doTuoi, setDoTuoi] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gioiTinhRes, honNhanRes, doTuoiRes] = await Promise.all([
          axios.get('http://localhost:5000/api/thongke/gioitinh'),
          axios.get('http://localhost:5000/api/thongke/honnhan'),
          axios.get('http://localhost:5000/api/thongke/dothuoi'),
        ]);
        setGioiTinh(gioiTinhRes.data);
        setHonNhan(honNhanRes.data);
        setDoTuoi(doTuoiRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="content-header">Thống kê Dân số</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-container">
          <h3>Thống kê theo Giới tính</h3>
          {gioiTinh.map((item, index) => (
            <p key={index}>{item.gioi_tinh}: <strong>{item.so_luong.toString()}</strong> người</p>
          ))}
        </div>
        <div className="form-container">
          <h3>Thống kê Tình trạng Hôn nhân</h3>
          {honNhan.map((item, index) => (
            <p key={index}>{item.tinh_trang_hon_nhan}: <strong>{item.so_luong.toString()}</strong> người</p>
          ))}
        </div>
        <div className="form-container" style={{ gridColumn: '1 / -1' }}>
          <h3>Thống kê theo Độ tuổi</h3>
          {Object.entries(doTuoi).map(([key, value]) => (
            <p key={key}>Độ tuổi {key}: <strong>{value}</strong> người</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThongKe;