import React, { useState } from 'react';
import axios from 'axios';

function QuanLyCuTru() {
  const [formData, setFormData] = useState({ SO_CCCD: '', LOAI_TRU: 'TAM_TRU', NOI_TRU: '', TU_NGAY: '', DEN_NGAY: '', TINH: '', TRANG_THAI: 'HOAT_DONG' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingRegister(true);
    try {
      const response = await axios.post('http://localhost:5000/api/tru', formData);
      alert('✅ ' + response.data.message);
      setFormData({ SO_CCCD: '', LOAI_TRU: 'TAM_TRU', NOI_TRU: '', TU_NGAY: '', DEN_NGAY: '', TINH: '', TRANG_THAI: 'HOAT_DONG' });
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult([]);
    setLoadingSearch(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/tru/tracuu/${searchTerm}`);
      setSearchResult(response.data);
      if (response.data.length === 0) {
        alert('ℹ️ Không tìm thấy lịch sử cư trú cho CCCD này.');
      }
    } catch (error) {
       alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingSearch(false);
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
        Quản lý Cư Trú
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {/* Form Đăng ký */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '25px', fontSize: '1.5em' }}>
            📝 Đăng ký Cư trú
          </h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Số CCCD">
              <Input name="SO_CCCD" value={formData.SO_CCCD} onChange={handleChange} placeholder="Nhập CCCD người đăng ký..." required />
            </FormGroup>
            <FormGroup label="Loại cư trú">
              <Select name="LOAI_TRU" value={formData.LOAI_TRU} onChange={handleChange}>
                <option value="TAM_TRU">Tạm trú</option>
                <option value="THUONG_TRU">Thường trú</option>
                <option value="TAM_VANG">Tạm vắng</option>
              </Select>
            </FormGroup>
            <FormGroup label="Nơi cư trú / Nơi đến">
              <Input name="NOI_TRU" value={formData.NOI_TRU} onChange={handleChange} placeholder="Nhập địa chỉ..." required />
            </FormGroup>
             <FormGroup label="Tỉnh/Thành">
              <Input name="TINH" value={formData.TINH} onChange={handleChange} placeholder="VD: Hà Nội..." required />
            </FormGroup>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormGroup label="Từ ngày">
                <Input name="TU_NGAY" type="date" value={formData.TU_NGAY} onChange={handleChange} required />
              </FormGroup>
              <FormGroup label="Đến ngày (nếu có)">
                <Input name="DEN_NGAY" type="date" value={formData.DEN_NGAY} onChange={handleChange} />
              </FormGroup>
            </div>
            <Button type="submit" disabled={loadingRegister}>
              {loadingRegister ? '⏳ Đang đăng ký...' : 'Đăng ký Cư trú'}
            </Button>
          </form>
        </div>

        {/* Form Tra cứu */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '25px', fontSize: '1.5em' }}>
            🔍 Tra cứu Lịch sử Cư trú
          </h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Nhập số CCCD để tra cứu">
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nhập CCCD cần tra cứu..." required />
            </FormGroup>
            <Button type="submit" disabled={loadingSearch}>
              {loadingSearch ? '⏳ Đang tìm...' : 'Tra cứu'}
            </Button>
          </form>

          {searchResult.length > 0 && (
            <div style={{ marginTop: '30px', borderTop: '2px solid #f0f0f0', paddingTop: '25px', animation: 'fadeIn 0.5s' }}>
              <h4 style={{ color: '#667eea', marginBottom: '20px', fontSize: '1.3em' }}>
                Kết quả tra cứu
              </h4>
               <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Loại</th>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Nơi cư trú</th>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Từ ngày</th>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Đến ngày</th>
                          </tr>
                      </thead>
                      <tbody>
                      {searchResult.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                              <td style={{ padding: '15px' }}>{item.loai_tru}</td>
                              <td style={{ padding: '15px' }}>{item.noi_tru}</td>
                              <td style={{ padding: '15px' }}>{new Date(item.tu_ngay).toLocaleDateString('vi-VN')}</td>
                              <td style={{ padding: '15px' }}>{item.den_ngay ? new Date(item.den_ngay).toLocaleDateString('vi-VN') : '—'}</td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
            </div>
          )}
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

const Select = ({ children, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <select
      {...props}
      style={{
        width: '100%',
        padding: '12px',
        border: `2px solid ${focused ? '#667eea' : '#e0e0e0'}`,
        borderRadius: '8px',
        fontSize: '1em',
        transition: 'all 0.3s',
        outline: 'none',
        cursor: 'pointer',
        backgroundColor: 'white'
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
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


export default QuanLyCuTru;
