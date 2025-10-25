import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuanLyCongDan() {
  const [congDanList, setCongDanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCongDan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/congdan');
      setCongDanList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công dân:", error);
      alert('❌ Không thể tải danh sách công dân.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCongDan();
  }, [fetchCongDan]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!searchTerm.trim()) {
        fetchCongDan();
        return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/congdan/search?term=${searchTerm}`);
      setCongDanList(response.data);
      if (response.data.length === 0) {
        alert('ℹ️ Không tìm thấy công dân với CCCD này.');
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setCongDanList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cccd, hoTen) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa công dân "${hoTen}"?`)) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/congdan/${cccd}`);
        alert('✅ Xóa công dân thành công!');
        fetchCongDan();
      } catch (error) {
        console.error("Lỗi khi xóa công dân:", error);
        alert('❌ Xóa công dân thất bại.');
      } finally {
        setLoading(false);
      }
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
        Quản lý Công Dân
      </h2>
      
      {/* Search and Add Section */}
      <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
          marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexGrow: 1, minWidth: '300px' }}>
                <Input
                    type="text"
                    placeholder="Nhập số CCCD để tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? '⏳' : '🔍'}
                </Button>
            </form>
            <Link to="/add-cong-dan" style={{ textDecoration: 'none' }}>
                <Button>
                    Thêm Công Dân Mới
                </Button>
            </Link>
        </div>
      </div>


      {/* Citizen List Table */}
      <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '25px', fontSize: '1.5em' }}>
          Danh sách Công dân
        </h3>
        {loading && <p>Đang tải dữ liệu...</p>}
        {!loading && (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Số CCCD</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Họ và Tên</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Năm Sinh</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Giới Tính</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                    {congDanList.map((congDan) => (
                        <tr key={congDan.so_cccd} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                            <td style={{ padding: '15px' }}>{congDan.so_cccd}</td>
                            <td style={{ padding: '15px' }}>{congDan.ho_ten}</td>
                            <td style={{ padding: '15px' }}>{congDan.nam_sinh}</td>
                            <td style={{ padding: '15px' }}>{congDan.gioi_tinh}</td>
                            <td style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
                                <Link to={`/cong-dan/${congDan.so_cccd}`} style={{ textDecoration: 'none', color: '#667eea', fontWeight: 'bold' }}>Chi tiết</Link>
                                <Link to={`/edit-cong-dan/${congDan.so_cccd}`} style={{ textDecoration: 'none', color: '#5a67d8', fontWeight: 'bold' }}>Sửa</Link>
                                <button onClick={() => handleDelete(congDan.so_cccd, congDan.ho_ten)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

// Reusable Components
const Input = ({ ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        flexGrow: 1,
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
        padding: '12px 20px',
        background: disabled ? '#ccc' : (style?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1em',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: hovered && !disabled ? '0 6px 20px rgba(102, 126, 234, 0.6)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        whiteSpace: 'nowrap',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

export default QuanLyCongDan;
