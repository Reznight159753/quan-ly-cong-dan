import React, { useState } from 'react';
import axios from 'axios';

function QuanLyGiayTo() {
  const [formData, setFormData] = useState({
    SO_GIAY: '',
    SO_CCCD: '',
    NGAY_MAT: '',
    NOI_MAT: '',
    NGUYEN_NHAN: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/giayto/chungtu', formData);
      alert('✅ ' + response.data.message);
      // Xóa form sau khi đăng ký thành công
      setFormData({
        SO_GIAY: '',
        SO_CCCD: '',
        NGAY_MAT: '',
        NOI_MAT: '',
        NGUYEN_NHAN: ''
      });
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
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
        Quản lý Giấy Chứng Tử
      </h2>

      <div style={{
        display: 'grid',
        placeItems: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
          width: '100%',
          maxWidth: '500px'
        }}>
          <h3 style={{
            color: '#667eea',
            marginBottom: '25px',
            fontSize: '1.5em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📝</span> Khai Báo Giấy Chứng Tử
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Số Giấy Chứng tử">
              <Input
                name="SO_GIAY"
                value={formData.SO_GIAY}
                onChange={handleChange}
                placeholder="Nhập số giấy chứng tử..."
                required
              />
            </FormGroup>
            
            <FormGroup label="Số CCCD Người Mất">
              <Input
                name="SO_CCCD"
                value={formData.SO_CCCD}
                onChange={handleChange}
                placeholder="Nhập số CCCD của người đã mất..."
                required
              />
            </FormGroup>
            
            <FormGroup label="Ngày Mất">
              <Input
                name="NGAY_MAT"
                type="date"
                value={formData.NGAY_MAT}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup label="Nơi Mất">
              <Input
                name="NOI_MAT"
                value={formData.NOI_MAT}
                onChange={handleChange}
                placeholder="VD: Bệnh viện Chợ Rẫy..."
                required
              />
            </FormGroup>

            <FormGroup label="Nguyên Nhân (Không bắt buộc)">
              <Input
                name="NGUYEN_NHAN"
                value={formData.NGUYEN_NHAN}
                onChange={handleChange}
                placeholder="VD: Bệnh tật, tai nạn..."
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : 'Xác Nhận Đăng Ký'}
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
    <label style={{
      fontWeight: '600',
      marginBottom: '8px',
      display: 'block',
      color: '#555'
    }}>
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '12px',
        border: `2px solid ${focused ? '#667eea' : '#e0e0e0'}`,
        borderRadius: '8px',
        fontSize: '1em',
        transition: 'all 0.3s',
        outline: 'none',
        boxSizing: 'border-box'
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const Button = ({ children, disabled, style, ...props }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        padding: '14px',
        background: disabled ? '#ccc' : (style?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: hovered && !disabled ? '0 6px 20px rgba(102, 126, 234, 0.6)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

export default QuanLyGiayTo;
