import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, Row, Col, Tag, Space, Progress, List } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, CalendarOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { RIGHT_PANEL_VIEWS } from '../../constants/noteEditConstants';

const { Text, Title, Paragraph } = Typography;

export default function ReportViewer({
  rightPanelReportRecord,
  rightPanelReportContent,
  setRightPanelView,
  setRightPanelReportRecord,
  setRightPanelReportContent
}) {
  const [reportData, setReportData] = useState(null);
  const [isStudyGuideView, setIsStudyGuideView] = useState(false);

  useEffect(() => {
    const topic = rightPanelReportRecord?.topic || '新教师教学方法培训';
    const isStudyGuide = (rightPanelReportRecord?.subType === 'study-guide') || /学习指南/.test(String(rightPanelReportRecord?.title || ''));

    const contentObj = typeof rightPanelReportContent === 'object' ? rightPanelReportContent : null;
    const needsFallbackStudyGuide = contentObj && (
      (!Array.isArray(contentObj.structure) || contentObj.structure.length === 0) &&
      (!Array.isArray(contentObj.recommendations) || contentObj.recommendations.length === 0)
    );

    if (isStudyGuide || needsFallbackStudyGuide) {
      const titleText = '新教师正在“裸泳”：调查揭示的5个残酷现实与破局之道';
      const defaults = {
        metadata: {
          title: titleText,
          generatedAt: new Date().toLocaleString('zh-CN'),
          source: rightPanelReportRecord?.source || '基于当前数据源'
        },
        heroTitle: titleText,
        basedOnSources: 10,
        summary: {
          objective: '整理新教师入职阶段需要掌握的关键要点，指导其快速形成稳定的课堂组织、教学设计与评价能力。',
          audience: '新入职教师',
          period: '2-4周导学',
          methods: ['观摩示范课', '微格教学演练', '同伴互评', '形成性评价']
        },
        intro: '简介：点燃讲台梦想，然后呢？ 每一位新教师都曾怀揣着理想与热情踏上讲台，渴望用知识点亮学生的未来。然而，理想的光芒很快就会遭遇现实的考验。近期一项针对新教师的调查研究揭示了一个触目惊心的数字：超过86%的新教师感到工作量“繁重”或“非常繁重”。这不仅仅是“忙”，更是一种系统性困境的体现。本文将基于最新研究，揭开新教师们正在独自面对的、那些不为人知的残酷现实，并探讨那些真正能够打破困局的创新之道。',
        sections: [
          {
            title: '1. 理论与现实的鸿沟：超过一半的新教师甚至不完全理解“游戏规则”',
            content: '一个令人惊讶的发现是，大部分新教师对于指导他们教学工作的“游戏规则”——国家新课程标准——理解有限。调查数据显示，超过52%的新教师对新课标仅有“一般了解”甚至“不了解”。这套标准至关重要，因为它直接规定了“教什么”（what to teach）、“为什么教”（why to teach）和“怎么教”（how to teach）。这种理论上的认知差距，直接导致了实践中的困惑。',
            bullets: [
              { text: '激发学生学习兴趣', percent: 79 },
              { text: '课堂教学组织', percent: 73 },
              { text: '班级管理', percent: 71 }
            ]
          },
          {
            title: '2. 看不见的重担：专业不对口与一人多岗的“隐形工作量”',
            content: '新教师的倦怠感，往往源于那些“看不见”的工作量。调查数据揭示了几个导致工作量激增的隐形因素：这种“隐形工作量”的危害远不止时间上的消耗。它迫使教师花费大量精力从零开始学习一个全新的学科领域，几乎没有时间用于专业发展或精进核心教学技能。数据也证实了这一点：40%的教师认为“教学任务繁重”是阻碍他们专业成长的首要因素。',
            bullets: [
              { text: '身兼数职 (Juggling Multiple Roles)', percent: 54.7 },
              { text: '跨学科教学 (Teaching Multiple Subjects)', percent: 59 },
              { text: '专业错配 (Major Mismatch)', percent: 28 },
              { text: '教学任务繁重（阻碍专业成长）', percent: 40 }
            ]
          },
          {
            title: '3. 破解导师指导悖论：用“双导师制”打破校园壁垒',
            content: '导师制对新教师的成长至关重要，但在许多资源相对匮乏的学校，尤其是乡村学校，高质量的导师是一种稀缺资源。这形成了一个悖论：最需要指导的人，身边却缺少能够指导的人。为了解决这一问题，一种创新的“双导师带教”模式应运而生。该模式通过跨校合作，为新教师提供了一个立体的支持系统。实践表明，100%参与该项目的新教师课堂教学实现了达标，其中35%的课例达到了“优质课”标准。',
            bullets: [
              { text: '一级带教 (Level 1 Mentorship)：本校经验教师负责日常常规与班级管理', percent: 100 },
              { text: '二级带教 (Level 2 Mentorship)：基地校骨干教师每月跟岗提供前沿指导', percent: 100 }
            ]
          },
          {
            title: '4. 培训设计的陷阱：我们追求的是满意度，而非有效性',
            content: '当前许多教师培训更关注“我们能提供什么”（输入），而不是“教师需要能够做到什么”（结果）。成果导向教育（OBE），或称“反向设计”，为教师培训提供了全新的思路。它强调培训设计的出发点应该是最终的学习成果：教师培训的出发点应为学员“学到什么”而不是“给他什么”，并贯穿课程始终。衡量培训成功的标准应是“有效性”——即教师的课堂实践是否得到可验证的改善。',
            bullets: [
              { text: '目标-活动-评价一致性', percent: 100 },
              { text: '证据采集与即时反馈', percent: 100 }
            ]
          },
          {
            title: '5. 最后的边疆：在人工智能时代，教师成为“伦理导航员”',
            content: '生成式人工智能（AI）的兴起，为教师发展带来了最新、也可能是最深刻的挑战。这项技术既是强大的助手，也赋予了教师全新的责任。教育部相关指引明确了教师在使用AI时必须承担的关键角色，即成为学生的“伦理导航员”。',
            bullets: [
              { text: '坚守育人主体地位：AI只是工具，价值引导与情感培养不可替代' },
              { text: '加强内容审查把关：严格审查AI生成内容的准确性与偏见' },
              { text: '引导学生规范使用：设定边界，培养批判性理解与使用' }
            ]
          }
        ],
        conclusion: '结论：为下一代教师铺设跑道，我们准备好了吗？新教师面临的挑战，远比我们想象的更为系统和深刻。从理论与现实的脱节，到隐形工作量的重压，再到培训模式的失效，每一个问题都直指当前教师支持体系的不足。幸运的是，双导师制、成果导向培训以及对AI时代的清醒认知等创新方案，正在为我们指明方向。随着课程标准和技术工具的不断革新，教师的角色正在以前所未有的速度演变。我们的支持系统，是否也在以同样的速度进化，为渴望远航的新教师提供坚实的“泳衣”与清晰的“航图”，让他们不再“裸泳”？',
        keyPoints: [
          { title: '课堂组织', items: ['入场与规则建立', '座位与分组策略', '课堂指令与时间管理', '正向关注与反馈'] },
          { title: '教学设计', items: ['目标-活动-评价一致性', '问题驱动与任务设计', '差异化与分层支持', '材料选择与可操作性'] },
          { title: '评价要点', items: ['学习证据采集', '过程性评价与即时反馈', '同伴互评与自我反思', '阶段性测验与改进记录'] }
        ],
        practiceList: [
          { name: '指令与课堂流程演练', description: '设计入场-导入-活动-总结的标准流程，进行口令与板书演练。' },
          { name: '提问与互动技能训练', description: '使用追问与等待时间控制，练习随机抽取与分层提问。' },
          { name: '小组合作任务设计', description: '围绕学习目标，设计3个可落地的小组任务与分工说明。' },
          { name: '形成性评价清单', description: '制定课堂观察点与证据记录表，并应用于一节练习课。' }
        ],
        classroomChecklist: [
          '课前准备：目标明确、材料齐备、板书结构规划',
          '入场与规则：指令清晰、常规建立、时长控制',
          '活动组织：任务清晰、分工合理、巡视与点拨',
          '互动与反馈：追问、等待时间、正向反馈与纠错',
          '评价与总结：展示与讲评、证据记录、行动计划'
        ]
      };
      const merged = {
        ...defaults,
        ...(typeof rightPanelReportContent === 'object' ? rightPanelReportContent : {})
      };
      // 强制标题覆盖为图示标题
      merged.metadata = { ...(merged.metadata || {}), title: titleText };
      merged.heroTitle = titleText;
      setReportData(merged);
      setRightPanelReportContent(merged);
      setIsStudyGuideView(true);
    } else {
      const defaults = {
        metadata: {
          title: `${topic}报告`,
          generatedAt: new Date().toLocaleString('zh-CN'),
          source: rightPanelReportRecord?.source || '基于当前数据源'
        },
        summary: {
          objective: '帮助新教师掌握课堂组织、教学设计与评价方法，形成可落地的教学行为模式。',
          audience: '新入职教师',
          period: '4周',
          methods: ['示范课观摩', '分组研讨', '微格演练', '同伴互助', '形成性评价']
        },
        structure: [
          { name: '导入与目标说明', details: ['明确培训目标与评价要求', '建立学习共同体'] },
          { name: '教学设计与课堂组织', details: ['目标-活动-评价一致性', '课堂互动与提问技巧'] },
          { name: '课堂管理与差异化支持', details: ['规则建立与正向反馈', '分层任务与资源支持'] },
          { name: '评价与改进', details: ['形成性评价证据采集', '及时反馈与教学改进'] }
        ],
        schedule: [
          { phase: '第1周', content: '入职导学与目标说明', time: '周三 19:30-21:00', mode: '直播+点播' },
          { phase: '第2周', content: '教学设计与课堂组织', time: '周六 09:30-11:30', mode: '工作坊+示范课' },
          { phase: '第3周', content: '课堂管理与互动策略', time: '周三 19:30-21:00', mode: '案例研讨+演练' },
          { phase: '第4周', content: '形成性评价与行动计划', time: '周六 09:30-11:30', mode: '实操+反馈' }
        ],
        evaluation: [
          '学习时长与参与度达标',
          '提交教案与互动设计作业',
          '阶段测验与同伴互评',
          '行动计划落地与反思'
        ],
        recommendations: [
          '建立同伴互助机制与课堂任务清单',
          '提供差异化资源与分层任务设计模板',
          '跟进式督导与课后迁移应用支持',
          '形成可复用的教学改进闭环'
        ]
      };
      const merged = {
        ...defaults,
        ...(typeof rightPanelReportContent === 'object' ? rightPanelReportContent : {})
      };
      setReportData(merged);
      setRightPanelReportContent(merged);
      setIsStudyGuideView(false);
    }
  }, [rightPanelReportContent, rightPanelReportRecord, setRightPanelReportContent]);

  const onBack = () => {
    setRightPanelReportRecord(null);
    setRightPanelReportContent('');
    setRightPanelView(RIGHT_PANEL_VIEWS.OPERATIONS);
  };

  const sourceCount = Array.isArray(rightPanelReportRecord?.sourceRefs) ? rightPanelReportRecord.sourceRefs.length : 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
          <Space>
            <FileTextOutlined style={{ color: '#b08800' }} />
            <Text style={{ fontWeight: 600 }}>{reportData?.metadata?.title || '分析报告'}</Text>
          </Space>
        </Space>
        <Tag color="gold">{`基于${sourceCount}个来源`}</Tag>
      </div>

      <div style={{ padding: 12, overflow: 'auto', flex: 1 }}>
        {isStudyGuideView ? (
          <>
            <div style={{ background: '#111', color: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{reportData?.heroTitle}</div>
              <div style={{ color: '#bbb', marginTop: 4 }}>Based on {reportData?.basedOnSources} sources</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>简介</div>
              <Paragraph style={{ margin: 0 }}>{reportData?.intro}</Paragraph>
            </div>
          </>
        ) : (
          <Card style={{ marginBottom: 12 }}>
            <Row gutter={[16, 8]}>
              <Col span={8}><Space><CalendarOutlined /><Text>{reportData?.metadata?.generatedAt}</Text></Space></Col>
              <Col span={8}><Space><UserOutlined /><Text>{reportData?.summary?.audience}</Text></Space></Col>
              <Col span={8}><Space><CheckCircleOutlined /><Text>{reportData?.summary?.period}</Text></Space></Col>
            </Row>
            <Paragraph style={{ marginTop: 12 }}>{reportData?.summary?.objective}</Paragraph>
            <Space wrap>
              {(reportData?.summary?.methods || []).map((m, i) => (<Tag key={i}>{m}</Tag>))}
            </Space>
          </Card>
        )}

        {reportData?.keyPoints ? (
          <Card title="学习指南要点" style={{ marginBottom: 12 }}>
            <List
              dataSource={reportData?.keyPoints || []}
              renderItem={(kp) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 600 }}>{kp.title}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{(kp.items || []).join('、')}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        ) : (
          <Card title="培训内容结构" style={{ marginBottom: 12 }}>
            <List
              dataSource={reportData?.structure || []}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{(item.details || []).join('、')}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        )}

        {isStudyGuideView && Array.isArray(reportData?.sections) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reportData.sections.map((sec, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{idx + 1}. {sec.title}</div>
                <Paragraph style={{ margin: 0, marginBottom: 8 }}>{sec.content}</Paragraph>
                {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                  <List
                    dataSource={sec.bullets}
                    renderItem={(b) => (
                      <List.Item>
                        <Space>
                          <Tag>{b.text}</Tag>
                          {typeof b.percent === 'number' && (
                            <Text type="secondary">{b.percent}%</Text>
                          )}
                        </Space>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isStudyGuideView && reportData?.conclusion && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>结论与呼吁</div>
            <Paragraph style={{ margin: 0 }}>{reportData.conclusion}</Paragraph>
          </div>
        )}

        {reportData?.schedule && (
          <Card title="实施安排" style={{ marginBottom: 12 }}>
          <List
            grid={{ gutter: 12, column: 2 }}
            dataSource={reportData?.schedule || []}
            renderItem={(item) => (
              <List.Item>
                <Card size="small" bodyStyle={{ padding: 10 }}>
                  <Space direction="vertical" size={2}>
                    <Text strong>{item.phase}</Text>
                    <Text>{item.content}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time} · {item.mode}</Text>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
          </Card>
        )}

        {reportData?.evaluation && (
          <Card title="评价与改进" style={{ marginBottom: 12 }}>
            <List
              dataSource={reportData?.evaluation || []}
              renderItem={(it) => (
                <List.Item>
                  <Space>
                    <Progress type="circle" percent={100} size={20} />
                    <Text>{it}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        )}

        {reportData?.practiceList ? (
          <Card title="建议练习">
            <List
              dataSource={reportData?.practiceList || []}
              renderItem={(it) => (
                <List.Item>
                  <div>
                    <Text strong>{it.name}</Text>
                    <div style={{ color: '#666' }}>{it.description}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        ) : (
          <Card title="行动建议">
            <List
              dataSource={reportData?.recommendations || []}
              renderItem={(it) => (
                <List.Item>
                  <Text>{it}</Text>
                </List.Item>
              )}
            />
          </Card>
        )}

        {reportData?.classroomChecklist && (
          <Card title="课堂应用清单" style={{ marginTop: 12 }}>
            <List
              dataSource={reportData?.classroomChecklist || []}
              renderItem={(it) => (
                <List.Item>
                  <Text>{it}</Text>
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
