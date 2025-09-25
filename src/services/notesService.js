/**
 * 智能笔记数据服务
 * 提供笔记的CRUD操作和本地存储管理
 */

const STORAGE_KEY = 'smart_notes_data';
const CATEGORIES_KEY = 'smart_notes_categories';
const TAGS_KEY = 'smart_notes_tags';

// 默认分类
const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部主题', icon: 'FileTextOutlined', color: '#1890ff', type: 'system' },
  { id: 'work', name: '工作主题', icon: 'BriefcaseOutlined', color: '#52c41a', type: 'system' },
  { id: 'study', name: '学习主题', icon: 'BookOutlined', color: '#722ed1', type: 'system' },
  { id: 'personal', name: '个人主题', icon: 'UserOutlined', color: '#fa8c16', type: 'system' },
  { id: 'ideas', name: '想法灵感', icon: 'BulbOutlined', color: '#eb2f96', type: 'system' },
  { id: 'knowledge_graph', name: '知识图谱', icon: 'NodeIndexOutlined', color: '#13c2c2', type: 'fixed' },
  { id: 'capability_model', name: '能力模型', icon: 'RadarChartOutlined', color: '#f759ab', type: 'fixed' },
  { id: 'micro_major', name: '微专业', icon: 'ExperimentOutlined', color: '#597ef7', type: 'fixed' },
  { id: 'starred', name: '收藏主题', icon: 'StarOutlined', color: '#faad14', type: 'system' }
];

// 默认标签
const DEFAULT_TAGS = [
  '重要', '紧急', '待办', '已完成', '草稿', '模板', '参考', '总结'
];

// 固定分类的模拟数据
const FIXED_CATEGORY_MOCK_DATA = {
  'knowledge_graph': [
    {
      id: 'kg-001',
      title: '知识图谱基础概念与应用',
      content: `# 知识图谱基础概念与应用

## 什么是知识图谱？

知识图谱（Knowledge Graph）是一种结构化的语义知识库，用于描述概念及其相互关系。它以图的形式表示知识，其中节点代表实体，边代表实体间的关系。

## 核心组成要素

### 1. 实体（Entity）
- 现实世界中的具体对象
- 例如：人物、地点、组织、概念等
- 每个实体都有唯一标识符

### 2. 关系（Relation）
- 实体之间的语义连接
- 例如：属于、位于、工作于等
- 定义了实体间的交互方式

### 3. 属性（Attribute）
- 实体的特征描述
- 例如：姓名、年龄、地址等
- 提供实体的详细信息

## 应用场景

1. **搜索引擎优化**
   - 提升搜索结果的准确性
   - 支持语义搜索和问答系统

2. **推荐系统**
   - 基于实体关系进行个性化推荐
   - 发现用户潜在兴趣

3. **智能问答**
   - 理解自然语言问题
   - 提供精准答案

## 构建流程

1. 数据收集与预处理
2. 实体识别与链接
3. 关系抽取
4. 知识融合
5. 质量评估与优化

## 技术挑战

- 数据质量与一致性
- 大规模数据处理
- 实时更新机制
- 多源数据融合`,
      category: 'knowledge_graph',
      tags: ['知识图谱', '人工智能', '数据结构', '语义网络'],
      starred: true,
      createdAt: '2024-01-15T09:00:00.000Z',
      updatedAt: '2024-01-15T09:00:00.000Z',
      wordCount: 285,
      readTime: 2
    },
    {
      id: 'kg-002',
      title: 'Neo4j图数据库实战指南',
      content: `# Neo4j图数据库实战指南

## Neo4j简介

Neo4j是世界领先的图数据库，专为存储和查询高度连接的数据而设计。它使用Cypher查询语言，提供了直观的图数据操作方式。

## 核心概念

### 节点（Node）
- 图中的基本实体
- 可以有标签（Label）
- 包含属性键值对

### 关系（Relationship）
- 连接两个节点
- 有方向性
- 包含类型和属性

### 属性（Property）
- 键值对形式
- 存储在节点或关系上
- 支持多种数据类型

## Cypher查询语言

### 基本语法
\`\`\`cypher
// 创建节点
CREATE (p:Person {name: "张三", age: 30})

// 创建关系
MATCH (a:Person), (b:Company)
WHERE a.name = "张三" AND b.name = "ABC公司"
CREATE (a)-[:WORKS_FOR]->(b)

// 查询数据
MATCH (p:Person)-[:WORKS_FOR]->(c:Company)
RETURN p.name, c.name
\`\`\`

## 实际应用案例

### 1. 社交网络分析
- 用户关系建模
- 好友推荐算法
- 社区发现

### 2. 推荐系统
- 商品关联分析
- 协同过滤
- 内容推荐

### 3. 欺诈检测
- 异常模式识别
- 风险评估
- 关联分析

## 性能优化技巧

1. **索引策略**
   - 为频繁查询的属性创建索引
   - 使用复合索引

2. **查询优化**
   - 合理使用LIMIT
   - 避免笛卡尔积
   - 使用EXPLAIN分析查询计划

3. **数据建模**
   - 合理设计节点标签
   - 优化关系结构
   - 避免超级节点`,
      category: 'knowledge_graph',
      tags: ['Neo4j', '图数据库', 'Cypher', '数据建模'],
      starred: false,
      createdAt: '2024-01-12T14:30:00.000Z',
      updatedAt: '2024-01-12T14:30:00.000Z',
      wordCount: 320,
      readTime: 2
    },
    {
      id: 'kg-003',
      title: '知识抽取与实体识别技术',
      content: `# 知识抽取与实体识别技术

## 概述

知识抽取是从非结构化文本中自动提取结构化知识的过程，是构建知识图谱的关键技术之一。

## 主要任务

### 1. 命名实体识别（NER）
- **定义**：识别文本中的人名、地名、机构名等实体
- **方法**：
  - 基于规则的方法
  - 基于统计的方法
  - 基于深度学习的方法

### 2. 关系抽取（RE）
- **定义**：识别实体间的语义关系
- **类型**：
  - 监督学习方法
  - 半监督学习方法
  - 无监督学习方法

### 3. 事件抽取（EE）
- **定义**：从文本中识别事件及其参与者
- **组成**：
  - 事件触发词识别
  - 事件论元抽取
  - 事件类型分类

## 技术方法

### 传统方法
1. **基于规则**
   - 正则表达式
   - 词典匹配
   - 语法规则

2. **基于统计**
   - 条件随机场（CRF）
   - 支持向量机（SVM）
   - 最大熵模型

### 深度学习方法
1. **循环神经网络**
   - LSTM
   - BiLSTM
   - GRU

2. **注意力机制**
   - Self-Attention
   - Multi-Head Attention
   - Transformer

3. **预训练模型**
   - BERT
   - RoBERTa
   - ELECTRA

## 评估指标

### 精确率（Precision）
P = TP / (TP + FP)

### 召回率（Recall）
R = TP / (TP + FN)

### F1分数
F1 = 2 × (P × R) / (P + R)

## 实际应用

1. **新闻信息抽取**
2. **医疗文本处理**
3. **法律文档分析**
4. **学术论文挖掘**

## 挑战与解决方案

### 挑战
- 歧义消解
- 长尾实体识别
- 跨领域适应

### 解决方案
- 上下文建模
- 迁移学习
- 多任务学习`,
      category: 'knowledge_graph',
      tags: ['NLP', '实体识别', '关系抽取', '深度学习'],
      starred: false,
      createdAt: '2024-01-10T16:45:00.000Z',
      updatedAt: '2024-01-10T16:45:00.000Z',
      wordCount: 385,
      readTime: 3
    }
  ],
  'capability_model': [
    {
      id: 'cm-001',
      title: '能力模型构建理论与实践',
      content: `# 能力模型构建理论与实践

## 能力模型概述

能力模型（Competency Model）是描述在特定工作岗位上取得优秀绩效所需要具备的各种能力要素的结构化框架。

## 核心组成要素

### 1. 核心能力（Core Competencies）
- 组织层面的基础能力
- 体现企业文化和价值观
- 适用于所有员工

### 2. 专业能力（Functional Competencies）
- 特定职能领域的专业技能
- 岗位相关的技术能力
- 行业特定知识

### 3. 领导能力（Leadership Competencies）
- 管理和领导他人的能力
- 战略思维和决策能力
- 变革管理能力

## 能力模型构建流程

### 第一阶段：需求分析
1. **组织战略分析**
   - 企业发展战略
   - 业务目标
   - 组织文化

2. **岗位分析**
   - 工作职责
   - 绩效标准
   - 关键成功因素

### 第二阶段：能力识别
1. **文献研究法**
   - 行业最佳实践
   - 理论模型参考
   - 标杆企业分析

2. **行为事件访谈法（BEI）**
   - 高绩效者访谈
   - 关键事件分析
   - 行为模式识别

3. **专家小组法**
   - 领域专家讨论
   - 德尔菲法
   - 焦点小组

### 第三阶段：能力建模
1. **能力要素定义**
   - 能力名称
   - 能力定义
   - 行为指标

2. **能力等级划分**
   - 初级水平
   - 中级水平
   - 高级水平
   - 专家水平

3. **能力权重设定**
   - 重要性评估
   - 权重分配
   - 优先级排序

## 应用场景

### 1. 人才招聘
- 岗位胜任力要求
- 面试评估标准
- 人才筛选依据

### 2. 绩效管理
- 绩效评估维度
- 发展目标设定
- 改进计划制定

### 3. 培训发展
- 培训需求分析
- 课程体系设计
- 学习路径规划

### 4. 职业发展
- 晋升标准
- 职业通道设计
- 继任者计划

## 实施要点

### 成功因素
1. **高层支持**
2. **全员参与**
3. **持续改进**
4. **系统整合**

### 常见挑战
1. **能力定义模糊**
2. **评估标准不一**
3. **实施阻力大**
4. **维护成本高**

## 评估与优化

### 有效性评估
- 预测效度验证
- 应用效果分析
- ROI计算

### 持续优化
- 定期回顾更新
- 反馈收集分析
- 模型迭代改进`,
      category: 'capability_model',
      tags: ['能力模型', '人力资源', '绩效管理', '人才发展'],
      starred: true,
      createdAt: '2024-01-14T11:20:00.000Z',
      updatedAt: '2024-01-14T11:20:00.000Z',
      wordCount: 445,
      readTime: 3
    },
    {
      id: 'cm-002',
      title: '数字化时代的核心能力框架',
      content: `# 数字化时代的核心能力框架

## 数字化转型背景

随着数字技术的快速发展，传统的能力模型已无法完全适应新时代的要求。组织需要构建面向数字化时代的核心能力框架。

## 数字化核心能力维度

### 1. 数字素养（Digital Literacy）
- **数字工具使用**
  - 办公软件熟练度
  - 协作平台应用
  - 数据分析工具

- **信息处理能力**
  - 信息搜索与筛选
  - 数据解读与分析
  - 知识管理与分享

### 2. 创新思维（Innovation Mindset）
- **设计思维**
  - 用户中心思维
  - 原型设计能力
  - 迭代优化思维

- **敏捷思维**
  - 快速响应变化
  - 持续学习能力
  - 实验验证思维

### 3. 协作能力（Collaboration Skills）
- **虚拟团队协作**
  - 远程沟通技巧
  - 在线协作工具
  - 跨文化交流

- **跨界合作**
  - 跨部门协调
  - 外部伙伴合作
  - 生态系统思维

### 4. 适应能力（Adaptability）
- **学习敏锐度**
  - 快速学习新技能
  - 知识迁移能力
  - 自我反思能力

- **变革管理**
  - 变化适应性
  - 不确定性处理
  - 韧性与恢复力

## 能力评估框架

### 评估维度
1. **知识层面**
   - 理论知识掌握
   - 实践经验积累
   - 行业洞察深度

2. **技能层面**
   - 操作技能熟练度
   - 问题解决能力
   - 创新应用能力

3. **态度层面**
   - 学习意愿
   - 合作精神
   - 责任担当

### 评估方法
1. **360度评估**
2. **情境模拟测试**
3. **项目成果评价**
4. **持续观察记录**

## 能力发展路径

### 初级阶段（Foundation Level）
- 基础数字技能培训
- 工具使用培训
- 基本协作技能

### 中级阶段（Proficient Level）
- 专业技能深化
- 跨领域知识学习
- 团队协作实践

### 高级阶段（Expert Level）
- 创新项目领导
- 知识分享与传承
- 战略思维培养

### 专家阶段（Master Level）
- 行业标准制定
- 最佳实践推广
- 生态系统构建

## 实施建议

### 组织层面
1. **建立数字化文化**
2. **完善激励机制**
3. **提供学习资源**
4. **营造创新环境**

### 个人层面
1. **制定学习计划**
2. **参与实践项目**
3. **建立学习网络**
4. **持续自我反思**

## 未来趋势

### 新兴能力要求
- AI协作能力
- 数据思维
- 平台化思维
- 可持续发展意识

### 发展方向
- 个性化能力模型
- 实时能力评估
- 智能化发展建议
- 生态化能力网络`,
      category: 'capability_model',
      tags: ['数字化转型', '核心能力', '未来技能', '人才发展'],
      starred: false,
      createdAt: '2024-01-11T13:15:00.000Z',
      updatedAt: '2024-01-11T13:15:00.000Z',
      wordCount: 520,
      readTime: 4
    },
    {
      id: 'cm-003',
      title: '领导力能力模型设计与应用',
      content: `# 领导力能力模型设计与应用

## 领导力的本质

领导力不仅仅是管理职位，而是影响他人、推动变革、实现目标的综合能力。现代领导力模型需要适应复杂多变的商业环境。

## 现代领导力能力框架

### 1. 自我领导（Self Leadership）
- **自我认知**
  - 优势识别
  - 盲点觉察
  - 价值观明确
  - 情绪管理

- **自我发展**
  - 持续学习
  - 反思总结
  - 目标设定
  - 时间管理

### 2. 他人领导（Leading Others）
- **影响力建设**
  - 信任建立
  - 说服沟通
  - 激励鼓舞
  - 冲突解决

- **团队建设**
  - 团队组建
  - 文化塑造
  - 协作促进
  - 人才培养

### 3. 组织领导（Leading Organization）
- **战略思维**
  - 环境分析
  - 战略制定
  - 资源配置
  - 风险管理

- **变革领导**
  - 变革规划
  - 变革实施
  - 阻力化解
  - 成果巩固

### 4. 生态领导（Leading Ecosystem）
- **利益相关者管理**
  - 客户关系
  - 合作伙伴
  - 投资者关系
  - 社会责任

- **创新引领**
  - 趋势洞察
  - 创新文化
  - 资源整合
  - 生态构建

## 能力等级标准

### Level 1: 新任领导者
- **关键能力**
  - 基础管理技能
  - 团队沟通能力
  - 任务执行能力

- **发展重点**
  - 角色转换
  - 基础技能培训
  - 导师指导

### Level 2: 中层管理者
- **关键能力**
  - 部门管理能力
  - 跨部门协调
  - 业务理解能力

- **发展重点**
  - 管理技能深化
  - 业务知识拓展
  - 领导风格形成

### Level 3: 高级管理者
- **关键能力**
  - 战略规划能力
  - 组织变革能力
  - 人才发展能力

- **发展重点**
  - 战略思维培养
  - 变革管理实践
  - 高管教练

### Level 4: 企业领袖
- **关键能力**
  - 愿景塑造能力
  - 生态构建能力
  - 社会影响力

- **发展重点**
  - 思想领导力
  - 行业影响力
  - 社会责任

## 评估方法与工具

### 1. 360度反馈
- **评估维度**
  - 上级评价
  - 下属评价
  - 同级评价
  - 客户评价

### 2. 领导力测评
- **心理测评工具**
  - MBTI性格测试
  - DISC行为风格
  - 情商测评
  - 价值观测评

### 3. 情境模拟
- **评估中心技术**
  - 无领导小组讨论
  - 角色扮演
  - 案例分析
  - 演讲展示

### 4. 绩效数据分析
- **量化指标**
  - 业务绩效
  - 团队绩效
  - 员工满意度
  - 离职率

## 发展策略

### 1. 正式学习
- **培训课程**
  - 领导力发展项目
  - MBA/EMBA教育
  - 专业认证课程

### 2. 经验学习
- **实践机会**
  - 轮岗锻炼
  - 项目领导
  - 跨文化任务
  - 危机处理

### 3. 社会学习
- **网络建设**
  - 导师指导
  - 同伴学习
  - 行业交流
  - 标杆学习

### 4. 反思学习
- **自我发展**
  - 定期反思
  - 反馈收集
  - 学习日志
  - 行动计划

## 应用实践

### 成功案例
1. **GE领导力发展体系**
2. **华为干部管理体系**
3. **阿里巴巴政委体系**

### 实施要点
1. **与战略对接**
2. **全程跟踪评估**
3. **个性化发展**
4. **文化氛围营造**`,
      category: 'capability_model',
      tags: ['领导力', '管理能力', '人才发展', '组织管理'],
      starred: true,
      createdAt: '2024-01-09T10:30:00.000Z',
      updatedAt: '2024-01-09T10:30:00.000Z',
      wordCount: 680,
      readTime: 5
    }
  ],
  'micro_specialization': [
    {
      id: 'ms-001',
      title: '微专业教育模式创新与实践',
      content: `# 微专业教育模式创新与实践

## 微专业概念解析

微专业（Micro-Specialization）是一种新兴的教育模式，通过模块化、精准化的课程设计，帮助学习者快速掌握特定领域的核心技能。

## 核心特征

### 1. 精准定位
- **技能导向**
  - 聚焦核心技能
  - 实用性强
  - 就业导向明确

- **市场需求**
  - 紧跟行业趋势
  - 企业需求驱动
  - 技能缺口填补

### 2. 模块化设计
- **课程结构**
  - 独立模块组合
  - 灵活学习路径
  - 可定制化程度高

- **学习方式**
  - 在线学习为主
  - 项目驱动学习
  - 实战案例丰富

### 3. 快速迭代
- **内容更新**
  - 定期内容更新
  - 技术发展同步
  - 反馈驱动改进

## 设计原则

### 1. 学习者中心
- **个性化学习**
  - 学习路径定制
  - 进度自主控制
  - 多样化学习资源

- **能力导向**
  - 明确学习目标
  - 可衡量的成果
  - 实际应用能力

### 2. 产业对接
- **企业参与**
  - 课程共同开发
  - 实习实训机会
  - 就业推荐服务

- **行业标准**
  - 职业技能标准
  - 行业认证体系
  - 质量保证机制

### 3. 技术赋能
- **智能化平台**
  - AI推荐系统
  - 学习分析技术
  - 自适应学习

- **沉浸式体验**
  - VR/AR技术应用
  - 虚拟实验室
  - 仿真训练环境

## 实施框架

### 第一阶段：需求分析
1. **市场调研**
   - 行业发展趋势
   - 技能需求分析
   - 竞争对手分析

2. **目标群体分析**
   - 学习者画像
   - 学习动机分析
   - 能力基础评估

### 第二阶段：课程设计
1. **能力模型构建**
   - 核心能力识别
   - 能力层级划分
   - 评估标准制定

2. **课程体系设计**
   - 模块化拆分
   - 学习路径规划
   - 资源配置优化

### 第三阶段：平台建设
1. **技术架构**
   - 学习管理系统
   - 内容管理系统
   - 数据分析系统

2. **用户体验**
   - 界面设计优化
   - 交互流程简化
   - 移动端适配

### 第四阶段：运营管理
1. **内容运营**
   - 课程内容更新
   - 师资队伍建设
   - 质量监控体系

2. **用户运营**
   - 学习社区建设
   - 激励机制设计
   - 服务支持体系

## 应用场景

### 1. 职业技能提升
- **在职人员培训**
  - 技能升级需求
  - 职业转型支持
  - 晋升能力准备

### 2. 就业能力培养
- **应届毕业生**
  - 就业技能补强
  - 行业适应培训
  - 职场能力培养

### 3. 创业能力建设
- **创业者培训**
  - 创业技能培训
  - 商业模式设计
  - 团队管理能力

### 4. 终身学习支持
- **个人发展**
  - 兴趣技能培养
  - 知识结构更新
  - 认知能力提升

## 成功案例分析

### 1. Coursera专项课程
- **特点**
  - 大学合作模式
  - 证书认证体系
  - 全球化平台

### 2. Udacity纳米学位
- **特点**
  - 企业合作深度
  - 项目驱动学习
  - 就业保障服务

### 3. 网易云课堂微专业
- **特点**
  - 本土化适应
  - 行业深度合作
  - 实战项目丰富

## 发展趋势

### 1. 技术发展方向
- **AI个性化**
  - 智能推荐算法
  - 自适应学习系统
  - 智能评估工具

### 2. 内容发展方向
- **跨界融合**
  - 多学科整合
  - 复合型技能
  - 创新思维培养

### 3. 模式发展方向
- **生态化发展**
  - 产业链整合
  - 多方协作模式
  - 价值共创机制

## 挑战与对策

### 主要挑战
1. **质量保证难题**
2. **认证标准缺失**
3. **师资力量不足**
4. **可持续发展**

### 应对策略
1. **建立质量标准**
2. **完善认证体系**
3. **创新师资模式**
4. **构建商业模式**`,
      category: 'micro_specialization',
      tags: ['微专业', '在线教育', '职业培训', '教育创新'],
      starred: true,
      createdAt: '2024-01-13T15:45:00.000Z',
      updatedAt: '2024-01-13T15:45:00.000Z',
      wordCount: 720,
      readTime: 5
    },
    {
      id: 'ms-002',
      title: '数据科学微专业课程体系设计',
      content: `# 数据科学微专业课程体系设计

## 课程背景

数据科学作为21世纪最热门的职业之一，需要跨学科的知识结构和实践能力。本微专业旨在培养具备数据分析、机器学习和业务洞察能力的复合型人才。

## 学习目标

### 知识目标
- 掌握数据科学基础理论
- 理解机器学习核心算法
- 熟悉数据处理工具和技术
- 了解行业应用场景和案例

### 能力目标
- 具备数据收集和清洗能力
- 能够进行探索性数据分析
- 掌握机器学习模型构建
- 具备数据可视化和报告能力

### 素养目标
- 培养数据思维和逻辑思维
- 建立商业敏感度和洞察力
- 形成持续学习和创新意识
- 具备团队协作和沟通能力

## 课程体系架构

### 模块一：数据科学基础（40学时）
#### 1.1 数据科学概论（8学时）
- 数据科学发展历程
- 数据科学家角色定位
- 数据科学项目流程
- 行业应用案例分析

#### 1.2 统计学基础（16学时）
- 描述性统计
- 概率论基础
- 假设检验
- 回归分析

#### 1.3 Python编程基础（16学时）
- Python语法基础
- 数据结构和算法
- 面向对象编程
- 常用库介绍

### 模块二：数据处理与分析（60学时）
#### 2.1 数据收集与获取（12学时）
- 数据源识别和评估
- 网络爬虫技术
- API数据获取
- 数据库操作

#### 2.2 数据清洗与预处理（20学时）
- 数据质量评估
- 缺失值处理
- 异常值检测
- 数据变换技术

#### 2.3 探索性数据分析（16学时）
- 数据分布分析
- 相关性分析
- 特征工程
- 数据可视化

#### 2.4 数据分析工具（12学时）
- Pandas数据处理
- NumPy数值计算
- Matplotlib/Seaborn可视化
- Jupyter Notebook使用

### 模块三：机器学习实践（80学时）
#### 3.1 机器学习基础（20学时）
- 机器学习概念和分类
- 监督学习vs无监督学习
- 模型评估和选择
- 过拟合和欠拟合

#### 3.2 监督学习算法（30学时）
- 线性回归和逻辑回归
- 决策树和随机森林
- 支持向量机
- 神经网络基础

#### 3.3 无监督学习算法（20学时）
- 聚类算法（K-means、层次聚类）
- 降维技术（PCA、t-SNE）
- 关联规则挖掘
- 异常检测

#### 3.4 深度学习入门（10学时）
- 深度学习基本概念
- 卷积神经网络（CNN）
- 循环神经网络（RNN）
- 深度学习框架介绍

### 模块四：业务应用与项目实战（60学时）
#### 4.1 行业应用案例（20学时）
- 金融风控案例
- 电商推荐系统
- 医疗数据分析
- 智能制造应用

#### 4.2 数据产品设计（20学时）
- 数据产品概念
- 用户需求分析
- 产品原型设计
- 数据驱动决策

#### 4.3 综合项目实战（20学时）
- 项目选题和规划
- 团队协作开发
- 成果展示和答辩
- 项目总结和反思

## 教学方法

### 1. 项目驱动学习
- **真实项目**：基于企业实际需求
- **团队合作**：模拟工作环境
- **迭代开发**：敏捷开发模式

### 2. 案例教学法
- **经典案例**：行业标杆案例分析
- **最新案例**：前沿技术应用
- **失败案例**：经验教训总结

### 3. 翻转课堂
- **预习准备**：在线视频学习
- **课堂讨论**：问题解决和交流
- **课后实践**：作业和项目

### 4. 导师制指导
- **行业导师**：企业专家指导
- **学术导师**：理论知识指导
- **同伴导师**：互助学习模式

## 评估体系

### 形成性评估（60%）
- **作业完成情况**（20%）
- **项目进展评估**（25%）
- **课堂参与度**（15%）

### 终结性评估（40%）
- **期末项目**（30%）
- **综合测试**（10%）

### 能力认证
- **技能证书**：完成相应模块获得证书
- **项目证书**：完成综合项目获得证书
- **行业认证**：对接行业认证标准

## 师资配置

### 核心师资团队
- **学科带头人**：1名（博士学位，5年以上经验）
- **专业教师**：3名（硕士以上学位，3年以上经验）
- **企业导师**：5名（行业专家，实战经验丰富）

### 师资培养计划
- **定期培训**：技术更新和教学方法
- **企业实践**：深入企业了解需求
- **学术交流**：参与学术会议和研讨

## 资源配置

### 硬件资源
- **计算资源**：云计算平台和GPU服务器
- **软件工具**：专业数据分析软件
- **实验环境**：数据科学实验室

### 软件资源
- **学习平台**：在线学习管理系统
- **数据集**：真实和模拟数据集
- **工具库**：开源工具和商业软件

## 质量保障

### 质量监控
- **教学质量评估**
- **学习效果跟踪**
- **就业质量分析**

### 持续改进
- **课程内容更新**
- **教学方法优化**
- **评估体系完善**`,
      category: 'micro_specialization',
      tags: ['数据科学', '课程设计', '机器学习', '项目实战'],
      starred: false,
      createdAt: '2024-01-08T09:15:00.000Z',
      updatedAt: '2024-01-08T09:15:00.000Z',
      wordCount: 890,
      readTime: 6
    },
    {
      id: 'ms-003',
      title: 'UI/UX设计微专业实战指南',
      content: `# UI/UX设计微专业实战指南

## 专业概述

UI/UX设计微专业致力于培养具备用户体验设计思维和界面设计技能的复合型设计人才，满足数字化时代对设计人才的迫切需求。

## 核心能力框架

### 1. 用户研究能力
- **用户调研方法**
  - 用户访谈技巧
  - 问卷设计与分析
  - 观察法和日记法
  - 焦点小组讨论

- **用户画像构建**
  - 数据收集与分析
  - 用户行为模式识别
  - 需求层次分析
  - 场景化用户故事

### 2. 交互设计能力
- **信息架构设计**
  - 内容组织与分类
  - 导航系统设计
  - 信息层级规划
  - 用户流程设计

- **交互原型设计**
  - 低保真原型制作
  - 高保真原型开发
  - 交互动效设计
  - 可用性测试

### 3. 视觉设计能力
- **设计基础理论**
  - 色彩理论与应用
  - 版式设计原则
  - 字体设计与选择
  - 图形设计语言

- **界面设计实践**
  - 设计系统构建
  - 组件库设计
  - 响应式设计
  - 品牌视觉统一

### 4. 工具技能掌握
- **设计软件**
  - Sketch/Figma精通
  - Adobe Creative Suite
  - Principle/Framer动效
  - Axure/墨刀原型

- **协作工具**
  - 版本控制系统
  - 设计交付规范
  - 团队协作流程
  - 开发对接技巧

## 学习路径设计

### 阶段一：设计基础（4周）
#### 第1周：设计思维入门
- **设计思维概念**
  - 以人为本的设计理念
  - 设计思维五步法
  - 创新思维培养
  - 设计案例分析

- **实践项目**
  - 日常生活问题发现
  - 解决方案头脑风暴
  - 简单原型制作
  - 用户反馈收集

#### 第2周：用户体验基础
- **UX设计原理**
  - 用户体验要素
  - 可用性原则
  - 认知心理学基础
  - 情感化设计

- **实践项目**
  - 现有产品体验分析
  - 用户痛点识别
  - 改进方案设计
  - 体验地图绘制

#### 第3周：视觉设计基础
- **设计基础理论**
  - 平面设计原理
  - 色彩搭配技巧
  - 字体设计应用
  - 版式布局规则

- **实践项目**
  - 海报设计练习
  - Logo设计实践
  - 名片设计制作
  - 品牌视觉规范

#### 第4周：工具技能入门
- **Figma基础操作**
  - 界面熟悉和基本操作
  - 图层管理和组件使用
  - 协作功能和版本控制
  - 插件安装和使用

- **实践项目**
  - 简单界面设计
  - 组件库搭建
  - 团队协作练习
  - 设计规范制定

### 阶段二：专业技能（8周）
#### 第5-6周：用户研究实践
- **研究方法深入**
  - 定性研究方法
  - 定量研究方法
  - 混合研究策略
  - 数据分析技巧

- **实践项目**
  - 用户访谈执行
  - 问卷调研实施
  - 数据分析报告
  - 用户画像输出

#### 第7-8周：信息架构设计
- **架构设计方法**
  - 卡片分类法
  - 树状测试
  - 导航设计原则
  - 搜索系统设计

- **实践项目**
  - 网站信息架构
  - APP导航设计
  - 搜索功能优化
  - 用户流程梳理

#### 第9-10周：交互设计进阶
- **交互设计原理**
  - 交互设计模式
  - 微交互设计
  - 手势交互设计
  - 语音交互基础

- **实践项目**
  - 移动端交互设计
  - 桌面端界面设计
  - 交互动效制作
  - 可用性测试执行

#### 第11-12周：视觉设计进阶
- **高级视觉技巧**
  - 设计系统构建
  - 品牌设计应用
  - 插画设计技巧
  - 图标设计规范

- **实践项目**
  - 完整设计系统
  - 品牌视觉延展
  - 图标库设计
  - 插画风格探索

### 阶段三：项目实战（4周）
#### 第13-14周：综合项目启动
- **项目规划**
  - 项目需求分析
  - 团队角色分工
  - 时间计划制定
  - 里程碑设定

- **用户研究阶段**
  - 目标用户定义
  - 竞品分析执行
  - 用户调研实施
  - 需求整理分析

#### 第15-16周：设计执行与优化
- **设计开发**
  - 信息架构搭建
  - 交互原型制作
  - 视觉设计执行
  - 设计规范输出

- **测试优化**
  - 可用性测试
  - 用户反馈收集
  - 设计迭代优化
  - 最终方案确定

## 评估与认证

### 过程性评估
- **每周作业**（30%）
  - 理论知识掌握
  - 实践技能应用
  - 创新思维体现

- **阶段项目**（40%）
  - 项目完成质量
  - 设计思路清晰度
  - 用户体验考虑

### 终结性评估
- **毕业项目**（30%）
  - 项目复杂度和完整性
  - 设计质量和创新性
  - 展示和表达能力

### 能力认证
- **基础认证**：完成基础阶段学习
- **专业认证**：完成专业技能学习
- **实战认证**：完成综合项目实战

## 就业指导

### 职业发展路径
1. **UI设计师**
   - 界面视觉设计
   - 设计规范制定
   - 品牌视觉延展

2. **UX设计师**
   - 用户体验研究
   - 交互设计优化
   - 产品策略制定

3. **产品设计师**
   - 产品全流程设计
   - 商业需求理解
   - 跨团队协作

### 求职准备
- **作品集制作**
  - 项目案例整理
  - 设计思路阐述
  - 成果展示优化

- **面试技巧**
  - 作品讲解技巧
  - 设计思维展示
  - 沟通表达能力

## 行业合作

### 企业导师
- **一线设计师**：分享实战经验
- **设计总监**：提供职业指导
- **产品经理**：讲解业务理解

### 实习机会
- **设计公司实习**
- **互联网企业实习**
- **创业公司项目**

### 就业推荐
- **合作企业内推**
- **校园招聘对接**
- **freelance项目推荐**`,
      category: 'micro_specialization',
      tags: ['UI设计', 'UX设计', '用户体验', '交互设计'],
      starred: false,
      createdAt: '2024-01-07T14:20:00.000Z',
      updatedAt: '2024-01-07T14:20:00.000Z',
      wordCount: 1050,
      readTime: 7
    }
  ]
};

class NotesService {
  constructor() {
    this.initializeStorage();
  }

  // 初始化存储
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // 初始化时加载固定分类的模拟数据
      const initialNotes = this.loadFixedCategoryMockData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(TAGS_KEY)) {
      localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
    }
  }

  // 加载固定分类的模拟数据
  loadFixedCategoryMockData() {
    const allMockNotes = [];
    
    // 遍历所有固定分类的模拟数据
    Object.keys(FIXED_CATEGORY_MOCK_DATA).forEach(categoryId => {
      const categoryNotes = FIXED_CATEGORY_MOCK_DATA[categoryId];
      allMockNotes.push(...categoryNotes);
    });
    
    return allMockNotes;
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 获取所有笔记
  getAllNotes() {
    try {
      const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('获取笔记失败:', error);
      return [];
    }
  }

  // 根据ID获取笔记
  getNoteById(id) {
    try {
      const notes = this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('获取笔记失败:', error);
      return null;
    }
  }

  // 创建笔记
  createNote(noteData) {
    try {
      const notes = this.getAllNotes();
      const newNote = {
        id: this.generateId(),
        title: noteData.title || '无标题笔记',
        content: noteData.content || '',
        category: noteData.category || 'personal',
        tags: noteData.tags || [],
        starred: noteData.starred || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(noteData.content || ''),
        readTime: this.calculateReadTime(noteData.content || ''),
        // 支持组织培训相关字段
        source: noteData.source,
        courseId: noteData.courseId,
        courseType: noteData.courseType,
        // 支持视频相关字段
        videoInfo: noteData.videoInfo || null, // { url, duration, progress, type }
        materials: noteData.materials || null  // 关联的资料信息
      };
      
      notes.unshift(newNote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      
      // 更新标签列表
      this.updateTagsList(noteData.tags || []);
      
      return newNote;
    } catch (error) {
      console.error('创建笔记失败:', error);
      throw new Error('创建笔记失败');
    }
  }

  // 更新笔记
  updateNote(id, noteData) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        throw new Error('笔记不存在');
      }
      
      const updatedNote = {
        ...notes[noteIndex],
        ...noteData,
        updatedAt: new Date().toISOString(),
        wordCount: this.getWordCount(noteData.content || notes[noteIndex].content),
        readTime: this.calculateReadTime(noteData.content || notes[noteIndex].content)
      };
      
      notes[noteIndex] = updatedNote;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      
      // 更新标签列表
      this.updateTagsList(updatedNote.tags || []);
      
      return updatedNote;
    } catch (error) {
      console.error('更新笔记失败:', error);
      throw new Error('更新笔记失败');
    }
  }

  // 删除笔记
  deleteNote(id) {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      
      if (notes.length === filteredNotes.length) {
        throw new Error('笔记不存在');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('删除笔记失败:', error);
      throw new Error('删除笔记失败');
    }
  }

  // 批量删除笔记
  deleteNotes(ids) {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(note => !ids.includes(note.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('批量删除笔记失败:', error);
      throw new Error('批量删除笔记失败');
    }
  }

  // 切换收藏状态
  toggleStar(id) {
    try {
      const notes = this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex === -1) {
        throw new Error('笔记不存在');
      }
      
      notes[noteIndex].starred = !notes[noteIndex].starred;
      notes[noteIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return notes[noteIndex];
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      throw new Error('切换收藏状态失败');
    }
  }

  // 搜索笔记
  searchNotes(query, filters = {}) {
    try {
      let notes = this.getAllNotes();
      
      // 文本搜索
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        notes = notes.filter(note => 
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // 分类过滤
      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'starred') {
          notes = notes.filter(note => note.starred);
        } else {
          notes = notes.filter(note => note.category === filters.category);
        }
      }
      
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        notes = notes.filter(note => 
          filters.tags.some(tag => note.tags.includes(tag))
        );
      }
      
      // 日期范围过滤
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        notes = notes.filter(note => {
          const noteDate = new Date(note.createdAt);
          return noteDate >= start && noteDate <= end;
        });
      }
      
      return notes;
    } catch (error) {
      console.error('搜索笔记失败:', error);
      return [];
    }
  }

  // 获取分类列表
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
    } catch (error) {
      console.error('获取分类失败:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  // 获取标签列表
  getTags() {
    try {
      return JSON.parse(localStorage.getItem(TAGS_KEY) || '[]');
    } catch (error) {
      console.error('获取标签失败:', error);
      return DEFAULT_TAGS;
    }
  }

  // 更新标签列表
  updateTagsList(newTags) {
    try {
      const existingTags = this.getTags();
      const uniqueTags = [...new Set([...existingTags, ...newTags])];
      localStorage.setItem(TAGS_KEY, JSON.stringify(uniqueTags));
    } catch (error) {
      console.error('更新标签列表失败:', error);
    }
  }

  // 添加新标签
  addTag(tag) {
    try {
      const existingTags = this.getTags();
      if (!existingTags.includes(tag)) {
        existingTags.push(tag);
        localStorage.setItem(TAGS_KEY, JSON.stringify(existingTags));
      }
      return true;
    } catch (error) {
      console.error('添加标签失败:', error);
      return false;
    }
  }

  // 删除标签
  removeTag(tag) {
    try {
      const existingTags = this.getTags();
      const filteredTags = existingTags.filter(t => t !== tag);
      localStorage.setItem(TAGS_KEY, JSON.stringify(filteredTags));
      return true;
    } catch (error) {
      console.error('删除标签失败:', error);
      return false;
    }
  }

  // 重命名标签
  renameTag(oldTag, newTag) {
    try {
      // 更新标签列表
      const existingTags = this.getTags();
      const tagIndex = existingTags.indexOf(oldTag);
      if (tagIndex !== -1) {
        existingTags[tagIndex] = newTag;
        localStorage.setItem(TAGS_KEY, JSON.stringify(existingTags));
      }

      // 更新所有笔记中的标签
      const notes = this.getAllNotes();
      const updatedNotes = notes.map(note => {
        if (note.tags && note.tags.includes(oldTag)) {
          const updatedTags = note.tags.map(tag => tag === oldTag ? newTag : tag);
          return { ...note, tags: updatedTags };
        }
        return note;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      
      return true;
    } catch (error) {
      console.error('重命名标签失败:', error);
      return false;
    }
  }

  // 获取笔记统计信息
  getNotesStats() {
    try {
      const notes = this.getAllNotes();
      const categories = this.getCategories();
      
      const stats = {
        total: notes.length,
        starred: notes.filter(note => note.starred).length,
        categories: {},
        tags: {},
        totalWords: notes.reduce((sum, note) => sum + note.wordCount, 0),
        recentNotes: notes.slice(0, 5)
      };
      
      // 统计各分类笔记数量
      categories.forEach(category => {
        if (category.id === 'all') {
          stats.categories[category.id] = notes.length;
        } else if (category.id === 'starred') {
          stats.categories[category.id] = notes.filter(note => note.starred).length;
        } else {
          stats.categories[category.id] = notes.filter(note => note.category === category.id).length;
        }
      });
      
      // 特别统计组织培训相关笔记
      stats.categories.organizational_training = notes.filter(note => 
        note.courseType === 'organizational_training' ||
        note.tags?.includes('组织培训') ||
        note.category === 'organizational_training'
      ).length;
      
      // 统计固定分类的笔记数量
      stats.categories.knowledge_graph = notes.filter(note => note.category === 'knowledge_graph').length;
      stats.categories.capability_model = notes.filter(note => note.category === 'capability_model').length;
      stats.categories.micro_major = notes.filter(note => note.category === 'micro_major').length;
      
      // 统计标签使用频率
      notes.forEach(note => {
        note.tags.forEach(tag => {
          stats.tags[tag] = (stats.tags[tag] || 0) + 1;
        });
      });
      
      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return {
        total: 0,
        starred: 0,
        categories: {},
        tags: {},
        totalWords: 0,
        recentNotes: []
      };
    }
  }

  // 计算字数
  getWordCount(content) {
    if (!content) return 0;
    // 中文字符 + 英文单词
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
    return chineseChars + englishWords;
  }

  // 计算阅读时间（分钟）
  calculateReadTime(content) {
    const wordCount = this.getWordCount(content);
    // 假设中文阅读速度为300字/分钟，英文为200词/分钟
    const readingSpeed = 250;
    return Math.max(1, Math.ceil(wordCount / readingSpeed));
  }

  // 导出笔记数据
  exportNotes(format = 'json') {
    try {
      const notes = this.getAllNotes();
      const categories = this.getCategories();
      const tags = this.getTags();
      
      const exportData = {
        notes,
        categories,
        tags,
        exportTime: new Date().toISOString(),
        version: '1.0'
      };
      
      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      }
      
      // 可以扩展其他格式
      return exportData;
    } catch (error) {
      console.error('导出笔记失败:', error);
      throw new Error('导出笔记失败');
    }
  }

  // 导入笔记数据
  importNotes(data, options = { merge: true }) {
    try {
      let importData;
      
      if (typeof data === 'string') {
        importData = JSON.parse(data);
      } else {
        importData = data;
      }
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        throw new Error('无效的导入数据格式');
      }
      
      if (options.merge) {
        // 合并模式：保留现有数据，添加新数据
        const existingNotes = this.getAllNotes();
        const existingIds = new Set(existingNotes.map(note => note.id));
        
        const newNotes = importData.notes.filter(note => !existingIds.has(note.id));
        const mergedNotes = [...existingNotes, ...newNotes];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedNotes));
        
        // 合并分类和标签
        if (importData.categories) {
          const existingCategories = this.getCategories();
          const mergedCategories = [...existingCategories];
          importData.categories.forEach(category => {
            if (!mergedCategories.find(c => c.id === category.id)) {
              mergedCategories.push(category);
            }
          });
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mergedCategories));
        }
        
        if (importData.tags) {
          const existingTags = this.getTags();
          const mergedTags = [...new Set([...existingTags, ...importData.tags])];
          localStorage.setItem(TAGS_KEY, JSON.stringify(mergedTags));
        }
        
        return {
          imported: newNotes.length,
          skipped: importData.notes.length - newNotes.length,
          total: mergedNotes.length
        };
      } else {
        // 替换模式：完全替换现有数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.notes));
        
        if (importData.categories) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(importData.categories));
        }
        
        if (importData.tags) {
          localStorage.setItem(TAGS_KEY, JSON.stringify(importData.tags));
        }
        
        return {
          imported: importData.notes.length,
          skipped: 0,
          total: importData.notes.length
        };
      }
    } catch (error) {
      console.error('导入笔记失败:', error);
      throw new Error('导入笔记失败: ' + error.message);
    }
  }

  // 清空所有数据
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(TAGS_KEY);
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      throw new Error('清空数据失败');
    }
  }

  // 高级搜索
  advancedSearch(criteria) {
    const notes = this.getAllNotes();
    
    return notes.filter(note => {
      // 关键词搜索
      if (criteria.keyword) {
        const keyword = criteria.keyword.toLowerCase();
        const matchesKeyword = 
          note.title.toLowerCase().includes(keyword) ||
          note.content.toLowerCase().includes(keyword) ||
          note.tags.some(tag => tag.toLowerCase().includes(keyword));
        
        if (!matchesKeyword) return false;
      }
      
      // 分类过滤
      if (criteria.categories && criteria.categories.length > 0) {
        if (!criteria.categories.includes(note.category)) return false;
      }
      
      // 标签过滤
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some(tag => note.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      
      // 日期范围过滤
      if (criteria.dateRange && criteria.dateRange.length === 2) {
        const noteDate = new Date(note.createdAt);
        const startDate = new Date(criteria.dateRange[0]);
        const endDate = new Date(criteria.dateRange[1]);
        endDate.setHours(23, 59, 59, 999); // 包含结束日期的整天
        
        if (noteDate < startDate || noteDate > endDate) return false;
      }
      
      // 字数范围过滤
      if (criteria.wordCountRange && criteria.wordCountRange.length === 2) {
        const wordCount = this.getWordCount(note.content);
        const [minWords, maxWords] = criteria.wordCountRange;
        
        if (wordCount < minWords || wordCount > maxWords) return false;
      }
      
      // 收藏状态过滤
      if (criteria.onlyFavorites && !note.starred) return false;
      
      // 内容类型过滤
      if (criteria.contentType) {
        switch (criteria.contentType) {
          case 'text':
            // 纯文本笔记（不包含特殊格式）
            if (note.content.includes('**') || note.content.includes('##') || 
                note.content.includes('- ') || note.content.includes('1. ')) {
              return false;
            }
            break;
          case 'markdown':
            // Markdown格式笔记
            if (!(note.content.includes('**') || note.content.includes('##') || 
                  note.content.includes('- ') || note.content.includes('1. '))) {
              return false;
            }
            break;
          case 'list':
            // 列表格式笔记
            if (!(note.content.includes('- ') || note.content.includes('1. '))) {
              return false;
            }
            break;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // 排序
      switch (criteria.sortBy) {
        case 'title':
          return criteria.sortOrder === 'asc' ? 
            a.title.localeCompare(b.title) : 
            b.title.localeCompare(a.title);
        case 'createdAt':
          return criteria.sortOrder === 'asc' ? 
            new Date(a.createdAt) - new Date(b.createdAt) : 
            new Date(b.createdAt) - new Date(a.createdAt);
        case 'updatedAt':
          return criteria.sortOrder === 'asc' ? 
            new Date(a.updatedAt) - new Date(b.updatedAt) : 
            new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'wordCount':
          const aWords = this.getWordCount(a.content);
          const bWords = this.getWordCount(b.content);
          return criteria.sortOrder === 'asc' ? aWords - bWords : bWords - aWords;
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
  }

  // 保存搜索条件
  saveSearchCriteria(name, criteria) {
    const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const newSearch = {
      id: Date.now().toString(),
      name,
      criteria,
      createdAt: new Date().toISOString()
    };
    
    savedSearches.push(newSearch);
    localStorage.setItem('saved_searches', JSON.stringify(savedSearches));
    return newSearch;
  }

  // 获取保存的搜索
  getSavedSearches() {
    return JSON.parse(localStorage.getItem('saved_searches') || '[]');
  }

  // 删除保存的搜索
  deleteSavedSearch(id) {
    const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const filtered = savedSearches.filter(search => search.id !== id);
    localStorage.setItem('saved_searches', JSON.stringify(filtered));
    return true;
  }

  // 保存搜索历史
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return;
    
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const filtered = history.filter(item => item !== keyword);
    filtered.unshift(keyword);
    
    // 只保留最近20条搜索历史
    const limited = filtered.slice(0, 20);
    localStorage.setItem('search_history', JSON.stringify(limited));
  }

  // 获取搜索历史
  getSearchHistory() {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  }

  // 清空搜索历史
  clearSearchHistory() {
    localStorage.removeItem('search_history');
    return true;
  }

  // 同步组织培训课程到智能笔记
  syncOrganizationalCourses(courses) {
    try {
      const existingNotes = this.getAllNotes();
      const syncedNotes = [];
      
      courses.forEach(course => {
        // 检查是否已经同步过该课程
        const existingNote = existingNotes.find(note => 
          note.source === '组织培训' && note.courseId === course.id
        );
        
        if (!existingNote) {
          // 创建新的智能笔记
          const noteData = {
            title: `【组织培训】${course.title}`,
            content: this.generateCourseNoteContent(course),
            category: 'study',
            tags: this.generateCourseTags(course),
            source: '组织培训',
            courseId: course.id,
            courseType: course.type,
            starred: false,
            // 添加视频相关信息
            videoInfo: this.extractVideoInfo(course),
            materials: course.materials
          };
          
          const newNote = this.createNote(noteData);
          syncedNotes.push(newNote);
        } else {
          // 更新现有笔记
          const updatedContent = this.generateCourseNoteContent(course);
          const updatedTags = this.generateCourseTags(course);
          
          this.updateNote(existingNote.id, {
            title: `【组织培训】${course.title}`,
            content: updatedContent,
            tags: updatedTags,
            updatedAt: new Date().toISOString()
          });
          
          syncedNotes.push(existingNote);
        }
      });
      
      return {
        success: true,
        syncedCount: syncedNotes.length,
        syncedNotes: syncedNotes
      };
    } catch (error) {
      console.error('同步组织培训课程失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 生成课程笔记内容
  generateCourseNoteContent(course) {
    const statusMap = {
      '待开课': '📅 待开课',
      '进行中': '🔄 进行中',
      '已完成': '✅已完成',
      '已取消': '❌ 已取消'
    };

    const typeMap = {
      'organizational_training': '组织培训',
      'self_learning': '自主学习'
    };

    const categoryMap = {
      'teaching_methods': '教学方法',
      'student_management': '学生管理',
      'educational_tech': '教育技术',
      'curriculum_design': '课程设计',
      'policy_compliance': '政策合规'
    };

    return `## 课程基本信息

**课程名称：** ${course.title}
**课程类型：** ${typeMap[course.type] || course.type}
**课程分类：** ${categoryMap[course.category] || course.category}
**课程状态：** ${statusMap[course.status] || course.status}
**创建时间：** ${new Date(course.createdAt).toLocaleString()}
**更新时间：** ${new Date(course.updatedAt).toLocaleString()}

## 课程描述

${course.description || '暂无课程描述'}

## 课程内容

${course.content || '暂无详细课程内容'}

${course.instructor ? `## 主讲教师\n\n**教师：** ${course.instructor}` : ''}

${course.schedule ? `## 课程安排\n\n${JSON.stringify(course.schedule, null, 2)}` : ''}

${course.participants && course.participants.length > 0 ? `## 参与人员\n\n${course.participants.map(p => `- ${p}`).join('\n')}` : ''}

## 学习笔记

*在此处记录学习心得和要点...*

---

**数据来源：** 组织培训系统  
**同步时间：** ${new Date().toLocaleString()}  
**课程ID：** ${course.id}`;
  }

  // 生成课程标签
  generateCourseTags(course) {
    const tags = ['组织培训'];
    
    // 添加课程状态标签
    if (course.status) {
      tags.push(course.status);
    }
    
    // 添加课程分类标签
    const categoryMap = {
      'teaching_methods': '教学方法',
      'student_management': '学生管理',
      'educational_tech': '教育技术',
      'curriculum_design': '课程设计',
      'policy_compliance': '政策合规'
    };
    
    if (course.category && categoryMap[course.category]) {
      tags.push(categoryMap[course.category]);
    }
    
    // 添加原有标签
    if (course.tags && Array.isArray(course.tags)) {
      tags.push(...course.tags);
    }
    
    // 去重并返回
    return [...new Set(tags)];
  }

  // 提取课程中的视频信息
  extractVideoInfo(course) {
    try {
      // 检查课程是否包含视频相关内容
      if (course.materials && course.materials.videos && course.materials.videos.length > 0) {
        const videos = course.materials.videos;
        const totalDuration = videos.reduce((total, video) => {
          const duration = this.parseDuration(video.duration || 0);
          return total + duration;
        }, 0);
        
        const watchedDuration = videos.reduce((total, video) => {
          const duration = this.parseDuration(video.duration || 0);
          const progress = video.progress || 0;
          return total + (duration * progress / 100);
        }, 0);
        
        const overallProgress = totalDuration > 0 ? Math.round((watchedDuration / totalDuration) * 100) : 0;
        
        return {
          type: 'multi_video',
          totalVideos: videos.length,
          totalDuration: totalDuration,
          watchedDuration: watchedDuration,
          overallProgress: overallProgress,
          videos: videos.map(video => ({
            id: video.id,
            title: video.title,
            url: video.url,
            duration: this.parseDuration(video.duration || 0),
            progress: video.progress || 0,
            instructor: video.instructor
          }))
        };
      }
      
      // 检查课程是否为单个视频课程
      if (course.videoUrl || course.video || (course.type && course.type.includes('video'))) {
        return {
          type: 'single_video',
          url: course.videoUrl || course.video,
          duration: this.parseDuration(course.duration || 0),
          progress: course.progress || 0,
          instructor: course.instructor
        };
      }
      
      return null;
    } catch (error) {
      console.error('提取视频信息失败:', error);
      return null;
    }
  }
  
  // 解析时长字符串为秒数
  parseDuration(duration) {
    if (typeof duration === 'number') {
      return duration;
    }
    
    if (typeof duration === 'string') {
      // 支持格式: "30分钟", "1小时15分钟", "45min", "1h30m"
      duration = duration.toLowerCase().replace(/分钟|小时/g, '');
      
      if (duration.includes('h') && duration.includes('m')) {
        const parts = duration.match(/(\d+)h(\d+)m/);
        if (parts) {
          return parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60;
        }
      } else if (duration.includes('h')) {
        const hours = parseInt(duration.replace('h', ''));
        return hours * 3600;
      } else if (duration.includes('min') || duration.includes('m')) {
        const minutes = parseInt(duration.replace(/min|m/, ''));
        return minutes * 60;
      } else {
        // 假设是分钟
        const minutes = parseInt(duration);
        return isNaN(minutes) ? 0 : minutes * 60;
      }
    }
    
    return 0;
  }
  
  // 格式化时长显示
  formatDuration(seconds) {
    if (!seconds || seconds === 0) return '0分钟';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`;
    } else {
      return `${minutes}分钟`;
    }
  }

  // 更新视频播放进度
  updateVideoProgress(noteId, videoId, progress) {
    try {
      const note = this.getNoteById(noteId);
      if (!note || !note.videoInfo) {
        return false;
      }
      
      if (note.videoInfo.type === 'single_video') {
        // 单个视频的进度更新
        note.videoInfo.progress = Math.max(0, Math.min(100, progress));
      } else if (note.videoInfo.type === 'multi_video' && note.videoInfo.videos) {
        // 多个视频的进度更新
        const videoIndex = note.videoInfo.videos.findIndex(v => v.id === videoId);
        if (videoIndex !== -1) {
          note.videoInfo.videos[videoIndex].progress = Math.max(0, Math.min(100, progress));
          
          // 重新计算整体进度
          const totalDuration = note.videoInfo.videos.reduce((total, video) => total + video.duration, 0);
          const watchedDuration = note.videoInfo.videos.reduce((total, video) => {
            return total + (video.duration * video.progress / 100);
          }, 0);
          
          note.videoInfo.watchedDuration = watchedDuration;
          note.videoInfo.overallProgress = totalDuration > 0 ? Math.round((watchedDuration / totalDuration) * 100) : 0;
        }
      }
      
      // 保存更新
      this.updateNote(noteId, { videoInfo: note.videoInfo });
      return true;
    } catch (error) {
      console.error('更新视频进度失败:', error);
      return false;
    }
  }
  
  // 获取视频类型的笔记
  getVideoNotes() {
    try {
      const notes = this.getAllNotes();
      return notes.filter(note => note.videoInfo && note.videoInfo.type);
    } catch (error) {
      console.error('获取视频笔记失败:', error);
      return [];
    }
  }
  
  // 获取来自组织培训的笔记
  getOrganizationalTrainingNotes() {
    try {
      const notes = this.getAllNotes();
      return notes.filter(note => note.source === '组织培训');
    } catch (error) {
      console.error('获取组织培训笔记失败:', error);
      return [];
    }
  }

  // 删除组织培训同步的笔记
  removeOrganizationalTrainingNotes(courseIds = []) {
    try {
      const notes = this.getAllNotes();
      let removedCount = 0;
      
      if (courseIds.length > 0) {
        // 删除指定课程的笔记
        const notesToRemove = notes.filter(note => 
          note.source === '组织培训' && courseIds.includes(note.courseId)
        );
        
        notesToRemove.forEach(note => {
          this.deleteNote(note.id);
          removedCount++;
        });
      } else {
        // 删除所有组织培训笔记
        const notesToRemove = notes.filter(note => note.source === '组织培训');
        
        notesToRemove.forEach(note => {
          this.deleteNote(note.id);
          removedCount++;
        });
      }
      
      return {
        success: true,
        removedCount: removedCount
      };
    } catch (error) {
      console.error('删除组织培训笔记失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 从学习广场课程创建笔记
   * @param {Object} course - 课程信息
   * @returns {Object} 创建的笔记
   */
  createNoteFromCourse(course) {
    const noteId = this.generateId();
    const currentTime = new Date().toISOString();
    
    // 模拟视频数据（基于课程信息）
    const videoData = this.generateVideoDataFromCourse(course);
    
    const note = {
      id: noteId,
      title: `【学习广场】${course.title}`,
      content: this.generateLearningSquareCourseContent(course),
      category: 'learning_square',
      tags: ['学习广场', course.level || '中级', '课程学习'],
      starred: false,
      source: '学习广场',
      courseId: course.id,
      courseType: 'learning_square',
      instructor: course.instructor,
      originalPrice: course.originalPrice,
      currentPrice: course.price,
      rating: course.rating,
      students: course.students,
      duration: course.duration,
      level: course.level,
      description: course.description,
      // 视频数据作为来源数据
      videoInfo: videoData,
      learningProgress: {
        startTime: currentTime,
        currentProgress: 0,
        totalSections: videoData.type === 'multi_video' ? videoData.totalVideos : 1,
        completedSections: 0,
        lastAccessTime: currentTime
      },
      createdAt: currentTime,
      updatedAt: currentTime,
      wordCount: 0
    };
    
    const notes = this.getAllNotes();
    notes.unshift(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    
    // 更新标签列表
    this.updateTagsList(note.tags);
    
    return note;
  }
  
  /**
   * 基于课程信息生成视频数据
   * @param {Object} course - 课程信息
   * @returns {Object} 视频数据
   */
  generateVideoDataFromCourse(course) {
    // 根据课程类型和时长生成不同的视频结构
    const totalMinutes = parseInt(course.duration) || 30;
    
    if (totalMinutes > 40) {
      // 长课程，分成多个视频
      const videoCount = Math.ceil(totalMinutes / 15); // 每15分钟一个视频
      const avgDuration = Math.floor((totalMinutes * 60) / videoCount);
      
      const videos = [];
      for (let i = 0; i < videoCount; i++) {
        videos.push({
          id: `${course.id}_video_${i + 1}`,
          title: `第${i + 1}讲 - ${this.getVideoTitle(course.title, i, videoCount)}`,
          url: `https://example.com/course/${course.id}/video/${i + 1}`,
          duration: avgDuration + Math.floor(Math.random() * 300 - 150), // 加上一些随机性
          progress: 0,
          instructor: course.instructor
        });
      }
      
      return {
        type: 'multi_video',
        totalVideos: videoCount,
        totalDuration: totalMinutes * 60,
        watchedDuration: 0,
        overallProgress: 0,
        videos: videos
      };
    } else {
      // 短课程，单个视频
      return {
        type: 'single_video',
        url: `https://example.com/course/${course.id}/video`,
        duration: totalMinutes * 60,
        progress: 0,
        instructor: course.instructor
      };
    }
  }
  
  /**
   * 生成视频标题
   * @param {string} courseTitle - 课程标题
   * @param {number} index - 视频索引
   * @param {number} total - 总视频数
   * @returns {string} 视频标题
   */
  getVideoTitle(courseTitle, index, total) {
    const titles = {
      'Python': ['基础语法', '数据结构', '函数与模块', '实战项目'],
      '机器学习': ['算法原理', '数据预处理', '模型训练', '效果评估'],
      'React': ['组件基础', '状态管理', '路由配置', '项目实战'],
      'UI/UX': ['设计原则', '用户研究', '原型设计', '交互设计'],
      'JavaScript': ['基础语法', 'DOM操作', '异步编程', '框架应用'],
      'HTML': ['标签基础', '表单处理', '语义化标签', '响应式设计']
    };
    
    // 对课程标题进行匹配
    for (const [key, videoTitles] of Object.entries(titles)) {
      if (courseTitle.includes(key)) {
        return videoTitles[index % videoTitles.length] || `内容${index + 1}`;
      }
    }
    
    return `内容${index + 1}`;
  }
  
  /**
   * 生成学习广场课程笔记内容
   * @param {Object} course - 课程信息
   * @returns {string} 笔记内容
   */
  generateLearningSquareCourseContent(course) {
    return `# ${course.title}

## 课程信息

**讲师：** ${course.instructor}
**难度：** ${course.level}
**时长：** ${course.duration}
**评分：** ${course.rating}/5.0
**学员数：** ${course.students?.toLocaleString()}人
**价格：** ￥${course.price}${course.originalPrice ? ` (原价￥${course.originalPrice})` : ''}

## 课程描述

${course.description}

## 学习笔记

*请在此处记录您的学习心得和要点...*

## 学习进度

- [ ] 开始学习
- [ ] 完成第一阶段
- [ ] 完成第二阶段
- [ ] 完成全部课程

## 重点内容

*请在学习过程中记录重点内容...*

## 实战练习

*请在此处记录实战练习的经验和成果...*

---

**数据来源：** 学习广场  
**同步时间：** ${new Date().toLocaleString()}  
**课程 ID：** ${course.id}`;
  }
}

// 创建单例实例
const notesService = new NotesService();

export default notesService;

// 导出类以便测试
export { NotesService };