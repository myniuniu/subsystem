// 模拟数据生成器
import notesService from '../services/notesService';
import dataRecordService from '../services/dataRecordService.js';

// 生成唯一ID的辅助函数
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class MockDataGenerator {
  constructor() {
    // 学习笔记数据
    this.studyNotes = [
      {
        id: generateId(),
        title: '建构主义教学理论在程序设计课程中的应用',
        content: '# 建构主义教学理论在程序设计课程中的应用\n\n## 理论基础\n建构主义认为学习是学习者主动建构知识的过程，而不是被动接受信息。在程序设计教学中，这一理论具有重要指导意义。\n\n## 核心原则\n1. **学习者中心**：以学生为主体，教师为引导者\n2. **情境学习**：在真实的编程环境中学习\n3. **协作学习**：通过团队项目培养合作能力\n4. **反思学习**：鼓励学生思考和总结\n\n## 实践策略\n- 项目驱动教学法\n- 同伴编程（Pair Programming）\n- 代码审查和讨论\n- 问题解决导向学习\n\n## 教学效果\n通过建构主义教学方法，学生的编程思维和实践能力得到显著提升，学习积极性明显增强。',
        category: 'study',
        tags: ['教学理论', '建构主义', '程序设计', '教学方法'],
        starred: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: generateId(),
        title: '数据结构课程教学设计与实践',
        content: '# 数据结构课程教学设计与实践\n\n## 课程目标\n- 掌握基本数据结构的概念和实现\n- 培养算法分析和设计能力\n- 提高编程实践技能\n- 培养计算思维\n\n## 教学内容组织\n### 线性结构\n- 数组和链表\n- 栈和队列\n- 字符串处理\n\n### 树形结构\n- 二叉树及其遍历\n- 二叉搜索树\n- 平衡树（AVL、红黑树）\n\n### 图结构\n- 图的表示方法\n- 图的遍历算法\n- 最短路径算法\n\n## 教学方法创新\n1. **可视化教学**：使用动画演示算法过程\n2. **渐进式学习**：从简单到复杂，循序渐进\n3. **实践导向**：每个概念都配合编程实践\n4. **案例教学**：结合实际应用场景\n\n## 评价方式\n- 平时作业（30%）\n- 实验报告（30%）\n- 期末考试（40%）',
        category: 'study',
        tags: ['数据结构', '教学设计', '算法', '编程实践'],
        starred: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: generateId(),
        title: 'Python入门课程设计思路',
        content: '# Python入门课程设计思路\n\n## 课程定位\nPython作为一门易学易用的编程语言，适合作为编程入门课程。本课程面向零基础学生，旨在培养编程思维和实践能力。\n\n## 教学大纲\n### 第一阶段：基础语法（4周）\n- Python环境搭建\n- 变量和数据类型\n- 控制结构（条件、循环）\n- 函数定义和调用\n\n### 第二阶段：数据处理（4周）\n- 列表、元组、字典\n- 字符串处理\n- 文件操作\n- 异常处理\n\n### 第三阶段：面向对象（3周）\n- 类和对象\n- 继承和多态\n- 模块和包\n\n### 第四阶段：实践项目（3周）\n- 数据分析小项目\n- Web爬虫实践\n- 图形界面程序\n\n## 教学特色\n1. **项目驱动**：每个阶段都有实际项目\n2. **互动教学**：课堂编程演示和学生练习\n3. **个性化指导**：针对不同基础的学生提供差异化指导\n4. **实用导向**：注重解决实际问题的能力\n\n## 考核方式\n- 课堂参与（20%）\n- 阶段项目（50%）\n- 期末项目（30%）',
        category: 'study',
        tags: ['Python', '入门教学', '课程设计', '编程基础'],
        starred: false,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-03')
      },
      {
        id: generateId(),
        title: '在线教学平台使用心得',
        content: '# 在线教学平台使用心得\n\n## 平台选择\n经过对比测试，选择了腾讯会议+雨课堂的组合方案，既保证了视频质量，又实现了互动功能。\n\n## 使用技巧\n### 课前准备\n- 提前测试设备和网络\n- 准备备用方案\n- 制作课件时考虑屏幕分享效果\n- 设计互动环节\n\n### 课中管理\n- 控制课堂节奏，适当停顿\n- 多使用提问和投票功能\n- 关注学生反馈和弹幕\n- 录制课程供学生回看\n\n### 课后跟进\n- 及时发布课程资料\n- 收集学生反馈\n- 分析学习数据\n- 优化教学内容\n\n## 经验总结\n在线教学需要更多的互动设计和技术支持，但也为教学创新提供了新的可能性。',
        category: 'study',
        tags: ['在线教学', '教学平台', '远程教育', '教学技巧'],
        starred: false,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-12')
      },
      {
        id: generateId(),
        title: '学生学习行为分析与个性化教学策略',
        content: '# 学生学习行为分析与个性化教学策略\n\n## 数据收集\n通过学习管理系统收集学生的学习行为数据：\n- 登录时间和频率\n- 学习资源访问情况\n- 作业提交时间和质量\n- 讨论参与度\n- 测试成绩分布\n\n## 行为模式分析\n### 学习类型分类\n1. **积极主动型**：经常提前学习，主动参与讨论\n2. **按部就班型**：严格按照课程进度学习\n3. **临时抱佛脚型**：集中在截止日期前学习\n4. **困难挣扎型**：学习进度缓慢，需要额外帮助\n\n## 个性化策略\n### 针对不同类型的教学调整\n- 为积极型学生提供拓展资源\n- 为按部就班型学生保持稳定节奏\n- 为临时型学生设置提醒和激励机制\n- 为困难型学生提供额外辅导和简化材料\n\n## 实施效果\n个性化教学策略实施后，学生的学习满意度和成绩都有显著提升。',
        category: 'study',
        tags: ['学习分析', '个性化教学', '数据驱动', '教学策略'],
        starred: true,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-18')
      }
    ];

    // 工作笔记数据
    this.workNotes = [
      {
        id: generateId(),
        title: '计算机科学与技术专业课程体系设计',
        content: '# 计算机科学与技术专业课程体系设计\n\n## 培养目标\n培养具有良好科学素养，系统掌握计算机科学与技术基本理论、基本知识和基本技能的高级专门人才。\n\n## 核心课程设置\n### 数学基础课程\n- 高等数学\n- 线性代数\n- 概率论与数理统计\n- 离散数学\n\n### 专业基础课程\n- 程序设计基础\n- 数据结构\n- 计算机组成原理\n- 操作系统\n- 计算机网络\n- 数据库系统\n\n### 专业核心课程\n- 算法设计与分析\n- 软件工程\n- 编译原理\n- 人工智能\n- 机器学习\n\n## 实践教学体系\n- 课程实验（每门核心课程配套）\n- 课程设计（综合性项目）\n- 专业实习（企业实践）\n- 毕业设计（创新性项目）\n\n## 改革方向\n1. 加强实践教学比重\n2. 引入前沿技术内容\n3. 强化创新能力培养\n4. 注重跨学科融合',
        category: 'work',
        tags: ['课程体系', '专业建设', '教学改革', '人才培养'],
        starred: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: generateId(),
        title: '教研室会议纪要 - 2024年春季学期工作安排',
        content: '# 教研室会议纪要\n\n**会议时间**：2024年2月20日 14:00-16:00\n**参会人员**：全体教研室成员\n**主持人**：张主任\n\n## 主要议题\n\n### 1. 新学期教学安排\n- 确认各门课程的任课教师\n- 讨论教学大纲的修订\n- 安排实验室使用计划\n\n### 2. 科研项目进展\n- 国家自然科学基金项目中期检查\n- 省级教改项目申报准备\n- 校企合作项目推进\n\n### 3. 师资队伍建设\n- 新教师培养计划\n- 骨干教师进修安排\n- 外聘专家讲座计划\n\n### 4. 学生工作\n- 本科生导师制实施\n- 研究生招生宣传\n- 学科竞赛组织\n\n## 决议事项\n1. 成立课程建设小组\n2. 制定实验室管理制度\n3. 启动青年教师培养计划\n\n## 下次会议\n时间：2024年3月15日\n议题：期中教学检查总结',
        category: 'work',
        tags: ['会议纪要', '教研室', '工作安排', '教学管理'],
        starred: false,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20')
      },
      {
        id: generateId(),
        title: '期末考试成绩分析与教学反思',
        content: '# 期末考试成绩分析与教学反思\n\n## 成绩统计\n**课程**：数据结构与算法\n**班级**：计算机2022级1-3班\n**总人数**：156人\n\n### 成绩分布\n- 优秀（90-100分）：23人（14.7%）\n- 良好（80-89分）：45人（28.8%）\n- 中等（70-79分）：52人（33.3%）\n- 及格（60-69分）：28人（17.9%）\n- 不及格（<60分）：8人（5.1%）\n\n## 问题分析\n\n### 主要问题\n1. **算法设计能力不足**\n   - 学生对复杂算法的理解不够深入\n   - 缺乏独立设计算法的能力\n\n2. **编程实现薄弱**\n   - 理论知识与实践脱节\n   - 代码调试能力有待提高\n\n3. **时间复杂度分析困难**\n   - 对算法效率的理解不够\n   - 缺乏量化分析能力\n\n## 改进措施\n1. 增加课堂编程演示\n2. 强化实验课程设计\n3. 引入在线编程平台\n4. 建立学习小组互助机制\n\n## 下学期计划\n- 调整教学内容比例\n- 增加实践环节\n- 完善考核方式',
        category: 'work',
        tags: ['成绩分析', '教学反思', '数据结构', '教学改进'],
        starred: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-28')
      },
      {
        id: generateId(),
        title: '实验室建设与管理规划方案',
        content: '# 实验室建设与管理规划方案\n\n## 建设目标\n建设现代化的计算机实验教学中心，为本科生和研究生提供优质的实验环境。\n\n## 硬件建设\n\n### 基础设施\n- 计算机硬件更新（200台高性能PC）\n- 网络设备升级（千兆交换机）\n- 服务器集群搭建（用于大数据和AI实验）\n- 投影和音响设备完善\n\n### 专业实验室\n1. **软件工程实验室**\n   - 支持大型软件开发项目\n   - 配置版本控制和项目管理工具\n\n2. **人工智能实验室**\n   - GPU服务器用于深度学习\n   - 机器人实验平台\n\n3. **网络安全实验室**\n   - 网络攻防演练环境\n   - 安全测试工具\n\n## 软件环境\n- 开发环境：Visual Studio, IntelliJ IDEA\n- 数据库：MySQL, MongoDB, Redis\n- 大数据平台：Hadoop, Spark\n- AI框架：TensorFlow, PyTorch\n\n## 管理制度\n1. 实验室开放时间管理\n2. 设备维护保养制度\n3. 安全管理规范\n4. 使用预约系统\n\n## 预算估算\n总投资：500万元\n- 硬件设备：350万元\n- 软件许可：100万元\n- 装修改造：50万元',
        category: 'work',
        tags: ['实验室建设', '设备管理', '教学环境', '规划方案'],
        starred: false,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-08')
      }
    ];

    // 个人笔记数据
    this.personalNotes = [
      {
        id: generateId(),
        title: '2024年教师职业发展规划',
        content: '# 2024年教师职业发展规划\n\n## 年度目标\n\n### 教学方面\n- 完成2门核心课程的教学改革\n- 指导本科生完成创新项目2项\n- 学生评教成绩保持在4.5分以上\n\n### 科研方面\n- 发表SCI论文2篇\n- 申请国家自然科学基金项目1项\n- 完成在研项目的中期检查\n\n### 个人提升\n- 参加国际学术会议1次\n- 完成在线课程学习3门\n- 考取相关专业认证\n\n## 具体计划\n\n### 第一季度\n- 完成课程大纲修订\n- 提交基金项目申请书\n- 参加教学培训\n\n### 第二季度\n- 开展教学改革实践\n- 推进科研项目进展\n- 准备学术会议论文\n\n### 第三季度\n- 参加国际会议\n- 完成论文投稿\n- 总结教学改革效果\n\n### 第四季度\n- 年度工作总结\n- 制定下年度计划\n- 完成各项考核\n\n## 预期成果\n通过一年的努力，在教学和科研方面都取得显著进步，为职业发展奠定坚实基础。',
        category: 'personal',
        tags: ['职业规划', '年度目标', '教师发展', '个人提升'],
        starred: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-03')
      },
      {
        id: generateId(),
        title: '《教学勇气》读书笔记',
        content: '# 《教学勇气》读书笔记\n\n**作者**：帕克·帕尔默\n**阅读时间**：2024年1月\n\n## 核心观点\n\n### 教学的本质\n教学不仅仅是传授知识，更是一种心灵的连接。真正的教学需要教师展现真实的自我，与学生建立authentic的关系。\n\n### 教师的内在生活\n- 教师的内在状态直接影响教学质量\n- 需要不断进行自我反思和成长\n- 勇气是教学中最重要的品质\n\n### 学习共同体\n- 创建安全的学习环境\n- 鼓励学生表达真实想法\n- 培养批判性思维\n\n## 个人感悟\n\n### 对教学的重新认识\n这本书让我重新思考了教学的意义。教学不应该是单向的知识传递，而应该是师生共同探索真理的过程。\n\n### 实践启发\n1. **真实性**：在课堂上展现真实的自我\n2. **倾听**：更多地倾听学生的声音\n3. **勇气**：敢于面对教学中的困难和挑战\n4. **反思**：定期反思自己的教学实践\n\n## 行动计划\n- 在课堂上更多地分享个人经历和思考\n- 创建更多的互动和讨论机会\n- 建立学生反馈机制\n- 定期进行教学反思\n\n这本书对我的教学理念产生了深远影响，值得反复阅读和思考。',
        category: 'personal',
        tags: ['读书笔记', '教学理念', '教师成长', '教育哲学'],
        starred: true,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: generateId(),
        title: '家庭生活与工作平衡策略',
        content: '# 家庭生活与工作平衡策略\n\n## 现状分析\n作为一名大学教师，需要在教学、科研、家庭之间找到平衡点。目前面临的主要挑战：\n- 工作时间不规律\n- 科研压力较大\n- 家庭时间不足\n- 个人休息时间缺乏\n\n## 平衡策略\n\n### 时间管理\n1. **工作时间界限**\n   - 设定明确的工作时间\n   - 避免将工作带回家\n   - 周末至少保留一天给家庭\n\n2. **优先级管理**\n   - 区分紧急和重要的事务\n   - 学会说"不"\n   - 合理分配精力\n\n### 家庭关系\n1. **陪伴质量**\n   - 专注的陪伴比时间长度更重要\n   - 参与孩子的学习和成长\n   - 与配偶保持良好沟通\n\n2. **家务分工**\n   - 合理分配家务责任\n   - 培养孩子的自理能力\n   - 适当寻求外部帮助\n\n### 个人发展\n1. **健康管理**\n   - 保持规律的运动习惯\n   - 注意饮食和睡眠\n   - 定期体检\n\n2. **兴趣爱好**\n   - 保留个人兴趣时间\n   - 培养放松的方式\n   - 与朋友保持联系\n\n## 实施计划\n- 制定详细的时间表\n- 与家人沟通并获得支持\n- 定期评估和调整策略\n\n平衡工作和生活是一个持续的过程，需要不断调整和优化。',
        category: 'personal',
        tags: ['工作生活平衡', '时间管理', '家庭关系', '个人发展'],
        starred: false,
        createdAt: new Date('2024-02-12'),
        updatedAt: new Date('2024-02-14')
      }
    ];

    // 想法笔记数据
    this.ideas = [
      {
        id: generateId(),
        title: '基于AI的个性化教学系统设计构想',
        content: '# 基于AI的个性化教学系统设计构想\n\n## 系统概述\n设计一个基于人工智能的个性化教学系统，能够根据学生的学习特点、进度和偏好，提供定制化的学习内容和路径。\n\n## 核心功能\n\n### 学习者画像\n- 学习风格识别（视觉型、听觉型、动手型）\n- 知识基础评估\n- 学习进度跟踪\n- 兴趣偏好分析\n\n### 智能推荐\n- 个性化学习路径规划\n- 适应性学习资源推荐\n- 难度自动调节\n- 学习时间优化建议\n\n### 智能辅导\n- 自动答疑系统\n- 学习困难诊断\n- 个性化练习生成\n- 实时学习反馈\n\n## 技术架构\n\n### 数据层\n- 学习行为数据收集\n- 知识图谱构建\n- 学习资源库管理\n\n### 算法层\n- 机器学习模型训练\n- 自然语言处理\n- 推荐算法优化\n\n### 应用层\n- Web端学习平台\n- 移动端APP\n- 教师管理后台\n\n## 预期效果\n- 提高学习效率30%以上\n- 增强学习兴趣和动机\n- 减少教师重复性工作\n- 实现真正的因材施教\n\n## 实施计划\n1. 需求调研和系统设计\n2. 核心算法开发\n3. 原型系统构建\n4. 小规模试点测试\n5. 系统优化和推广\n\n这个系统有望革命性地改变传统教学模式，实现教育的个性化和智能化。',
        category: 'ideas',
        tags: ['人工智能', '个性化教学', '教育技术', '系统设计'],
        starred: true,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: generateId(),
        title: '翻转课堂教学模式改革构想',
        content: '# 翻转课堂教学模式改革构想\n\n## 改革背景\n传统的"教师讲、学生听"的教学模式已经不能满足现代教育的需求。翻转课堂作为一种新的教学模式，将知识传授和知识内化的过程进行翻转，值得深入探索。\n\n## 翻转课堂模式设计\n\n### 课前阶段\n**学生自主学习**\n- 观看教学视频\n- 阅读相关资料\n- 完成预习测试\n- 提出疑问和思考\n\n**教师准备工作**\n- 制作高质量教学视频\n- 设计预习任务\n- 分析学生预习情况\n- 准备课堂活动\n\n### 课中阶段\n**互动式教学**\n- 答疑解惑\n- 小组讨论\n- 案例分析\n- 实践操作\n- 同伴教学\n\n### 课后阶段\n**巩固提升**\n- 完成进阶练习\n- 参与在线讨论\n- 反思学习过程\n- 准备下次课程\n\n## 实施策略\n\n### 技术支持\n- 建设在线学习平台\n- 制作系列教学视频\n- 开发互动学习工具\n- 建立学习分析系统\n\n### 教师培训\n- 翻转课堂理念培训\n- 视频制作技能培训\n- 课堂活动设计培训\n- 学习分析工具使用\n\n### 学生引导\n- 自主学习能力培养\n- 学习方法指导\n- 协作学习技能训练\n- 学习动机激发\n\n## 评价体系\n\n### 过程性评价\n- 预习完成情况（20%）\n- 课堂参与度（30%）\n- 小组合作表现（20%）\n- 课后反思质量（10%）\n\n### 结果性评价\n- 期中考试（10%）\n- 期末考试（10%）\n\n## 预期成果\n- 提高学生学习主动性\n- 增强课堂互动效果\n- 培养学生批判性思维\n- 提升教学质量和效率\n\n## 风险与对策\n\n### 可能的挑战\n- 学生适应期较长\n- 教师工作量增加\n- 技术设备要求高\n\n### 应对策略\n- 循序渐进推进改革\n- 提供充分的支持和培训\n- 建立激励机制\n\n翻转课堂改革需要系统性的规划和持续的努力，但其带来的教学效果提升是值得期待的。',
        category: 'ideas',
        tags: ['翻转课堂', '教学改革', '教学模式', '教育创新'],
        starred: false,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-03')
      }
    ];
  }

  // 生成所有模拟数据
  generateAllMockData() {
    try {
      console.log('开始生成模拟数据...');
      
      // 清空现有数据
      this.clearAllData();
      
      // 生成笔记数据
      this.generateNotes();
      
      // 生成数据记录
      this.generateDataRecords();
      
      console.log('模拟数据生成完成！');
      return {
        success: true,
        message: '模拟数据生成成功',
        stats: this.getDataStats()
      };
    } catch (error) {
      console.error('生成模拟数据失败:', error);
      return {
        success: false,
        message: '模拟数据生成失败: ' + error.message
      };
    }
  }

  // 清空所有数据
  clearAllData() {
    try {
      notesService.clearAllData();
      dataRecordService.clearAllData();
      console.log('数据清空完成');
    } catch (error) {
      console.error('清空数据失败:', error);
      throw error;
    }
  }

  // 生成笔记数据
  generateNotes() {
    const allNotes = [
      ...this.studyNotes,
      ...this.workNotes,
      ...this.personalNotes,
      ...this.ideas
    ];

    for (const note of allNotes) {
      notesService.createNote(note);
    }
    
    console.log(`生成了 ${allNotes.length} 条笔记`);
  }

  // 生成数据记录
  generateDataRecords() {
    // 生成搜索行为数据
    const searchBehaviors = this.generateSearchBehaviors();
    for (const record of searchBehaviors) {
      dataRecordService.recordSearch(record.data.query, []);
    }

    // 生成其他类型的数据记录
    const otherRecords = this.generateOtherRecords();
    for (const record of otherRecords) {
      dataRecordService.recordUserBehavior(record.type, record.data);
    }

    console.log(`生成了 ${searchBehaviors.length + otherRecords.length} 条数据记录`);
  }

  // 生成搜索行为数据
  generateSearchBehaviors() {
    const searchTerms = [
      '教学方法', '课程设计', '学生评价', '教学反思', '在线教育',
      '人工智能', '机器学习', '数据结构', '算法设计', '软件工程',
      '教育技术', '翻转课堂', '个性化学习', '学习分析', '教学创新'
    ];

    const behaviors = [];
    for (let i = 0; i < 50; i++) {
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      behaviors.push({
        id: generateId(),
        type: 'search',
        data: {
          query: randomTerm,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          results: Math.floor(Math.random() * 20) + 1
        }
      });
    }
    return behaviors;
  }

  // 生成其他数据记录
  generateOtherRecords() {
    const records = [];
    
    // 生成笔记创建记录
    for (let i = 0; i < 30; i++) {
      records.push({
        id: generateId(),
        type: 'note_created',
        data: {
          category: ['study', 'work', 'personal', 'ideas'][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        }
      });
    }

    return records;
  }

  // 获取数据统计
  getDataStats() {
    return {
      studyNotes: this.studyNotes.length,
      workNotes: this.workNotes.length,
      personalNotes: this.personalNotes.length,
      ideas: this.ideas.length,
      total: this.studyNotes.length + this.workNotes.length + this.personalNotes.length + this.ideas.length
    };
  }
}

const mockDataGenerator = new MockDataGenerator();
export default mockDataGenerator;