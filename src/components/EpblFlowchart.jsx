import React, { useState, useRef, useEffect } from 'react';

const EpblFlowchart = ({ onSelectNode = () => {} }) => {
  const [nodes, setNodes] = useState({
    // 整体增大间距并下移，使初始布局位于画布正中
    topic: { x: 940, y: 160, w: 120, h: 40, label: '研究课题' },
    mechanism: { x: 300, y: 280, w: 210, h: 40, label: '理解咖啡的作用机制' },
    individual_diff: { x: 820, y: 280, w: 220, h: 40, label: '调查个体差异' },
    design_experiment: { x: 1340, y: 280, w: 210, h: 40, label: '设计实验' },
    impact_body: { x: 220, y: 420, w: 220, h: 40, label: '咖啡因如何影响人体' },
    brain_reaction: { x: 520, y: 420, w: 230, h: 40, label: '咖啡因在大脑中的反应' },
    metabolism_speed: { x: 820, y: 420, w: 180, h: 40, label: '差异与代谢速度' },
    habit_influence: { x: 1120, y: 420, w: 200, h: 40, label: '生活习惯与影响' },
    sample_define: { x: 1340, y: 420, w: 190, h: 40, label: '确定研究样本' },
    steps_define: { x: 1640, y: 420, w: 190, h: 40, label: '实验步骤制定' },
    data_collect: { x: 1460, y: 520, w: 210, h: 40, label: '数据收集与分析' },
    synthesis: { x: 940, y: 560, w: 120, h: 50, label: '综合分析' },
    write_report: { x: 820, y: 680, w: 120, h: 40, label: '撰写报告' },
    results_display: { x: 1060, y: 680, w: 120, h: 40, label: '结果展示' }
  });

  const svgRef = useRef(null);
  const dragRef = useRef({ id: null, dx: 0, dy: 0 });
  const playerDragRef = useRef({ dragging: false, dx: 0, dy: 0 });
  const surveyDragRef = useRef({ dragging: false, dx: 0, dy: 0 });
  const pptDragRef = useRef({ dragging: false, dx: 0, dy: 0 });
  const [playerSize, setPlayerSize] = useState({ w: 320, h: 180 });
  const resizePlayerRef = useRef({ resizing: false, dx: 0, dy: 0 });
  const PLAYER_W = 320;
  const PLAYER_H = 180;
  const [zoom, setZoom] = useState(0.88);

  const getSVGPoint = (evt) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  const beginDrag = (id, e) => {
    const p = getSVGPoint(e);
    const n = nodes[id];
    dragRef.current = { id, dx: p.x - n.x, dy: p.y - n.y };
  };
  const onMove = (e) => {
    const { id, dx, dy } = dragRef.current;
    const p = getSVGPoint(e);
    if (id) {
      setNodes((prev) => ({ ...prev, [id]: { ...prev[id], x: p.x - dx, y: p.y - dy } }));
    }
    if (playerDragRef.current.dragging) {
      const { dx: pdx, dy: pdy } = playerDragRef.current;
      setPlayerPos(({ x, y }) => ({ x: p.x - pdx, y: p.y - pdy }));
    }
    if (resizePlayerRef.current.resizing) {
      const { dx: rdx, dy: rdy } = resizePlayerRef.current;
      const newW = Math.max(160, p.x - rdx - playerPos.x);
      const newH = Math.max(90, p.y - rdy - playerPos.y);
      setPlayerSize({ w: newW, h: newH });
    }
    if (surveyDragRef.current.dragging) {
      const { dx: sdx, dy: sdy } = surveyDragRef.current;
      setSurveyPos(({ x, y }) => ({ x: p.x - sdx, y: p.y - sdy }));
    }
    if (pptDragRef.current.dragging) {
      const { dx: xdx, dy: ydy } = pptDragRef.current;
      setPptPos(({ x, y }) => ({ x: p.x - xdx, y: p.y - ydy }));
    }
  };
  const endDrag = () => { 
    dragRef.current = { id: null, dx: 0, dy: 0 }; 
    playerDragRef.current = { dragging: false, dx: 0, dy: 0 };
    resizePlayerRef.current = { resizing: false, dx: 0, dy: 0 };
    surveyDragRef.current = { dragging: false, dx: 0, dy: 0 };
    pptDragRef.current = { dragging: false, dx: 0, dy: 0 };
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    return () => {
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('mouseup', endDrag);
      svg.removeEventListener('mouseleave', endDrag);
    };
  }, []);

  const anchor = (n, side) => {
    const { x, y, w, h } = n;
    switch (side) {
      case 'top': return { x: x + w / 2, y };
      case 'right': return { x: x + w, y: y + h / 2 };
      case 'bottom': return { x: x + w / 2, y: y + h };
      case 'left': return { x, y: y + h / 2 };
      default: return { x: x + w / 2, y: y + h / 2 };
    }
  };
  const bestSidePair = (src, dst) => {
    const dx = (dst.x + dst.w / 2) - (src.x + src.w / 2);
    const dy = (dst.y + dst.h / 2) - (src.y + src.h / 2);
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? ['right', 'left'] : ['left', 'right'];
    } else {
      return dy > 0 ? ['bottom', 'top'] : ['top', 'bottom'];
    }
  };
  const pathBetween = (src, dst) => {
    const [s, d] = bestSidePair(src, dst);
    const a = anchor(src, s);
    const b = anchor(dst, d);
    const mx = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  };

  const Rect = ({ id }) => (
    <>
      <rect x={nodes[id].x} y={nodes[id].y} width={nodes[id].w} height={nodes[id].h} rx="8" fill="#fff" stroke="#000" style={{ cursor: 'grab' }} onMouseDown={(e) => beginDrag(id, e)} onClick={() => onSelectNode({ id, label: nodes[id].label })} />
      <text x={nodes[id].x + nodes[id].w / 2} y={nodes[id].y + nodes[id].h / 2 + 5} textAnchor="middle" fontFamily="Arial" fontSize="14">{nodes[id].label}</text>
    </>
  );

  // 播放器位置（相对于“咖啡因如何影响人体”的下沿，可拖动）
  const playerBaseX = nodes.impact_body.x + (nodes.impact_body.w - playerSize.w) / 2;
  const playerBaseY = nodes.impact_body.y + nodes.impact_body.h + 8; // 紧挨下沿，间距8
  const [playerPos, setPlayerPos] = useState({ x: playerBaseX, y: playerBaseY });
  const beginPlayerDrag = (e) => {
    const p = getSVGPoint(e);
    playerDragRef.current = { dragging: true, dx: p.x - playerPos.x, dy: p.y - playerPos.y };
    e.preventDefault();
  };
  const beginPlayerResize = (e) => {
    const p = getSVGPoint(e);
    resizePlayerRef.current = { resizing: true, dx: p.x - (playerPos.x + playerSize.w), dy: p.y - (playerPos.y + playerSize.h) };
    e.preventDefault();
    e.stopPropagation();
  };

  // 调查问卷 iframe（放到“设计实验”的上方，避免遮挡）
  const SURVEY_W = 360;
  const SURVEY_H = 220;
  const surveyBaseX = nodes.design_experiment.x + (nodes.design_experiment.w - SURVEY_W) / 2;
  const surveyBaseY = nodes.design_experiment.y - SURVEY_H - 24;
  const [surveyPos, setSurveyPos] = useState({ x: surveyBaseX, y: surveyBaseY });
  const beginSurveyDrag = (e) => {
    const p = getSVGPoint(e);
    surveyDragRef.current = { dragging: true, dx: p.x - surveyPos.x, dy: p.y - surveyPos.y };
    e.preventDefault();
  };
  const surveyRect = { x: surveyPos.x, y: surveyPos.y, w: SURVEY_W, h: SURVEY_H };
  // PPT iframe（默认放在“数据收集与分析”的下方，可拖动）
  const PPT_W = 480;
  const PPT_H = 270;
  const pptBaseX = nodes.data_collect.x + (nodes.data_collect.w - PPT_W) / 2;
  const pptBaseY = nodes.data_collect.y + nodes.data_collect.h + 24;
  const [pptPos, setPptPos] = useState({ x: pptBaseX, y: pptBaseY });
  const beginPptDrag = (e) => {
    const p = getSVGPoint(e);
    pptDragRef.current = { dragging: true, dx: p.x - pptPos.x, dy: p.y - pptPos.y };
    e.preventDefault();
  };
  const pptRect = { x: pptPos.x, y: pptPos.y, w: PPT_W, h: PPT_H };

  // 仿真页面 iframe（与“咖啡因在大脑中的反应”虚线关联，显示在“撰写报告”的左下方且朝向该元素）
  const SIM_W = 420;
  const SIM_H = 240;
  const simRect = {
    x: nodes.write_report.x - SIM_W - 24, // 写作报告左侧偏移一段距离
    y: nodes.write_report.y + nodes.write_report.h + 24, // 写作报告下方一定间距
    w: SIM_W,
    h: SIM_H
  };

  return (
    <div className="epblCanvasScroll" style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden' }}>
      {/* 隐藏滚动条样式 */}
      <style>{`
        .epblCanvasScroll { scrollbar-width: none; -ms-overflow-style: none; }
        .epblCanvasScroll::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
      `}</style>
      {/* 悬浮缩放控件 - 左下角 */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 16px', borderRadius: 16, background: '#eef0f7', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', color: '#1f2937', fontSize: 16 }}>
          <button onClick={() => setZoom(z => Math.max(0.5, parseFloat((z - 0.06).toFixed(2))))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#1f2937' }}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.5, parseFloat((z + 0.06).toFixed(2))))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: '#1f2937' }}>+</button>
        </div>
      </div>
      <svg ref={svgRef} viewBox="0 0 2000 1200" width="100%" height={1200} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', transform: `scale(${zoom})`, transformOrigin: '50% 50%' }}>
        <defs>
          {/* 灰色线条与箭头样式 */}
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
          </marker>
          {/* 轻阴影 */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15" />
          </filter>
        </defs>
        {/* 顶部与中层节点 */}
        {/* 左侧/中间布局：按栅格重新定位，接近图示 */}
        <Rect id="topic" />
        <Rect id="mechanism" />
        <Rect id="individual_diff" />
        <Rect id="design_experiment" />

        {/* 顶部到中层连线 */}
        <path d={pathBetween(nodes.topic, nodes.individual_diff)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.topic, nodes.mechanism)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.topic, nodes.design_experiment)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />

        {/* 左侧与中间子节点（可拖拽） */}
        {/* 左侧两项与中间两项 */}
        <Rect id="impact_body" />
        <Rect id="brain_reaction" />
        <Rect id="metabolism_speed" />
        <Rect id="habit_influence" />

        {/* 右侧子节点 */}
        <Rect id="sample_define" />
        <Rect id="steps_define" />
        <Rect id="data_collect" />

        {/* 主题说明视频（可拖动与缩放） */}
        <foreignObject x={playerPos.x} y={playerPos.y} width={playerSize.w} height={playerSize.h} onMouseDown={beginPlayerDrag} style={{ cursor: 'move' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', overflow: 'hidden', border: '2px solid #1a1a1a', background: '#000', filter: 'url(#shadow)' }}>
            <video src="/assets/demo1.mp4" controls style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', right: 4, bottom: 4, width: 14, height: 14, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'nwse-resize' }} onMouseDown={beginPlayerResize} />
          </div>
        </foreignObject>
        {/* 外部打开图标（播放器右上角） */}
        <g transform={`translate(${playerPos.x + playerSize.w - 28}, ${playerPos.y + 8})`} style={{ cursor: 'pointer' }} onClick={() => { try { if (typeof window !== 'undefined') window.open('/assets/demo1.mp4','_blank','noopener,noreferrer'); } catch {} }}>
          <rect x="0" y="0" width="24" height="24" rx="6" fill="#fff" stroke="#1a1a1a" />
          <path d="M8 16h8V8M12 8h4v4" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
        </g>

        {/* 调查问卷 iframe（仅显示一道题的尺寸） */}
          <foreignObject x={surveyPos.x} y={surveyPos.y} width={SURVEY_W} height={SURVEY_H} onMouseDown={beginSurveyDrag} style={{ cursor: 'move' }}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', borderRadius: 12, border: '2px solid #1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', overflow: 'hidden', background: '#fff' }}>
              <iframe title="调查问卷" style={{ width: '100%', height: '100%', border: 'none' }}
              srcDoc={`<!DOCTYPE html><html><head><meta charset='utf-8' /><meta name='viewport' content='width=device-width,initial-scale=1'/>
                <style>
                  body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:12px;background:#fff;color:#333}
                  .card{border:1px solid #ddd;border-radius:10px;padding:12px}
                  h3{margin:0 0 10px;font-size:16px}
                  .opt{margin:6px 0;display:flex;align-items:center;gap:8px;font-size:14px}
                  .next{margin-top:12px;padding:6px 10px;border:1px solid #1890ff;color:#1890ff;border-radius:6px;background:#f0f7ff;cursor:pointer}
                  .prev{margin-top:12px;margin-right:8px;padding:6px 10px;border:1px solid #666;color:#333;border-radius:6px;background:#f5f5f5;cursor:pointer}
                  .disabled{opacity:0.6;cursor:not-allowed}
                </style>
              </head>
              <body>
                <div class='card'>
                  <h3 id='title'>问卷：咖啡因摄入与日常状态</h3>
                  <div id='options'></div>
                  <div><button id='prevBtn' class='prev'>上一题</button> <button id='nextBtn' class='next'>下一题</button></div>
                </div>
                <script>
                  const questions = [
                    { title: '问卷：咖啡因摄入与日常状态',
                      options: ['我每天都摄入咖啡因','我偶尔摄入咖啡因','我几乎不摄入咖啡因'], name: 'q1' },
                    { title: '摄入后您的精神状态如何？',
                      options: ['更容易集中注意力','略有提升','没有明显变化'], name: 'q2' },
                    { title: '平均每日摄入咖啡因的杯数？',
                      options: ['0','1','2','3及以上'], name: 'q3' }
                  ];
                  let idx = 0;
                  const titleEl = document.getElementById('title');
                  const optEl = document.getElementById('options');
                  const nextBtn = document.getElementById('nextBtn');
                  const prevBtn = document.getElementById('prevBtn');

                  function render() {
                    const q = questions[idx];
                    titleEl.textContent = q.title;
                    optEl.innerHTML = q.options.map(function (txt, i) {
                      const id = q.name + '_' + i;
                      return '<div class="opt"><input type="radio" name="' + q.name + '" id="' + id + '" /><label for="' + id + '">' + txt + '</label></div>';
                    }).join('');
                    nextBtn.textContent = idx < questions.length - 1 ? '下一题' : '已完成';
                    nextBtn.className = idx < questions.length - 1 ? 'next' : 'next disabled';
                    prevBtn.style.display = idx > 0 ? 'inline-block' : 'none';
                  }
                  render();
                  nextBtn.addEventListener('click', () => {
                    if (idx < questions.length - 1) {
                      idx++;
                      render();
                    }
                  });
                  prevBtn.addEventListener('click', () => {
                    if (idx > 0) {
                      idx--;
                      render();
                    }
                  });
                </script>
              </body></html>`}
              />
            </div>
          </foreignObject>
        {/* 外部打开图标（问卷右上角） */}
        <g transform={`translate(${surveyPos.x + SURVEY_W - 28}, ${surveyPos.y + 8})`} style={{ cursor: 'pointer' }} onClick={() => { try { if (typeof window !== 'undefined') window.open('https://example.com/survey-demo','_blank','noopener,noreferrer'); } catch {} }}>
          <rect x="0" y="0" width="24" height="24" rx="6" fill="#fff" stroke="#1a1a1a" />
          <path d="M8 16h8V8M12 8h4v4" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
          <title>访问地址：https://example.com/survey-demo</title>
        </g>

        {/* 数据收集与分析关联 PPT 展示（虚线连接） */}
        <foreignObject x={pptRect.x} y={pptRect.y} width={pptRect.w} height={pptRect.h} onMouseDown={beginPptDrag} style={{ cursor: 'move' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', borderRadius: 12, border: '2px solid #1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', overflow: 'hidden', background: '#fff' }}>
            <iframe title="设计实验PPT" style={{ width: '100%', height: '100%', border: 'none' }}
              srcDoc={'<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/>' +
                '<style>body{margin:0;background:#fafafa;font-family:Arial,Helvetica,sans-serif;color:#333} .slide{display:flex;align-items:center;justify-content:center;height:100vh;}' +
                '.frame{width:94%;height:86%;border:12px solid #000;border-radius:12px;background:#222;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,0.2)}' +
                '</style></head><body><div class="slide"><div class="frame">PPT 演示占位（设计实验）</div></div></body></html>'}
            />
          </div>
        </foreignObject>
        {/* 外部打开图标（PPT右上角） */}
        <g transform={`translate(${pptRect.x + PPT_W - 28}, ${pptRect.y + 8})`} style={{ cursor: 'pointer' }} onClick={() => { try { if (typeof window !== 'undefined') window.open('https://example.com/ppt-demo','_blank','noopener,noreferrer'); } catch {} }}>
          <rect x="0" y="0" width="24" height="24" rx="6" fill="#fff" stroke="#1a1a1a" />
          <path d="M8 16h8V8M12 8h4v4" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
          <title>访问地址：https://example.com/ppt-demo</title>
        </g>

        {/* 咖啡因在大脑中的反应 → 仿真页面（虚线连接） */}
        <foreignObject x={simRect.x} y={simRect.y} width={simRect.w} height={simRect.h}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', borderRadius: 12, border: '2px solid #1a1a1a', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', overflow: 'hidden', background: '#fff' }}>
            <iframe title="咖啡因作用仿真" style={{ width: '100%', height: '100%', border: 'none' }}
              srcDoc={'<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/>' +
                '<style>body{margin:0;font-family:Arial,Helvetica,sans-serif;color:#333;background:#fff}' +
                '.toolbar{display:flex;gap:8px;padding:8px;border-bottom:1px solid #eee;background:#f7f7fb}' +
                '.btn{padding:6px 10px;border:1px solid #1890ff;color:#1890ff;border-radius:6px;background:#f0f7ff;cursor:pointer}' +
                '.stage{position:relative;height:180px;background:#fafafa;overflow:hidden}' +
                '.neuron{position:absolute;left:16px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:12px;background:#8b5cf6;box-shadow:0 4px 12px rgba(0,0,0,0.15)}' +
                '.signal{position:absolute;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:7px;background:#10b981;box-shadow:0 2px 8px rgba(16,185,129,0.4)}' +
                '.label{padding:8px;color:#666;font-size:12px;border-top:1px solid #eee}' +
                '</style></head><body>' +
                '<div class="toolbar"><button id="start" class="btn">开始仿真</button><button id="stop" class="btn">停止</button></div>' +
                '<div class="stage" id="stage"><div class="neuron"></div><div class="signal" id="sig"></div></div>' +
                '<div class="label">仿真：信号沿着神经路径传播，点击开始/停止控制动画。</div>' +
                '<script>(function(){var running=false;var t=0;var sig=document.getElementById("sig");var st=document.getElementById("stage");var W=st.clientWidth;function step(){if(!running) return; t+=2; var x=16+t; if(x>W-20){t=0;x=16;} sig.style.left=x+"px"; requestAnimationFrame(step);}document.getElementById("start").addEventListener("click",function(){ if(!running){ running=true; requestAnimationFrame(step);} });document.getElementById("stop").addEventListener("click",function(){ running=false; });})();</script>' +
                '</body></html>'}
            />
          </div>
        </foreignObject>
        {/* 外部打开图标（仿真右上角） */}
        <g transform={`translate(${simRect.x + SIM_W - 28}, ${simRect.y + 8})`} style={{ cursor: 'pointer' }} onClick={() => { try { if (typeof window !== 'undefined') window.open('https://example.com/simulation-demo','_blank','noopener,noreferrer'); } catch {} }}>
          <rect x="0" y="0" width="24" height="24" rx="6" fill="#fff" stroke="#1a1a1a" />
          <path d="M8 16h8V8M12 8h4v4" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
          <title>访问地址：https://example.com/simulation-demo</title>
        </g>

        {/* 自动吸附连线 */}
        <path d={pathBetween(nodes.mechanism, nodes.impact_body)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.mechanism, nodes.brain_reaction)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.individual_diff, nodes.metabolism_speed)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.habit_influence, nodes.design_experiment)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.data_collect, nodes.design_experiment)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.sample_define, nodes.design_experiment)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.steps_define, nodes.design_experiment)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />

        {/* 连接“调查个体差异”到调查问卷 iframe（虚线） */}
        <path d={pathBetween(nodes.individual_diff, surveyRect)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" strokeDasharray="6 4" />
        {/* 连接“数据收集与分析”到 PPT iframe（虚线） */}
        <path d={pathBetween(nodes.data_collect, pptRect)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" strokeDasharray="6 4" />
        {/* 连接“咖啡因在大脑中的反应”到 仿真 iframe（虚线） */}
        <path d={pathBetween(nodes.brain_reaction, simRect)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" strokeDasharray="6 4" />

        {/* 底部综合与输出 */}
        <Rect id="synthesis" />
        <path d={pathBetween(nodes.impact_body, nodes.synthesis)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.brain_reaction, nodes.synthesis)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.metabolism_speed, nodes.synthesis)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.habit_influence, nodes.synthesis)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />

        <Rect id="write_report" />
        <Rect id="results_display" />
        <path d={pathBetween(nodes.synthesis, nodes.write_report)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
        <path d={pathBetween(nodes.synthesis, nodes.results_display)} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
      </svg>
    </div>
  );
};

export default EpblFlowchart;