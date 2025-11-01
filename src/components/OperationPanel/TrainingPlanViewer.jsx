import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Timeline, 
  List, 
  Tag, 
  message,
  Tabs,
  Space,
  Table,
  Modal,
  Input,
  InputNumber,
  Popover,
  Select,
  Divider,
  Tooltip,
  Anchor,
  Affix
} from 'antd';
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  BookOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PaperClipOutlined,
  FileExcelOutlined,
  PlusOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  AppstoreOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS, VIEW_MODES } from '../../constants/noteEditConstants';
import { generateComprehensiveTrainingPlan, generateTrainingPlanMarkdown } from '../../utils/trainingPlanGenerator';
import SimpleTrainingPlanDetailView from '../SimpleTrainingPlanDetailView';
import TrainingOverview from './TrainingOverview';
import TrainingPhases from './TrainingPhases';
import TrainingSchedule from './TrainingSchedule';
import ImplementationSection from './ImplementationSection';
import AssessmentSection from './AssessmentSection';
import GuaranteeSection from './GuaranteeSection';
import TagsSection from './TagsSection';
import ImplementationPlan from './ImplementationPlan';
import { generateKnowledgeNodes } from '../../data/knowledgeGraphData';
import { generateCapabilityNodes } from '../../data/capabilityMapData';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 培训形式：选项与字符串<->数组转换工具
const DEFAULT_FORMAT_OPTIONS = [
  '线上直播课程', '录播视频', '线上研讨会', '在线研讨', '实践作业', '考试测评',
  '工作坊', '专题讲座', '案例研讨', '小组讨论', '实地调研'
];
const parseFormats = (val) => Array.isArray(val)
  ? val
  : (typeof val === 'string'
    ? val.split(/[+，,、]/).map(s => s.trim()).filter(Boolean)
    : []);
const joinFormats = (arr) => (arr || []).join(' + ');

// 体系化培训类型
const SYSTEM_TRAINING_TYPES = [
  { value: 'knowledge_graph', label: '知识图谱' },
  { value: 'capability_model', label: '能力模型' },
  { value: 'micro_major', label: '微专业' }
];

// 根据中文关键词推断类型键，用于默认初始化绑定
const inferTypeKeyFromText = (text) => {
  const s = String(text || '').toLowerCase();
  // 线上研讨会优先识别（线上研讨会/线上会议/视频会议/网络研讨会）
  if (/线上研讨会|线上会议|视频会议|网络研讨会|webinar/i.test(text || '')) return 'webinar';
  // 优先识别考试相关（包含“测试/在线测试/线上测试/测评/考试/测验”）
  if (/考试|测评|测试|测验|在线测试|线上测试/.test(text || '')) return 'exam';
  if (/录播|视频/.test(text || '')) return 'videos';
  // 将“经验交流/经验分享/交流会”等默认绑定为线上交流研讨
  if (/(经验交流|经验分享|交流会)/.test(text || '')) return 'seminar';
  // 线上交流研讨：同时包含“线上/在线”与“交流/研讨/讨论”
  if (/线上|在线/.test(text || '') && /(交流|研讨|讨论)/.test(text || '')) return 'seminar';
  // 线下活动识别（线下/线下活动/实地/参观/走访/调研/观摩）
  if (/线下活动|线下|实地|参观|走访|调研|观摩/.test(text || '')) return 'offline';
  // 作业类识别
  if (/试卷作业|作业|论文|报告|方案|反思/.test(text || '')) return 'assignment';
  if (/文档|资料/.test(text || '')) return 'document';
  // 直播相关（不含“线上交流研讨”已单独识别）
  if (/直播|讲座|工作坊|案例/.test(text || '')) return 'live';
  // 无法判断时，默认按“文档”类型处理
  return 'document';
};

const initModuleBindings = (mod) => {
  const next = { ...mod };
  const fmts = parseFormats(next.format) || [];
  const baseMap = next.formatTypeMap || {};
  const mapWithDefaults = { ...baseMap };
  fmts.forEach((f) => {
    if (!mapWithDefaults[f]) {
      const guess = inferTypeKeyFromText(f);
      if (guess) mapWithDefaults[f] = guess;
    }
  });
  // 迁移：将旧数据中把“经验交流/经验分享/交流会”误绑定为文档的情况统一迁移为“线上交流研讨”
  ['经验交流', '经验分享', '交流会'].forEach(k => {
    if (mapWithDefaults[k] === 'document') mapWithDefaults[k] = 'seminar';
  });
  next.formatTypeMap = mapWithDefaults;
  // 评估方式默认
  if (!next.assessmentTypeKey && (next.assessment || '').trim()) {
    const g = inferTypeKeyFromText(next.assessment);
    if (g) next.assessmentTypeKey = g;
  }
  return next;
};

// 可拖拽的模块卡片（用于阶段内模块排序）
const SortableModuleCard = ({ id, mod, pIdx, mIdx, globalIndex, setVisualDraft }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginBottom: 12, padding: 10, border: '1px dashed #e8e8e8', borderLeft: '2px solid #b7eb8f', borderRadius: 6, background: '#fafafa' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            {...attributes}
            {...listeners}
            style={{ cursor: isDragging ? 'grabbing' : 'grab', width: 16, height: 16, borderRadius: 2, background: '#d9d9d9' }}
            title="拖拽排序"
          />
          <span style={{ color: '#595959' }}>{`模块 ${globalIndex}`}</span>
        </div>
        <Space size="small">
          <Button size="small" onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: [...ph.modules.slice(0, mIdx), { title: '', duration: '', content: [], format: '', assessment: '' }, ...ph.modules.slice(mIdx)] } : ph))}>在上方插入</Button>
          <Button size="small" onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: [...ph.modules.slice(0, mIdx + 1), { title: '', duration: '', content: [], format: '', assessment: '' }, ...ph.modules.slice(mIdx + 1)] } : ph))}>在下方插入</Button>
          <Button danger size="small" onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.filter((_, j) => j !== mIdx) } : ph))}>删除模块</Button>
        </Space>
      </div>

      <Space style={{ width: '100%', marginBottom: 8 }}>
        <Input style={{ flex: 1 }} value={mod.title} placeholder="模块标题"
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, title: e.target.value } : mo) } : ph))} />
        <Input style={{ width: 160 }} value={mod.duration} placeholder="时长"
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, duration: e.target.value } : mo) } : ph))} />
        <Input style={{ width: 160 }} value={(mod.weight ?? '')} placeholder="模块权重(%)"
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, weight: e.target.value } : mo) } : ph))} />
      </Space>
      <Space style={{ width: '100%', marginBottom: 8 }}>
        <InputNumber
          style={{ width: 180 }}
          min={0}
          value={mod.hoursTarget}
          placeholder="考核学时(学时)"
          disabled
          readOnly
        />
      </Space>
      {/* 删除旧的“形式学时与成绩”卡片区块，改为下方每个形式内联输入 */}
      <Typography.Title level={5} style={{ marginTop: 8 }}>培训形式</Typography.Title>
      <Space style={{ width: '100%', marginBottom: 8 }}>
        <Select
          mode="tags"
          style={{ flex: 1 }}
          placeholder="培训形式（可多选，可自定义）"
          value={parseFormats(mod.format)}
          onChange={(vals) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
            ? { ...ph, modules: ph.modules.map((mo, j) => {
                if (j !== mIdx) return mo;
                const nextFormat = joinFormats(vals);
                const existingMap = mo.formatTypeMap || {};
                const allowed = new Set(vals);
                const prunedMap = Object.fromEntries(Object.entries(existingMap).filter(([k]) => allowed.has(k)));
                const defaults = {};
                vals.forEach(f => {
                  if (!prunedMap[f]) {
                    const guess = inferTypeKeyFromText(f);
                    if (guess) defaults[f] = guess;
                  }
                });
                return { ...mo, format: nextFormat, formatTypeMap: { ...prunedMap, ...defaults } };
              }) }
            : ph))}
          options={DEFAULT_FORMAT_OPTIONS.map(v => ({ value: v, label: v }))}
        />
        <div style={{ display: 'grid', gridAutoFlow: 'row', rowGap: 6 }}>
          {(parseFormats(mod.format) || []).map((fmt) => (
            <div
              key={`fmt-bind-${fmt}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 160px 120px 120px',
                alignItems: 'center',
                gap: 8,
                borderTop: (!(mod.formatTypeMap || {})[fmt]) ? '1px solid #ff4d4f' : undefined,
                paddingTop: (!(mod.formatTypeMap || {})[fmt]) ? 2 : 0,
              }}
            >
              {(!(mod.formatTypeMap || {})[fmt]) ? (
                <Tooltip title="未绑定类型（将按关键词识别）">
                  <Tag color="blue">{fmt}</Tag>
                </Tooltip>
              ) : (
                <Tag color="blue">{fmt}</Tag>
              )}
              <Select
                style={{ width: 160 }}
                placeholder="绑定培训类型"
                value={(mod.formatTypeMap || {})[fmt]}
                onChange={(v) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
                  ? { ...ph, modules: ph.modules.map((mo, j) => {
                      if (j !== mIdx) return mo;
                      const base = mo.formatTypeMap || {};
                      const nextMap = { ...base, [fmt]: v };
                      ['经验交流', '经验分享', '交流会'].forEach(k => {
                        if (nextMap[k] === 'document') nextMap[k] = 'seminar';
                      });
                      return { ...mo, formatTypeMap: nextMap };
                    }) }
                  : ph))}
                options={[
                  { value: 'live', label: '直播课' },
                  { value: 'videos', label: '点播课' },
                  { value: 'webinar', label: '线上研讨会' },
                  { value: 'seminar', label: '线上交流研讨' },
                  { value: 'offline', label: '线下活动' },
                  { value: 'exam', label: '考试' },
                  { value: 'assignment', label: '试卷作业' },
                  { value: 'document', label: '研修成果' }
                ]}
              />
              {(() => {
                const typeKey = ((mod.formatTypeMap || {})[fmt]) || inferTypeKeyFromText(fmt);
                const fc = ((mod.formatConfigs || {})[typeKey]) || {};
                return (
                  <>
                    <InputNumber
                      style={{ width: 110 }}
                      min={0}
                      placeholder="学时"
                      value={fc.hours}
                      onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                      onChange={(val) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
                        ? { ...ph, modules: ph.modules.map((mo, j) => {
                            if (j !== mIdx) return mo;
                            const current = mo.formatConfigs || {};
                            const prevCfg = current[typeKey] || {};
                            const nextCfg = { ...current, [typeKey]: { ...prevCfg, hours: val } };
                            return { ...mo, formatConfigs: nextCfg };
                          }) }
                        : ph))}
                    />
                    <InputNumber
                      style={{ width: 110 }}
                      min={0}
                      placeholder="成绩"
                      value={fc.score}
                      onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                      onChange={(val) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
                        ? { ...ph, modules: ph.modules.map((mo, j) => {
                            if (j !== mIdx) return mo;
                            const current = mo.formatConfigs || {};
                            const prevCfg = current[typeKey] || {};
                            const nextCfg = { ...current, [typeKey]: { ...prevCfg, score: val } };
                            return { ...mo, formatConfigs: nextCfg };
                          }) }
                        : ph))}
                    />
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </Space>
      <Typography.Title level={5} style={{ marginTop: 8 }}>考核方式</Typography.Title>
      <Space style={{ width: '100%', marginBottom: 8, borderTop: ((!mod.assessmentTypeKey && (mod.assessment || '').trim().length > 0) ? '1px solid #ff4d4f' : undefined), paddingTop: ((!mod.assessmentTypeKey && (mod.assessment || '').trim().length > 0) ? 2 : 0) }}>
        <Input style={{ flex: 1 }} value={mod.assessment} placeholder="考核方式"
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => {
            if (j !== mIdx) return mo;
            const nextAssess = e.target.value;
            let nextType = mo.assessmentTypeKey;
            if (!nextType && nextAssess.trim()) {
              const g = inferTypeKeyFromText(nextAssess);
              if (g) nextType = g;
            }
            if (!nextAssess.trim()) {
              nextType = undefined;
            }
            return { ...mo, assessment: nextAssess, assessmentTypeKey: nextType };
          }) } : ph))} />
        <Select
          style={{ width: 180 }}
          placeholder="绑定考核类型"
          value={mod.assessmentTypeKey}
          onChange={(v) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
            ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, assessmentTypeKey: v } : mo) }
            : ph))}
          options={[
            { value: 'live', label: '直播课' },
            { value: 'videos', label: '点播课' },
            { value: 'seminar', label: '线上交流研讨' },
            { value: 'offline', label: '线下活动' },
            { value: 'exam', label: '考试' },
            { value: 'assignment', label: '试卷作业' },
            { value: 'document', label: '研修成果' }
          ]}
        />
        <InputNumber
          style={{ width: 140 }}
          min={0}
          placeholder="满分"
          value={mod.assessmentFullScore}
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(val) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
            ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, assessmentFullScore: val } : mo) }
            : ph))}
        />
        <InputNumber
          style={{ width: 140 }}
          min={0}
          placeholder="及格分"
          value={mod.assessmentPassScore}
          onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
          onChange={(val) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
            ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, assessmentPassScore: val } : mo) }
            : ph))}
        />
      </Space>

      <Typography.Title level={5} style={{ marginTop: 8 }}>内容条目</Typography.Title>
      {(mod.content || []).map((cItem, cIdx) => (
        <Space key={cIdx} style={{ width: '100%', marginBottom: 8 }}>
          <Input style={{ flex: 1 }} value={cItem} placeholder="内容"
            onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: mo.content.map((ci, k) => k === cIdx ? e.target.value : ci) } : mo) } : ph))} />
          <Button danger onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: mo.content.filter((_, k) => k !== cIdx) } : mo) } : ph))}>删除</Button>
        </Space>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: [...(mo.content || []), ''] } : mo) } : ph))}>添加内容</Button>
    </div>
  );
};

// 单模块编辑器（仅编辑一个模块，不展示阶段列表）
const SingleModuleEditor = ({ mod, onChange, moduleIndex }) => {
  // 按培训形式派生模块学时（学时目标=Σ考核学时；安排学时=Σ安排学时）
  useEffect(() => {
    const formats = parseFormats(mod?.format) || [];
    const typeMap = mod?.formatTypeMap || {};
    const cfgs = mod?.formatConfigs || {};
    let sumAssess = 0;
    let sumArranged = 0;
    formats.forEach((fmt) => {
      const typeKey = typeMap[fmt] || inferTypeKeyFromText(fmt);
      const fc = cfgs[typeKey] || {};
      const assess = Number(fc.assessmentHours ?? fc.hours ?? 0);
      const arranged = Number(fc.arrangedHours ?? fc.hours ?? 0);
      if (Number.isFinite(assess)) sumAssess += assess;
      if (Number.isFinite(arranged)) sumArranged += arranged;
    });
    const prevAssess = Number(mod?.hoursTarget || 0);
    const prevArranged = Number(mod?.arrangedHours || 0);
    if (sumAssess !== prevAssess || sumArranged !== prevArranged) {
      onChange({ ...mod, hoursTarget: sumAssess, arrangedHours: sumArranged });
    }
  }, [mod?.format, mod?.formatTypeMap, mod?.formatConfigs]);
  return (
    <div style={{ marginBottom: 12, padding: 10, border: '1px dashed #e8e8e8', borderLeft: '2px solid #b7eb8f', borderRadius: 6, background: '#fafafa' }}>
      {typeof moduleIndex === 'number' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#595959' }}>{`模块 ${moduleIndex}`}</span>
        </div>
      )}
      <div style={{ width: '100%', marginBottom: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, gridColumn: '1 / span 2' }}>
          <Text type="secondary">模块标题</Text>
          <Input style={{ flex: 1 }} value={mod.title} placeholder="模块标题"
            onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            onChange={(e) => onChange({ ...mod, title: e.target.value })} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text type="secondary">时长</Text>
          <Input style={{ width: 160 }} value={mod.duration} placeholder="时长"
            onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            onChange={(e) => onChange({ ...mod, duration: e.target.value })} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text type="secondary">模块权重(%)</Text>
          <Input style={{ width: 120 }} value={(mod.weight ?? '')} placeholder="模块权重(%)"
            onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
            onChange={(e) => onChange({ ...mod, weight: e.target.value })} />
        </div>
      </div>
      <div style={{ width: '100%', marginBottom: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text type="secondary">考核学时</Text>
          <InputNumber
            style={{ width: 160 }}
            min={0}
            value={mod.hoursTarget}
            placeholder="考核学时(学时)"
            disabled
            readOnly
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text type="secondary">安排学时</Text>
          <InputNumber
            style={{ width: 160 }}
            min={0}
            value={mod.arrangedHours}
            placeholder="时间安排(学时)"
            disabled
            readOnly
          />
        </div>
      </div>
      <Typography.Title level={5} style={{ marginTop: 8 }}>培训形式</Typography.Title>
      <Space style={{ width: '100%', marginBottom: 8 }}>
        <Select
          mode="tags"
          style={{ flex: 1 }}
          placeholder="培训形式（可多选，可自定义）"
          value={parseFormats(mod.format)}
          onChange={(vals) => {
            const nextFormat = joinFormats(vals);
            const existingMap = mod.formatTypeMap || {};
            const allowed = new Set(vals);
            const prunedMap = Object.fromEntries(Object.entries(existingMap).filter(([k]) => allowed.has(k)));
            const defaults = {};
            vals.forEach(f => {
              if (!prunedMap[f]) {
                const guess = inferTypeKeyFromText(f);
                if (guess) defaults[f] = guess;
              }
            });
            // 初始化每个培训形式的默认“考核学时/安排学时”（均分模块的总安排学时或目标学时）
            const currentConfigs = mod.formatConfigs || {};
            const totalArranged = Number(mod.arrangedHours ?? mod.hoursTarget ?? 0) || 0;
            const total = Math.max((vals || []).length, 1);
            const evenShare = totalArranged > 0 ? (totalArranged / total) : 0;
            // 仅保留当前选择中仍被使用的类型配置
            const nextConfigsPruned = Object.fromEntries(
              Object.entries(currentConfigs).filter(([typeKey]) => {
                const used = (vals || []).some(f => (prunedMap[f] || defaults[f] || inferTypeKeyFromText(f)) === typeKey);
                return used;
              })
            );
            const nextConfigs = { ...nextConfigsPruned };
            (vals || []).forEach((f) => {
              const typeKey = (prunedMap[f] || defaults[f] || inferTypeKeyFromText(f));
              if (!typeKey) return;
              const prevCfg = nextConfigs[typeKey] || {};
              const needInitAssess = typeof prevCfg.assessmentHours !== 'number';
              const needInitArranged = typeof prevCfg.arrangedHours !== 'number';
              if (needInitAssess || needInitArranged) {
                const initVal = Number.isFinite(evenShare) ? evenShare : 0;
                nextConfigs[typeKey] = {
                  ...prevCfg,
                  assessmentHours: needInitAssess ? initVal : prevCfg.assessmentHours,
                  arrangedHours: needInitArranged ? initVal : prevCfg.arrangedHours
                };
              }
            });
            onChange({ ...mod, format: nextFormat, formatTypeMap: { ...prunedMap, ...defaults }, formatConfigs: nextConfigs });
          }}
          options={DEFAULT_FORMAT_OPTIONS.map(v => ({ value: v, label: v }))}
        />
        <div style={{ display: 'grid', gridAutoFlow: 'row', rowGap: 6 }}>
          {(parseFormats(mod.format) || []).map((fmt) => (
            <div
              key={`fmt-bind-${fmt}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderTop: (!(mod.formatTypeMap || {})[fmt]) ? '1px solid #ff4d4f' : undefined,
                paddingTop: (!(mod.formatTypeMap || {})[fmt]) ? 2 : 0,
              }}
            >
              {(!(mod.formatTypeMap || {})[fmt]) ? (
                <Tooltip title="未绑定类型（将按关键词识别）">
                  <Tag color="blue">{fmt}</Tag>
                </Tooltip>
              ) : (
                <Tag color="blue">{fmt}</Tag>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Text type="secondary">类型</Text>
                <Select
                  style={{ width: 160 }}
                  placeholder="绑定培训类型"
                  value={(mod.formatTypeMap || {})[fmt]}
                  onChange={(v) => {
                    const base = mod.formatTypeMap || {};
                    onChange({ ...mod, formatTypeMap: { ...base, [fmt]: v } });
                  }}
                  options={[
                    { value: 'live', label: '直播课' },
                    { value: 'videos', label: '点播课' },
                    { value: 'webinar', label: '线上研讨会' },
                    { value: 'exam', label: '考试' },
                    { value: 'assignment', label: '试卷作业' },
                    { value: 'document', label: '研修成果' }
                  ]}
                />
              </div>
              {(() => {
                const typeKey = ((mod.formatTypeMap || {})[fmt]) || inferTypeKeyFromText(fmt);
                const fc = ((mod.formatConfigs || {})[typeKey]) || {};
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Text type="secondary">考核学时</Text>
                      <InputNumber
                        style={{ width: 120 }}
                        min={0}
                        placeholder="考核学时"
                        value={(fc.assessmentHours ?? fc.hours)}
                        onChange={(val) => {
                          const current = mod.formatConfigs || {};
                          const prevCfg = current[typeKey] || {};
                          const nextCfg = { ...current, [typeKey]: { ...prevCfg, assessmentHours: val } };
                          onChange({ ...mod, formatConfigs: nextCfg });
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Text type="secondary">安排学时</Text>
                      <InputNumber
                        style={{ width: 120 }}
                        min={0}
                        placeholder="学习安排学时"
                        value={(fc.arrangedHours ?? fc.hours)}
                        onChange={(val) => {
                          const current = mod.formatConfigs || {};
                          const prevCfg = current[typeKey] || {};
                          const nextCfg = { ...current, [typeKey]: { ...prevCfg, arrangedHours: val } };
                          onChange({ ...mod, formatConfigs: nextCfg });
                        }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </Space>
      <Typography.Title level={5} style={{ marginTop: 8 }}>考核方式</Typography.Title>
      <div style={{ width: '100%', marginBottom: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: ((!mod.assessmentTypeKey && (mod.assessment || '').trim().length > 0) ? '1px solid #ff4d4f' : undefined), paddingTop: ((!mod.assessmentTypeKey && (mod.assessment || '').trim().length > 0) ? 2 : 0) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, gridColumn: '1 / span 2' }}>
          <Text type="secondary">考核方式</Text>
          <Input style={{ flex: 1 }} value={mod.assessment} placeholder="考核方式"
            onChange={(e) => {
              const nextAssess = e.target.value;
              let nextType = mod.assessmentTypeKey;
              if (!nextType && nextAssess.trim()) {
                const g = inferTypeKeyFromText(nextAssess);
                if (g) nextType = g;
              }
              if (!nextAssess.trim()) {
                nextType = undefined;
              }
              onChange({ ...mod, assessment: nextAssess, assessmentTypeKey: nextType });
            }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Text type="secondary">类型</Text>
          <Select
            style={{ width: 160 }}
            placeholder="绑定考核类型"
            value={mod.assessmentTypeKey}
            onChange={(v) => onChange({ ...mod, assessmentTypeKey: v })}
            options={[
              { value: 'live', label: '直播课' },
              { value: 'videos', label: '点播课' },
              { value: 'webinar', label: '线上研讨会' },
              { value: 'exam', label: '考试' },
              { value: 'assignment', label: '试卷作业' },
              { value: 'document', label: '研修成果' }
            ]}
          />
        </div>
      </div>

      <Typography.Title level={5} style={{ marginTop: 8 }}>内容条目</Typography.Title>
      {(mod.content || []).map((cItem, cIdx) => (
        <Space key={cIdx} style={{ width: '100%', marginBottom: 8 }}>
          <Input style={{ flex: 1 }} value={cItem} placeholder="内容"
            onChange={(e) => onChange({ ...mod, content: (mod.content || []).map((ci, k) => k === cIdx ? e.target.value : ci) })} />
          <Button danger onClick={() => onChange({ ...mod, content: (mod.content || []).filter((_, k) => k !== cIdx) })}>删除</Button>
        </Space>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={() => onChange({ ...mod, content: [...(mod.content || []), ''] })}>添加内容</Button>
    </div>
  );
};

const TrainingPlanViewer = ({
  rightPanelTrainingPlanRecord,
  rightPanelTrainingPlanContent,
  setRightPanelView,
  setRightPanelTrainingPlanRecord,
  setRightPanelTrainingPlanContent,
  isFullscreen = false,
  setCurrentView,
  hideButtons = false,
  initialLayoutMode = 'both',
  readOnly = false,
  showBackOnly = false
}) => {
  // 编辑模式状态
  
  // 新增：人员清单弹窗状态与数据
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);

  // dnd-kit 拖拽传感器（用于阶段内模块拖拽排序）
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // 仅指针拖拽传感器（可视化编辑时避免键盘拖拽干扰输入焦点）
  const sensorsNoKeyboard = useSensors(
    useSensor(PointerSensor)
  );
  const participantsList = [
    { name: '张三', department: '数学组', position: '教师', phone: '13800138001', email: 'zhangsan@school.edu' },
    { name: '李四', department: '语文组', position: '教师', phone: '13800138002', email: 'lisi@school.edu' },
    { name: '王五', department: '英语组', position: '教师', phone: '13800138003', email: 'wangwu@school.edu' },
    { name: '赵六', department: '物理组', position: '教师', phone: '13800138004', email: 'zhaoliu@school.edu' },
    { name: '孙七', department: '化学组', position: '教师', phone: '13800138005', email: 'sunqi@school.edu' },
    { name: '周八', department: '生物组', position: '教师', phone: '13800138006', email: 'zhouba@school.edu' },
    { name: '吴九', department: '历史组', position: '教师', phone: '13800138007', email: 'wujiu@school.edu' },
    { name: '郑十', department: '地理组', position: '教师', phone: '13800138008', email: 'zhengshi@school.edu' }
  ];
  // 左侧参训人员标签（去重后）
  const initialLeftTags = Array.from(new Set(participantsList.map(p => p.department)));
  const participantColumnsModal = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '电子邮箱', dataIndex: 'email', key: 'email' }
  ];
  
  // 标签管理与关联
  const [tagsModalVisible, setTagsModalVisible] = useState(false);
  const [tagAssignments, setTagAssignments] = useState(() => {
    const depts = Array.from(new Set(participantsList.map(p => p.department)));
    const map = {};
    depts.forEach(dep => {
      map[dep] = participantsList.filter(p => p.department === dep).map(p => p.name);
    });
    return map;
  });
  const [tags, setTags] = useState(() => Object.keys(tagAssignments).map(dep => ({ key: dep, label: dep, color: 'blue' })));
  const [editingTagKey, setEditingTagKey] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const handleAddTag = () => {
    const name = (newTagName || '').trim();
    if (!name) {
      message.warning('请输入标签名称');
      return;
    }
    if (tags.some(t => t.label === name || t.key === name)) {
      message.warning('标签已存在');
      return;
    }
    setTags(prev => [...prev, { key: name, label: name, color: 'blue' }]);
    setTagAssignments(prev => ({ ...prev, [name]: [] }));
    setNewTagName('');
    message.success('已添加标签');
  };
  // 下载培训人员清单
  const handleDownloadParticipantsList = () => {
    // 模拟生成培训人员清单数据
    const participants = participantsList;

    // 生成CSV格式的内容
    let csvContent = '\uFEFF'; // 添加BOM头，确保Excel正确识别UTF-8编码
    csvContent += '姓名,部门,职位,联系电话,电子邮箱\n';
    participants.forEach(p => {
      csvContent += `${p.name},${p.department},${p.position},${p.phone},${p.email}\n`;
    });

    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '新教师入职培训-培训人员清单.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('培训人员清单已下载');
  };

  // 查看培训人员清单（弹窗）
  const handleViewParticipantsList = () => {
    setParticipantsModalVisible(true);
  };

  // 返回上一级
  const handleBack = () => {
    if (isFullscreen && setCurrentView) {
      setCurrentView(VIEW_MODES.MATERIALS);
    } else {
      setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
    }
  };

  // 分屏：右侧实施方案显示/隐藏

  const [layoutMode, setLayoutMode] = useState(initialLayoutMode || 'both'); // 'left' | 'right' | 'both'
  const handleConfigureImplementation = () => {
    setLayoutMode(prev => (prev === 'left' ? 'both' : 'left'));
  };

  // 左右分栏拖拽：容器与宽度状态
  const containerRef = useRef(null);
  const leftScrollRef = useRef(null);
  const dirPanelRef = useRef(null);
  const [leftWidthPct, setLeftWidthPct] = useState(40); // 初始与之前 flex:4 相当
  const [isResizing, setIsResizing] = useState(false);
  const [dirOpen, setDirOpen] = useState(false); // 左侧目录展开状态
  const [dirEditingAll, setDirEditingAll] = useState(false); // 目录内模块快捷编辑全局开关

  // 目录点击滚动到目标（在左侧滚动容器内平滑滚动）
  const scrollToAnchor = (selector) => {
    try {
      const container = leftScrollRef.current;
      if (!container) return;
      const el = container.querySelector(selector);
      if (!el) return;
      const containerTop = container.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const offsetTop = elTop - containerTop + container.scrollTop - 8;
      container.scrollTo({ top: offsetTop, behavior: 'smooth' });
    } catch {}
  };

  // 目录弹层开合由组件自身控制，避免点输入框时误收起

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const containerWidth = rect?.width || 1;
    const startLeft = leftWidthPct;

    const onMouseMove = (ev) => {
      const dx = ev.clientX - startX;
      const deltaPct = (dx / containerWidth) * 100;
      let next = Math.max(25, Math.min(75, startLeft + deltaPct));
      setLeftWidthPct(next);
    };
    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // 提取的通用区块组件：编辑按钮头部与内联可视化编辑切换
  const SectionHeader = ({ sectionKey, onVisualEdit, onJsonEdit }) => (
    <div style={{ textAlign: 'right', marginBottom: 8 }}>
      <Space size="small">
        <Button size="small" type="link" icon={<SettingOutlined />} onClick={onVisualEdit}>可视化编辑</Button>
        <Button size="small" type="link" onClick={onJsonEdit}>JSON编辑</Button>
      </Space>
    </div>
  );

  const InlineEditableSection = ({ sectionKey, renderContent }) => (
    (inlineVisualEditing && editingSectionKey === sectionKey) ? (
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6, background: '#fafafa' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fafafa', paddingBottom: 8, marginBottom: 12, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center' }}>
          <Space>
            <Button onClick={cancelInlineVisualEdit}>取消</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={saveInlineVisualEdit}>保存</Button>
          </Space>
        </div>
        {renderVisualEditor()}
      </div>
    ) : renderContent()
  );

  // 将培训方案转换为 Markdown 格式
  const convertToMarkdown = (plan) => {
    let markdown = `# ${plan.title}\n\n`;
    
    // 一、培训概述
    markdown += `## 一、培训概述\n\n`;
    markdown += `**培训背景：**${plan.overview.background}\n\n`;
    markdown += `**培训目标：**\n`;
    plan.overview.objectives.forEach(obj => {
      markdown += `- ${obj}\n`;
    });
    markdown += `\n**培训周期：**${plan.overview.duration}\n\n`;
    markdown += `**培训对象：**${plan.overview.participants}\n\n`;
    markdown += `**培训形式：**${plan.overview.format}\n\n`;
    if (plan.overview?.systemTraining?.type) {
      const typeLabel = plan.overview.systemTraining.type === 'knowledge_graph' ? '知识图谱'
        : plan.overview.systemTraining.type === 'capability_model' ? '能力模型'
        : plan.overview.systemTraining.type === 'micro_major' ? '微专业'
        : plan.overview.systemTraining.type;
      const refLabel = plan.overview.systemTraining.refLabel ? `（${plan.overview.systemTraining.refLabel}）` : '';
      markdown += `**体系化培训：**${typeLabel}${refLabel}\n\n`;
    }

    // 二、培训阶段与内容
    markdown += `## 二、培训阶段与内容\n\n`;
    plan.phases.forEach((phase, idx) => {
      markdown += `### ${phase.name}\n\n`;
      markdown += `**培训重点：**${phase.focus}\n\n`;
      phase.modules.forEach(module => {
        markdown += `#### ${module.title}（${module.duration}）\n\n`;
        markdown += `**培训内容：**\n`;
        module.content.forEach(item => {
          markdown += `- ${item}\n`;
        });
        markdown += `\n**培训形式：**${module.format}\n\n`;
        markdown += `**考核方式：**${module.assessment}\n\n`;
      });
    });

    // 三、培训进度安排
    markdown += `## 三、培训进度安排\n\n`;
    markdown += `| 周次 | 培训内容 | 培训形式 | 学时 |\n`;
    markdown += `|------|----------|----------|------|\n`;
    plan.schedule.forEach(item => {
      markdown += `| ${item.week} | ${item.content} | ${item.type} | ${item.hours}学时 |\n`;
    });
    markdown += `\n`;

    // 四、实施方式
    markdown += `## 四、实施方式\n\n`;
    markdown += `**培训平台：**${plan.implementation.platform}\n\n`;
    markdown += `**培训方法：**\n`;
    plan.implementation.methods.forEach(method => {
      markdown += `- ${method}\n`;
    });
    markdown += `\n**支持保障：**\n`;
    plan.implementation.support.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n`;

    // 五、考核评价
    markdown += `## 五、考核评价\n\n`;
    markdown += `**考核方式：**${plan.assessment.method}\n\n`;
    markdown += `**考核组成：**\n`;
    plan.assessment.components.forEach(comp => {
      markdown += `- ${comp.name}（${comp.weight}）：${comp.description}\n`;
    });
    markdown += `\n**评价标准：**\n`;
    plan.assessment.standards.forEach(standard => {
      markdown += `- ${standard}\n`;
    });
    markdown += `\n`;

    // 六、保障措施
    markdown += `## 六、保障措施\n\n`;
    markdown += `**组织保障：**\n`;
    plan.guarantee.organization.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n**资源保障：**\n`;
    plan.guarantee.resources.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n**质量保障：**\n`;
    plan.guarantee.quality.forEach(item => {
      markdown += `- ${item}\n`;
    });

    return markdown;
  };

  // 打开编辑器


  // 保存编辑


  // 取消编辑

  // 新教师入职线上培训方案数据
  const newTeacherTrainingPlan = {
    title: '新教师入职线上培训具体方案',
    overview: {
      background: '为帮助新入职教师尽快适应教学工作，提升专业素养，特制定本线上培训方案。',
      objectives: [
        '帮助新教师了解学校文化、规章制度和教学要求',
        '提升新教师的教学基本功和课堂管理能力',
        '培养新教师的教育教学研究意识',
        '促进新教师快速融入教师团队'
      ],
      duration: '3个月（12周）',
      participants: '本学年新入职教师',
      format: '线上直播课程 + 录播视频 + 线上研讨会 + 实践作业',
      systemTraining: { type: null, refId: null, refLabel: null }
    },
    phases: [
      {
        name: '第一阶段：入职适应期（第1-4周）',
        focus: '帮助新教师了解学校、熟悉环境、建立基本认知',
        modules: [
          {
            title: '学校文化与制度',
            duration: '1周',
            content: [
              '学校发展历程与办学理念',
              '学校组织架构与部门职能',
              '教师职业道德与行为规范',
              '学校规章制度解读'
            ],
            format: '直播讲座',
            assessment: '在线测试（100分）'
          },
          {
            title: '教学基本规范',
            duration: '1周',
            content: [
              '教学计划制定与执行',
              '备课要求与教案编写',
              '课堂教学基本流程',
              '作业布置与批改规范'
            ],
            format: '录播视频 + 案例分析',
            assessment: '教案设计作业（100分）'
          },
          {
            title: '学生管理基础',
            duration: '1周',
            content: [
              '学生心理特点分析',
              '课堂纪律管理策略',
              '师生沟通技巧',
              '问题学生应对方法'
            ],
            format: '直播课程 + 情景模拟',
            assessment: '案例分析报告（100分）'
          },
          {
            title: '教育技术应用',
            duration: '1周',
            content: [
              '多媒体教学设备使用',
              '线上教学平台操作',
              '数字化教学资源获取',
              '教学软件工具应用'
            ],
            format: '操作演示 + 实践练习',
            assessment: '实操考核（100分）'
          }
        ]
      },
      {
        name: '第二阶段：能力提升期（第5-8周）',
        focus: '提升新教师的教学设计能力和课堂实施能力',
        modules: [
          {
            title: '教学设计进阶',
            duration: '1周',
            content: [
              '教学目标的制定与分解',
              '教学内容的选择与组织',
              '教学方法的选择与运用',
              '教学评价的设计与实施'
            ],
            format: '专题讲座 + 同伴互评',
            assessment: '完整教学设计（100分）'
          },
          {
            title: '课堂教学技能',
            duration: '1周',
            content: [
              '导入技能与情境创设',
              '讲解技能与语言表达',
              '提问技能与互动设计',
              '板书技能与媒体运用'
            ],
            format: '示范课观摩 + 微格教学',
            assessment: '模拟授课（100分）'
          },
          {
            title: '差异化教学',
            duration: '1周',
            content: [
              '学生个体差异识别',
              '分层教学策略设计',
              '个性化辅导方法',
              '特殊学生教育支持'
            ],
            format: '案例研讨 + 方案设计',
            assessment: '差异化教学方案（100分）'
          },
          {
            title: '教学反思与改进',
            duration: '1周',
            content: [
              '教学反思的意义与方法',
              '课堂观察与自我诊断',
              '教学问题分析与解决',
              '教学经验总结与分享'
            ],
            format: '反思写作 + 线上研讨会',
            assessment: '教学反思报告（100分）'
          }
        ]
      },
      {
        name: '第三阶段：专业发展期（第9-12周）',
        focus: '培养新教师的教研能力和持续发展意识',
        modules: [
          {
            title: '教育科研入门',
            duration: '1周',
            content: [
              '教育科研的基本概念',
              '教育研究方法介绍',
              '课题选择与申报',
              '教育论文写作规范'
            ],
            format: '理论学习 + 文献阅读',
            assessment: '研究计划书（100分）'
          },
          {
            title: '校本课程开发',
            duration: '1周',
            content: [
              '校本课程的理念与特点',
              '课程资源的开发与整合',
              '校本教材的编写',
              '特色课程的设计'
            ],
            format: '项目学习 + 团队协作',
            assessment: '课程开发方案（100分）'
          },
          {
            title: '家校沟通艺术',
            duration: '1周',
            content: [
              '家校合作的重要性',
              '家长会组织与实施',
              '家访技巧与注意事项',
              '家校矛盾化解策略'
            ],
            format: '情景演练 + 经验分享',
            assessment: '家校沟通案例分析（100分）'
          },
          {
            title: '教师职业规划',
            duration: '1周',
            content: [
              '教师专业发展阶段',
              '个人成长目标设定',
              '专业发展路径选择',
              '终身学习习惯养成'
            ],
            format: '导师指导 + 规划撰写',
            assessment: '个人发展规划（100分）'
          }
        ]
      }
    ],
    schedule: [
      { week: '第1周', content: '学校文化与制度', type: '直播讲座', hours: 6 },
      { week: '第2周', content: '教学基本规范', type: '录播视频', hours: 6 },
      { week: '第3周', content: '学生管理基础', type: '直播课程', hours: 6 },
      { week: '第4周', content: '教育技术应用', type: '操作演示', hours: 6 },
      { week: '第5周', content: '教学设计进阶', type: '专题讲座', hours: 8 },
      { week: '第6周', content: '课堂教学技能', type: '示范课观摩', hours: 8 },
      { week: '第7周', content: '差异化教学', type: '案例研讨', hours: 8 },
      { week: '第8周', content: '教学反思与改进', type: '反思写作', hours: 8 },
      { week: '第9周', content: '教育科研入门', type: '理论学习', hours: 8 },
      { week: '第10周', content: '校本课程开发', type: '项目学习', hours: 8 },
      { week: '第11周', content: '家校沟通艺术', type: '情景演练', hours: 8 },
      { week: '第12周', content: '教师职业规划', type: '导师指导', hours: 8 }
    ],
    participants: participantsList,
    participantTags: initialLeftTags,
    implementation: {
      platform: '学校在线培训平台',
      methods: [
        '直播课程：每周固定时间进行，支持回放',
        '录播视频：学员可自主安排学习时间',
        '在线研讨：通过讨论区、小组会议等形式开展',
        '实践作业：结合教学实际完成各项任务',
        '导师指导：配备资深教师一对一辅导'
      ],
      support: [
        '提供完整的学习资料和参考文献',
        '建立新教师学习交流群',
        '安排定期的答疑时间',
        '提供教学观摩和实践机会'
      ]
    },
    assessment: {
      method: '过程性评价与终结性评价相结合',
      components: [
        {
          name: '在线学习',
          weight: '30%',
          description: '课程观看完成度、参与度'
        },
        {
          name: '作业考核',
          weight: '40%',
          description: '各模块作业完成质量'
        },
        {
          name: '实践表现',
          weight: '20%',
          description: '教学实践、课堂表现'
        },
        {
          name: '综合评价',
          weight: '10%',
          description: '导师评价、同伴互评'
        }
      ],
      standards: [
        '优秀（90分及以上）：全面掌握培训内容，教学能力突出',
        '良好（80-89分）：较好掌握培训内容，教学能力较强',
        '合格（60-79分）：基本掌握培训内容，能够独立开展教学',
        '不合格（60分以下）：需要继续学习和提升'
      ]
    },
    guarantee: {
      organization: [
        '成立新教师培训小组',
        '成立新教师培训领导小组',
        '明确各部门职责分工',
        '建立培训档案管理制度'
      ],
      resources: [
        '配备专业的培训师资团队',
        '提供充足的学习资源',
        '保障培训经费投入'
      ],
      quality: [
        '定期收集学员反馈',
        '持续优化培训内容',
        '加强过程监督管理'
      ]
    }
  };

  // 引入方案可编辑状态
  const [plan, setPlan] = useState(newTeacherTrainingPlan);
  // 方案汇总：模块学时/成绩合计与全局目标（用于展示与编辑）
  const totals = useMemo(() => {
    let hoursSumTarget = 0;
    let scoreSumTarget = 0;
    let arrangedHoursSum = 0;
    (Array.isArray(plan?.phases) ? plan.phases : []).forEach((ph) => {
      (Array.isArray(ph?.modules) ? ph.modules : []).forEach((m) => {
        hoursSumTarget += Number(m?.hoursTarget || 0);
        scoreSumTarget += Number(m?.scoreTarget || 0);
        arrangedHoursSum += Number((m?.arrangedHours ?? m?.hoursTarget) || 0);
      });
    });
    const totalHoursTargetConfig = Number(plan?.assessment?.totalHoursTarget || 0);
    const totalScoreTargetConfig = Number(plan?.assessment?.totalScoreTarget || 0);
    const totalHoursTarget = totalHoursTargetConfig > 0 ? totalHoursTargetConfig : hoursSumTarget;
    const totalScoreTarget = totalScoreTargetConfig > 0 ? totalScoreTargetConfig : 100;
    return { hoursSumTarget, arrangedHoursSum, scoreSumTarget, totalHoursTarget, totalScoreTarget };
  }, [plan]);

  // 初始化：若未设置总学时目标且模块学时合计>0，则将其初始化为模块学时合计
  useEffect(() => {
    const current = Number(plan?.assessment?.totalHoursTarget || 0);
    if (current <= 0 && totals.arrangedHoursSum > 0) {
      setPlan(prev => ({
        ...prev,
        assessment: {
          ...(prev.assessment || {}),
          totalHoursTarget: totals.arrangedHoursSum
        }
      }));
    }
    // 仅在 arrangedHoursSum 变化时尝试初始化，避免覆盖用户设置
  }, [totals.arrangedHoursSum]);

  // 将字符串学时解析为数字（如 "6学时" -> 6）
  const parseHoursValue = (val) => {
    if (val == null) return 0;
    const s = String(val);
    const m = s.match(/\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : Number(s) || 0;
  };

  // 按培训形式派生模块的学时目标与安排学时：
  // 学时目标 = 各形式的考核学时(assessmentHours)之和；安排学时 = 各形式的安排学时(arrangedHours)之和
  // 这两者仅用于展示，不支持人工修改
  useEffect(() => {
    const phases = Array.isArray(plan?.phases) ? plan.phases : [];
    let anyChanged = false;
    const nextPhases = phases.map((ph) => {
      const nextModules = (ph.modules || []).map((mod) => {
        const formats = parseFormats(mod?.format) || [];
        const typeMap = mod?.formatTypeMap || {};
        const cfgs = mod?.formatConfigs || {};
        let sumAssess = 0;
        let sumArranged = 0;
        formats.forEach((fmt) => {
          const typeKey = typeMap[fmt] || inferTypeKeyFromText(fmt);
          const fc = cfgs[typeKey] || {};
          const assess = Number(fc.assessmentHours ?? fc.hours ?? 0);
          const arranged = Number(fc.arrangedHours ?? fc.hours ?? 0);
          if (Number.isFinite(assess)) sumAssess += assess;
          if (Number.isFinite(arranged)) sumArranged += arranged;
        });
        const prevAssess = Number(mod?.hoursTarget || 0);
        const prevArranged = Number(mod?.arrangedHours || 0);
        if (sumAssess !== prevAssess || sumArranged !== prevArranged) {
          anyChanged = true;
          return { ...mod, hoursTarget: sumAssess, arrangedHours: sumArranged };
        }
        return mod;
      });
      return anyChanged ? { ...ph, modules: nextModules } : ph;
    });
    if (anyChanged) {
      setPlan((prev) => ({ ...prev, phases: nextPhases }));
    }
  }, [plan?.phases]);

  // 扁平化模块列表并保留索引路径
  const flattenModules = (phases = []) => {
    const flat = [];
    (phases || []).forEach((ph, pIdx) => {
      (ph.modules || []).forEach((mod, mIdx) => {
        flat.push({ pIdx, mIdx, mod });
      });
    });
    return flat;
  };

  // 为详细时间安排准备带模块权重的数据，以及权重变更回写处理
  const flatModulesForSchedule = useMemo(() => (
    flattenModules(Array.isArray(plan?.phases) ? plan.phases : [])
  ), [plan?.phases]);

  // 映射：模块考核key <-> 文本
  const assessKeyToLabel = (key) => (
    key === 'exam' ? '考试' : key === 'assignment' ? '作业' : key === 'document' ? '评阅' : ''
  );
  const assessLabelToKey = (label) => (
    label === '考试' ? 'exam' : label === '作业' ? 'assignment' : label === '评阅' ? 'document' : (inferTypeKeyFromText(label) || '')
  );
  const cleanAssessmentText = (txt) => String(txt || '')
    .replace(/（\s*\d+(?:\.\d+)?\s*(?:分)?\s*）/g, '')
    .replace(/\(\s*\d+(?:\.\d+)?\s*(?:分)?\s*\)/g, '')
    .trim();

  const scheduleWithWeights = useMemo(() => (
    (Array.isArray(plan?.schedule) ? plan.schedule : []).map((row, i) => {
      const mod = flatModulesForSchedule[i]?.mod || {};
      const text = cleanAssessmentText(mod.assessment);
      const boundKey = mod.assessmentTypeKey || inferTypeKeyFromText(mod.assessment || '') || '';
      const label = text || String(row.assessment || '').trim() || assessKeyToLabel(boundKey);
      return {
        ...row,
        assessment: label,
        moduleWeight: Number(mod?.weight ?? 0)
      };
    })
  ), [plan?.schedule, flatModulesForSchedule]);

  const handleChangeModuleWeight = (rowIndex, newWeight) => {
    setPlan(prev => {
      const phases = Array.isArray(prev?.phases) ? [...prev.phases] : [];
      const flat = flattenModules(phases);
      const ref = flat[rowIndex];
      if (!ref) return prev;
      const ph = phases[ref.pIdx] || {};
      const mods = Array.isArray(ph.modules) ? [...ph.modules] : [];
      const target = { ...(mods[ref.mIdx] || {}) };
      target.weight = Number(newWeight ?? 0);
      mods[ref.mIdx] = target;
      phases[ref.pIdx] = { ...ph, modules: mods };
      return { ...prev, phases };
    });
  };

  // 从详细安排同步学时到模块安排学时（不再写入模块学时目标）
  const syncScheduleToModules = (scheduleRows) => {
    setPlan(prev => {
      const phases = Array.isArray(prev?.phases) ? prev.phases : [];
      const flat = flattenModules(phases);
      const nextPhases = phases.map((ph) => ({ ...ph }));
      flat.forEach((item, idx) => {
        if (idx >= (scheduleRows || []).length) return;
        const hours = parseHoursValue((scheduleRows || [])[idx]?.hours);
        const assessText = (scheduleRows || [])[idx]?.assessment;
        const ph = nextPhases[item.pIdx];
        const mods = Array.isArray(ph.modules) ? [...ph.modules] : [];
        const mod = { ...(mods[item.mIdx] || {}) };
        mod.arrangedHours = hours;
        // 根据“详细安排-考核”文本回写模块考核方式与文案
        const aText = String(assessText || '').trim();
        const key = assessLabelToKey(aText);
        if (aText) {
          mod.assessment = aText;
        }
        if (key) {
          mod.assessmentTypeKey = key;
        }
        mods[item.mIdx] = mod;
        nextPhases[item.pIdx] = { ...ph, modules: mods };
      });
      return { ...prev, phases: nextPhases };
    });
  };

  // 从模块 hoursTarget 回写到详细安排 rows.hours（按顺序对齐）
  const syncModulesToSchedule = () => {
    setPlan(prev => {
      const phases = Array.isArray(prev?.phases) ? prev.phases : [];
      const flat = flattenModules(phases);
      const schedule = Array.isArray(prev?.schedule) ? [...prev.schedule] : [];
      const count = Math.min(schedule.length, flat.length);
      for (let i = 0; i < count; i++) {
        const modRef = flat[i].mod || {};
        const hours = Number((modRef.arrangedHours ?? modRef.hoursTarget) || 0);
        const row = { ...(schedule[i] || {}) };
        // 保持展示友好：写入纯数字，现有 UI 显示不附加单位
        row.hours = hours;
        // 同步模块的考核方式文本到详细安排“考核”列
        const text = cleanAssessmentText(modRef.assessment);
        const label = text || assessKeyToLabel(modRef.assessmentTypeKey || inferTypeKeyFromText(modRef.assessment || ''));
        if (label) row.assessment = label;
        schedule[i] = row;
      }
      return { ...prev, schedule };
    });
  };

  // 一次性初始化：若模块学时为空且详细安排存在有效学时，用安排填充模块
  useEffect(() => {
    const scheduleRows = Array.isArray(plan?.schedule) ? plan.schedule : [];
    const phases = Array.isArray(plan?.phases) ? plan.phases : [];
    if (!scheduleRows.length || !phases.length) return;
    const flat = flattenModules(phases);
    const hasModuleHours = flat.some(it => Number(it.mod?.hoursTarget || 0) > 0);
    const hasScheduleHours = scheduleRows.some(r => parseHoursValue(r?.hours) > 0);
    if (!hasModuleHours && hasScheduleHours) {
      syncScheduleToModules(scheduleRows);
    }
  }, [plan?.schedule, plan?.phases]);

  // 初始化每个培训形式的考核学时与学习安排学时（仅在缺失时填充，均分模块总安排学时或目标学时）
  useEffect(() => {
    setPlan(prev => {
      const phases = Array.isArray(prev?.phases) ? prev.phases : [];
      if (!phases.length) return prev;
      let mutated = false;
      const nextPhases = phases.map((ph) => {
        const mods = Array.isArray(ph.modules) ? ph.modules.map((mod) => {
          const formats = parseFormats(mod?.format) || [];
          if (!formats.length) return mod;
          const typeMap = mod?.formatTypeMap || {};
          const totalArranged = Number(mod?.arrangedHours ?? mod?.hoursTarget ?? 0) || 0;
          const total = Math.max(formats.length, 1);
          const evenShare = totalArranged > 0 ? (totalArranged / total) : 0;
          let cfg = mod?.formatConfigs || {};
          let modChanged = false;
          formats.forEach((f) => {
            const typeKey = typeMap[f] || inferTypeKeyFromText(f);
            if (!typeKey) return;
            const prevCfg = cfg[typeKey] || {};
            const needInitAssess = typeof prevCfg.assessmentHours !== 'number';
            const needInitArranged = typeof prevCfg.arrangedHours !== 'number';
            if (needInitAssess || needInitArranged) {
              const initVal = Number.isFinite(evenShare) ? evenShare : 0;
              cfg = { ...cfg, [typeKey]: {
                ...prevCfg,
                assessmentHours: needInitAssess ? initVal : prevCfg.assessmentHours,
                arrangedHours: needInitArranged ? initVal : prevCfg.arrangedHours
              } };
              modChanged = true;
            }
          });
          if (modChanged) {
            mutated = true;
            return { ...mod, formatConfigs: cfg };
          }
          return mod;
        }) : ph.modules;
        return { ...ph, modules: mods };
      });
      return mutated ? { ...prev, phases: nextPhases } : prev;
    });
  }, [plan?.phases]);

  // 初始化与归一化模块权重，使总和严格等于100%
  useEffect(() => {
    setPlan(prev => {
      const phases = Array.isArray(prev?.phases) ? prev.phases : [];
      if (!phases.length) return prev;

      // 扁平化模块以便统一计算
      const flat = [];
      phases.forEach((ph, pIdx) => {
        (ph.modules || []).forEach((mod, mIdx) => {
          flat.push({ pIdx, mIdx, mod });
        });
      });
      const n = flat.length;
      if (!n) return prev;

      // 解析当前权重（允许数值或包含"%"的字符串）
      const parsedWeights = flat.map(({ mod }) => {
        const raw = mod?.weight;
        if (raw == null || raw === '') return null;
        const num = Number(String(raw).replace('%', ''));
        return Number.isFinite(num) ? Math.max(0, num) : null;
      });
      const hasAnyWeight = parsedWeights.some(w => (w ?? 0) > 0);
      const weightSum = parsedWeights.reduce((acc, w) => acc + (w || 0), 0);

      // 根据模块学时（优先安排学时，其次目标学时）生成占比
      const computeSharesFromHours = () => {
        const bases = flat.map(({ mod }) => {
          const b = Number(mod?.arrangedHours ?? mod?.hoursTarget ?? 0);
          return Number.isFinite(b) ? Math.max(0, b) : 0;
        });
        const total = bases.reduce((a, b) => a + b, 0);
        if (total > 0) {
          return bases.map(b => b / total);
        }
        // 若无学时信息则均分
        return Array(n).fill(1 / n);
      };

      // 将占比（和为1）转换为整数百分比并保证总和=100
      const normalizeToPercents = (shares) => {
        const ints = shares.map(s => Math.floor(s * 100));
        let allocated = ints.reduce((a, b) => a + b, 0);
        const remainders = shares.map((s, idx) => ({ idx, frac: (s * 100) - ints[idx] }));
        remainders.sort((a, b) => b.frac - a.frac);
        let i = 0;
        while (allocated < 100 && i < remainders.length) {
          ints[remainders[i].idx] += 1;
          allocated += 1;
          i += 1;
        }
        return ints;
      };

      let targetPercents = null;
      if (!hasAnyWeight) {
        // 初始化：依据学时比例或均分
        targetPercents = normalizeToPercents(computeSharesFromHours());
      } else if (Math.round(weightSum) !== 100) {
        // 归一化：按已有比例缩放到100
        const shares = (weightSum > 0)
          ? parsedWeights.map(w => (w || 0) / weightSum)
          : computeSharesFromHours();
        targetPercents = normalizeToPercents(shares);
      }

      if (!targetPercents) return prev; // 无需变更

      let mutated = false;
      const nextPhases = phases.map((ph) => {
        const mods = Array.isArray(ph.modules) ? [...ph.modules] : [];
        return { ...ph, modules: mods };
      });

      flat.forEach((item, idx) => {
        const ph = nextPhases[item.pIdx];
        const mods = [...(ph.modules || [])];
        const mod = { ...(mods[item.mIdx] || {}) };
        const current = Number(String(mod?.weight ?? '').replace('%', ''));
        const nextVal = targetPercents[idx];
        if (!Number.isFinite(current) || current !== nextVal) {
          mod.weight = nextVal; // 存储为数值百分比
          mods[item.mIdx] = mod;
          nextPhases[item.pIdx] = { ...ph, modules: mods };
          mutated = true;
        }
      });

      return mutated ? { ...prev, phases: nextPhases } : prev;
    });
  }, [plan?.phases]);
  // 动态目录项：阶段与模块（依赖 plan）
  const phaseAnchorItems = useMemo(() => (
    Array.isArray(plan?.phases)
      ? plan.phases.map((ph, pIdx) => ({
          key: `phase-${pIdx}`,
          href: `#phase-${pIdx}`,
          title: ph?.name || `阶段 ${pIdx + 1}`,
          children: Array.isArray(ph?.modules)
            ? ph.modules.map((m, mIdx) => ({
                key: `phase-${pIdx}-module-${mIdx}`,
                href: `#phase-${pIdx}-module-${mIdx}`,
                title: m?.title || `模块 ${mIdx + 1}`
              }))
            : []
        }))
      : []
  ), [plan?.phases]);

  const anchorItems = useMemo(() => ([
    { key: 'overview', href: '#section-overview', title: '方案概述' },
    { key: 'participantTags', href: '#section-participantTags', title: '参训人员（标签）' },
    { key: 'phases', href: '#section-phases', title: '培训阶段与内容', children: phaseAnchorItems },
    { key: 'schedule', href: '#section-schedule', title: '培训进度安排' },
    { key: 'implementation', href: '#section-implementation', title: '实施保障' },
    { key: 'assessment', href: '#section-assessment', title: '考核与评价' },
    { key: 'guarantee', href: '#section-guarantee', title: '保障措施' }
  ]), [phaseAnchorItems]);
  // 基于方案中的参训人员动态生成左侧标签
  const leftTags = useMemo(() => {
  if (Array.isArray(plan.participantTags) && plan.participantTags.length) {
    return Array.from(new Set(plan.participantTags));
  }
  return Array.from(new Set(((plan.participants || []).map(p => p.department))));
}, [plan.participantTags, plan.participants]);
  // 统一的部分编辑弹窗状态与方法（JSON直接编辑）
  const [sectionEditorVisible, setSectionEditorVisible] = useState(false);
  const [editingSectionKey, setEditingSectionKey] = useState(null);
  const [sectionDraft, setSectionDraft] = useState('');
  const [editMode, setEditMode] = useState('visual');
  const [visualDraft, setVisualDraft] = useState(null);
  const [inlineVisualEditing, setInlineVisualEditing] = useState(false);
  const [editingModulePath, setEditingModulePath] = useState(null); // { phaseIdx, moduleIdx } | null
  const openSectionEditor = (key, path = null) => {
    try {
      setEditingSectionKey(key);
      let sectionData = plan[key];
      if (sectionData === undefined) {
        sectionData = (key === 'participants' || key === 'participantTags') ? [] : {};
      }
      if (key === 'phases' && path && typeof path.phaseIdx === 'number' && typeof path.moduleIdx === 'number') {
        const mod = ((plan.phases || [])[path.phaseIdx] || {}).modules?.[path.moduleIdx] || { title: '', duration: '', content: [], format: '', assessment: '' };
        setSectionDraft(JSON.stringify(mod, null, 2));
        setVisualDraft(JSON.parse(JSON.stringify(mod)));
        setEditingModulePath({ phaseIdx: path.phaseIdx, moduleIdx: path.moduleIdx });
      } else {
        setSectionDraft(JSON.stringify(sectionData, null, 2));
        setVisualDraft(JSON.parse(JSON.stringify(sectionData)));
        setEditingModulePath(null);
      }
      setEditMode('json');
      setSectionEditorVisible(true);
    } catch (e) {
      message.error('无法打开该部分内容');
    }
  };
  const saveSectionEdit = () => {
    if (!editingSectionKey) return;
    try {
      if (editMode === 'json') {
        const parsed = JSON.parse(sectionDraft);
        if (editingSectionKey === 'phases' && editingModulePath) {
          const { phaseIdx, moduleIdx } = editingModulePath;
          setPlan(prev => ({
            ...prev,
            phases: (prev.phases || []).map((ph, i) => {
              if (i !== phaseIdx) return ph;
              const mods = [...(ph.modules || [])];
              mods[moduleIdx] = parsed;
              return { ...ph, modules: mods };
            })
          }));
          // 模块保存（JSON路径）后回写详细安排
          syncModulesToSchedule();
        } else {
          setPlan(prev => ({ ...prev, [editingSectionKey]: parsed }));
          // 保存详细安排（JSON路径）后同步到模块学时；保存阶段整体也回写详细安排
          if (editingSectionKey === 'schedule') {
            syncScheduleToModules(parsed);
          }
          if (editingSectionKey === 'phases') {
            syncModulesToSchedule();
          }
        }
      } else {
        if (editingSectionKey === 'phases' && editingModulePath) {
          const { phaseIdx, moduleIdx } = editingModulePath;
          setPlan(prev => ({
            ...prev,
            phases: (prev.phases || []).map((ph, i) => {
              if (i !== phaseIdx) return ph;
              const mods = [...(ph.modules || [])];
              mods[moduleIdx] = visualDraft;
              return { ...ph, modules: mods };
            })
          }));
          // 模块保存（可视化路径）后回写详细安排
          syncModulesToSchedule();
        } else {
          setPlan(prev => ({ ...prev, [editingSectionKey]: visualDraft }));
          // 保存详细安排（可视化路径）后同步到模块学时；保存阶段整体也回写详细安排
          if (editingSectionKey === 'schedule') {
            syncScheduleToModules(visualDraft);
          }
          if (editingSectionKey === 'phases') {
            syncModulesToSchedule();
          }
        }
      }
      setSectionEditorVisible(false);
      setEditingSectionKey(null);
      setEditingModulePath(null);
      message.success('已保存该部分内容');
    } catch (e) {
      message.error(editMode === 'json' ? 'JSON格式错误，请检查' : '保存失败，请检查表单内容');
    }
  };

  // 内联可视化编辑控制
  const openInlineVisualEditor = (key, path = null) => {
    try {
      setEditingSectionKey(key);
      let sectionData = plan[key];
      if (sectionData === undefined) {
        sectionData = (key === 'participants' || key === 'participantTags') ? [] : {};
      }
      // 专门处理考核总体要求的初始值来源于 plan.assessment
      if (key === 'assessmentOverview') {
        const init = {
          totalHoursTarget: plan?.assessment?.totalHoursTarget ?? totals.hoursSumTarget,
          totalScoreTarget: plan?.assessment?.totalScoreTarget ?? 100
        };
        setVisualDraft(JSON.parse(JSON.stringify(init)));
        setEditingModulePath(null);
        setInlineVisualEditing(true);
        setEditMode('visual');
        return;
      }
      if (key === 'phases' && path && typeof path.phaseIdx === 'number' && typeof path.moduleIdx === 'number') {
        const mod = ((plan.phases || [])[path.phaseIdx] || {}).modules?.[path.moduleIdx] || { title: '', duration: '', content: [], format: '', assessment: '' };
        const initMod = initModuleBindings(mod);
        setVisualDraft(JSON.parse(JSON.stringify(initMod)));
        setEditingModulePath({ phaseIdx: path.phaseIdx, moduleIdx: path.moduleIdx });
      } else {
        // 若是整个阶段编辑，默认为每个模块初始化绑定
        if (key === 'phases') {
          const initPhases = (sectionData || []).map(ph => ({
            ...ph,
            modules: (ph.modules || []).map(m => initModuleBindings(m))
          }));
          setVisualDraft(JSON.parse(JSON.stringify(initPhases)));
        } else {
          setVisualDraft(JSON.parse(JSON.stringify(sectionData)));
        }
        setEditingModulePath(null);
      }
      setInlineVisualEditing(true);
      setEditMode('visual');
    } catch (e) {
      message.error('无法打开可视化编辑');
    }
  };
  const cancelInlineVisualEdit = () => {
    setInlineVisualEditing(false);
    setEditingSectionKey(null);
    setVisualDraft(null);
    setEditingModulePath(null);
  };
  // 体系化培训可选数据项（根据类型切换）
  const knowledgeNodeOptions = useMemo(() => generateKnowledgeNodes().map(n => ({ value: n.id, label: n.name })), []);
  const capabilityNodeOptions = useMemo(() => generateCapabilityNodes().map(n => ({ value: n.id, label: n.name })), []);
  const microMajorOptions = useMemo(() => ([
    { value: 'data-science', label: '数据科学微专业' },
    { value: 'uiux-design', label: 'UI/UX设计微专业' },
    { value: 'cloud-computing', label: '云计算微专业' }
  ]), []);
  const saveInlineVisualEdit = () => {
    if (!editingSectionKey) return;
    try {
      // 专门保存考核总体要求到 plan.assessment
      if (editingSectionKey === 'assessmentOverview') {
        setPlan(prev => ({
          ...prev,
          assessment: {
            ...(prev.assessment || {}),
            totalHoursTarget: visualDraft?.totalHoursTarget ?? prev.assessment?.totalHoursTarget ?? totals.hoursSumTarget,
            totalScoreTarget: visualDraft?.totalScoreTarget ?? prev.assessment?.totalScoreTarget ?? 100
          }
        }));
        cancelInlineVisualEdit();
        message.success('已保存该部分内容');
        return;
      }
      // 保存详细安排后，同步到模块学时
      if (editingSectionKey === 'schedule') {
        setPlan(prev => ({ ...prev, schedule: visualDraft }));
        syncScheduleToModules(visualDraft);
        cancelInlineVisualEdit();
        message.success('已保存该部分内容');
        return;
      }
      if (editingSectionKey === 'phases' && editingModulePath) {
        const { phaseIdx, moduleIdx } = editingModulePath;
        setPlan(prev => ({
          ...prev,
          phases: (prev.phases || []).map((ph, i) => {
            if (i !== phaseIdx) return ph;
            const mods = [...(ph.modules || [])];
            mods[moduleIdx] = visualDraft;
            return { ...ph, modules: mods };
          })
        }));
        // 模块保存后回写详细安排
        syncModulesToSchedule();
      } else {
        setPlan(prev => ({ ...prev, [editingSectionKey]: visualDraft }));
        if (editingSectionKey === 'phases') {
          syncModulesToSchedule();
        }
      }
      cancelInlineVisualEdit();
      message.success('已保存该部分内容');
    } catch (e) {
      message.error('保存失败，请检查表单内容');
    }
  };

  // 可视化编辑器渲染
  const renderVisualEditor = () => {
    if (!editingSectionKey || !visualDraft) {
      return <Text type="secondary">请选择左侧需要编辑的部分。</Text>;
    }

    const renderStringList = (label, arrKey, placeholder = '请输入条目') => (
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 8 }}>{label}</Title>
        {(visualDraft[arrKey] || []).map((item, idx) => (
          <Space key={idx} style={{ width: '100%', marginBottom: 8 }} align="start">
            <Input
              style={{ flex: 1 }}
              value={item}
              placeholder={placeholder}
              onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
              onChange={(e) => {
                const val = e.target.value;
                setVisualDraft(prev => ({
                  ...prev,
                  [arrKey]: prev[arrKey].map((x, i) => i === idx ? val : x)
                }));
              }}
            />
            <Button danger onClick={() => {
              setVisualDraft(prev => ({
                ...prev,
                [arrKey]: prev[arrKey].filter((_, i) => i !== idx)
              }));
            }}>删除</Button>
          </Space>
        ))}
        <Button type="dashed" icon={<PlusOutlined />} onClick={() => {
          setVisualDraft(prev => ({
            ...prev,
            [arrKey]: [...(prev[arrKey] || []), '']
          }));
        }}>添加一项</Button>
      </div>
    );

    switch (editingSectionKey) {
      case 'assessmentOverview':
        return (
          <div>
            <Title level={5}>考核总体要求</Title>
            <Space style={{ width: '100%', marginBottom: 12 }} align="center">
              <Text strong>总安排学时：</Text>
              <InputNumber
                style={{ width: 120 }}
                min={0}
                value={visualDraft?.totalHoursTarget ?? totals.arrangedHoursSum}
                onChange={(val) => setVisualDraft(prev => ({ ...prev, totalHoursTarget: val }))}
              />
              <Text type="secondary">（已安排学时合计：{totals.arrangedHoursSum}）</Text>
            </Space>
            <Space style={{ width: '100%' }} align="center">
              <Text strong>总成绩目标：</Text>
              <InputNumber
                style={{ width: 120 }}
                min={0}
                max={100}
                value={visualDraft?.totalScoreTarget ?? 100}
                onChange={(val) => setVisualDraft(prev => ({ ...prev, totalScoreTarget: val }))}
              />
              <Text type="secondary">（模块成绩合计：{totals.scoreSumTarget}）</Text>
            </Space>
          </div>
        );
      case 'overview':
        return (
          <div>
            <Title level={5}>培训背景</Title>
            <TextArea
              rows={4}
              value={visualDraft.background}
              onChange={(e) => setVisualDraft(prev => ({ ...prev, background: e.target.value }))}
              placeholder="请输入培训背景"
              style={{ marginBottom: 16 }}
            />
            <Title level={5}>培训目标</Title>
            {renderStringList('目标条目', 'objectives', '请输入目标')}
            <Space style={{ width: '100%', marginBottom: 8 }}>
              <Input
                value={visualDraft.duration}
                onChange={(e) => setVisualDraft(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="培训周期（如：3个月/12周）"
              />
            </Space>
            <Space style={{ width: '100%', marginBottom: 8 }}>
              <Input
                value={visualDraft.participants}
                onChange={(e) => setVisualDraft(prev => ({ ...prev, participants: e.target.value }))}
                placeholder="培训对象"
              />
            </Space>
            <Space style={{ width: '100%', marginBottom: 8 }}>
              <Select
                mode="tags"
                style={{ flex: 1 }}
                placeholder="培训形式（可多选，可自定义）"
                value={parseFormats(visualDraft.format)}
                onChange={(vals) => setVisualDraft(prev => ({ ...prev, format: joinFormats(vals) }))}
                options={DEFAULT_FORMAT_OPTIONS.map(v => ({ value: v, label: v }))}
              />
            </Space>
            <Title level={5} style={{ marginTop: 16 }}>体系化培训</Title>
            <Space style={{ width: '100%', marginBottom: 8 }} align="center" wrap>
              <Select
                style={{ width: 180 }}
                placeholder="选择类型"
                value={visualDraft?.systemTraining?.type || null}
                options={SYSTEM_TRAINING_TYPES}
                onChange={(val) => setVisualDraft(prev => ({
                  ...prev,
                  systemTraining: { type: val, refId: null, refLabel: null }
                }))}
              />
              <Select
                style={{ minWidth: 240, flex: 1 }}
                placeholder="选择数据项"
                value={visualDraft?.systemTraining?.refId || null}
                options={(() => {
                  const type = visualDraft?.systemTraining?.type;
                  if (type === 'knowledge_graph') return knowledgeNodeOptions;
                  if (type === 'capability_model') return capabilityNodeOptions;
                  if (type === 'micro_major') return microMajorOptions;
                  return [];
                })()}
                onChange={(val, opt) => setVisualDraft(prev => ({
                  ...prev,
                  systemTraining: { ...(prev.systemTraining || {}), refId: val, refLabel: opt?.label || null }
                }))}
                disabled={!visualDraft?.systemTraining?.type}
              />
            </Space>
          </div>
        );
      case 'participantTags':
        return (
          <div>
            <Title level={5}>参训人员标签</Title>
            {(Array.isArray(visualDraft) ? visualDraft : []).map((t, idx) => (
              <Space key={idx} style={{ width: '100%', marginBottom: 8 }}>
                <Input style={{ flex: 1 }} value={t} placeholder="请输入标签名称"
                  onChange={(e) => setVisualDraft(prev => prev.map((x, i) => i === idx ? e.target.value : x))} />
                <Button danger onClick={() => setVisualDraft(prev => prev.filter((_, i) => i !== idx))}>删除</Button>
              </Space>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => ([...(Array.isArray(prev) ? prev : []), '']))}>添加标签</Button>
          </div>
        );
      case 'implementation':
        return (
          <div>
            <Title level={5}>培训平台</Title>
            <Input
              value={visualDraft.platform}
              onChange={(e) => setVisualDraft(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="请输入培训平台"
              style={{ marginBottom: 16 }}
            />
            {renderStringList('培训方法', 'methods', '请输入方法')}
            {renderStringList('支持保障', 'support', '请输入保障项')}
          </div>
        );
      case 'assessment':
        return (
          <div>
            <Title level={5}>考核方式</Title>
            <Input
              value={visualDraft.method}
              onChange={(e) => setVisualDraft(prev => ({ ...prev, method: e.target.value }))}
              placeholder="请输入考核方式"
              style={{ marginBottom: 16 }}
            />
            <Space style={{ width: '100%', marginBottom: 8 }}>
              <Input
                style={{ width: 200 }}
                value={visualDraft.totalHoursTarget ?? ''}
                placeholder="总安排学时"
                onChange={(e) => setVisualDraft(prev => ({ ...prev, totalHoursTarget: e.target.value }))}
              />
              <Input
                style={{ width: 200 }}
                value={visualDraft.totalScoreTarget ?? ''}
                placeholder="总成绩目标（默认100分）"
                onChange={(e) => setVisualDraft(prev => ({ ...prev, totalScoreTarget: e.target.value }))}
              />
            </Space>
            <Title level={5}>考核组成</Title>
            {(visualDraft.components || []).map((comp, idx) => (
              <div key={idx} style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                <Space style={{ width: '100%', marginBottom: 8 }}>
                  <Input
                    style={{ flex: 1 }}
                    value={comp.name}
                    placeholder="名称"
                    onChange={(e) => setVisualDraft(prev => ({
                      ...prev,
                      components: prev.components.map((c, i) => i === idx ? { ...c, name: e.target.value } : c)
                    }))}
                  />
                  <Input
                    style={{ width: 120 }}
                    value={comp.weight}
                    placeholder="权重"
                    onChange={(e) => setVisualDraft(prev => ({
                      ...prev,
                      components: prev.components.map((c, i) => i === idx ? { ...c, weight: e.target.value } : c)
                    }))}
                  />
                </Space>
                <TextArea
                  rows={2}
                  value={comp.description}
                  placeholder="描述"
                  onChange={(e) => setVisualDraft(prev => ({
                    ...prev,
                    components: prev.components.map((c, i) => i === idx ? { ...c, description: e.target.value } : c)
                  }))}
                />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button danger size="small" onClick={() => setVisualDraft(prev => ({
                    ...prev,
                    components: prev.components.filter((_, i) => i !== idx)
                  }))}>删除</Button>
                </div>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => ({
              ...prev,
              components: [...(prev.components || []), { name: '', weight: '', description: '' }]
            }))}>添加组成</Button>

            {renderStringList('评价标准', 'standards', '请输入标准')}
          </div>
        );
      case 'guarantee':
        return (
          <div>
            {renderStringList('组织保障', 'organization', '请输入组织保障项')}
            {renderStringList('资源保障', 'resources', '请输入资源保障项')}
            {renderStringList('质量保障', 'quality', '请输入质量保障项')}
          </div>
        );
      case 'schedule':
        return (
          <div>
            <Title level={5}>培训进度安排</Title>
            {(visualDraft || []).map((row, idx) => (
              <div key={idx} style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                <Space style={{ width: '100%', marginBottom: 8 }}>
                  <Input style={{ width: 120 }} value={row.week} placeholder="周次"
                    onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, week: e.target.value } : r))} />
                  <Input style={{ flex: 1 }} value={row.content} placeholder="内容"
                    onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, content: e.target.value } : r))} />
                  <Input style={{ width: 160 }} value={row.type} placeholder="形式"
                    onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, type: e.target.value } : r))} />
                  {/* 考核方式文本（与模块 assessment 双向关联） */}
                  <Input
                    style={{ width: 160 }}
                    value={row.assessment || ''}
                    placeholder="考核方式"
                    onKeyDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, assessment: e.target.value } : r))}
                  />
                  <Input style={{ width: 120 }} value={row.hours} placeholder="学时"
                    onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, hours: e.target.value } : r))} />
                  <Button danger onClick={() => setVisualDraft(prev => prev.filter((_, i) => i !== idx))}>删除</Button>
                </Space>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => ([...prev, { week: '', content: '', type: '', assessment: '', hours: '' }]))}>添加一行</Button>
          </div>
        );
      case 'phases':
        // 如果正在编辑某个具体模块，仅显示模块编辑器
        if (editingModulePath) {
          return (
            <div>
              <Title level={5}>编辑模块</Title>
              <SingleModuleEditor
                mod={visualDraft}
                onChange={(next) => setVisualDraft(next)}
                moduleIndex={(editingModulePath?.moduleIdx ?? 0) + 1}
              />
            </div>
          );
        }
        return (
          <div>
            <Title level={5}>培训阶段与内容</Title>
            {(visualDraft || []).map((phase, pIdx) => (
              <div key={pIdx} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderLeft: '3px solid #91d5ff', borderRadius: 6, background: '#fff' }}>
                <Space style={{ width: '100%', marginBottom: 8 }}>
                  <Input style={{ flex: 1 }} value={phase.name} placeholder="阶段名称"
                    onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                    onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, name: e.target.value } : ph))} />
                </Space>
                <TextArea rows={2} value={phase.focus} placeholder="阶段重点"
                  onKeyDown={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()}
                  onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, focus: e.target.value } : ph))} />

                <Divider orientation="left" style={{ margin: '12px 0' }}>模块</Divider>
                <DndContext
                  sensors={sensorsNoKeyboard}
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (over && active.id !== over.id) {
                      const fromIndex = parseInt(String(active.id).split('-').pop(), 10);
                      const toIndex = parseInt(String(over.id).split('-').pop(), 10);
                      setVisualDraft(prev => prev.map((ph, i) => {
                        if (i !== pIdx) return ph;
                        const modules = [...(ph.modules || [])];
                        const [m] = modules.splice(fromIndex, 1);
                        modules.splice(toIndex, 0, m);
                        return { ...ph, modules };
                      }));
                    }
                  }}
                >
                  <SortableContext
                    items={(phase.modules || []).map((_, index) => `${pIdx}-module-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {(phase.modules || []).map((mod, mIdx) => {
                      const baseIndex = (visualDraft || []).slice(0, pIdx).reduce((acc, ph) => acc + ((ph.modules || []).length), 0);
                      const globalIndex = baseIndex + mIdx + 1;
                      return (
                        <SortableModuleCard
                          key={`${pIdx}-module-${mIdx}`}
                          id={`${pIdx}-module-${mIdx}`}
                          mod={mod}
                          pIdx={pIdx}
                          mIdx={mIdx}
                          globalIndex={globalIndex}
                          setVisualDraft={setVisualDraft}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: [...(ph.modules || []), { title: '', duration: '', content: [], format: '', assessment: '' }] } : ph))}>添加模块</Button>

                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button danger onClick={() => setVisualDraft(prev => prev.filter((_, i) => i !== pIdx))}>删除阶段</Button>
                </div>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => ([...prev, { name: '', focus: '', modules: [] }]))}>添加阶段</Button>
          </div>
        );
      default:
        return <Text type="secondary">暂未支持该部分的可视化编辑，请切换到 JSON 模式。</Text>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 头部操作栏：始终显示返回；在非隐藏模式下显示布局切换 */}
      <div style={{ padding: hideButtons ? '8px 16px' : '16px', borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="text">返回</Button>
            <Title level={4} style={{ margin: 0 }}>{plan.title}</Title>
          </div>
          {!hideButtons && (
            <Space>
              <Tooltip title="左栏视图">
                <Button 
                  type={layoutMode === 'left' ? 'primary' : 'text'}
                  icon={<LeftOutlined />} 
                  onClick={() => setLayoutMode('left')}
                />
              </Tooltip>
              <Tooltip title="双栏视图">
                <Button 
                  type={layoutMode === 'both' ? 'primary' : 'text'}
                  icon={<AppstoreOutlined />} 
                  onClick={() => setLayoutMode('both')}
                />
              </Tooltip>
              <Tooltip title="右栏视图">
                <Button 
                  type={layoutMode === 'right' ? 'primary' : 'text'}
                  icon={<RightOutlined />} 
                  onClick={() => setLayoutMode('right')}
                />
              </Tooltip>
            </Space>
          )}
        </div>
      </div>

      {/* 主要内容区域：单容器，避免右栏卸载 */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
        {/* 左侧原方案：根据布局模式显示/隐藏 */}
        <div
          style={{
            flex: layoutMode === 'both' ? `0 0 ${leftWidthPct}%` : (layoutMode === 'left' ? '1 1 auto' : '0 0 0%'),
            display: layoutMode === 'right' ? 'none' : 'block',
            padding: '24px',
            overflow: 'auto'
          }}
          ref={leftScrollRef}
        >
          <div style={{
            width: '100%',
            margin: 0,
            background: '#fff',
            minHeight: '100%',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <Affix target={() => leftScrollRef.current} offsetTop={12}>
              <div ref={dirPanelRef} style={{ marginLeft: 12 }}>
                <Popover
                  open={dirOpen}
                  onOpenChange={setDirOpen}
                  trigger="hover"
                  placement="rightTop"
                  getPopupContainer={() => leftScrollRef.current}
                  overlayStyle={{ width: 480 }}
                  content={(
                    <div style={{ maxHeight: 640, overflow: 'auto', paddingRight: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                        <Button
                          size="small"
                          type={dirEditingAll ? 'primary' : 'default'}
                          icon={<SettingOutlined />}
                          onClick={() => setDirEditingAll(prev => !prev)}
                        >{dirEditingAll ? '退出编辑' : '编辑目录'}</Button>
                      </div>
                      {/* 总学时/总成绩 汇总与编辑 */}
                      <div style={{ marginBottom: 8, padding: 8, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6 }}>
                        <div style={{ fontWeight: 500, marginBottom: 6 }}>方案总览</div>
                        {dirEditingAll ? (
                          <Space style={{ width: '100%' }} wrap>
                            <Text>总安排学时</Text>
                            <InputNumber
                              size="small"
                              style={{ width: 100 }}
                              min={0}
                              value={plan?.assessment?.totalHoursTarget}
                              placeholder="总安排学时"
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              onChange={(val) => setPlan(prev => ({
                                ...prev,
                                assessment: { ...(prev.assessment || {}), totalHoursTarget: val }
                              }))}
                            />
                            <Text type="secondary">已安排学时合计：{totals.arrangedHoursSum}</Text>
                          </Space>
                        ) : (
                          <Space direction="vertical" size={4} style={{ width: '100%' }}>
                            <Text>总安排学时：{totals.totalHoursTarget}</Text>
                            <Text type="secondary">已安排学时合计：{totals.arrangedHoursSum}</Text>
                          </Space>
                        )}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-overview')}>方案概述</Button>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-participantTags')}>参训人员（标签）</Button>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-phases')}>培训阶段与内容</Button>
                      </div>
                      {(plan.phases || []).map((ph, pIdx) => (
                        <div key={`dir-phase-${pIdx}`} style={{ marginBottom: 6 }}>
                          <div style={{ fontWeight: 500 }}>
                            <Button type="link" size="small" onClick={() => scrollToAnchor(`#phase-${pIdx}`)}>
                              {ph?.name || `阶段 ${pIdx + 1}`}
                            </Button>
                          </div>
                          {(ph.modules || []).map((m, mIdx) => (
                            <div key={`dir-phase-${pIdx}-module-${mIdx}`} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 12, marginTop: 4 }}>
                              <Button type="link" size="small" onClick={() => scrollToAnchor(`#phase-${pIdx}-module-${mIdx}`)}>
                                {m?.title || `模块 ${mIdx + 1}`}
                              </Button>
                              <>
                                {dirEditingAll ? (
                                  <Space size={4} align="center">
                                    <Text type="secondary" style={{ fontSize: 12 }}>安排学时</Text>
                                    <InputNumber
                                      size="small"
                                      style={{ width: 80 }}
                                      min={0}
                                      value={Number(m?.arrangedHours ?? m?.hoursTarget ?? 0)}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => e.stopPropagation()}
                                      onFocus={(e) => e.stopPropagation()}
                                      onChange={(val) => {
                                        const v = Number(val ?? 0);
                                        setPlan(prev => {
                                          const phases = Array.isArray(prev?.phases) ? prev.phases.map((ph, idx) => {
                                            if (idx !== pIdx) return ph;
                                            const mods = Array.isArray(ph.modules) ? ph.modules.map((mod, j) => (
                                              j === mIdx ? { ...mod, arrangedHours: v } : mod
                                            )) : [];
                                            return { ...ph, modules: mods };
                                          }) : [];
                                          return { ...prev, phases };
                                        });
                                      }}
                                    />
                                  </Space>
                                ) : (
                                  <Text type="secondary" style={{ fontSize: 12 }}>安排学时：{Number(m?.arrangedHours ?? m?.hoursTarget ?? 0)}</Text>
                                )}
                                {dirEditingAll ? (
                                  <Space size={4} align="center">
                                    <Text type="secondary" style={{ fontSize: 12 }}>权重(%)</Text>
                                    <InputNumber
                                      size="small"
                                      style={{ width: 80 }}
                                      min={0}
                                      max={100}
                                      value={Number(m?.weight ?? 0)}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => e.stopPropagation()}
                                      onFocus={(e) => e.stopPropagation()}
                                      onChange={(val) => {
                                        const v = Number(val ?? 0);
                                        setPlan(prev => {
                                          const phases = Array.isArray(prev?.phases) ? prev.phases.map((ph, idx) => {
                                            if (idx !== pIdx) return ph;
                                            const mods = Array.isArray(ph.modules) ? ph.modules.map((mod, j) => (
                                              j === mIdx ? { ...mod, weight: v } : mod
                                            )) : [];
                                            return { ...ph, modules: mods };
                                          }) : [];
                                          return { ...prev, phases };
                                        });
                                      }}
                                    />
                                  </Space>
                                ) : (
                                  <Text type="secondary" style={{ fontSize: 12 }}>｜权重：{Number(m?.weight ?? 0)}%</Text>
                                )}
                              </>
                            </div>
                          ))}
                        </div>
                      ))}
                      <div style={{ marginTop: 8 }}>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-schedule')}>培训进度安排</Button>
                      </div>
                      <div>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-implementation')}>实施保障</Button>
                      </div>
                      <div>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-assessment')}>考核与评价</Button>
                      </div>
                      <div>
                        <Button type="link" size="small" onClick={() => scrollToAnchor('#section-guarantee')}>保障措施</Button>
                      </div>
                    </div>
                  )}
                >
                  {readOnly ? null : (
                    <Button size="small" icon={<MenuOutlined />} onClick={() => setDirOpen(true)}>目录</Button>
                  )}
                </Popover>
              </div>
            </Affix>



            {/* 方案概述 */}
            <div id="section-overview">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="overview"
                  onVisualEdit={() => openInlineVisualEditor('overview')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('overview'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="overview"
                renderContent={() => <TrainingOverview overview={plan.overview} />}
              />
            </div>

            {/* 参训人员（标签） */}
            <div id="section-participantTags">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="participantTags"
                  onVisualEdit={() => openInlineVisualEditor('participantTags')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('participantTags'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="participantTags"
                renderContent={() => <TagsSection tags={plan.participantTags || []} />}
              />
            </div>

            {/* 培训总览（旧位置，已隐藏） */}
            <div hidden style={{ marginBottom: 16, padding: 16, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '16px' }}>培训总览</div>
              {editMode === 'visual' ? (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <Space size={12} align="center">
                      <Text strong>总安排学时：</Text>
                      <InputNumber
                        size="small"
                        style={{ width: 100 }}
                        min={0}
                        value={plan?.assessment?.totalHoursTarget ?? totals.arrangedHoursSum}
                        placeholder="总学时"
                        onChange={(val) => setPlan(prev => ({
                          ...prev,
                          assessment: { ...(prev.assessment || {}), totalHoursTarget: val }
                        }))}
                      />
                      <Text type="secondary">（已安排学时合计：{totals.arrangedHoursSum}）</Text>
                    </Space>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>总学时目标：</Text>
                    <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                      {plan?.assessment?.totalHoursTarget ?? totals.arrangedHoursSum}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      （模块学时合计：{totals.arrangedHoursSum}）
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {/* 培训阶段与内容 */}
            <div id="section-phases">
              {/* 考核总体要求（位于标题和第一阶段之间） */}
              <div style={{ marginBottom: 16 }}>
                <Title level={3} style={{ marginBottom: 8 }}>考核总体要求</Title>
                {readOnly ? null : (
                  <SectionHeader
                    sectionKey="assessmentOverview"
                    onVisualEdit={() => openInlineVisualEditor('assessmentOverview')}
                    onJsonEdit={() => { setEditMode('json'); openSectionEditor('assessmentOverview'); }}
                  />
                )}
                <Card size="small">
                  <InlineEditableSection
                    sectionKey="assessmentOverview"
                    renderContent={() => (
                      <div>
                         <div style={{ marginBottom: 8 }}>
                          <Text strong>总安排学时：</Text>
                          <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                            {plan?.assessment?.totalHoursTarget ?? totals.arrangedHoursSum}
                          </Text>
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            （已安排学时合计：{totals.arrangedHoursSum}）
                          </Text>
                        </div>
                      </div>
                    )}
                  />
                </Card>
              </div>
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="phases"
                  onVisualEdit={() => openInlineVisualEditor('phases')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('phases'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="phases"
                renderContent={() => (
                  <TrainingPhases 
                    phases={plan.phases}
                    onEditModule={readOnly ? undefined : (pIdx, mIdx) => openInlineVisualEditor('phases', { phaseIdx: pIdx, moduleIdx: mIdx })}
                    onJsonEditModule={readOnly ? undefined : (pIdx, mIdx) => { setEditMode('json'); openSectionEditor('phases', { phaseIdx: pIdx, moduleIdx: mIdx }); }}
                    readOnly={readOnly}
                  />
                )}
              />
            </div>


            {/* 详细时间安排 */}
            <div id="section-schedule">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="schedule"
                  onVisualEdit={() => openInlineVisualEditor('schedule')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('schedule'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="schedule"
                renderContent={() => (
                  <TrainingSchedule
                    schedule={scheduleWithWeights}
                    showWeight={true}
                    editable={false}
                    onChangeModuleWeight={handleChangeModuleWeight}
                  />
                )}
              />
            </div>

            {/* 实施保障 */}
            <div id="section-implementation">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="implementation"
                  onVisualEdit={() => openInlineVisualEditor('implementation')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('implementation'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="implementation"
                renderContent={() => <ImplementationSection implementation={plan.implementation} />}
              />
            </div>

            {/* 考核与评价 */}
            <div id="section-assessment">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="assessment"
                  onVisualEdit={() => openInlineVisualEditor('assessment')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('assessment'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="assessment"
                renderContent={() => <AssessmentSection assessment={plan.assessment} />}
              />
            </div>

            {/* 保障措施 */}
            <div id="section-guarantee">
              {readOnly ? null : (
                <SectionHeader
                  sectionKey="guarantee"
                  onVisualEdit={() => openInlineVisualEditor('guarantee')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('guarantee'); }}
                />
              )}
              <InlineEditableSection
                sectionKey="guarantee"
                renderContent={() => <GuaranteeSection guarantee={plan.guarantee} />}
              />
            </div>
          </div>
        </div>

        {/* 分隔条（仅双栏显示，可拖拽） */}
        {layoutMode === 'both' && (
          <div
            onMouseDown={startResize}
            style={{
              width: 6,
              cursor: 'col-resize',
              background: isResizing ? '#69c0ff' : '#e8e8e8',
              borderLeft: '1px solid #f0f0f0',
              borderRight: '1px solid #f0f0f0'
            }}
          />
        )}

        {/* 右侧实施方案：始终保留实例，仅根据布局模式调整占位 */}
        <div
          style={{
            flex: layoutMode === 'both' ? `0 0 ${100 - leftWidthPct}%` : (layoutMode === 'right' ? '1 1 auto' : '0 0 0%'),
            display: layoutMode === 'left' ? 'none' : 'block',
            padding: '24px',
            overflow: 'auto',
            borderLeft: layoutMode === 'both' ? '1px solid #f0f0f0' : 'none'
          }}
        >
          <div style={{
            width: '100%',
            margin: 0,
            background: '#fff',
            minHeight: '100%',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <ImplementationPlan plan={plan} externalTagSeeds={leftTags} initialSelectedTags={leftTags} />
          </div>
        </div>
      </div>

        {/* 部分编辑器（JSON）Modal */}
         <Modal
           title={editingSectionKey ? `编辑：${editingSectionKey}` : '编辑部分'}
           open={sectionEditorVisible}
           onOk={saveSectionEdit}
           onCancel={() => setSectionEditorVisible(false)}
           width={900}
           okText="保存"
           cancelText="取消"
           okButtonProps={{ icon: <SaveOutlined /> }}
           bodyStyle={{ padding: '16px' }}
         >
           <div style={{ marginBottom: 8 }}>
             <Text type="secondary">直接以 JSON 格式编辑该部分内容，保存后左侧视图将立即更新。</Text>
           </div>
           <TextArea
             value={sectionDraft}
             onChange={(e) => setSectionDraft(e.target.value)}
             rows={18}
             placeholder={"请粘贴或编辑 JSON 内容"}
           />
         </Modal>
 
      </div>
    );
};

export default TrainingPlanViewer;