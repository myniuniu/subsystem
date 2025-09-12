/**
 * 模拟数据生成器
 * 为智能笔记系统生成各种分类的模拟数据
 */

import notesService from '../services/notesService';
import dataRecordService from '../services/dataRecordService.js';

class MockDataGenerator {
  constructor() {
    this.studyNotes = [
      {
        title: 'JavaScript 异步编程详解',
        content: `# JavaScript 异步编程详解

## Promise 基础
Promise 是 JavaScript 中处理异步操作的重要机制。它有三种状态：
- pending（待定）
- fulfilled（已兑现）
- rejected（已拒绝）

## async/await 语法
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
\`\`\`

## 总结
异步编程是现代 JavaScript 开发的核心技能，掌握 Promise 和 async/await 对提高代码质量至关重要。`,
        category: 'study',
        tags: ['JavaScript', '异步编程', '前端开发', '重要'],
        starred: true
      },
      {
        title: 'React Hooks 学习笔记',
        content: `# React Hooks 学习笔记

## useState Hook
用于在函数组件中添加状态：
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook
用于处理副作用：
\`\`\`javascript
useEffect(() => {
  document.title = \`点击了 \${count} 次\`;
}, [count]);
\`\`\`

## 自定义 Hook
可以将组件逻辑提取到可重用的函数中。

## 注意事项
- Hook 只能在函数组件的顶层调用
- 不要在循环、条件或嵌套函数中调用 Hook`,
        category: 'study',
        tags: ['React', 'Hooks', '前端框架', '学习'],
        starred: false
      },
      {
        title: '数据结构与算法 - 二叉树',
        content: `# 二叉树数据结构

## 基本概念
二叉树是每个节点最多有两个子树的树结构。

## 遍历方式
1. **前序遍历**：根 -> 左 -> 右
2. **中序遍历**：左 -> 根 -> 右
3. **后序遍历**：左 -> 右 -> 根
4. **层序遍历**：按层从左到右

## 代码实现
\`\`\`javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// 中序遍历
function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node) {
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    }
  }
  
  traverse(root);
  return result;
}
\`\`\``,
        category: 'study',
        tags: ['算法', '数据结构', '二叉树', '编程'],
        starred: true
      },
      {
        title: 'CSS Grid 布局学习',
        content: `# CSS Grid 布局完全指南

## 基础概念
CSS Grid 是一个二维布局系统，可以同时处理行和列。

## 基本属性
### 容器属性
- \`display: grid\`
- \`grid-template-columns\`
- \`grid-template-rows\`
- \`gap\`

### 项目属性
- \`grid-column\`
- \`grid-row\`
- \`grid-area\`

## 实例代码
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 200px;
  gap: 20px;
}

.item1 {
  grid-column: 1 / 3;
  grid-row: 1;
}
\`\`\`

## 优势
- 强大的二维布局能力
- 简化复杂布局的实现
- 响应式设计友好`,
        category: 'study',
        tags: ['CSS', 'Grid', '布局', '前端'],
        starred: false
      },
      {
        title: 'Node.js 后端开发基础',
        content: `# Node.js 后端开发入门

## 什么是 Node.js
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。

## 核心模块
### HTTP 模块
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
\`\`\`

### 文件系统模块
\`\`\`javascript
const fs = require('fs');

// 异步读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
\`\`\`

## Express 框架
Express 是 Node.js 最流行的 Web 框架。

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(3000);
\`\`\``,
        category: 'study',
        tags: ['Node.js', '后端开发', 'Express', 'JavaScript'],
        starred: false
      }
    ];

    this.workNotes = [
      {
        title: '项目需求分析文档',
        content: `# 智能笔记系统需求分析

## 项目背景
开发一个功能完善的智能笔记管理系统，支持多种笔记格式和智能分析功能。

## 功能需求
### 核心功能
1. **笔记管理**
   - 创建、编辑、删除笔记
   - 分类和标签管理
   - 搜索和过滤功能

2. **数据分析**
   - 用户行为统计
   - 笔记访问分析
   - 使用习惯报告

3. **智能功能**
   - AI 助手
   - 自动分类建议
   - 内容推荐

## 技术栈
- 前端：React + Ant Design
- 存储：LocalStorage
- 图表：Ant Design Charts

## 时间安排
- 第一阶段：基础功能开发（2周）
- 第二阶段：智能功能集成（1周）
- 第三阶段：测试和优化（1周）`,
        category: 'work',
        tags: ['需求分析', '项目管理', '技术文档', '重要'],
        starred: true
      },
      {
        title: '团队会议纪要 - 2024年1月',
        content: `# 团队月度会议纪要

**时间**：2024年1月15日 14:00-16:00
**参会人员**：张三、李四、王五、赵六
**主持人**：张三

## 会议议题

### 1. 项目进度汇报
- 前端开发进度：80%
- 后端接口开发：70%
- 测试用例编写：60%

### 2. 问题讨论
#### 技术难点
- 数据同步机制需要优化
- 性能瓶颈在大数据量处理

#### 解决方案
- 采用增量同步策略
- 实现数据分页和虚拟滚动

### 3. 下周工作安排
- **张三**：完成用户权限模块
- **李四**：优化数据库查询性能
- **王五**：编写单元测试
- **赵六**：准备用户验收测试

## 行动项
1. 李四本周内提交性能优化方案
2. 王五完成核心模块测试覆盖
3. 下次会议时间：1月22日`,
        category: 'work',
        tags: ['会议纪要', '项目管理', '团队协作'],
        starred: false
      },
      {
        title: 'API 接口设计文档',
        content: `# RESTful API 设计规范

## 基本原则
1. 使用 HTTP 动词表示操作
2. 使用名词表示资源
3. 统一的响应格式
4. 合理的状态码使用

## 接口列表

### 用户管理
\`\`\`
GET    /api/users          # 获取用户列表
GET    /api/users/:id      # 获取用户详情
POST   /api/users          # 创建用户
PUT    /api/users/:id      # 更新用户
DELETE /api/users/:id      # 删除用户
\`\`\`

### 笔记管理
\`\`\`
GET    /api/notes          # 获取笔记列表
GET    /api/notes/:id      # 获取笔记详情
POST   /api/notes          # 创建笔记
PUT    /api/notes/:id      # 更新笔记
DELETE /api/notes/:id      # 删除笔记
\`\`\`

## 响应格式
\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

## 错误处理
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误`,
        category: 'work',
        tags: ['API设计', '技术文档', '后端开发'],
        starred: true
      },
      {
        title: '代码审查清单',
        content: `# 代码审查清单

## 代码质量
- [ ] 代码符合团队编码规范
- [ ] 变量和函数命名清晰易懂
- [ ] 代码逻辑清晰，易于理解
- [ ] 避免重复代码
- [ ] 适当的注释说明

## 功能实现
- [ ] 功能实现符合需求
- [ ] 边界条件处理完善
- [ ] 错误处理机制完整
- [ ] 性能考虑合理

## 安全性
- [ ] 输入验证和过滤
- [ ] SQL 注入防护
- [ ] XSS 攻击防护
- [ ] 敏感信息保护

## 测试
- [ ] 单元测试覆盖率达标
- [ ] 集成测试通过
- [ ] 手动测试验证

## 文档
- [ ] API 文档更新
- [ ] 代码注释完整
- [ ] 变更日志记录

## 部署
- [ ] 配置文件检查
- [ ] 依赖版本确认
- [ ] 回滚方案准备`,
        category: 'work',
        tags: ['代码审查', '质量控制', '开发流程'],
        starred: false
      }
    ];

    this.personalNotes = [
      {
        title: '2024年个人目标规划',
        content: `# 2024年个人发展规划

## 技术成长目标
### 前端技能提升
- [ ] 深入学习 React 18 新特性
- [ ] 掌握 TypeScript 高级用法
- [ ] 学习微前端架构
- [ ] 了解 Web3 相关技术

### 后端技能拓展
- [ ] 学习 Go 语言
- [ ] 深入理解分布式系统
- [ ] 掌握 Docker 和 Kubernetes
- [ ] 学习云原生技术栈

## 个人发展
### 软技能
- [ ] 提升沟通表达能力
- [ ] 加强项目管理技能
- [ ] 培养团队领导力
- [ ] 提高英语水平

### 学习计划
- 每周阅读 2 篇技术文章
- 每月完成 1 个小项目
- 每季度学习 1 门新技术
- 每年参加 2 次技术会议

## 生活目标
- 保持健康的作息时间
- 每周运动 3 次
- 多陪伴家人朋友
- 培养 1-2 个新爱好

## 财务规划
- 制定合理的储蓄计划
- 学习投资理财知识
- 规划职业发展路径`,
        category: 'personal',
        tags: ['目标规划', '个人发展', '年度计划', '重要'],
        starred: true
      },
      {
        title: '读书笔记：《代码整洁之道》',
        content: `# 《代码整洁之道》读书笔记

## 核心观点

### 整洁代码的特征
1. **可读性强**：代码应该像散文一样易读
2. **简洁明了**：做一件事，并且做好
3. **表达力强**：代码即文档
4. **易于维护**：修改代码不会破坏其他功能

### 命名规则
- 使用有意义的名称
- 避免误导性名称
- 做有意义的区分
- 使用可搜索的名称

### 函数设计原则
- 函数应该短小
- 只做一件事
- 每个函数一个抽象层级
- 使用描述性名称

## 实践建议

### 代码格式
- 保持一致的缩进
- 合理使用空行分隔
- 控制行长度
- 团队统一格式规范

### 注释原则
- 好代码本身就是注释
- 注释应该解释"为什么"而不是"是什么"
- 避免冗余注释
- 及时更新注释

## 个人感悟
写代码不仅仅是实现功能，更是一种艺术。整洁的代码不仅让自己受益，也是对团队和未来维护者的负责。

## 行动计划
- 在日常开发中践行整洁代码原则
- 定期重构现有代码
- 与团队分享整洁代码理念`,
        category: 'personal',
        tags: ['读书笔记', '代码质量', '软件工程', '学习'],
        starred: false
      },
      {
        title: '健身计划记录',
        content: `# 2024年健身计划

## 目标设定
- 减重 10 公斤
- 增加肌肉量
- 提高心肺功能
- 改善体态

## 训练计划

### 周一：胸部 + 三头肌
- 平板卧推 4组 x 8-12次
- 上斜哑铃推举 3组 x 10-15次
- 双杠臂屈伸 3组 x 8-12次
- 三头肌下压 3组 x 12-15次

### 周三：背部 + 二头肌
- 引体向上 4组 x 5-10次
- 杠铃划船 4组 x 8-12次
- 哑铃弯举 3组 x 10-15次
- 锤式弯举 3组 x 12-15次

### 周五：腿部 + 肩部
- 深蹲 4组 x 8-12次
- 硬拉 3组 x 6-10次
- 肩上推举 3组 x 10-15次
- 侧平举 3组 x 12-15次

### 有氧运动
- 每次训练后 20-30 分钟有氧
- 周末长时间有氧运动

## 饮食计划
- 增加蛋白质摄入
- 控制碳水化合物
- 多吃蔬菜水果
- 充足的水分摄入

## 进度记录
- 每周测量体重和体脂率
- 记录训练重量和次数
- 拍照记录体型变化`,
        category: 'personal',
        tags: ['健身', '健康', '生活规划'],
        starred: false
      }
    ];

    this.ideasNotes = [
      {
        title: '智能代码生成工具创意',
        content: `# AI 驱动的智能代码生成工具

## 核心创意
开发一个基于 AI 的代码生成工具，能够根据自然语言描述生成高质量的代码。

## 功能特性

### 自然语言转代码
- 支持中英文描述
- 理解复杂的业务逻辑
- 生成多种编程语言代码

### 智能优化
- 代码性能优化建议
- 安全漏洞检测
- 代码规范检查

### 学习能力
- 从用户反馈中学习
- 适应团队编码风格
- 持续改进生成质量

## 技术实现

### AI 模型
- 基于大语言模型
- 针对代码生成场景微调
- 支持多种编程语言

### 集成方式
- VS Code 插件
- JetBrains IDE 插件
- Web 在线版本
- API 接口服务

## 商业模式
- 免费版：基础功能
- 专业版：高级功能 + 团队协作
- 企业版：私有部署 + 定制化

## 竞争优势
- 更好的中文支持
- 针对特定领域优化
- 更强的学习适应能力

## 发展路线
1. MVP 版本开发
2. 用户测试和反馈
3. 功能完善和优化
4. 商业化推广`,
        category: 'ideas',
        tags: ['AI', '代码生成', '创业想法', '工具开发'],
        starred: true
      },
      {
        title: '个人知识管理系统构想',
        content: `# 第二大脑 - 个人知识管理系统

## 灵感来源
受到《Building a Second Brain》一书启发，构建一个真正智能的个人知识管理系统。

## 核心理念

### PARA 方法
- **Projects**：当前项目
- **Areas**：责任领域
- **Resources**：未来参考
- **Archive**：已完成项目

### 渐进式总结
1. 高亮重要内容
2. 加粗关键信息
3. 提取核心观点
4. 形成个人见解

## 功能设计

### 智能输入
- 语音转文字
- 图片文字识别
- 网页内容抓取
- 文档自动导入

### 知识连接
- 自动标签建议
- 相关内容推荐
- 知识图谱可视化
- 概念关联分析

### 智能检索
- 语义搜索
- 模糊匹配
- 时间线检索
- 关联内容发现

### 知识输出
- 自动生成摘要
- 思维导图导出
- 报告模板生成
- 知识分享功能

## 技术架构

### 前端
- React + TypeScript
- 富文本编辑器
- 图表可视化组件

### 后端
- Node.js + Express
- 向量数据库
- 自然语言处理

### AI 能力
- 文本分析和理解
- 内容自动分类
- 智能推荐算法

## 差异化特色
- 更符合中文用户习惯
- 集成更多本土化服务
- 强调知识的实际应用`,
        category: 'ideas',
        tags: ['知识管理', '第二大脑', '产品设计', '个人效率'],
        starred: true
      }
    ];
  }

  // 生成所有模拟数据
  async generateAllMockData() {
    try {
      console.log('开始生成模拟数据...');
      
      // 生成笔记数据
      const allNotes = [
        ...this.studyNotes,
        ...this.workNotes,
        ...this.personalNotes,
        ...this.ideasNotes
      ];
      
      // 创建笔记并记录行为
      for (let i = 0; i < allNotes.length; i++) {
        const noteData = allNotes[i];
        const createdNote = notesService.createNote(noteData);
        
        // 模拟创建时间（过去30天内随机）
        const randomDays = Math.floor(Math.random() * 30);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - randomDays);
        
        // 更新创建时间
        const notes = notesService.getAllNotes();
        const noteIndex = notes.findIndex(n => n.id === createdNote.id);
        if (noteIndex !== -1) {
          notes[noteIndex].createdAt = createdAt.toISOString();
          notes[noteIndex].updatedAt = createdAt.toISOString();
          localStorage.setItem('smart_notes_data', JSON.stringify(notes));
        }
        
        // 记录创建行为
        dataRecordService.recordUserBehavior('note_create', {
          noteId: createdNote.id,
          category: noteData.category,
          tags: noteData.tags,
          timestamp: createdAt.toISOString()
        });
        
        // 模拟一些查看行为
        const viewCount = Math.floor(Math.random() * 10) + 1;
        for (let j = 0; j < viewCount; j++) {
          const viewDate = new Date(createdAt);
          viewDate.setDate(viewDate.getDate() + Math.floor(Math.random() * (30 - randomDays)));
          
          dataRecordService.recordNoteAccess(createdNote.id, {
            timestamp: viewDate.toISOString()
          });
          
          dataRecordService.recordUserBehavior('note_view', {
            noteId: createdNote.id,
            category: noteData.category,
            timestamp: viewDate.toISOString()
          });
        }
        
        // 模拟一些编辑行为
        if (Math.random() > 0.7) {
          const editDate = new Date(createdAt);
          editDate.setDate(editDate.getDate() + Math.floor(Math.random() * 15));
          
          dataRecordService.recordUserBehavior('note_edit', {
            noteId: createdNote.id,
            category: noteData.category,
            timestamp: editDate.toISOString()
          });
        }
      }
      
      // 生成一些搜索行为记录
      this.generateSearchBehaviors();
      
      console.log(`成功生成 ${allNotes.length} 条笔记数据`);
      return {
        success: true,
        count: allNotes.length,
        message: '模拟数据生成完成'
      };
      
    } catch (error) {
      console.error('生成模拟数据失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // 生成搜索行为数据
  generateSearchBehaviors() {
    const searchKeywords = [
      'JavaScript', 'React', '算法', '项目管理', '健身',
      '代码审查', 'API设计', '个人规划', 'AI', '知识管理'
    ];
    
    searchKeywords.forEach(keyword => {
      const searchCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < searchCount; i++) {
        const searchDate = new Date();
        searchDate.setDate(searchDate.getDate() - Math.floor(Math.random() * 30));
        
        dataRecordService.recordUserBehavior('search', {
          keyword,
          timestamp: searchDate.toISOString(),
          resultCount: Math.floor(Math.random() * 10) + 1
        });
      }
    });
  }
  
  // 获取数据统计
  getDataStats() {
    const notes = notesService.getAllNotes();
    const categories = {};
    const tags = {};
    
    notes.forEach(note => {
      categories[note.category] = (categories[note.category] || 0) + 1;
      note.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });
    
    return {
      totalNotes: notes.length,
      categories,
      tags,
      starredNotes: notes.filter(note => note.starred).length
    };
  }
}

const mockDataGenerator = new MockDataGenerator();
export default mockDataGenerator;