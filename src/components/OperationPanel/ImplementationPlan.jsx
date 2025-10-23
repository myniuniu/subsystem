import React, { useMemo, useState } from 'react';
import { Typography, Button, Tag, Tooltip, Progress, Modal, Card, Form, Input, InputNumber, Switch, Select, Table, Avatar, Space, Divider, Tabs, Row, Col, Empty } from 'antd';
import { DownOutlined, RightOutlined, UserAddOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { createMockOrganizationPersonnelTree } from '../../data/organizationPersonnelMockData';
import { TreeNodeType } from '../../types/organizationPersonnelTree';


const { Text } = Typography;
const { CheckableTag } = Tag;

// 右侧"实施方案"：包含参训人员管理和培训模块配置
const ImplementationPlan = ({ plan, externalTagSeeds = [], initialSelectedTags = [] }) => {
  const schedule = Array.isArray(plan?.schedule) ? plan.schedule : [];

  // 参训人员状态管理
  const [participants, setParticipants] = useState([
    { id: 1, name: '张三', department: '技术部', position: '前端工程师', email: 'zhangsan@company.com', status: '已确认' },
    { id: 2, name: '李四', department: '产品部', position: '产品经理', email: 'lisi@company.com', status: '待确认' },
    { id: 3, name: '王五', department: '设计部', position: 'UI设计师', email: 'wangwu@company.com', status: '已确认' }
  ]);
  const [participantModalVisible, setParticipantModalVisible] = useState(false);

  // 训练阶段定义：优先使用左侧方案的模块(plan.phases)，回退到 schedule
  const trainingPhases = useMemo(() => {
    // 若 schedule 有值，直接使用
    if (Array.isArray(schedule) && schedule.length > 0) {
      return schedule.map((item, idx) => ({
        id: idx + 1,
        week: `第${idx + 1}阶段`,
        content: item.content,
        type: item.type,
        hours: item.hours
      }));
    }
    // 否则从 plan.phases 提取 modules 作为阶段来源
    const phases = Array.isArray(plan?.phases) ? plan.phases : [];
    const modules = phases.flatMap(ph => Array.isArray(ph.modules) ? ph.modules : []);
    return modules.map((m, idx) => {
      const title = m.title || m.module || `模块${idx + 1}`;
      const type = m.format || m.type || '';
      const hours = (() => {
        const d = String(m.duration || '').trim();
        if (/学时/.test(d)) {
          const match = d.match(/(\d+)/);
          return match ? Number(match[1]) : 0;
        }
        if (/周/.test(d)) {
          // 每周默认6学时作为显示用（可按需调整）
          return 6;
        }
        return Number(m.hours || 6);
      })();
      return { id: idx + 1, week: `第${idx + 1}阶段`, content: title, type, hours };
    });
  }, [schedule, plan]);

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

  // 人员标签与圈选：引入组织人员树并抽取所有人员与标签
  const personnelManager = useMemo(() => createMockOrganizationPersonnelTree(), []);
  const allPersonnelNodes = useMemo(() => personnelManager.getNodesByType(TreeNodeType.PERSONNEL), [personnelManager]);
  const allTags = useMemo(() => {
    const acc = [];
    allPersonnelNodes.forEach(n => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach(t => acc.push(t));
      }
    });
    return Array.from(new Set(acc));
  }, [allPersonnelNodes]);
  // 默认标签种子：当数据源无标签时用于展示；同时与已有标签合并增强选择
  const defaultTagSeeds = useMemo(() => (
    [
      '技术部','产品部','设计部','教学部门',
      '数学','物理','化学','生物','英语','地理','历史',
      '高中','函数','导数','实验','电磁感应',
      '新入职','骨干','待确认','已确认'
    ]
  ), []);
  const displayTags = useMemo(() => {
    const set = new Set(allTags);
    // 合并默认种子，保证有一批可选标签
    defaultTagSeeds.forEach(t => set.add(t));
    // 合并外部标签（来自左侧参训人员的标签）
    if (Array.isArray(externalTagSeeds)) {
      externalTagSeeds.forEach(t => set.add(t));
    }
    return Array.from(set);
  }, [allTags, defaultTagSeeds, externalTagSeeds]);
  const [selectedTags, setSelectedTags] = useState([]);
  // 同步初始选中标签（来自左侧）
  React.useEffect(() => {
    if (Array.isArray(initialSelectedTags) && initialSelectedTags.length > 0) {
      setSelectedTags(initialSelectedTags);
    }
  }, [initialSelectedTags]);
  const toggleTag = (tag) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };
  // 标签筛选查询
  const [tagQuery, setTagQuery] = useState('');
  const filteredDisplayTags = useMemo(() => {
    if (!tagQuery) return displayTags;
    const q = tagQuery.trim().toLowerCase();
    return displayTags.filter(t => String(t).toLowerCase().includes(q));
  }, [displayTags, tagQuery]);
  const [excludedPersonnelIds, setExcludedPersonnelIds] = useState(new Set());
  const matchedPersonnel = useMemo(() => {
    if (!selectedTags.length) return [];
    return allPersonnelNodes
      .filter(n => Array.isArray(n.tags) && selectedTags.some(t => n.tags.includes(t)))
      .filter(n => !excludedPersonnelIds.has(n.personnelId));
  }, [allPersonnelNodes, selectedTags, excludedPersonnelIds]);

  const excludeNode = (node) => {
    setExcludedPersonnelIds(prev => {
      const next = new Set(prev);
      next.add(node.personnelId);
      return next;
    });
  };
  const clearExcluded = () => setExcludedPersonnelIds(new Set());

  // 通过匹配的人员节点加入参训列表（去重按 personnelId）
  const addParticipantFromNode = (node) => {
    setParticipants(prev => {
      if (prev.some(p => p.sourceId === node.personnelId)) return prev;
      const newItem = {
        id: Date.now(),
        sourceId: node.personnelId,
        name: node.name,
        department: node.department || '',
        position: node.position || '',
        email: node.email || '',
        status: '已确认'
      };
      return [...prev, newItem];
    });
  };

  // 匹配人员表格列
  const matchedColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>{text?.charAt(0)}</Avatar>
          {text}
        </Space>
      )
    },
    { title: '部门', dataIndex: 'department', key: 'department' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    {
      title: '标签',
      key: 'tags',
      render: (_, record) => (
        <Space size={4} wrap>
          {(record.tags || []).map((t) => (
            <Tag key={`${record.id}-${t}`} color="blue">{t}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            size="small"
            onClick={() => addParticipantFromNode(record)}
            disabled={participants.some(p => p.sourceId === record.personnelId)}
          >
            加入参训
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => excludeNode(record)}
          >
            剔除
          </Button>
        </Space>
      )
    }
  ];

  // 参训人员表格列定义
  const participantColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>{String(text || '').charAt(0)}</Avatar>
          {text}
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === '已确认' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => setParticipants(prev => prev.filter(p => p.id !== record.id))}
        >
          移除
        </Button>
      ),
    },
  ];

  // 合并“匹配人员”和“当前参训人员”到一个表
  const combinedData = useMemo(() => {
    const matched = (matchedPersonnel || []).map(n => ({
      __type: 'matched',
      key: `m-${n.personnelId}`,
      personnelId: n.personnelId,
      name: n.name,
      department: n.department || '',
      position: n.position || '',
      email: n.email || '',
      tags: Array.isArray(n.tags) ? n.tags : [],
      status: participants.some(p => p.sourceId === n.personnelId) ? '已加入' : '待加入'
    }));
    const joined = (participants || []).map(p => ({
      __type: 'participant',
      key: `p-${p.id}`,
      id: p.id,
      sourceId: p.sourceId,
      name: p.name,
      department: p.department || '',
      position: p.position || '',
      email: p.email || '',
      tags: [],
      status: p.status || '已确认'
    }));
    return [...matched, ...joined];
  }, [matchedPersonnel, participants]);

  const combinedColumns = [
    {
      title: '人员',
      key: 'person',
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Avatar size="small" style={{ backgroundColor: record.__type === 'participant' ? '#52c41a' : '#1890ff' }}>{String(record.name || '').charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            {(record.department || record.position) && (
              <div style={{ fontSize: 12, color: '#888' }}>
                {[record.department, record.position].filter(Boolean).join(' · ')}
              </div>
            )}
            {record.email && (
              <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
            )}
            {record.__type === 'matched' && (record.tags || []).length > 0 && (
              <div style={{ marginTop: 4 }}>
                <Space size={4} wrap>
                  {(record.tags || []).map((t) => (
                    <Tag key={`${record.key}-tag-${t}`} color="blue">{t}</Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      key: '__type',
      width: 80,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (_, record) => (
        <Tag color={record.__type === 'participant' ? 'green' : 'blue'}>
          {record.__type === 'participant' ? '参训' : '匹配'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (status) => <Tag color={status === '已确认' || status === '已加入' ? 'green' : 'orange'}>{status}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      onCell: () => ({ style: { padding: '6px 8px' } }),
      render: (_, record) => (
        record.__type === 'matched' ? (
          <Space size={8}>
            <Button type="link" size="small" onClick={() => addParticipantFromNode(record)} disabled={participants.some(p => p.sourceId === record.personnelId)}>加入参训</Button>
            <Button type="link" size="small" danger onClick={() => excludeNode(record)}>剔除</Button>
          </Space>
        ) : (
          <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => setParticipants(prev => prev.filter(p => p.id !== record.id))}>移除</Button>
        )
      )
    }
  ];

  // 移除参训人员
  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <Tabs
        defaultActiveKey="participants"
        items={[
          {
            key: 'participants',
            label: '参训人员',
            children: (
              <>
                <Row gutter={12} wrap={false} style={{ alignItems: 'stretch' }}>
                  <Col span={7} style={{ display: 'flex' }}>
                    <Card
                      title={(
                        <Space>
                          <span>🔖</span>
                          <span>标签筛选</span>
                        </Space>
                      )}
                      style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 280 }}
                      bodyStyle={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <Input
                          size="small"
                          allowClear
                          placeholder="筛选标签（可输入关键字）"
                          value={tagQuery}
                          onChange={(e) => setTagQuery(e.target.value)}
                          style={{ width: 220 }}
                        />
                        <Space>
                          <Button size="small" onClick={() => setSelectedTags([])}>清空选择</Button>
                          <Button size="small" danger onClick={clearExcluded}>清空剔除</Button>
                        </Space>
                      </div>
                      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 8, padding: '8px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                        <Space size={6} wrap>
                          {filteredDisplayTags.length ? (
                            CheckableTag ? (
                              filteredDisplayTags.map((tag) => (
                                <CheckableTag
                                  key={`tag-${tag}`}
                                  checked={selectedTags.includes(tag)}
                                  onChange={(checked) => {
                                    setSelectedTags((prev) => {
                                      if (checked) return [...prev, tag];
                                      return prev.filter((t) => t !== tag);
                                    });
                                  }}
                                >
                                  {tag}
                                </CheckableTag>
                              ))
                            ) : (
                              filteredDisplayTags.map((tag) => (
                                <Tag
                                  key={`tag-${tag}`}
                                  color={selectedTags.includes(tag) ? 'processing' : 'default'}
                                  onClick={() => toggleTag(tag)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {tag}
                                </Tag>
                              ))
                            )
                          ) : (
                            <Text type="secondary" style={{ fontSize: 12 }}>未找到匹配标签</Text>
                          )}
                        </Space>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #eef2f7', marginTop: 10 }}>
                        <Tag color="geekblue">已选 {selectedTags.length} 个标签</Tag>
                        <Tag color="blue">命中 {matchedPersonnel.length} 人</Tag>
                        <Tag color="red">已剔除 {excludedPersonnelIds.size} 人</Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col span={17} style={{ display: 'flex' }}>
                    <Card
                      title={(
                        <Space>
                          <span>📋</span>
                          <span>人员列表（匹配 + 参训）</span>
                          <Tag color="blue">匹配 {matchedPersonnel.length} 人</Tag>
                          <Tag color="green">参训 {participants.length} 人</Tag>
                        </Space>
                      )}
                      style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', marginLeft: 6 }}
                      bodyStyle={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
                    >
                      <div style={{ flex: 1, minHeight: 0 }}>
                        <Table
                          size="small"
                          bordered={false}
                          tableLayout="fixed"
                          style={{ margin: 0 }}
                          dataSource={combinedData}
                          columns={combinedColumns}
                          rowKey="key"
                          pagination={false}
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
            )
          },
            {
              key: 'modules',
              label: '模块配置',
              children: (
                <>
                  {/* 培训模块配置区域 */}
                  <Card 
                    title={
                      <Space>
                        <span>📦</span>
                        <span>培训模块配置</span>
                      </Space>
                    }
                    style={{ marginBottom: 16 }}
                    bodyStyle={{ padding: '12px' }}
                  >
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
                    {(Array.isArray(phaseMaterials) && phaseMaterials.length > 0) ? (
                      phaseMaterials.map(phase => {
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
                                    模块 {phase.id}｜{phase.content}
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
                    })
                    ) : (
                      <Empty description="暂无模块配置数据（请先在计划中添加日程）" />
                    )}
                  </Card>
                </>
              )
            }
          ]}
        />

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

        {/* 添加参训人员的Modal */}
        <Modal
          title="添加参训人员"
          open={participantModalVisible}
          onCancel={() => setParticipantModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setParticipantModalVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => setParticipantModalVisible(false)}>
              确定
            </Button>
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="姓名" required>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="部门" required>
              <Input placeholder="请输入部门" />
            </Form.Item>
            <Form.Item label="职位" required>
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item label="邮箱" required>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default ImplementationPlan;