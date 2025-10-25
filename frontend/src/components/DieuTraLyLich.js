import React, { useState } from 'react';
import axios from 'axios';

function DieuTraLyLich() {
  const [soCCCD, setSoCCCD] = useState('');
  const [lyLich, setLyLich] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLyLich(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/congdan/lylich3doi/${soCCCD}`);
      setLyLich(response.data);
    } catch (error) {
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const PersonCard = ({ person, title, generation, icon }) => {
    if (!person) {
      return (
        <div style={{
          background: 'rgba(200, 200, 200, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          border: '2px dashed #ccc',
          textAlign: 'center',
          color: '#999'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>{icon}</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '5px' }}>{title}</div>
          <div>Không có thông tin</div>
        </div>
      );
    }

    const colors = {
      0: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102, 126, 234, 0.4)' },
      1: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(240, 147, 251, 0.4)' },
      2: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79, 172, 254, 0.4)' }
    };

    return (
      <div style={{
        background: colors[generation].bg,
        borderRadius: '15px',
        padding: '25px',
        color: 'white',
        boxShadow: `0 8px 25px ${colors[generation].shadow}`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 12px 35px ${colors[generation].shadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${colors[generation].shadow}`;
      }}
      >
        <div style={{ 
          fontSize: '2.5em', 
          textAlign: 'center', 
          marginBottom: '15px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}>
          {icon}
        </div>
        
        <h4 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: '1.3em',
          fontWeight: 'bold',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '10px'
        }}>
          {title}
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <InfoItem label="Họ tên" value={person.ho_ten} />
          <InfoItem label="CCCD" value={person.so_cccd} />
          <InfoItem label="Ngày sinh" value={person.ngay_sinh} />
          <InfoItem label="Giới tính" value={person.gioi_tinh} />
          <InfoItem label="Quê quán" value={person.que_quan} />
          <InfoItem label="Nghề nghiệp" value={person.nghe_nghiep} />
          <InfoItem label="Tình trạng" value={person.tinh_trang_hon_nhan} />
        </div>
      </div>
    );
  };

  const InfoItem = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: '8px',
      fontSize: '0.95em'
    }}>
      <span style={{ fontWeight: '600' }}>{label}:</span>
      <span style={{ fontWeight: 'bold' }}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{
        fontSize: '2.2em',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        🔍 Điều tra Lý lịch 3 Đời
      </h2>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto 40px',
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            value={soCCCD}
            onChange={(e) => setSoCCCD(e.target.value)}
            placeholder="Nhập số CCCD để điều tra..."
            style={{
              flex: 1,
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1.1em',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px 35px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            {loading ? '⏳ Đang tra...' : '🔍 Điều tra'}
          </button>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '20px', fontSize: '1.2em', color: '#667eea' }}>
            Đang điều tra lý lịch...
          </p>
        </div>
      )}

      {lyLich && !loading && (
        <div style={{ animation: 'fadeIn 0.6s' }}>
          <div style={{ marginBottom: '50px' }}>
            <h3 style={{
              textAlign: 'center',
              color: '#667eea',
              fontSize: '1.8em',
              marginBottom: '25px',
              fontWeight: 'bold'
            }}>
              👤 Công dân được điều tra
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <PersonCard person={lyLich.congDan} title="Công dân" generation={0} icon="👤" />
            </div>
          </div>

          <div style={{ marginBottom: '50px' }}>
            <h3 style={{
              textAlign: 'center',
              color: '#f5576c',
              fontSize: '1.8em',
              marginBottom: '25px',
              fontWeight: 'bold'
            }}>
              👨‍👩 Đời thứ nhất - Cha Mẹ
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              <PersonCard person={lyLich.cha} title="Cha" generation={1} icon="👨" />
              <PersonCard person={lyLich.me} title="Mẹ" generation={1} icon="👩" />
            </div>
          </div>

          <div>
            <h3 style={{
              textAlign: 'center',
              color: '#00f2fe',
              fontSize: '1.8em',
              marginBottom: '25px',
              fontWeight: 'bold'
            }}>
              👴👵 Đời thứ hai - Ông Bà
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                textAlign: 'center', 
                color: '#555', 
                marginBottom: '15px',
                fontSize: '1.3em'
              }}>
                Nội
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '25px'
              }}>
                <PersonCard person={lyLich.ongNoi} title="Ông Nội" generation={2} icon="👴" />
                <PersonCard person={lyLich.baNoi} title="Bà Nội" generation={2} icon="👵" />
              </div>
            </div>

            <div>
              <h4 style={{ 
                textAlign: 'center', 
                color: '#555', 
                marginBottom: '15px',
                fontSize: '1.3em'
              }}>
                Ngoại
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '25px'
              }}>
                <PersonCard person={lyLich.ongNgoai} title="Ông Ngoại" generation={2} icon="👴" />
                <PersonCard person={lyLich.baNgoai} title="Bà Ngoại" generation={2} icon="👵" />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default DieuTraLyLich;