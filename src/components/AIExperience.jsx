import React, { useEffect, useRef, useState } from 'react'
import { Tabs, Card, Button, Space, Typography, Row, Col, Upload, Input, Modal, Select, Divider, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import './AIExperience.css'

const { Title, Paragraph, Text } = Typography

const seededColor = (seed) => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  return `hsl(${h},70%,60%)`
}

const AIExperience = () => {
  const [active, setActive] = useState(null) // 当前弹窗 key
  const [imgUrl, setImgUrl] = useState('')
  const [imgRes, setImgRes] = useState('')
  const [voiceTxt, setVoiceTxt] = useState('')
  const [recog, setRecog] = useState(null)
  const [recogOn, setRecogOn] = useState(false)
  const [paintPrompt, setPaintPrompt] = useState('森林里的小鹿')
  const paintRef = useRef(null)
  const [expr, setExpr] = useState('微笑')
  const [gameX, setGameX] = useState(50)

  // 简易图片“分类”：根据平均色判断
  const classifyImage = (url) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width; c.height = img.height
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const d = ctx.getImageData(0, 0, c.width, c.height).data
      let r=0,g=0,b=0
      for (let i=0; i<d.length; i+=4){ r+=d[i]; g+=d[i+1]; b+=d[i+2] }
      const avgR=r/(d.length/4), avgG=g/(d.length/4), avgB=b/(d.length/4)
      let res='物体'
      if (avgG>avgR && avgG>avgB) res='植物/自然'
      else if (avgB>avgR && avgB>avgG) res='天空/水面'
      else if (avgR>150) res='人物/动物'
      setImgRes(res)
    }
    img.onerror = () => message.error('无法读取图片')
    img.src = url
  }

  // 语音识别与合成
  const speak = (txt) => {
    try {
      const u = new SpeechSynthesisUtterance(txt)
      window.speechSynthesis.speak(u)
    } catch {}
  }
  const startRecog = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { message.info('浏览器不支持语音识别，使用文本输入'); return }
    const r = new SR(); r.lang = 'zh-CN'; r.interimResults = true
    r.onresult = (e) => {
      const s = Array.from(e.results).map(res => res[0].transcript).join(' ')
      setVoiceTxt(s)
    }
    r.onend = () => setRecogOn(false)
    r.start(); setRecog(r); setRecogOn(true)
  }
  const stopRecog = () => { try { recog && recog.stop(); setRecogOn(false) } catch {} }

  // AI小画家：基于关键词生成渐变+几何涂鸦
  const paint = () => {
    const canvas = paintRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = 480, h = canvas.height = 300
    const c1 = seededColor(paintPrompt), c2 = seededColor(paintPrompt.split('').reverse().join(''))
    const grd = ctx.createLinearGradient(0,0,w,h)
    grd.addColorStop(0, c1); grd.addColorStop(1, c2)
    ctx.fillStyle = grd; ctx.fillRect(0,0,w,h)
    // 随机几何
    const seed = Array.from(paintPrompt).reduce((a,ch)=>a+ch.charCodeAt(0),0)
    const rand = () => (Math.sin(seed++)+1)/2
    for(let i=0;i<50;i++){
      ctx.fillStyle = `hsla(${Math.floor(rand()*360)},70%,60%,0.4)`
      const x = rand()*w, y = rand()*h, r = rand()*30+5
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill()
      if (i%10===0){ ctx.strokeStyle = '#fff9'; ctx.beginPath(); ctx.moveTo(rand()*w, rand()*h); ctx.lineTo(rand()*w, rand()*h); ctx.stroke() }
    }
    ctx.fillStyle = '#0008'; ctx.font = 'bold 18px sans-serif'
    ctx.fillText(paintPrompt, 14, h-18)
  }
  useEffect(paint, [paintPrompt])

  // 手势游戏：键盘左右控制小球
  useEffect(() => {
    const onKey = (e) => {
      if (e.key==='ArrowLeft') setGameX(x=>Math.max(10,x-8))
      if (e.key==='ArrowRight') setGameX(x=>Math.max(10,Math.min(190,x+8)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const featureCards = [
    { key:'image', title:'图像识别体验', desc:'上传图片，查看简易分类结果', action:() => setActive('image') },
    { key:'voice', title:'语音交互体验', desc:'尝试语音识别与语音合成', action:() => setActive('voice') },
    { key:'pose', title:'姿态识别体验', desc:'原型演示：用键盘左右模拟控制', action:() => setActive('pose') },
    { key:'face', title:'面部表情分析', desc:'摄像头预览+手动选择标签', action:() => setActive('face') },
    { key:'apps', title:'综合AI应用', desc:'AI小画家/表情分析师/手势控制游戏', action:() => setActive('apps') },
  ]

  const renderModal = () => {
    if (!active) return null
    if (active==='image') return (
      <Modal open onCancel={()=>setActive(null)} title="图像识别体验" footer={null} width={680}>
        <Space direction="vertical" style={{width:'100%'}}>
          <Upload accept="image/*" showUploadList={false} beforeUpload={(f)=>{const u=URL.createObjectURL(f); setImgUrl(u); classifyImage(u); return false}}>
            <Button icon={<UploadOutlined/>}>上传图片</Button>
          </Upload>
          {imgUrl && <img src={imgUrl} alt="preview" style={{maxWidth:'100%',borderRadius:8}}/>}
          <AlertLike text={`识别结果：${imgRes || '——'}`} />
          <Paragraph type="secondary">原型算法基于平均色，仅用于体验流程演示。</Paragraph>
        </Space>
      </Modal>
    )
    if (active==='voice') return (
      <Modal open onCancel={()=>setActive(null)} title="语音交互体验" footer={null} width={680}>
        <Space direction="vertical" style={{width:'100%'}}>
          <Space>
            <Button onClick={startRecog} disabled={recogOn}>开始识别</Button>
            <Button onClick={stopRecog} disabled={!recogOn}>停止识别</Button>
            <Button type="primary" onClick={()=>speak(`我听到了：${voiceTxt || '你好'}`)}>朗读反馈</Button>
          </Space>
          <Input.TextArea rows={4} value={voiceTxt} onChange={e=>setVoiceTxt(e.target.value)} placeholder="识别文本或手动输入"/>
          <Paragraph type="secondary">支持浏览器原生语音识别/合成（部分设备不支持）。</Paragraph>
        </Space>
      </Modal>
    )
    if (active==='pose') return (
      <Modal open onCancel={()=>setActive(null)} title="姿态识别体验（原型）" footer={null} width={520}>
        <div className="game-box">
          <div className="game-track"/>
          <div className="game-ball" style={{left: `${gameX}px`}}/>
        </div>
        <Paragraph style={{marginTop:12}}>使用键盘左右方向键移动小球，模拟手势控制流程。</Paragraph>
      </Modal>
    )
    if (active==='face') return (
      <Modal open onCancel={()=>setActive(null)} title="面部表情分析" footer={null} width={520}>
        <Space direction="vertical" style={{width:'100%'}}>
          <Select value={expr} onChange={setExpr} options={[{value:'微笑'},{value:'生气'},{value:'惊讶'},{value:'平静'}]} style={{width:200}}/>
          <AlertLike text={`识别结果：${expr}`} />
          <Paragraph type="secondary">真实表情识别需加载模型，这里用标签选择演示交互与结果呈现。</Paragraph>
        </Space>
      </Modal>
    )
    if (active==='apps') return (
      <Modal open onCancel={()=>setActive(null)} title="综合AI应用" footer={null} width={760}>
        <Row gutter={[12,12]}>
          <Col span={12}>
            <Card title="AI小画家" size="small" extra={<Button onClick={paint}>重新生成</Button>}>
              <Space direction="vertical" style={{width:'100%'}}>
                <Input value={paintPrompt} onChange={e=>setPaintPrompt(e.target.value)} placeholder="描述你想画的内容"/>
                <canvas ref={paintRef} className="paint-canvas"/>
                <Button onClick={()=>{
                  const url = paintRef.current?.toDataURL('image/png'); if(!url) return; const a=document.createElement('a'); a.href=url; a.download='ai_painter.png'; a.click();
                }}>保存图片</Button>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="表情分析师" size="small">
              <Space direction="vertical" style={{width:'100%'}}>
                <Select value={expr} onChange={setExpr} options={[{value:'微笑'},{value:'生气'},{value:'惊讶'},{value:'平静'}]} />
                <Paragraph>解释：{expr==='微笑'?'积极/友好情绪':expr==='生气'?'可能的挫败与压力':expr==='惊讶'?'注意力被新信息吸引':'专注与稳定'}</Paragraph>
              </Space>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="手势控制游戏（原型）" size="small">
              <div className="game-box large">
                <div className="game-track"/>
                <div className="game-ball" style={{left: `${gameX*2}px`}}/>
              </div>
              <Paragraph style={{marginTop:12}}>方向键左右控制。后续可接入摄像头与手势模型，实现真实控制。</Paragraph>
            </Card>
          </Col>
        </Row>
      </Modal>
    )
    return null
  }

  return (
    <div className="ai-experience">
      <div className="ai-exp-header">
        <Title level={3}>AI体验</Title>
        <Paragraph>入门级趣味交互，让学生直观感受 AI 的视觉、听觉、动作与情感感知，激发学习兴趣。</Paragraph>
      </div>
      <Tabs defaultActiveKey="features" items={[
        { key:'features', label:'体验功能', children:(
          <Row gutter={[12,12]}>
            {featureCards.map(fc => (
              <Col key={fc.key} xs={24} sm={12} md={8}>
                <Card hoverable title={fc.title} className="feature-card">
                  <Paragraph type="secondary" style={{minHeight:48}}>{fc.desc}</Paragraph>
                  <Button type="primary" onClick={fc.action}>开始体验</Button>
                </Card>
              </Col>
            ))}
          </Row>
        )},
        { key:'scenarios', label:'典型场景', children:(
          <Space direction="vertical" style={{width:'100%'}}>
            <Card title="场景一：AI小画家" extra={<Text type="secondary">语言到视觉表达</Text>}>
              <Space direction="vertical" style={{width:'100%'}}>
                <Input value={paintPrompt} onChange={e=>setPaintPrompt(e.target.value)} placeholder="例如：海边的日落与灯塔"/>
                <canvas ref={paintRef} className="paint-canvas"/>
              </Space>
            </Card>
            <Card title="场景二：表情分析师" extra={<Text type="secondary">理解情感感知</Text>}>
              <Space>
                <Select value={expr} onChange={setExpr} options={[{value:'微笑'},{value:'生气'},{value:'惊讶'},{value:'平静'}]} />
                <Text>当前情绪：{expr}</Text>
              </Space>
            </Card>
            <Card title="场景三：手势控制游戏" extra={<Text type="secondary">空间思维与协调能力</Text>}>
              <div className="game-box">
                <div className="game-track"/>
                <div className="game-ball" style={{left: `${gameX}px`}}/>
              </div>
              <Paragraph style={{marginTop:12}}>用键盘左右键控制角色移动，后续对接姿态识别实现无触控制。</Paragraph>
            </Card>
          </Space>
        )}
      ]} />

      {renderModal()}
    </div>
  )
}

const AlertLike = ({ text }) => (
  <div style={{background:'rgba(24,144,255,0.08)', border:'1px solid #91d5ff', color:'#0c4a6e', padding:'8px 12px', borderRadius:8}}>{text}</div>
)

export default AIExperience