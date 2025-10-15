import React, { useState } from 'react';
import axios from 'axios';

function KetHon() {
  const [formData, setFormData] = useState({
    SO_CCCD_CHONG: '',
    SO_CCCD_VO: '',
    NGAY_DANG_KY: '',
    NOI_DANG_KY: '',
    TINH: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/kethon', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Đăng Ký Kết Hôn</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số CCCD Chồng</label>
            <input name="SO_CCCD_CHONG" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số CCCD Vợ</label>
            <input name="SO_CCCD_VO" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ngày Đăng Ký</label>
            <input name="NGAY_DANG_KY" type="date" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nơi Đăng Ký</label>
            <input name="NOI_DANG_KY" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Tỉnh/Thành phố</label>
            <input name="TINH" onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Đăng Ký</button>
        </form>
      </div>
    </div>
  );
}

export default KetHon;