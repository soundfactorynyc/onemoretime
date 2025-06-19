import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import * as Tone from 'tone'

export default function LiveThrobUI() {
  const controls = useAnimation()
  const buttonControls = useAnimation()
  const backgroundControls = useAnimation()
  const [isActive, setIsActive] = useState(false)
  const [buttonPulse, setButtonPulse] = useState(false)
  const [circleTouch, setCircleTouch] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [beatDetected, setBeatDetected] = useState(false)
  const [lavaBubbles, setLavaBubbles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([])
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [isRippling, setIsRippling] = useState(false)
  const [liquidBreath, setLiquidBreath] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bubbleInterval = useRef<NodeJS.Timeout>()
  const analyser = useRef<Tone.Analyser>()
  const meter = useRef<Tone.Meter>()
  const animationFrame = useRef<number>()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      // Start liquid breathing
      setLiquidBreath(true)
      
      interval = setInterval(() => {
        controls.start({
          scale: [1, 1.015, 1], // More subtle
          opacity: [1, 0.95, 1],
          y: [0, -2, 0], // Slow vertical wave movement
          transition: { 
            duration: 2.4, // Slower, like breathing
            ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier for organic feel
            times: [0, 0.5, 1]
          }
        })
      }, 2400) // Much slower rhythm
    } else {
      setLiquidBreath(false)
    }
    return () => clearInterval(interval)
  }, [isActive, controls])

  // Audio-reactive system
  useEffect(() => {
    if (isActive) {
      // Create audio analysis chain
      analyser.current = new Tone.Analyser('fft', 32)
      meter.current = new Tone.Meter()
      
      // Create a simple oscillator for demo (replace with your audio source)
      const osc = new Tone.Oscillator(60, 'sine').toDestination()
      const lfo = new Tone.LFO(2, 50, 70).connect(osc.frequency)
      
      // Connect to analyzers
      osc.connect(analyser.current)
      osc.connect(meter.current)
      
      osc.start()
      lfo.start()

      // Audio analysis loop
      const analyze = () => {
        if (analyser.current && meter.current) {
          const level = meter.current.getValue() as number
          const fftData = analyser.current.getValue() as Float32Array
          
          // Convert to usable level (0-1)
          const normalizedLevel = Math.max(0, Math.min(1, (level + 60) / 60))
          setAudioLevel(normalizedLevel)

          // Beat detection (simple peak detection)
          const avgLevel = fftData.reduce((sum, val) => sum + Math.abs(val), 0) / fftData.length
          const beatThreshold = -20
          
          if (avgLevel > beatThreshold && !beatDetected) {
            setBeatDetected(true)
            triggerBeatResponse(normalizedLevel)
            setTimeout(() => setBeatDetected(false), 100)
          }
        }
        animationFrame.current = requestAnimationFrame(analyze)
      }
      analyze()

      return () => {
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
        osc?.dispose()
        lfo?.dispose()
        analyser.current?.dispose()
        meter.current?.dispose()
      }
    }
  }, [isActive, beatDetected])

  const triggerBeatResponse = (intensity: number) => {
    // Circle responds to beat
    controls.start({
      scale: [1, 1 + (intensity * 0.1), 1],
      opacity: [1, 0.9 - (intensity * 0.2), 1],
      boxShadow: [
        '0 0 20px rgba(255, 255, 255, 0.1)',
        `0 0 ${60 + intensity * 100}px rgba(255, 200, 150, ${0.3 + intensity * 0.5})`,
        '0 0 20px rgba(255, 255, 255, 0.1)'
      ],
      transition: { duration: 0.3, ease: 'easeOut' }
    })

    // Background responds to beat
    backgroundControls.start({
      opacity: [1, 0.95 - (intensity * 0.1), 1],
      transition: { duration: 0.4, ease: 'easeOut' }
    })

    // Button responds to beat
    if (buttonPulse) {
      buttonControls.start({
        scale: [1, 1 + (intensity * 0.02), 1],
        boxShadow: [
          '0 0 5px rgba(255, 100, 50, 0.3)',
          `0 0 ${20 + intensity * 30}px rgba(255, 150, 100, ${0.6 + intensity * 0.3})`,
          '0 0 5px rgba(255, 100, 50, 0.3)'
        ],
        transition: { duration: 0.3, ease: 'easeOut' }
      })
    }
  }

  // Ripple animation effect
  useEffect(() => {
    if (ripples.length > 0) {
      const interval = setInterval(() => {
        setRipples(prev => 
          prev.map(ripple => ({
            ...ripple,
            scale: ripple.scale + 0.05,
            opacity: ripple.opacity - 0.001
          })).filter(ripple => ripple.opacity > 0 && ripple.scale < 3)
        )
      }, 50)
      
      return () => clearInterval(interval)
    }
  }, [ripples.length])

  // Lava bubble effect (now audio-reactive)
  useEffect(() => {
    if (isActive) {
      bubbleInterval.current = setInterval(() => {
        setLavaBubbles(prev => {
          // Add new bubble occasionally
          const newBubbles = [...prev]
          if (Math.random() < 0.3) {
            newBubbles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 220 + 20, // within circle bounds
              y: Math.random() * 220 + 20,
              size: Math.random() * 3 + 1,
              opacity: Math.random() * 0.4 + 0.1
            })
          }
          
          // Update existing bubbles (fade and move slightly)
          return newBubbles
            .map(bubble => ({
              ...bubble,
              opacity: bubble.opacity - 0.01,
              y: bubble.y - 0.2,
              size: bubble.size + 0.02
            }))
            .filter(bubble => bubble.opacity > 0)
            .slice(-8) // Keep max 8 bubbles
        })
      }, 100)
    } else {
      if (bubbleInterval.current) clearInterval(bubbleInterval.current)
      setLavaBubbles([])
    }
    
    return () => {
      if (bubbleInterval.current) clearInterval(bubbleInterval.current)
    }
  }, [isActive])
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (buttonPulse) {
      interval = setInterval(() => {
        buttonControls.start({
          scale: [1, 1.015, 1],
          opacity: [1, 0.95, 1],
          boxShadow: [
            '0 0 5px rgba(255, 100, 50, 0.3)',
            '0 0 20px rgba(255, 150, 100, 0.6)',
            '0 0 35px rgba(255, 200, 150, 0.8)',
            '0 0 20px rgba(255, 150, 100, 0.6)',
            '0 0 5px rgba(255, 100, 50, 0.3)'
          ],
          borderColor: [
            'rgba(255, 255, 255, 1)',
            'rgba(255, 180, 120, 1)',
            'rgba(255, 220, 180, 1)',
            'rgba(255, 180, 120, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          transition: { 
            duration: 0.8, 
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1]
          }
        })
      }, 800)
    }
    return () => clearInterval(interval)
  }, [buttonPulse, buttonControls])

  const handleStart = async () => {
    await Tone.start()
    setIsActive(true)
    setButtonPulse(true)
  }

  const handleCircleTouch = () => {
    if (isActive) {
      setCircleTouch(true)
      
      // Create subtle ripples
      const newRipples = [
        { id: Date.now(), scale: 1, opacity: 0.05 },
        { id: Date.now() + 1, scale: 1, opacity: 0.03 },
        { id: Date.now() + 2, scale: 1, opacity: 0.02 }
      ]
      setRipples(prev => [...prev, ...newRipples])
      
      // Very subtle touch response
      controls.start({
        scale: [1, 1.02, 1],
        opacity: [1, 0.98, 1],
        transition: { 
          duration: 0.8, 
          ease: 'easeOut'
        }
      })
      setTimeout(() => setCircleTouch(false), 800)
    }
  }

  const handleButtonPress = () => {
    // Press down effect
    buttonControls.start({
      scale: 0.95,
      boxShadow: '0 0 15px rgba(255, 150, 100, 0.8)',
      borderColor: 'rgba(255, 200, 150, 1)',
      transition: { duration: 0.1, ease: 'easeOut' }
    })
  }

  const handleButtonRelease = () => {
    // Release effect with bounce
    buttonControls.start({
      scale: [0.95, 1.05, 1],
      boxShadow: [
        '0 0 15px rgba(255, 150, 100, 0.8)',
        '0 0 25px rgba(255, 200, 150, 0.9)',
        '0 0 5px rgba(255, 100, 50, 0.3)'
      ],
      borderColor: [
        'rgba(255, 200, 150, 1)',
        'rgba(255, 220, 180, 1)',
        'rgba(255, 255, 255, 1)'
      ],
      transition: { 
        duration: 0.3, 
        ease: 'easeOut',
        times: [0, 0.6, 1]
      }
    })
  }

  // Water ripple effect on click
  const handleWaterClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 1000)
  }

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white">
      <motion.div
        ref={containerRef}
        animate={controls}
        whileTap={{ scale: 1.05 }}
        onTap={handleCircleTouch}
        className="w-64 h-64 rounded-full bg-white bg-opacity-5 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white border-opacity-20 cursor-pointer select-none relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,200,150,0.02) 50%, rgba(0,0,0,0.1) 100%)'
        }}
        onClick={handleWaterClick}
      >
        {/* Lava bubbles */}
        {lavaBubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle, rgba(255,150,100,${bubble.opacity}) 0%, rgba(255,200,150,${bubble.opacity * 0.5}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${bubble.size * 2}px rgba(255,180,120,${bubble.opacity * 0.3})`
            }}
            animate={{
              scale: [1, 1.2, 0.8],
              opacity: [bubble.opacity, bubble.opacity * 0.7, 0]
            }}
            transition={{
              duration: 2,
              ease: "easeOut"
            }}
          />
        ))}
        
        <motion.div
          animate={{
            textShadow: circleTouch 
              ? '0 0 20px rgba(255,200,150,0.8)' 
              : '0 0 0px rgba(255,255,255,0)'
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          SoundFactory Pulse
        </motion.div>
      </motion.div>

      <motion.button
        animate={buttonControls}
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
        className="mt-10 px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 select-none"
        onClick={handleStart}
      >
        {isActive ? 'Syncing...' : 'Start Beat Sync'}
      </motion.button>
    </div>
  )
}
