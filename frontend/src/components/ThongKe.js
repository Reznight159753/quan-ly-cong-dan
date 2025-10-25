import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ThongKe() {
  const [data, setData] = useState({
    congDan: {
      gioiTinh: [],
      honNhan: [],
      doTuoi: {},
      tinh: [],
      ngheNghiep: [],
      trangThaiCCCD: []
    },
    honNhan: {
      ketHonNam: [],
      ketHonTinh: [],
      lyHonNam: []
    },
    xe: {
      xeLoai: [],
      xeHang: [],
      xeNam: []
    },
    tru: {
      truLoai: [],
      truTrangThai: [],
      truTinh: []
    },
    sinh: {
      sinhNam: [],
      sinhNoi: []
    },
    tu: {
      tuNam: [],
      tuNguyenNhan: [],
      tuNoi: []
    },
    hoKhau: {
      hoKhauTinh: [],
      hoKhauKichThuoc: {}
    },
    taiKhoan: {
      taiKhoanRole: []
    }
  });
  const [activeSections, setActiveSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
          axios.get('http://localhost:5000/api/thongke/gioitinh'),
          axios.get('http://localhost:5000/api/thongke/honnhan'),
          axios.get('http://localhost:5000/api/thongke/dotuoi'),
          axios.get('http://localhost:5000/api/thongke/tinh'),
          axios.get('http://localhost:5000/api/thongke/nghenghiep'),
          axios.get('http://localhost:5000/api/thongke/trangthaicccd'),
          axios.get('http://localhost:5000/api/thongke/kethonnam'),
          axios.get('http://localhost:5000/api/thongke/kethontinh'),
          axios.get('http://localhost:5000/api/thongke/lyhonnam'),
          axios.get('http://localhost:5000/api/thongke/xeloai'),
          axios.get('http://localhost:5000/api/thongke/xehang'),
          axios.get('http://localhost:5000/api/thongke/xenam'),
          axios.get('http://localhost:5000/api/thongke/truloai'),
          axios.get('http://localhost:5000/api/thongke/trutrangthai'),
          axios.get('http://localhost:5000/api/thongke/trutinh'),
          axios.get('http://localhost:5000/api/thongke/sinhnam'),
          axios.get('http://localhost:5000/api/thongke/sinhnoi'),
          axios.get('http://localhost:5000/api/thongke/tunam'),
          axios.get('http://localhost:5000/api/thongke/tunguyennhan'),
          axios.get('http://localhost:5000/api/thongke/tunoi'),
          axios.get('http://localhost:5000/api/thongke/hokhautinh'),
          axios.get('http://localhost:5000/api/thongke/hokhaukichthuoc'),
          axios.get('http://localhost:5000/api/thongke/taikhoanrole')
        ]);

        setData({
          congDan: {
            gioiTinh: responses[0].data,
            honNhan: responses[1].data,
            doTuoi: responses[2].data,
            tinh: responses[3].data,
            ngheNghiep: responses[4].data,
            trangThaiCCCD: responses[5].data
          },
          honNhan: {
            ketHonNam: responses[6].data,
            ketHonTinh: responses[7].data,
            lyHonNam: responses[8].data
          },
          xe: {
            xeLoai: responses[9].data,
            xeHang: responses[10].data,
            xeNam: responses[11].data
          },
          tru: {
            truLoai: responses[12].data,
            truTrangThai: responses[13].data,
            truTinh: responses[14].data
          },
          sinh: {
            sinhNam: responses[15].data,
            sinhNoi: responses[16].data
          },
          tu: {
            tuNam: responses[17].data,
            tuNguyenNhan: responses[18].data,
            tuNoi: responses[19].data
          },
          hoKhau: {
            hoKhauTinh: responses[20].data,
            hoKhauKichThuoc: responses[21].data || {}
          },
          taiKhoan: {
            taiKhoanRole: responses[22].data
          }
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const StatCard = ({ title, data, isObject = false }) => (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #dee2e6',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
    }}
    >
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '1.25em',
        fontWeight: '600',
        color: '#343a40',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '10px'
      }}>{title}</h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
          Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#dc3545', fontWeight: '500' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isObject ? (
            Object.entries(data).map(([key, value]) => {
              let displayKey = key;
              let displayValue = value !== null && value !== undefined ? value : 0;
              if (title.includes('Độ tuổi')) {
                displayKey = key === 'Duoi 18' ? 'Dưới 18 tuổi' : 
                             key === 'Tren 50' ? 'Trên 50 tuổi' : 
                             `${key} tuổi`;
              } else if (title.includes('Kích thước Hộ khẩu')) {
                displayKey = key === 'so_ho_khau' ? 'Số hộ khẩu' : 'Kích thước trung bình';
                if (key === 'kich_thuoc_trung_binh') {
                  displayValue = displayValue.toFixed(2);
                }
              }
              return (
                <div key={key} style={{ 
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'background 0.2s'
                }}>
                  <span style={{ fontSize: '1em', color: '#495057', fontWeight: '500' }}>
                    {displayKey}
                  </span>
                  <span style={{ 
                    fontSize: '1.2em', 
                    fontWeight: '600',
                    color: '#212529',
                    background: '#e9ecef',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    {displayValue}
                  </span>
                </div>
              );
            })
          ) : (
            (data || []).map((item, index) => {
              const categoryKey = Object.keys(item).find(k => k !== 'so_luong');
              const categoryValue = item[categoryKey] || 'Không xác định';
              const count = item.so_luong || 0;
              return (
                <div key={index} style={{ 
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'background 0.2s'
                }}>
                  <span style={{ fontSize: '1em', color: '#495057', fontWeight: '500' }}>
                    {categoryValue}
                  </span>
                  <span style={{ 
                    fontSize: '1.2em', 
                    fontWeight: '600',
                    color: '#212529',
                    background: '#e9ecef',
                    padding: '4px 12px',
                    borderRadius: '20px'
                  }}>
                    {count}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  const SectionHeader = ({ title, section }) => (
    <h3 
      style={{ 
        fontSize: '1.5em', 
        margin: '25px 0 12px', 
        color: '#343a40', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'background 0.3s, box-shadow 0.3s'
      }} 
      onClick={() => toggleSection(section)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#e9ecef';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8f9fa';
        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
      }}
    >
      {activeSections[section] ? '▼' : '►'} {title}
    </h3>
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', background: '#f0f2f5', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h2 style={{
        fontSize: '2em',
        marginBottom: '30px',
        color: '#212529',
        textAlign: 'center',
        fontWeight: '700',
        letterSpacing: '0.5px'
      }}>
        Thống kê Dân số
      </h2>
      
      <SectionHeader title="Thống kê Công dân" section="congDan" />
      {activeSections.congDan && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Theo Giới tính" data={data.congDan.gioiTinh} />
          <StatCard title="Theo Tình trạng Hôn nhân" data={data.congDan.honNhan} />
          <StatCard title="Theo Độ tuổi" data={data.congDan.doTuoi} isObject={true} />
          <StatCard title="Theo Tỉnh" data={data.congDan.tinh} />
          <StatCard title="Theo Nghề nghiệp" data={data.congDan.ngheNghiep} />
          <StatCard title="Theo Trạng thái CCCD" data={data.congDan.trangThaiCCCD} />
        </div>
      )}

      <SectionHeader title="Thống kê Hôn nhân" section="honNhan" />
      {activeSections.honNhan && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Kết hôn theo Năm" data={data.honNhan.ketHonNam} />
          <StatCard title="Kết hôn theo Tỉnh" data={data.honNhan.ketHonTinh} />
          <StatCard title="Ly hôn theo Năm" data={data.honNhan.lyHonNam} />
        </div>
      )}

      <SectionHeader title="Thống kê Xe" section="xe" />
      {activeSections.xe && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Xe theo Loại" data={data.xe.xeLoai} />
          <StatCard title="Xe theo Hãng" data={data.xe.xeHang} />
          <StatCard title="Xe theo Năm đăng ký" data={data.xe.xeNam} />
        </div>
      )}

      <SectionHeader title="Thống kê Trú" section="tru" />
      {activeSections.tru && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Trú theo Loại" data={data.tru.truLoai} />
          <StatCard title="Trú theo Trạng thái" data={data.tru.truTrangThai} />
          <StatCard title="Trú theo Tỉnh" data={data.tru.truTinh} />
        </div>
      )}

      <SectionHeader title="Thống kê Sinh" section="sinh" />
      {activeSections.sinh && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Sinh theo Năm" data={data.sinh.sinhNam} />
          <StatCard title="Sinh theo Nơi" data={data.sinh.sinhNoi} />
        </div>
      )}

      <SectionHeader title="Thống kê Tử" section="tu" />
      {activeSections.tu && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Trung bình số người mất mỗi năm" data={data.tu.tuNam} />
          <StatCard title="Nguyên nhân mất" data={data.tu.tuNguyenNhan} />
          <StatCard title="Thống kê số người mất trên địa bàn" data={data.tu.tuNoi} />
        </div>
      )}

      <SectionHeader title="Thống kê Hộ khẩu" section="hoKhau" />
      {activeSections.hoKhau && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Hộ khẩu theo Tỉnh" data={data.hoKhau.hoKhauTinh} />
          <StatCard title="Số người trung bình mỗi nhà" data={data.hoKhau.hoKhauKichThuoc} isObject={true} />
        </div>
      )}

      <SectionHeader title="Thống kê Tài khoản" section="taiKhoan" />
      {activeSections.taiKhoan && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '25px',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <StatCard title="Tài khoản theo Role" data={data.taiKhoan.taiKhoanRole} />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ThongKe;