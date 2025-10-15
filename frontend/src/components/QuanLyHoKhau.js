import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuanLyHoKhau() {
  const [hoKhauList, setHoKhauList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ SO_HO_KHAU: '', CHU_HO: '', DANH_SACH_THANH_VIEN_STR: '', DIA_CHI: '', TINH: '' });

  const fetchHoKhau = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hokhau');
      setHoKhauList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hộ khẩu:", error);
    }
  };

  useEffect(() => { fetchHoKhau(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Chuyển chuỗi CCCD thành mảng
    const danh_sach_thanh_vien = formData.DANH_SACH_THANH_VIEN_STR.split(',').map(cccd => cccd.trim());
    const dataToSubmit = { ...formData, DANH_SACH_THANH_VIEN: danh_sach_thanh_vien };
    delete dataToSubmit.DANH_SACH_THANH_VIEN_STR;

    try {
      await axios.post('http://localhost:5000/api/hokhau', dataToSubmit);
      alert('Tạo hộ khẩu thành công!');
      setIsAdding(false);
      fetchHoKhau();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="content-header" style={{ border: 'none', marginBottom: 0 }}>Danh sách Hộ khẩu</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="submit-button" style={{ width: 'auto', marginBottom: '20px' }}>
          {isAdding ? 'Hủy' : 'Thêm Hộ khẩu'}
        </button>
      </div>
      
      {isAdding && (
        <div className="form-container" style={{maxWidth: '100%', marginBottom: '30px'}}>
          <h3>Thêm hộ khẩu mới</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Số Hộ khẩu</label><input name="SO_HO_KHAU" onChange={handleChange} required /></div>
            <div className="form-group"><label>CCCD Chủ hộ</label><input name="CHU_HO" onChange={handleChange} required /></div>
            <div className="form-group"><label>Địa chỉ</label><input name="DIA_CHI" onChange={handleChange} required /></div>
            <div className="form-group"><label>Tỉnh/Thành</label><input name="TINH" onChange={handleChange} required /></div>
            <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Danh sách CCCD thành viên (cách nhau bởi dấu phẩy)</label><input name="DANH_SACH_THANH_VIEN_STR" onChange={handleChange} /></div>
            <button type="submit" className="submit-button">Lưu</button>
          </form>
        </div>
      )}

      <table className="data-table">
        <thead><tr><th>Số Hộ Khẩu</th><th>CCCD Chủ Hộ</th><th>Địa chỉ</th><th>Thành viên</th></tr></thead>
        <tbody>
          {hoKhauList.map((hk) => (
            <tr key={hk.so_ho_khau}>
              <td>{hk.so_ho_khau}</td>
              <td>{hk.chu_ho}</td>
              <td>{hk.dia_chi}</td>
              <td>{hk.danh_sach_thanh_vien?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLyHoKhau;