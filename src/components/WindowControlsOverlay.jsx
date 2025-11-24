import React, { useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Space, Typography, Tag } from 'antd'
import { MenuOutlined, StepBackwardOutlined, StepForwardOutlined, StarOutlined, StarFilled } from '@ant-design/icons'

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
      const meta = document.querySelector('meta[name="theme-color"]')
      const color = meta?.getAttribute('content') || '#f7f8fa'
      setThemeColor(color)
    } catch {}
  }, [])

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
    paddingLeft: 0,
    paddingRight: 0,
    zIndex: 1000,
    background: themeColor,
    backgroundImage: undefined,
    backdropFilter: 'none',
    borderBottom: 'none',
    WebkitAppRegion: 'drag'
  }

  const btnStyle = { WebkitAppRegion: 'no-drag' }

  return (
    <div style={containerStyle}>
      <Space size={8} wrap>
        <img
          src="/assets/果仁-头像.png"
          alt="logo"
          style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover', WebkitAppRegion: 'no-drag' }}
        />
        <Button type="default" size="small" icon={<MenuOutlined />} style={btnStyle} onClick={() => setOpenCatalog(v => !v)}>
          课程目录
        </Button>
        <Button type="text" size="small" style={{ ...btnStyle, color: '#666' }}>
          《安全生产》
        </Button>
        <Button size="small" icon={<StepBackwardOutlined />} style={btnStyle} onClick={prev}>
          上一节
        </Button>
        <Button size="small" icon={<StepForwardOutlined />} style={btnStyle} onClick={next}>
          下一节
        </Button>
        <Button size="small" type={fav ? 'primary' : 'default'} icon={fav ? <StarFilled /> : <StarOutlined />} style={btnStyle} onClick={() => setFav((v) => !v)}>
          收藏
        </Button>
        <Tag color="blue" style={{ marginLeft: 8 }}>{current?.title}</Tag>
      </Space>

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
    </div>
  )
}
