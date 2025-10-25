import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCongDan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    SO_CCCD: '', HO_TEN: '', NGAY_SINH: '', NAM_SINH: '', QUE_QUAN: '',
    GIOI_TINH: 'NAM', DIA_CHI_THUONG_TRU: '', TINH: '', PHUONG: '',
    NGHE_NGHIEP: '', TINH_TRANG_HON_NHAN: 'DOC_THAN', SO_DIEN_THOAI: '',
    TRANG_THAI_CCCD: 'DA_CAP'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'NGAY_SINH') {
        const year = new Date(value).getFullYear();
        if (!isNaN(year)) {
          newState.NAM_SINH = year.toString();
        }
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/congdan', formData);
      alert('✅ Thêm công dân thành công!');
      navigate('/quan-ly-cong-dan');
    } catch (error) {
      alert('❌ Thêm thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{
        fontSize: '2em',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Đăng ký Căn cước Công dân
      </h2>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
          width: '100%',
          maxWidth: '800px'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <FormGroup label="Số CCCD (*)">
                <Input name="SO_CCCD" value={formData.SO_CCCD} onChange={handleChange} required placeholder="12 chữ số..." />
              </FormGroup>
              <FormGroup label="Họ và Tên (*)">
                <Input name="HO_TEN" value={formData.HO_TEN} onChange={handleChange} required placeholder="Nguyễn Văn A..." />
              </FormGroup>
              <FormGroup label="Ngày Sinh (*)">
                <Input name="NGAY_SINH" type="date" value={formData.NGAY_SINH} onChange={handleChange} required />
              </FormGroup>
              <FormGroup label="Năm Sinh">
                <Input name="NAM_SINH" type="number" value={formData.NAM_SINH} readOnly placeholder="Tự động điền..." />
              </FormGroup>
              <FormGroup label="Giới tính">
                <Select name="GIOI_TINH" value={formData.GIOI_TINH} onChange={handleChange}>
                  <option value="NAM">Nam</option>
                  <option value="NU">Nữ</option>
                </Select>
              </FormGroup>
              <FormGroup label="Tình trạng hôn nhân">
                <Select name="TINH_TRANG_HON_NHAN" value={formData.TINH_TRANG_HON_NHAN} onChange={handleChange}>
                  <option value="DOC_THAN">Độc thân</option>
                  <option value="KET_HON">Đã kết hôn</option>
                  <option value="LY_HON">Đã ly hôn</option>
                </Select>
              </FormGroup>
              <FormGroup label="Quê quán">
                <Input name="QUE_QUAN" value={formData.QUE_QUAN} onChange={handleChange} placeholder="VD: Hà Nội..." />
              </FormGroup>
              <FormGroup label="Địa chỉ thường trú">
                <Input name="DIA_CHI_THUONG_TRU" value={formData.DIA_CHI_THUONG_TRU} onChange={handleChange} placeholder="VD: 123 Đường ABC..." />
              </FormGroup>
              <FormGroup label="Số điện thoại">
                <Input name="SO_DIEN_THOAI" value={formData.SO_DIEN_THOAI} onChange={handleChange} placeholder="VD: 0912345678..." />
              </FormGroup>
              <FormGroup label="Nghề nghiệp">
                  <Input name="NGHE_NGHIEP" value={formData.NGHE_NGHIEP} onChange={handleChange} placeholder="VD: Kỹ sư..." />
              </FormGroup>
            </div>
            <Button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
              {loading ? '⏳ Đang lưu...' : 'Lưu thông tin'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const FormGroup = ({ label, children }) => (
  <div>
    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#555' }}>{label}</label>
    {children}
  </div>
);

const Input = ({ ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '12px', border: `2px solid ${focused ? '#667eea' : '#e0e0e0'}`,
        borderRadius: '8px', fontSize: '1em', transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box'
      }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
};

const Select = ({ children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      style={{
        width: '100%', padding: '12px', border: `2px solid ${focused ? '#667eea' : '#e0e0e0'}`,
        borderRadius: '8px', fontSize: '1em', transition: 'all 0.3s', outline: 'none', cursor: 'pointer',
        backgroundColor: 'white'
      }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

const Button = ({ children, disabled, style, ...props }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      {...props} disabled={disabled}
      style={{
        padding: '14px', background: disabled ? '#ccc' : (style?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
        color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1em', fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: hovered && !disabled ? '0 6px 20px rgba(102, 126, 234, 0.6)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)', ...style
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

export default AddCongDan;
