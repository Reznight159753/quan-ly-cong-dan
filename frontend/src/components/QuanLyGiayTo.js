import React, { useState } from 'react';
import axios from 'axios';

function QuanLyGiayTo() {
  const [formData, setFormData] = useState({ SO_GIAY: '', SO_CCCD: '', NGAY_MAT: '', NOI_MAT: '', NGUYEN_NHAN: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/giayto/chungtu', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Đăng ký Giấy Chứng tử</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Số Giấy Chứng tử</label><input name="SO_GIAY" onChange={handleChange} required /></div>
          <div className="form-group"><label>Số CCCD người mất</label><input name="SO_CCCD" onChange={handleChange} required /></div>
          <div className="form-group"><label>Ngày mất</label><input name="NGAY_MAT" type="date" onChange={handleChange} required /></div>
          <div className="form-group"><label>Nơi mất</label><input name="NOI_MAT" onChange={handleChange} required /></div>
          <div className="form-group"><label>Nguyên nhân</label><input name="NGUYEN_NHAN" onChange={handleChange} /></div>
          <button type="submit" className="submit-button">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}

export default QuanLyGiayTo;