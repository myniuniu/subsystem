import React, { useMemo, useState } from 'react';
import { Form, Input, InputNumber, Switch, Select } from 'antd';
// 图标不再使用，相关导入已移除

// Typography 不再使用

// 范围与 AI 出题相关常量与工具函数已移除（迁移至“试题”页签的“配置”子页签）

const BasicConfigTab = ({ draft, updateDraft, formatKey, configModal, formatConfigs, phaseMaterials, getDefaultConfig }) => {
  const inlineRow = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  // 范围与 AI 出题配置已迁移至“试题”页签的“配置”子页签，这里不再维护相关状态与逻辑

  return (
    <Form layout="vertical">
      {/* 考试说明 */}
      <Form.Item label="考试说明" style={{ marginBottom: 8 }}>
        <Input.TextArea
          value={draft.details}
          onChange={(e) => updateDraft('details', e.target.value)}
          placeholder="请填写考试说明"
          rows={3}
          style={{ fontSize: 12 }}
        />
      </Form.Item>

      <Form.Item label="考核权重(%)" style={{ marginBottom: 8 }}>
        <InputNumber
          size="small"
          value={draft.assessment?.weight}
          min={0}
          max={100}
          onChange={(v) => updateDraft('assessment.weight', v)}
          style={{ width: 160 }}
        />
      </Form.Item>

      {(formatKey === 'live' || formatKey === 'videos') && (
        <>
          <Form.Item label="考核方式" style={{ marginBottom: 8 }}>
            <Select
              size="small"
              value={draft.assessment?.method}
              onChange={(v) => updateDraft('assessment.method', v)}
              options={[{ value: '观看时长', label: '观看时长' }]}
            />
          </Form.Item>
          <Form.Item label="达标观看占比(%)" style={{ marginBottom: 8 }}>
            <InputNumber
              size="small"
              value={draft.watch?.requiredPercent}
              min={0}
              max={100}
              onChange={(v) => updateDraft('watch.requiredPercent', v)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </>
      )}

      {formatKey === 'exam' && (
        <>
          {/* 考试设置 */}
          <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d9d9d9' }}>●</span>
            <span>考试设置</span>
          </div>
          <Form.Item label="及格分：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.assessment?.enablePass}
                onChange={(checked) => updateDraft('assessment.enablePass', checked)}
              />
              <span>达到</span>
              <InputNumber
                size="small"
                value={draft.assessment?.passScore}
                min={0}
                max={100}
                onChange={(v) => updateDraft('assessment.passScore', v)}
                style={{ width: 88 }}
              />
              <span>分及格</span>
            </div>
          </Form.Item>

          {/* 考试范围功能已迁移到“试题”页签的“配置”子页签，这里不再展示 */}

          {/* AI智能出题入口已移至“试题”页签的“配置”子页签，这里不再展示 */}

          {/* 当前出题规则预览已移至“试题”页签，这里不再展示 */}

          {/* AI规则配置模态框已移至“试题”页签，这里不再展示 */}

          {/* 考试时长 */}
          <Form.Item required label="考试时长：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <span>达到</span>
              <InputNumber
                size="small"
                value={draft.exam?.durationMinutes}
                min={1}
                max={600}
                onChange={(v) => updateDraft('exam.durationMinutes', v)}
                style={{ width: 88 }}
              />
              <span>分钟必须交卷</span>
            </div>
          </Form.Item>

          {/* 重考次数 */}
          <Form.Item label="重考次数：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.exam?.retakeEnabled}
                onChange={(checked) => updateDraft('exam.retakeEnabled', checked)}
              />
              <span>所有学员都有</span>
              <InputNumber
                size="small"
                value={draft.exam?.retakeCount}
                min={0}
                max={10}
                onChange={(v) => updateDraft('exam.retakeCount', v)}
                style={{ width: 72 }}
              />
              <span>次重考机会</span>
            </div>
          </Form.Item>

          {/* 重考成绩策略 */}
          <Form.Item label="重考成绩：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <span>若学员参加了重考，则取</span>
              <Select
                size="small"
                value={draft.exam?.retakeScorePolicy || '最高分'}
                onChange={(v) => updateDraft('exam.retakeScorePolicy', v)}
                options={[{ value: '最高分', label: '最高分' }]}
                style={{ width: 100 }}
              />
              <span>为最终成绩</span>
            </div>
          </Form.Item>

          {/* 考后设置 */}
          <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d9d9d9' }}>●</span>
            <span>考后设置</span>
          </div>
          <Form.Item label="考后查看试卷：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.postExam?.allowReview}
                onChange={(checked) => updateDraft('postExam.allowReview', checked)}
              />
              <span style={{ color: '#666' }}>
                开启后，允许学员在考试成绩出来后查看试卷内容及答案解析
              </span>
            </div>
          </Form.Item>

          {/* 评分设置 */}
          <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d9d9d9' }}>●</span>
            <span>评分设置</span>
          </div>
          <Form.Item label="是否人工评阅：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.grading?.manual}
                onChange={(checked) => updateDraft('grading.manual', checked)}
              />
              <span style={{ color: '#666' }}>
                开启人工评阅后，试卷内所有主观题（填空/问答/作业上传等）将不会自动评阅
              </span>
            </div>
          </Form.Item>

          {/* 防作弊设置 */}
          <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d9d9d9' }}>●</span>
            <span>防作弊设置</span>
          </div>
          <Form.Item label="考试防切屏：" colon={false} style={{ marginBottom: 12 }}>
            <Switch
              checked={!!draft.antiCheat?.lockExam}
              onChange={(checked) => updateDraft('antiCheat.lockExam', checked)}
            />
          </Form.Item>
          <Form.Item label="考前人脸识别：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.antiCheat?.faceRecognition}
                onChange={(checked) => updateDraft('antiCheat.faceRecognition', checked)}
              />
              <span style={{ color: '#666' }}>
                开启后，考生需要先完成人脸识别，才能进入考试
              </span>
            </div>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default BasicConfigTab;