import React, { useState } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { Layout, Menu, Button, Typography, Card, Row, Col, Tag, Divider, Space, Tabs, Collapse, Image, Timeline } from 'antd'
import { 
  RocketOutlined, AppstoreOutlined, ExperimentOutlined, DownloadOutlined, 
  QuestionCircleOutlined, PhoneOutlined, BookOutlined, HomeOutlined, ApiOutlined, 
  SettingOutlined, TeamOutlined, CloudServerOutlined, ThunderboltOutlined,
  BulbOutlined, DatabaseOutlined, ShareAltOutlined, SafetyOutlined,
  CheckCircleOutlined, StarOutlined, GlobalOutlined, ToolOutlined,
  UserOutlined, FileTextOutlined, MessageOutlined, VideoCameraOutlined,
  RobotOutlined, FundOutlined, SyncOutlined, EyeOutlined,
  PartitionOutlined, CompassOutlined, FormOutlined, ReadOutlined,
  ControlOutlined, InteractionOutlined, BranchesOutlined,
  CalendarOutlined, CloseCircleOutlined, BgColorsOutlined
} from '@ant-design/icons'
import './website.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const Home = () => (
  <div>
    {/* Hero Section */}
    <div className="hero">
      <div className="hero-content">
        <div className="brand-tag">
          <Tag color="purple" icon={<StarOutlined />}>国人通旗下品牌</Tag>
        </div>
        <h1 className="hero-title">果仁</h1>
        <h2 className="hero-subtitle-main">AI 原生的学习与工作空间</h2>
        <p className="hero-description">
          集培训学习、深度研究及内容创作于一身<br/>
          打造沉浸式、协同化、智能化的平台级学习生态
        </p>
        <div className="hero-features">
          <Space size="large" wrap>
            <div className="feature-tag">
              <RobotOutlined /> AI 原生驱动
            </div>
            <div className="feature-tag">
              <CloudServerOutlined /> PWA 原生体验
            </div>
            <div className="feature-tag">
              <ShareAltOutlined /> 共享协同
            </div>
            <div className="feature-tag">
              <PartitionOutlined /> 生态完善
            </div>
          </Space>
        </div>
        <div className="cta-buttons">
          <Button type="primary" size="large" icon={<RocketOutlined />} href="/">
            立即体验
          </Button>
          <Button size="large" icon={<EyeOutlined />} href="https://guoren-view.grtcloud.net/" target="_blank">
            查看演示
          </Button>
          <Button size="large" icon={<ReadOutlined />}>
            <Link to="/positioning">了解更多</Link>
          </Button>
        </div>
      </div>
    </div>

    {/* 品牌理念 */}
    <div className="content-section brand-section">
      <div className="section-header">
        <Title level={2}>品牌理念</Title>
        <Paragraph className="section-desc">
          果仁,国人通旗下子品牌,如同字节跳动的豆包,名称亲和、顺口、易记,利于传播
        </Paragraph>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="feature-card" hoverable>
            <BulbOutlined className="feature-icon" style={{color: '#1890ff'}} />
            <Title level={4}>亲和易记</Title>
            <Paragraph>品牌名称简洁温暖,顺口好记,降低认知成本,提升传播效率</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="feature-card" hoverable>
            <GlobalOutlined className="feature-icon" style={{color: '#52c41a'}} />
            <Title level={4}>国民体验</Title>
            <Paragraph>借鉴企业微信、飞书、钉钉等国民级应用设计,熟悉的操作,零学习成本</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="feature-card" hoverable>
            <RobotOutlined className="feature-icon" style={{color: '#722ed1'}} />
            <Title level={4}>AI 原生</Title>
            <Paragraph>参考 Google NotebookLLM,AI 与用户内容深度交互,重新定义工作学习方式</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>

    {/* 核心价值 */}
    <div className="content-section value-section">
      <div className="section-header">
        <Title level={2}>核心价值</Title>
        <Paragraph className="section-desc">
          轻量化小组织培训的最佳选择,学习公社的增值利器
        </Paragraph>
      </div>
      <div style={{maxWidth: 1200, margin: '0 auto'}}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <div className="value-item">
              <div className="value-icon"><TeamOutlined /></div>
              <Title level={4}>培训学习</Title>
              <Text>组织培训全流程管理</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="value-item">
              <div className="value-icon"><FundOutlined /></div>
              <Title level={4}>深度研究</Title>
              <Text>知识管理与研究协作</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="value-item">
              <div className="value-icon"><FormOutlined /></div>
              <Title level={4}>内容创作</Title>
              <Text>AI 辅助创作与协同编辑</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="value-item">
              <div className="value-icon"><ShareAltOutlined /></div>
              <Title level={4}>共享生态</Title>
              <Text>开放平台与资源共享</Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>

    {/* 产品亮点快速浏览 */}
    <div className="content-section highlights-preview">
      <div className="section-header">
        <Title level={2}>产品亮点</Title>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            className="highlight-card"
            title={<><ThunderboltOutlined /> AI 原生设计</>}
            extra={<Tag color="magenta">智能化</Tag>}
          >
            <Paragraph>
              借鉴 Google NotebookLLM 交互理念,AI 洞察需求、生成方案、规划路径,
              从培训组织到学习分析全程赋能,实现人机协同的智能工作流
            </Paragraph>
            <div className="tech-tags">
              <Tag>AI 生成培训方案</Tag>
              <Tag>智能学习路径</Tag>
              <Tag>效果智能分析</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            className="highlight-card"
            title={<><CloudServerOutlined /> 系统原生体验</>}
            extra={<Tag color="blue">原生化</Tag>}
          >
            <Paragraph>
              PWA 技术打造原生级体验,轻量安装、离线访问、收藏视图,
              随时随地进入果仁空间,体验流畅不打折
            </Paragraph>
            <div className="tech-tags">
              <Tag>一键安装</Tag>
              <Tag>离线能力</Tag>
              <Tag>原生体验</Tag>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    {/* 快速跳转 */}
    <div className="content-section quick-links">
      <div style={{maxWidth: 1200, margin: '0 auto'}}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={12} sm={6} md={6}>
            <Link to="/features">
              <Card hoverable className="quick-link-card">
                <AppstoreOutlined className="quick-icon" />
                <div>核心功能</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Link to="/scenarios">
              <Card hoverable className="quick-link-card">
                <ExperimentOutlined className="quick-icon" />
                <div>应用场景</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Link to="/usecases">
              <Card hoverable className="quick-link-card">
                <BookOutlined className="quick-icon" />
                <div>用例展示</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Link to="/download">
              <Card hoverable className="quick-link-card">
                <DownloadOutlined className="quick-icon" />
                <div>立即使用</div>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  </div>
)

// 功能概述页面
const Features = () => (
  <div className="content-section features-page">
    <div className="section-header">
      <Title level={2}>核心功能</Title>
      <Paragraph className="section-desc">
        为培训学习提供全方位支持,从内容管理到智能分析
      </Paragraph>
    </div>

    {/* 三大功能中心 */}
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card 
          className="feature-module-card"
          title={<><RobotOutlined /> AI 操作面板</>}
          extra={<Tag color="purple">AI 驱动</Tag>}
        >
          <Paragraph>
            对用户来源进行智能加工处理,集中输出成果。
            支持多模态输入、智能解析、内容生成。
          </Paragraph>
          <div className="feature-list">
            <div><CheckCircleOutlined /> 多模态内容识别</div>
            <div><CheckCircleOutlined /> AI 辅助分析与总结</div>
            <div><CheckCircleOutlined /> 智能方案生成</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card 
          className="feature-module-card"
          title={<><FileTextOutlined /> 笔记管理</>}
          extra={<Tag color="blue">知识沉淀</Tag>}
        >
          <Paragraph>
            集中输出成果的笔记管理中心,支持边学边记、
            AI 协同编辑、多维度组织与分享。
          </Paragraph>
          <div className="feature-list">
            <div><CheckCircleOutlined /> 边学边记笔记</div>
            <div><CheckCircleOutlined /> AI 协同编辑</div>
            <div><CheckCircleOutlined /> 主题式整合</div>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card 
          className="feature-module-card"
          title={<><TeamOutlined /> AI 智能体</>}
          extra={<Tag color="green">智能问答</Tag>}
        >
          <Paragraph>
            借助多模态识别能力答疑解惑,并收录回答。
            支持自定义工具、知识库配置。
          </Paragraph>
          <div className="feature-list">
            <div><CheckCircleOutlined /> 多模态识别</div>
            <div><CheckCircleOutlined /> 知识库问答</div>
            <div><CheckCircleOutlined /> 智能体配置</div>
          </div>
        </Card>
      </Col>
    </Row>

    <Divider />

    {/* 全功能模块 */}
    <Title level={3}>全功能模块</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <MessageOutlined className="function-icon" style={{color: '#1890ff'}} />
          <Title level={4}>消息中心与协作</Title>
          <Paragraph>
            联系人目录、群组与主题讨论,整合知识问答与 AI 助手,
            支持主题式沟通与资料沉淀。
          </Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <DatabaseOutlined className="function-icon" style={{color: '#52c41a'}} />
          <Title level={4}>资源与文档</Title>
          <Paragraph>
            资源库、注释与标签体系,支持组织与个人文档中心,
            围绕主题整合资料与成果。
          </Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <FundOutlined className="function-icon" style={{color: '#722ed1'}} />
          <Title level={4}>学习分析</Title>
          <Paragraph>
            进度、成就与评估中心,可视化看板与报表,
            AI 驱动的学习效果洞察。
          </Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <ExperimentOutlined className="function-icon" style={{color: '#fa8c16'}} />
          <Title level={4}>模拟平台</Title>
          <Paragraph>
            场景库与模拟平台,沉浸式教学与训练,
            支持多模态识别与仿真演练。
          </Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <VideoCameraOutlined className="function-icon" style={{color: '#eb2f96'}} />
          <Title level={4}>会议中心</Title>
          <Paragraph>
            会议管理、日程集成与分享机制,
            支持直播回放与协同编辑。
          </Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card hoverable className="function-card">
          <ToolOutlined className="function-icon" style={{color: '#13c2c2'}} />
          <Title level={4}>智能工具集</Title>
          <Paragraph>
            多维度支持、工具打通、工作流衔接,
            构建个人操作系统。
          </Paragraph>
        </Card>
      </Col>
    </Row>
  </div>
)

// 场景页面
const Scenarios = () => (
  <div className="content-section scenarios-page">
    <div className="section-header">
      <Title level={2}>应用场景</Title>
      <Paragraph className="section-desc">
        为不同角色、不同场景提供全面支持
      </Paragraph>
    </div>
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <TeamOutlined className="scenario-icon" style={{color: '#1890ff'}} />
            <Title level={4}>组织培训</Title>
          </div>
          <Paragraph>
            学员、评阅老师、培训组织者全流程协同,
AI 生成培训方案、配置教学活动。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="blue">方案生成</Tag>
            <Tag color="cyan">活动配置</Tag>
            <Tag color="geekblue">过程管理</Tag>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <ReadOutlined className="scenario-icon" style={{color: '#52c41a'}} />
            <Title level={4}>教研室</Title>
          </div>
          <Paragraph>
            主题驱动的资料整合与成果管理,
            知识空间沉淀与共享。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="green">资料整合</Tag>
            <Tag color="lime">成果管理</Tag>
            <Tag color="cyan">知识共享</Tag>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <GlobalOutlined className="scenario-icon" style={{color: '#722ed1'}} />
            <Title level={4}>学习广场</Title>
          </div>
          <Paragraph>
            主题共享营造学习氛围,
            直播回放与 AI 笔记协同编辑。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="purple">主题共享</Tag>
            <Tag color="magenta">直播回放</Tag>
            <Tag color="geekblue">AI 笔记</Tag>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <DatabaseOutlined className="scenario-icon" style={{color: '#fa8c16'}} />
            <Title level={4}>知识空间</Title>
          </div>
          <Paragraph>
            多平台来源支持,开放能力与工具打通,
            打造个人操作系统。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="orange">多平台</Tag>
            <Tag color="gold">工具打通</Tag>
            <Tag color="volcano">知识库</Tag>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <FormOutlined className="scenario-icon" style={{color: '#eb2f96'}} />
            <Title level={4}>课程开发</Title>
          </div>
          <Paragraph>
            资源标注与人员标注支持,
            支撑课程研发工作流。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="magenta">资源标注</Tag>
            <Tag color="pink">人员标注</Tag>
            <Tag color="red">工作流</Tag>
          </div>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card className="scenario-card" hoverable>
          <div className="scenario-header">
            <ExperimentOutlined className="scenario-icon" style={{color: '#13c2c2'}} />
            <Title level={4}>场景仿真</Title>
          </div>
          <Paragraph>
            沉浸式仿真模拟演练,
            支持虚拟现实与边学边记。
          </Paragraph>
          <div className="scenario-tags">
            <Tag color="cyan">仿真模拟</Tag>
            <Tag color="blue">虚拟现实</Tag>
            <Tag color="geekblue">交互演练</Tag>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
)

// 产品展示页面
const Showcase = () => (
  <div className="content-section showcase-page">
    <div className="section-header">
      <Title level={2}>产品展示</Title>
      <Paragraph className="section-desc">
        直观了解果仁的界面和交互体验
      </Paragraph>
    </div>

    <Card className="demo-card">
      <Title level={4}>🖼️ 产品截图</Title>
      <Paragraph>
        以下展示果仁的核心界面与功能模块 (后续添加实际截图)
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card size="small" title="主界面" hoverable>
            <div style={{height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text type="secondary">主界面截图占位</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="AI 操作面板" hoverable>
            <div style={{height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text type="secondary">AI 面板截图占位</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="学习分析" hoverable>
            <div style={{height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text type="secondary">分析界面截图占位</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="协作功能" hoverable>
            <div style={{height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text type="secondary">协作界面截图占位</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>

    <Divider />

    <Card className="video-card">
      <Title level={4}>🎥 产品演示视频</Title>
      <Paragraph>
        观看视频了解果仁的完整功能 (后续添加视频)
      </Paragraph>
      <div style={{height: 400, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8}}>
        <Text style={{color: '#fff'}}>产品演示视频占位</Text>
      </div>
    </Card>

    <Divider />

    <div style={{textAlign: 'center'}}>
      <Button type="primary" size="large" icon={<EyeOutlined />} href="https://guoren-view.grtcloud.net/" target="_blank">
        体验在线演示
      </Button>
    </div>
  </div>
)

// 产品演示页面  
const Demo = () => (
  <div className="content-section demo-page">
    <div className="section-header">
      <Title level={2}>产品演示</Title>
      <Paragraph className="section-desc">
        访问在线原型,亲身体验果仁的强大功能
      </Paragraph>
    </div>

    <Card className="demo-intro-card">
      <Title level={3}>🎉 在线原型体验</Title>
      <Paragraph>
        我们提供了在线原型系统,您可以直接体验果仁的核心功能,无需安装。
      </Paragraph>
      <div style={{textAlign: 'center', margin: '32px 0'}}>
        <Button 
          type="primary" 
          size="large" 
          icon={<RocketOutlined />} 
          href="https://guoren-view.grtcloud.net/" 
          target="_blank"
          style={{height: 56, fontSize: 18, padding: '0 48px'}}
        >
          打开原型演示
        </Button>
      </div>
    </Card>

    <Divider />

    <Title level={3}>📝 体验指南</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card size="small">
          <Title level={5}>1、探索主界面</Title>
          <Text>熟悉工作台布局、菜单功能、快捷操作</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small">
          <Title level={5}>2、体验 AI 功能</Title>
          <Text>尝试 AI 生成、AI 问答、智能分析等功能</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small">
          <Title level={5}>3、测试协作</Title>
          <Text>创建主题、分享内容、多人编辑</Text>
        </Card>
      </Col>
    </Row>
  </div>
)

// 产品定位页面
const Positioning = () => (
  <div className="content-section positioning-page">
    <div className="section-header">
      <Title level={2}>产品定位</Title>
      <Paragraph className="section-desc">
        果仁是什么?它能为你带来什么价值?
      </Paragraph>
    </div>

    <Card className="positioning-card">
      <Title level={3}>🎓 平台定位</Title>
      <Paragraph>
        果仁是集 <Text strong>培训学习</Text>、<Text strong>深度研究</Text>及<Text strong>内容创作</Text> 于一身,
        具备 <Text strong>AI 原生属性</Text> 的平台。
      </Paragraph>
      <Paragraph>
        强调 <Text mark>共享与协同</Text>,构建完善生态体系,打造 AI 原生实用的沉浸式工作与学习空间。
      </Paragraph>
    </Card>

    <Row gutter={[24, 24]} style={{marginTop: 24}}>
      <Col xs={24} md={12}>
        <Card title="🎯 目标用户" className="target-card">
          <Timeline>
            <Timeline.Item dot={<TeamOutlined />} color="blue">
              <Text strong>轻量化小组织培训</Text>
              <br/>为小型培训组织提供一站式解决方案
            </Timeline.Item>
            <Timeline.Item dot={<ShareAltOutlined />} color="green">
              <Text strong>学习公社增值项</Text>
              <br/>增强学习公社的协作与管理能力
            </Timeline.Item>
            <Timeline.Item dot={<GlobalOutlined />} color="purple">
              <Text strong>平台级别发展</Text>
              <br/>构建开放生态,面向更广阔用户群体
            </Timeline.Item>
          </Timeline>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="💡 核心价值" className="value-card">
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>AI 原生驱动:</Text> 智能化贯穿培训全流程
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>沉浸式体验:</Text> 一站式整合,一致性体验
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>协同与共享:</Text> 构建开放学习生态
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>多维度支持:</Text> 多模态、多来源、多场景
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  </div>
)

// 产品特点页面
const Highlights = () => (
  <div className="content-section highlights-page">
    <div className="section-header">
      <Title level={2}>产品特点</Title>
      <Paragraph className="section-desc">
        从 AI 驱动到生态完善,全方位打造智能学习平台
      </Paragraph>
    </div>

    <Tabs defaultActiveKey="1" items={[
      {
        key: '1',
        label: <span><ThunderboltOutlined /> AI 驱动</span>,
        children: (
          <Card>
            <Title level={4}>🤖 AI 原生 / AI 驱动</Title>
            <Paragraph>
              以 AI 洞察需求为导向,贯穿组织培训、学习计划、学习效果等方面。
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" className="sub-feature-card">
                  <RobotOutlined className="sub-icon" />
                  <Title level={5}>AI 生成培训方案</Title>
                  <Text>智能分析需求,自动生成个性化培训方案</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" className="sub-feature-card">
                  <CompassOutlined className="sub-icon" />
                  <Title level={5}>规划学习路径</Title>
                  <Text>根据用户特点,智能规划个性化学习路径</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" className="sub-feature-card">
                  <FundOutlined className="sub-icon" />
                  <Title level={5}>学习效果分析</Title>
                  <Text>AI 驱动的效果评估与改进建议</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        )
      },
      {
        key: '2',
        label: <span><CloudServerOutlined /> 原生体验</span>,
        children: (
          <Card>
            <Title level={4}>📱 系统原生应用体验</Title>
            <Paragraph>
              PWA 技术打造原生化体验、访问轻量化、功能完善化。
            </Paragraph>
            <Space direction="vertical" size="middle" style={{width: '100%'}}>
              <Card size="small">
                <DownloadOutlined style={{marginRight: 8, color: '#1890ff'}} />
                <Text strong>一键安装:</Text> 浏览器地址栏一键安装,如原生 APP 体验
              </Card>
              <Card size="small">
                <SyncOutlined style={{marginRight: 8, color: '#52c41a'}} />
                <Text strong>离线能力:</Text> 支持离线访问,数据同步无障碍
              </Card>
              <Card size="small">
                <StarOutlined style={{marginRight: 8, color: '#faad14'}} />
                <Text strong>收藏视图:</Text> 便捷访问,随时随地进入果仁空间
              </Card>
            </Space>
          </Card>
        )
      },
      {
        key: '3',
        label: <span><InteractionOutlined /> 工作方式</span>,
        children: (
          <Card>
            <Title level={4}>🖄️ 改变工作学习方式</Title>
            <Paragraph>
              从信息获取、笔记记录、知识管理到学习感知,全面提升体验。
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Timeline>
                  <Timeline.Item color="blue">
                    <Text strong>人机协同获取信息</Text>
                    <br/>AI 辅助信息检索与筛选
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>边学边记笔记</Text>
                    <br/>实时记录,知识沉淀
                  </Timeline.Item>
                  <Timeline.Item color="purple">
                    <Text strong>知识管理与分享</Text>
                    <br/>主题式整合,便捷共享
                  </Timeline.Item>
                </Timeline>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <CheckCircleOutlined style={{color: '#52c41a'}} />
                  <Text> 智能推荐相关内容</Text>
                </Card>
                <Card size="small" style={{marginTop: 12}}>
                  <CheckCircleOutlined style={{color: '#52c41a'}} />
                  <Text> AI 辅助笔记整理</Text>
                </Card>
                <Card size="small" style={{marginTop: 12}}>
                  <CheckCircleOutlined style={{color: '#52c41a'}} />
                  <Text> 学习过程可视化</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        )
      },
      {
        key: '4',
        label: <span><PartitionOutlined /> 主题整合</span>,
        children: (
          <Card>
            <Title level={4}>📚 主题式资料整合</Title>
            <Paragraph>
              围绕主题整合资料与成果,以主题单元驱动活动,贴合常规思维习惯。
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" className="theme-card">
                  <PartitionOutlined className="theme-icon" />
                  <Title level={5}>主题驱动</Title>
                  <Text>以主题为中心组织所有内容</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" className="theme-card">
                  <DatabaseOutlined className="theme-icon" />
                  <Title level={5}>资料汇聚</Title>
                  <Text>自动聚合相关资源与成果</Text>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" className="theme-card">
                  <ShareAltOutlined className="theme-icon" />
                  <Title level={5}>共享协作</Title>
                  <Text>团队协同编辑与分享</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        )
      },
      {
        key: '5',
        label: <span><GlobalOutlined /> 多维支持</span>,
        children: (
          <Card>
            <Title level={4}>🌐 多维度支持</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="丰富来源支持" size="small">
                  <Space wrap>
                    <Tag color="blue">多平台接入</Tag>
                    <Tag color="green">本地文件</Tag>
                    <Tag color="purple">网络资源</Tag>
                    <Tag color="orange">API 集成</Tag>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="多维度管理" size="small">
                  <Space wrap>
                    <Tag color="cyan">标签分类</Tag>
                    <Tag color="geekblue">时间线</Tag>
                    <Tag color="magenta">主题聚合</Tag>
                    <Tag color="red">关系图谱</Tag>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="多模态识别" size="small">
                  <Space wrap>
                    <Tag>文本</Tag>
                    <Tag>图片</Tag>
                    <Tag>音频</Tag>
                    <Tag>视频</Tag>
                    <Tag>文档</Tag>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="场景仿真" size="small">
                  <Space wrap>
                    <Tag color="volcano">物理实验</Tag>
                    <Tag color="orange">化学模拟</Tag>
                    <Tag color="gold">生物演示</Tag>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        )
      },
      {
        key: '6',
        label: <span><EyeOutlined /> 沉浸体验</span>,
        children: (
          <Card>
            <Title level={4}>🎯 沉浸式学习营造</Title>
            <Paragraph>
              以用户为核心构建,一站式整合资源,确保一致用户体验。
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small">
                  <UserOutlined style={{marginRight: 8}} />
                  <Text strong>以用户为中心:</Text> 个性化界面与功能定制
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <AppstoreOutlined style={{marginRight: 8}} />
                  <Text strong>一站式整合:</Text> 所有资源功能集一处
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <ShareAltOutlined style={{marginRight: 8}} />
                  <Text strong>主题共享:</Text> 学习广场营造学习氛围
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <VideoCameraOutlined style={{marginRight: 8}} />
                  <Text strong>直播回放:</Text> AI 笔记协同编辑
                </Card>
              </Col>
            </Row>
          </Card>
        )
      }
    ]} />
  </div>
)

// 平台生态页面
const Ecosystem = () => (
  <div className="content-section ecosystem-page">
    <div className="section-header">
      <Title level={2}>平台生态</Title>
      <Paragraph className="section-desc">
        开放、共享、协作,构建完善的学习生态系统
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12} lg={6}>
        <Card className="eco-card" hoverable>
          <GlobalOutlined className="eco-icon" style={{color: '#1890ff'}} />
          <Title level={4}>多平台来源</Title>
          <Paragraph>
            支持从多个平台导入内容,打破信息孤岛。
          </Paragraph>
          <Space wrap>
            <Tag>Web</Tag>
            <Tag>本地文件</Tag>
            <Tag>API</Tag>
            <Tag>云存储</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card className="eco-card" hoverable>
          <ApiOutlined className="eco-icon" style={{color: '#52c41a'}} />
          <Title level={4}>开放平台</Title>
          <Paragraph>
            开放 API 和能力,支持第三方集成。
          </Paragraph>
          <Space wrap>
            <Tag>API</Tag>
            <Tag>SDK</Tag>
            <Tag>Webhook</Tag>
            <Tag>插件</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card className="eco-card" hoverable>
          <ShareAltOutlined className="eco-icon" style={{color: '#722ed1'}} />
          <Title level={4}>学习广场</Title>
          <Paragraph>
            知识资源共享,营造学习社区氛围。
          </Paragraph>
          <Space wrap>
            <Tag>主题广场</Tag>
            <Tag>资源共享</Tag>
            <Tag>交流讨论</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card className="eco-card" hoverable>
          <ToolOutlined className="eco-icon" style={{color: '#fa8c16'}} />
          <Title level={4}>工具集成</Title>
          <Paragraph>
            内置丰富工具,打造个人操作系统。
          </Paragraph>
          <Space wrap>
            <Tag>AI 工具</Tag>
            <Tag>编辑器</Tag>
            <Tag>图表</Tag>
            <Tag>模拟器</Tag>
          </Space>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Title level={3}>🌐 生态优势</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card size="small" className="advantage-card">
          <CheckCircleOutlined style={{color: '#52c41a', fontSize: 24, marginBottom: 12}} />
          <Title level={5}>丰富的资源生态</Title>
          <Text>数万课程、资源、模板供用户选择</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className="advantage-card">
          <CheckCircleOutlined style={{color: '#52c41a', fontSize: 24, marginBottom: 12}} />
          <Title level={5}>活跃的开发者社区</Title>
          <Text>持续有新功能、插件和模板推出</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className="advantage-card">
          <CheckCircleOutlined style={{color: '#52c41a', fontSize: 24, marginBottom: 12}} />
          <Title level={5}>完善的服务支持</Title>
          <Text>文档、教程、社区、客服全方位支持</Text>
        </Card>
      </Col>
    </Row>
  </div>
)

// 定制化页面
const Customization = () => (
  <div className="content-section customization-page">
    <div className="section-header">
      <Title level={2}>高度定制化</Title>
      <Paragraph className="section-desc">
        满足组织和个人的差异化需求
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card 
          className="custom-card"
          title={<><SettingOutlined /> 菜单栏定制</>}
        >
          <Paragraph>
            自定义菜单项、排序、图标,打造个性化导航。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Tag color="blue">菜单项自定义</Tag>
            <Tag color="cyan">顺序调整</Tag>
            <Tag color="geekblue">图标更换</Tag>
            <Tag color="purple">快捷键设置</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card 
          className="custom-card"
          title={<><AppstoreOutlined /> 果仁空间定制</>}
        >
          <Paragraph>
            自定义空间分类、布局、视图,构建专属工作台。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Tag color="green">分类管理</Tag>
            <Tag color="lime">布局设计</Tag>
            <Tag color="cyan">视图配置</Tag>
            <Tag color="blue">模板保存</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card 
          className="custom-card"
          title={<><ToolOutlined /> 智能工具定制</>}
        >
          <Paragraph>
            自定义 AI 工具、插件、快捷操作,提升效率。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Tag color="purple">工具配置</Tag>
            <Tag color="magenta">插件安装</Tag>
            <Tag color="red">脚本编写</Tag>
            <Tag color="volcano">快捷命令</Tag>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card 
          className="custom-card"
          title={<><BgColorsOutlined /> 主题配色定制</>}
        >
          <Paragraph>
            自定义颜色主题、字体、间距,打造独特视觉风格。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Tag color="orange">主题颜色</Tag>
            <Tag color="gold">字体设置</Tag>
            <Tag color="lime">间距调整</Tag>
            <Tag color="cyan">暗黑模式</Tag>
          </Space>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Card className="custom-demo-card">
      <Title level={4}>🎨 定制化示例</Title>
      <Paragraph>
        下图展示了不同风格的定制化效果 (后续添加截图)
      </Paragraph>
      <Space wrap>
        <Tag color="blue">简洁风</Tag>
        <Tag color="purple">科技风</Tag>
        <Tag color="green">清新风</Tag>
        <Tag color="orange">复古风</Tag>
      </Space>
    </Card>
  </div>
)

// 智能体配置页面
const Agents = () => (
  <div className="content-section agents-page">
    <div className="section-header">
      <Title level={2}>智能体配置</Title>
      <Paragraph className="section-desc">
        在一级主题类别下配置智能体,支持不同输入类型、工具及知识库
      </Paragraph>
    </div>

    <Card className="agent-intro-card">
      <Title level={3}>🤖 什么是智能体?</Title>
      <Paragraph>
        智能体是基于 AI 技术的智能助手,可以根据主题需求进行个性化配置,
        支持多模态输入、调用外部工具、访问知识库,为用户提供专业的问答和建议。
      </Paragraph>
    </Card>

    <Divider />

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card title="🛠️ 配置能力" className="capability-card">
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
            <Card size="small" className="sub-card">
              <FileTextOutlined style={{color: '#1890ff', marginRight: 8}} />
              <Text strong>多种输入类型</Text>
              <br/>
              <Text type="secondary">支持文本、图片、音频、视频、文档等多模态输入</Text>
            </Card>
            <Card size="small" className="sub-card">
              <ToolOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>工具调用</Text>
              <br/>
              <Text type="secondary">集成搜索、计算、翻译、代码执行等外部工具</Text>
            </Card>
            <Card size="small" className="sub-card">
              <DatabaseOutlined style={{color: '#722ed1', marginRight: 8}} />
              <Text strong>知识库支持</Text>
              <br/>
              <Text type="secondary">连接主题相关知识库,提供基于知识的问答</Text>
            </Card>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="✨ 应用场景" className="scenario-card">
          <Timeline>
            <Timeline.Item color="blue">
              <Text strong>专家问答</Text>
              <br/>基于知识库提供专业领域的精准解答
            </Timeline.Item>
            <Timeline.Item color="green">
              <Text strong>学习辅导</Text>
              <br/>根据学习内容提供解释、练习和评估
            </Timeline.Item>
            <Timeline.Item color="purple">
              <Text strong>内容生成</Text>
              <br/>AI 生成方案、总结、报告等各类文档
            </Timeline.Item>
            <Timeline.Item color="orange">
              <Text strong>任务协助</Text>
              <br/>辅助完成各种工作任务和流程
            </Timeline.Item>
          </Timeline>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Title level={3}>📚 知识库管理</Title>
    <Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card size="small" className="knowledge-card">
            <DatabaseOutlined className="knowledge-icon" />
            <Title level={5}>知识库构建</Title>
            <Text>上传文档、导入数据、连接外部源</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" className="knowledge-card">
            <PartitionOutlined className="knowledge-icon" />
            <Title level={5}>知识组织</Title>
            <Text>主题分类、标签管理、关系映射</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" className="knowledge-card">
            <SyncOutlined className="knowledge-icon" />
            <Title level={5}>知识更新</Title>
            <Text>自动同步、版本管理、增量更新</Text>
          </Card>
        </Col>
      </Row>
    </Card>
  </div>
)

// 协作功能页面
const Collaboration = () => (
  <div className="content-section collaboration-page">
    <div className="section-header">
      <Title level={2}>多人协作与工作流</Title>
      <Paragraph className="section-desc">
        支持多人实时协作,打通工作流程,提升团队效率
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card 
          className="collab-card"
          title={<><TeamOutlined /> 多人协作</>}
        >
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
            <Card size="small">
              <ShareAltOutlined style={{color: '#1890ff', marginRight: 8}} />
              <Text strong>共享数据</Text>
              <br/>
              <Text type="secondary">主题、资源、笔记、文档实时同步共享</Text>
            </Card>
            <Card size="small">
              <MessageOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>即时交流</Text>
              <br/>
              <Text type="secondary">内置聊天、评论、提醒功能,沟通零延迟</Text>
            </Card>
            <Card size="small">
              <ControlOutlined style={{color: '#722ed1', marginRight: 8}} />
              <Text strong>权限管理</Text>
              <br/>
              <Text type="secondary">灵活的角色与权限配置,保障数据安全</Text>
            </Card>
            <Card size="small">
              <CalendarOutlined style={{color: '#fa8c16', marginRight: 8}} />
              <Text strong>主题日历</Text>
              <br/>
              <Text type="secondary">查看主题相关活动、截止日期、会议安排</Text>
            </Card>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card 
          className="workflow-card"
          title={<><BranchesOutlined /> 工作流管理</>}
        >
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
            <Card size="small">
              <InteractionOutlined style={{color: '#1890ff', marginRight: 8}} />
              <Text strong>工具衔接</Text>
              <br/>
              <Text type="secondary">不同工具间数据无缝流转,自动化处理</Text>
            </Card>
            <Card size="small">
              <SyncOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>输入输出</Text>
              <br/>
              <Text type="secondary">明确每个环节的输入要求和输出格式</Text>
            </Card>
            <Card size="small">
              <PartitionOutlined style={{color: '#722ed1', marginRight: 8}} />
              <Text strong>流程编排</Text>
              <br/>
              <Text type="secondary">可视化流程设计,灵活配置任务节点</Text>
            </Card>
            <Card size="small">
              <FundOutlined style={{color: '#fa8c16', marginRight: 8}} />
              <Text strong>进度跟踪</Text>
              <br/>
              <Text type="secondary">实时查看工作流执行状态和结果</Text>
            </Card>
          </Space>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Title level={3}>💼 协作场景示例</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card size="small" className="example-card">
          <Title level={5}>📝 文档协作</Title>
          <Text>多人同时编辑一份文档,实时看到彼此的修改,支持版本回溯</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className="example-card">
          <Title level={5}>📊 项目管理</Title>
          <Text>团队成员共同管理项目任务,分配职责,跟踪进度,协同解决问题</Text>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className="example-card">
          <Title level={5}>🎯 培训活动</Title>
          <Text>组织者、讲师、学员协同完成培训,实时互动和反馈</Text>
        </Card>
      </Col>
    </Row>
  </div>
)

// 个人与组织模式
const Modes = () => (
  <div className="content-section modes-page">
    <div className="section-header">
      <Title level={2}>个人与组织模式</Title>
      <Paragraph className="section-desc">
        灵活切换,满足不同使用场景
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card 
          className="mode-card"
          title={<><UserOutlined /> 个人模式</>}
          extra={<Tag color="blue">免费试用</Tag>}
        >
          <Paragraph>
            提供基础功能的免费试用,适合个人学习和小范围使用。
          </Paragraph>
          <Divider />
          <Space direction="vertical" style={{width: '100%'}}>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>基础 AI 功能</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>个人知识库</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>笔记管理</Text>
            </div>
            <div>
              <CloseCircleOutlined style={{color: '#ff4d4f', marginRight: 8}} />
              <Text type="secondary">有使用限制</Text>
            </div>
            <div>
              <CloseCircleOutlined style={{color: '#ff4d4f', marginRight: 8}} />
              <Text type="secondary">无协作功能</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card 
          className="mode-card"
          title={<><TeamOutlined /> 组织模式</>}
          extra={<Tag color="gold">全功能</Tag>}
        >
          <Paragraph>
            加入或创建组织,获得完整的协作与管理能力。
          </Paragraph>
          <Divider />
          <Space direction="vertical" style={{width: '100%'}}>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>完整 AI 功能</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>组织知识库</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>团队协作</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>无使用限制</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text>高级管理功能</Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Card className="switch-card">
      <Title level={4}>🔄 灵活切换</Title>
      <Paragraph>
        用户可以随时在个人模式和组织模式之间切换,也可以同时加入多个组织。
      </Paragraph>
      <Space wrap>
        <Tag color="blue">一键切换</Tag>
        <Tag color="green">数据同步</Tag>
        <Tag color="purple">多组织支持</Tag>
      </Space>
    </Card>
  </div>
)

// 用例展示页面
const UseCases = () => (
  <div className="content-section usecases-page">
    <div className="section-header">
      <Title level={2}>用例展示</Title>
      <Paragraph className="section-desc">
        真实场景下的具体应用,展示不同角色如何使用果仁
      </Paragraph>
    </div>

    <Collapse 
      defaultActiveKey={['1']} 
      items={[
        {
          key: '1',
          label: <span><TeamOutlined /> 组织培训场景</span>,
          children: (
            <div>
              <Title level={4}>🎯 组织培训全流程</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card title="👨‍🏫 培训组织者" size="small">
                    <Timeline size="small">
                      <Timeline.Item color="blue">
                        <Text strong>AI 生成培训方案</Text>
                        <br/>输入需求,AI 自动生成完整方案文档
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        <Text strong>配置教学活动</Text>
                        <br/>设置课程、作业、考试等活动
                      </Timeline.Item>
                      <Timeline.Item color="purple">
                        <Text strong>人员管理</Text>
                        <br/>标签管理、分组、权限配置
                      </Timeline.Item>
                      <Timeline.Item color="orange">
                        <Text strong>过程监控</Text>
                        <br/>实时进度、效果分析
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="👨‍🎓 学员" size="small">
                    <Timeline size="small">
                      <Timeline.Item color="blue">
                        <Text strong>查看学习计划</Text>
                        <br/>AI 个性化学习路径推荐
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        <Text strong>进行学习活动</Text>
                        <br/>观看资源、完成作业、参与讨论
                      </Timeline.Item>
                      <Timeline.Item color="purple">
                        <Text strong>边学边记</Text>
                        <br/>AI 辅助笔记、知识沉淀
                      </Timeline.Item>
                      <Timeline.Item color="orange">
                        <Text strong>查看反馈</Text>
                        <br/>学习报告、成绩分析
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="👨‍💼 评阅老师" size="small">
                    <Timeline size="small">
                      <Timeline.Item color="blue">
                        <Text strong>接收评阅任务</Text>
                        <br/>查看学员提交的作业
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        <Text strong>AI 辅助评阅</Text>
                        <br/>智能评分、问题识别
                      </Timeline.Item>
                      <Timeline.Item color="purple">
                        <Text strong>给予反馈</Text>
                        <br/>评语、建议、改进方向
                      </Timeline.Item>
                      <Timeline.Item color="orange">
                        <Text strong>统计分析</Text>
                        <br/>整体情况分析与报告
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </div>
          )
        },
        {
          key: '2',
          label: <span><ReadOutlined /> 教研室场景</span>,
          children: (
            <Card>
              <Title level={4}>📚 教研协作全过程</Title>
              <Space direction="vertical" size="large" style={{width: '100%'}}>
                <Card size="small" title="1、选题与立项">
                  <Text>创建主题、聚合相关资料、AI 生成研究大纲</Text>
                </Card>
                <Card size="small" title="2、资料收集与整理">
                  <Text>多渠道收集、智能标注、主题式组织</Text>
                </Card>
                <Card size="small" title="3、协同研究">
                  <Text>团队讨论、文档协作、知识共建</Text>
                </Card>
                <Card size="small" title="4、成果输出">
                  <Text>AI 辅助编写、多格式导出、版本管理</Text>
                </Card>
              </Space>
            </Card>
          )
        },
        {
          key: '3',
          label: <span><GlobalOutlined /> 学习广场场景</span>,
          children: (
            <Card>
              <Title level={4}>🌐 开放学习生态</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="主题广场" className="bordered-card">
                    <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
                    <Text>浏览热门主题、订阅感兴趣内容</Text>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="直播与回放" className="bordered-card">
                    <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
                    <Text>实时直播、自动生成笔记、回放复习</Text>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="协同笔记" className="bordered-card">
                    <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
                    <Text>多人协同编辑、AI 辅助整理</Text>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="社区交流" className="bordered-card">
                    <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
                    <Text>讨论区、问答社区、经验分享</Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          )
        },
        {
          key: '4',
          label: <span><DatabaseOutlined /> 知识空间场景</span>,
          children: (
            <Card>
              <Title level={4}>🧠 个人知识管理系统</Title>
              <Paragraph>构建个人知识库,实现知识的收集、组织、分享和应用。</Paragraph>
              <Space wrap>
                <Tag icon={<DatabaseOutlined />} color="blue">多源聚合</Tag>
                <Tag icon={<PartitionOutlined />} color="green">主题组织</Tag>
                <Tag icon={<RobotOutlined />} color="purple">AI 整理</Tag>
                <Tag icon={<ShareAltOutlined />} color="orange">便捷分享</Tag>
                <Tag icon={<SyncOutlined />} color="cyan">智能联想</Tag>
              </Space>
            </Card>
          )
        },
        {
          key: '5',
          label: <span><FormOutlined /> 课程开发场景</span>,
          children: (
            <Card>
              <Title level={4}>📝 课程开发工作流</Title>
              <Timeline>
                <Timeline.Item dot={<FormOutlined />} color="blue">
                  <Text strong>资源标注</Text>
                  <br/>多模态识别、智能标签、知识提取
                </Timeline.Item>
                <Timeline.Item dot={<TeamOutlined />} color="green">
                  <Text strong>人员标注</Text>
                  <br/>能力标签、角色分配、协作管理
                </Timeline.Item>
                <Timeline.Item dot={<BranchesOutlined />} color="purple">
                  <Text strong>工作流衔接</Text>
                  <br/>工具打通、数据流转、自动化处理
                </Timeline.Item>
                <Timeline.Item dot={<CheckCircleOutlined />} color="orange">
                  <Text strong>成果输出</Text>
                  <br/>课程包生成、质量检查、发布上线
                </Timeline.Item>
              </Timeline>
            </Card>
          )
        },
        {
          key: '6',
          label: <span><ToolOutlined /> 资源标注场景</span>,
          children: (
            <Card>
              <Title level={4}>🏷️ 多模态资源标注</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="智能识别" size="small">
                    <Space direction="vertical">
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 文本 OCR 识别</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 图像内容分析</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 视频关键帧提取</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 音频转文字</Text>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="知识生成" size="small">
                    <Space direction="vertical">
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 自动摘要生成</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 关键词提取</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 知识图谱构建</Text>
                      <Text><CheckCircleOutlined style={{color: '#52c41a'}} /> 结构化数据沉淀</Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>
          )
        }
      ]}
    />
  </div>
)

// 下载页面
const Download = () => (
  <div className="content-section download-page">
    <div className="section-header">
      <Title level={2}>下载与使用</Title>
      <Paragraph className="section-desc">
        多种方式访问果仁,随时随地开始学习
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card className="download-card">
          <CloudServerOutlined style={{fontSize: 48, color: '#1890ff', marginBottom: 16}} />
          <Title level={3}>网页版 (PWA)</Title>
          <Paragraph>
            无需下载,直接在浏览器中使用,支持 PWA 安装获得原生体验。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Button type="primary" size="large" block icon={<RocketOutlined />} href="/">
              立即使用
            </Button>
            <Divider />
            <Text strong>PWA 安装步骤:</Text>
            <Timeline size="small">
              <Timeline.Item>1、打开果仁网页版</Timeline.Item>
              <Timeline.Item>2、点击浏览器地址栏的安装图标</Timeline.Item>
              <Timeline.Item>3、确认安装,即可享受原生 APP 体验</Timeline.Item>
            </Timeline>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card className="download-card">
          <GlobalOutlined style={{fontSize: 48, color: '#52c41a', marginBottom: 16}} />
          <Title level={3}>多平台支持</Title>
          <Paragraph>
            支持在多种设备和平台上使用果仁。
          </Paragraph>
          <Space direction="vertical" size="large" style={{width: '100%'}}>
            <Card size="small">
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>Windows / macOS / Linux</Text>
              <br/>
              <Text type="secondary">浏览器访问,支持 Chrome、Edge、Firefox、Safari</Text>
            </Card>
            <Card size="small">
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>iOS / Android</Text>
              <br/>
              <Text type="secondary">移动端浏览器访问,支持添加到主屏幕</Text>
            </Card>
            <Card size="small">
              <CheckCircleOutlined style={{color: '#52c41a', marginRight: 8}} />
              <Text strong>iPad / 平板</Text>
              <br/>
              <Text type="secondary">适配平板设备,更大屏幕更好体验</Text>
            </Card>
          </Space>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Card className="feature-highlight-card">
      <Title level={4}>✨ PWA 优势</Title>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <div style={{textAlign: 'center'}}>
            <DownloadOutlined style={{fontSize: 32, color: '#1890ff'}} />
            <div><Text strong>无需下载</Text></div>
            <Text type="secondary">即用即走</Text>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div style={{textAlign: 'center'}}>
            <CloudServerOutlined style={{fontSize: 32, color: '#52c41a'}} />
            <div><Text strong>轻量安装</Text></div>
            <Text type="secondary">不占空间</Text>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div style={{textAlign: 'center'}}>
            <SyncOutlined style={{fontSize: 32, color: '#722ed1'}} />
            <div><Text strong>自动更新</Text></div>
            <Text type="secondary">始终最新</Text>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div style={{textAlign: 'center'}}>
            <SafetyOutlined style={{fontSize: 32, color: '#fa8c16'}} />
            <div><Text strong>安全可靠</Text></div>
            <Text type="secondary">HTTPS 加密</Text>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
)

// 文档页面
const Docs = () => (
  <div className="content-section docs-page">
    <div className="section-header">
      <Title level={2}>文档与支持</Title>
      <Paragraph className="section-desc">
        全面的文档和教程,帮助您快速上手
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card hoverable>
          <BookOutlined style={{fontSize: 48, color: '#1890ff', marginBottom: 16}} />
          <Title level={4}>使用文档</Title>
          <Paragraph>详细的功能说明和操作指南</Paragraph>
          <Button type="link">查看文档 &rarr;</Button>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <ReadOutlined style={{fontSize: 48, color: '#52c41a', marginBottom: 16}} />
          <Title level={4}>快速入门</Title>
          <Paragraph>新手教程,5分钟快速上手</Paragraph>
          <Button type="link">开始学习 &rarr;</Button>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card hoverable>
          <VideoCameraOutlined style={{fontSize: 48, color: '#722ed1', marginBottom: 16}} />
          <Title level={4}>视频教程</Title>
          <Paragraph>视频演示各种功能的使用方法</Paragraph>
          <Button type="link">观看视频 &rarr;</Button>
        </Card>
      </Col>
    </Row>

    <Divider />

    <Card>
      <Title level={4}>🔗 相关链接</Title>
      <Space direction="vertical" size="middle" style={{width: '100%'}}>
        <Button block href="https://github.com/myniuniu/subsystem" target="_blank" icon={<GlobalOutlined />}>
          GitHub 仓库
        </Button>
        <Button block icon={<BookOutlined />}>
          应用内文档中心
        </Button>
        <Button block icon={<MessageOutlined />}>
          社区论坛
        </Button>
      </Space>
    </Card>
  </div>
)

// 关于页面
const About = () => (
  <div className="content-section about-page">
    <div className="section-header">
      <Title level={2}>关于果仁</Title>
      <Paragraph className="section-desc">
        致力于教育数字化与智能升级的产品探索
      </Paragraph>
    </div>

    <Card>
      <Title level={3}>🌱 品牌故事</Title>
      <Paragraph>
        果仁,国人通旗下子品牌,诱生于对教育数字化和智能化的深刻洞察。
        我们相信,未来的学习平台应该是 AI 原生的、协同化的、沉浸式的。
      </Paragraph>
      <Paragraph>
        果仁这个名字,亲和、顺口、好记,如同字节跳动的豆包,希望成为人人熟悉的学习伙伴。
      </Paragraph>
    </Card>

    <Divider />

    <Card>
      <Title level={3}>🎯 使命与愿景</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card size="small">
            <Title level={5}>使命</Title>
            <Text>让每个人都能享受 AI 赋能的智能学习体验</Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small">
            <Title level={5}>愿景</Title>
            <Text>成为最受欢迎的 AI 原生学习与工作平台</Text>
          </Card>
        </Col>
      </Row>
    </Card>

    <Divider />

    <Card>
      <Title level={3}>💪 核心价值观</Title>
      <Space direction="vertical" size="middle" style={{width: '100%'}}>
        <Card size="small">
          <StarOutlined style={{color: '#faad14', marginRight: 8}} />
          <Text strong>用户至上:</Text> 以用户需求为导向,持续优化体验
        </Card>
        <Card size="small">
          <ThunderboltOutlined style={{color: '#1890ff', marginRight: 8}} />
          <Text strong>创新驱动:</Text> 拥抱 AI 技术,不断探索创新
        </Card>
        <Card size="small">
          <ShareAltOutlined style={{color: '#52c41a', marginRight: 8}} />
          <Text strong>开放共享:</Text> 构建开放生态,共享知识价值
        </Card>
        <Card size="small">
          <SafetyOutlined style={{color: '#722ed1', marginRight: 8}} />
          <Text strong>质量保障:</Text> 严谨的质量标准,可靠的服务
        </Card>
      </Space>
    </Card>
  </div>
)

// 联系页面
const Contact = () => (
  <div className="content-section contact-page">
    <div className="section-header">
      <Title level={2}>联系我们</Title>
      <Paragraph className="section-desc">
        我们乐意倾听您的声音
      </Paragraph>
    </div>

    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card>
          <Title level={4}>📧 联系方式</Title>
          <Space direction="vertical" size="middle" style={{width: '100%'}}>
            <Card size="small">
              <PhoneOutlined style={{marginRight: 8, color: '#1890ff'}} />
              <Text strong>邮箱:</Text> contact@guoren.com
            </Card>
            <Card size="small">
              <GlobalOutlined style={{marginRight: 8, color: '#52c41a'}} />
              <Text strong>GitHub:</Text> github.com/myniuniu/subsystem
            </Card>
            <Card size="small">
              <MessageOutlined style={{marginRight: 8, color: '#722ed1'}} />
              <Text strong>社区:</Text> 加入我们的用户社区
            </Card>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <Title level={4}>💬 反馈与建议</Title>
          <Paragraph>
            欢迎提出您的建议和反馈,帮助我们持续改进产品。
          </Paragraph>
          <Space direction="vertical" style={{width: '100%'}}>
            <Button block icon={<MessageOutlined />}>提交反馈</Button>
            <Button block icon={<BulbOutlined />}>功能建议</Button>
            <Button block icon={<QuestionCircleOutlined />}>报告问题</Button>
          </Space>
        </Card>
      </Col>
    </Row>
  </div>
)

// FAQ页面
const FAQ = () => (
  <div className="content-section faq-page">
    <div className="section-header">
      <Title level={2}>常见问题</Title>
      <Paragraph className="section-desc">
        快速解答您的疑问
      </Paragraph>
    </div>

    <Collapse 
      items={[
        {
          key: '1',
          label: '果仁是什么?',
          children: <Paragraph>果仁是一个集培训学习、深度研究及内容创作于一身的 AI 原生平台,为用户提供沉浸式的学习和工作体验。</Paragraph>
        },
        {
          key: '2',
          label: '如何开始使用果仁?',
          children: <Paragraph>点击“打开应用”按钮进入网页版本即可快速体验,或者在浏览器中安装 PWA 版本获得原生 APP 体验。</Paragraph>
        },
        {
          key: '3',
          label: '果仁支持哪些平台?',
          children: <Paragraph>果仁支持所有现代浏览器 (Chrome、Edge、Firefox、Safari),可在 Windows、macOS、Linux、iOS、Android 等平台使用。</Paragraph>
        },
        {
          key: '4',
          label: '个人模式和组织模式有什么区别?',
          children: <Paragraph>个人模式提供基础功能供免费试用,组织模式提供完整的协作和管理能力,支持团队工作。</Paragraph>
        },
        {
          key: '5',
          label: 'AI 功能需要额外付费吗?',
          children: <Paragraph>基础 AI 功能免费提供,高级 AI 功能和更多的调用额度可能需要升级到付费版本。</Paragraph>
        },
        {
          key: '6',
          label: '数据安全吗?',
          children: <Paragraph>我们采用业界标准的安全措施,包括 HTTPS 加密、数据备份、权限管理等,保障您的数据安全。</Paragraph>
        },
        {
          key: '7',
          label: '如何获得帮助?',
          children: <Paragraph>您可以查阅应用内文档、观看视频教程、访问社区论坛,或者直接联系我们的客服团队。</Paragraph>
        }
      ]}
    />
  </div>
)

export default function WebsiteApp() {
  return (
    <HashRouter>
      <Layout className="website-container">
        <Header style={{ background: 'var(--theme-headerBackground)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <HomeOutlined style={{ color: 'var(--theme-primary)', fontSize: 20 }} />
            <Menu mode="horizontal" style={{ flex: 1 }} items={[
              { key: 'home', label: <Link to="/">首页</Link>, icon: <RocketOutlined /> },
              { key: 'positioning', label: <Link to="/positioning">定位</Link>, icon: <ApiOutlined /> },
              { key: 'features', label: <Link to="/features">功能</Link>, icon: <AppstoreOutlined /> },
              { key: 'scenarios', label: <Link to="/scenarios">场景</Link>, icon: <ExperimentOutlined /> },
              { key: 'showcase', label: <Link to="/showcase">展示</Link>, icon: <BookOutlined /> },
              { key: 'highlights', label: <Link to="/highlights">特点</Link>, icon: <ThunderboltOutlined /> },
              { key: 'ecosystem', label: <Link to="/ecosystem">生态</Link>, icon: <CloudServerOutlined /> },
              { key: 'customization', label: <Link to="/customization">定制化</Link>, icon: <SettingOutlined /> },
              { key: 'agents', label: <Link to="/agents">智能体</Link>, icon: <TeamOutlined /> },
              { key: 'collaboration', label: <Link to="/collaboration">协作</Link>, icon: <ApiOutlined /> },
              { key: 'modes', label: <Link to="/modes">模式</Link>, icon: <AppstoreOutlined /> },
              { key: 'demo', label: <Link to="/demo">演示</Link>, icon: <BookOutlined /> },
              { key: 'usecases', label: <Link to="/usecases">用例</Link>, icon: <BookOutlined /> },
              { key: 'download', label: <Link to="/download">下载与试用</Link>, icon: <DownloadOutlined /> },
              { key: 'docs', label: <Link to="/docs">文档</Link>, icon: <BookOutlined /> },
              { key: 'about', label: <Link to="/about">关于</Link> },
              { key: 'contact', label: <Link to="/contact">联系</Link>, icon: <PhoneOutlined /> },
              { key: 'faq', label: <Link to="/faq">FAQ</Link>, icon: <QuestionCircleOutlined /> }
            ]} />
            <Button type="primary" href="/">打开应用</Button>
          </div>
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/positioning" element={<Positioning />} />
            <Route path="/features" element={<Features />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/customization" element={<Customization />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/usecases" element={<UseCases />} />
            <Route path="/download" element={<Download />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Content>
        <Footer className="footer">© {new Date().getFullYear()} 果仁 (国人通) - AI 原生的学习与工作空间</Footer>
      </Layout>
    </HashRouter>
  )
}
