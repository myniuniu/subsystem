import React from 'react';

const iconStyle = {
  width: 16,
  height: 16,
  display: 'inline-block'
};

const Btn = ({ title, children }) => (
  <div
    title={title}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      borderRadius: 6,
      margin: '0 6px',
      cursor: 'pointer'
    }}
  >
    {children}
  </div>
);

const EpblFloatingToolbar = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 8,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20
    }}>
      {/* 主工具栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Btn title="锁定">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M6 10V7a6 6 0 1112 0v3h1a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V11a1 1 0 011-1h1zm2 0h8V7a4 4 0 10-8 0v3z" fill="#555"/></svg>
        </Btn>
        <Btn title="保存">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 4h13l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 2v5h10V6H7zm0 9v3h10v-3H7z" fill="#555"/></svg>
        </Btn>
        <div style={{ width: 1, height: 18, background: '#eee', margin: '0 6px' }} />
        <Btn title="选择">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 3l15 7-6 2 2 6-7-15z" fill="#555"/></svg>
        </Btn>
        <Btn title="拖拽">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M9 2h6v6H9V2zm0 8h6v6H9v-6zm0 8h6v6H9v-6z" fill="#555"/></svg>
        </Btn>
        <Btn title="矩形">
          <svg viewBox="0 0 24 24" style={iconStyle}><rect x="4" y="6" width="16" height="12" rx="2" fill="#555"/></svg>
        </Btn>
        <Btn title="圆形">
          <svg viewBox="0 0 24 24" style={iconStyle}><circle cx="12" cy="12" r="7" fill="#555"/></svg>
        </Btn>
        <Btn title="箭头">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 12h12l-4-4 8 4-8 4 4-4H4z" fill="#555"/></svg>
        </Btn>
        <Btn title="连接线">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 12c4-6 12-6 16 0" stroke="#555" strokeWidth="2" fill="none"/></svg>
        </Btn>
        <Btn title="画笔">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M3 21c4-1 6-3 7-5l9-9a2 2 0 10-3-3l-9 9c-2 1-4 3-4 8z" fill="#555"/></svg>
        </Btn>
        <Btn title="文字">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M4 6h16v2h-7v10h-2V8H4V6z" fill="#555"/></svg>
        </Btn>
        <Btn title="图片">
          <svg viewBox="0 0 24 24" style={iconStyle}><rect x="3" y="5" width="18" height="14" rx="2" fill="#555"/><circle cx="8" cy="10" r="2" fill="#fff"/><path d="M4 17l5-4 4 3 4-5 3 6H4z" fill="#fff"/></svg>
        </Btn>
        <Btn title="代码">
          <svg viewBox="0 0 24 24" style={iconStyle}><path d="M15 4l-6 16" stroke="#555" strokeWidth="2"/><path d="M4 12l5-5M4 12l5 5" stroke="#555" strokeWidth="2" fill="none"/><path d="M20 12l-5-5M20 12l-5 5" stroke="#555" strokeWidth="2" fill="none"/></svg>
        </Btn>
        <Btn title="协作">
          <svg viewBox="0 0 24 24" style={iconStyle}><circle cx="8" cy="9" r="3" fill="#555"/><circle cx="16" cy="9" r="3" fill="#555"/><path d="M4 20c0-3 4-5 8-5s8 2 8 5" fill="#555"/></svg>
        </Btn>
      </div>
      {/* 说明文字（占位） */}
      <div style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 6 }}>
        编辑与绘制：选择工具后在画布中操作（占位）。
      </div>
    </div>
  );
};

export default EpblFloatingToolbar;