import React, { useState } from 'react';
import axios from 'axios';

function LyHon() {
  const [formData, setFormData] = useState({
    SO_CCCD_CHONG: '',
    SO_CCCD_VO: '',
    NGAY_LY_HON: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/lyhon', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Đăng Ký Ly Hôn</h2>
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
            <label>Ngày Ly Hôn</label>
            <input name="NGAY_LY_HON" type="date" onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Xác Nhận Ly Hôn</button>
        </form>
      </div>
    </div>
  );
}

export default LyHon;