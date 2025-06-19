import React from 'react';

const ThreeWaySwitch = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'owncast', label: 'OWNCAST', icon: '📺' },
    { id: 'mixed', label: 'MIXED', icon: '🎭' },
    { id: 'tiktok', label: 'TIKTOK', icon: '🎵' }
  ];

  const switchStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 2000,
    display: 'flex',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '25px',
    padding: '6px',
    gap: '4px',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 255, 255, 0.2)'
  };

  const buttonStyle = (mode) => ({
    padding: '8px 16px',
    background: currentMode === mode.id 
      ? 'linear-gradient(45deg, #00FFFF, #FF1493)' 
      : 'transparent',
    color: currentMode === mode.id ? '#000' : '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '80px',
    justifyContent: 'center',
    textShadow: currentMode === mode.id ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.8)',
    transform: currentMode === mode.id ? 'scale(1.05)' : 'scale(1)',
    boxShadow: currentMode === mode.id 
      ? '0 0 15px rgba(0, 255, 255, 0.6)' 
      : 'none'
  });

  const handleModeChange = (modeId) => {
    if (onModeChange) {
      onModeChange(modeId);
    }
  };

  return (
    <div style={switchStyle}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          style={buttonStyle(mode)}
          onClick={() => handleModeChange(mode.id)}
          onMouseEnter={(e) => {
            if (currentMode !== mode.id) {
              e.target.style.background = 'rgba(0, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentMode !== mode.id) {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          <span style={{ fontSize: '14px' }}>{mode.icon}</span>
          <span>{mode.label}</span>
        </button>
      ))}
      
      {/* Mode indicator lights */}
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '4px'
      }}>
        {modes.map((mode) => (
          <div
            key={`indicator-${mode.id}`}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: currentMode === mode.id 
                ? '#00FFFF' 
                : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              boxShadow: currentMode === mode.id 
                ? '0 0 8px #00FFFF' 
                : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreeWaySwitch;
