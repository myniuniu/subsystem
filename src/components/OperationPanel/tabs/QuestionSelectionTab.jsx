import React, { useState, useMemo } from 'react';
import { Card, Button, Tabs, Table, Tag, Space, Switch, Input, Select, Form, InputNumber, Divider, Empty, Tooltip, Modal, Row, Col, Typography, Checkbox, message, Upload } from 'antd';
import { PlusOutlined, SearchOutlined, RobotOutlined, BookOutlined, SettingOutlined, EyeOutlined, DeleteOutlined, ImportOutlined, CloudSyncOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

// 模拟试题数据（增加来源集合ID，便于基于范围过滤）
const MOCK_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    subject: '数学',
    difficulty: 'easy',
    content: '下列哪个数是质数？',
    options: ['A. 4', 'B. 6', 'C. 7', 'D. 9'],
    answer: 'C',
    score: 2,
    tags: ['数论', '基础概念'],
    source: '资料库',
    collectionId: 'rc-technology_training-2'
  },
  {
    id: 'q2',
    type: 'multiple',
    subject: '语文',
    difficulty: 'medium',
    content: '下列哪些是唐代诗人？',
    options: ['A. 李白', 'B. 杜甫', 'C. 苏轼', 'D. 王维'],
    answer: 'A,B,D',
    score: 3,
    tags: ['古代文学', '诗人'],
    source: '资料库',
    collectionId: 'rc-teaching_resources-1'
  },
  {
    id: 'q3',
    type: 'judge',
    subject: '物理',
    difficulty: 'hard',
    content: '光在真空中的传播速度是恒定的。',
    options: ['A. 正确', 'B. 错误'],
    answer: 'A',
    score: 2,
    tags: ['光学', '基本定律'],
    source: '资料库',
    collectionId: 'rc-technology_training-2'
  },
  {
    id: 'q4',
    type: 'essay',
    subject: '历史',
    difficulty: 'medium',
    content: '简述明朝建立的历史背景。',
    options: [],
    answer: '参考答案：元朝末年政治腐败，民不聊生...',
    score: 10,
    tags: ['明朝', '历史背景'],
    source: '资料库',
    collectionId: 'rc-teaching_resources-1'
  }
];

// AI出题规则配置
const AI_QUESTION_RULES = {
  subjects: ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'],
  types: [
    { value: 'single', label: '单选题' },
    { value: 'multiple', label: '多选题' },
    { value: 'judge', label: '判断题' },
    { value: 'essay', label: '简答题' }
  ],
  difficulties: [
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' }
  ]
};

const LIBRARY_CATEGORY_NAMES = {
  teaching_resources: '教学资源库',
  technology_training: '技术培训资源库',
  family_education: '家庭教育资源库',
  school_management: '学校管理资源库',
  mental_health: '心理健康资源库',
};

const parseCollectionCategory = (id) => {
  try {
    const m = String(id || '').match(/^rc-(.+)-\d+$/);
    return m ? m[1] : '';
  } catch {
    return '';
  }
};

const QuestionSelectionTab = ({ draft, updateDraft, configModal, formatConfigs, phaseMaterials, getDefaultConfig }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedQuestions, setSelectedQuestions] = useState((draft?.questions?.selected) || []);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [aiRulesVisible, setAiRulesVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [importTabKey, setImportTabKey] = useState('excel');
  const [excelFileList, setExcelFileList] = useState([]);
  const [importSelection, setImportSelection] = useState([]);
  const [aiRules, setAiRules] = useState(draft?.questions?.aiRules || {
    subject: '',
    totalCount: 20,
    distribution: {
      single: { count: 10, score: 2 },
      multiple: { count: 5, score: 3 },
      judge: { count: 3, score: 2 },
      essay: { count: 2, score: 10 }
    },
    difficulty: {
      easy: 30,
      medium: 50,
      hard: 20
    },
    contentSource: 'module_videos', // 基于模块点播课内容
    keywords: ''
  });
  

  // 当前阶段与点播课集合
  const phaseObj = phaseMaterials?.find(p => p.id === configModal?.phaseId) || {};
  const phaseCfg = (formatConfigs?.[configModal?.phaseId] || {});
  const baseVideos = phaseCfg.videos || getDefaultConfig(phaseObj, 'videos');
  const defaultDatasetIds = Array.isArray(baseVideos.selectedCollections) ? baseVideos.selectedCollections : [];

  const [scopeDatasetIds, setScopeDatasetIds] = useState(draft?.questions?.scope?.datasetIds || defaultDatasetIds);

  // 基于关键词/学科/难度/范围过滤
  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter(q => {
      const matchKeyword = !searchKeyword || q.content.includes(searchKeyword) || (q.tags || []).some(tag => tag.includes(searchKeyword));
      const matchSubject = !filterSubject || q.subject === filterSubject;
      const matchDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
      const inScope = !scopeDatasetIds || scopeDatasetIds.length === 0 || (scopeDatasetIds.includes(q.collectionId));
      return matchKeyword && matchSubject && matchDifficulty && inScope;
    });
  }, [searchKeyword, filterSubject, filterDifficulty, scopeDatasetIds]);

  // 将已选但不在模拟库中的题（例如AI生成题）也加入可见列表，并应用相同过滤
  const extraQuestions = useMemo(() => {
    const base = selectedQuestions.filter(q => !MOCK_QUESTIONS.some(m => m.id === q.id));
    return base.filter(q => {
      const matchKeyword = !searchKeyword || q.content.includes(searchKeyword) || (q.tags || []).some(tag => tag.includes(searchKeyword));
      const matchSubject = !filterSubject || q.subject === filterSubject;
      const matchDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
      const inScope = !scopeDatasetIds || scopeDatasetIds.length === 0 || (scopeDatasetIds.includes(q.collectionId));
      return matchKeyword && matchSubject && matchDifficulty && inScope;
    });
  }, [selectedQuestions, searchKeyword, filterSubject, filterDifficulty, scopeDatasetIds]);

  const visibleQuestions = useMemo(() => {
    const ids = new Set();
    const merged = [...filteredQuestions, ...extraQuestions].filter(q => {
      if (ids.has(q.id)) return false;
      ids.add(q.id);
      return true;
    });
    return merged;
  }, [filteredQuestions, extraQuestions]);

  // 处理试题选择
  const handleQuestionSelect = (question, selected) => {
    const prevQuestions = draft?.questions || {};
    let newSelected;
    if (selected) {
      newSelected = [...selectedQuestions, question];
    } else {
      newSelected = selectedQuestions.filter(q => q.id !== question.id);
    }
    setSelectedQuestions(newSelected);
    updateDraft('questions', { ...prevQuestions, selected: newSelected });
  };

  // 批量选择
  const handleBatchSelect = (questions, selected) => {
    const prevQuestions = draft?.questions || {};
    let newSelected = [...selectedQuestions];
    if (selected) {
      questions.forEach(q => {
        if (!newSelected.find(sq => sq.id === q.id)) {
          newSelected.push(q);
        }
      });
    } else {
      const questionIds = questions.map(q => q.id);
      newSelected = newSelected.filter(q => !questionIds.includes(q.id));
    }
    setSelectedQuestions(newSelected);
    updateDraft('questions', { ...prevQuestions, selected: newSelected });
  };

  // 保存 AI 出题规则并生成试题
  const handleAiRulesSave = () => {
    const prevQuestions = draft?.questions || {};
    const generated = generateAiQuestions();
    const merged = [...selectedQuestions, ...generated];
    updateDraft('questions', { ...prevQuestions, aiRules, selected: merged });
    setSelectedQuestions(merged);
    setAiRulesVisible(false);
    message.success(`已生成 ${generated.length} 道试题（每种类型10道），并加入已选`);
  };

  // 新增：同步AI生成试题为PDF到资料库
  const formatDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth()+1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const handleSyncToLibrary = () => {
    const aiQuestions = (selectedQuestions || []).filter(q => q.source === 'AI');
    if (!aiQuestions.length) {
      message.warning('暂无AI生成试题可同步');
      return;
    }
    // 按资料集分组生成PDF
    const byCollection = aiQuestions.reduce((map, q) => {
      const key = q.collectionId || 'unknown';
      if (!map[key]) map[key] = [];
      map[key].push(q);
      return map;
    }, {});
    const subject = aiRules.subject || '综合';
    Object.entries(byCollection).forEach(([collectionId, qs]) => {
      const lines = qs.map((q, idx) => {
        const opts = (q.options || []).join('\n');
        return `【${idx+1}】${q.content}\n${opts ? opts + '\n' : ''}答案：${q.answer || ''}\n分值：${q.score || ''}`;
      });
      const content = `AI出题 · 学科：${subject}\n日期：${formatDate()}\n题量：${qs.length}\n\n` + lines.join('\n\n');
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const item = {
        id: `ai-pdf-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        title: `AI出题（${subject}）-${formatDate()}`,
        type: 'pdf',
        drive: 'org',
        size: 'N/A',
        lastModified: formatDate(),
        tags: ['试题','AI生成'],
        url
      };
      window.dispatchEvent(new CustomEvent('aiQuestionSync', { detail: { collectionId, item } }));
    });
    message.success('已同步AI试题为PDF到资料库对应资料集');
  };

  // 依据难度权重随机选择难度
  const pickDifficultyByWeight = () => {
    const d = aiRules.difficulty || {};
    const keys = ['easy', 'medium', 'hard'];
    const weights = keys.map(k => d[k] || 0);
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    const r = Math.random() * sum;
    let acc = 0;
    for (let i = 0; i < keys.length; i++) {
      acc += weights[i];
      if (r <= acc) return keys[i];
    }
    return 'medium';
  };

  // 生成每种题型10道AI试题
  const generateAiQuestions = () => {
    const types = ['single', 'multiple', 'judge', 'essay'];
    const perType = 10;
    const idBase = Date.now();
    const subject = aiRules.subject || '综合';
    const firstCollection = (scopeDatasetIds && scopeDatasetIds[0]) || '';
    const defaultScores = { single: 2, multiple: 3, judge: 2, essay: 10 };
    const kwTags = aiRules.keywords ? aiRules.keywords.split(/[，,\s]+/).filter(Boolean).map(k => `kw:${k}`) : [];

    const res = [];
    types.forEach(type => {
      for (let i = 1; i <= perType; i++) {
        const id = `ai-${type}-${idBase}-${i}`;
        const difficulty = pickDifficultyByWeight();
        const score = aiRules.distribution?.[type]?.score || defaultScores[type];
        let options = [];
        let answer = '';
        let content = '';
        switch (type) {
          case 'single':
            options = ['A. 选项一', 'B. 选项二', 'C. 选项三', 'D. 选项四'];
            answer = 'A';
            content = `${subject}·单选题 ${i}：依据范围资料集生成的练习题`;
            break;
          case 'multiple':
            options = ['A. 选项一', 'B. 选项二', 'C. 选项三', 'D. 选项四', 'E. 选项五'];
            answer = 'A,B';
            content = `${subject}·多选题 ${i}：结合关键词的综合题`;
            break;
          case 'judge':
            options = ['A. 正确', 'B. 错误'];
            answer = 'A';
            content = `${subject}·判断题 ${i}：请判断描述是否正确`;
            break;
          case 'essay':
            options = [];
            answer = '参考答案：围绕所学内容进行作答';
            content = `${subject}·简答题 ${i}：简述相关概念或原理`;
            break;
          default:
            break;
        }
        res.push({
          id,
          type,
          subject,
          difficulty,
          content,
          options,
          answer,
          score,
          tags: ['AI生成', subject, difficulty, ...kwTags],
          source: 'AI',
          collectionId: firstCollection
        });
      }
    });
    return res;
  };

  // 点击开始AI出题
  const handleStartAiGenerate = () => {
    const prevQuestions = draft?.questions || {};
    const generated = generateAiQuestions();
    const merged = [...selectedQuestions, ...generated];
    setSelectedQuestions(merged);
    updateDraft('questions', { ...prevQuestions, selected: merged });
    message.success(`已生成 ${generated.length} 道试题（每种类型10道），并加入已选`);
  };

  // 从Excel模拟导入（后续可接入sheetjs解析）
  const handleImportExcelSimulate = () => {
    const prev = draft?.questions || {};
    const baseId = `excel-${Date.now()}`;
    const samples = [
      { id: `${baseId}-1`, type: 'single', subject: '综合', difficulty: 'easy', content: 'Excel题目示例1', options: ['A', 'B', 'C', 'D'], answer: 'A', score: 2, tags: ['Excel'], source: 'Excel', collectionId: '' },
      { id: `${baseId}-2`, type: 'judge', subject: '综合', difficulty: 'medium', content: 'Excel题目示例2', options: ['正确', '错误'], answer: '正确', score: 2, tags: ['Excel'], source: 'Excel', collectionId: '' }
    ];
    const merged = [...selectedQuestions, ...samples];
    setSelectedQuestions(merged);
    updateDraft('questions', { ...prev, selected: merged });
    setImportVisible(false);
    message.success(`已从Excel导入 ${samples.length} 道试题（示例）`);
  };

  // 从试题库导入
  const handleImportFromBank = () => {
    const prev = draft?.questions || {};
    const bankSelected = MOCK_QUESTIONS.filter(q => importSelection.includes(q.id));
    const merged = [...selectedQuestions, ...bankSelected.filter(q => !selectedQuestions.some(s => s.id === q.id))];
    setSelectedQuestions(merged);
    updateDraft('questions', { ...prev, selected: merged });
    setImportVisible(false);
    message.success(`已从试题库导入 ${bankSelected.length} 道试题`);
  };

  // 保存考试范围
  const handleScopeSave = (ids) => {
    const prevQuestions = draft?.questions || {};
    const scope = { phaseId: configModal?.phaseId, format: 'videos', datasetIds: ids };
    setScopeDatasetIds(ids);
    updateDraft('questions', { ...prevQuestions, scope });
  };

  const handleRemoveSelected = (qid) => {
    const prev = draft?.questions || {};
    const newSelected = selectedQuestions.filter(q => q.id !== qid);
    setSelectedQuestions(newSelected);
    updateDraft('questions', { ...prev, selected: newSelected });
    message.success('已移除该试题');
  };

  // 试题类型标签颜色
  const getTypeColor = (type) => {
    const colors = { single: 'blue', multiple: 'green', judge: 'orange', essay: 'purple' };
    return colors[type] || 'default';
  };
  // 难度标签颜色
  const getDifficultyColor = (difficulty) => {
    const colors = { easy: 'green', medium: 'orange', hard: 'red' };
    return colors[difficulty] || 'default';
  };

  // 考试范围卡片：显示当前模块与资料集清单
  const scopeItems = (defaultDatasetIds || []).map(id => {
    const cat = parseCollectionCategory(id);
    const catName = LIBRARY_CATEGORY_NAMES[cat] || '资料集合';
    const titleByCat = {
      teaching_resources: '教学资源精选',
      technology_training: '技术培训精选',
      family_education: '家庭教育精选',
      school_management: '学校管理精选',
      mental_health: '心理健康研修',
    };
    return { id, category: cat, categoryName: catName, title: titleByCat[cat] || '资料集合' };
  });

  // 其他模块的资料集清单（不包含当前模块，且去重）
  const otherScopeItems = useMemo(() => {
    const list = [];
    (phaseMaterials || []).filter(p => p.id !== configModal?.phaseId).forEach(p => {
      const cfg = (formatConfigs?.[p.id] || {});
      const v = cfg.videos || getDefaultConfig(p, 'videos');
      const ids = Array.isArray(v.selectedCollections) ? v.selectedCollections : [];
      ids.forEach(id => {
        if (!defaultDatasetIds.includes(id)) {
          const cat = parseCollectionCategory(id);
          const catName = LIBRARY_CATEGORY_NAMES[cat] || '资料集合';
          const titleByCat = {
            teaching_resources: '教学资源精选',
            technology_training: '技术培训精选',
            family_education: '家庭教育精选',
            school_management: '学校管理精选',
            mental_health: '心理健康研修',
          };
          list.push({ id, category: cat, categoryName: catName, title: titleByCat[cat] || '资料集合', phaseId: p.id, phaseName: p.content || `模块 ${p.id}` });
        }
      });
    });
    // 去重
    const seen = new Set();
    return list.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [phaseMaterials, formatConfigs, configModal?.phaseId, defaultDatasetIds, getDefaultConfig]);

  const getCollectionInfoById = (id) => {
    if (!id) return { categoryName: '', title: '' };
    const item = scopeItems.find(s => s.id === id);
    if (item) return { categoryName: item.categoryName, title: item.title };
    const cat = parseCollectionCategory(id);
    return { categoryName: LIBRARY_CATEGORY_NAMES[cat] || '资料集合', title: '' };
  };

  const questionColumns = [
    {
      title: '选择',
      width: 60,
      render: (_, record) => (
        <Switch
          size="small"
          checked={selectedQuestions.some(q => q.id === record.id)}
          onChange={(checked) => handleQuestionSelect(record, checked)}
        />
      )
    },
    {
      title: '题目内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type) => {
        const labels = { single: '单选', multiple: '多选', judge: '判断', essay: '简答' };
        return <Tag color={getTypeColor(type)}>{labels[type]}</Tag>;
      }
    },
    // 学科列已移除
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 80,
      render: (difficulty) => {
        const labels = { easy: '简单', medium: '中等', hard: '困难' };
        return <Tag color={getDifficultyColor(difficulty)}>{labels[difficulty]}</Tag>;
      }
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 200,
      render: (_, record) => {
        const source = record.source || '未知';
        const color = source === 'AI' ? 'magenta' : 'geekblue';
        const info = getCollectionInfoById(record.collectionId);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Tag color={color}>{source}</Tag>
            {record.collectionId && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                自：{info?.categoryName}{info?.title ? `｜${info.title}` : ''}
              </Text>
            )}
          </div>
        );
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 120,
      render: (tags) => (
        <Space size={4} wrap>
          {tags.slice(0, 2).map(tag => (<Tag key={tag} size="small">{tag}</Tag>))}
          {tags.length > 2 && <Tag size="small">+{tags.length - 2}</Tag>}
        </Space>
      )
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="移除已选">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              disabled={!selectedQuestions.some(q => q.id === record.id)}
              onClick={() => handleRemoveSelected(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'library',
      label: (
        <Space>
          <BookOutlined />
          试题
        </Space>
      ),
      children: (
        <div>
          {/* 试题表格（移除工具区，使表格更贴近页签） */}
           <Table
             columns={questionColumns}
             dataSource={visibleQuestions}
             rowKey="id"
             size="small"
             pagination={false}
           />
        </div>
      )
    },
    {
      key: 'config',
      label: (
        <Space>
          <SettingOutlined />
          配置
        </Space>
      ),
      children: (
        <div>
          {/* 考试范围 */}
          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text strong>考试范围</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">已选 {scopeDatasetIds?.length || 0}</Text>
              </div>
            </div>
            {scopeItems.length === 0 ? (
              <Empty description="当前模块未选择任何资料集（请先在点播课中选择）" />
            ) : (
              <div style={{ marginTop: 10 }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {scopeItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f0f0f0', borderRadius: 6, padding: '6px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Checkbox
                          checked={scopeDatasetIds.includes(item.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const next = checked ? Array.from(new Set([...(scopeDatasetIds || []), item.id])) : (scopeDatasetIds || []).filter(x => x !== item.id);
                            handleScopeSave(next);
                          }}
                        />
                        <Tag color="geekblue">{item.categoryName}</Tag>
                        <Text>{item.title}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.id}</Text>
                    </div>
                  ))}
                </Space>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Divider orientation="left" plain>其他模块资料集</Divider>
              {otherScopeItems.length === 0 ? (
                <Text type="secondary">暂无其他模块资料集可选</Text>
              ) : (
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {otherScopeItems.map(item => (
                    <div key={`${item.phaseId}-${item.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #e8e8e8', borderRadius: 6, padding: '6px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Checkbox
                          checked={scopeDatasetIds.includes(item.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const next = checked ? Array.from(new Set([...(scopeDatasetIds || []), item.id])) : (scopeDatasetIds || []).filter(x => x !== item.id);
                            handleScopeSave(next);
                          }}
                        />
                        <Tag color="geekblue">{item.categoryName}</Tag>
                        <Text>{item.title}</Text>
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>来自：模块 {item.phaseId}｜{item.phaseName}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.id}</Text>
                    </div>
                  ))}
                </Space>
              )}
            </div>
          </Card>

          {/* AI智能出题入口已移除；统一由“试题”页签工具区的按钮触发配置与生成 */}

          {/* 当前出题规则预览已移除；规则从模态中配置，确认后直接生成 */}
        </div>
      )
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 考试范围已移至试卷配置页签（BasicConfigTab） */}

      {/* 头部说明已移除，按需求缩减页签上方内容 */}

      <div style={{ flex: 1 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ height: '100%' }}
          tabBarStyle={{ marginBottom: 8 }}
          tabBarExtraContent={
            <Space>
              <Button type="primary" icon={<RobotOutlined />} onClick={() => setAiRulesVisible(true)}>开始AI出题</Button>
              <Button type="default" icon={<ImportOutlined />} onClick={() => setImportVisible(true)}>导入试题</Button>
              <Button type="default" icon={<CloudSyncOutlined />} onClick={handleSyncToLibrary}>同步到资料库PDF</Button>
            </Space>
          }
        />
      </div>

      {/* 导入试题模态 */}
       <Modal title="导入试题" open={importVisible} onCancel={() => setImportVisible(false)} footer={null} width={720}>
         <Tabs activeKey={importTabKey} onChange={setImportTabKey} size="small" tabBarStyle={{ marginBottom: 8 }}
           items={[
             {
               key: 'excel',
               label: '从Excel导入',
               children: (
                 <div>
                   <Upload.Dragger multiple={false} accept=".xlsx,.xls,.csv" fileList={excelFileList}
                     beforeUpload={() => false}
                     onChange={({ fileList }) => setExcelFileList(fileList)}
                   >
                     <p className="ant-upload-drag-icon"><ImportOutlined /></p>
                     <p className="ant-upload-text">点击或拖拽上传Excel文件</p>
                     <p className="ant-upload-hint">支持 .xlsx / .xls / .csv</p>
                   </Upload.Dragger>
                   <div style={{ marginTop: 12, textAlign: 'right' }}>
                     <Button type="primary" disabled={!excelFileList.length} onClick={handleImportExcelSimulate}>解析并导入</Button>
                   </div>
                 </div>
               )
             },
             {
               key: 'bank',
               label: '从试题库导入',
               children: (
                 <div>
                   <Table
                     size="small"
                     rowKey="id"
                     dataSource={MOCK_QUESTIONS}
                     pagination={{ pageSize: 5 }}
                     rowSelection={{
                       selectedRowKeys: importSelection,
                       onChange: (keys) => setImportSelection(keys)
                     }}
                     columns={[
                       { title: '题目内容', dataIndex: 'content', ellipsis: true },
                       { title: '类型', dataIndex: 'type', width: 80, render: (type) => <Tag color={getTypeColor(type)}>{{ single: '单选', multiple: '多选', judge: '判断', essay: '简答' }[type]}</Tag> },
                       { title: '难度', dataIndex: 'difficulty', width: 80, render: (diff) => <Tag color={getDifficultyColor(diff)}>{{ easy: '简单', medium: '中等', hard: '困难' }[diff]}</Tag> },
                       { title: '来源', dataIndex: 'source', width: 160, render: (_, record) => {
                         const info = getCollectionInfoById(record.collectionId);
                         return (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                             <Tag color="geekblue">{record.source || '资料库'}</Tag>
                             {record.collectionId && (
                               <Text type="secondary" style={{ fontSize: 12 }}>
                                 自：{info?.categoryName}{info?.title ? `｜${info.title}` : ''}
                               </Text>
                             )}
                           </div>
                         );
                       } }
                     ]}
                   />
                   <div style={{ marginTop: 12, textAlign: 'right' }}>
                     <Button type="primary" disabled={!importSelection.length} onClick={handleImportFromBank}>加入已选</Button>
                   </div>
                 </div>
               )
             }
           ]}
         />
       </Modal>

      {/* AI出题规则配置模态 */}
       <Modal title="AI出题规则配置" open={aiRulesVisible} onCancel={() => setAiRulesVisible(false)} onOk={handleAiRulesSave} width={600}>
         <Form layout="vertical">
           <Form.Item label="学科">
             <Select placeholder="选择学科" value={aiRules.subject} onChange={(value) => setAiRules({ ...aiRules, subject: value })}>
               {AI_QUESTION_RULES.subjects.map(subject => (<Select.Option key={subject} value={subject}>{subject}</Select.Option>))}
             </Select>
           </Form.Item>
 
           <Form.Item label="总题数">
             <InputNumber min={1} max={100} value={aiRules.totalCount} onChange={(value) => setAiRules({ ...aiRules, totalCount: value })} />
           </Form.Item>
 
           <Form.Item label="题型分布">
             {AI_QUESTION_RULES.types.map(type => (
               <Row key={type.value} gutter={16} style={{ marginBottom: 8 }}>
                 <Col span={6}><Tag color={getTypeColor(type.value)}>{type.label}</Tag></Col>
                 <Col span={6}>
                   <InputNumber size="small" min={0} placeholder="题数" value={aiRules.distribution?.[type.value]?.count || 0} onChange={(value) => setAiRules({ ...aiRules, distribution: { ...aiRules.distribution, [type.value]: { ...aiRules.distribution?.[type.value], count: value || 0 } } })} />
                 </Col>
                 <Col span={6}>
                   <InputNumber size="small" min={1} placeholder="分值" value={aiRules.distribution?.[type.value]?.score || 1} onChange={(value) => setAiRules({ ...aiRules, distribution: { ...aiRules.distribution, [type.value]: { ...aiRules.distribution?.[type.value], score: value || 1 } } })} />
                 </Col>
               </Row>
             ))}
           </Form.Item>
 
           <Form.Item label="难度分布（百分比）">
             <Row gutter={16}>
               {AI_QUESTION_RULES.difficulties.map(diff => (
                 <Col key={diff.value} span={8}>
                   <InputNumber size="small" min={0} max={100} value={aiRules.difficulty?.[diff.value] || 0} onChange={(value) => setAiRules({ ...aiRules, difficulty: { ...aiRules.difficulty, [diff.value]: value || 0 } })} />
                   <span style={{ marginLeft: 8 }}>{diff.label}</span>
                 </Col>
               ))}
             </Row>
           </Form.Item>
 
           <Form.Item label="关键词（可选）">
             <TextArea rows={2} placeholder="用于限定出题范围的关键词" value={aiRules.keywords} onChange={(e) => setAiRules({ ...aiRules, keywords: e.target.value })} />
           </Form.Item>
         </Form>
       </Modal>
     </div>
   );
};

export default QuestionSelectionTab;