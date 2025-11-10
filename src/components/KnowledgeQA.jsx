import React, { useState } from 'react'
import { Input, Button, Card, List, Typography, Space, Tag, Dropdown, Switch } from 'antd'
import { UploadOutlined, EllipsisOutlined, FilePdfOutlined, FileWordOutlined, FilePptOutlined, FileTextOutlined, MenuOutlined, PictureOutlined, GlobalOutlined, ArrowRightOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons'
import './KnowledgeQA.css'

const { Title, Paragraph } = Typography

const KnowledgeQA = () => {
  // 更多菜单的状态
  const [model, setModel] = useState('auto'); // auto | doubao | doubao-deep
  const [useCompanyKnowledge, setUseCompanyKnowledge] = useState(true);
  // 左侧菜单收缩状态
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  const suggestions = [
    { title: '上传文件，让它充分理解', desc: '支持 Word / PDF / PPT 等常见格式', icon: <UploadOutlined /> },
    { title: '没有合适的资料？试试上传微文件并提问', desc: '快速构建知识点并提问，适配课堂与培训', icon: <FileTextOutlined /> }
  ]

  const recentDocs = [
    { title: '教学设计模板（新版）.docx', type: 'docx', time: '1天前' },
    { title: '新教师示范课案例.ppt', type: 'ppt', time: '2天前' },
    { title: '课堂管理要点.pdf', type: 'pdf', time: '3天前' },
    { title: '白板与多媒体应用指南.pdf', type: 'pdf', time: '5天前' }
  ]

  const renderFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FilePdfOutlined />
      case 'docx': return <FileWordOutlined />
      case 'ppt': return <FilePptOutlined />
      default: return <FileTextOutlined />
    }
  }

  // 历史对话主题与关联资料权限（与截图语义相关）
  const historyTopics = [
    {
      id: 'dify_tutorial',
      title: 'Dify使用教程｜从平台概述到应用搭建全解析',
      permissions: [
        '平台概览', 'Dify使用教程', '答题助手', '企业级应用集成平台', '智能评课系统-back',
        '后台知识库', '联网搜索', 'AI工具融合', '工作日程（2024年Q3）', '课堂IM及协作',
        '教学助手小插件集', '技术栈说明', 'Coze Studio User Group', '内容检索联动', 'PaaS介绍'
      ]
    },
    { id: 'tech_training', title: '技术培训课题·课堂讲解', permissions: ['课堂讲解', '技术培训大纲', '示范课录像', '课堂互动要点'] },
    { id: 'teacher_onboarding', title: '新教师岗前培训·教学方法入门', permissions: ['教学法入门', '课堂组织', '作业与反馈', '问答策略'] },
    { id: 'class_design', title: '新教师课堂设计·示范案例', permissions: ['教学目标', '教学流程', '板书设计', '多媒体素材'] },
    { id: 'class_mgmt', title: '新教师课堂管理·常见问题与策略', permissions: ['课堂纪律', '分组与座位', '提问与互动', '家校沟通'] },
    { id: 'semi_example', title: '半导体课程·新教师示例（连载）', permissions: ['芯片基础', '材料与工艺', '实验课要点', '作业批改'] },
    { id: 'it_whiteboard', title: '信息化教学·白板与多媒体', permissions: ['白板应用', '多媒体课件', '设备连接', '课堂演示'] },
    { id: 'career_growth', title: '职业发展·教师成长与发展', permissions: ['发展路径', '教研参与', '课堂反思', '成长档案'] },
    { id: 'special_prep', title: '专项备课·教研要点资料集', permissions: ['选题方向', '资料清单', '关键要点', '评估标准'] }
  ]

  // 模拟资料库与云盘的相关数据（用于授权卡片中的来源预览）
  const kbDocs = [
    { title: '白板与多媒体应用指南.pdf', type: 'pdf' },
    { title: '课堂互动操作手册.docx', type: 'docx' },
    { title: '课堂演示课件示例.ppt', type: 'ppt' },
    { title: '设备连接快速排查.txt', type: 'text' }
  ]
  const driveDocs = [
    { title: '培训日程与场地安排.docx', type: 'docx' },
    { title: '培训讲师资料清单.pdf', type: 'pdf' },
    { title: '示范课PPT（定稿）.ppt', type: 'ppt' }
  ]

  // 模拟各主题的多轮对话数据
  const topicConversations = {
    tech_training: [
      { role: 'user', text: '我们下周有新教师培训，如何安排课堂讲解？' },
      { role: 'assistant', text: '可以按“导入-讲解-演示-练习-总结”五段式来组织。' },
      { role: 'user', text: '讲解阶段建议控制在多久？' },
      { role: 'assistant', text: '核心知识点讲解8-12分钟较合适，中间穿插示例。' }
    ],
    dify_tutorial: [
      { role: 'user', text: '如何用 Dify 做一个回答学校政策的助手？' },
      { role: 'assistant', text: '先创建知识库，导入政策文档，再配置工作流与工具。' },
      { role: 'user', text: '知识库要如何分段？' },
      { role: 'assistant', text: '建议按章节与主题分段，保持每段500-1500字，便于检索。' }
    ],
    it_whiteboard: [
      { role: 'user', text: '多媒体白板无法投屏怎么办？' },
      { role: 'assistant', text: '检查连接线、输入源与网络；重启投屏接收端后再试。' }
    ],
    career_growth: [
      { role: 'user', text: '教师成长档案要记录哪些内容？' },
      { role: 'assistant', text: '包括教学反思、教研活动、公开课记录与培训证书等。' }
    ],
    special_prep: [
      { role: 'user', text: '我要组织一次专题备课，怎么确定选题？' },
      { role: 'assistant', text: '依据学情与课程标准，列出候选主题并评估教学价值。' }
    ]
  }

  // 视图状态：null 表示“新对话”默认页；选中主题时为对应 id
  const [activeTopicId, setActiveTopicId] = useState(null)
  const activeTopic = historyTopics.find(t => t.id === activeTopicId)
  const [selectedPerms, setSelectedPerms] = useState(new Set())

  const onSelectTopic = (topic) => {
    setActiveTopicId(topic.id)
    setSelectedPerms(new Set((topic.permissions || []).slice(0, 8)))
  }
  const resetToNewConversation = () => {
    setActiveTopicId(null)
    setSelectedPerms(new Set())
  }
  const togglePerm = (name) => {
    setSelectedPerms(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name); else next.add(name)
      return next
    })
  }

  // 更多菜单内容
  const moreMenu = (
    <div className="qa-more-menu">
      <div className="qa-more-group">
        <div className="qa-more-title">选择模型</div>
        <button
          className={`qa-more-item ${model === 'auto' ? 'active' : ''}`}
          onClick={() => setModel('auto')}
        >
          <span>自动</span>
          {model === 'auto' && <CheckOutlined className="qa-more-check" />}
        </button>
        <button
          className={`qa-more-item ${model === 'doubao' ? 'active' : ''}`}
          onClick={() => setModel('doubao')}
        >
          <span>豆包</span>
          {model === 'doubao' && <CheckOutlined className="qa-more-check" />}
        </button>
        <button
          className={`qa-more-item ${model === 'doubao-deep' ? 'active' : ''}`}
          onClick={() => setModel('doubao-deep')}
        >
          <span>豆包深度思考</span>
          {model === 'doubao-deep' && <CheckOutlined className="qa-more-check" />}
        </button>
      </div>

      <div className="qa-more-divider" />

      <div className="qa-more-group">
        <div className="qa-more-title">知识范围</div>
        <div className="qa-more-row">
          <span>使用企业知识</span>
          <Switch
            checked={useCompanyKnowledge}
            onChange={(v) => setUseCompanyKnowledge(v)}
            size="small"
          />
        </div>
        <button className="qa-more-item">
          <span>指定知识范围</span>
          <RightOutlined className="qa-more-arrow" />
        </button>
      </div>
    </div>
  );

  // 取首条用户消息以及剩余消息
  const getFirstUserAndRest = () => {
    const arr = topicConversations[activeTopicId] || []
    const idx = arr.findIndex(m => m.role === 'user')
    const first = idx >= 0 ? arr[idx] : null
    const rest = idx >= 0 ? arr.slice(idx + 1) : arr
    return { first, rest }
  }

  return (
    <div className="qa-page">
      <div className={'qa-layout with-left'}>
        {!leftCollapsed && (
          <aside className={`qa-left-menu`}>
            <div className="qa-left-header">
              <button
                className="qa-menu-toggle"
                aria-label={leftCollapsed ? '展开侧栏' : '收缩侧栏'}
                onClick={() => setLeftCollapsed((v) => !v)}
              >
                <MenuOutlined />
              </button>
              <span className="qa-left-title">知识问答</span>
            </div>
            <div className="qa-left-top">
              <div
                className={`qa-left-item ${activeTopicId === null ? 'active' : ''}`}
                onClick={resetToNewConversation}
              >新对话</div>
              <div className="qa-left-item">知识库</div>
            </div>

              <div className="qa-left-section">
                <div className="qa-left-section-title">历史对话</div>
                <div className="qa-left-list">
                  {historyTopics.map((t) => (
                    <div
                      key={t.id}
                      className={`qa-left-list-item ${activeTopicId === t.id ? 'active' : ''}`}
                      title={t.title}
                      onClick={() => onSelectTopic(t)}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>

              <div className="qa-left-bottom">
                <a href="#">提交反馈</a>
              </div>
          </aside>
        )}

        <main className="qa-right">
          {leftCollapsed && (
            <div className="qa-right-header">
              <button
                className="qa-menu-toggle"
                aria-label={'展开侧栏'}
                onClick={() => setLeftCollapsed(false)}
              >
                <MenuOutlined />
              </button>
              <span className="qa-right-title">知识问答</span>
            </div>
          )}
          <div className="qa-content">
            {activeTopicId === null ? (
              <>
                <div className="qa-hero">
                  <div className="qa-logo" />
                  <Title level={3} className="qa-title">知识问答</Title>
                  <Paragraph className="qa-subtitle">智能合作的知识引擎，汇聚你的内容，AI 直达答案</Paragraph>
                </div>

                <div className="qa-query">
                  <div className="qa-query-inner">
                    <div className="qa-query-top">
                      <Input.TextArea
                        className="qa-query-textarea"
                        placeholder="问个问题，或用知识写点内容"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                      />
                    </div>
                    <div className="qa-query-actions">
                      <div className="qa-query-left">
                        <button className="qa-icon-btn" aria-label="插入图片"><PictureOutlined /></button>
                        <div className="qa-pill"><GlobalOutlined /> 联网搜索</div>
                      </div>
                      <div className="qa-query-right">
                        <Dropdown overlay={moreMenu} trigger={["click"]} placement="bottomRight">
                          <button className="qa-icon-btn" aria-label="更多选项"><EllipsisOutlined /></button>
                        </Dropdown>
                        <button className="qa-send-btn" aria-label="发送"><ArrowRightOutlined /></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="qa-bottom">
                  <div className="qa-upload-card">
                    <div className="qa-upload-left">
                      <div className="qa-upload-title">上传文件<br/>让知识为你所用</div>
                      <div className="qa-upload-desc">支持文本、录音和视频等多种类型</div>
                      <div className="qa-upload-actions">
                        <button className="qa-pill-btn">本地上传</button>
                        <button className="qa-pill-btn">微信导入</button>
                      </div>
                    </div>
                    <div className="qa-upload-right">
                      <div className="qa-doc-stack">
                        <span className="qa-doc-chip word"><FileWordOutlined /></span>
                        <span className="qa-doc-chip ppt"><FilePptOutlined /></span>
                        <span className="qa-doc-chip text"><FileTextOutlined /></span>
                      </div>
                    </div>
                  </div>

                  <div className="qa-interest-card">
                    <div className="qa-interest-title">你可能感兴趣</div>
                    <div className="qa-interest-list">
                      {recentDocs.slice(0,4).map((item, idx) => (
                        <div className="qa-interest-item" key={idx}>
                          <div className="qa-interest-left">
                            {renderFileIcon(item.type)}
                            <span className="qa-interest-text">{item.title}</span>
                          </div>
                          <RightOutlined className="qa-interest-arrow" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {getFirstUserAndRest().first && (
                  <div className="qa-conversation qa-first">
                    <div className="qa-msg user">
                      <div className="qa-bubble">
                        <span className="qa-bubble-text">{getFirstUserAndRest().first.text}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="qa-permission-card">
                  <div className="qa-permission-title">正在等待授权</div>
                  <div className="qa-permission-tags">
                    {(activeTopic?.permissions || []).map(name => (
                      <label key={name} className={`qa-tag-toggle ${selectedPerms.has(name) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedPerms.has(name)}
                          onChange={() => togglePerm(name)}
                        />
                        <span>{name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="qa-permission-actions">
                    <button className="qa-pill-btn">使用资料继续生成</button>
                  </div>
                  <Paragraph className="qa-permission-note">
                    继续生成代表你同意 AI 使用以上资料进行回答，资料不会被 AI 学习，也不会用于模型训练，仅用于为你定制回答。请放心使用。如不同意，也可以用 联网搜索 生成答案。
                  </Paragraph>
                  <div className="qa-checkbox-row">
                    <label>
                      <input type="checkbox" /> 总是允许 AI 使用资料生成
                    </label>
                  </div>

                  {/* 数据来源预览：资料库与云盘 */}
                  <div className="qa-source-preview">
                    <div className="qa-source-section">
                      <div className="qa-source-title">资料库</div>
                      <div className="qa-source-list">
                        {kbDocs.map((d, i) => (
                          <div key={i} className="qa-source-chip" title={d.title}>
                            {renderFileIcon(d.type)}
                            <span className="qa-source-name">{d.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="qa-source-section">
                      <div className="qa-source-title">云盘</div>
                      <div className="qa-source-list">
                        {driveDocs.map((d, i) => (
                          <div key={i} className="qa-source-chip" title={d.title}>
                            {renderFileIcon(d.type)}
                            <span className="qa-source-name">{d.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 历史视图：多轮对话展示（除首条用户消息） */}
                <div className="qa-conversation">
                  {(getFirstUserAndRest().rest.length ? getFirstUserAndRest().rest : [
                    { role: 'assistant', text: '暂无历史消息，可在下方继续提问。' }
                  ]).map((m, idx) => (
                    <div key={idx} className={`qa-msg ${m.role}`}>
                      <div className="qa-bubble">
                        <span className="qa-bubble-text">{m.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* 历史视图输入区固定在底部 */}
          {activeTopicId !== null && (
            <div className="qa-query">
              <div className="qa-query-inner">
                <div className="qa-query-top">
                  <Input.TextArea
                    className="qa-query-textarea"
                    placeholder="问个问题，或用知识写点内容"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </div>
                <div className="qa-query-actions">
                  <div className="qa-query-left">
                    <button className="qa-icon-btn" aria-label="插入图片"><PictureOutlined /></button>
                    <div className="qa-pill"><GlobalOutlined /> 联网搜索</div>
                  </div>
                  <div className="qa-query-right">
                    <Dropdown overlay={moreMenu} trigger={["click"]} placement="bottomRight">
                      <button className="qa-icon-btn" aria-label="更多选项"><EllipsisOutlined /></button>
                    </Dropdown>
                    <button className="qa-send-btn" aria-label="发送"><ArrowRightOutlined /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default KnowledgeQA