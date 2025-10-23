import React, { useMemo, useState } from 'react';
import { Typography, Button, Tag, Tooltip, Progress, Modal, Card, Form, Input, InputNumber, Switch, Select } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

// 右侧“实施方案”：为每个阶段模块展示按形式拆分的可配置卡片
const ImplementationPlan = ({ plan }) => {
  const schedule = Array.isArray(plan?.schedule) ? plan.schedule : [];

  // 训练阶段定义：基于传入的 schedule
  const trainingPhases = useMemo(() => (
    schedule.map((item, idx) => ({
      id: idx + 1,
      week: `第${idx + 1}阶段`,
      content: item.content,
      type: item.type,
      hours: item.hours
    }))
  ), [schedule]);

  // 日期格式化与阶段时间生成：每阶段默认1周，从今天开始
  const formatDateShort = (d) => {
    try {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch (e) {
      return '';
    }
  };

  const enrichedTrainingPhases = useMemo(() => {
    const base = new Date();
    return trainingPhases.map((p, idx) => {
      const start = new Date(base.getTime());
      start.setDate(start.getDate() + idx * 7);
      const end = new Date(start.getTime());
      end.setDate(end.getDate() + 6);
      return { ...p, startTime: formatDateShort(start), endTime: formatDateShort(end) };
    });
  }, [trainingPhases]);

  // 按模块标题在 plan.phases 中查找模块（用于判断含考试/作业）
  const findModuleByTitle = (title) => {
    try {
      const phases = Array.isArray(plan?.phases) ? plan.phases : [];
      for (const ph of phases) {
        const mods = Array.isArray(ph.modules) ? ph.modules : [];
        const match = mods.find(m => String(m.title || '') === String(title || ''));
        if (match) return match;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // 阶段素材分配（仅用于标签与简化统计展示）
  const phaseMaterials = useMemo(() => {
    return enrichedTrainingPhases.map(p => {
      const moduleInfo = findModuleByTitle(p.content);
      const hasExam = /考试|试卷|测试|考核|报告|作业/.test(String(moduleInfo?.assessment || ''));
      const isLive = /直播/.test(String(p.type || ''));
      const isVideo = /录播|视频|示范|观摩|点播/.test(String(p.type || ''));

      const startTime = p.startTime;
      const endTime = p.endTime;

      return {
        ...p,
        materials: {
          live: isLive ? [{ id: p.id, title: p.content, startTime, endTime }] : [],
          videos: isVideo ? [{ id: p.id, videoInfo: { duration: 0, progress: 0 } }] : [],
          exam: hasExam ? [{ id: p.id, name: `${p.content}-考试/试卷`, score: null }] : [],
          links: [],
          texts: [],
          trainingProjects: []
        }
      };
    });
  }, [enrichedTrainingPhases]);

  // 汇总：进度与分类学时（简化）
  const computePhaseCategorySummary = (phase) => {
    const m = phase?.materials || {};
    const lives = Array.isArray(m.live) ? m.live : [];
    const exams = Array.isArray(m.exam) ? m.exam : [];
    const videos = Array.isArray(m.videos) ? m.videos : [];

    const liveHours = (lives.length > 0) ? (Number(phase.hours || 0)) : 0;

    const categories = [];
    if (videos.length > 0) categories.push({ key: 'videos', label: '课程视频', hours: 0, score: null });
    if (lives.length > 0) categories.push({ key: 'live', label: '直播课程', hours: liveHours, score: null });
    if (exams.length > 0) categories.push({ key: 'exam', label: '考试/试卷', hours: 0, score: 0 });

    const totalHours = categories.reduce((sum, c) => sum + (Number(c.hours) || 0), 0);
    const totalScore = categories.reduce((sum, c) => {
      const s = (c.score == null ? 0 : Number(c.score));
      return isNaN(s) ? sum : sum + s;
    }, 0);

    return { categories, totalHours: Math.round(totalHours * 10) / 10, totalScore };
  };

  const assessPhasePass = (phase) => {
    const ps = computePhaseCategorySummary(phase);
    const examCat = ps?.categories?.find(c => c.key === 'exam');
    const examScore = examCat?.score;
    const totalHours = ps?.totalHours ?? (phase?.hours ?? 0);

    const progress = 0;
    const PASS_PROGRESS = 60;
    const PASS_SCORE = 60;
    const passProgress = progress >= PASS_PROGRESS;
    const passScore = (examScore == null) ? true : Number(examScore) >= PASS_SCORE;
    const pass = passProgress && passScore;

    const completedMinutes = 0;
    const tooltip = `考试：${totalHours * 60}分钟；已完成：${completedMinutes}分钟；进度：${progress}%；学时：${totalHours}；成绩：${examScore == null ? '未评分' : examScore + '分'}`;
    return { pass, tooltip, progress, examScore, totalHours, completedMinutes };
  };

  // 折叠控制
  const [collapsedPhases, setCollapsedPhases] = useState(new Set(enrichedTrainingPhases.map(p => p.id)));
  const [phaseViewCompactMode, setPhaseViewCompactMode] = useState(true);
  const expandAllPhases = () => setCollapsedPhases(new Set());
  const collapseAllPhases = () => setCollapsedPhases(new Set(enrichedTrainingPhases.map(p => p.id)));
  const togglePhase = (phaseId) => {
    const wasCompact = phaseViewCompactMode;
    setPhaseViewCompactMode(false);
    setCollapsedPhases(prev => {
      if (wasCompact) {
        const allIds = enrichedTrainingPhases.map(p => p.id);
        return new Set(allIds.filter(id => id !== phaseId));
      }
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId); else next.add(phaseId);
      return next;
    });
  };

  const overallProgress = (Array.isArray(phaseMaterials) && phaseMaterials.length > 0)
    ? Math.round(phaseMaterials.reduce((sum, p) => sum + (assessPhasePass(p)?.progress ?? 0), 0) / phaseMaterials.length)
    : 0;

  const formatLabelByKey = (k) => ({
    live: '直播课',
    videos: '点播课',
    exam: '考试'
  }[k] || '培训形式');

  // 配置状态：按阶段 + 形式存储
  const [formatConfigs, setFormatConfigs] = useState({}); // { [phaseId]: { live: {...}, videos: {...}, exam: {...} } }
  const [configModal, setConfigModal] = useState({ visible: false, phaseId: null, formatKey: null, draft: null });

  const getDefaultConfig = (phase, formatKey) => {
    if (formatKey === 'live' || formatKey === 'videos') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: true,
        assessment: { method: '观看时长', weight: 30 },
        watch: { requiredPercent: 80 }
      };
    }
    if (formatKey === 'exam') {
      return {
        name: formatLabelByKey(formatKey),
        details: '',
        enabled: true,
        assessment: { method: '考试', weight: 30, passScore: 60, fullScore: 100 }
      };
    }
    return { name: formatLabelByKey(formatKey), details: '', enabled: false, assessment: { method: '未设置', weight: 0 } };
  };

  const openConfigModal = (phaseId, formatKey) => {
    const phase = phaseMaterials.find(p => p.id === phaseId);
    const baseAll = formatConfigs[phaseId] || {};
    const base = baseAll[formatKey] || getDefaultConfig(phase, formatKey);
    setConfigModal({ visible: true, phaseId, formatKey, draft: { ...base } });
  };

  const updateDraft = (path, value) => {
    setConfigModal(prev => {
      if (!prev.draft) return prev;
      const nextDraft = { ...prev.draft };
      if (path.includes('.')) {
        const [k1, k2] = path.split('.');
        nextDraft[k1] = { ...(nextDraft[k1] || {}), [k2]: value };
      } else {
        nextDraft[path] = value;
      }
      return { ...prev, draft: nextDraft };
    });
  };

  const saveConfig = () => {
    setFormatConfigs(prev => ({
      ...prev,
      [configModal.phaseId]: {
        ...(prev[configModal.phaseId] || {}),
        [configModal.formatKey]: configModal.draft
      }
    }));
    setConfigModal({ visible: false, phaseId: null, formatKey: null, draft: null });
  };

  return (
    <div style={{ minHeight: '100%' }}>
      {/* 顶部模块总览与控制 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text strong style={{ fontSize: '12px', color: '#666' }}>📦 模块</Text>
          <div style={{ width: 160, height: 6, background: '#edf2f7', borderRadius: 999, overflow: 'hidden', marginLeft: 10 }}>
            <div style={{ width: `${overallProgress}%`, height: '100%', background: 'var(--theme-primary, #1890ff)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            size="small"
            type="default"
            icon={(phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length) ? <RightOutlined /> : <DownOutlined />}
            style={{ fontSize: '12px', height: 'auto', padding: '2px 10px', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            onClick={() => {
              const allCollapsed = phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length;
              if (allCollapsed) {
                setPhaseViewCompactMode(false);
                expandAllPhases();
              } else {
                setPhaseViewCompactMode(true);
                collapseAllPhases();
              }
            }}
          >
            {(phaseViewCompactMode || collapsedPhases.size === enrichedTrainingPhases.length) ? '全部展开' : '全部折叠'}
          </Button>
        </div>
      </div>

      {/* 阶段列表 */}
      {phaseMaterials.map(phase => {
        const m = phase.materials || {};
        const presentFormats = [];
        if (Array.isArray(m.live) && m.live.length > 0) presentFormats.push('live');
        if (Array.isArray(m.videos) && m.videos.length > 0) presentFormats.push('videos');
        if (Array.isArray(m.exam) && m.exam.length > 0) presentFormats.push('exam');

        return (
          <div key={`phase-${phase.id}`} style={{ marginBottom: 14, border: '1px solid #e8e8e8', borderLeft: '2px solid #91d5ff', borderRadius: 8, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px 8px 6px 8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {(phaseViewCompactMode || collapsedPhases.has(phase.id)) ? (
                    <RightOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                  ) : (
                    <DownOutlined style={{ fontSize: 12, color: '#999' }} onClick={() => togglePhase(phase.id)} />
                  )}
                  <Text strong style={{ fontSize: 13 }}>
                    {phase.id}｜{phase.content}
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {(() => {
                    const tagSpecs = [
                      { key: 'live', present: Array.isArray(m.live) && m.live.length > 0, label: '直播课程', color: 'cyan' },
                      { key: 'videos', present: Array.isArray(m.videos) && m.videos.length > 0, label: '课程视频', color: 'geekblue' },
                      { key: 'exam', present: Array.isArray(m.exam) && m.exam.length > 0, label: '考试/试卷', color: 'purple' }
                    ];
                    return tagSpecs
                      .filter(t => t.present)
                      .map(t => (<Tag color={t.color} key={`phase-${phase.id}-tag-${t.key}`}>{t.label}</Tag>))
                      .concat([<Tag color="geekblue" key={`phase-${phase.id}-hours`}>{phase.hours}学时</Tag>]);
                  })()}
                </div>

                {/* 按形式渲染独立卡片 */}
                <div style={{ width: '100%', marginTop: 6, display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                  {presentFormats.map((fmtKey) => {
                    const cfg = (formatConfigs[phase.id] && formatConfigs[phase.id][fmtKey]) || getDefaultConfig(phase, fmtKey);
                    return (
                      <Card key={`phase-${phase.id}-fmt-${fmtKey}`} size="small" bodyStyle={{ padding: '6px 8px' }} style={{ border: '1px solid #e8e8e8', borderRadius: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div>
                              <Text strong style={{ marginRight: 8 }}>{cfg.name}</Text>
                              <Text type="secondary">{cfg.details || '未配置具体内容'}</Text>
                            </div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <Tag color={cfg.enabled ? 'blue' : 'default'}>{cfg.enabled ? '需要考核' : '不考核'}</Tag>
                              <Tag color="purple">方式：{cfg.assessment?.method || '未设置'}</Tag>
                              <Tag color="gold">权重：{cfg.assessment?.weight ?? 0}%</Tag>
                              {fmtKey !== 'exam' && (
                                <Tag color="gold">达标观看：{cfg.watch?.requiredPercent ?? 0}%</Tag>
                              )}
                              {fmtKey === 'exam' && (
                                <>
                                  <Tag color="green">及格：{cfg.assessment?.passScore ?? 60}分</Tag>
                                  <Tag color="geekblue">满分：{cfg.assessment?.fullScore ?? 100}分</Tag>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <Button size="small" type="primary" onClick={() => openConfigModal(phase.id, fmtKey)}>配置</Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

            </div>

            {!(phaseViewCompactMode || collapsedPhases.has(phase.id)) && (() => {
              const ps = computePhaseCategorySummary(phase);
              if (!ps || !Array.isArray(ps.categories) || ps.categories.length === 0) return null;
              const categories = ps.categories;
              return (
                <div style={{ padding: '8px 10px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, margin: '6px 0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {categories.map((c) => (
                      <div key={`phase-${phase.id}-cat-${c.key}`} style={{ background: '#ffffff', border: '1px solid #f0e1a0', borderRadius: 6, padding: '6px 8px' }}>
                        <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>{c.label}</Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ fontSize: 12, color: '#333' }}>学时：{(c.hours ?? 0)}</Text>
                          <Text style={{ fontSize: 12, color: '#333' }}>成绩：{(c.score == null ? '未评分' : `${c.score}分`)}</Text>
                        </div>
                      </div>
                    ))}
                    <div style={{ background: '#ffffff', border: '1px dashed #ffe58f', borderRadius: 6, padding: '6px 8px' }}>
                      <Text style={{ fontSize: 12, color: '#614700', fontWeight: 600 }}>总计</Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text style={{ fontSize: 12, color: '#333' }}>总学时：{ps.totalHours}</Text>
                        <Text style={{ fontSize: 12, color: '#333' }}>总成绩：{ps.totalScore}分</Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })}

      {/* 配置弹窗 */}
      <Modal
        open={configModal.visible}
        title={`配置培训形式 - ${formatLabelByKey(configModal.formatKey)}`}
        onCancel={() => setConfigModal({ visible: false, phaseId: null, formatKey: null, draft: null })}
        onOk={saveConfig}
        okText="保存"
        cancelText="取消"
      >
        {configModal.draft && (
          <Form layout="vertical">
            <Form.Item label="培训形式名称">
              <Input
                value={configModal.draft.name}
                onChange={(e) => updateDraft('name', e.target.value)}
                placeholder="例如：直播课、点播课、考试"
              />
            </Form.Item>
            <Form.Item label="培训形式具体内容">
              <Input.TextArea
                value={configModal.draft.details}
                onChange={(e) => updateDraft('details', e.target.value)}
                placeholder="补充该形式的实施说明、要点等"
                rows={3}
              />
            </Form.Item>
            <Form.Item label="是否需要考核">
              <Switch
                checked={configModal.draft.enabled}
                onChange={(checked) => updateDraft('enabled', checked)}
              />
            </Form.Item>
            <Form.Item label="考核权重(%)">
              <InputNumber
                value={configModal.draft.assessment?.weight}
                min={0}
                max={100}
                onChange={(v) => updateDraft('assessment.weight', v)}
                style={{ width: '100%' }}
              />
            </Form.Item>

            {/* 按形式显示定制字段 */}
            {(configModal.formatKey === 'live' || configModal.formatKey === 'videos') && (
              <>
                <Form.Item label="考核方式">
                  <Select
                    value={configModal.draft.assessment?.method}
                    onChange={(v) => updateDraft('assessment.method', v)}
                    options={[{ value: '观看时长', label: '观看时长' }]}
                  />
                </Form.Item>
                <Form.Item label="达标观看占比(%)">
                  <InputNumber
                    value={configModal.draft.watch?.requiredPercent}
                    min={0}
                    max={100}
                    onChange={(v) => updateDraft('watch.requiredPercent', v)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            )}

            {configModal.formatKey === 'exam' && (
              <>
                <Form.Item label="考核方式">
                  <Select
                    value={configModal.draft.assessment?.method}
                    onChange={(v) => updateDraft('assessment.method', v)}
                    options={[
                      { value: '考试', label: '考试' },
                      { value: '测验', label: '测验' },
                      { value: '考试+作业', label: '考试+作业' },
                      { value: '报告', label: '报告' }
                    ]}
                  />
                </Form.Item>
                <Form.Item label="及格分数">
                  <InputNumber
                    value={configModal.draft.assessment?.passScore}
                    min={0}
                    max={100}
                    onChange={(v) => updateDraft('assessment.passScore', v)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item label="满分">
                  <InputNumber
                    value={configModal.draft.assessment?.fullScore}
                    min={0}
                    max={100}
                    onChange={(v) => updateDraft('assessment.fullScore', v)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ImplementationPlan;