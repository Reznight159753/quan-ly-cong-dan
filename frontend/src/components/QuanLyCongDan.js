import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuanLyCongDan() {
  const [congDanList, setCongDanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCongDan = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/congdan');
      setCongDanList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách công dân:", error);
      alert('Không thể tải danh sách công dân.');
    }
  };

  useEffect(() => {
    fetchCongDan();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        fetchCongDan();
        return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/congdan/search?term=${searchTerm}`);
      setCongDanList(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setCongDanList([]); // Xóa danh sách nếu không tìm thấy
    }
  };

  const handleDelete = async (cccd, hoTen) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa công dân "${hoTen}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/congdan/${cccd}`);
        alert('Xóa công dân thành công!');
        fetchCongDan(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa công dân:", error);
        alert('Xóa công dân thất bại.');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="content-header" style={{ border: 'none', marginBottom: 0 }}>Danh sách Công dân</h2>
        <Link to="/add-cong-dan" className="submit-button" style={{ textDecoration: 'none', width: 'auto', marginBottom: '20px' }}>
          Thêm Công dân
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nhập họ tên hoặc CCCD để tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit" className="submit-button" style={{ width: 'auto' }}>Tìm kiếm</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Số CCCD</th>
            <th>Họ và Tên</th>
            <th>Năm Sinh</th>
            <th>Giới Tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {congDanList.map((congDan) => (
            <tr key={congDan.so_cccd}>
              <td>{congDan.so_cccd}</td>
              <td>{congDan.ho_ten}</td>
              <td>{congDan.nam_sinh}</td>
              <td>{congDan.gioi_tinh}</td>
              <td style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/cong-dan/${congDan.so_cccd}`}>Chi tiết</Link>
                <Link to={`/edit-cong-dan/${congDan.so_cccd}`}>Sửa</Link>
                <button onClick={() => handleDelete(congDan.so_cccd, congDan.ho_ten)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0 }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLyCongDan;