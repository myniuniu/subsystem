/**
 * 新老师技能培训数据生成器
 * 为新入职教师生成各类技能培训需求数据
 */

import {
  EDUCATION_LEVELS,
  ROLES,
  TRAINING_TYPES,
  TRAINING_SOURCES,
  PRIORITY_LEVELS,
  TRAINING_STATUS
} from './trainingDataTemplates.js';

// 生成随机ID
const generateId = () => {
  return 'need_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 生成随机日期
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 新老师培训需求模板 - 每个培训类型一条记录
const NEW_TEACHER_TRAINING_TEMPLATES = [
  {
    id: generateId(),
    title: '新教师教学方法与课堂管理技能培训',
    type: TRAINING_TYPES.TEACHING_METHODS,
    content: '针对新入职教师开展的教学方法培训，包括课堂教学设计、互动技巧、学生参与度提升等核心技能。帮助新教师快速掌握有效的教学策略，提升课堂教学质量和学生学习效果。培训将结合理论讲解和实践演练，让新教师在真实的教学场景中练习和改进教学方法。',
    category: 'teaching_methods',
    source: TRAINING_SOURCES.INTERNAL,
    priority: true,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    status: TRAINING_STATUS.PLANNED,
    duration: '40学时',
    tags: ['新教师', '教学方法', '课堂管理', '教学技能', '入职培训'],
    targetAudience: '新入职教师',
    method: '线下培训',
    budget: '10000-20000元',
    venue: '校内培训中心',
    trainer: '教学名师',
    applicant: {
      name: '张教学',
      role: '教务处主任',
      department: '教务处',
      educationLevel: EDUCATION_LEVELS.HIGHER_ED
    }
  },
  {
    id: generateId(),
    title: '新教师学生管理与班级建设能力培训',
    type: TRAINING_TYPES.STUDENT_MANAGEMENT,
    content: '为新教师提供学生管理和班级建设的专业培训，涵盖班级文化建设、学生行为管理、家校沟通技巧等内容。帮助新教师建立有效的班级管理体系，营造良好的学习氛围，促进学生全面发展。培训注重实用性和操作性，通过案例分析和情景模拟提升管理能力。',
    category: 'student_management',
    source: TRAINING_SOURCES.EXTERNAL,
    priority: true,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    status: TRAINING_STATUS.APPROVED,
    duration: '35学时',
    tags: ['新教师', '学生管理', '班级建设', '沟通技巧', '德育工作'],
    targetAudience: '新任班主任',
    method: '混合式培训',
    budget: '15000-25000元',
    venue: '教育培训基地',
    trainer: '德育专家',
    applicant: {
      name: '李德育',
      role: '学生处主任',
      department: '学生处',
      educationLevel: EDUCATION_LEVELS.VOCATIONAL
    }
  },
  {
    id: generateId(),
    title: '新教师教育技术与信息化教学能力培训',
    type: TRAINING_TYPES.EDUCATIONAL_TECH,
    content: '面向新教师的教育技术培训，重点培养数字化教学工具使用能力、在线教学平台操作技能、多媒体课件制作等信息化教学技能。帮助新教师适应现代教育技术发展趋势，提升信息化教学水平，增强课堂教学的互动性和吸引力。',
    category: 'educational_tech',
    source: TRAINING_SOURCES.ONLINE,
    priority: false,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    status: TRAINING_STATUS.IN_PROGRESS,
    duration: '30学时',
    tags: ['新教师', '教育技术', '信息化教学', '数字工具', '在线教学'],
    targetAudience: '全体新教师',
    method: '线上培训',
    budget: '5000-10000元',
    venue: '在线平台',
    trainer: '技术专家',
    applicant: {
      name: '王技术',
      role: '信息中心主任',
      department: '信息技术中心',
      educationLevel: EDUCATION_LEVELS.BASIC_ED
    }
  },
  {
    id: generateId(),
    title: '新教师专业素养与职业发展规划培训',
    type: TRAINING_TYPES.PROFESSIONAL_DEV,
    content: '针对新教师的专业发展培训，包括师德师风建设、教师职业道德、专业成长路径规划、教学反思方法等内容。帮助新教师树立正确的教育理念，明确职业发展方向，建立持续学习和自我提升的意识，为长期的教育生涯奠定坚实基础。',
    category: 'professional_dev',
    source: TRAINING_SOURCES.WORKSHOP,
    priority: true,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    status: TRAINING_STATUS.PLANNED,
    duration: '45学时',
    tags: ['新教师', '专业素养', '职业发展', '师德师风', '成长规划'],
    targetAudience: '新入职教师',
    method: '工作坊',
    budget: '20000-30000元',
    venue: '教师发展中心',
    trainer: '教育专家',
    applicant: {
      name: '陈发展',
      role: '人事处主任',
      department: '人事处',
      educationLevel: EDUCATION_LEVELS.HIGHER_ED
    }
  },
  {
    id: generateId(),
    title: '新教师学校管理制度与工作流程培训',
    type: TRAINING_TYPES.SCHOOL_MANAGEMENT,
    content: '为新教师介绍学校管理制度、工作流程、规章制度等基础管理知识。帮助新教师快速了解学校运作机制，掌握日常工作规范，提高工作效率。培训内容包括教学管理制度、学生管理规定、安全管理要求、行政办事流程等实用信息。',
    category: 'student_management',
    source: TRAINING_SOURCES.INTERNAL,
    priority: false,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    status: TRAINING_STATUS.COMPLETED,
    duration: '20学时',
    tags: ['新教师', '学校管理', '工作流程', '规章制度', '入职指导'],
    targetAudience: '新入职教师',
    method: '专家讲座',
    budget: '5000元以下',
    venue: '学校会议室',
    trainer: '管理干部',
    applicant: {
      name: '刘管理',
      role: '办公室主任',
      department: '校长办公室',
      educationLevel: EDUCATION_LEVELS.VOCATIONAL
    }
  },
  {
    id: generateId(),
    title: '新教师课程设计与教学改革创新培训',
    type: TRAINING_TYPES.CURRICULUM_DESIGN,
    content: '面向新教师的课程设计培训，重点培养课程目标设定、教学内容组织、教学活动设计、评价方案制定等课程开发能力。结合教学改革趋势，引导新教师掌握现代课程设计理念和方法，提升课程建设和教学创新能力。',
    category: 'curriculum_design',
    source: TRAINING_SOURCES.EXTERNAL,
    priority: false,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    status: TRAINING_STATUS.APPROVED,
    duration: '50学时',
    tags: ['新教师', '课程设计', '教学改革', '课程开发', '教学创新'],
    targetAudience: '专业课教师',
    method: '实地考察',
    budget: '30000-50000元',
    venue: '示范学校',
    trainer: '课程专家',
    applicant: {
      name: '周课程',
      role: '教研室主任',
      department: '教务处',
      educationLevel: EDUCATION_LEVELS.BASIC_ED
    }
  },
  {
    id: generateId(),
    title: '新教师心理健康教育与危机干预培训',
    type: TRAINING_TYPES.MENTAL_HEALTH,
    content: '为新教师提供心理健康教育专业培训，包括学生心理特点识别、心理问题预防、危机干预技巧、心理咨询基础等内容。帮助新教师掌握基本的心理健康教育知识和技能，能够及时发现和处理学生心理问题，维护学生身心健康。',
    category: 'mental_health',
    source: TRAINING_SOURCES.CERTIFICATION,
    priority: true,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    status: TRAINING_STATUS.PLANNED,
    duration: '60学时',
    tags: ['新教师', '心理健康', '危机干预', '学生工作', '心理咨询'],
    targetAudience: '班主任教师',
    method: '认证培训',
    budget: '25000-35000元',
    venue: '心理培训中心',
    trainer: '心理专家',
    applicant: {
      name: '马心理',
      role: '心理健康中心主任',
      department: '学生处',
      educationLevel: EDUCATION_LEVELS.HIGHER_ED
    }
  },
  {
    id: generateId(),
    title: '新教师教育科研方法与创新能力培训',
    type: TRAINING_TYPES.RESEARCH_INNOVATION,
    content: '针对新教师的教育科研培训，涵盖教育研究方法、课题申报技巧、论文写作规范、数据分析方法等科研基础知识。培养新教师的科研意识和创新思维，提升教育教学研究能力，为今后的专业发展和学术成长打下基础。',
    category: 'research_innovation',
    source: TRAINING_SOURCES.MENTORING,
    priority: false,
    priorityLevel: PRIORITY_LEVELS.LOW,
    status: TRAINING_STATUS.POSTPONED,
    duration: '40学时',
    tags: ['新教师', '教育科研', '研究方法', '论文写作', '创新能力'],
    targetAudience: '有科研需求的新教师',
    method: '导师指导',
    budget: '15000-20000元',
    venue: '科研培训室',
    trainer: '科研导师',
    applicant: {
      name: '孙科研',
      role: '科研处副主任',
      department: '科研处',
      educationLevel: EDUCATION_LEVELS.VOCATIONAL
    }
  }
];

// 生成新老师培训数据
const generateNewTeacherTrainingData = () => {
  const now = new Date();
  
  return NEW_TEACHER_TRAINING_TEMPLATES.map(template => {
    const createdAt = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
    const updatedAt = randomDate(createdAt, now);
    
    return {
      ...template,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      // 添加培训材料
      materials: [
        {
          id: 'material_' + Math.random().toString(36).substr(2, 9),
          name: `${template.title}培训手册.pdf`,
          type: 'document',
          url: '#',
          description: '培训专用教材和参考资料'
        },
        {
          id: 'material_' + Math.random().toString(36).substr(2, 9),
          name: `${template.title}案例集`,
          type: 'text',
          content: '相关教学案例和实践经验分享',
          description: '实际教学案例分析'
        }
      ],
      // 添加培训计划
      schedule: {
        startDate: randomDate(now, new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        endDate: randomDate(new Date(now.getTime() + 61 * 24 * 60 * 60 * 1000), new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        sessions: Math.floor(parseInt(template.duration) / 8) || 1
      }
    };
  });
};

// 导出新老师培训数据
export const NEW_TEACHER_TRAINING_DATA = generateNewTeacherTrainingData();

// 导出数据生成函数
export { generateNewTeacherTrainingData };

// 获取新老师培训统计
export const getNewTeacherTrainingStats = () => {
  const data = NEW_TEACHER_TRAINING_DATA;
  
  return {
    total: data.length,
    byType: data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {}),
    byStatus: data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {}),
    byPriority: data.reduce((acc, item) => {
      acc[item.priorityLevel] = (acc[item.priorityLevel] || 0) + 1;
      return acc;
    }, {}),
    highPriorityCount: data.filter(item => item.priority).length,
    completedCount: data.filter(item => item.status === TRAINING_STATUS.COMPLETED).length
  };
};