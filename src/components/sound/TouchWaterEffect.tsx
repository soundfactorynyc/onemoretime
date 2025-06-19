import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import './TouchWaterEffect.css'

export default function TouchWaterEffect() {
  const controls = useAnimation()
  const jellyControls = useAnimation()
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number; intensity: number }[]>([])
  const [crowdEnergy, setCrowdEnergy] = useState(0) // 0-100 crowd energy level
  const [recentInteractions, setRecentInteractions] = useState<number[]>([]) // timestamps
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate crowd energy based on recent interactions
  const updateCrowdEnergy = () => {
    const now = Date.now()
    const recent = recentInteractions.filter(time => now - time < 5000) // last 5 seconds
    setRecentInteractions(recent)
    
    // Energy based on frequency: 0-10 interactions = 0-100 energy
    const energy = Math.min(100, (recent.length / 10) * 100)
    setCrowdEnergy(energy)
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    // Add to recent interactions for crowd energy
    const now = Date.now()
    setRecentInteractions(prev => [...prev, now])
    
    // Calculate intensity based on crowd energy
    const baseIntensity = 1
    const crowdMultiplier = 1 + (crowdEnergy / 100) * 2 // 1x to 3x multiplier
    const intensity = baseIntensity * crowdMultiplier
    
    setRipples((prev) => [...prev, { x, y, id, intensity }])

    // Jelly wobble gets more intense with crowd energy
    const wobbleIntensity = 1 + (crowdEnergy / 100) * 0.5 // 1x to 1.5x
    jellyControls.start({
      scale: [1, 1.02 * wobbleIntensity, 0.98 * wobbleIntensity, 1.01 * wobbleIntensity, 0.995, 1.003, 0.999, 1],
      rotate: [0, 0.5 * wobbleIntensity, -0.3 * wobbleIntensity, 0.2, -0.1, 0.05, 0],
      transition: {
        duration: 1.2 / wobbleIntensity, // Faster with more energy
        ease: "easeOut",
        times: [0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.9, 1]
      }
    })

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 1000)

    // Apply CSS custom properties to the new ripple element
    setTimeout(() => {
      const rippleElement = document.querySelector(`[data-ripple-id="${id}"]`) as HTMLElement
      if (rippleElement) {
        rippleElement.style.setProperty('--x', `${x}px`)
        rippleElement.style.setProperty('--y', `${y}px`)
      }
    }, 0)
  }

  // Update crowd energy periodically
  useEffect(() => {
    const interval = setInterval(updateCrowdEnergy, 500) // Update every 500ms
    return () => clearInterval(interval)
  }, [recentInteractions])

  // Subtle breathing animation for the text
  useEffect(() => {
    controls.start({
      scale: [1, 1.01, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut'
      }
    })
  }, [controls])

  // Update crowd energy on ripple interaction
  useEffect(() => {
    updateCrowdEnergy()
  }, [recentInteractions])

  return (
    <motion.div
      ref={containerRef}
      animate={jellyControls}
      onClick={handleClick}
      className="relative w-full h-full bg-transparent flex items-center justify-center overflow-hidden cursor-pointer water-surface"
    >
      {/* Engraved Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          data-ripple-id={ripple.id}
          className="absolute w-20 h-20 rounded-full pointer-events-none animate-ripple"
        />
      ))}
    </motion.div>
  )
}
