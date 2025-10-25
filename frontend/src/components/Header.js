import React, { useState, useEffect } from 'react';
import { User, Bell, LogOut, Settings, Palette } from 'lucide-react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerColor, setHeaderColor] = useState({
    name: 'Xám đen',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    scrolledGradient: 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(55, 65, 81, 0.98) 100%)'
  });

  const colorThemes = [
    {
      name: 'Xám đen',
      gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(55, 65, 81, 0.98) 100%)'
    },
    {
      name: 'Tím',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.98) 0%, rgba(167, 139, 250, 0.98) 100%)'
    },
    {
      name: 'Xanh lá',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.98) 0%, rgba(16, 185, 129, 0.98) 100%)'
    },
    {
      name: 'Cam',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.98) 0%, rgba(249, 115, 22, 0.98) 100%)'
    },
    {
      name: 'Đỏ',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(239, 68, 68, 0.98) 100%)'
    },
    {
      name: 'Hồng',
      gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(219, 39, 119, 0.98) 0%, rgba(236, 72, 153, 0.98) 100%)'
    },
    {
      name: 'Xanh cyan',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(8, 145, 178, 0.98) 0%, rgba(6, 182, 212, 0.98) 100%)'
    },
    {
      name: 'Xanh dương',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      scrolledGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.98) 0%, rgba(59, 130, 246, 0.98) 100%)'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleColorChange = (color) => {
    setHeaderColor(color);
    setShowColorPicker(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: scrolled ? headerColor.scrolledGradient : headerColor.gradient,
      boxShadow: scrolled 
        ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: scrolled ? 'blur(10px)' : 'none'
    }}>
      <div style={{
        maxWidth: '1750px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '20px'
        }}>
          {/* Logo và Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            animation: 'slideInLeft 0.6s ease-out'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 'bold'
              }}>🏛️</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                Hệ Thống Quản Lý Công Dân
              </h1>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                fontWeight: '500'
              }}>
                Cơ Sở Dữ Liệu Quốc Gia - Make by Group 10
              </p>
            </div>
          </div>

          <div style={{ flex: 1 }}></div>

          {/* Time & Date */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '2px',
            animation: 'slideInRight 0.6s ease-out'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#ffffff',
              fontFamily: 'monospace',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              letterSpacing: '1px'
            }}>
              {formatTime(currentTime)}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500'
            }}>
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInRight 0.8s ease-out'
          }}>
            {/* Color Picker Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px) rotate(180deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                }}
              >
                <Palette size={20} />
              </button>

              {showColorPicker && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: 0,
                  width: '280px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  padding: '15px',
                  animation: 'dropDown 0.3s ease-out'
                }}>
                  <h4 style={{ 
                    margin: '0 0 12px', 
                    color: '#1e293b', 
                    fontSize: '16px', 
                    fontWeight: '600' 
                  }}>
                    Chọn màu giao diện
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px'
                  }}>
                    {colorThemes.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(color)}
                        style={{
                          padding: '12px',
                          border: headerColor.name === color.name ? '2px solid #3b82f6' : '2px solid transparent',
                          borderRadius: '8px',
                          background: color.gradient,
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: headerColor.name === color.name ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = headerColor.name === color.name ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none';
                        }}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Bell size={20} />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid #3b82f6',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}></span>
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: 0,
                  width: '320px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  padding: '15px',
                  animation: 'dropDown 0.3s ease-out'
                }}>
                  <h4 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                    Thông báo
                  </h4>
                  <div style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                    Không có thông báo mới
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  height: '42px',
                  padding: '0 15px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <User size={18} />
                <span style={{ fontSize: '14px' }}>Admin</span>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: 0,
                  width: '200px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                  animation: 'dropDown 0.3s ease-out'
                }}>
                  <button style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#ef4444',
                    fontSize: '14px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes dropDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}

export default Header;