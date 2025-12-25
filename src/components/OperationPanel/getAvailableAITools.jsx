import React from 'react';

// 将工具菜单项的渲染提取为独立函数，便于复用与维护
const renderToolMenuItem = (tool) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      background: tool.menuConfig.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: tool.menuConfig.color
    }}>
      {tool.menuConfig.icon}
    </div>
    <div>
      <span style={{ fontWeight: 500 }}>{tool.menuConfig.title}</span>
      <div style={{ fontSize: '11px', color: '#999', lineHeight: '1.2' }}>
        {tool.description.substring(0, 20)}...
      </div>
    </div>
  </div>
);

export const createGetAvailableAITools = ({
  noteCategory,
  visibleCards,
  setAiToolsVersion,
  handleAddAITool,
  aiToolsVersion
}) => {
  return (searchTerm = '') => {
    // 为了在 aiToolsVersion 变化时重新计算（不直接使用该值）
    void aiToolsVersion;
    // 安全解析 localStorage
    const safeParse = (key, fallback) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[OperationPanel] 解析 ${key} 失败，使用回退`, e);
        return fallback;
      }
    };
    const aiToolsConfig = safeParse('ai-tools-config', {});
    const addedAITools = safeParse('added-ai-tools-to-panel', []);
    const aiToolsFromStorage = safeParse('ai_tools', []);

    // 将 ai_tools 结构映射为 OperationPanel 需要的结构
    // SmartNotes.initializeDefaultAITools 中的字段：id, name, description, icon, category, enabled
    // 未给出适用分类时，视为通用（所有 noteCategory 均可见）
    let aiTools = [
      ...(Array.isArray(aiToolsFromStorage) ? aiToolsFromStorage : []).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        icon: t.icon || '🧠',
        applicableNoteCategories: Array.isArray(t.applicableNoteCategories)
          ? t.applicableNoteCategories
          : undefined,
        menuConfig: {
          key: t.id,
          title: t.name,
          icon: t.icon || '🧠',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      }))
    ];
    // 硬编码工具回退清单（当 localStorage 不完整时使用）
    const hardcodedAITools = [
      // 我的评阅分类专用：智能评阅
      {
        id: 'smart-evaluation',
        name: '智能评阅',
        description: '在“我的评阅”中进行智能评分与评语生成',
        icon: '评',
        color: '#c41d7f',
        applicableNoteCategories: ['my_evaluation'],
        menuConfig: {
          key: 'smart-evaluation',
          title: '智能评阅',
          icon: '评',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        }
      },
      {
        id: 'workshop-plan',
        name: '工作坊方案',
        description: '围绕主题工作坊生成个性化方案与活动安排',
        icon: '坊',
        color: '#1890ff',
        applicableNoteCategories: ['theme_workshop'],
        menuConfig: {
          key: 'workshop-plan',
          title: '工作坊方案',
          icon: '坊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'workshop-dashboard',
        name: '工作坊报表',
        description: '汇总工作坊数据，生成可视化统计与管理报表',
        icon: '表',
        color: '#0369a1',
        applicableNoteCategories: ['theme_workshop'],
        menuConfig: {
          key: 'workshop-dashboard',
          title: '工作坊报表',
          icon: '表',
          gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          color: '#0369a1'
        }
      },
      {
        id: 'workshop-report',
        name: '工作坊报告',
        description: '整理工作坊成果与过程，生成结构化总结报告',
        icon: '报',
        color: '#722ed1',
        applicableNoteCategories: ['theme_workshop'],
        menuConfig: {
          key: 'workshop-report',
          title: '工作坊报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'topic-paper-guidance',
        name: '课题论文指导',
        description: '论文选题、结构、方法与写作建议',
        icon: '文',
        color: '#1677ff',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'topic-paper-guidance',
          title: '课题论文指导',
          icon: '文',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1677ff'
        }
      },
      {
        id: 'teaching-achievement-application',
        name: '教学成果申报书',
        description: '教学成果奖申报书模板与智能生成',
        icon: '申',
        color: '#f5222d',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-application',
          title: '教学成果申报书',
          icon: '申',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'teaching-achievement-report',
        name: '教学成果报告',
        description: '生成教学成果总结与展示报告',
        icon: '报',
        color: '#2f54eb',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-report',
          title: '教学成果报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      },
      {
        id: 'teaching-achievement-materials',
        name: '教学成果支撑材料',
        description: '梳理并生成教学成果支撑材料清单与内容',
        icon: '材',
        color: '#389e0d',
        applicableNoteCategories: ['educational_topics'],
        menuConfig: {
          key: 'teaching-achievement-materials',
          title: '教学成果支撑材料',
          icon: '材',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#389e0d'
        }
      },
      // 教学设计分类适用工具
      {
        id: 'teaching-assistant',
        name: '教学智能助手',
        description: '支持课程设计、题目生成、学情分析的教学助手',
        icon: '🎓',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'teaching-assistant',
          title: '教学助手',
          icon: '🎓',
          gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'large-unit-design',
        name: '大单元设计',
        description: '支持基于核心素养的大单元教学设计与目标任务分解',
        icon: '单',
        color: '#0958d9',
        applicableNoteCategories: ['teaching_research_office', 'teaching_design'],
        menuConfig: {
          key: 'large-unit-design',
          title: '大单元设计',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      {
        id: 'interdisciplinary-design',
        name: '跨学科设计',
        description: '围绕真实情境与综合任务进行跨学科项目化学习设计',
        icon: '跨',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_research_office', 'teaching_design'],
        menuConfig: {
          key: 'interdisciplinary-design',
          title: '跨学科设计',
          icon: '跨',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'unit-assignment-design',
        name: '单元作业设计',
        description: '依据学习目标与内容设计分层作业与任务单',
        icon: '作',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_research_office', 'homework_system', 'teaching_design'],
        menuConfig: {
          key: 'unit-assignment-design',
          title: '单元作业设计',
          icon: '作',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'large-unit-academic-case',
        name: '大单元学历案',
        description: '生成结构化的学历案，包括环节目标、活动任务与评价要点',
        icon: '案',
        color: '#722ed1',
        applicableNoteCategories: ['teaching_research_office'],
        menuConfig: {
          key: 'large-unit-academic-case',
          title: '大单元学历案',
          icon: '案',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'teacher-research-project',
        name: '教师课题研究',
        description: '提供课题选题、研究设计、数据分析与报告撰写辅助',
        icon: '研',
        color: '#f5222d',
        applicableNoteCategories: ['teaching_research_office'],
        menuConfig: {
          key: 'teacher-research-project',
          title: '教师课题研究',
          icon: '研',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      // 教学设计分类新增（如图）
      {
        id: 'open-class-design',
        name: '公开课设计',
        description: '生成公开课流程、教案与课件要点，支持评课要素',
        icon: '公',
        color: '#1890ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'open-class-design',
          title: '公开课设计',
          icon: '公',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'guided-learning-plan',
        name: '导学案',
        description: '按照学习目标与任务链生成导学案，支持分层与自评',
        icon: '导',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'guided-learning-plan',
          title: '导学案',
          icon: '导',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'lesson-presentation',
        name: '说课稿',
        description: '生成说课稿结构与关键阐述，支持教学目标与方法说明',
        icon: '说',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'lesson-presentation',
          title: '说课稿',
          icon: '说',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'evaluation-rubric',
        name: '评价量规',
        description: '根据目标维度生成可量化评价量规，支持等级描述与示例',
        icon: '评',
        color: '#531dab',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'evaluation-rubric',
          title: '评价量规',
          icon: '评',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'unit-academic-case',
        name: '单元学历案',
        description: '面向单元的学历案结构生成，包含环节目标与任务设计',
        icon: '单',
        color: '#0958d9',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'unit-academic-case',
          title: '单元学历案',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      {
        id: 'ai-picture-book',
        name: 'AI绘本',
        description: '基于文本与图片提示生成教学绘本，支持分镜与旁白',
        icon: '📖',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ai-picture-book',
          title: 'AI绘本',
          icon: '📖',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'cloud-word-cards',
        name: '云朵字卡',
        description: '快速生成云朵风格字卡，支持词语例句与练习任务',
        icon: '☁️',
        color: '#40a9ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'cloud-word-cards',
          title: '云朵字卡',
          icon: '☁️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        }
      },
      {
        id: 'sticker-materials',
        name: '贴纸素材',
        description: '生成课堂贴纸与图标素材，用于教具或白板',
        icon: '🎯',
        color: '#722ed1',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'sticker-materials',
          title: '贴纸素材',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'digital-human-speech',
        name: '数字人说话',
        description: '将文本转为数字人朗读视频，支持角色与语速选择',
        icon: '🧑‍🎤',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'digital-human-speech',
          title: '数字人说话',
          icon: '🧑‍🎤',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'comic-strip',
        name: '连环画',
        description: '生成教学连环画分镜与画面，支持台词与镜头',
        icon: '🎞️',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'comic-strip',
          title: '连环画',
          icon: '🎞️',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'quick-designer',
        name: '快速设计师',
        description: '快速生成教学活动与素材方案，适合备课速成',
        icon: '速',
        color: '#1890ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'quick-designer',
          title: '快速设计师',
          icon: '速',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'children-simple-drawings',
        name: '儿童简笔画',
        description: '生成儿童风格简笔画教程图片与步骤说明',
        icon: '🖍️',
        color: '#40a9ff',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'children-simple-drawings',
          title: '儿童简笔画',
          icon: '🖍️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        }
      },
      {
        id: 'ai-video',
        name: 'AI视频',
        description: '根据脚本与素材生成课堂视频，支持字幕与配音',
        icon: '🎬',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ai-video',
          title: 'AI视频',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'ppt-courseware',
        name: 'PPT课件',
        description: '根据课程结构自动生成PPT课件大纲与页面',
        icon: '📊',
        color: '#fa8c16',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'ppt-courseware',
          title: 'PPT课件',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'audio-video-text-converter',
        name: '音视频文本互转',
        description: '支持音视频转文本与文本生成语音，适配课堂素材',
        icon: '🔄',
        color: '#13c2c2',
        applicableNoteCategories: ['teaching_design', 'classroom_integration'],
        menuConfig: {
          key: 'audio-video-text-converter',
          title: '音视频文本互转',
          icon: '🔄',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'training-report',
        name: '培训报告',
        description: '生成培训效果评估报告，包含数据分析和改进建议',
        icon: '报',
        color: '#722ed1',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'training-report',
          title: '培训报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'training-dashboard',
        name: '培训报表',
        description: '多维度培训数据可视化分析，提供全面的培训管理报表',
        icon: '报',
        color: '#0369a1',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'training-dashboard',
          title: '培训报表',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          color: '#0369a1'
        }
      },
      {
        id: 'interview-outline',
        name: '访谈提纲',
        description: '生成结构化访谈问题清单，支持角色与主题定制',
        icon: '访',
        color: '#13c2c2',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'interview-outline',
          title: '访谈提纲',
          icon: '访',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'needs-research-report',
        name: '需求调研报告',
        description: '整合访谈与问卷数据，生成需求调研报告',
        icon: '调',
        color: '#fa8c16',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'needs-research-report',
          title: '需求调研报告',
          icon: '调',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'diagnosis-report',
        name: '诊断报告',
        description: '基于调研结果输出问题诊断与改进建议',
        icon: '诊',
        color: '#c41d7f',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'diagnosis-report',
          title: '诊断报告',
          icon: '诊',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        }
      },
      {
        id: 'questionnaire-design',
        name: '调查问卷设计',
        description: '根据调研主题生成问卷结构、题型与量表设计',
        icon: '问',
        color: '#2f54eb',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'questionnaire-design',
          title: '调查问卷设计',
          icon: '问',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      },
      {
        id: 'diagnostic-assessment-plan',
        name: '诊断（测评）方案',
        description: '围绕测评目标设计指标、工具与实施方案',
        icon: '测',
        color: '#52c41a',
        applicableNoteCategories: ['training_needs_management'],
        menuConfig: {
          key: 'diagnostic-assessment-plan',
          title: '诊断（测评）方案',
          icon: '测',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        }
      },
      // 通用AI工具
      {
        id: 'homework-center',
        name: '作业中心',
        description: '统一管理作业设计、布置、批改与分析的中心工具',
        icon: '📘',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'homework-center',
          title: '作业中心',
          icon: '📘',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 班主任
      {
        id: 'classmaster-performance-dashboard',
        name: '成绩数据看板',
        description: '接入成绩数据，大屏看板，聚焦班级成绩概览与趋势',
        icon: '📈',
        color: '#52c41a',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-performance-dashboard',
          title: '成绩数据看板',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'classmaster-passline-analysis',
        name: '高中新上线分析',
        description: '分析高一至高三上线情况，输出分层比例与提升建议',
        icon: '🎯',
        color: '#13c2c2',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-passline-analysis',
          title: '高中新上线分析',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'classmaster-student-honesty-analysis',
        name: '学生诚卷分析',
        description: '针对学生作弊风险与诚卷情况进行综合分析与识别',
        icon: '🧭',
        color: '#9254de',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-student-honesty-analysis',
          title: '学生诚卷分析',
          icon: '🧭',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#9254de'
        }
      },
      {
        id: 'classmaster-class-exam-analysis',
        name: '班级考试分析',
        description: '分析单次或一段时期内班级考试的成绩结构与波动',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'classmaster-class-exam-analysis',
          title: '班级考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 学科老师
      {
        id: 'subject-unit-small-tests',
        name: '单元小测分析',
        description: '基于小测数据分析掌握度、失分点与教学改进建议',
        icon: '🧪',
        color: '#fa8c16',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-unit-small-tests',
          title: '单元小测分析',
          icon: '🧪',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'subject-exam-paper-analysis',
        name: '试卷学科分析',
        description: '对试卷进行学科维度拆解，输出题型、知识点与难度分布',
        icon: '📄',
        color: '#722ed1',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-exam-paper-analysis',
          title: '试卷学科分析',
          icon: '📄',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'subject-student-performance-analysis',
        name: '学科薄弱生分析',
        description: '识别学科薄弱学生，定位薄弱点并生成个性化提升建议',
        icon: '📉',
        color: '#f5222d',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-student-performance-analysis',
          title: '学科薄弱生分析',
          icon: '📉',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'subject-historical-exam-analysis',
        name: '学科历次考试分析',
        description: '分析同一学科历次考试的成绩变化与影响因素',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'subject-historical-exam-analysis',
          title: '学科历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 年级组
      {
        id: 'grade-multi-class-exam-analysis',
        name: '年级多班考试分析',
        description: '对多个班级进行成绩对比，识别教学差异与改进方向',
        icon: '🏫',
        color: '#2f54eb',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-multi-class-exam-analysis',
          title: '年级多班考试分析',
          icon: '🏫',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        }
      },
      {
        id: 'grade-passline-analysis',
        name: '年级及科目过线分析',
        description: '统计年级整体及各学科过线率，定位提升空间',
        icon: '📈',
        color: '#52c41a',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-passline-analysis',
          title: '年级及科目过线分析',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'grade-historical-exam-analysis',
        name: '年级历次考试分析',
        description: '面向年级维度分析历次考试的综合表现与变化',
        icon: '📊',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'grade-historical-exam-analysis',
          title: '年级历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      // 学情分析 · 联考分析（不同版本）
      {
        id: 'league-exam-performance-analysis',
        name: '联考成绩分析',
        description: '支持多校联考数据分析，生成关键指标与对比洞察',
        icon: '🏆',
        color: '#1890ff',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-analysis',
          title: '联考成绩分析',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'league-exam-performance-plus',
        name: '联考成绩分析Plus',
        description: '支持样本数≥万人级别的深度联考分析版本',
        icon: '🏆',
        color: '#13c2c2',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-plus',
          title: '联考成绩分析Plus',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'league-exam-performance-pro',
        name: '联考成绩分析Pro',
        description: '针对样本数≥五万人的大型联考数据的专业版',
        icon: '🏆',
        color: '#722ed1',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-pro',
          title: '联考成绩分析Pro',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'league-exam-performance-ultra',
        name: '联考成绩分析Ultra',
        description: '面向样本数≥十万人级别联考数据的旗舰版',
        icon: '🏆',
        color: '#fa8c16',
        applicableNoteCategories: ['learning_analytics'],
        menuConfig: {
          key: 'league-exam-performance-ultra',
          title: '联考成绩分析Ultra',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'grading-assistant',
        name: '智能阅卷助手',
        description: '专业的智能阅卷工具，支持试卷自动评阅、成绩分析、评语生成等功能',
        icon: '阅',
        color: '#c41d7f',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'grading-assistant',
          title: '阅卷助手',
          icon: '阅',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        }
      },
      // 作业系统 · 出题与批改扩展
      {
        id: 'knowledge-point-question-generator',
        name: '知识点出题',
        description: '基于指定知识点自动生成题目并按难度分层',
        icon: '知',
        color: '#722ed1',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'knowledge-point-question-generator',
          title: '知识点出题',
          icon: '知',
          gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'chapter-question-generator',
        name: '章节出题',
        description: '围绕指定章节内容生成配套练习与测评题',
        icon: '章',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'chapter-question-generator',
          title: '章节出题',
          icon: '章',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'unit-question-generator',
        name: '单元出题',
        description: '依据单元目标生成覆盖全面的练习题与试卷',
        icon: '单',
        color: '#fa8c16',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'unit-question-generator',
          title: '单元出题',
          icon: '单',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'question-set-generator',
        name: '题组出题',
        description: '按题组结构与能力层次生成梯度训练题',
        icon: '组',
        color: '#eb2f96',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'question-set-generator',
          title: '题组出题',
          icon: '组',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#eb2f96'
        }
      },
      {
        id: 'logic-question-generator',
        name: '逻辑出题',
        description: '生成强调推理与逻辑思维的题目集合',
        icon: '逻',
        color: '#52c41a',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'logic-question-generator',
          title: '逻辑出题',
          icon: '逻',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'multiple-choice-generator',
        name: '选择题出题',
        description: '批量生成高质量选择题并附解析',
        icon: '选',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'multiple-choice-generator',
          title: '选择题出题',
          icon: '选',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'image-question-generator',
        name: '图像题出题',
        description: '基于图片与图形信息自动生成题目',
        icon: '图',
        color: '#531dab',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'image-question-generator',
          title: '图像题出题',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'smart-question-bank-manager',
        name: '智能题库管理',
        description: '管理与检索题库，支持难度评估与标签',
        icon: '库',
        color: '#0958d9',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'smart-question-bank-manager',
          title: '智能题库管理',
          icon: '库',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      },
      // 作文批改与默写改错
      {
        id: 'primary-chinese-essay-grader',
        name: '小学语文作文批改',
        description: '针对小学语文作文的智能批改与评语生成',
        icon: '语',
        color: '#fa541c',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'primary-chinese-essay-grader',
          title: '小学语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        }
      },
      {
        id: 'primary-english-essay-grader',
        name: '小学英文作文批改',
        description: '针对小学英文作文的智能批改与评语生成',
        icon: '英',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'primary-english-essay-grader',
          title: '小学英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'junior-chinese-essay-grader',
        name: '初中语文作文批改',
        description: '针对初中语文作文的智能批改与评语生成',
        icon: '语',
        color: '#faad14',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'junior-chinese-essay-grader',
          title: '初中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
          color: '#faad14'
        }
      },
      {
        id: 'junior-english-essay-grader',
        name: '初中英文作文批改',
        description: '针对初中英文作文的智能批改与评语生成',
        icon: '英',
        color: '#1890ff',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'junior-english-essay-grader',
          title: '初中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'senior-chinese-essay-grader',
        name: '高中语文作文批改',
        description: '针对高中语文作文的智能批改与评语生成',
        icon: '语',
        color: '#722ed1',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'senior-chinese-essay-grader',
          title: '高中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'senior-english-essay-grader',
        name: '高中英文作文批改',
        description: '针对高中英文作文的智能批改与评语生成',
        icon: '英',
        color: '#52c41a',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'senior-english-essay-grader',
          title: '高中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        }
      },
      {
        id: 'chinese-dictation-correction',
        name: '语文默写改错',
        description: '识别默写错误并给出针对性纠错与巩固练习',
        icon: '默',
        color: '#fa541c',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'chinese-dictation-correction',
          title: '语文默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        }
      },
      {
        id: 'english-dictation-correction',
        name: '英语默写改错',
        description: '识别英文拼写与语法错误并生成纠错练习',
        icon: '默',
        color: '#13c2c2',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'english-dictation-correction',
          title: '英语默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      // 作业设计扩展
      {
        id: 'custom-unit-homework-design',
        name: '自定义单元作业',
        description: '按教学目标自由组合生成个性化单元作业包',
        icon: '自',
        color: '#1d4ed8',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'custom-unit-homework-design',
          title: '自定义单元作业',
          icon: '自',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #d6e4ff 100%)',
          color: '#1d4ed8'
        }
      },
      {
        id: 'recompose-unit-assignment-design',
        name: '重组单元作业设计',
        description: '基于既有作业与题库快速重组形成新作业包',
        icon: '重',
        color: '#fa8c16',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'recompose-unit-assignment-design',
          title: '重组单元作业设计',
          icon: '重',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      },
      {
        id: 'graphic-homework-design',
        name: '图形设计',
        description: '用于作业版式与图形元素的设计与生成',
        icon: '图',
        color: '#531dab',
        applicableNoteCategories: ['homework_system'],
        menuConfig: {
          key: 'graphic-homework-design',
          title: '图形设计',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        }
      },
      {
        id: 'data-analyst',
        name: '数据分析大师',
        description: '强大的数据分析和可视化工具，支持多种图表生成和统计分析',
        icon: '📊',
        color: '#722ed1',
        menuConfig: {
          key: 'data-analyst',
          title: '数据分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)',
          color: '#722ed1'
        }
      },
      {
        id: 'efficiency-master',
        name: '效率提升大师',
        description: '全能的效率工具集，包含时间管理、任务规划、自动化处理等功能',
        icon: '⚡',
        color: '#13c2c2',
        menuConfig: {
          key: 'efficiency-master',
          title: '效率大师',
          icon: '⚡',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        }
      },
      {
        id: 'classroom-evaluation',
        name: '课堂评价',
        description: '基于用户提交的评价要求，生成评价量表，基于该量表以评价老师在课堂上的表现',
        icon: '📊',
        color: '#1890ff',
        menuConfig: {
          key: 'classroom-evaluation',
          title: '课堂评价',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        }
      },
      {
        id: 'research-helper',
        name: '学术研究助手',
        description: '专业的学术研究工具，支持文献检索、论文分析、引用管理',
        icon: '🔬',
        color: '#f5222d',
        menuConfig: {
          key: 'research-helper',
          title: '研究助手',
          icon: '🔬',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      },
      {
        id: 'video-slice',
        name: '视频切片',
        description: '智能视频切片工具，支持视频片段提取、剪辑、标注等功能',
        icon: '切',
        color: '#fa8c16',
        menuConfig: {
          key: 'video-slice',
          title: '视频切片',
          icon: '切',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      }
    ];

    // 合并回退清单（localStorage 工具不足时）
    if (!Array.isArray(aiToolsFromStorage) || aiToolsFromStorage.length < 10) {
      aiTools = [...aiTools, ...hardcodedAITools];
    }

    // 特殊处理：督学分类保留“督学任务”“现场分析”“督学报告”三项工具
    if (noteCategory === 'supervision') {
      availableTools = availableTools.filter(tool => ['supervision-task', 'site-analysis', 'supervision-report'].includes(tool.id));
      if (availableTools.length === 0) {
        availableTools = [
          {
            id: 'supervision-task',
            name: '督学任务',
            description: '用于督学任务创建、分配、督办与追踪',
            icon: '督',
            applicableNoteCategories: ['supervision'],
            menuConfig: {
              key: 'supervision-task',
              title: '督学任务',
              icon: '督',
              gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              color: '#1677ff'
            }
          },
          {
            id: 'site-analysis',
            name: '现场分析',
            description: '现场取证数据自动梳理要点与整改建议',
            icon: '现',
            applicableNoteCategories: ['supervision'],
            menuConfig: {
              key: 'site-analysis',
              title: '现场分析',
              icon: '现',
              gradient: 'linear-gradient(135deg, #e8f5fe 0%, #c7e9ff 100%)',
              color: '#1d4ed8'
            }
          },
          {
            id: 'supervision-report',
            name: '督学报告',
            description: '汇总现场分析与执行进展，生成督学报告',
            icon: '报',
            applicableNoteCategories: ['supervision'],
            menuConfig: {
              key: 'supervision-report',
              title: '督学报告',
              icon: '报',
              gradient: 'linear-gradient(135deg, #f5f7ff 0%, #e6ebff 100%)',
              color: '#2f54eb'
            }
          }
        ];
      }
    }
    // 去重
    const seenIds = new Set();
    aiTools = aiTools.filter(t => {
      if (!t || !t.id) return false;
      if (seenIds.has(t.id)) return false;
      seenIds.add(t.id);
      return true;
    });

    // 应用 AI工具屋 的配置覆盖（如有）
    const configuredTools = aiTools.map(tool => {
      const cfg = aiToolsConfig?.[tool.id];
      if (cfg && typeof cfg === 'object') {
        return {
          ...tool,
          menuConfig: {
            ...tool.menuConfig,
            ...cfg
          }
        };
      }
      return tool;
    });

    // 过滤：已添加去重 + 分类过滤（未声明适用分类视为通用）
    let availableTools = configuredTools.filter(tool => !addedAITools.includes(tool.id));

    const knownCategories = new Set([
      'training_needs_management',
      'training_product_research',
      'teaching_research_office',
      'teaching_design',
      'classroom_integration',
      'homework_system',
      'learning_analytics',
      'educational_topics',
      'supervision',
      'theme_workshop'
    ]);
    if (noteCategory && knownCategories.has(noteCategory)) {
      availableTools = availableTools.filter(tool => {
        // 未声明适用分类的工具保留
        if (!tool.applicableNoteCategories || tool.applicableNoteCategories.length === 0) return true;
        return tool.applicableNoteCategories.includes(noteCategory);
      });
    }

    // 特殊处理：我的评阅分类仅保留“智能评阅”工具
    if (noteCategory === 'my_evaluation') {
      availableTools = availableTools.filter(tool => tool.id === 'smart-evaluation');
      // 如果本地没有该工具，提供兜底的内置项
      if (availableTools.length === 0) {
        availableTools = [{
          id: 'smart-evaluation',
          name: '智能评阅',
          description: '在“我的评阅”中进行智能评分与评语生成',
          icon: '评',
          applicableNoteCategories: ['my_evaluation'],
          menuConfig: {
            key: 'smart-evaluation',
            title: '智能评阅',
            icon: '评',
            gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
            color: '#c41d7f'
          }
        }];
      }
    }
    // 特殊处理：主题工作坊分类保留“工作坊方案 / 工作坊报表 / 工作坊报告”三项
    if (noteCategory === 'theme_workshop') {
      const workshopIds = new Set(['workshop-plan', 'workshop-dashboard', 'workshop-report']);
      availableTools = availableTools.filter(tool => workshopIds.has(tool.id));
      if (availableTools.length === 0) {
        availableTools = [
          {
            id: 'workshop-plan',
            name: '工作坊方案',
            description: '围绕主题工作坊生成个性化方案与活动安排',
            icon: '坊',
            applicableNoteCategories: ['theme_workshop'],
            menuConfig: {
              key: 'workshop-plan',
              title: '工作坊方案',
              icon: '坊',
              gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              color: '#1890ff'
            }
          },
          {
            id: 'workshop-dashboard',
            name: '工作坊报表',
            description: '汇总工作坊数据，生成可视化统计与管理报表',
            icon: '表',
            applicableNoteCategories: ['theme_workshop'],
            menuConfig: {
              key: 'workshop-dashboard',
              title: '工作坊报表',
              icon: '表',
              gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              color: '#0369a1'
            }
          },
          {
            id: 'workshop-report',
            name: '工作坊报告',
            description: '整理工作坊成果与过程，生成结构化总结报告',
            icon: '报',
            applicableNoteCategories: ['theme_workshop'],
            menuConfig: {
              key: 'workshop-report',
              title: '工作坊报告',
              icon: '报',
              gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
              color: '#722ed1'
            }
          }
        ];
      }
    }

    // 过滤掉已在面板可见的工具，避免重复添加
    availableTools = availableTools.filter(tool => {
      const key = tool.menuConfig?.key;
      return key ? !visibleCards.some(card => card.key === key) : true;
    });

    // 搜索过滤（名称/标题/描述/标签）
    if (searchTerm && typeof searchTerm === 'string') {
      const term = searchTerm.toLowerCase();
      availableTools = availableTools.filter(tool => {
        const name = (tool.name || '').toLowerCase();
        const title = (tool.menuConfig?.title || '').toLowerCase();
        const desc = (tool.description || '').toLowerCase();
        const tags = Array.isArray(tool.tags) ? tool.tags.map(t => (t || '').toLowerCase()) : [];
        return (
          name.includes(term) ||
          title.includes(term) ||
          desc.includes(term) ||
          tags.some(t => t.includes(term))
        );
      });
    }
    
    console.log('=== getAvailableAITools 调试信息 ===');
    console.log('当前 noteCategory:', noteCategory);
    console.log('所有 AI 工具数量:', aiTools.length);
    console.log('过滤后可用工具数量:', availableTools.length);
    console.log('可用工具列表:', availableTools.map(t => ({ id: t.id, name: t.name, categories: t.applicableNoteCategories })));
    console.log('================================');

    // 无可用工具时的兜底项
    if (availableTools.length === 0) {
      return [
        {
          key: 'no-ai-tools',
          disabled: true,
          label: (
            <div style={{ padding: '6px 8px', color: '#999' }}>
              未找到匹配的AI工具（可调整检索或切换分类）
            </div>
          )
        },
        {
          key: 'refresh-ai-tools',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 14 }}>🔄</span>
              <span>刷新</span>
            </div>
          ),
          onClick: () => setAiToolsVersion(v => v + 1)
        }
      ];
    }
    
    return availableTools.map(tool => ({
      key: tool.menuConfig.key,
      label: renderToolMenuItem(tool),
      onClick: () => handleAddAITool(tool)
    }));
  };
};
