import React, { useState } from 'react';
import axios from 'axios';

function KhaiSinh() {
  const [formData, setFormData] = useState({
    SO_GIAY: '',
    SO_CCCD: '',
    NGAY_SINH: '',
    NOI_SINH: '',
    SO_CCCD_CHA: '',
    SO_CCCD_ME: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/khaisinh', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Đăng Ký Khai Sinh</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số Giấy Khai Sinh</label>
            <input name="SO_GIAY" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số CCCD của con</label>
            <input name="SO_CCCD" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ngày Sinh</label>
            <input name="NGAY_SINH" type="date" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nơi Sinh</label>
            <input name="NOI_SINH" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số CCCD Cha</label>
            <input name="SO_CCCD_CHA" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số CCCD Mẹ</label>
            <input name="SO_CCCD_ME" onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">Đăng Ký Khai Sinh</button>
        </form>
      </div>
    </div>
  );
}

export default KhaiSinh;