import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Activity, Radio } from 'lucide-react';

const SoundFactoryLive: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [volume, setVolume] = useState(75);
  const [listeners, setListeners] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    // Simulate live waveform data
    const interval = setInterval(() => {
      if (isLive) {
        const newWaveform = Array.from({ length: 20 }, () => Math.random() * 100);
        setWaveform(newWaveform);
        setListeners(prev => prev + Math.floor(Math.random() * 3) - 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setListeners(Math.floor(Math.random() * 1000) + 100);
    } else {
      setListeners(0);
      setWaveform([]);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Sound Factory Live
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-600'
        }`}>
          {isLive ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="mb-4 h-20 bg-black/30 rounded-lg p-2 flex items-end justify-center gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm w-2"
            style={{ height: `${waveform[i] || 0}%` }}
            animate={{ height: `${waveform[i] || 0}%` }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Live Toggle */}
        <motion.button
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            isLive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={toggleLive}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLive ? 'STOP STREAM' : 'GO LIVE'}
        </motion.button>

        {/* Mic Control */}
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              micEnabled ? 'bg-green-600' : 'bg-gray-600'
            }`}
            onClick={() => setMicEnabled(!micEnabled)}
          >
            {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            MIC
          </button>

          <button className="flex-1 py-2 bg-gray-600 rounded-lg flex items-center justify-center gap-2">
            {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {volume}%
          </button>
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {listeners} listeners
          </div>
          <div>
            {isLive ? 'Streaming' : 'Ready to stream'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundFactoryLive;
