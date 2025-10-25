import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuanLyHoKhau() {
  const [hoKhauList, setHoKhauList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    SO_HO_KHAU: '', 
    CHU_HO: '', 
    DANH_SACH_THANH_VIEN_STR: '', 
    DIA_CHI: '', 
    TINH: '' 
  });

  const fetchHoKhau = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/hokhau');
      setHoKhauList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hộ khẩu:", error);
      alert('❌ Lỗi khi tải danh sách hộ khẩu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHoKhau(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const danh_sach_thanh_vien = formData.DANH_SACH_THANH_VIEN_STR.split(',').map(cccd => cccd.trim()).filter(cccd => cccd);
    const dataToSubmit = { ...formData, DANH_SACH_THANH_VIEN: danh_sach_thanh_vien };
    delete dataToSubmit.DANH_SACH_THANH_VIEN_STR;

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/hokhau/${editingId}`, dataToSubmit);
        alert('✅ Cập nhật hộ khẩu thành công!');
      } else {
        await axios.post('http://localhost:5000/api/hokhau', dataToSubmit);
        alert('✅ Tạo hộ khẩu thành công!');
      }
      resetForm();
      fetchHoKhau();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hk) => {
    setFormData({
      SO_HO_KHAU: hk.so_ho_khau,
      CHU_HO: hk.chu_ho,
      DANH_SACH_THANH_VIEN_STR: hk.danh_sach_thanh_vien ? Array.from(hk.danh_sach_thanh_vien).join(', ') : '',
      DIA_CHI: hk.dia_chi,
      TINH: hk.tinh
    });
    setEditingId(hk.so_ho_khau);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = async (sohokhau) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hộ khẩu này?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/hokhau/${sohokhau}`);
      alert('✅ Xóa hộ khẩu thành công!');
      fetchHoKhau();
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ SO_HO_KHAU: '', CHU_HO: '', DANH_SACH_THANH_VIEN_STR: '', DIA_CHI: '', TINH: '' });
    setIsFormVisible(false);
    setIsEditing(false);
    setEditingId(null);
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
        Quản lý Sổ Hộ Khẩu
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <Button onClick={() => { resetForm(); setIsFormVisible(!isFormVisible); }}>
          {isFormVisible ? 'Ẩn Form' : 'Thêm Hộ khẩu Mới'}
        </Button>
      </div>
      
      {isFormVisible && (
        <div style={{
            display: 'grid',
            placeItems: 'center',
            marginBottom: '30px',
            animation: 'fadeIn 0.5s'
        }}>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0',
              width: '100%',
              maxWidth: '800px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '25px', fontSize: '1.5em' }}>
                {isEditing ? '📝 Cập nhật Hộ khẩu' : '📝 Thêm Hộ khẩu Mới'}
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <FormGroup label="Số Hộ khẩu">
                        <Input name="SO_HO_KHAU" value={formData.SO_HO_KHAU} onChange={handleChange} placeholder="Nhập số hộ khẩu..." required disabled={isEditing} />
                    </FormGroup>
                    <FormGroup label="CCCD Chủ hộ">
                        <Input name="CHU_HO" value={formData.CHU_HO} onChange={handleChange} placeholder="Nhập CCCD chủ hộ..." required />
                    </FormGroup>
                    <FormGroup label="Địa chỉ">
                        <Input name="DIA_CHI" value={formData.DIA_CHI} onChange={handleChange} placeholder="Nhập địa chỉ..." required />
                    </FormGroup>
                    <FormGroup label="Tỉnh/Thành">
                        <Input name="TINH" value={formData.TINH} onChange={handleChange} placeholder="Nhập tỉnh/thành phố..." required />
                    </FormGroup>
                </div>
                <FormGroup label="Danh sách CCCD thành viên (cách nhau bởi dấu phẩy)">
                    <Input name="DANH_SACH_THANH_VIEN_STR" value={formData.DANH_SACH_THANH_VIEN_STR} onChange={handleChange} placeholder="VD: 012345678901, 098765432109..." />
                </FormGroup>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button type="submit" disabled={loading}>
                    {loading ? '⏳ Đang lưu...' : (isEditing ? 'Cập nhật Hộ khẩu' : 'Lưu Hộ khẩu')}
                  </Button>
                  <Button type="button" onClick={resetForm} disabled={loading} style={{ background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' }}>
                    Hủy
                  </Button>
                </div>
              </form>
            </div>
        </div>
      )}

      <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '25px', fontSize: '1.5em' }}>
          Danh sách Hộ khẩu Toàn Quốc
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Số Hộ Khẩu</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>CCCD Chủ Hộ</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Địa chỉ</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Thành viên</th>
                          <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
                      </tr>
                  </thead>
                  <tbody>
                  {hoKhauList.map((hk) => (
                      <tr key={hk.so_ho_khau} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                          <td style={{ padding: '15px' }}>{hk.so_ho_khau}</td>
                          <td style={{ padding: '15px' }}>{hk.chu_ho}</td>
                          <td style={{ padding: '15px' }}>{`${hk.dia_chi}, ${hk.tinh}`}</td>
                          <td style={{ padding: '15px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{hk.danh_sach_thanh_vien?.join(', ')}</td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <Button onClick={() => handleEdit(hk)} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', marginRight: '10px' }}>
                              Sửa
                            </Button>
                            <Button onClick={() => handleDelete(hk.so_ho_khau)} style={{ background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' }}>
                              Xóa
                            </Button>
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

export default QuanLyHoKhau;