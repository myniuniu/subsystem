import React, { useMemo, useState } from 'react';
import { Form, Input, InputNumber, Switch, Select } from 'antd';
import notesService from '../../../services/notesService';
import { initialResources } from '../../../data/resourceLibraryData';

const BasicConfigTab = ({ draft, updateDraft, formatKey, configModal, formatConfigs, phaseMaterials, getDefaultConfig }) => {
  const inlineRow = { display: 'inline-flex', alignItems: 'center', gap: 8 };

  // 计算选定集合的总时长（分钟）
  const calculateSelectedDuration = useMemo(() => {
    if (formatKey !== 'videos' || !draft.selectedCollections) {
      return 0;
    }

    let totalMinutes = 0;
    
    // 遍历选定的集合ID
    draft.selectedCollections.forEach(collectionId => {
      // 根据集合ID找到对应的资源
      const categoryKey = collectionId.replace('rc-', '').replace(/-\d+$/, '');
      const resources = initialResources.filter(resource => 
        resource.category === categoryKey && (resource.type === 'video' || resource.type === 'audio')
      );
      
      // 为每个视频/音频资源分配默认时长
      resources.forEach(resource => {
        // 根据资源类型和标题估算时长
        let estimatedMinutes = 0;
        if (resource.type === 'video') {
          // 视频资源默认时长：根据标题关键词估算
          if (resource.title.includes('培训') || resource.title.includes('课程')) {
            estimatedMinutes = 45; // 培训课程默认45分钟
          } else if (resource.title.includes('微课') || resource.title.includes('演示')) {
            estimatedMinutes = 15; // 微课默认15分钟
          } else {
            estimatedMinutes = 30; // 其他视频默认30分钟
          }
        } else if (resource.type === 'audio') {
          // 音频资源默认时长
          estimatedMinutes = 20; // 音频默认20分钟
        }
        totalMinutes += estimatedMinutes;
      });
    });

    return totalMinutes;
  }, [formatKey, draft.selectedCollections]);

  return (
    <Form layout="vertical">
      {/* 已配时长显示 - 仅在视频格式时显示 */}
      {formatKey === 'videos' && (
        <Form.Item label="已配时长(分钟)" style={{ marginBottom: 8 }}>
          <div style={{ 
            padding: '4px 11px', 
            border: '1px solid #d9d9d9', 
            borderRadius: '6px', 
            backgroundColor: '#fafafa',
            fontSize: '14px',
            color: '#666'
          }}>
            {calculateSelectedDuration} 分钟
          </div>
        </Form.Item>
      )}

      {(formatKey === 'live' || formatKey === 'videos') && (
        <>
          {/* 点播课/直播课：按图示提供三组设置 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
            {/* 考试要求设置 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>考试要求设置</div>
              <div style={{ marginTop: 12 }}>
                <div style={inlineRow}>
                  <InputNumber
                    size="small"
                    value={draft.watch?.requiredMinutes}
                    min={0}
                    onChange={(v) => updateDraft('watch.requiredMinutes', v)}
                    style={{ width: 100 }}
                  />
                  <span>分钟</span>
                </div>
              </div>
            </div>

            {/* 成绩设置 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>成绩设置</div>
              <div style={{ marginTop: 12 }}>
                {(() => {
                  const method = draft.assessment?.method || '固定成绩';
                  return (
                    <div style={inlineRow}>
                      <Select
                        size="small"
                        value={method}
                        onChange={(v) => updateDraft('assessment.method', v)}
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

            {/* 学时设置 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>学时设置</div>
              <div style={{ marginTop: 12 }}>
                {(() => {
                  const policy = draft.watch?.creditPolicy || '累计学时';
                  return (
                    <div style={inlineRow}>
                      <Select
                        size="small"
                        value={policy}
                        onChange={(v) => updateDraft('watch.creditPolicy', v)}
                        options={[
                          { value: '累计学时', label: '累计学时' },
                          { value: '固定学时', label: '固定学时' },
                          { value: '不计学时', label: '不计学时' }
                        ]}
                        style={{ width: 120 }}
                      />
                      {policy === '累计学时' && (
                        <>
                          <InputNumber
                            size="small"
                            value={draft.watch?.minutePerCredit ?? 1}
                            min={1}
                            onChange={(v) => updateDraft('watch.minutePerCredit', v)}
                            style={{ width: 88 }}
                          />
                          <span>分钟=1学时</span>
                        </>
                      )}
                      {policy === '固定学时' && (
                        <>
                          <InputNumber
                            size="small"
                            value={draft.watch?.fixedCredits ?? 1}
                            min={1}
                            onChange={(v) => updateDraft('watch.fixedCredits', v)}
                            style={{ width: 88 }}
                          />
                          <span>学时</span>
                        </>
                      )}
                      {policy === '不计学时' && null}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
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
                min={0}
                max={300}
                onChange={(v) => updateDraft('exam.durationMinutes', v)}
                style={{ width: 88 }}
              />
              <span>分钟</span>
            </div>
          </Form.Item>

          {/* 重考设置 */}
          <Form.Item label="重考设置：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.exam?.allowRetake}
                onChange={(checked) => updateDraft('exam.allowRetake', checked)}
              />
              <span>允许重考</span>
            </div>
          </Form.Item>

          {/* 重考成绩策略 */}
          <Form.Item label="重考成绩策略：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <span>取</span>
              <Select
                size="small"
                value={draft.exam?.retakeScorePolicy}
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
            </div>
          </Form.Item>

          {/* 防舞弊设置 */}
          <div style={{ fontWeight: 600, margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#d9d9d9' }}>●</span>
            <span>防舞弊设置</span>
          </div>
          <Form.Item label="考试页面防切换：" colon={false} style={{ marginBottom: 12 }}>
            <div style={inlineRow}>
              <Switch
                checked={!!draft.antiCheat?.lockExam}
                onChange={(checked) => updateDraft('antiCheat.lockExam', checked)}
              />
            </div>
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