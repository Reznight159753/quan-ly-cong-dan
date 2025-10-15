import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditCongDan() {
  const { cccd } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    HO_TEN: '',
    NGAY_SINH: '',
    NAM_SINH: '',
    QUE_QUAN: '',
    GIOI_TINH: 'NAM',
    DIA_CHI_THUONG_TRU: '',
    TINH_TRANG_HON_NHAN: 'DOC_THAN',
    SO_DIEN_THOAI: '',
  });

  // Tải dữ liệu của công dân cần sửa
  useEffect(() => {
    const fetchCongDanData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/congdan/${cccd}`);
        const data = response.data;
        // Định dạng lại ngày tháng để hiển thị trên input type="date"
        if (data.ngay_sinh) {
          data.ngay_sinh = new Date(data.ngay_sinh).toISOString().split('T')[0];
        }
        setFormData({
            HO_TEN: data.ho_ten || '',
            NGAY_SINH: data.ngay_sinh || '',
            NAM_SINH: data.nam_sinh || '',
            QUE_QUAN: data.que_quan || '',
            GIOI_TINH: data.gioi_tinh || 'NAM',
            DIA_CHI_THUONG_TRU: data.dia_chi_thuong_tru || '',
            TINH_TRANG_HON_NHAN: data.tinh_trang_hon_nhan || 'DOC_THAN',
            SO_DIEN_THOAI: data.so_dien_thoai || '',
        });
      } catch (error) {
        alert('Không thể tải dữ liệu công dân.');
        navigate('/quan-ly-cong-dan');
      }
    };
    fetchCongDanData();
  }, [cccd, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await axios.put(`http://localhost:5000/api/congdan/${cccd}`, formData);
      alert('Cập nhật thông tin thành công!');
      navigate('/quan-ly-cong-dan');
    } catch (error) {
      alert('Cập nhật thất bại: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Sửa thông tin Công dân</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số CCCD</label>
            <input value={cccd} readOnly disabled />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Họ và Tên (*)</label>
              <input name="HO_TEN" value={formData.HO_TEN} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ngày Sinh (*)</label>
              <input name="NGAY_SINH" type="date" value={formData.NGAY_SINH} onChange={handleChange} required />
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
              <input name="QUE_QUAN" value={formData.QUE_QUAN} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Địa chỉ thường trú</label>
              <input name="DIA_CHI_THUONG_TRU" value={formData.DIA_CHI_THUONG_TRU} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input name="SO_DIEN_THOAI" value={formData.SO_DIEN_THOAI} onChange={handleChange} />
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
          <button type="submit" className="submit-button" style={{ marginTop: '20px' }}>Cập nhật</button>
        </form>
      </div>
    </div>
  );
}

export default EditCongDan;