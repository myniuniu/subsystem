import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Drawer, Space, Slider, message, Tooltip, Popover } from 'antd'
import { MenuOutlined, UnorderedListOutlined, SoundOutlined, CaretRightFilled, PauseOutlined, CloseOutlined, AppstoreOutlined, ExportOutlined } from '@ant-design/icons'

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
  const [openQueue, setOpenQueue] = useState(false)
  const [hoverPreview, setHoverPreview] = useState(false)
  const [floatOpen, setFloatOpen] = useState(false)
  const [floatPos, setFloatPos] = useState({ x: 20, y: 80 })
  const [floatSize, setFloatSize] = useState({ w: 480, h: 270 })
  const [floatHover, setFloatHover] = useState(false)
  
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
      } catch { }
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
  const iconBtn = { ...noDrag, fontSize: 16, color: '#666' }
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
      } catch { }
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
              width: 96,
              height: 54,
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              background: '#000',
              zIndex: 1002,
              position: 'relative'
            }}
            onMouseDown={(e) => { e.stopPropagation() }}
            onMouseEnter={() => setHoverPreview(true)}
            onMouseLeave={() => setHoverPreview(false)}
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
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />
            {hoverPreview && (
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
          </div>
          <SoundOutlined style={iconBtn} />
          <div style={{ ...noDrag, width: 160 }}>
            <Slider size="small" value={volume} onChange={(v) => { setVolume(v); const vid = videoRef.current; if (vid) vid.volume = v/100 }} tooltip={{ open: false }} />
          </div>
          <SoundOutlined rotate={180} style={iconBtn} />
        </div>
      </div>

      {floatOpen && (
        <div
          style={{
            position: 'fixed',
            left: floatPos.x,
            top: floatPos.y,
            width: floatSize.w,
            height: floatSize.h,
            background: '#000',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            WebkitAppRegion: 'no-drag'
          }}
          onMouseEnter={() => setFloatHover(true)}
          onMouseLeave={() => setFloatHover(false)}
        >
          <div style={{ flex: 1, position: 'relative', background: '#000' }}>
            <video
              src={videoRef.current ? videoRef.current.src : '/assets/demo1.mp4'}
              controls
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
            />
            <div
              style={{ position: 'absolute', left: 8, top: 8, width: 'calc(100% - 140px)', height: 28, cursor: 'move', background: 'rgba(255,255,255,0.6)', borderRadius: 6 }}
              onMouseDown={startDrag}
            />
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
                    <Button
                      size="small"
                      shape="circle"
                      type="default"
                      style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb' }}
                      onClick={(e) => { e.stopPropagation() }}
                    >
                      <AppstoreOutlined />
                    </Button>
                  </Tooltip>
                </Popover>
                <Tooltip title="关闭">
                  <Button
                    size="small"
                    shape="circle"
                    type="default"
                    danger
                    style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb' }}
                    onClick={(e) => { e.stopPropagation(); setFloatOpen(false) }}
                  >
                    <CloseOutlined />
                  </Button>
                </Tooltip>
              </Space>
            </div>
            <div
              style={{ position: 'absolute', right: 6, bottom: 6, width: 14, height: 14, borderRight: '2px solid #999', borderBottom: '2px solid #999', cursor: 'nwse-resize' }}
              onMouseDown={startResize}
            />
          </div>
        </div>
      )}

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
      
    </div>
  )
}
