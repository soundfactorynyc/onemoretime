import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, Sparkles, Volume2, VolumeX, ChevronUp, ChevronDown, Zap, Eye, TrendingUp, Layers, Brain, Gauge, Star, Flame, Camera, Upload, Plus, Smartphone, Timer, Aperture, Palette, Clock, Image, Mic, Film, Share, UserPlus } from 'lucide-react';

const NextLevelTikTokPlayer = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [agreeVote, setAgreeVote] = useState(null); // null, 'Y', or 'N'
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [activeGesture, setActiveGesture] = useState(null);
  const [viewMode, setViewMode] = useState('normal');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [chatReactions, setChatReactions] = useState([]);
  
  // Effects states
  const [beatSync, setBeatSync] = useState(false);
  const [dualCamera, setDualCamera] = useState(false);
  const [burstMode, setBurstMode] = useState(false);
  const [timedCapture, setTimedCapture] = useState(false);
  const [captureDelay, setCaptureDelay] = useState(5);
  const [activeEffects, setActiveEffects] = useState([]);
  const [autoPost, setAutoPost] = useState({
    facebook: false,
    instagram: false,
    tiktok: false,
    twitter: false
  });
  
  const containerRef = useRef(null);
  const startY = useRef(0);

  // No longer need grid functionality - handled by overlay system
  
  // Listen for chat reactions
  useEffect(() => {
    const handleChatReaction = (event) => {
      const { emoji, tier, value } = event.detail;
      const newReaction = {
        id: Date.now() + Math.random(),
        emoji,
        tier,
        value,
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: window.innerHeight - 100,
        createdAt: Date.now()
      };
      
      setChatReactions(prev => [...prev, newReaction]);
      
      // Remove reaction after animation
      setTimeout(() => {
        setChatReactions(prev => prev.filter(r => r.id !== newReaction.id));
      }, 3000);
    };

    document.addEventListener('tiktok-reaction', handleChatReaction);
    return () => document.removeEventListener('tiktok-reaction', handleChatReaction);
  }, []);

  // Sample video data
  const videos = [
    {
      id: 1,
      user: '@mindblowing',
      userAvatar: 'M',
      description: 'Next-level content creation 🚀 #future #tech',
      music: 'Future Beats - Cosmic',
      likes: '2.3M',
      comments: '45K',
      shares: '12K',
      bgColor: 'from-purple-900 to-pink-900'
    },
    {
      id: 2,
      user: '@techmaster',
      userAvatar: 'T',
      description: 'AI-powered effects in action ✨ #ai #effects',
      music: 'Digital Dreams - Synth',
      likes: '5.1M',
      comments: '89K',
      shares: '34K',
      bgColor: 'from-blue-900 to-purple-900'
    },
    {
      id: 3,
      user: '@creative',
      userAvatar: 'C',
      description: 'Revolutionary content ideas 💡 #creative #viral',
      music: 'Innovation - Electronic',
      likes: '3.7M',
      comments: '67K',
      shares: '23K',
      bgColor: 'from-green-900 to-blue-900'
    }
  ];

  // Mind-blowing effects list
  const effects = [
    { id: 'quantum-split', name: 'Quantum Split', icon: Layers, description: 'Split reality' },
    { id: 'time-freeze', name: 'Time Freeze', icon: Clock, description: 'Freeze time' },
    { id: 'hologram', name: 'Hologram', icon: Sparkles, description: '3D projection' },
    { id: 'invisible', name: 'Invisible', icon: Eye, description: 'Disappear' },
    { id: 'portal-jump', name: 'Portal', icon: Aperture, description: 'Create portals' },
    { id: 'clone-army', name: 'Clone', icon: UserPlus, description: 'Multiply' },
    { id: 'reverse-gravity', name: 'Anti-Gravity', icon: Zap, description: 'Defy physics' },
    { id: 'dream-filter', name: 'Dream', icon: Palette, description: 'Surreal' }
  ];

  const toggleEffect = (effectId) => {
    setActiveEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  // Gesture Controls
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentVideo > 0) {
        setCurrentVideo(currentVideo - 1);
      } else if (deltaY < 0 && currentVideo < videos.length - 1) {
        setCurrentVideo(currentVideo + 1);
      }
      startY.current = e.touches[0].clientY;
    }
  };

  // Smart Double Tap Zones
  const handleDoubleTap = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width * 0.3) {
      setActiveGesture('rewind');
      setTimeout(() => setActiveGesture(null), 500);
    } else if (x > width * 0.7) {
      setActiveGesture('forward');
      setTimeout(() => setActiveGesture(null), 500);
    } else {
      setLiked(!liked);
      setActiveGesture('heart');
      setTimeout(() => setActiveGesture(null), 1000);
    }
  };

  const current = videos[currentVideo];

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {/* Full Screen Mobile Container */}
      <div className="relative w-full h-full">
        <div className="relative bg-black overflow-hidden w-full h-full">
          {/* Main Video Container */}
          <div
            ref={containerRef}
            className={`relative w-full h-full bg-gradient-to-br ${current.bgColor} transition-all duration-700`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onDoubleClick={handleDoubleTap}
          >
            {/* Video Player Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/20 text-4xl font-bold">VIDEO</div>
            </div>

            {/* Smart Overlay UI */}
            <div className="absolute inset-0">
              {/* Top Bar with Profile and Description - Moved to very top */}
              <div className="absolute top-4 left-0 right-0 px-3 z-40">
                <div className="flex items-center justify-between">
                  {/* Left: User Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-1 ring-white/50">
                      <span className="text-white text-[10px] font-bold">{current.userAvatar}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-[11px]">{current.user}</h3>
                      <p className="text-white/60 text-[9px]">{current.likes} likes</p>
                    </div>
                  </div>
                </div>
                
                {/* Video Description and Music - Moved from bottom */}
                <div className="mt-2 space-y-1">
                  <p className="text-white/90 text-[11px] drop-shadow-lg leading-tight">{current.description}</p>
                  <div className="flex items-center gap-1.5">
                    <Music className="w-2.5 h-2.5 text-white/80" />
                    <p className="text-white/80 text-[10px] drop-shadow-lg">{current.music}</p>
                  </div>
                </div>
                
                {/* Active Modes Display */}
                <div className="flex items-center gap-1.5 mt-2">
                  {aiMode && (
                    <div className="bg-purple-500/20 backdrop-blur-xl rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Brain className="w-2.5 h-2.5 text-purple-400" />
                      <span className="text-[8px] text-white font-medium">AI</span>
                    </div>
                  )}
                  {dualCamera && (
                    <div className="bg-blue-500/20 backdrop-blur-xl rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Smartphone className="w-2.5 h-2.5 text-blue-400" />
                      <span className="text-[8px] text-white font-medium">Dual</span>
                    </div>
                  )}
                  {beatSync && (
                    <div className="bg-green-500/20 backdrop-blur-xl rounded-full px-2 py-0.5 flex items-center gap-1">
                      <Music className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-[8px] text-white font-medium">Beat</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gesture Feedback */}
              {activeGesture && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  {activeGesture === 'heart' && (
                    <Heart className="w-24 h-24 text-red-500 animate-ping" fill="currentColor" />
                  )}
                  {activeGesture === 'rewind' && (
                    <div className="text-white text-xl font-bold animate-pulse">-10s</div>
                  )}
                  {activeGesture === 'forward' && (
                    <div className="text-white text-xl font-bold animate-pulse">+10s</div>
                  )}
                </div>
              )}



              {/* Top Center Actions - Camera, Upload, Effects - Moved higher to avoid text */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-40">
                {/* Camera Button */}
                <button className="relative group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Upload Button */}
                <button className="relative group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* Effects Button */}
                <button
                  onClick={() => setShowEffects(!showEffects)}
                  className="relative group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>

              {/* Right Side Actions - Like, Follow (oval), Comment & Share */}
              <div className="absolute right-2 top-4 space-y-2 z-40">
                {/* Like & Follow Row - Oval shaped buttons at very top */}
                <div className="flex flex-col gap-1.5">
                  {/* Like Button - Oval */}
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      liked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-xl'
                    }`}
                  >
                    <Heart className="w-3 h-3 text-white" fill={liked ? 'white' : 'none'} />
                    <span className="text-white text-[9px] font-medium">Like</span>
                  </button>

                  {/* Follow Button - Oval */}
                  <button
                    onClick={() => setFollowing(!following)}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      following ? 'bg-white/20' : 'bg-purple-500'
                    }`}
                  >
                    {following ? (
                      <UserPlus className="w-3 h-3 text-white" />
                    ) : (
                      <Plus className="w-3 h-3 text-white" />
                    )}
                    <span className="text-white text-[9px] font-medium">
                      {following ? 'Following' : 'Follow'}
                    </span>
                  </button>

                  {/* Y (Yes/Agree) Button */}
                  <button
                    onClick={() => setAgreeVote(agreeVote === 'Y' ? null : 'Y')}
                    className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                      agreeVote === 'Y' ? 'bg-green-500' : 'bg-white/20 backdrop-blur-xl'
                    }`}
                  >
                    <span className="text-white text-[9px] font-medium">Y</span>
                  </button>

                  {/* N (No/Disagree) Button */}
                  <button
                    onClick={() => setAgreeVote(agreeVote === 'N' ? null : 'N')}
                    className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                      agreeVote === 'N' ? 'bg-red-500' : 'bg-white/20 backdrop-blur-xl'
                    }`}
                  >
                    <span className="text-white text-[9px] font-medium">N</span>
                  </button>
                </div>

                {/* Comment */}
                <button className="relative group">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <MessageCircle className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-medium whitespace-nowrap">{current.comments}</span>
                </button>

                {/* Share */}
                <button className="relative group">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Share2 className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-medium whitespace-nowrap">{current.shares}</span>
                </button>
              </div>

              {/* Effects Panel - Slides from Right */}
              <div className={`absolute right-0 top-4 bottom-0 bg-black/95 backdrop-blur-xl transition-all duration-500 transform ${showEffects ? 'translate-x-0' : 'translate-x-full'} w-72 z-50 rounded-l-3xl`}>
                <div className="h-full flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Mind-Blowing Effects
                    </h3>
                    <button onClick={() => setShowEffects(false)} className="text-white/60">
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                  </div>

                  {/* Quick Toggles */}
                  <div className="space-y-2 mb-4">
                    {/* Dual Camera */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-white text-xs font-medium">Dual Camera</p>
                          <p className="text-[9px] text-gray-400">Front + back</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDualCamera(!dualCamera)}
                        className={`w-10 h-5 rounded-full transition-all ${
                          dualCamera ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${
                          dualCamera ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Beat Sync */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-white text-xs font-medium">Beat Sync</p>
                          <p className="text-[9px] text-gray-400">Effects to rhythm</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setBeatSync(!beatSync)}
                        className={`w-10 h-5 rounded-full transition-all ${
                          beatSync ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${
                          beatSync ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Burst Mode */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-white text-xs font-medium">Burst Mode</p>
                          <p className="text-[9px] text-gray-400">Rapid shots</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setBurstMode(!burstMode)}
                        className={`w-10 h-5 rounded-full transition-all ${
                          burstMode ? 'bg-orange-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${
                          burstMode ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Effects Grid */}
                  <div className="flex-1 overflow-y-auto">
                    <h4 className="text-white text-xs font-medium mb-2">Reality Effects</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {effects.map((effect) => {
                        const Icon = effect.icon;
                        const isActive = activeEffects.includes(effect.id);
                        return (
                          <button
                            key={effect.id}
                            onClick={() => toggleEffect(effect.id)}
                            className={`p-3 rounded-lg border transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500 scale-105' 
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mb-1 mx-auto ${
                              isActive ? 'text-purple-400' : 'text-gray-400'
                            }`} />
                            <h5 className="text-white text-[10px] font-medium">{effect.name}</h5>
                            <p className="text-[8px] text-gray-400">{effect.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-Post */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-white text-xs font-medium mb-2">Auto-Post</h4>
                    <div className="flex gap-2">
                      {Object.entries(autoPost).map(([platform, enabled]) => (
                        <button
                          key={platform}
                          onClick={() => setAutoPost(prev => ({ ...prev, [platform]: !prev[platform] }))}
                          className={`px-3 py-1 rounded-full text-[10px] transition-all ${
                            enabled ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Features Panel - Bottom */}
              <div className={`absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl transition-all duration-500 transform ${showAdvanced ? 'translate-y-0' : 'translate-y-full'} z-50 rounded-t-3xl`}>
                <div className="p-4 space-y-3">
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3" />
                  
                  {/* Feature Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setAiMode(!aiMode)}
                      className={`p-2.5 rounded-xl ${aiMode ? 'bg-purple-500' : 'bg-white/10'} transition-all`}
                    >
                      <Brain className="w-4 h-4 text-white mb-1 mx-auto" />
                      <span className="text-[10px] text-white block">AI Mode</span>
                    </button>

                    <button
                      onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 0.5)}
                      className="p-2.5 rounded-xl bg-white/10"
                    >
                      <Gauge className="w-4 h-4 text-white mb-1 mx-auto" />
                      <span className="text-[10px] text-white block">{playbackSpeed}x</span>
                    </button>

                    <button
                      onClick={() => setHeatmapVisible(!heatmapVisible)}
                      className={`p-2.5 rounded-xl ${heatmapVisible ? 'bg-orange-500' : 'bg-white/10'} transition-all`}
                    >
                      <Flame className="w-4 h-4 text-white mb-1 mx-auto" />
                      <span className="text-[10px] text-white block">Heatmap</span>
                    </button>

                    <button
                      onClick={() => setShowAdvanced(false)}
                      className="p-2.5 rounded-xl bg-white/10"
                    >
                      <ChevronDown className="w-4 h-4 text-white mb-1 mx-auto" />
                      <span className="text-[10px] text-white block">Close</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                <div className="h-full w-1/3 bg-white transition-all duration-300" />
              </div>

              {/* Volume Control */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 left-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center z-30"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/60" /> : <Volume2 className="w-3.5 h-3.5 text-white/60" />}
              </button>

              {/* More Options */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="absolute bottom-4 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center z-30"
              >
                <Zap className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            {/* Heatmap Overlay */}
            {heatmapVisible && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-red-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-orange-500/30 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-yellow-500/30 rounded-full blur-xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextLevelTikTokPlayer;
