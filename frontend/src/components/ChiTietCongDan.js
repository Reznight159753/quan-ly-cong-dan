import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChiTietCongDan() {
  const { cccd } = useParams(); // Lấy CCCD từ URL
  const [congDan, setCongDan] = useState(null);
  const [giaDinh, setGiaDinh] = useState({ voChong: null, con: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin công dân
        const congDanRes = await axios.get(`http://localhost:5000/api/congdan/${cccd}`);
        const currentCongDan = congDanRes.data;
        setCongDan(currentCongDan);

        let familyInfo = { voChong: null, con: [] };

        // 2. Nếu đã kết hôn, tìm thông tin vợ/chồng
        if (currentCongDan.tinh_trang_hon_nhan === 'KET_HON') {
          const ketHonRes = await axios.get('http://localhost:5000/api/kethon');
          const honNhan = ketHonRes.data.find(
            h => (h.so_cccd_chong === cccd || h.so_cccd_vo === cccd) && h.trang_thai === 'KET_HON'
          );

          if (honNhan) {
            const cccdVochong = honNhan.so_cccd_chong === cccd ? honNhan.so_cccd_vo : honNhan.so_cccd_chong;
            const voChongRes = await axios.get(`http://localhost:5000/api/congdan/${cccdVochong}`);
            familyInfo.voChong = voChongRes.data;
          }
        }

        // 3. Tìm thông tin các con
        const khaiSinhRes = await axios.get('http://localhost:5000/api/giayto/khaisinh');
        const dsConCCCD = khaiSinhRes.data
            .filter(ks => ks.so_cccd_cha === cccd || ks.so_cccd_me === cccd)
            .map(ks => ks.so_cccd);

        if (dsConCCCD.length > 0) {
            const conPromises = dsConCCCD.map(conCCCD => axios.get(`http://localhost:5000/api/congdan/${conCCCD}`));
            const conResponses = await Promise.all(conPromises);
            familyInfo.con = conResponses.map(res => res.data);
        }
        
        setGiaDinh(familyInfo);

      } catch (error) {
        console.error("Lỗi khi tải chi tiết công dân:", error);
        alert('Không thể tải thông tin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cccd]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!congDan) {
    return <div>Không tìm thấy công dân.</div>;
  }

  return (
    <div>
      <h2 className="content-header">Chi Tiết Công Dân</h2>
      <div className="form-container">
        <h3>Thông tin cá nhân</h3>
        <p><strong>Họ và tên:</strong> {congDan.ho_ten}</p>
        <p><strong>Số CCCD:</strong> {congDan.so_cccd}</p>
        <p><strong>Năm sinh:</strong> {congDan.nam_sinh}</p>
        <p><strong>Giới tính:</strong> {congDan.gioi_tinh}</p>
        <p><strong>Quê quán:</strong> {congDan.que_quan}</p>
        <p><strong>Tình trạng hôn nhân:</strong> {congDan.tinh_trang_hon_nhan}</p>
      </div>

      <div className="form-container" style={{ marginTop: '20px' }}>
        <h3>Thông tin gia đình</h3>
        {giaDinh.voChong ? (
            <p><strong>Vợ/Chồng:</strong> {giaDinh.voChong.ho_ten} ({giaDinh.voChong.so_cccd})</p>
        ) : (
            <p><strong>Vợ/Chồng:</strong> Không có</p>
        )}

        <strong>Các con:</strong>
        {giaDinh.con.length > 0 ? (
          <ul>
            {giaDinh.con.map(c => (
              <li key={c.so_cccd}>{c.ho_ten} ({c.so_cccd})</li>
            ))}
          </ul>
        ) : (
          <p>Chưa có thông tin.</p>
        )}
      </div>
    </div>
  );
}

export default ChiTietCongDan;