import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Drawer, Space, Slider, message, Tooltip, Popover, Tag } from 'antd'
import { MenuOutlined, UnorderedListOutlined, SoundOutlined, CaretRightFilled, PauseOutlined, CloseOutlined, AppstoreOutlined, ExportOutlined, BarChartOutlined, PlayCircleOutlined, CloudUploadOutlined, PlusOutlined, CheckCircleOutlined, PushpinOutlined, VideoCameraOutlined, ClockCircleOutlined, RobotOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

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
  
  const videoRef = useRef(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const [videoInitialized, setVideoInitialized] = useState(false)
  const rafIdRef = useRef(null)
  const [openQueue, setOpenQueue] = useState(false)
  const [viewMode, setViewMode] = useState('media')
  const [hoverPreview, setHoverPreview] = useState(false)
  const [floatOpen, setFloatOpen] = useState(false)
  const [floatPos, setFloatPos] = useState({ x: 20, y: 80 })
  const [floatSize, setFloatSize] = useState({ w: 480, h: 270 })
  const [floatHover, setFloatHover] = useState(false)
  const [openAIToolsPanel, setOpenAIToolsPanel] = useState(false)

  const [uploads, setUploads] = useState([
    { id: 'u1', name: '安全生产宣传片.mp4', size: 820 * 1024 * 1024, uploaded: 240 * 1024 * 1024, status: 'uploading', speedMBps: 4.2, startedAt: Date.now() - Math.floor((240 / 4.2) * 1000) },
    { id: 'u2', name: '课堂互动示例.mov', size: 1560 * 1024 * 1024, uploaded: 0, status: 'paused', speedMBps: 3.1, startedAt: Date.now() }
  ])
  const fileInputRef = useRef(null)
  const [openUploadsPanel, setOpenUploadsPanel] = useState(false)
  const [openPinnedPanel, setOpenPinnedPanel] = useState(false)
  const [openLivePanel, setOpenLivePanel] = useState(false)
  const [aiTasks, setAiTasks] = useState([
    { id: 'ai_plan', name: '学习计划', tool: '学习计划', status: 'running', progress: 35, ratePerSec: 1.2, startedAt: Date.now() - 45_000 },
    { id: 'ai_audio', name: '音频播客', tool: '音频播客', status: 'queued', progress: 0, ratePerSec: 1.0, startedAt: null },
    { id: 'ai_video', name: '视频概览', tool: '视频概览', status: 'running', progress: 62, ratePerSec: 1.6, startedAt: Date.now() - 60_000 },
    { id: 'ai_mindmap', name: '思维导图', tool: '思维导图', status: 'paused', progress: 20, ratePerSec: 0, startedAt: Date.now() - 120_000 },
    { id: 'ai_report', name: '报告', tool: '报告', status: 'done', progress: 100, ratePerSec: 0, startedAt: Date.now() - 5 * 60_000 },
    { id: 'ai_scene', name: '场景模拟', tool: '场景模拟', status: 'queued', progress: 0, ratePerSec: 1.2, startedAt: null }
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setAiTasks(prev => prev.map(t => {
        if (t.status !== 'running') return t
        const np = Math.min(100, t.progress + t.ratePerSec * (0.8 + Math.random() * 0.4))
        return { ...t, progress: np, status: np >= 100 ? 'done' : 'running' }
      }))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pauseTask = (id) => setAiTasks(prev => prev.map(t => (t.id === id ? { ...t, status: 'paused' } : t)))
  const resumeTask = (id) => setAiTasks(prev => prev.map(t => (t.id === id ? { ...t, status: 'running', startedAt: t.startedAt || Date.now() } : t)))
  const cancelTask = (id) => setAiTasks(prev => prev.filter(t => t.id !== id))

  const aiSummary = useMemo(() => {
    const running = aiTasks.filter(t => t.status === 'running').length
    const queued = aiTasks.filter(t => t.status === 'queued').length
    const paused = aiTasks.filter(t => t.status === 'paused').length
    const done = aiTasks.filter(t => t.status === 'done').length
    const total = aiTasks.length
    const overall = Math.round((aiTasks.reduce((a, t) => a + (t.progress || 0), 0) / Math.max(1, aiTasks.length)))
    return { running, queued, paused, done, total, overall }
  }, [aiTasks])

  useEffect(() => {
    const id = setInterval(() => {
      setUploads(prev => prev.map(u => {
        if (u.status !== 'uploading') return u
        const jitter = (Math.random() * 0.8 - 0.4)
        const sp = Math.max(1, (u.speedMBps || 4) + jitter) * 1024 * 1024
        const nu = Math.min(u.size, u.uploaded + sp)
        const done = nu >= u.size
        return { ...u, uploaded: nu, status: done ? 'done' : 'uploading' }
      }))
    }, 900)
    return () => clearInterval(id)
  }, [])

  const pauseUpload = (id) => setUploads(prev => prev.map(u => (u.id === id ? { ...u, status: 'paused' } : u)))
  const resumeUpload = (id) => setUploads(prev => prev.map(u => (u.id === id ? { ...u, status: 'uploading' } : u)))
  const cancelUpload = (id) => setUploads(prev => prev.filter(u => u.id !== id))
  const pauseAll = () => setUploads(prev => prev.map(u => (u.status !== 'done' ? { ...u, status: 'paused' } : u)))
  const resumeAll = () => setUploads(prev => prev.map(u => (u.status !== 'done' ? { ...u, status: 'uploading' } : u)))
  const cancelAll = () => setUploads(prev => prev.filter(u => u.status === 'done'))
  const onAddFilesClick = () => { try { fileInputRef.current?.click() } catch { void 0 } }
  const onAddFiles = (e) => {
    try {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      const items = files.filter(f => f && typeof f.size === 'number').map((f, i) => ({
        id: `f_${Date.now()}_${i}`,
        name: f.name || `未命名_${i}`,
        size: f.size || (800 * 1024 * 1024),
        uploaded: 0,
        status: 'uploading',
        speedMBps: 3 + Math.random() * 3,
        startedAt: Date.now()
      }))
      setUploads(prev => [...prev, ...items])
      try { e.target.value = '' } catch { void 0 }
    } catch { void 0 }
  }
  useEffect(() => {
    if (viewMode === 'upload') {
      setUploads(prev => {
        if (prev.length >= 3) return prev
        const extra = Array.from({ length: 3 - prev.length }).map((_, i) => {
          const speed = 2.5 + Math.random() * 3.5
          const uploaded = Math.floor(Math.random() * 60) * 1024 * 1024
          return {
            id: `seed_${Date.now()}_${i}`,
            name: i % 2 === 0 ? `教学案例_${i + 1}.mp4` : `课堂回放_${i + 1}.mov`,
            size: (600 + Math.floor(Math.random() * 1200)) * 1024 * 1024,
            uploaded,
            status: 'uploading',
            speedMBps: speed,
            startedAt: Date.now() - Math.floor((uploaded / (speed * 1024 * 1024)) * 1000)
          }
        })
        return [...prev, ...extra]
      })
    }
  }, [viewMode])

  const pct = (uploaded, size) => Math.round((uploaded / size) * 100)
  const etaText = (uploaded, size) => {
    const remain = Math.max(0, size - uploaded)
    const sp = 4 * 1024 * 1024
    const sec = Math.ceil(remain / sp)
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}分${s}秒` : `${s}秒`
  }
  const elapsedText = (u) => {
    try {
      let sec
      if (u.startedAt) {
        sec = Math.max(0, Math.floor((Date.now() - u.startedAt) / 1000))
      } else if ((u.uploaded || 0) > 0 && (u.speedMBps || 0) > 0) {
        sec = Math.floor((u.uploaded / (u.speedMBps * 1024 * 1024)))
      } else {
        sec = 0
      }
      const m = Math.floor(sec / 60)
      const s = sec % 60
      return m > 0 ? `${m}分${s}秒` : `${s}秒`
    } catch { return '0秒' }
  }
  
  const draggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const resizingRef = useRef(false)
  const queue = useMemo(() => [
    { id: 'q1', title: '教学基本规范（课堂纪律与仪表）', lecturer: '张老师', duration: 7 * 60 + 22 },
    { id: 'q2', title: '备课方法与案例设计', lecturer: '李老师', duration: 12 * 60 + 35 },
    { id: 'q3', title: '教学互动技巧与提问艺术', lecturer: '王老师', duration: 9 * 60 + 18 },
    { id: 'q4', title: '信息化教学工具入门', lecturer: '陈老师', duration: 15 * 60 + 40 },
    { id: 'q5', title: '课堂评价与反馈', lecturer: '刘老师', duration: 10 * 60 + 5 }
  ], [])

  const pinnedNotes = useMemo(() => [
    { id: 'p1', title: 'SmartNotes · 教学互动设计', updatedAt: '2025-11-20', tag: '教学法' },
    { id: 'p2', title: 'SmartNotes · 安全生产规范梳理', updatedAt: '2025-11-18', tag: '规范' },
    { id: 'p3', title: 'SmartNotes · 课堂提问技巧', updatedAt: '2025-11-12', tag: '互动' },
    { id: 'p4', title: 'SmartNotes · 课后反馈整理', updatedAt: '2025-10-29', tag: '反馈' }
  ], [])

  

  const liveNow = useMemo(() => [
    { id: 'l_now_1', title: '实时教学方法研讨', instructor: '李老师', liveUrl: '/assets/2.mp4', startedAt: '15:00' },
    { id: 'l_now_2', title: '在线课堂互动技巧', instructor: '王老师', liveUrl: '/assets/2.mp4', startedAt: '15:15' }
  ], [])
  const liveSoon = useMemo(() => [
    { id: 'l_soon_1', title: '数字化教学实践分享', instructor: '陈老师', startTime: '16:00' },
    { id: 'l_soon_2', title: '备课方法与案例设计直播', instructor: '张老师', startTime: '16:30' }
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
      } catch { setVisible(false) }
    }
    const onGeometry = (e) => {
      try { setRect(e.titlebarAreaRect || null) } catch { setRect(null) }
      update()
    }
    update()
    api.addEventListener('geometrychange', onGeometry)
    return () => {
      try { api.removeEventListener('geometrychange', onGeometry) } catch { void 0 }
    }
  }, [supports])

  useEffect(() => {
    try { setThemeColor('#fff') } catch { void 0 }
  }, [])

  

  const startDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    draggingRef.current = true
    const ox = e.clientX - floatPos.x
    const oy = e.clientY - floatPos.y
    dragOffsetRef.current = { x: ox, y: oy }
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', endDrag)
  }
  const onDrag = (e) => {
    if (!draggingRef.current) return
    const ox = dragOffsetRef.current.x
    const oy = dragOffsetRef.current.y
    setFloatPos({ x: e.clientX - ox, y: e.clientY - oy })
  }
  const endDrag = () => {
    draggingRef.current = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', endDrag)
  }

  const startResize = (e) => {
    e.preventDefault(); e.stopPropagation()
    resizingRef.current = true
    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', endResize)
  }
  const onResize = (e) => {
    if (!resizingRef.current) return
    const nw = Math.max(240, e.clientX - floatPos.x)
    const nh = Math.max(135, e.clientY - floatPos.y)
    setFloatSize({ w: nw, h: nh })
  }
  const endResize = () => {
    resizingRef.current = false
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', endResize)
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = () => setDuration(v.duration || 0)
    const onTime = () => {
      const t = v.currentTime || 0
      setCurrentTime(t)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnded)
    const t = setTimeout(() => {
      try {
        v.src = '/assets/demo12.mp4'
        v.load()
        setVideoInitialized(true)
      } catch { void 0 }
    }, 600)
    return () => {
      clearTimeout(t)
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
    if (playing) {
      const tick = () => {
        try {
          setCurrentTime(v.currentTime || 0)
          const d = v.duration || 0
          if (d && d !== duration) setDuration(d)
        } catch { void 0 }
        rafIdRef.current = requestAnimationFrame(tick)
      }
      rafIdRef.current = requestAnimationFrame(tick)
      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    } else {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [playing])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const id = setInterval(() => {
      try {
        setCurrentTime(v.currentTime || 0)
        const d = v.duration || 0
        if (d && d !== duration) setDuration(d)
      } catch { void 0 }
    }, 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume / 100
  }, [volume])

  

  

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
  const iconBtn = { ...noDrag, fontSize: 16, color: '#666', padding: 6, borderRadius: 8, transition: 'all .2s ease' }
  const activeIconBtn = { ...iconBtn, color: '#1677ff', backgroundColor: 'rgba(22,119,255,0.12)' }
  const pill = { ...noDrag, position: 'relative', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', padding: '6px 12px 8px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }
  const centerTitle = { display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2, cursor: 'pointer' }
  const centerMain = { fontSize: 15, fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }
  const centerSub = { fontSize: 12, color: '#999', whiteSpace: 'nowrap', textAlign: 'center' }
  
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
  }
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    message.info('正在尝试播放', 0.8)
    try { v.muted = true } catch { void 0 }
    if (!videoInitialized || v.readyState < 2 || !v.src) {
      try {
        v.src = v.src || '/assets/demo12.mp4'
        v.load()
        setVideoInitialized(true)
      } catch { void 0 }
    }
    if (v.paused) {
      try {
        const p = v.play()
        if (p && typeof p.then === 'function') {
          p.then(() => setPlaying(true)).catch(() => { setPlaying(false); message.warning('播放失败，请重试') })
        } else {
          setPlaying(true)
        }
      } catch { setPlaying(false) }
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
      {viewMode === 'media' && (
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
            <div
              style={centerTitle}
              onClick={(e) => {
                e.stopPropagation();
                try {
                  if (typeof window !== 'undefined') {
                    window.location.hash = 'note-edit-page';
                    setTimeout(() => {
                      try {
                        const detail = {
                          id: 'wco-q1',
                          title: '教学基本规范（课堂纪律与仪表）',
                          url: '/assets/demo1.mp4'
                        };
                        window.dispatchEvent(new CustomEvent('openNoteEditPlayback', { detail }));
                      } catch { void 0 }
                    }, 0);
                  }
                } catch { void 0 }
              }}
            >
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
                  onChange={(v) => { setCurrentTime(v); const vid = videoRef.current; if (vid) { vid.currentTime = v; } }}
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
            <div
              style={{
                ...noDrag,
                width: floatOpen ? floatSize.w : 96,
                height: floatOpen ? floatSize.h : 54,
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: floatOpen ? '0 8px 24px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: floatOpen ? '#000' : '#fff',
                zIndex: 3000,
                position: floatOpen ? 'fixed' : 'relative',
                left: floatOpen ? floatPos.x : undefined,
                top: floatOpen ? floatPos.y : undefined
              }}
              onMouseDown={(e) => { e.stopPropagation() }}
              onMouseEnter={() => { if (floatOpen) setFloatHover(true); else setHoverPreview(true) }}
              onMouseLeave={() => { if (floatOpen) setFloatHover(false); else setHoverPreview(false) }}
              onClick={togglePlay}
              onPointerDown={(e) => { e.stopPropagation() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay() } }}
              tabIndex={0}
              title={playing ? '暂停' : '播放'}
            >
              <video
                ref={videoRef}
                preload="auto"
                playsInline
                muted={floatOpen ? false : true}
                style={{ width: '100%', height: '100%', objectFit: floatOpen ? 'contain' : 'cover', pointerEvents: 'none', background: floatOpen ? '#000' : '#fff' }}
              />
              {!floatOpen && hoverPreview && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Tooltip title="悬浮预览">
                    <Button
                      size="small"
                      shape="circle"
                      type="default"
                      style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb' }}
                      onClick={(e) => { e.stopPropagation(); setFloatOpen(true) }}
                    >
                      <ExportOutlined />
                    </Button>
                  </Tooltip>
                </div>
              )}
              {floatOpen && (
                <>
                  <div style={{ position: 'absolute', left: 8, top: 8, width: 'calc(100% - 140px)', height: 28, cursor: 'move', background: 'rgba(255,255,255,0.6)', borderRadius: 6 }} onMouseDown={startDrag} />
                  <div
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      opacity: floatHover ? 1 : 0,
                      transition: 'opacity 160ms ease',
                      pointerEvents: floatHover ? 'auto' : 'none'
                    }}
                  >
                    <Space>
                      <Popover
                        trigger="click"
                        placement="bottomRight"
                        overlayStyle={{ pointerEvents: 'auto' }}
                        content={(
                          <Space>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); setFloatSize({ w: 320, h: 180 }) }}>320×180</Button>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); setFloatSize({ w: 480, h: 270 }) }}>480×270</Button>
                            <Button size="small" onClick={(e) => { e.stopPropagation(); setFloatSize({ w: 640, h: 360 }) }}>640×360</Button>
                          </Space>
                        )}
                      >
                        <Tooltip title="窗口大小">
                          <Button size="small" shape="circle" type="default" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb' }} onClick={(e) => { e.stopPropagation() }}>
                            <AppstoreOutlined />
                          </Button>
                        </Tooltip>
                      </Popover>
                      <Tooltip title="关闭">
                        <Button size="small" shape="circle" type="default" danger style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb' }} onClick={(e) => { e.stopPropagation(); setFloatOpen(false) }}>
                          <CloseOutlined />
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                  <div style={{ position: 'absolute', right: 6, bottom: 6, width: 14, height: 14, borderRight: '2px solid #999', borderBottom: '2px solid #999', cursor: 'nwse-resize' }} onMouseDown={startResize} />
                  <div
                    style={{ position: 'absolute', left: 8, right: 8, bottom: 8, background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 8, opacity: floatHover ? 1 : 0, pointerEvents: floatHover ? 'auto' : 'none', transition: 'opacity 160ms ease' }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="small" shape="circle" type="default" onClick={(e) => { e.stopPropagation(); togglePlay() }}>
                      {playing ? <PauseOutlined /> : <CaretRightFilled />}
                    </Button>
                    <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(currentTime)}</span>
                    <div style={{ ...noDrag, flex: 1 }}>
                      <Slider
                        min={0}
                        max={Math.max(0, Math.floor(duration))}
                        step={1}
                        value={Math.floor(currentTime)}
                        onChange={(v) => { const vid = videoRef.current; if (vid) { vid.currentTime = v; } setCurrentTime(v) }}
                        tooltip={{ open: false }}
                      />
                    </div>
                    <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(duration)}</span>
                    <SoundOutlined style={iconBtn} />
                    <div style={{ ...noDrag, width: 120 }}>
                      <Slider size="small" value={volume} onChange={(v) => { setVolume(v); const vid = videoRef.current; if (vid) vid.volume = v/100 }} tooltip={{ open: false }} />
                    </div>
                    <SoundOutlined rotate={180} style={iconBtn} />
                  </div>
                </>
              )}
            </div>
            <SoundOutlined style={iconBtn} />
            <div style={{ ...noDrag, width: 160 }}>
              <Slider size="small" value={volume} onChange={(v) => { setVolume(v); const vid = videoRef.current; if (vid) vid.volume = v/100 }} tooltip={{ open: false }} />
            </div>
            <SoundOutlined rotate={180} style={iconBtn} />
            <UnorderedListOutlined style={iconBtn} onClick={() => setOpenQueue(v => !v)} />
          </div>
        </div>
      )}
      {viewMode === 'progress' && (
        <div style={{ width: '100%', marginTop: 26, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
          <div style={{ ...pill, minWidth: 520, justifyContent: 'space-between', paddingTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>学习进度</span>
                <span style={{ fontSize: 12, color: '#999' }}>{chapters[idx].title}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>{Math.round((Math.max(0, Math.min(1, (duration ? (currentTime / duration) : 0)))) * 100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(currentTime)}</span>
                <div style={{ ...noDrag, flex: 1 }}>
                  <div style={{ position: 'relative', height: 8, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${duration ? (currentTime / duration) * 100 : 0}%`, background: '#69b1ff' }} />
                  </div>
                </div>
                <span style={{ color: '#9aa0a6', fontSize: 12 }}>{fmt(duration)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
                <span style={{ fontSize: 12, color: '#666' }}>今日学习时长：{fmt(currentTime)}</span>
                <span style={{ fontSize: 12, color: '#666' }}>预计剩余：{fmt(Math.max(0, duration - currentTime))}</span>
                <span style={{ fontSize: 12, color: '#666' }}>章节：{idx + 1}/{chapters.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'pinned' && (
        <div style={{ width: '100%', marginTop: 20, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
          <div style={{ ...pill, minWidth: 520, justifyContent: 'space-between', paddingTop: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, width: '100%' }} onMouseEnter={() => setOpenPinnedPanel(true)}>
              {pinnedNotes.slice(0, 1).map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onMouseDown={(e) => { e.stopPropagation() }}
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      if (typeof window !== 'undefined') {
                        window.location.hash = 'note-edit-page';
                        const detail = { id: n.id, title: n.title };
                        setTimeout(() => { try { window.dispatchEvent(new CustomEvent('openNoteEditPlayback', { detail })) } catch { void 0 } }, 0);
                      }
                    } catch { void 0 }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <PushpinOutlined style={{ color: '#fa8c16' }} />
                    <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#999' }}>{n.tag}</span>
                    <span style={{ fontSize: 12, color: '#666' }}>{n.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'live' && (
        <div style={{ width: '100%', marginTop: 20, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
          <div style={{ ...pill, minWidth: 620, justifyContent: 'space-between', paddingTop: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }} onMouseEnter={() => setOpenLivePanel(true)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {liveNow.slice(0, 1).map(l => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, transition: 'background 160ms ease' }}
                    onMouseDown={(e) => { e.stopPropagation() }}
                    onClick={(e) => { e.stopPropagation(); try { window.location.hash = 'meeting-center' } catch { void 0 } }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <VideoCameraOutlined style={{ color: '#f5222d' }} />
                      <Tag color={'red'} style={{ marginLeft: 0, borderRadius: 12, lineHeight: '18px', height: 22 }}>直播中</Tag>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: '#999' }}>{l.instructor}</span>
                      <span style={{ fontSize: 12, color: '#666' }}>{(() => {
                        try {
                          const [h, m] = String(l.startedAt || '').split(':')
                          const started = dayjs().hour(parseInt(h || '0')).minute(parseInt(m || '0')).second(0)
                          const now = dayjs()
                          const diff = Math.max(0, now.diff(started, 'minute'))
                          return `已开播 ${diff} 分钟`
                        } catch { return '直播中' }
                      })()}</span>
                      <Button size="small" type="primary" style={{ borderRadius: 14, background: 'linear-gradient(90deg,#ff4d4f,#f5222d)' }} onClick={(e) => { e.stopPropagation(); try { window.location.hash = 'meeting-center' } catch { void 0 } }}>进入直播</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'upload' && (
        <div style={{ width: '100%', marginTop: 22, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
          <div style={{ ...pill, minWidth: 640, justifyContent: 'space-between', paddingTop: 8, paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', paddingBottom: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PlayCircleOutlined style={{ color: '#1677ff' }} />
                    <span style={{ fontSize: 12, color: '#666' }}>{uploads.filter(u => u.status === 'uploading').length}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PauseOutlined style={{ color: '#fa8c16' }} />
                    <span style={{ fontSize: 12, color: '#666' }}>{uploads.filter(u => u.status === 'paused').length}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span style={{ fontSize: 12, color: '#666' }}>{uploads.filter(u => u.status === 'done').length}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#666' }}>{Math.round(((uploads.reduce((a, u) => a + (u.uploaded || 0), 0)) / Math.max(1, uploads.reduce((a, u) => a + (u.size || 0), 0))) * 100)}%</span>
                  <div style={{ position: 'relative', width: 160, height: 6, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round(((uploads.reduce((a, u) => a + (u.uploaded || 0), 0)) / Math.max(1, uploads.reduce((a, u) => a + (u.size || 0), 0))) * 100)}%`, background: '#69b1ff' }} />
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, width: '100%', marginTop: 8 }} onMouseEnter={() => { if (uploads.length > 1) setOpenUploadsPanel(true) }}>
              {(((uploads.find(u => u.status === 'uploading')) ? [uploads.find(u => u.status === 'uploading')] : uploads.slice(0, 1))).map(u => (
                <div key={u.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <CloudUploadOutlined style={{ color: '#69b1ff' }} />
                      <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                      <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 10, background: u.status === 'done' ? '#f6ffed' : (u.status === 'paused' ? '#fff7e6' : '#e6f4ff'), color: u.status === 'done' ? '#52c41a' : (u.status === 'paused' ? '#fa8c16' : '#1677ff') }}>
                        {u.status === 'done' ? '已完成' : (u.status === 'paused' ? '已暂停' : '上传中')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {u.status === 'uploading' && (
                        <Tooltip title="暂停">
                          <Button size="small" shape="circle" type="default" onClick={() => pauseUpload(u.id)}>
                            <PauseOutlined />
                          </Button>
                        </Tooltip>
                      )}
                      {u.status === 'paused' && (
                        <Tooltip title="继续">
                          <Button size="small" shape="circle" type="default" onClick={() => resumeUpload(u.id)}>
                            <CaretRightFilled />
                          </Button>
                        </Tooltip>
                      )}
                      {u.status !== 'done' && (
                        <Tooltip title="取消">
                          <Button size="small" shape="circle" danger type="default" onClick={() => cancelUpload(u.id)}>
                            <CloseOutlined />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <div style={{ ...noDrag, width: '100%' }}>
                  <div style={{ position: 'relative', height: 8, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct(u.uploaded, u.size)}%`, background: u.status === 'done' ? '#52c41a' : '#69b1ff' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#666' }}>用时 {elapsedText(u)}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>剩余 {etaText(u.uploaded, u.size)}</span>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'ai-tools' && (
        <div style={{ width: '100%', marginTop: 22, display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'center' }}>
          <div style={{ ...pill, minWidth: 700, justifyContent: 'space-between', paddingTop: 12, paddingBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280, paddingTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PlayCircleOutlined style={{ color: '#1677ff' }} />
                    <span style={{ fontSize: 13, color: '#333' }}>{aiSummary.running}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PauseOutlined style={{ color: '#fa8c16' }} />
                    <span style={{ fontSize: 13, color: '#333' }}>{aiSummary.paused}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span style={{ fontSize: 13, color: '#333' }}>{aiSummary.done}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#666', minWidth: 38, textAlign: 'right' }}>{aiSummary.overall}%</span>
                  <div style={{ flex: 1, position: 'relative', height: 6, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${aiSummary.overall}%`, background: '#69b1ff' }} />
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: 12, width: '100%' }} onMouseEnter={() => setOpenAIToolsPanel(true)}>
                {(((aiTasks.find(t => t.status === 'running')) ? [aiTasks.find(t => t.status === 'running')] : aiTasks.slice(0, 1))).map(t => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <RobotOutlined style={{ color: '#69b1ff' }} />
                      <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                      <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 10, background: t.status === 'done' ? '#f6ffed' : (t.status === 'paused' ? '#fff7e6' : (t.status === 'queued' ? '#fffbe6' : '#e6f4ff')), color: t.status === 'done' ? '#52c41a' : (t.status === 'paused' ? '#fa8c16' : (t.status === 'queued' ? '#d46b08' : '#1677ff') ) }}>
                        {t.status === 'done' ? '生成完成' : (t.status === 'paused' ? '已暂停' : (t.status === 'queued' ? '排队中' : '生成中'))}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#666' }}>进度 {Math.round(t.progress)}%</span>
                      {t.status === 'running' && (
                        <Tooltip title="暂停"><Button size="small" shape="circle" type="default" onClick={() => pauseTask(t.id)}><PauseOutlined /></Button></Tooltip>
                      )}
                      {(t.status === 'paused' || t.status === 'queued') && (
                        <Tooltip title="继续"><Button size="small" shape="circle" type="default" onClick={() => resumeTask(t.id)}><CaretRightFilled /></Button></Tooltip>
                      )}
                      {t.status !== 'done' && (
                        <Tooltip title="取消"><Button size="small" shape="circle" danger type="default" onClick={() => cancelTask(t.id)}><CloseOutlined /></Button></Tooltip>
                      )}
                    </div>
                  </div>
                  <div style={{ ...noDrag, width: '100%' }}>
                    <div style={{ position: 'relative', height: 8, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round(t.progress)}%`, background: t.status === 'done' ? '#52c41a' : '#69b1ff' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      )}

      {false && floatOpen && (<div />)}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', right: 14 }}>
        <Tooltip title="媒体控制">
          <PlayCircleOutlined style={viewMode === 'media' ? activeIconBtn : iconBtn} onClick={() => setViewMode('media')} />
        </Tooltip>
        <Tooltip title="学习进度">
          <BarChartOutlined style={viewMode === 'progress' ? activeIconBtn : iconBtn} onClick={() => setViewMode('progress')} />
        </Tooltip>
        <Tooltip title="直播提醒">
          <VideoCameraOutlined style={viewMode === 'live' ? activeIconBtn : iconBtn} onClick={() => setViewMode('live')} />
        </Tooltip>
        <Tooltip title="置顶主题">
          <PushpinOutlined style={viewMode === 'pinned' ? activeIconBtn : iconBtn} onClick={() => setViewMode('pinned')} />
        </Tooltip>
        <Tooltip title="资料上传">
          <CloudUploadOutlined style={viewMode === 'upload' ? activeIconBtn : iconBtn} onClick={() => setViewMode('upload')} />
        </Tooltip>
        <Tooltip title="智能工具">
          <RobotOutlined style={viewMode === 'ai-tools' ? activeIconBtn : iconBtn} onClick={() => setViewMode('ai-tools')} />
        </Tooltip>
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
        placement="top"
        open={openPinnedPanel}
        onClose={() => setOpenPinnedPanel(false)}
        height={360}
        mask
        maskClosable
        keyboard
        destroyOnClose
        getContainer={() => document.body}
        style={{ zIndex: 2000 }}
        styles={{ header: { WebkitAppRegion: 'no-drag' }, body: { WebkitAppRegion: 'no-drag', padding: 12, display: 'flex', justifyContent: 'center' } }}
        title={<div style={{ width: '100%', textAlign: 'center' }}>置顶主题</div>}
        extra={<Button size="small" type="text" onClick={() => setOpenPinnedPanel(false)}>关闭</Button>}
      >
        <div style={{ width: 640, maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {pinnedNotes.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onMouseDown={(e) => { e.stopPropagation() }}
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    if (typeof window !== 'undefined') {
                      window.location.hash = 'note-edit-page';
                      const detail = { id: n.id, title: n.title };
                      setTimeout(() => { try { window.dispatchEvent(new CustomEvent('openNoteEditPlayback', { detail })) } catch { void 0 } }, 0);
                    }
                  } catch { void 0 }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <PushpinOutlined style={{ color: '#fa8c16' }} />
                  <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{n.tag}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>{n.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      <Drawer
        placement="top"
        open={openLivePanel}
        onClose={() => setOpenLivePanel(false)}
        height={420}
        mask
        maskClosable
        keyboard
        destroyOnClose
        getContainer={() => document.body}
        style={{ zIndex: 2000 }}
        styles={{ header: { WebkitAppRegion: 'no-drag' }, body: { WebkitAppRegion: 'no-drag', padding: 12, display: 'flex', justifyContent: 'center' } }}
        title={<div style={{ width: '100%', textAlign: 'center' }}>直播提醒与入口</div>}
        extra={<Button size="small" type="text" onClick={() => setOpenLivePanel(false)}>关闭</Button>}
      >
        <div style={{ width: 680, maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {[...liveNow, ...liveSoon].map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, border: '1px solid #eef2f7', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseDown={(e) => { e.stopPropagation() }}
                onClick={(e) => { e.stopPropagation(); try { window.location.hash = 'meeting-center' } catch { void 0 } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {('startTime' in l) ? (
                    <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                  ) : (
                    <VideoCameraOutlined style={{ color: '#f5222d' }} />
                  )}
                  <Tag color={('startTime' in l) ? 'orange' : 'red'} style={{ borderRadius: 12, lineHeight: '18px', height: 22 }}>
                    {('startTime' in l) ? '即将直播' : '直播中'}
                  </Tag>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{l.instructor}</span>
                  {('startTime' in l) ? (
                    <span style={{ fontSize: 12, color: '#666' }}>{(() => {
                      try {
                        const [h, m] = String(l.startTime || '').split(':')
                        const target = dayjs().hour(parseInt(h || '0')).minute(parseInt(m || '0')).second(0)
                        const now = dayjs()
                        const diff = Math.max(0, target.diff(now, 'minute'))
                        return `距开始 ${diff} 分钟`
                      } catch { return `${l.startTime} 开播` }
                    })()}</span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#666' }}>{(() => {
                      try {
                        const [h, m] = String(l.startedAt || '').split(':')
                        const started = dayjs().hour(parseInt(h || '0')).minute(parseInt(m || '0')).second(0)
                        const now = dayjs()
                        const diff = Math.max(0, now.diff(started, 'minute'))
                        return `已开播 ${diff} 分钟`
                      } catch { return '直播中' }
                    })()}</span>
                  )}
                  {('startTime' in l) ? (
                    <Button size="small" type="default" style={{ borderRadius: 14 }} onClick={(e) => { e.stopPropagation(); try { window.location.hash = 'meeting-center' } catch { void 0 } }}>查看详情</Button>
                  ) : (
                    <Button size="small" type="primary" style={{ borderRadius: 14, background: 'linear-gradient(90deg,#ff4d4f,#f5222d)' }} onClick={(e) => { e.stopPropagation(); try { window.location.hash = 'meeting-center' } catch { void 0 } }}>进入直播</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      <Drawer
        placement="top"
        open={openUploadsPanel}
        onClose={() => setOpenUploadsPanel(false)}
        height={420}
        mask
        maskClosable
        keyboard
        destroyOnClose
        getContainer={() => document.body}
        style={{ zIndex: 2000 }}
        styles={{ header: { WebkitAppRegion: 'no-drag' }, body: { WebkitAppRegion: 'no-drag', padding: 12, display: 'flex', justifyContent: 'center' } }}
        title={<div style={{ width: '100%', textAlign: 'center' }}>上传队列</div>}
        extra={<Button size="small" type="text" onClick={() => setOpenUploadsPanel(false)}>关闭</Button>}
      >
        <div style={{ width: 640, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
            <input ref={fileInputRef} type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={onAddFiles} />
            <Tooltip title="添加文件">
              <Button size="small" shape="circle" type="default" onClick={onAddFilesClick}><PlusOutlined /></Button>
            </Tooltip>
            <Tooltip title="暂停全部">
              <Button size="small" shape="circle" type="default" onClick={pauseAll}><PauseOutlined /></Button>
            </Tooltip>
            <Tooltip title="继续全部">
              <Button size="small" shape="circle" type="default" onClick={resumeAll}><CaretRightFilled /></Button>
            </Tooltip>
            <Tooltip title="取消未完成">
              <Button size="small" shape="circle" danger type="default" onClick={cancelAll}><CloseOutlined /></Button>
            </Tooltip>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 6 }}>
            {uploads.map(u => (
              <div key={u.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 10, background: u.status === 'done' ? '#f6ffed' : (u.status === 'paused' ? '#fff7e6' : '#e6f4ff'), color: u.status === 'done' ? '#52c41a' : (u.status === 'paused' ? '#fa8c16' : '#1677ff') }}>
                      {u.status === 'done' ? '已完成' : (u.status === 'paused' ? '已暂停' : '上传中')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {u.status === 'uploading' && (
                      <Tooltip title="暂停"><Button size="small" shape="circle" type="default" onClick={() => pauseUpload(u.id)}><PauseOutlined /></Button></Tooltip>
                    )}
                    {u.status === 'paused' && (
                      <Tooltip title="继续"><Button size="small" shape="circle" type="default" onClick={() => resumeUpload(u.id)}><CaretRightFilled /></Button></Tooltip>
                    )}
                    {u.status !== 'done' && (
                      <Tooltip title="取消"><Button size="small" shape="circle" danger type="default" onClick={() => cancelUpload(u.id)}><CloseOutlined /></Button></Tooltip>
                    )}
                  </div>
                </div>
                <div style={{ ...noDrag, width: '100%' }}>
                  <div style={{ position: 'relative', height: 8, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct(u.uploaded, u.size)}%`, background: u.status === 'done' ? '#52c41a' : '#69b1ff' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#666' }}>用时 {elapsedText(u)}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>剩余 {etaText(u.uploaded, u.size)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
      <Drawer
        placement="top"
        open={openAIToolsPanel}
        onClose={() => setOpenAIToolsPanel(false)}
        height={420}
        mask
        maskClosable
        keyboard
        destroyOnClose
        getContainer={() => document.body}
        style={{ zIndex: 2000 }}
        styles={{ header: { WebkitAppRegion: 'no-drag' }, body: { WebkitAppRegion: 'no-drag', padding: 12, display: 'flex', justifyContent: 'center' } }}
        title={<div style={{ width: '100%', textAlign: 'center' }}>智能工具 · 生成进度</div>}
        extra={<Button size="small" type="text" onClick={() => setOpenAIToolsPanel(false)}>关闭</Button>}
      >
        <div style={{ width: 680, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
            <Tag color="blue">运行中 {aiSummary.running}</Tag>
            <Tag color="orange">排队/暂停 {aiSummary.queued}</Tag>
            <Tag color="green">已完成 {aiSummary.done}</Tag>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#666' }}>整体进度</span>
              <div style={{ position: 'relative', width: 160, height: 6, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${aiSummary.overall}%`, background: '#69b1ff' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {aiTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <RobotOutlined style={{ color: '#69b1ff' }} />
                    <div style={{ fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <span style={{ fontSize: 12, padding: '2px 6px', borderRadius: 10, background: t.status === 'done' ? '#f6ffed' : (t.status === 'paused' ? '#fff7e6' : (t.status === 'queued' ? '#fffbe6' : '#e6f4ff')), color: t.status === 'done' ? '#52c41a' : (t.status === 'paused' ? '#fa8c16' : (t.status === 'queued' ? '#d46b08' : '#1677ff')) }}>
                      {t.status === 'done' ? '生成完成' : (t.status === 'paused' ? '已暂停' : (t.status === 'queued' ? '排队中' : '生成中'))}
                    </span>
                  </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#666' }}>进度 {Math.round(t.progress)}%</span>
                  {t.status === 'running' && (
                    <Tooltip title="暂停"><Button size="small" shape="circle" type="default" onClick={() => pauseTask(t.id)}><PauseOutlined /></Button></Tooltip>
                  )}
                  {(t.status === 'paused' || t.status === 'queued') && (
                    <Tooltip title="继续"><Button size="small" shape="circle" type="default" onClick={() => resumeTask(t.id)}><CaretRightFilled /></Button></Tooltip>
                  )}
                  {t.status !== 'done' && (
                    <Tooltip title="取消"><Button size="small" shape="circle" danger type="default" onClick={() => cancelTask(t.id)}><CloseOutlined /></Button></Tooltip>
                  )}
                </div>
              </div>
              <div style={{ ...noDrag, width: '100%' }}>
                <div style={{ position: 'relative', height: 8, backgroundColor: '#e9edf3', border: '1px solid #dde3ea', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(t.progress)}%`, background: t.status === 'done' ? '#52c41a' : '#69b1ff' }} />
                </div>
              </div>
            </div>
          ))}
          </div>
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
      
    </div>
  )
}
