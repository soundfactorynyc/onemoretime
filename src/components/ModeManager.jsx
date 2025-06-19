import React, { useState, useEffect } from 'react';
import ThreeWaySwitch from './ThreeWaySwitch.jsx';
import OwncastPlayer from './OwncastPlayer.jsx';

const ModeManager = () => {
  const [currentMode, setCurrentMode] = useState('mixed'); // Default to mixed mode

  const handleModeChange = (newMode) => {
    console.log('Switching to mode:', newMode);
    setCurrentMode(newMode);

    // Hide all mode containers first
    const modes = ['owncast-mode', 'mixed-mode', 'tiktok-mode'];
    modes.forEach(mode => {
      const element = document.getElementById(mode);
      if (element) {
        element.style.display = 'none';
      }
    });

    // Show the selected mode
    const targetElement = document.getElementById(`${newMode}-mode`);
    if (targetElement) {
      targetElement.style.display = 'block';
    }

    // Handle TikTok player and homebase visibility based on mode
    const homebase = document.querySelector('.homebase-container');
    const tikTokPlayer = document.querySelector('[data-tiktok-player]');
    const gridSystem = document.getElementById('harmonyOverlaySystem');

    if (newMode === 'owncast') {
      // OWNCAST MODE: Hide TikTok player, show homebase and grid
      if (tikTokPlayer) tikTokPlayer.style.display = 'none';
      if (homebase) homebase.style.display = 'block';
      if (gridSystem) gridSystem.style.display = 'block';
    } else if (newMode === 'tiktok') {
      // TIKTOK MODE: Show TikTok player, hide homebase and grid
      if (tikTokPlayer) {
        tikTokPlayer.style.display = 'block';
        tikTokPlayer.style.zIndex = '1000';
      }
      if (homebase) homebase.style.display = 'none';
      if (gridSystem) gridSystem.style.display = 'none';
    } else {
      // MIXED MODE: Show everything
      if (tikTokPlayer) {
        tikTokPlayer.style.display = 'block';
        tikTokPlayer.style.zIndex = '500';
      }
      if (homebase) homebase.style.display = 'block';
      if (gridSystem) gridSystem.style.display = 'block';
    }
  };

  useEffect(() => {
    // Initialize with default mode
    handleModeChange(currentMode);
  }, []);

  return (
    <>
      {/* Three-Way Switch */}
      <ThreeWaySwitch 
        currentMode={currentMode} 
        onModeChange={handleModeChange} 
      />

      {/* Owncast Full Screen Mode */}
      <div id="owncast-mode" style={{ display: 'none' }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 500
        }}>
          <OwncastPlayer isFullScreen={true} />
        </div>
      </div>

      {/* Mixed Mode - Floating Owncast */}
      <div id="mixed-mode" style={{ display: 'block' }}>
        <div style={{
          position: 'fixed',
          zIndex: 800
        }}>
          <OwncastPlayer isFloating={true} />
        </div>
      </div>

      {/* TikTok Full Screen Mode */}
      <div id="tiktok-mode" style={{ display: 'none' }}>
        {/* TikTok player will be shown without any overlays */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: '#000'
        }}>
          {/* The existing NextLevelTikTokPlayer will handle this */}
        </div>
      </div>
    </>
  );
};

export default ModeManager;
