import React, { useState } from 'react';
import { Layout, Typography, Card, Space, message } from 'antd';
import SupervisionSidebar from './SupervisionSidebar';
import SupervisionTemplateList from './SupervisionTemplateList';
import SupervisionTemplateEditor from './SupervisionTemplateEditor';
import './Supervision.css';

const { Content } = Layout;
const { Title, Text } = Typography;

// 督学模块主组件：左侧复用 SmartNotes 的“我的分类”组件，右侧功能主区域
const Supervision = () => {
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
          notes: '1. 记录灭火器过期/压力异常数量与位置；2. 标注遮挡消防栓的障碍物类型；3. 拍摄堵塞通道照片并注明整改责任部门。'
        },
        {
          category: '校园设施安全',
          item: '校舍建筑',
          standard: '1. 墙面无裂缝，门窗玻璃无破损；2. 扶手、护栏符合高度标准且无松动；3. 运动器材无锈蚀、部件齐全。',
          notes: '1. 记录裂缝位置与长度；2. 标注松动扶手区域；3. 列出损坏器材名称与数量。'
        },
        {
          category: '校园管理安全',
          item: '校园安保',
          standard: '1. 门卫 24 小时值守，记录完整；2. 入校人员登记、特殊时期测温；3. 装备齐全并能熟练使用。',
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
        { category: '教学计划执行', item: '课程进度', standard: '实际进度与计划偏差≤10%，无随意增减课时更改内容。', notes: '记录偏差较大学科，询问教师记录增减课时原因。' },
        { category: '教学计划执行', item: '备课与教案', standard: '教案模块完整，与实际一致；集体备课记录完整。', notes: '抽查教案缺漏模块数量；检查近2次集体备课记录完整性。' },
        { category: '学生学习效果', item: '考试成绩分析', standard: '完成统计与分析，落后学生有个性化辅导计划。', notes: '记录低于区域平均的学科；抽查辅导计划具体性。' }
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
        { category: '作业负担管控', item: '作业时长', standard: '小学1-2年级无书面作业；3-6年级≤60分钟；初中≤90分钟。', notes: '抽查班级记录作业超时天数与学科；记录分层作业加码情况。' },
        { category: '作业负担管控', item: '作业设计与批改', standard: '以基础题为主，鼓励实践；教师亲自批改。', notes: '记录偏题/怪题数量；统计实践类作业占比与代批情况。' },
        { category: '校外培训治理', item: '学校违规培训', standard: '无组织学生参加校外培训；教师无有偿补课与推荐培训。', notes: '记录线索与违规宣传信息。' }
      ],
      content: ''
    }
  ]);

  // 编辑态
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const handleStartEdit = (item) => setEditingTemplate(item);
  const handleCancelEdit = () => setEditingTemplate(null);
  const handleSaveEdit = (next) => {
    if (next.categoryLabel === '专项模版') {
      setSpecialTemplates(prev => prev.map(it => it.id === next.id ? next : it));
    } else {
      setCommonTemplates(prev => prev.map(it => it.id === next.id ? next : it));
    }
    setEditingTemplate(null);
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

  // 复用 SmartNotes 的系统分类集合（与 NotesSidebar 的渲染契合）
  // 督学功能菜单仅来自新侧边栏，不复用 SmartNotes 的分类数据

  return (
    <div className="supervision">
      <Layout>
        <SupervisionSidebar
          selectedKey={selectedFunctionKey}
          onSelect={setSelectedFunctionKey}
        />

        <Content className="supervision-content">
          <div className="content-wrapper">
            {editingTemplate ? (
              <SupervisionTemplateEditor
                item={editingTemplate}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Card
                title={(
                  <Space align="center" size={8}>
                    <span className="content-title">督学</span>
                    <Text type="secondary">/</Text>
                    {(() => {
                      const labelMap = { plan_templates_common: '通用模版', plan_templates_special: '专项模版' };
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
                {!selectedFunctionKey && (
                  <div className="content-placeholder">
                    <Title level={4} style={{ marginBottom: 8 }}>功能主区域</Title>
                    <Text type="secondary">请选择左侧“计划模版”的具体子项</Text>
                  </div>
                )}
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Supervision;