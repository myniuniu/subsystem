import React, { useMemo, useState } from 'react';
import { Form, Input, InputNumber, Switch, Select, DatePicker, Radio } from 'antd';
import dayjs from 'dayjs';
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

      {formatKey === 'document' && (
        <>
          {/* 文档：提供通用的成绩设置 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
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
          </div>
        </>
      )}

      {(formatKey === 'live' || formatKey === 'videos') && (
        <>
          {/* 考核时间（到天即可，仅点播课显示） */}
          {formatKey === 'videos' && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>考核时间</div>
              <Form.Item required label="考核时间：" colon={false} style={{ marginTop: 8, marginBottom: 12 }}>
                <DatePicker.RangePicker
                  format="YYYY-MM-DD"
                  placeholder={["开始时间", "结束时间"]}
                  value={(
                    draft?.assessment?.startDate && draft?.assessment?.endDate
                      ? [dayjs(draft.assessment.startDate), dayjs(draft.assessment.endDate)]
                      : null
                  )}
                  onChange={(vals) => {
                    const [start, end] = vals || [];
                    updateDraft('assessment.startDate', start ? start.format('YYYY-MM-DD') : null);
                    updateDraft('assessment.endDate', end ? end.format('YYYY-MM-DD') : null);
                  }}
                  style={{ width: 380 }}
                />
              </Form.Item>
            </div>
          )}

          {/* 选课设置（点播课） */}
          {formatKey === 'videos' && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>选课设置</div>
              <div style={{ marginTop: 12 }}>
                {/* 是否必修 */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ marginRight: 8 }}>是否必修：</span>
                  <Radio.Group
                    value={draft.enrollment?.mandatory ?? false}
                    onChange={(e) => updateDraft('enrollment.mandatory', e.target.value)}
                  >
                    <Radio value={true}>必修</Radio>
                    <Radio value={false}>选修</Radio>
                  </Radio.Group>
                </div>
                {/* 学员选课方式：仅当选修显示 */}
                {!(draft.enrollment?.mandatory ?? false) && (
                  <div>
                    <span style={{ marginRight: 8 }}>学员选课方式：</span>
                    <Radio.Group
                      value={draft.enrollment?.selectionMethod || 'student_choice'}
                      onChange={(e) => updateDraft('enrollment.selectionMethod', e.target.value)}
                    >
                      <Radio value={'student_choice'}>学员自选</Radio>
                      <Radio value={'admin_assigned'}>管理员指定</Radio>
                    </Radio.Group>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 成绩设置 */}
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
          <div style={{ marginBottom: 12 }}>
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
                          value={draft.watch?.minutePerCredit ?? 60}
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
        </>
      )}

      {formatKey === 'exam' && (
        <>
          {/* 考试时间段（秒级） */}
          <Form.Item required label="考试时间：" colon={false} style={{ marginBottom: 12 }}>
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