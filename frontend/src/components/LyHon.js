import React, { useState } from 'react';
import axios from 'axios';

function LyHon() {
  const [formData, setFormData] = useState({
    SO_CCCD_CHONG: '',
    SO_CCCD_VO: '',
    NGAY_LY_HON: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/lyhon', formData);

      // SỬA ĐỔI: Thay thế alert cũ bằng thông báo pháp lý chi tiết
      const successMessage = `✅ Ghi Nhận Thành Công!\n\nĐơn yêu cầu ly hôn của bạn đã được ghi nhận. Theo quy định, vụ việc sẽ được chuyển sang giai đoạn hòa giải. Các thông báo pháp lý chính thức sẽ được Tòa án gửi đến các bên liên quan theo trình tự thủ tục.`;
      alert(successMessage);

      // Xóa form sau khi thành công
      setFormData({
        SO_CCCD_CHONG: '',
        SO_CCCD_VO: '',
        NGAY_LY_HON: ''
      });
    } catch (error) {
      alert('❌ Đã xảy ra lỗi: ' + (error.response?.data?.message || error.message));
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
        💔 Quản lý Ly Hôn
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
            <span>📝</span> Đăng Ký Thủ Tục Ly Hôn
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Số CCCD Chồng">
              <Input
                name="SO_CCCD_CHONG"
                value={formData.SO_CCCD_CHONG}
                onChange={handleChange}
                placeholder="Nhập số CCCD của người chồng..."
                required
              />
            </FormGroup>
            
            <FormGroup label="Số CCCD Vợ">
              <Input
                name="SO_CCCD_VO"
                value={formData.SO_CCCD_VO}
                onChange={handleChange}
                placeholder="Nhập số CCCD của người vợ..."
                required
              />
            </FormGroup>
            
            <FormGroup label="Ngày Ly Hôn">
              <Input
                name="NGAY_LY_HON"
                type="date"
                value={formData.NGAY_LY_HON}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : '💔 Xác Nhận Ly Hôn'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Components (Copy từ file QuanLyXe)
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
        boxSizing: 'border-box' // Thêm thuộc tính này để padding không làm tăng kích thước
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


export default LyHon;

