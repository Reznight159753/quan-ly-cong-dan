import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuanLyXe() {
  const [formData, setFormData] = useState({
    SO_CCCD_CHU_XE: '',
    BIEN_SO: '',
    LOAI_XE: '',
    HANG_XE: '',
    NGAY_DANG_KY: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/xe', formData);
      alert('✅ ' + response.data.message);
      setFormData({
        SO_CCCD_CHU_XE: '',
        BIEN_SO: '',
        LOAI_XE: '',
        HANG_XE: '',
        NGAY_DANG_KY: ''
      });
      fetchVehicles();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/xe/tracuu/${searchTerm}`);
      if (response.data && response.data.length > 0) {
        setSearchResult(response.data[0]);
      } else {
        alert('⚠️ Không tìm thấy xe với biển số này.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert('⚠️ Không tìm thấy xe với biển số này.');
      } else {
        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/xe');
      setVehicles(response.data);
    } catch (error) {
      alert('❌ Lỗi khi tải danh sách xe: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditMode(true);
    setEditVehicleId(vehicle.so_dang_ky_xe);
    setFormData({
      SO_CCCD_CHU_XE: vehicle.so_cccd_chu_xe,
      BIEN_SO: vehicle.bien_so,
      LOAI_XE: vehicle.loai_xe,
      HANG_XE: vehicle.hang_xe,
      NGAY_DANG_KY: vehicle.ngay_dang_ky.split('T')[0]
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/xe/${editVehicleId}`, formData);
      alert('✅ ' + response.data.message);
      setFormData({
        SO_CCCD_CHU_XE: '',
        BIEN_SO: '',
        LOAI_XE: '',
        HANG_XE: '',
        NGAY_DANG_KY: ''
      });
      setEditMode(false);
      setEditVehicleId(null);
      fetchVehicles();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bienso) => {
    if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/xe/${bienso}`);
        alert('✅ ' + response.data.message);
        fetchVehicles();
      } catch (error) {
        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{
        fontSize: '2em',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        🚗 Quản lý Phương tiện Giao thông
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px'
      }}>
        {/* Form Đăng ký */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{
            color: '#667eea',
            marginBottom: '25px',
            fontSize: '1.5em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📝</span> {editMode ? 'Cập nhật thông tin xe' : 'Đăng ký xe mới'}
          </h3>

          <form onSubmit={editMode ? handleUpdate : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="CCCD Chủ xe">
              <Input
                name="SO_CCCD_CHU_XE"
                value={formData.SO_CCCD_CHU_XE}
                onChange={handleChange}
                placeholder="Nhập số CCCD..."
                required
              />
            </FormGroup>

            <FormGroup label="Biển số xe">
              <Input
                name="BIEN_SO"
                value={formData.BIEN_SO}
                onChange={handleChange}
                placeholder="VD: 51A-12345"
                required
              />
            </FormGroup>

            <FormGroup label="Loại xe">
              <Select
                name="LOAI_XE"
                value={formData.LOAI_XE}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn loại xe --</option>
                <option value="Xe máy">Xe máy</option>
                <option value="Ô tô">Ô tô</option>
                <option value="Xe tải">Xe tải</option>
                <option value="Xe khác">Xe khác</option>
              </Select>
            </FormGroup>

            <FormGroup label="Hãng xe">
              <Input
                name="HANG_XE"
                value={formData.HANG_XE}
                onChange={handleChange}
                placeholder="VD: Honda, Toyota..."
                required
              />
            </FormGroup>

            <FormGroup label="Ngày đăng ký">
              <Input
                name="NGAY_DANG_KY"
                type="date"
                value={formData.NGAY_DANG_KY}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : editMode ? '✅ Cập nhật' : '✅ Đăng ký xe'}
            </Button>
            {editMode && (
              <Button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditVehicleId(null);
                  setFormData({
                    SO_CCCD_CHU_XE: '',
                    BIEN_SO: '',
                    LOAI_XE: '',
                    HANG_XE: '',
                    NGAY_DANG_KY: ''
                  });
                }}
              >
                Hủy
              </Button>
            )}
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
          <h3 style={{
            color: '#667eea',
            marginBottom: '25px',
            fontSize: '1.5em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🔍</span> Tra cứu thông tin xe
          </h3>

          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Nhập biển số xe">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="VD: 51A-12345"
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? '⏳ Đang tìm...' : '🔍 Tra cứu'}
            </Button>
          </form>

          {searchResult && (
            <div style={{
              marginTop: '30px',
              borderTop: '2px solid #f0f0f0',
              paddingTop: '25px',
              animation: 'fadeIn 0.5s'
            }}>
              <h4 style={{
                color: '#667eea',
                marginBottom: '20px',
                fontSize: '1.3em',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>✅</span> Kết quả tra cứu
              </h4>

              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <InfoRow label="🚗 Biển số" value={searchResult.bien_so} />
                  <InfoRow label="👤 CCCD Chủ xe" value={searchResult.so_cccd_chu_xe} />
                  <InfoRow label="🏭 Hãng xe" value={searchResult.hang_xe} />
                  <InfoRow label="📋 Loại xe" value={searchResult.loai_xe} />
                  <InfoRow
                    label="📅 Ngày đăng ký"
                    value={new Date(searchResult.ngay_dang_ky).toLocaleDateString('vi-VN')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách xe */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        marginTop: '30px'
      }}>
        <h3 style={{
          color: '#667eea',
          marginBottom: '25px',
          fontSize: '1.5em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🚗</span> Danh sách xe đã đăng ký
        </h3>
        {vehicles.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center' }}>Không có xe nào trong hệ thống</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Biển số</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>CCCD Chủ xe</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Loại xe</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Hãng xe</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Ngày đăng ký</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.so_dang_ky_xe} style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s',
                    ':hover': { background: '#f8f8f8' }
                  }}>
                    <td style={{ padding: '15px' }}>{vehicle.bien_so}</td>
                    <td style={{ padding: '15px' }}>{vehicle.so_cccd_chu_xe}</td>
                    <td style={{ padding: '15px' }}>{vehicle.loai_xe}</td>
                    <td style={{ padding: '15px' }}>{vehicle.hang_xe}</td>
                    <td style={{ padding: '15px' }}>
                      {new Date(vehicle.ngay_dang_ky).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <Button
                        onClick={() => handleEdit(vehicle)}
                        style={{ marginRight: '10px', padding: '8px 12px' }}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button
                        onClick={() => handleDelete(vehicle.bien_so)}
                        style={{
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                          padding: '8px 12px'
                        }}
                      >
                        🗑️ Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        table tr:hover {
          background: #f8f8f8;
        }
      `}</style>
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
        outline: 'none'
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
        cursor: 'pointer'
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

const InfoRow = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '8px'
  }}>
    <span style={{ fontWeight: '600' }}>{label}:</span>
    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{value}</span>
  </div>
);

export default QuanLyXe;