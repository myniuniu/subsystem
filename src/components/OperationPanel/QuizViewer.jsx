import React, { useMemo, useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { FullscreenOutlined, LikeOutlined, DislikeOutlined, BulbOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text } = Typography;

export default function QuizViewer({ rightPanelQuizRecord, setRightPanelView, setRightPanelQuizRecord }) {
  const questions = useMemo(() => {
    const arr = Array.isArray(rightPanelQuizRecord?.questions) ? rightPanelQuizRecord.questions : [];
    return arr.slice(0, 10);
  }, [rightPanelQuizRecord]);
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [responses, setResponses] = useState(() => new Array(total).fill(null));
  const [completed, setCompleted] = useState(false);

  const current = questions[index] || { stem: '', options: [], answer: 0, explain: '' };
  const sourceCount = Array.isArray(rightPanelQuizRecord?.sourceRefs) ? rightPanelQuizRecord.sourceRefs.length : 0;
  const next = () => {
    const ni = Math.min(total - 1, index + 1);
    setIndex(ni);
    setSelected(responses[ni]);
    setShowExplain(false);
    setShowHint(false);
  };
  const prev = () => {
    const ni = Math.max(0, index - 1);
    setIndex(ni);
    setSelected(responses[ni]);
    setShowExplain(false);
    setShowHint(false);
  };
  const onBack = () => {
    setRightPanelQuizRecord(null);
    setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
  };


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>教学测验</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{`基于${sourceCount}个来源`}</Text>
        </div>
        <Space>
          <Button type="text" icon={<FullscreenOutlined />} />
          <Button type="text" onClick={onBack}>返回</Button>
        </Space>
      </div>

      {!completed && (
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>{`第${index + 1} / 共${total}题`}</Text>
          <div />
        </div>
      )}

      {!completed && (
        <div style={{ flex: 1, padding: '12px 20px' }}>
          <div style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 16, color: '#111827', lineHeight: 1.8 }}>{current.stem}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {current.options.map((opt, i) => {
              const isSelected = selected === i;
              const correct = i === current.answer;
              const bg = isSelected ? (correct ? '#d9f7be' : '#fff1f0') : '#f5f5f5';
              const border = isSelected ? (correct ? '1px solid #73d13d' : '1px solid #ffa39e') : '1px solid #f0f0f0';
              return (
                <div
                  key={`opt-${i}`}
                  onClick={() => {
                    setSelected(i);
                    setShowExplain(true);
                    setResponses(prev => {
                      const nextArr = [...prev];
                      nextArr[index] = i;
                      return nextArr;
                    });
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: bg,
                    border,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 24, color: '#8c8c8c' }}>{String.fromCharCode(65 + i)}.</div>
                    <div style={{ flex: 1, color: '#111827' }}>{opt}</div>
                  </div>
                  {isSelected && correct && (
                    <div style={{ marginTop: 8, color: '#389e0d', fontWeight: 600 }}>回答正确！</div>
                  )}
                  {isSelected && showExplain && (
                    <div style={{ marginTop: 8, borderRadius: 10, padding: 12, background: '#fafafa', color: '#555' }}>{current.explain}</div>
                  )}
                </div>
              );
            })}
          </div>
          {showHint && (
            <div style={{ marginTop: 16, borderRadius: 12, padding: 12, background: '#eef2ff', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <BulbOutlined style={{ color: '#8c8cff', marginTop: 2 }} />
                <div style={{ lineHeight: 1.8 }}>{current.hint}</div>
              </div>
            </div>
          )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <Button onClick={() => setShowHint(s => !s)}>{showHint ? '收起' : '提示'}</Button>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={prev} disabled={index === 0}>上一个</Button>
                {index < total - 1 && (
                  <Button type="primary" onClick={next}>下一个</Button>
                )}
                {index >= total - 1 && (
                  <Button type="primary" onClick={() => setCompleted(true)}>完成</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {completed && (
        <div style={{ flex: 1, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(() => {
            const answered = responses.filter(v => v !== null).length;
            const right = responses.reduce((acc, v, i) => acc + (v === (questions[i]?.answer) ? 1 : 0), 0);
            const wrong = answered - right;
            const skipped = total - answered;
            const score = right;
            const accuracy = total > 0 ? Math.round((right / total) * 100) : 0;
            return (
              <div style={{ maxWidth: 900, width: '100%' }}>
                <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 600, color: '#111827', margin: '40px 0 28px' }}>
                  {answered === 0 ? '尚未作答任何题目' : '测验已完成'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: 20 }}>
                  <div style={{ background: '#f5f5f5', borderRadius: 16, padding: '18px 24px', minWidth: 220 }}>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>得分</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{`${score} / ${total}`}</div>
                  </div>
                  <div style={{ background: '#f5f5f5', borderRadius: 16, padding: '18px 24px', minWidth: 220 }}>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>正确率</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{`${accuracy}%`}</div>
                  </div>
                  <div style={{ background: '#f5f5f5', borderRadius: 16, padding: '18px 24px', minWidth: 220 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 10 }}>
                      <div style={{ color: '#6b7280' }}>正确</div>
                      <div style={{ fontWeight: 700 }}>{right}</div>
                      <div style={{ color: '#6b7280' }}>错误</div>
                      <div style={{ fontWeight: 700 }}>{wrong}</div>
                      <div style={{ color: '#6b7280' }}>跳过</div>
                      <div style={{ fontWeight: 700 }}>{skipped}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
                  <Button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9999, padding: '8px 16px', color: '#374151' }}
                    onClick={() => { setCompleted(false); setIndex(0); setSelected(responses[0]); }}>回顾测验</Button>
                  <Button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 9999, padding: '8px 16px', color: '#374151' }}
                    onClick={() => { setResponses(new Array(total).fill(null)); setIndex(0); setSelected(null); setCompleted(false); setShowExplain(false); setShowHint(false); }}>重新测验</Button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<LikeOutlined />} />
          <Button icon={<DislikeOutlined />} />
        </Space>
      </div>
    </div>
  );
}
