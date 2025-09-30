// 培训产品研发模拟数据生成器
export const generateTrainingProductDevelopmentData = () => {
  const trainingThemes = [
    {
      title: '小学数学思维训练课程设计',
      description: '针对小学3-6年级学生的数学思维能力培养，通过游戏化教学提升学生逻辑思维',
      targetAudience: '小学数学教师',
      duration: '40课时',
      difficulty: '中级',
      tags: ['数学思维', '游戏化教学', '小学教育']
    },
    {
      title: '初中语文阅读理解教学策略',
      description: '提升初中语文教师阅读理解教学能力，掌握多元化阅读教学方法',
      targetAudience: '初中语文教师',
      duration: '32课时',
      difficulty: '中级',
      tags: ['阅读理解', '教学策略', '初中语文']
    },
    {
      title: '高中物理实验教学创新',
      description: '结合现代技术手段，创新高中物理实验教学模式，提升学生实践能力',
      targetAudience: '高中物理教师',
      duration: '48课时',
      difficulty: '高级',
      tags: ['物理实验', '教学创新', '高中教育']
    },
    {
      title: '幼儿园艺术活动设计与实施',
      description: '培养幼儿教师艺术活动设计能力，促进幼儿全面发展',
      targetAudience: '幼儿园教师',
      duration: '24课时',
      difficulty: '初级',
      tags: ['艺术教育', '幼儿教育', '活动设计']
    },
    {
      title: '小学英语口语教学方法',
      description: '提升小学英语教师口语教学水平，培养学生英语交际能力',
      targetAudience: '小学英语教师',
      duration: '36课时',
      difficulty: '中级',
      tags: ['英语口语', '交际能力', '小学英语']
    },
    {
      title: '中学心理健康教育课程',
      description: '帮助中学教师掌握心理健康教育技能，关注学生心理发展',
      targetAudience: '中学心理教师',
      duration: '40课时',
      difficulty: '中级',
      tags: ['心理健康', '中学教育', '学生发展']
    },
    {
      title: '小学科学探究式教学',
      description: '培养小学科学教师探究式教学能力，激发学生科学兴趣',
      targetAudience: '小学科学教师',
      duration: '32课时',
      difficulty: '中级',
      tags: ['科学教育', '探究式教学', '小学教育']
    },
    {
      title: '高中历史史料教学法',
      description: '提升高中历史教师史料运用能力，培养学生史学思维',
      targetAudience: '高中历史教师',
      duration: '28课时',
      difficulty: '高级',
      tags: ['历史教学', '史料教学', '史学思维']
    }
  ];

  const developmentStages = ['需求调研', '课程设计', '内容开发', '试点实施', '效果评估', '优化完善'];
  const priorities = ['高', '中', '低'];
  const statuses = ['规划中', '开发中', '测试中', '已完成', '暂停'];

  const notes = [];
  const currentDate = new Date();

  trainingThemes.forEach((theme, index) => {
    // 为每个培训主题创建一个主要的产品研发笔记
    const mainNote = {
      id: `training_product_${index + 1}`,
      title: `【产品研发】${theme.title}`,
      content: `## 培训产品概述
**目标受众**: ${theme.targetAudience}
**培训时长**: ${theme.duration}
**难度等级**: ${theme.difficulty}

## 产品描述
${theme.description}

## 开发进度
- [x] 需求调研
- [x] 课程设计
- [${index % 3 === 0 ? 'x' : ' '}] 内容开发
- [${index % 4 === 0 ? 'x' : ' '}] 试点实施
- [ ] 效果评估
- [ ] 优化完善

## 核心要素
- **教学目标**: 提升教师专业能力，改善教学效果
- **教学方法**: 理论讲授 + 案例分析 + 实践操作 + 反思总结
- **评估方式**: 过程性评估 + 终结性评估
- **资源配置**: 教材、课件、视频、案例库

## 预期成果
1. 教师专业能力显著提升
2. 教学质量明显改善
3. 学生学习效果提高
4. 形成可推广的培训模式`,
      category: 'training_product_development',
      tags: ['培训产品研发', ...theme.tags],
      source: '培训产品研发',
      courseType: 'training_product_development',
      createdAt: new Date(currentDate.getTime() - (index * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(currentDate.getTime() - (index * 12 * 60 * 60 * 1000)).toISOString(),
      priority: priorities[index % 3],
      status: statuses[index % 5],
      progress: Math.floor(Math.random() * 100),
      author: '教研员',
      department: '教研部',
      targetAudience: theme.targetAudience,
      duration: theme.duration,
      difficulty: theme.difficulty,
      developmentStage: developmentStages[index % 6],
      isStarred: index % 3 === 0,
      viewCount: Math.floor(Math.random() * 50) + 10,
      collaborators: ['张教研', '李主任', '王老师'].slice(0, (index % 3) + 1)
    };

    notes.push(mainNote);

    // 为每个主题创建一些相关的子笔记
    const subNotes = [
      {
        id: `training_product_${index + 1}_research`,
        title: `${theme.title} - 需求调研报告`,
        content: `## 调研背景
针对${theme.targetAudience}的培训需求进行深入调研，了解当前教学中存在的问题和挑战。

## 调研方法
- 问卷调查：向200名${theme.targetAudience}发放问卷
- 深度访谈：与20名骨干教师进行一对一访谈
- 课堂观察：实地观察30节课堂教学
- 文献研究：分析相关教育理论和实践案例

## 主要发现
1. **教学方法单一**: 70%的教师仍采用传统讲授法
2. **技术应用不足**: 仅30%的教师能熟练运用现代教育技术
3. **个性化教学缺乏**: 85%的教师难以实现因材施教
4. **评估方式落后**: 评估方式单一，缺乏多元化评估

## 培训需求分析
- **迫切需求**: ${theme.tags[0]}相关技能提升
- **重要需求**: 现代教育技术应用
- **潜在需求**: 教学评估与反思能力

## 建议
基于调研结果，建议开发针对性强、实用性高的培训课程。`,
        category: 'training_product_development',
        tags: ['培训产品研发', '需求调研', theme.tags[0]],
        source: '培训产品研发',
        courseType: 'training_product_development',
        createdAt: new Date(currentDate.getTime() - ((index + 1) * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(currentDate.getTime() - ((index + 1) * 12 * 60 * 60 * 1000)).toISOString(),
        priority: '高',
        status: '已完成',
        progress: 100,
        author: '调研组',
        department: '教研部',
        parentId: mainNote.id,
        isStarred: false,
        viewCount: Math.floor(Math.random() * 30) + 5
      },
      {
        id: `training_product_${index + 1}_design`,
        title: `${theme.title} - 课程设计方案`,
        content: `## 课程目标
### 总体目标
通过本课程学习，使${theme.targetAudience}能够掌握${theme.tags[0]}的核心理念和实践方法。

### 具体目标
1. **知识目标**: 理解${theme.tags[0]}的基本概念和理论基础
2. **能力目标**: 掌握${theme.tags[0]}的实践技能和方法
3. **素养目标**: 形成${theme.tags[0]}的专业素养和反思能力

## 课程结构
**总课时**: ${theme.duration}

### 模块一：理论基础 (${Math.floor(parseInt(theme.duration) * 0.3)}课时)
- ${theme.tags[0]}的概念内涵
- 相关教育理论支撑
- 国内外发展现状

### 模块二：方法技能 (${Math.floor(parseInt(theme.duration) * 0.4)}课时)
- 核心方法介绍
- 技能训练与实践
- 案例分析与讨论

### 模块三：实践应用 (${Math.floor(parseInt(theme.duration) * 0.3)}课时)
- 教学设计实践
- 课堂教学演练
- 反思与改进

## 教学方法
- **理论讲授**: 专家讲座、理论阐释
- **案例教学**: 典型案例分析、经验分享
- **实践操作**: 动手实践、技能训练
- **合作学习**: 小组讨论、同伴互助

## 评估方案
- **过程评估** (60%): 参与度、作业完成情况、实践表现
- **结果评估** (40%): 期末作品、教学设计、反思报告`,
        category: 'training_product_development',
        tags: ['培训产品研发', '课程设计', theme.tags[1] || theme.tags[0]],
        source: '培训产品研发',
        courseType: 'training_product_development',
        createdAt: new Date(currentDate.getTime() - ((index + 2) * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(currentDate.getTime() - ((index + 2) * 12 * 60 * 60 * 1000)).toISOString(),
        priority: '高',
        status: index % 2 === 0 ? '已完成' : '开发中',
        progress: index % 2 === 0 ? 100 : 75,
        author: '课程设计组',
        department: '教研部',
        parentId: mainNote.id,
        isStarred: index % 4 === 0,
        viewCount: Math.floor(Math.random() * 40) + 8
      }
    ];

    notes.push(...subNotes);
  });

  // 添加一些综合性的培训产品研发笔记
  const comprehensiveNotes = [
    {
      id: 'training_product_strategy',
      title: '【战略规划】2024年培训产品研发规划',
      content: `## 年度目标
制定2024年培训产品研发的整体规划，确保培训产品质量和效果。

## 重点方向
1. **数字化教学能力提升**: 开发教师数字化教学技能培训产品
2. **学科核心素养培养**: 各学科核心素养导向的教学培训
3. **个性化教学实践**: 因材施教理念下的教学方法培训
4. **教育评价改革**: 新时代教育评价理念与实践培训

## 产品规划
- **新开发产品**: 12个培训主题
- **优化升级产品**: 8个现有培训主题
- **试点推广产品**: 5个成熟培训主题

## 质量保障
- 建立培训产品质量标准
- 完善产品开发流程
- 加强效果评估与反馈
- 持续优化改进机制

## 资源配置
- **人力资源**: 教研员15人，外聘专家8人
- **经费预算**: 总预算200万元
- **技术支持**: 在线平台、录播设备、教学工具

## 预期成果
- 培训教师5000人次
- 培训满意度达到95%以上
- 形成10个精品培训产品
- 建立培训产品质量评估体系`,
      category: 'training_product_development',
      tags: ['培训产品研发', '战略规划', '年度计划'],
      source: '培训产品研发',
      courseType: 'training_product_development',
      createdAt: new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: '高',
      status: '规划中',
      progress: 60,
      author: '教研部主任',
      department: '教研部',
      isStarred: true,
      viewCount: 85,
      collaborators: ['张主任', '李教研', '王专家', '陈老师']
    },
    {
      id: 'training_product_quality',
      title: '【质量管理】培训产品质量评估体系',
      content: `## 质量评估维度

### 1. 内容质量
- **科学性**: 内容准确、理论先进
- **实用性**: 贴近教学实际、可操作性强
- **系统性**: 结构完整、逻辑清晰
- **创新性**: 理念新颖、方法创新

### 2. 设计质量
- **目标明确**: 培训目标清晰具体
- **结构合理**: 模块设置科学合理
- **方法多样**: 教学方法丰富多元
- **评估完善**: 评估方式科学有效

### 3. 实施质量
- **师资优秀**: 培训师专业水平高
- **组织有序**: 培训组织管理规范
- **资源充足**: 教学资源配置合理
- **服务到位**: 培训服务质量优良

### 4. 效果质量
- **满意度高**: 参训教师满意度高
- **能力提升**: 教师专业能力明显提升
- **应用效果**: 培训成果在教学中有效应用
- **持续影响**: 培训效果具有持续性

## 评估方法
- **专家评审**: 邀请教育专家进行专业评估
- **同行评议**: 组织同行教师进行互评
- **学员反馈**: 收集参训教师的反馈意见
- **跟踪调研**: 对培训效果进行跟踪调研

## 质量改进
- 建立质量问题反馈机制
- 定期开展质量分析会议
- 持续优化培训产品内容
- 不断完善培训实施过程`,
      category: 'training_product_development',
      tags: ['培训产品研发', '质量管理', '评估体系'],
      source: '培训产品研发',
      courseType: 'training_product_development',
      createdAt: new Date(currentDate.getTime() - (25 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: '中',
      status: '开发中',
      progress: 80,
      author: '质量管理组',
      department: '教研部',
      isStarred: false,
      viewCount: 42,
      collaborators: ['质量专员', '评估专家']
    }
  ];

  notes.push(...comprehensiveNotes);

  return notes;
};