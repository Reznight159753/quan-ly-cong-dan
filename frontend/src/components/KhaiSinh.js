import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KhaiSinh() {
  const [formData, setFormData] = useState({
    SO_GIAY: '',
    NGAY_SINH: '',
    NOI_SINH: '',
    SO_CCCD_CHA: '',
    SO_CCCD_ME: ''
  });
  const [loading, setLoading] = useState(false);
  const [khaiSinhs, setKhaiSinhs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editKhaiSinhId, setEditKhaiSinhId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/khaisinh', formData);
      alert('✅ ' + response.data.message);
      setFormData({
        SO_GIAY: '',
        NGAY_SINH: '',
        NOI_SINH: '',
        SO_CCCD_CHA: '',
        SO_CCCD_ME: ''
      });
      fetchKhaiSinhs();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchKhaiSinhs = async () => {
    setLoading(true);
    try {
      // Sửa ở đây
      const response = await axios.get('http://localhost:5000/api/khaisinh'); // ✅ Đường dẫn đúng
      setKhaiSinhs(response.data);
    } catch (error) {
      alert('❌ Lỗi khi tải danh sách giấy khai sinh: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (khaiSinh) => {
    setEditMode(true);
    setEditKhaiSinhId(khaiSinh.so_giay);
    setFormData({
      SO_GIAY: khaiSinh.so_giay,
      NGAY_SINH: khaiSinh.ngay_sinh.split('T')[0],
      NOI_SINH: khaiSinh.noi_sinh,
      SO_CCCD_CHA: khaiSinh.so_cccd_cha || '',
      SO_CCCD_ME: khaiSinh.so_cccd_me || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/khaisinh/${editKhaiSinhId}`, formData);
      alert('✅ ' + response.data.message);
      setFormData({
        SO_GIAY: '',
        NGAY_SINH: '',
        NOI_SINH: '',
        SO_CCCD_CHA: '',
        SO_CCCD_ME: ''
      });
      setEditMode(false);
      setEditKhaiSinhId(null);
      fetchKhaiSinhs();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (so_giay) => {
    if (window.confirm('Bạn có chắc muốn xóa giấy khai sinh này?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/khaisinh/${so_giay}`);
        alert('✅ ' + response.data.message);
        fetchKhaiSinhs();
      } catch (error) {
        alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchKhaiSinhs();
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
        📜 Quản lý Giấy Khai Sinh
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px'
      }}>
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
            <span>📝</span> {editMode ? 'Cập nhật giấy khai sinh' : 'Đăng ký giấy khai sinh'}
          </h3>

          <form onSubmit={editMode ? handleUpdate : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormGroup label="Số giấy khai sinh">
              <Input
                name="SO_GIAY"
                value={formData.SO_GIAY}
                onChange={handleChange}
                placeholder="Nhập số giấy khai sinh..."
                required
                disabled={editMode}
              />
            </FormGroup>

            <FormGroup label="Ngày sinh">
              <Input
                name="NGAY_SINH"
                type="date"
                value={formData.NGAY_SINH}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup label="Nơi sinh">
              <Input
                name="NOI_SINH"
                value={formData.NOI_SINH}
                onChange={handleChange}
                placeholder="VD: Hà Nội..."
                required
              />
            </FormGroup>

            <FormGroup label="Số CCCD Cha">
              <Input
                name="SO_CCCD_CHA"
                value={formData.SO_CCCD_CHA}
                onChange={handleChange}
                placeholder="Nhập số CCCD cha..."
                required
              />
            </FormGroup>

            <FormGroup label="Số CCCD Mẹ">
              <Input
                name="SO_CCCD_ME"
                value={formData.SO_CCCD_ME}
                onChange={handleChange}
                placeholder="Nhập số CCCD mẹ..."
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? '⏳ Đang xử lý...' : editMode ? '✅ Cập nhật' : '✅ Đăng ký'}
            </Button>
            {editMode && (
              <Button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditKhaiSinhId(null);
                  setFormData({
                    SO_GIAY: '',
                    NGAY_SINH: '',
                    NOI_SINH: '',
                    SO_CCCD_CHA: '',
                    SO_CCCD_ME: ''
                  });
                }}
              >
                Hủy
              </Button>
            )}
          </form>
        </div>
      </div>

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
          <span>📜</span> Danh sách giấy khai sinh
        </h3>
        {khaiSinhs.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center' }}>Không có giấy khai sinh nào trong hệ thống</p>
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
                  <th style={{ padding: '15px', textAlign: 'left' }}>Số giấy</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Ngày sinh</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Nơi sinh</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Cha mẹ</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {khaiSinhs.map((khaiSinh) => (
                  <tr key={khaiSinh.so_giay} style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s'
                  }}>
                    <td style={{ padding: '15px' }}>{khaiSinh.so_giay}</td>
                    <td style={{ padding: '15px' }}>
                      {new Date(khaiSinh.ngay_sinh).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '15px' }}>{khaiSinh.noi_sinh}</td>
                    <td style={{ padding: '15px' }}>{khaiSinh.cha_me}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <Button
                        onClick={() => handleEdit(khaiSinh)}
                        style={{ marginRight: '10px', padding: '8px 12px' }}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button
                        onClick={() => handleDelete(khaiSinh.so_giay)}
                        style={{
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                          padding: '8px 12px' // SỬA Ở ĐÂY: Thêm padding để 2 nút bằng nhau
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

export default KhaiSinh;