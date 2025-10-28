import React, { useEffect } from 'react';
import { Form, InputNumber, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

// 独立的“研修成果-考核设置”内容副本（与考试页签内容一模一样，但不复用原组件）
const DocumentBasicConfigTab = ({ draft, updateDraft }) => {
  const inlineRow = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  // 默认“成绩设置”为固定成绩；若值非法也纠正为固定成绩
  useEffect(() => {
    const method = draft?.assessment?.method;
    if (!method || (method !== '固定成绩' && method !== '不计成绩')) {
      updateDraft('assessment.method', '固定成绩');
    }
  }, [draft?.assessment?.method]);

  // 当为“固定成绩”且未设置分值时，默认写入100分
  useEffect(() => {
    const method = draft?.assessment?.method;
    const score = draft?.assessment?.fixedScore;
    if (method === '固定成绩' && (score === undefined || score === null)) {
      updateDraft('assessment.fixedScore', 100);
    }
  }, [draft?.assessment?.method, draft?.assessment?.fixedScore]);

  return (
    <Form layout="vertical">
      {/* 考核时间段（秒级） */}
      <Form.Item required label="考核时间：" colon={false} style={{ marginBottom: 12 }}>
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={["开始时间", "结束时间"]}
          value={(
            draft?.exam?.startTime && draft?.exam?.endTime
            ? [dayjs(draft.exam.startTime), dayjs(draft.exam.endTime)]
            : null
          )}
          onChange={(vals) => {
            const [start, end] = vals || [];
            updateDraft('exam.startTime', start ? start.format('YYYY-MM-DD HH:mm:ss') : null);
            updateDraft('exam.endTime', end ? end.format('YYYY-MM-DD HH:mm:ss') : null);
          }}
          style={{ width: 380 }}
        />
      </Form.Item>

      {/* 成绩设置（与点播课一致） */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>成绩设置</div>
        <div style={{ marginTop: 12 }}>
          {(() => {
            const method = draft.assessment?.method || '固定成绩';
            return (
              <div style={inlineRow}>
                <Select
                  size="small"
                  value={method}
                  onChange={(v) => {
                    updateDraft('assessment.method', v);
                    if (v === '固定成绩' && (draft?.assessment?.fixedScore === undefined || draft?.assessment?.fixedScore === null)) {
                      updateDraft('assessment.fixedScore', 100);
                    }
                  }}
                  options={[
                    { value: '固定成绩', label: '固定成绩' },
                    { value: '不计成绩', label: '不计成绩' }
                  ]}
                  style={{ width: 120 }}
                />
                {method === '固定成绩' && (
                  <>
                    <InputNumber
                      size="small"
                      value={draft.assessment?.fixedScore}
                      min={0}
                      max={100}
                      onChange={(v) => updateDraft('assessment.fixedScore', v)}
                      style={{ width: 88 }}
                    />
                    <span>分</span>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </Form>
  );
};

export default DocumentBasicConfigTab;