import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCongDan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    SO_CCCD: '',
    HO_TEN: '',
    NGAY_SINH: '',
    NAM_SINH: '',
    QUE_QUAN: '',
    GIOI_TINH: 'NAM',
    DIA_CHI_THUONG_TRU: '',
    TINH: '',
    PHUONG: '',
    NGHE_NGHIEP: '',
    TINH_TRANG_HON_NHAN: 'DOC_THAN',
    SO_DIEN_THOAI: '',
    TRANG_THAI_CCCD: 'DA_CAP'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Tự động cập nhật năm sinh nếu ngày sinh thay đổi
    if (name === 'NGAY_SINH') {
      const year = new Date(value).getFullYear();
      if (!isNaN(year)) {
        setFormData(prev => ({ ...prev, NAM_SINH: year }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/congdan', formData);
      alert('Thêm công dân mới thành công!');
      navigate('/quan-ly-cong-dan'); // Chuyển về trang danh sách
    } catch (error) {
      alert('Thêm công dân thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Thêm Công dân mới</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Số CCCD (*)</label>
              <input name="SO_CCCD" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Họ và Tên (*)</label>
              <input name="HO_TEN" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ngày Sinh (*)</label>
              <input name="NGAY_SINH" type="date" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Năm Sinh</label>
              <input name="NAM_SINH" type="number" value={formData.NAM_SINH} onChange={handleChange} readOnly />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select name="GIOI_TINH" value={formData.GIOI_TINH} onChange={handleChange} style={{ width: '100%', padding: '10px' }}>
                <option value="NAM">NAM</option>
                <option value="NU">NU</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quê quán</label>
              <input name="QUE_QUAN" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Địa chỉ thường trú</label>
              <input name="DIA_CHI_THUONG_TRU" onChange={handleChange} />
            </div>
             <div className="form-group">
              <label>Số điện thoại</label>
              <input name="SO_DIEN_THOAI" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tình trạng hôn nhân</label>
              <select name="TINH_TRANG_HON_NHAN" value={formData.TINH_TRANG_HON_NHAN} onChange={handleChange} style={{ width: '100%', padding: '10px' }}>
                <option value="DOC_THAN">Độc thân</option>
                <option value="KET_HON">Đã kết hôn</option>
                <option value="LY_HON">Đã ly hôn</option>
              </select>
            </div>
          </div>
          <button type="submit" className="submit-button" style={{ marginTop: '20px' }}>Lưu thông tin</button>
        </form>
      </div>
    </div>
  );
}

export default AddCongDan;