// 模拟选课数据生成器
import courseSelectionService from '../services/courseSelectionService';

export const generateMockCourseData = () => {
  // 清空现有数据
  courseSelectionService.clearAllData();
  
  // 创建一些组织培训课程
  const organizationalCourses = [
    {
      title: '新教师教学方法培训',
      type: 'organizational_training',
      category: 'teaching_methods',
      description: '针对新入职教师的教学方法培训课程',
      status: '进行中',
      instructor: '张教授',
      tags: ['新员工', '教学']
    },
    {
      title: '学生管理技巧提升',
      type: 'organizational_training', 
      category: 'student_management',
      description: '提升教师学生管理能力的培训课程',
      status: '待开课',
      instructor: '李老师',
      tags: ['管理', '技能提升']
    },
    {
      title: '班级管理实务',
      type: 'organizational_training', 
      category: 'student_management',
      description: '班级管理的实际操作技巧培训',
      status: '进行中',
      instructor: '赵老师',
      tags: ['班级', '管理']
    },
    {
      title: '教育技术应用实践',
      type: 'organizational_training',
      category: 'educational_tech',
      description: '现代教育技术在教学中的应用培训',
      status: '已完成',
      instructor: '王工程师',
      tags: ['技术', '实践']
    },
    {
      title: '课程设计与开发',
      type: 'organizational_training',
      category: 'curriculum_design',
      description: '系统性课程设计方法培训',
      status: '进行中',
      instructor: '陈博士',
      tags: ['设计', '开发']
    }
  ];

  // 创建一些自主学习课程
  const selfLearningCourses = [
    {
      title: '科研方法与创新思维',
      type: 'self_learning',
      category: 'research_innovation',
      description: '提升科研能力和创新思维的自主学习课程',
      status: '进行中',
      tags: ['科研', '创新']
    },
    {
      title: '教师心理健康维护',
      type: 'self_learning',
      category: 'mental_health',
      description: '关注教师心理健康的自主学习课程',
      status: '待开课',
      tags: ['心理', '健康']
    },
    {
      title: '专业技能持续发展',
      type: 'self_learning',
      category: 'professional_dev',
      description: '教师专业技能持续发展课程',
      status: '已完成',
      tags: ['专业', '发展']
    },
    {
      title: '数字化技能提升',
      type: 'self_learning',
      category: 'skill_enhancement',
      description: '数字化时代教师技能提升课程',
      status: '进行中',
      tags: ['数字化', '技能']
    },
    {
      title: '艺术修养与审美',
      type: 'self_learning',
      category: 'personal_interest',
      description: '提升个人艺术修养的兴趣课程',
      status: '待开课',
      tags: ['艺术', '兴趣']
    }
  ];

  // 批量创建课程
  const allCourses = [...organizationalCourses, ...selfLearningCourses];
  allCourses.forEach(courseData => {
    courseSelectionService.createCourse(courseData);
  });

  console.log('模拟选课数据生成完成！');
  console.log('组织培训课程数量:', organizationalCourses.length);
  console.log('自主学习课程数量:', selfLearningCourses.length);
  console.log('总课程数量:', allCourses.length);
  
  return allCourses;
};

export default { generateMockCourseData };