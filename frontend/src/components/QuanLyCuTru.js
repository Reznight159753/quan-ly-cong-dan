import React, { useState } from 'react';
import axios from 'axios';

function QuanLyCuTru() {
  const [formData, setFormData] = useState({ SO_CCCD: '', LOAI_TRU: 'TAM_TRU', NOI_TRU: '', TU_NGAY: '', DEN_NGAY: '', TINH: '', TRANG_THAI: 'HOAT_DONG' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tru', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult([]);
    try {
      const response = await axios.get(`http://localhost:5000/api/tru/tracuu/${searchTerm}`);
      setSearchResult(response.data);
    } catch (error) {
       alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2 className="content-header">Quản lý Cư trú</h2>
      <div className="form-container" style={{maxWidth: '100%', marginBottom: '30px'}}>
        <h3>Đăng ký cư trú</h3>
        <form onSubmit={handleRegister} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
          <div className="form-group"><label>Số CCCD</label><input name="SO_CCCD" onChange={handleChange} required /></div>
          <div className="form-group"><label>Loại cư trú</label>
            <select name="LOAI_TRU" value={formData.LOAI_TRU} onChange={handleChange} style={{ width: '100%', padding: '10px' }}>
              <option value="THUONG_TRU">Thường trú</option>
              <option value="TAM_TRU">Tạm trú</option>
              <option value="TAM_VANG">Tạm vắng</option>
            </select>
          </div>
          <div className="form-group"><label>Nơi cư trú/đến</label><input name="NOI_TRU" onChange={handleChange} required /></div>
          <div className="form-group"><label>Từ ngày</label><input name="TU_NGAY" type="date" onChange={handleChange} required /></div>
          <div className="form-group"><label>Đến ngày (nếu có)</label><input name="DEN_NGAY" type="date" onChange={handleChange} /></div>
          <div className="form-group"><label>Tỉnh/Thành</label><input name="TINH" onChange={handleChange} required /></div>
          <button type="submit" className="submit-button" style={{gridColumn: '1 / -1'}}>Đăng ký</button>
        </form>
      </div>

      <div className="form-container" style={{maxWidth: '100%'}}>
        <h3>Tra cứu lịch sử cư trú</h3>
        <form onSubmit={handleSearch}>
          <div className="form-group"><label>Nhập số CCCD</label><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required /></div>
          <button type="submit" className="submit-button">Tra cứu</button>
        </form>
        {searchResult.length > 0 && (
          <table className="data-table" style={{marginTop: '20px'}}>
            <thead><tr><th>Loại</th><th>Nơi cư trú</th><th>Từ ngày</th><th>Đến ngày</th></tr></thead>
            <tbody>
              {searchResult.map((item, index) => (
                <tr key={index}>
                  <td>{item.loai_tru}</td>
                  <td>{item.noi_tru}</td>
                  <td>{new Date(item.tu_ngay).toLocaleDateString()}</td>
                  <td>{item.den_ngay ? new Date(item.den_ngay).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default QuanLyCuTru;