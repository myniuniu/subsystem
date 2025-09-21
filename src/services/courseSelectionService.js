/**
 * 选课数据服务
 * 提供选课的CRUD操作和本地存储管理
 * 支持组织培训和自主学习两种类型的课程
 */

const STORAGE_KEY = 'course_selection_data';
const CATEGORIES_KEY = 'course_selection_categories';
const TAGS_KEY = 'course_selection_tags';

// 默认分类 - 基于组织培训和自主学习两大类别
const DEFAULT_CATEGORIES = [
  { id: 'organizational_training', name: '组织培训', icon: 'TeamOutlined', color: '#fa8c16', description: '基于培训需求的组织安排课程' },
  { id: 'self_learning', name: '自主学习', icon: 'BookOutlined', color: '#52c41a', description: '个人主动选择的学习课程' }
];

// 组织培训子分类
const ORGANIZATIONAL_CATEGORIES = [
  { id: 'teaching_methods', name: '教学方法', icon: 'BookOutlined', color: '#52c41a', parent: 'organizational_training' },
  { id: 'student_management', name: '学生管理', icon: 'TeamOutlined', color: '#fa8c16', parent: 'organizational_training' },
  { id: 'educational_tech', name: '教育技术', icon: 'LaptopOutlined', color: '#13c2c2', parent: 'organizational_training' },
  { id: 'curriculum_design', name: '课程设计', icon: 'DesktopOutlined', color: '#722ed1', parent: 'organizational_training' },
  { id: 'policy_compliance', name: '政策合规', icon: 'SafetyCertificateOutlined', color: '#f5222d', parent: 'organizational_training' }
];

// 自主学习子分类
const SELF_LEARNING_CATEGORIES = [
  { id: 'research_innovation', name: '科研创新', icon: 'ExperimentOutlined', color: '#1890ff', parent: 'self_learning' },
  { id: 'mental_health', name: '心理健康', icon: 'HeartOutlined', color: '#eb2f96', parent: 'self_learning' },
  { id: 'professional_dev', name: '专业发展', icon: 'RiseOutlined', color: '#faad14', parent: 'self_learning' },
  { id: 'skill_enhancement', name: '技能提升', icon: 'BulbOutlined', color: '#52c41a', parent: 'self_learning' },
  { id: 'personal_interest', name: '兴趣爱好', icon: 'StarOutlined', color: '#722ed1', parent: 'self_learning' }
];

// 默认标签
const DEFAULT_TAGS = [
  '紧急', '重要', '计划中', '已完成', '待审批',
  '新员工', '在职', '管理层', '技术', '销售'
];

class CourseSelectionService {
  constructor() {
    this.initializeStorage();
  }

  // 初始化存储
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(CATEGORIES_KEY)) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(TAGS_KEY)) {
      localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
    }
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 获取所有选课
  getAllCourses() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取选课数据失败:', error);
      return [];
    }
  }

  // 根据ID获取选课
  getCourseById(id) {
    try {
      const courses = this.getAllCourses();
      return courses.find(course => course.id === id) || null;
    } catch (error) {
      console.error('获取选课失败:', error);
      return null;
    }
  }

  // 创建选课
  createCourse(courseData) {
    try {
      const courses = this.getAllCourses();
      const newCourse = {
        id: this.generateId(),
        title: courseData.title || '未命名选课',
        content: courseData.content || '',
        description: courseData.description || '',
        type: courseData.type || 'self_learning', // 'organizational_training' 或 'self_learning'
        trainingNeedId: courseData.trainingNeedId || null, // 关联的培训需求ID
        category: courseData.category || 'self_learning',
        tags: courseData.tags || [],
        status: courseData.status || '待开课',
        participants: courseData.participants || [],
        instructor: courseData.instructor || '',
        schedule: courseData.schedule || null,
        isStarred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      courses.push(newCourse);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      return newCourse;
    } catch (error) {
      console.error('创建选课失败:', error);
      throw error;
    }
  }

  // 更新选课
  updateCourse(id, courseData) {
    try {
      const courses = this.getAllCourses();
      const index = courses.findIndex(course => course.id === id);
      
      if (index !== -1) {
        courses[index] = {
          ...courses[index],
          ...courseData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        return courses[index];
      }
      return null;
    } catch (error) {
      console.error('更新选课失败:', error);
      throw error;
    }
  }

  // 删除选课
  deleteCourse(id) {
    try {
      const courses = this.getAllCourses();
      const filteredCourses = courses.filter(course => course.id !== id);
      
      if (filteredCourses.length !== courses.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCourses));
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除选课失败:', error);
      throw error;
    }
  }

  // 批量删除选课
  deleteCourses(ids) {
    try {
      const courses = this.getAllCourses();
      const filteredCourses = courses.filter(course => !ids.includes(course.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCourses));
      return true;
    } catch (error) {
      console.error('批量删除选课失败:', error);
      throw error;
    }
  }

  // 搜索选课
  searchCourses(query, filters = {}) {
    try {
      let courses = this.getAllCourses();

      // 文本搜索
      if (query) {
        const searchTerm = query.toLowerCase();
        courses = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.content.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      }

      // 分类筛选
      if (filters.category && filters.category !== 'all') {
        courses = courses.filter(course => course.category === filters.category);
      }

      // 类型筛选
      if (filters.type) {
        courses = courses.filter(course => course.type === filters.type);
      }

      // 标签筛选
      if (filters.tags && filters.tags.length > 0) {
        courses = courses.filter(course =>
          course.tags && filters.tags.every(tag => course.tags.includes(tag))
        );
      }

      // 状态筛选
      if (filters.status) {
        courses = courses.filter(course => course.status === filters.status);
      }

      return courses;
    } catch (error) {
      console.error('搜索选课失败:', error);
      return [];
    }
  }

  // 获取分类
  getCategories() {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('获取分类失败:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  // 获取所有分类（包括子分类）
  // 获取所有分类（包括主分类和子分类）
  getAllCategories() {
    const customSubcategories = this.getCustomSubcategories();
    return [...DEFAULT_CATEGORIES, ...ORGANIZATIONAL_CATEGORIES, ...SELF_LEARNING_CATEGORIES, ...customSubcategories];
  }

  // 获取标签
  getTags() {
    try {
      const data = localStorage.getItem(TAGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_TAGS;
    } catch (error) {
      console.error('获取标签失败:', error);
      return DEFAULT_TAGS;
    }
  }

  // 更新标签列表
  updateTagsList(newTags) {
    try {
      const uniqueTags = [...new Set(newTags)];
      localStorage.setItem(TAGS_KEY, JSON.stringify(uniqueTags));
      return uniqueTags;
    } catch (error) {
      console.error('更新标签失败:', error);
      throw error;
    }
  }

  // 获取子分类
  getSubcategories(parentId) {
    try {
      const allCategories = this.getAllCategories();
      return allCategories.filter(cat => cat.parent === parentId);
    } catch (error) {
      console.error('获取子分类失败:', error);
      return [];
    }
  }

  // 创建自定义子分类
  createSubcategory(subcategoryData) {
    try {
      const { name, parent, icon = 'FolderOutlined', color = '#1890ff' } = subcategoryData;
      
      if (!name || !parent) {
        throw new Error('子分类名称和父分类不能为空');
      }

      // 验证父分类是否存在
      const validParents = ['organizational_training', 'self_learning'];
      if (!validParents.includes(parent)) {
        throw new Error('无效的父分类');
      }

      const newSubcategory = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        parent,
        icon,
        color,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      // 获取现有的自定义子分类
      const customSubcategories = this.getCustomSubcategories();
      customSubcategories.push(newSubcategory);
      
      // 保存到localStorage
      localStorage.setItem('custom_subcategories', JSON.stringify(customSubcategories));
      
      return newSubcategory;
    } catch (error) {
      console.error('创建子分类失败:', error);
      throw error;
    }
  }

  // 获取自定义子分类
  getCustomSubcategories() {
    try {
      const data = localStorage.getItem('custom_subcategories');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取自定义子分类失败:', error);
      return [];
    }
  }

  // 删除自定义子分类
  deleteSubcategory(subcategoryId) {
    try {
      const customSubcategories = this.getCustomSubcategories();
      const filteredSubcategories = customSubcategories.filter(sub => sub.id !== subcategoryId);
      localStorage.setItem('custom_subcategories', JSON.stringify(filteredSubcategories));
      return true;
    } catch (error) {
      console.error('删除子分类失败:', error);
      throw error;
    }
  }

  // 更新getAllCategories方法以包含自定义子分类

  // 获取选课统计
  getCoursesStats() {
    try {
      const courses = this.getAllCourses();
      const stats = {
        total: courses.length,
        organizational: courses.filter(c => c.type === 'organizational_training').length,
        selfLearning: courses.filter(c => c.type === 'self_learning').length,
        byStatus: {},
        categories: {},
        withTrainingNeed: courses.filter(c => c.trainingNeedId).length
      };

      // 按状态统计
      courses.forEach(course => {
        const status = course.status || '未知';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      });

      // 初始化所有分类的计数为0
      const allCategories = this.getAllCategories();
      allCategories.forEach(category => {
        stats.categories[category.id] = 0;
      });

      // 按分类统计课程数量
      courses.forEach(course => {
        const category = course.category;
        if (category && category in stats.categories) {
          stats.categories[category]++;
        }
        
        // 如果是子分类，也要统计到对应的主分类
        const allCats = this.getAllCategories();
        const categoryInfo = allCats.find(cat => cat.id === category);
        if (categoryInfo && categoryInfo.parent) {
          // 这是一个子分类，也要统计到主分类
          if (categoryInfo.parent in stats.categories) {
            stats.categories[categoryInfo.parent]++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        total: 0,
        organizational: 0,
        selfLearning: 0,
        byStatus: {},
        categories: {},
        withTrainingNeed: 0
      };
    }
  }

  // 根据培训需求创建组织培训课程
  createOrganizationalCourse(trainingNeed) {
    const courseData = {
      title: `${trainingNeed.title} - 组织培训`,
      type: 'organizational_training',
      trainingNeedId: trainingNeed.id,
      category: trainingNeed.category || 'teaching_methods',
      description: `基于培训需求"${trainingNeed.title}"创建的组织培训课程`,
      content: trainingNeed.content || trainingNeed.description || '',
      tags: trainingNeed.tags || [],
      status: '待开课'
    };

    return this.createCourse(courseData);
  }

  // 获取与培训需求关联的课程
  getCoursesByTrainingNeed(trainingNeedId) {
    try {
      const courses = this.getAllCourses();
      return courses.filter(course => course.trainingNeedId === trainingNeedId);
    } catch (error) {
      console.error('获取关联课程失败:', error);
      return [];
    }
  }

  // 导出选课数据
  exportCourses(format = 'json') {
    try {
      const courses = this.getAllCourses();
      
      if (format === 'json') {
        return JSON.stringify(courses, null, 2);
      } else if (format === 'csv') {
        // 简单的CSV导出
        const headers = ['ID', '标题', '类型', '分类', '状态', '创建时间'];
        const rows = courses.map(course => [
          course.id,
          course.title,
          course.type === 'organizational_training' ? '组织培训' : '自主学习',
          course.category,
          course.status,
          course.createdAt
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }
      
      return JSON.stringify(courses, null, 2);
    } catch (error) {
      console.error('导出选课数据失败:', error);
      throw error;
    }
  }

  // 导入选课数据
  importCourses(data, options = { merge: true }) {
    try {
      const importedCourses = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (!Array.isArray(importedCourses)) {
        throw new Error('导入数据格式错误');
      }

      if (options.merge) {
        const existingCourses = this.getAllCourses();
        const mergedCourses = [...existingCourses];
        
        importedCourses.forEach(importedCourse => {
          const existingIndex = mergedCourses.findIndex(c => c.id === importedCourse.id);
          if (existingIndex !== -1) {
            mergedCourses[existingIndex] = { ...importedCourse, updatedAt: new Date().toISOString() };
          } else {
            mergedCourses.push({ ...importedCourse, id: this.generateId() });
          }
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedCourses));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedCourses));
      }
      
      return true;
    } catch (error) {
      console.error('导入选课数据失败:', error);
      throw error;
    }
  }

  // 清除所有数据
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATEGORIES_KEY);
      localStorage.removeItem(TAGS_KEY);
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error('清除数据失败:', error);
      throw error;
    }
  }
}

// 创建服务实例
const courseSelectionService = new CourseSelectionService();

export default courseSelectionService;
export { CourseSelectionService };