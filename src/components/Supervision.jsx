import React, { useState } from 'react';
import { Layout, Typography, Card, Space, message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SupervisionSidebar from './SupervisionSidebar';
import SupervisionTemplateList from './SupervisionTemplateList';
import SupervisionTemplateEditor from './SupervisionTemplateEditor';
import SupervisionPlanList from './SupervisionPlanList';
import SupervisionPlanEditor from './SupervisionPlanEditor';
import SupervisionExecutionList from './SupervisionExecutionList';
import SupervisionExecutionEditor from './SupervisionExecutionEditor';
import './Supervision.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// 督学模块主组件：左侧复用 SmartNotes 的“我的分类”组件，右侧功能主区域
const Supervision = ({ initialEditingPlan = null, initialEditingExecution = null, onClose = null }) => {
  // 左侧 NotesSidebar 需要的最小状态
  const [selectedFunctionKey, setSelectedFunctionKey] = useState('');

  // 模板数据（与 SmartNotes 数据独立）
  const [commonTemplates, setCommonTemplates] = React.useState([
    { id: 'tpl_common_001', title: '周度督学通用模板', content: '用于常规课堂督学记录与反馈。', tags: ['课堂', '记录', '反馈'], categoryLabel: '通用模版' },
    { id: 'tpl_common_002', title: '月度督学通用模板', content: '汇总月度督学要点与改进建议。', tags: ['月度', '汇总', '建议'], categoryLabel: '通用模版' },
    { id: 'tpl_common_003', title: '教学常规督学清单', content: '教学常规执行情况检查清单。', tags: ['清单', '常规'], categoryLabel: '通用模版' }
  ]);
  const [specialTemplates, setSpecialTemplates] = React.useState([
    {
      id: 'tpl_special_safety_school_opening',
      title: '开学季安全检查专项模板',
      tags: ['安全', '开学季', '隐患排查'],
      categoryLabel: '专项模版',
      coreInfo: {
        period: '开学前 1 周 - 开学后 2 周',
        target: '辖区内所有中小学、幼儿园',
        objective: '排查校园安全隐患，保障开学后师生人身安全、教学秩序稳定'
      },
      checklist: [
        {
          category: '校园设施安全',
          item: '消防设施',
          standard: '1. 灭火器在有效期内，压力值正常；2. 消防栓无遮挡，水压正常，配套水带、水枪齐全；3. 疏散通道、安全出口畅通，标识清晰且无损坏。',
          method: ['实地查看', '查看相关记录'],
          notes: '1. 记录灭火器过期/压力异常数量与位置；2. 标注遮挡消防栓的障碍物类型；3. 拍摄堵塞通道照片并注明整改责任部门。'
        },
        {
          category: '校园设施安全',
          item: '校舍建筑',
          standard: '1. 墙面无裂缝，门窗玻璃无破损；2. 扶手、护栏符合高度标准且无松动；3. 运动器材无锈蚀、部件齐全。',
          method: ['实地查看'],
          notes: '1. 记录裂缝位置与长度；2. 标注松动扶手区域；3. 列出损坏器材名称与数量。'
        },
        {
          category: '校园管理安全',
          item: '校园安保',
          standard: '1. 门卫 24 小时值守，记录完整；2. 入校人员登记、特殊时期测温；3. 装备齐全并能熟练使用。',
          method: ['查阅相关材料', '查看相关记录', '走访教职工'],
          notes: '1. 检查近 1 周值班记录缺失情况；2. 模拟入校登记流程记录不规范；3. 检查防护装备数量与完好度。'
        }
      ],
      content: ''
    },
    {
      id: 'tpl_special_midterm_quality',
      title: '期中教学质量评估专项模板',
      tags: ['教学质量', '期中', '评估'],
      categoryLabel: '专项模版',
      coreInfo: {
        period: '期中考试结束后 1-2 周',
        target: '辖区内中小学（按学段抽样：小学3-6年级、初中/高中各年级）',
        objective: '评估教学计划落实情况、学生学习效果，发现问题提出改进建议'
      },
      checklist: [
        { category: '教学计划执行', item: '课程进度', standard: '实际进度与计划偏差≤10%，无随意增减课时更改内容。', method: ['查阅相关记录', '走访教职工'], notes: '记录偏差较大学科，询问教师记录增减课时原因。' },
        { category: '教学计划执行', item: '备课与教案', standard: '教案模块完整，与实际一致；集体备课记录完整。', method: ['查阅相关材料', '查阅相关会议材料'], notes: '抽查教案缺漏模块数量；检查近2次集体备课记录完整性。' },
        { category: '学生学习效果', item: '考试成绩分析', standard: '完成统计与分析，落后学生有个性化辅导计划。', method: ['查阅相关材料', '查看相关记录'], notes: '记录低于区域平均的学科；抽查辅导计划具体性。' }
      ],
      content: ''
    },
    {
      id: 'tpl_special_double_reduction',
      title: '“双减”政策落实专项督导模板',
      tags: ['双减', '作业负担', '培训治理'],
      categoryLabel: '专项模版',
      coreInfo: {
        period: '每学期中期、期末各 1 次',
        target: '辖区内义务教育阶段学校（小学1-6年级、初中1-3年级）',
        objective: '检查“双减”落实情况，纠正违规行为，保障学生课余时间'
      },
      checklist: [
        { category: '作业负担管控', item: '作业时长', standard: '小学1-2年级无书面作业；3-6年级≤60分钟；初中≤90分钟。', method: ['查阅相关记录', '走访教职工'], notes: '抽查班级记录作业超时天数与学科；记录分层作业加码情况。' },
        { category: '作业负担管控', item: '作业设计与批改', standard: '以基础题为主，鼓励实践；教师亲自批改。', method: ['查阅相关材料', '查看相关记录'], notes: '记录偏题/怪题数量；统计实践类作业占比与代批情况。' },
        { category: '校外培训治理', item: '学校违规培训', standard: '无组织学生参加校外培训；教师无有偿补课与推荐培训。', method: ['走访教职工', '查阅相关会议材料'], notes: '记录线索与违规宣传信息。' }
      ],
      content: ''
    }
  ]);

  // 编辑态
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [editingPlan, setEditingPlan] = React.useState(null);
  const [editingExecution, setEditingExecution] = React.useState(null);
  React.useEffect(() => {
    if (initialEditingPlan && !editingPlan) {
      const openingTplId = 'tpl_special_safety_school_opening';
      // 仅设置专项与模板关联，具体检查项由编辑器加载模板并追加AI项
      setEditingPlan({
        ...initialEditingPlan,
        type: 'special',
        associatedTemplateId: openingTplId,
        checklist: []
      });
    }
  }, [initialEditingPlan, editingPlan]);

  // 外部直接打开执行编辑器
  React.useEffect(() => {
    if (initialEditingExecution && !editingExecution) {
      let exec = { ...initialEditingExecution };
      if (!Array.isArray(exec.items) || exec.items.length === 0) {
        const openingTpl = (specialTemplates || []).find(t => t.id === 'tpl_special_safety_school_opening');
        const defaultItems = (openingTpl?.checklist || []).map(row => ({
          category: row.category || '',
          item: row.item || '',
          standard: row.standard || '',
          issue: '', action: '', owner: '', progress: '未开始', tracking: ''
        }));
        exec.items = defaultItems;
      }
      setEditingExecution(exec);
    }
  }, [initialEditingExecution, editingExecution, specialTemplates]);

  // 标记全局编辑态，供外层返回按钮判断
  React.useEffect(() => {
    try {
      if (editingPlan || editingTemplate) {
        window.__supervision_editing_active__ = true;
      } else {
        window.__supervision_editing_active__ = false;
      }
    } catch {}
    return () => { try { window.__supervision_editing_active__ = false; } catch {} };
  }, [editingPlan, editingTemplate]);
  const handleStartEdit = (item) => setEditingTemplate(item);
  const handleCancelEdit = () => {
    setEditingTemplate(null);
    try { window.dispatchEvent(new Event('exitSupervisionFullscreen')); } catch {}
  };
  const handleSaveEdit = (next) => {
    if (next.categoryLabel === '专项模版') {
      setSpecialTemplates(prev => prev.map(it => it.id === next.id ? next : it));
    } else {
      setCommonTemplates(prev => prev.map(it => it.id === next.id ? next : it));
    }
    message.success('模板已保存');
  };
  const handleDelete = (item) => {
    if (item.categoryLabel === '专项模版') {
      setSpecialTemplates(prev => prev.filter(it => it.id !== item.id));
    } else {
      setCommonTemplates(prev => prev.filter(it => it.id !== item.id));
    }
    if (editingTemplate?.id === item.id) setEditingTemplate(null);
    message.success('模板已删除');
  };

  // 督导计划数据
  const [supervisionPlans, setSupervisionPlans] = React.useState([
    { id: 'plan_002', title: '安全专项督导（2025年开学季）', description: '围绕消防设施、食堂卫生等安全要点', type: 'special', typeLabel: '专项督导', date: '2025-09-05', tags: ['安全', '食堂', '消防'], associatedTemplateId: 'tpl_special_safety_school_opening', published: false },
    { id: 'plan_001', title: '9月常规督导（教学与作业）', description: '例行走访，关注教学进度与作业管理', type: 'regular', typeLabel: '常规督导', date: '2025-09-10', tags: ['教学', '作业'] },
    { id: 'plan_003', title: '问题复查督导（上学期整改）', description: '针对历史问题整改情况进行复查', type: 'review', typeLabel: '复查督导', date: '2025-10-15', tags: ['复查', '整改'] }
  ]);

  const handleStartPlanEdit = (plan) => setEditingPlan(plan);
  const handleCancelPlanEdit = () => {
    setEditingPlan(null);
    try { window.dispatchEvent(new Event('exitSupervisionFullscreen')); } catch {}
  };
  const handleSavePlanEdit = (next) => {
    setSupervisionPlans(prev => prev.map(p => p.id === next.id ? { ...p, ...next } : p));
    message.success('督导计划已保存');
  };
  // 督导执行列表
  const [supervisionExecutions, setSupervisionExecutions] = React.useState(() => {
    const openingTpl = (specialTemplates || []).find(t => t.id === 'tpl_special_safety_school_opening');
    const defaultItems = (openingTpl?.checklist || []).map(row => ({
      category: row.category || '',
      item: row.item || '',
      standard: row.standard || '',
      issue: '', action: '', owner: '', progress: '未开始', tracking: ''
    }));
    return [
      { id: 'exec_001', title: '安全专项督导（2025年开学季）', description: '按检查项推进并记录问题与整改跟踪', type: 'special', status: 'pending', planId: 'plan_002', tags: ['安全','开学季','执行'], targets: ['第一小学'], items: defaultItems },
      { id: 'exec_002', title: '安全专项督导（2025年开学季）', description: '按检查项推进并记录问题与整改跟踪', type: 'special', status: 'pending', planId: 'plan_002', tags: ['安全','开学季','执行'], targets: ['第二小学'], items: defaultItems }
    ];
  });
  const handlePublishPlan = (planValues) => {
    // 从计划或关联模板生成执行项
    const tpl = specialTemplates.find(t => t.id === (planValues.associatedTemplateId || ''));
    const checklist = (Array.isArray(planValues.checklist) && planValues.checklist.length > 0) ? planValues.checklist : (tpl?.checklist || []);
    const items = (checklist || []).map(row => ({
      category: row.category || '',
      item: row.item || '',
      standard: row.standard || '',
      issue: '', action: '', owner: '', progress: '未开始', tracking: ''
    }));
    const exec = {
      id: `exec_${Date.now()}`,
      title: planValues.title || '督导执行',
      description: '按检查项推进并记录问题与整改跟踪',
      type: planValues.type || 'special',
      status: 'started',
      planId: planValues.id,
      tags: ['执行','督学'],
      principal: planValues.principal || '',
      collaborators: Array.isArray(planValues.collaborators) ? planValues.collaborators : [],
      experts: Array.isArray(planValues.experts) ? planValues.experts : [],
      targets: Array.isArray(planValues.targets) ? planValues.targets : [],
      items
    };
    setSupervisionExecutions(prev => {
      const filtered = prev.filter(e => e.planId !== exec.planId);
      return [exec, ...filtered];
    });
    // 标记计划为已发布
    setSupervisionPlans(prev => prev.map(p => p.id === planValues.id ? { ...p, published: true, publishedTime: new Date().toLocaleString('zh-CN') } : p));
    setEditingPlan(null);
    setSelectedFunctionKey('supervision_execution');
    setEditingExecution(exec);
    message.success('督导任务已发布，进入督导执行');
  };
  const handleEditExecution = (exec) => setEditingExecution(exec);
  const handleCancelExecutionEdit = () => {
    setEditingExecution(null);
    try { if (typeof onClose === 'function') onClose(); } catch {}
  };
  const handleSaveExecutionEdit = (next) => {
    setSupervisionExecutions(prev => prev.map(e => e.id === next.id ? { ...e, ...next } : e));
    message.success('督导执行已保存');
  };
  const handleDeletePlan = (plan) => {
    setSupervisionPlans(prev => prev.filter(p => p.id !== plan.id));
    if (editingPlan?.id === plan.id) setEditingPlan(null);
    message.success('督导计划已删除');
  };

  // 复用 SmartNotes 的系统分类集合（与 NotesSidebar 的渲染契合）
  // 督学功能菜单仅来自新侧边栏，不复用 SmartNotes 的分类数据

  return (
    <div className="supervision">
      {/* 全屏覆盖显示编辑内容（覆盖功能菜单与主区域） */}
      {(editingTemplate || editingPlan || editingExecution) && (
        <div className="supervision-overlay">
          <div className="overlay-header">
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={editingTemplate ? handleCancelEdit : (editingPlan ? handleCancelPlanEdit : handleCancelExecutionEdit)}>
              返回
            </Button>
            <Space size={8}>
              <span className="content-title">{editingTemplate ? '编辑模板' : (editingExecution ? '督导执行' : '督导任务')}</span>
              <Text type="secondary">/</Text>
              <Text strong>{editingTemplate ? (editingTemplate.title || '') : (editingExecution ? (editingExecution.title || '') : (editingPlan?.title || ''))}</Text>
            </Space>
          </div>
          <div className="overlay-body">
            <div className="overlay-container">
              {editingTemplate && (
                <SupervisionTemplateEditor
                  item={editingTemplate}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              )}
              {editingPlan && (
                <SupervisionPlanEditor
                  plan={editingPlan}
                  onSave={handleSavePlanEdit}
                  onCancel={handleCancelPlanEdit}
                  onPublish={handlePublishPlan}
                  specialTemplates={specialTemplates}
                />
              )}
              {editingExecution && (
                <SupervisionExecutionEditor
                  execution={editingExecution}
                  onSave={handleSaveExecutionEdit}
                  onCancel={handleCancelExecutionEdit}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Layout>
        <SupervisionSidebar
          selectedKey={selectedFunctionKey}
          onSelect={setSelectedFunctionKey}
        />

        <Content className="supervision-content">
          <div className="content-wrapper">
            {!(editingTemplate || editingPlan) ? (
              <Card
                title={(
                  <Space align="center" size={8}>
                    <span className="content-title">督学</span>
                    <Text type="secondary">/</Text>
                    {(() => {
                      const labelMap = { plan_templates_common: '通用模版', plan_templates_special: '专项模版', supervision_plan: '督导任务', supervision_execution: '督导执行' };
                      const label = labelMap[selectedFunctionKey] || '请选择左侧功能';
                      return <Text strong>{label}</Text>;
                    })()}
                  </Space>
                )}
                bordered
                style={{ height: '100%' }}
              >
                {selectedFunctionKey === 'plan_templates_common' && (
                  <SupervisionTemplateList
                    items={commonTemplates}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                    onShare={() => {}}
                    onTogglePin={() => {}}
                  />
                )}
                {selectedFunctionKey === 'plan_templates_special' && (
                  <SupervisionTemplateList
                    items={specialTemplates}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                    onShare={() => {}}
                    onTogglePin={() => {}}
                  />
                )}
                {selectedFunctionKey === 'supervision_plan' && !editingPlan && (
                  <SupervisionPlanList
                    items={supervisionPlans}
                    onEdit={handleStartPlanEdit}
                    onDelete={handleDeletePlan}
                    onShare={() => {}}
                    onTogglePin={() => {}}
                  />
                )}
                {selectedFunctionKey === 'supervision_execution' && !editingExecution && (
                  <SupervisionExecutionList
                    items={supervisionExecutions}
                    onEdit={handleEditExecution}
                    onDelete={() => {}}
                    onShare={() => {}}
                    onTogglePin={() => {}}
                  />
                )}
                {!selectedFunctionKey && (
                  <div className="content-placeholder">
                    <Title level={4} style={{ marginBottom: 8 }}>功能主区域</Title>
                    <Text type="secondary">请选择左侧“计划模版”的具体子项</Text>
                  </div>
                )}
              </Card>
            ) : null}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Supervision;