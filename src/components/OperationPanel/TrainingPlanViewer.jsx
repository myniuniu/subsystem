import React, { useState, useMemo } from 'react';
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
  Popover,
  Select,
  Divider
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
  SettingOutlined
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
  '线上直播课程', '录播视频', '在线研讨', '实践作业', '考试测评',
  '工作坊', '专题讲座', '案例研讨', '小组讨论', '实地调研'
];
const parseFormats = (val) => Array.isArray(val)
  ? val
  : (typeof val === 'string'
    ? val.split(/[+，,、]/).map(s => s.trim()).filter(Boolean)
    : []);
const joinFormats = (arr) => (arr || []).join(' + ');

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
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, title: e.target.value } : mo) } : ph))} />
        <Input style={{ width: 160 }} value={mod.duration} placeholder="时长"
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, duration: e.target.value } : mo) } : ph))} />
      </Space>
      <Space style={{ width: '100%', marginBottom: 8 }}>
        <Select
          mode="tags"
          style={{ flex: 1 }}
          placeholder="培训形式（可多选，可自定义）"
          value={parseFormats(mod.format)}
          onChange={(vals) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx
            ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, format: joinFormats(vals) } : mo) }
            : ph))}
          options={DEFAULT_FORMAT_OPTIONS.map(v => ({ value: v, label: v }))}
        />
        <Input style={{ flex: 1 }} value={mod.assessment} placeholder="考核方式"
          onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, assessment: e.target.value } : mo) } : ph))} />
      </Space>

      <Typography.Title level={5} style={{ marginTop: 8 }}>内容条目</Typography.Title>
      {(mod.content || []).map((cItem, cIdx) => (
        <Space key={cIdx} style={{ width: '100%', marginBottom: 8 }}>
          <Input style={{ flex: 1 }} value={cItem} placeholder="内容"
            onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: mo.content.map((ci, k) => k === cIdx ? e.target.value : ci) } : mo) } : ph))} />
          <Button danger onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: mo.content.filter((_, k) => k !== cIdx) } : mo) } : ph))}>删除</Button>
        </Space>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, modules: ph.modules.map((mo, j) => j === mIdx ? { ...mo, content: [...(mo.content || []), ''] } : mo) } : ph))}>添加内容</Button>
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
  hideButtons = false
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
      setRightPanelView(RIGHT_PANEL_VIEWS.TRAINING_PLAN_LIST);
    }
  };

  // 分屏：右侧实施方案显示/隐藏
  const [showImplementationPlan, setShowImplementationPlan] = useState(false);
  const handleConfigureImplementation = () => {
    setShowImplementationPlan(prev => !prev);
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
      format: '线上直播课程 + 录播视频 + 在线研讨 + 实践作业'
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
            format: '直播讲座 + 在线测试',
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
            format: '反思写作 + 经验交流',
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
  const openSectionEditor = (key) => {
    try {
      setEditingSectionKey(key);
      let sectionData = plan[key];
      if (sectionData === undefined) {
        sectionData = (key === 'participants' || key === 'participantTags') ? [] : {};
      }
      setSectionDraft(JSON.stringify(sectionData, null, 2));
      setVisualDraft(JSON.parse(JSON.stringify(sectionData)));
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
        setPlan(prev => ({ ...prev, [editingSectionKey]: parsed }));
      } else {
        setPlan(prev => ({ ...prev, [editingSectionKey]: visualDraft }));
      }
      setSectionEditorVisible(false);
      setEditingSectionKey(null);
      message.success('已保存该部分内容');
    } catch (e) {
      message.error(editMode === 'json' ? 'JSON格式错误，请检查' : '保存失败，请检查表单内容');
    }
  };

  // 内联可视化编辑控制
  const openInlineVisualEditor = (key) => {
    try {
      setEditingSectionKey(key);
      let sectionData = plan[key];
      if (sectionData === undefined) {
        sectionData = (key === 'participants' || key === 'participantTags') ? [] : {};
      }
      setVisualDraft(JSON.parse(JSON.stringify(sectionData)));
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
  };
  const saveInlineVisualEdit = () => {
    if (!editingSectionKey) return;
    try {
      setPlan(prev => ({ ...prev, [editingSectionKey]: visualDraft }));
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
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, week: e.target.value } : r))} />
                  <Input style={{ flex: 1 }} value={row.content} placeholder="内容"
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, content: e.target.value } : r))} />
                  <Input style={{ width: 160 }} value={row.type} placeholder="形式"
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, type: e.target.value } : r))} />
                  <Input style={{ width: 120 }} value={row.hours} placeholder="学时"
                    onChange={(e) => setVisualDraft(prev => prev.map((r, i) => i === idx ? { ...r, hours: e.target.value } : r))} />
                  <Button danger onClick={() => setVisualDraft(prev => prev.filter((_, i) => i !== idx))}>删除</Button>
                </Space>
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setVisualDraft(prev => ([...prev, { week: '', content: '', type: '', hours: '' }]))}>添加一行</Button>
          </div>
        );
      case 'phases':
        return (
          <div>
            <Title level={5}>培训阶段与内容</Title>
            {(visualDraft || []).map((phase, pIdx) => (
              <div key={pIdx} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderLeft: '3px solid #91d5ff', borderRadius: 6, background: '#fff' }}>
                <Space style={{ width: '100%', marginBottom: 8 }}>
                  <Input style={{ flex: 1 }} value={phase.name} placeholder="阶段名称"
                    onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, name: e.target.value } : ph))} />
                </Space>
                <TextArea rows={2} value={phase.focus} placeholder="阶段重点"
                  onChange={(e) => setVisualDraft(prev => prev.map((ph, i) => i === pIdx ? { ...ph, focus: e.target.value } : ph))} />

                <Divider orientation="left" style={{ margin: '12px 0' }}>模块</Divider>
                <DndContext
                  sensors={sensors}
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
      {/* 头部操作栏（可隐藏） */}
      {!hideButtons && (
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
                type="text"
              >
                返回
              </Button>
              <Title level={4} style={{ margin: 0 }}>{plan.title}</Title>
            </div>
            <Space>
              <Button 
                icon={<SettingOutlined />} 
                onClick={handleConfigureImplementation}
              >
                配置实施方案
              </Button>
            </Space>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      {!showImplementationPlan ? (
        <div style={{ 
          flex: 1, 
          padding: '24px',
          overflow: 'auto',
          background: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#fff',
            padding: '32px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* 方案概述 */}
            <SectionHeader
              sectionKey="overview"
              onVisualEdit={() => openInlineVisualEditor('overview')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('overview'); }}
            />
            <InlineEditableSection
              sectionKey="overview"
              renderContent={() => <TrainingOverview overview={plan.overview} />}
            />

            {/* 参训人员（标签） */}
            <SectionHeader
              sectionKey="participantTags"
              onVisualEdit={() => openInlineVisualEditor('participantTags')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('participantTags'); }}
            />
            <InlineEditableSection
              sectionKey="participantTags"
              renderContent={() => <TagsSection tags={plan.participantTags || []} />}
            />

            {/* 培训阶段与内容 */}
            <SectionHeader
              sectionKey="phases"
              onVisualEdit={() => openInlineVisualEditor('phases')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('phases'); }}
            />
            <InlineEditableSection
              sectionKey="phases"
              renderContent={() => <TrainingPhases phases={plan.phases} />}
            />

            {/* 详细时间安排 */}
            <SectionHeader
              sectionKey="schedule"
              onVisualEdit={() => openInlineVisualEditor('schedule')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('schedule'); }}
            />
            <InlineEditableSection
              sectionKey="schedule"
              renderContent={() => <TrainingSchedule schedule={plan.schedule} />}
            />

            {/* 实施保障 */}
            <SectionHeader
              sectionKey="implementation"
              onVisualEdit={() => openInlineVisualEditor('implementation')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('implementation'); }}
            />
            <InlineEditableSection
              sectionKey="implementation"
              renderContent={() => <ImplementationSection implementation={plan.implementation} />}
            />

            {/* 考核与评价 */}
            <SectionHeader
              sectionKey="assessment"
              onVisualEdit={() => openInlineVisualEditor('assessment')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('assessment'); }}
            />
            <InlineEditableSection
              sectionKey="assessment"
              renderContent={() => <AssessmentSection assessment={plan.assessment} />}
            />

            {/* 保障措施 */}
            <SectionHeader
              sectionKey="guarantee"
              onVisualEdit={() => openInlineVisualEditor('guarantee')}
              onJsonEdit={() => { setEditMode('json'); openSectionEditor('guarantee'); }}
            />
            <InlineEditableSection
              sectionKey="guarantee"
              renderContent={() => <GuaranteeSection guarantee={plan.guarantee} />}
            />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f5f5f5' }}>
            {/* 左侧原方案 */}
            <div style={{ flex: 4, padding: '24px', overflow: 'auto' }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: '#fff',
                padding: '32px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {/* 方案概述 */}
                <SectionHeader
                  sectionKey="overview"
                  onVisualEdit={() => openInlineVisualEditor('overview')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('overview'); }}
                />
                <InlineEditableSection
                  sectionKey="overview"
                  renderContent={() => <TrainingOverview overview={plan.overview} />}
                />

                {/* 参训人员（标签） */}
                <SectionHeader
                  sectionKey="participantTags"
                  onVisualEdit={() => openInlineVisualEditor('participantTags')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('participantTags'); }}
                />
                <InlineEditableSection
                  sectionKey="participantTags"
                  renderContent={() => <TagsSection tags={plan.participantTags || []} />}
                />

                {/* 培训阶段与内容 */}
                <SectionHeader
                  sectionKey="phases"
                  onVisualEdit={() => openInlineVisualEditor('phases')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('phases'); }}
                />
                <InlineEditableSection
                  sectionKey="phases"
                  renderContent={() => <TrainingPhases phases={plan.phases} />}
                />

                {/* 详细时间安排 */}
                <SectionHeader
                  sectionKey="schedule"
                  onVisualEdit={() => openInlineVisualEditor('schedule')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('schedule'); }}
                />
                <InlineEditableSection
                  sectionKey="schedule"
                  renderContent={() => <TrainingSchedule schedule={plan.schedule} />}
                />

                {/* 实施保障 */}
                <SectionHeader
                  sectionKey="implementation"
                  onVisualEdit={() => openInlineVisualEditor('implementation')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('implementation'); }}
                />
                <InlineEditableSection
                  sectionKey="implementation"
                  renderContent={() => <ImplementationSection implementation={plan.implementation} />}
                />

                {/* 考核与评价 */}
                <SectionHeader
                  sectionKey="assessment"
                  onVisualEdit={() => openInlineVisualEditor('assessment')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('assessment'); }}
                />
                <InlineEditableSection
                  sectionKey="assessment"
                  renderContent={() => <AssessmentSection assessment={plan.assessment} />}
                />

                {/* 保障措施 */}
                <SectionHeader
                  sectionKey="guarantee"
                  onVisualEdit={() => openInlineVisualEditor('guarantee')}
                  onJsonEdit={() => { setEditMode('json'); openSectionEditor('guarantee'); }}
                />
                <InlineEditableSection
                  sectionKey="guarantee"
                  renderContent={() => <GuaranteeSection guarantee={plan.guarantee} />}
                />
                </div>
              </div>

              {/* 右侧实施方案空白页 */}
              <div style={{ flex: 6, padding: '24px', overflow: 'auto', borderLeft: '1px solid #f0f0f0' }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
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
            )}

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