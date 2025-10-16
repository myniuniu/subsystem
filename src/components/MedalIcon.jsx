import React from 'react'

const TIERS = {
  silver: {
    ring: ['#f6f8fb', '#c9cdd3'],
    inner: ['#e9edf2', '#b7bac2'],
    accent: '#ffffff'
  },
  gold: {
    ring: ['#ffe9a6', '#d9a850'],
    inner: ['#ffd789', '#c89233'],
    accent: '#fff3c7'
  },
  bronze: {
    ring: ['#f7d7b0', '#c98932'],
    inner: ['#f2c38f', '#b8742a'],
    accent: '#ffe6cc'
  },
  green: {
    ring: ['#9df0c3', '#3fa66e'],
    inner: ['#6ee7a8', '#2e7a53'],
    accent: '#d6fbe7'
  },
  pink: {
    ring: ['#ffc3dd', '#e567a5'],
    inner: ['#ff9fcc', '#cc4f8b'],
    accent: '#ffe1f0'
  },
  dark: {
    ring: ['#2f3a5c', '#121a33'],
    inner: ['#1b2340', '#0c1329'],
    accent: '#415089'
  }
}

const MedalIcon = ({ tier = 'silver', value = 1, size = 96 }) => {
  const t = TIERS[tier] || TIERS.silver
  const id = `medal-${tier}-${size}`
  const strokeWidth = 2
  const radius = (size / 2) - strokeWidth

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="medal-svg">
      <defs>
        <radialGradient id={`${id}-ring`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={t.ring[0]} />
          <stop offset="100%" stopColor={t.ring[1]} />
        </radialGradient>
        <radialGradient id={`${id}-inner`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={t.inner[0]} />
          <stop offset="100%" stopColor={t.inner[1]} />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.85" />
          <stop offset="60%" stopColor={t.accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 外环 */}
      <circle cx={size/2} cy={size/2} r={radius} fill={`url(#${id}-ring)`} stroke="rgba(255,255,255,0.6)" strokeWidth={strokeWidth} />

      {/* 内环 */}
      <circle cx={size/2} cy={size/2} r={radius - 8} fill={`url(#${id}-inner)`} stroke="rgba(255,255,255,0.35)" strokeWidth={strokeWidth} />

      {/* 高光弧 */}
      <path d={`M ${size*0.15} ${size*0.38} A ${size*0.32} ${size*0.32} 0 0 1 ${size*0.85} ${size*0.38}`} fill={`url(#${id}-shine)`} />

      {/* 中心数字 */}
      <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle"
            fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
            fontSize={size * 0.28} fontWeight="800" fill="#ffffff" style={{filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.45))'}}>
        {value}
      </text>

      {/* 环形刻度装饰 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const r1 = radius - 2
        const r2 = radius - 6
        const cx = size/2 + Math.cos(angle) * r1
        const cy = size/2 + Math.sin(angle) * r1
        const tx = size/2 + Math.cos(angle) * r2
        const ty = size/2 + Math.sin(angle) * r2
        return <line key={i} x1={cx} y1={cy} x2={tx} y2={ty} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      })}
    </svg>
  )
}

export default MedalIcon