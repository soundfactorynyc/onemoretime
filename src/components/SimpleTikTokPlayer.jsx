import React from 'react';

const SimpleTikTokPlayer = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, #ff0050, #00ff50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>🎵 TIKTOK PLAYER 🎵</div>
        <div style={{ fontSize: '16px', marginTop: '10px' }}>
          Simple Test Version
        </div>
        <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
          This should be visible when toggle is in TikTok mode
        </div>
      </div>
    </div>
  );
};

export default SimpleTikTokPlayer;
