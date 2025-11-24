import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Drawer, Space, Typography, Tag, Slider } from 'antd'
import { MenuOutlined, StarOutlined, StarFilled, UnorderedListOutlined, SoundOutlined, CaretRightFilled, PauseOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function WindowControlsOverlay() {
  const supports = typeof navigator !== 'undefined' && 'windowControlsOverlay' in navigator
  const force = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('wco') === 'force'
  const [visible, setVisible] = useState(false)
  const [rect, setRect] = useState(null)
  const [openCatalog, setOpenCatalog] = useState(false)
  const [themeColor, setThemeColor] = useState('#f7f8fa')
  const chapters = useMemo(() => [
    { id: 'c1', title: '第一章 法律法规' },
    { id: 'c2', title: '第二章 安全生产责任制' },
    { id: 'c3', title: '第三章 风险辨识' },
    { id: 'c4', title: '第四章 隐患排查' },
    { id: 'c5', title: '第五章 应急管理' },
    { id: 'c6', title: '第六章 事故案例分析' }
  ], [])
  const [idx, setIdx] = useState(0)
  const favKey = 'wco:fav:safe-production'
  const [fav, setFav] = useState(() => {
    try { return localStorage.getItem(favKey) === '1' } catch { return false }
  })
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const [openQueue, setOpenQueue] = useState(false)
  const queue = useMemo(() => [
    { id: 'q1', title: '教学基本规范（课堂纪律与仪表）', lecturer: '张老师', duration: 7 * 60 + 22 },
    { id: 'q2', title: '备课方法与案例设计', lecturer: '李老师', duration: 12 * 60 + 35 },
    { id: 'q3', title: '教学互动技巧与提问艺术', lecturer: '王老师', duration: 9 * 60 + 18 },
    { id: 'q4', title: '信息化教学工具入门', lecturer: '陈老师', duration: 15 * 60 + 40 },
    { id: 'q5', title: '课堂评价与反馈', lecturer: '刘老师', duration: 10 * 60 + 5 }
  ], [])

  useEffect(() => {
    if (!supports) {
      setVisible(true)
      return
    }
    const api = navigator.windowControlsOverlay
    const update = () => {
      try {
        const v = api.visible
        setVisible(!!v)
      } catch {
        setVisible(false)
      }
    }
    const onGeometry = (e) => {
      try { setRect(e.titlebarAreaRect || null) } catch { setRect(null) }
      update()
    }
    update()
    api.addEventListener('geometrychange', onGeometry)
    return () => {
      try { api.removeEventListener('geometrychange', onGeometry) } catch {}
    }
  }, [supports])

  useEffect(() => {
    try {
      setThemeColor('#fff')
    } catch {}
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.src = '/assets/demo1.mp4'
    const onLoaded = () => setDuration(v.duration || 0)
    const onTime = () => {
      const d = v.duration || 0
      const t = v.currentTime || 0
      setCurrentTime(t)
      setProgress(d ? Math.min(100, Math.max(0, (t / d) * 100)) : 0)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnded)
    v.load()
    return () => {
      v.removeEventListener('loadedmetadata', onLoaded)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume / 100
  }, [volume])

  useEffect(() => {
    try { localStorage.setItem(favKey, fav ? '1' : '0') } catch {}
  }, [fav])

  const current = chapters[idx]
  const prev = () => setIdx((p) => (p > 0 ? p - 1 : p))
  const next = () => setIdx((p) => (p < chapters.length - 1 ? p + 1 : p))

  if (!visible && !force) return null

  const containerStyle = {
    position: 'fixed',
    left: rect ? `${rect.x}px` : 'env(titlebar-area-x, 0px)',
    top: rect ? `${rect.y}px` : 'env(titlebar-area-y, 0px)',
    width: rect ? `${rect.width}px` : 'env(titlebar-area-width, 100%)',
    height: rect ? `${Math.max(rect.height || 0, 40)}px` : 'env(titlebar-area-height, 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingLeft: 14,
    paddingRight: 14,
    zIndex: 1000,
    background: themeColor,
    backgroundImage: undefined,
    backdropFilter: 'none',
    borderBottom: 'none',
    WebkitAppRegion: 'drag'
  }

  const noDrag = { WebkitAppRegion: 'no-drag' }
  const iconBtn = { ...noDrag, fontSize: 16, color: '#666' }
  const pill = { ...noDrag, position: 'relative', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', padding: '6px 12px 8px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }
  const centerTitle = { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }
  const centerMain = { fontSize: 15, fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }
  const centerSub = { fontSize: 12, color: '#999', whiteSpace: 'nowrap', textAlign: 'center' }
  const progressTrack = {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 6,
    height: 8,
    background: '#e9edf3',
    border: '1px solid #dde3ea',
    borderRadius: 10,
    boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04)',
    overflow: 'hidden'
  }
  const progressFill = { height: '100%', width: `${progress}%`, background: '#c2c8d0' }
  const progressRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 4, fontSize: 12, color: '#999' }
  const fmt = (sec) => {
    const s = Math.max(0, Math.floor(sec))
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (n) => n.toString().padStart(2, '0')
    return h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${pad(m)}:${pad(ss)}`
  }

  const seek = (delta) => {
    const v = videoRef.current
    if (!v) return
    const dur = v.duration || 0
    const ct = v.currentTime || 0
    const nt = Math.max(0, Math.min(dur, ct + delta))
    v.currentTime = nt
    setCurrentTime(nt)
    setProgress(dur ? (nt / dur) * 100 : 0)
  }
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    try { if (v.readyState < 2) v.load() } catch {}
    if (v.paused) {
      try {
        const p = v.play()
        if (p && typeof p.then === 'function') {
          p.then(() => setPlaying(true)).catch(() => setPlaying(false))
        } else {
          setPlaying(true)
        }
      } catch {
        setPlaying(false)
      }
    } else {
      v.pause()
      setPlaying(false)
    }
  }
  const circleBtn = { ...noDrag, width: 30, height: 30, borderRadius: 15, border: '2px solid #888', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, position: 'relative', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', userSelect: 'none' }
  const circleArrowLeft = { position: 'absolute', top: 2, left: 6, fontSize: 12, color: '#666' }
  const circleArrowRight = { position: 'absolute', top: 2, right: 6, fontSize: 12, color: '#666' }
  const playBtn = { ...noDrag, width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', userSelect: 'none' }

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={circleBtn} onMouseDown={(e) => { e.stopPropagation() }} onClick={() => seek(-15)}>
            <span style={circleArrowLeft}>↶</span>
            <span>15</span>
          </div>
          <div style={playBtn} onMouseDown={(e) => { e.stopPropagation() }} onClick={togglePlay}>
            {playing ? <PauseOutlined /> : <CaretRightFilled />}
          </div>
          <div style={circleBtn} onMouseDown={(e) => { e.stopPropagation() }} onClick={() => seek(30)}>
            <span style={circleArrowRight}>↷</span>
            <span>30</span>
          </div>
        </div>
        <div style={{ ...pill, minWidth: 480, justifyContent: 'center' }} onMouseDown={(e) => { e.stopPropagation() }} onClick={togglePlay}>
          <div style={centerTitle}>
            <span style={centerMain}>教学基本规范（课堂纪律与仪表）</span>
            <span style={centerSub}>张老师 · 2025年11月11日</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(currentTime)}</span>
            <div style={{ ...noDrag, flex: 1 }}>
              <Slider
                min={0}
                max={Math.max(0, Math.floor(duration))}
                step={1}
                value={Math.floor(currentTime)}
                onChange={(v) => { setCurrentTime(v); const vid = videoRef.current; if (vid) { vid.currentTime = v; } setProgress(duration ? (v / duration) * 100 : 0) }}
                tooltip={{ open: false }}
                railStyle={{ height: 8, backgroundColor: '#e9edf3' }}
                trackStyle={{ height: 8, backgroundColor: '#c2c8d0' }}
                handleStyle={{ width: 12, height: 12, borderRadius: 12, borderColor: '#69b1ff', backgroundColor: '#fff' }}
                style={{ margin: 0 }}
              />
            </div>
            <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(duration)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SoundOutlined style={iconBtn} />
          <div style={{ ...noDrag, width: 160 }}>
            <Slider size="small" value={volume} onChange={(v) => { setVolume(v); const vid = videoRef.current; if (vid) vid.volume = v/100 }} tooltip={{ open: false }} />
          </div>
          <SoundOutlined rotate={180} style={iconBtn} />
        </div>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', right: 14 }}>
        <UnorderedListOutlined style={iconBtn} onClick={() => setOpenQueue(v => !v)} />
      </div>

      <Drawer
        placement="top"
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        height={280}
        mask
        maskClosable
        maskStyle={{ backgroundColor: 'transparent' }}
        keyboard
        getContainer={() => document.body}
        style={{ zIndex: 1001 }}
        styles={{ header: { WebkitAppRegion: 'no-drag', padding: '8px 16px' }, body: { WebkitAppRegion: 'no-drag', padding: 12 } }}
        title={
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Space>
              <MenuOutlined />
              <span>课程目录 · 《安全生产》</span>
            </Space>
          </div>
        }
        extra={<Button type="text" size="small" onClick={() => setOpenCatalog(false)}>收起</Button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {chapters.map((c, i) => (
            <Button
              key={c.id}
              type={i === idx ? 'primary' : 'default'}
              style={{ textAlign: 'left', height: 40, borderRadius: 8 }}
              onClick={() => setIdx(i)}
              block
            >
              {c.title}
            </Button>
          ))}
        </div>
      </Drawer>
      <Drawer
        placement="right"
        open={openQueue}
        onClose={() => setOpenQueue(false)}
        width={360}
        mask
        maskClosable
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
        closable
        destroyOnClose
        keyboard
        getContainer={() => document.body}
        style={{ zIndex: 2000 }}
        styles={{ header: { WebkitAppRegion: 'no-drag' }, body: { WebkitAppRegion: 'no-drag' } }}
        title={<div style={{ width: '100%', textAlign: 'left' }}>待播清单</div>}
        extra={<Button type="text" onClick={() => setOpenQueue(false)}>关闭</Button>}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          {queue.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ maxWidth: 220 }}>
                <div style={{ fontSize: 14, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{item.lecturer}</div>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{fmt(item.duration)}</div>
            </div>
          ))}
        </div>
      </Drawer>
      <video ref={videoRef} style={{ display: 'none' }} preload="metadata" playsInline />
    </div>
  )
}
