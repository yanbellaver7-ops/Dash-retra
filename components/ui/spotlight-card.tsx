'use client'

import React, { useEffect, useRef, ReactNode } from 'react'
import { useTheme } from '@/lib/theme-context'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'teal' | 'duo'
}

const glowColorMap = {
  blue: { base: 220 },
  purple: { base: 280 },
  green: { base: 120 },
  red: { base: 0 },
  orange: { base: 30 },
  teal: { base: 175 },
  duo: { base: 228 }, // valor inicial — sobrescrito dinamicamente
}

const lightGradients: Record<string, string> = {
  purple: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  teal: 'linear-gradient(135deg, #0D9488, #14B8A6)',
  duo: 'linear-gradient(135deg, #7C3AED 0%, #5b21b6 40%, #0D9488 100%)',
  blue: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
  green: 'linear-gradient(135deg, #15803D, #22C55E)',
  red: 'linear-gradient(135deg, #B91C1C, #EF4444)',
  orange: 'linear-gradient(135deg, #C2410C, #F97316)',
}

const lightBorders: Record<string, string> = {
  purple: 'rgba(168,85,247,0.4)',
  teal: 'rgba(20,184,166,0.4)',
  duo: 'rgba(140,70,200,0.4)',
  blue: 'rgba(59,130,246,0.4)',
  green: 'rgba(34,197,94,0.4)',
  red: 'rgba(239,68,68,0.4)',
  orange: 'rgba(249,115,22,0.4)',
}

const beforeAfterStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 280) 90% 65% / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }
  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'purple',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { dark } = useTheme()

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e
      if (!cardRef.current) return

      cardRef.current.style.setProperty('--x', x.toFixed(2))
      cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
      cardRef.current.style.setProperty('--y', y.toFixed(2))
      cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))

      // Modo duo: interpola o hue entre teal (175) e roxo (280) conforme X do mouse
      if (glowColor === 'duo') {
        const xp = x / window.innerWidth
        const hue = Math.round(175 + xp * (280 - 175))
        cardRef.current.style.setProperty('--hue', String(hue))
        cardRef.current.style.backgroundImage = `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(${hue} 80% 60% / 0.06), transparent
        )`
      }
    }
    document.addEventListener('pointermove', syncPointer)
    return () => document.removeEventListener('pointermove', syncPointer)
  }, [glowColor])

  const { base } = glowColorMap[glowColor]

  const inlineStyles: React.CSSProperties = dark
    ? {
        '--base': base,
        '--radius': '16',
        '--border': '2',
        '--backdrop': 'rgba(255,255,255,0.04)',
        '--backup-border': 'rgba(255,255,255,0.08)',
        '--size': '220',
        '--outer': '1',
        '--border-size': 'calc(var(--border, 2) * 1px)',
        '--spotlight-size': 'calc(var(--size, 150) * 1px)',
        '--hue': base,
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(${base} 80% 60% / 0.06), transparent
        )`,
        backgroundColor: 'var(--backdrop, transparent)',
        backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
        backgroundPosition: '50% 50%',
        backgroundAttachment: 'fixed',
        border: 'var(--border-size) solid var(--backup-border)',
        position: 'relative',
        touchAction: 'none',
      } as React.CSSProperties
    : {
        background: lightGradients[glowColor] || lightGradients.purple,
        border: `1px solid ${lightBorders[glowColor] || lightBorders.purple}`,
        position: 'relative',
        touchAction: 'none',
      }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={inlineStyles}
        className={`rounded-2xl relative ${className}`}
      >
        <div ref={innerRef} data-glow />
        {children}
      </div>
    </>
  )
}

export { GlowCard }
