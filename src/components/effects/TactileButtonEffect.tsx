import React, { useState } from 'react'
import './TactileButtonEffect.css'

interface TactileButtonEffectProps {
  children: React.ReactNode
  onClick?: () => void
  effectType?: 'ripple' | 'pump' | 'pulse' | 'bounce'
}

export default function TactileButtonEffect({ 
  children, 
  onClick, 
  effectType = 'ripple' 
}: TactileButtonEffectProps) {
  const [effects, setEffects] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    // Add new effect
    setEffects(prev => [...prev, { id, x, y }])

    // Remove effect after animation
    setTimeout(() => {
      setEffects(prev => prev.filter(effect => effect.id !== id))
    }, 800)

    // Call original onClick
    if (onClick) onClick()
  }

  return (
    <div className="tactile-button" onClick={handleClick}>
      {children}
      
      {/* Render effects */}
      {effects.map(effect => (
        <div
          key={effect.id}
          className={`tactile-effect tactile-${effectType}`}
          data-x={effect.x}
          data-y={effect.y}
          ref={(el) => {
            if (el) {
              el.style.setProperty('--effect-x', `${effect.x}px`)
              el.style.setProperty('--effect-y', `${effect.y}px`)
            }
          }}
        />
      ))}
    </div>
  )
}
