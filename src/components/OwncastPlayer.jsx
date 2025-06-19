import React, { useState, useRef, useEffect } from 'react';

const OwncastPlayer = ({ 
  isFullScreen = false, 
  isFloating = false, 
  streamUrl = "https://demo.owncast.online/hls/stream.m3u8",
  onResize = null 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (newMuted) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = volume;
      }
    }
  };

  // Floating window dragging
  const handleMouseDown = (e) => {
    if (!isFloating) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isFloating) return;
    setPosition({
      x: e.clientX - size.width / 2,
      y: e.clientY - size.height / 2
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Resize handles for floating mode
  const handleResize = (e, direction) => {
    if (!isFloating) return;
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) newWidth = Math.max(200, startWidth + deltaX);
      if (direction.includes('left')) newWidth = Math.max(200, startWidth - deltaX);
      if (direction.includes('bottom')) newHeight = Math.max(150, startHeight + deltaY);
      if (direction.includes('top')) newHeight = Math.max(150, startHeight - deltaY);

      setSize({ width: newWidth, height: newHeight });
      if (onResize) onResize({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const containerStyle = {
    position: isFloating ? 'fixed' : 'relative',
    width: isFullScreen ? '100vw' : isFloating ? `${size.width}px` : '100%',
    height: isFullScreen ? '100vh' : isFloating ? `${size.height}px` : '100%',
    left: isFloating ? `${position.x}px` : 'auto',
    top: isFloating ? `${position.y}px` : 'auto',
    zIndex: isFloating ? 1000 : 'auto',
    borderRadius: isFloating ? '12px' : '0',
    overflow: 'hidden',
    boxShadow: isFloating ? '0 8px 32px rgba(0, 255, 255, 0.3)' : 'none',
    border: isFloating ? '2px solid rgba(0, 255, 255, 0.4)' : 'none',
    cursor: isDragging ? 'grabbing' : isFloating ? 'grab' : 'default'
  };

  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    background: '#000'
  };

  const controlsStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '8px 12px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)'
  };

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        style={videoStyle}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={streamUrl} type="application/x-mpegURL" />
        <p>Your browser doesn't support live streaming.</p>
      </video>

      {/* Live Indicator */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'rgba(255, 0, 0, 0.9)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'white',
          animation: 'pulse 2s infinite'
        }}></div>
        LIVE
      </div>

      {/* Viewer Count */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '15px',
        fontSize: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        👁 {Math.floor(Math.random() * 1000) + 500} watching
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        <button
          onClick={togglePlay}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <button
          onClick={toggleMute}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />

        {isFloating && (
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Drag to move • Resize corners
          </div>
        )}
      </div>

      {/* Resize Handles for Floating Mode */}
      {isFloating && (
        <>
          {/* Corner resize handles */}
          <div
            onMouseDown={(e) => handleResize(e, 'bottom-right')}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '20px',
              height: '20px',
              cursor: 'nw-resize',
              background: 'rgba(0, 255, 255, 0.5)',
              borderRadius: '0 0 12px 0'
            }}
          />
          <div
            onMouseDown={(e) => handleResize(e, 'bottom-left')}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '20px',
              height: '20px',
              cursor: 'ne-resize',
              background: 'rgba(0, 255, 255, 0.5)',
              borderRadius: '0 0 0 12px'
            }}
          />
        </>
      )}

      {/* Pulse animation for live indicator */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default OwncastPlayer;
