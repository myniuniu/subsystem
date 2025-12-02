import React, { useMemo, useState } from 'react';
import { Typography, Button, Progress, Space } from 'antd';
import { LeftOutlined, RightOutlined, DownloadOutlined, ReloadOutlined, FullscreenOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text } = Typography;

export default function MemoryCardViewer({
  rightPanelMemoryCardsRecord,
  setRightPanelView,
  setRightPanelMemoryCardsRecord
}) {
  const exercises = useMemo(() => {
    const arr = Array.isArray(rightPanelMemoryCardsRecord?.exercises) ? rightPanelMemoryCardsRecord.exercises : [];
    return arr.slice(0, 10);
  }, [rightPanelMemoryCardsRecord]);
  const total = exercises.length;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = exercises[index] || { question: '', answer: '' };
  const percent = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;
  const sourceCount = Array.isArray(rightPanelMemoryCardsRecord?.sourceRefs) ? rightPanelMemoryCardsRecord.sourceRefs.length : 0;

  const prev = () => {
    setShowAnswer(false);
    setIndex(i => Math.max(0, i - 1));
  };
  const next = () => {
    setShowAnswer(false);
    setIndex(i => Math.min(total - 1, i + 1));
  };
  const restart = () => {
    setShowAnswer(false);
    setIndex(0);
  };
  const onBack = () => {
    setRightPanelMemoryCardsRecord(null);
    setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'radial-gradient(1200px 400px at 50% 30%, rgba(99,135,255,0.08), transparent), radial-gradient(1200px 400px at 50% 70%, rgba(99,255,171,0.08), transparent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>教学题卡</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{`基于${sourceCount}个来源`}</Text>
        </div>
        <Space>
          <Button type="text" icon={<FullscreenOutlined />} />
          <Button type="text" onClick={onBack}>返回</Button>
        </Space>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 860, height: 580, maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button shape="circle" icon={<LeftOutlined />} onClick={prev} disabled={index === 0} style={{ position: 'absolute', left: 16, width: 48, height: 48 }} />
          <div style={{ width: 520, minHeight: 560, borderRadius: 24, background: '#262626', color: '#fff', padding: '32px 28px', boxShadow: '0 24px 72px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 20, lineHeight: 1.9, textAlign: 'center', whiteSpace: 'pre-wrap' }}>{showAnswer ? current.answer : current.question}</div>
            <Button type="text" onClick={() => setShowAnswer(s => !s)} style={{ color: '#bfbfbf', fontSize: 14 }}>{showAnswer ? '隐藏答案' : '查看答案'}</Button>
          </div>
          <Button shape="circle" icon={<RightOutlined />} onClick={next} disabled={index >= total - 1} style={{ position: 'absolute', right: 16, width: 48, height: 48 }} />
        </div>
      </div>

      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button type="text" icon={<ReloadOutlined />} onClick={restart} />
          <div style={{ width: 360 }}>
            <Progress percent={percent} showInfo={false} size="small" />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{`${index + 1} / ${total}`}</Text>
          <Button type="text" icon={<DownloadOutlined />} />
        </Space>
        <Space>
          <Button icon={<LikeOutlined />} />
          <Button icon={<DislikeOutlined />} />
        </Space>
      </div>
    </div>
  );
}
