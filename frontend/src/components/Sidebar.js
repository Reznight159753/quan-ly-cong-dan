import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        QUẢN LÝ CÔNG DÂN
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/thong-ke">Thống kê</NavLink>
        </li>
        <hr style={{ borderColor: '#34495e' }}/>
        <li>
          <NavLink to="/quan-ly-cong-dan">Quản lý Công dân</NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-ho-khau">Quản lý Hộ khẩu</NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-cu-tru">Quản lý Cư trú</NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-xe">Quản lý Xe</NavLink>
        </li>
        <li>
          <NavLink to="/quan-ly-giay-to">Quản lý Giấy tờ</NavLink>
        </li>
        <hr style={{ borderColor: '#34495e' }}/>
        <li>
          <NavLink to="/ket-hon">Đăng ký kết hôn</NavLink>
        </li>
        <li>
          <NavLink to="/ly-hon">Đăng ký ly hôn</NavLink>
        </li>
        <li>
          <NavLink to="/khai-sinh">Khai sinh</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;