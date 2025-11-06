import React, { useState } from 'react';
import { Button, Tooltip, message, Popover } from 'antd';
import { Lightbulb, Phone, Mic, Send } from 'lucide-react';

const circleBtnStyle = {
  width: '36px',
  height: '36px',
  padding: 0,
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%'
};

/**
 * 右侧功能按钮组（与“帮我写作”一致）：模板、灵感、通话、语音、发送
 * 仅负责展示与触发占位行为；真正业务由父组件（AIChat）传入。
 */
const ChatActionButtons = ({ onSend, disabledSend, loading, setInputMessage }) => {
  const info = (txt) => message.info(txt);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {/* 灵感提示 Popover（参考“AI工具箱-帮我写作”样式） */}
      <Popover
        trigger="click"
        placement="top"
        overlayStyle={{ padding: 0 }}
        content={(
          <div style={{ width: 360, borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.12)', background: '#fff' }}>
            <div style={{ padding: '14px 16px 8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={16} color="#1890ff" />
              <span style={{ fontWeight: 600, color: '#1f2937' }}>智能提示</span>
            </div>
            <div style={{ padding: '0 16px 12px 16px', color: '#6b7280', fontSize: 13 }}>智能提示</div>
            <div style={{ padding: '0 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { text: '帮我分析这个问题的核心要点', icon: '🎯' },
                { text: '请提供详细的解决方案', icon: '💡' },
                { text: '总结一下关键信息', icon: '📝' },
                { text: '给出具体的操作步骤', icon: '📋' },
                { text: '分析可能的风险和注意事项', icon: '⚠️' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const suggestion = `${item.text}\n\n课程推荐信息：\n- 学段：小学/初中/高中（按需调整）\n- 课程结构：基础概念 → 案例研讨 → 实践任务 → 成果展示\n- 课时：4–6课时/45分钟\n- 评价：过程性评价 + 项目成果Rubric`;
                    if (setInputMessage) setInputMessage(suggestion);
                    message.success('已填充灵感提示');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    border: '1px solid #eef2f7',
                    borderRadius: 10,
                    padding: '10px 12px',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ color: '#1f2937', fontSize: 14 }}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      >
        <Tooltip title="灵感提示">
          <Button type="text" style={circleBtnStyle}>
            <Lightbulb size={18} />
          </Button>
        </Tooltip>
      </Popover>
      <Tooltip title="语音通话">
        <Button type="text" style={circleBtnStyle} onClick={() => info('开始语音通话（占位）')}>
          <Phone size={18} />
        </Button>
      </Tooltip>
      <Tooltip title="语音输入">
        <Button type="text" style={circleBtnStyle} onClick={() => info('开始语音输入（占位）')}>
          <Mic size={18} />
        </Button>
      </Tooltip>
      <Tooltip title="发送">
        <Button 
          type="primary" 
          style={{ ...circleBtnStyle, background: '#1890ff', color: '#fff' }}
          icon={<Send size={18} />}
          onClick={onSend}
          loading={loading}
          disabled={disabledSend}
        />
      </Tooltip>
    </div>
  );
};

export default ChatActionButtons;