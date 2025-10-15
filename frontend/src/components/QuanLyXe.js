import React, { useState } from 'react';
import axios from 'axios';

function QuanLyXe() {
  const [formData, setFormData] = useState({ SO_CCCD_CHU_XE: '', BIEN_SO: '', LOAI_XE: '', HANG_XE: '', NGAY_DANG_KY: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/xe', formData);
      alert(response.data.message);
      e.target.reset(); // Xóa form sau khi đăng ký
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/xe/tracuu/${searchTerm}`);
      if (response.data.length > 0) {
        setSearchResult(response.data[0]); // Lấy kết quả đầu tiên
      } else {
        alert('Không tìm thấy xe với biển số này.');
      }
    } catch (error) {
       alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Quản lý Xe</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="form-container">
          <h3>Đăng ký xe mới</h3>
          <form onSubmit={handleRegister}>
            <div className="form-group"><label>CCCD Chủ xe</label><input name="SO_CCCD_CHU_XE" onChange={handleChange} required /></div>
            <div className="form-group"><label>Biển số</label><input name="BIEN_SO" onChange={handleChange} required /></div>
            <div className="form-group"><label>Loại xe</label><input name="LOAI_XE" onChange={handleChange} required /></div>
            <div className="form-group"><label>Hãng xe</label><input name="HANG_XE" onChange={handleChange} required /></div>
            <div className="form-group"><label>Ngày đăng ký</label><input name="NGAY_DANG_KY" type="date" onChange={handleChange} required /></div>
            <button type="submit" className="submit-button">Đăng ký</button>
          </form>
        </div>

        <div className="form-container">
          <h3>Tra cứu xe</h3>
          <form onSubmit={handleSearch}>
            <div className="form-group"><label>Nhập biển số xe</label><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required /></div>
            <button type="submit" className="submit-button">Tra cứu</button>
          </form>
          {searchResult && (
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h4>Kết quả tra cứu</h4>
              <p><strong>Chủ xe (CCCD):</strong> {searchResult.so_cccd_chu_xe}</p>
              <p><strong>Hãng xe:</strong> {searchResult.hang_xe}</p>
              <p><strong>Loại xe:</strong> {searchResult.loai_xe}</p>
              <p><strong>Ngày đăng ký:</strong> {new Date(searchResult.ngay_dang_ky).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuanLyXe;