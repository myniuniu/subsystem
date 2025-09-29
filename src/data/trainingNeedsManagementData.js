/**
 * 培训需求与培训管理系统分类模拟数据
 * 与组织培训卡片数据结构保持一致
 */

// 生成唯一ID的辅助函数
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 培训需求与培训管理系统分类的模拟数据
export const TRAINING_NEEDS_MANAGEMENT_DATA = [
  {
    id: generateId(),
    title: '【培训需求与管理】新教师教学方法培训需求分析',
    content: `# 新教师教学方法培训需求分析

## 需求基本信息

**需求名称：** 新教师教学方法培训需求分析
**需求类型：** 培训需求与管理
**需求分类：** 教学方法
**需求状态：** 🔄 需求分析中

## 需求描述

针对新入职教师的教学方法培训需求分析，识别新教师在教学方法方面的能力差距，制定相应的培训计划。

## 需求分析要点

### 1. 目标群体分析
- 新入职教师（工作经验1-3年）
- 缺乏系统性教学方法训练
- 需要快速提升课堂教学能力

### 2. 能力差距识别
- 教学设计能力不足
- 课堂互动技巧欠缺
- 学生管理经验不足
- 教学评价方法单一

### 3. 培训目标设定
- 掌握基本教学设计原理
- 学会多种教学方法和技巧
- 提升课堂管理能力
- 建立有效的教学评价体系

### 4. 培训内容规划
- 教学理论基础（8学时）
- 教学方法实践（12学时）
- 课堂管理技巧（8学时）
- 教学评价方法（4学时）

## 管理要点

*在此处记录培训需求管理的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '教学方法', '新教师', '需求分析'],
    starred: false,
    source: '培训需求与管理',
    courseId: 'tnm_001',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'multi_video',
      totalVideos: 5,
      totalDuration: 3600, // 60分钟
      watchedDuration: 2160, // 36分钟，60%进度
      overallProgress: 60,
      videos: [
        {
          id: 'video_001',
          title: '需求分析理论基础',
          url: 'https://example.com/video1',
          duration: 900, // 15分钟
          progress: 100, // 已完成
          instructor: '张教授'
        },
        {
          id: 'video_002',
          title: '培训需求调研方法',
          url: 'https://example.com/video2',
          duration: 720, // 12分钟
          progress: 100, // 已完成
          instructor: '张教授'
        },
        {
          id: 'video_003',
          title: '能力差距分析技巧',
          url: 'https://example.com/video3',
          duration: 600, // 10分钟
          progress: 100, // 已完成
          instructor: '张教授'
        },
        {
          id: 'video_004',
          title: '培训目标设定方法',
          url: 'https://example.com/video4',
          duration: 660, // 11分钟
          progress: 50, // 进行中
          instructor: '张教授'
        },
        {
          id: 'video_005',
          title: '培训计划制定实务',
          url: 'https://example.com/video5',
          duration: 720, // 12分钟
          progress: 0, // 未开始
          instructor: '张教授'
        }
      ]
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    // 模拟学习时间信息 - 进行中的培训
    learningSchedule: {
      startTime: '12/24 09:00',
      endTime: '12/30 17:00',
      duration: '6天'
    }
  },
  {
    id: generateId(),
    title: '【培训需求与管理】班级管理培训需求评估',
    content: `# 班级管理培训需求评估

## 需求基本信息

**需求名称：** 班级管理培训需求评估
**需求类型：** 培训需求与管理
**需求分类：** 学生管理
**需求状态：** 🔄 需求评估中

## 需求描述

班级管理培训需求的系统性评估，分析教师在班级管理方面的培训需求，制定针对性的培训方案。

## 评估要点

### 1. 现状调研
- 当前班级管理水平调查
- 常见管理问题识别
- 教师管理技能评估

### 2. 需求优先级排序
- 紧急性分析
- 重要性评估
- 可行性考虑

### 3. 培训资源配置
- 师资力量安排
- 培训时间规划
- 培训场地准备

## 管理要点

*在此处记录培训需求管理的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '班级管理', '学生管理', '需求评估'],
    starred: true,
    source: '培训需求与管理',
    courseId: 'tnm_002',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'single_video',
      totalVideos: 1,
      totalDuration: 3600, // 60分钟
      watchedDuration: 1800, // 30分钟，50%进度
      overallProgress: 50,
      videos: [
        {
          id: 'video_001',
          title: '班级管理培训需求评估实务',
          url: 'https://example.com/video1',
          duration: 3600, // 60分钟
          progress: 50, // 进行中
          instructor: '李专家'
        }
      ]
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    // 模拟学习时间信息 - 进行中的培训
    learningSchedule: {
      startTime: '12/25 14:00',
      endTime: '12/28 18:00',
      duration: '3天'
    }
  },
  {
    id: generateId(),
    title: '【培训需求与管理】教育技术培训管理系统',
    content: `# 教育技术培训管理系统

## 系统基本信息

**系统名称：** 教育技术培训管理系统
**系统类型：** 培训需求与管理
**系统分类：** 教育技术
**系统状态：** ✅ 已完成

## 系统描述

现代教育技术培训的管理系统设计与实施，提升培训管理的数字化水平和效率。

## 系统功能模块

### 1. 需求管理模块
- 培训需求收集
- 需求分析评估
- 需求优先级排序

### 2. 培训计划模块
- 培训计划制定
- 资源配置管理
- 进度跟踪监控

### 3. 效果评估模块
- 培训效果评估
- 数据分析报告
- 持续改进建议

## 管理要点

*在此处记录培训管理系统的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '教育技术', '管理系统', '数字化'],
    starred: false,
    source: '培训需求与管理',
    courseId: 'tnm_003',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'single_video',
      totalVideos: 1,
      totalDuration: 2400, // 40分钟
      watchedDuration: 2400, // 40分钟，100%进度
      overallProgress: 100,
      videos: [
        {
          id: 'video_001',
          title: '教育技术培训管理系统设计',
          url: 'https://example.com/video1',
          duration: 2400, // 40分钟
          progress: 100, // 已完成
          instructor: '王工程师'
        }
      ]
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    // 模拟学习时间信息 - 已完成的培训
    learningSchedule: {
      startTime: '12/20 10:00',
      endTime: '12/22 16:00',
      duration: '2天'
    }
  },
  {
    id: generateId(),
    title: '【培训需求与管理】课程设计培训需求调研',
    content: `# 课程设计培训需求调研

## 调研基本信息

**调研名称：** 课程设计培训需求调研
**调研类型：** 培训需求与管理
**调研分类：** 课程设计
**调研状态：** 📅 待开始

## 调研描述

系统性的课程设计培训需求调研，了解教师在课程设计方面的培训需求和期望。

## 调研计划

### 1. 调研对象
- 各学科教师代表
- 教学管理人员
- 课程开发专家

### 2. 调研方法
- 问卷调查
- 深度访谈
- 焦点小组讨论

### 3. 调研内容
- 当前课程设计能力水平
- 培训需求优先级
- 期望的培训形式和内容

## 管理要点

*在此处记录培训需求调研的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '课程设计', '需求调研', '教学设计'],
    starred: false,
    source: '培训需求与管理',
    courseId: 'tnm_004',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'multi_video',
      totalVideos: 4,
      totalDuration: 4800, // 80分钟
      watchedDuration: 1200, // 20分钟，25%进度
      overallProgress: 25,
      videos: [
        {
          id: 'video_001',
          title: '培训需求调研方法论',
          url: 'https://example.com/video1',
          duration: 1200, // 20分钟
          progress: 100, // 已完成
          instructor: '刘架构师'
        },
        {
          id: 'video_002',
          title: '问卷设计与实施',
          url: 'https://example.com/video2',
          duration: 1200, // 20分钟
          progress: 0, // 未开始
          instructor: '刘架构师'
        },
        {
          id: 'video_003',
          title: '访谈技巧与实践',
          url: 'https://example.com/video3',
          duration: 1200, // 20分钟
          progress: 0, // 未开始
          instructor: '刘架构师'
        },
        {
          id: 'video_004',
          title: '数据分析与报告撰写',
          url: 'https://example.com/video4',
          duration: 1200, // 20分钟
          progress: 0, // 未开始
          instructor: '刘架构师'
        }
      ]
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    // 模拟学习时间信息 - 未开始的培训
    learningSchedule: {
      startTime: '1/5 10:00',
      endTime: '1/12 15:00',
      duration: '7天'
    }
  },
  {
    id: generateId(),
    title: '【培训需求与管理】心理健康培训管理实务',
    content: `# 心理健康培训管理实务

## 管理基本信息

**管理名称：** 心理健康培训管理实务
**管理类型：** 培训需求与管理
**管理分类：** 心理健康
**管理状态：** 🔄 管理实施中

## 管理描述

针对教师心理健康培训的全流程管理实务，包括需求识别、培训组织、效果评估等环节。

## 管理流程

### 1. 需求识别阶段
- 心理健康状况调查
- 培训需求分析
- 目标群体确定

### 2. 培训组织阶段
- 培训方案设计
- 师资队伍建设
- 培训实施管理

### 3. 效果评估阶段
- 培训效果测评
- 跟踪调查分析
- 改进措施制定

## 管理要点

*在此处记录心理健康培训管理的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '心理健康', '培训管理', '实务操作'],
    starred: false,
    source: '培训需求与管理',
    courseId: 'tnm_005',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'single_video',
      totalVideos: 1,
      totalDuration: 3000, // 50分钟
      watchedDuration: 1500, // 25分钟，50%进度
      overallProgress: 50,
      videos: [
        {
          id: 'video_001',
          title: '心理健康培训管理实务',
          url: 'https://example.com/video1',
          duration: 3000, // 50分钟
          progress: 50, // 进行中
          instructor: '陈心理师'
        }
      ]
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    // 模拟学习时间信息 - 进行中的培训
    learningSchedule: {
      startTime: '12/26 09:00',
      endTime: '12/29 17:00',
      duration: '3天'
    }
  },
  {
    id: generateId(),
    title: '【培训需求与管理】信息技术培训需求预测',
    content: `# 信息技术培训需求预测

## 预测基本信息

**预测名称：** 信息技术培训需求预测
**预测类型：** 培训需求与管理
**预测分类：** 信息技术
**预测状态：** 📅 未开始

## 预测描述

基于技术发展趋势和教育数字化转型需求，预测未来信息技术培训的需求变化和发展方向。

## 预测维度

### 1. 技术发展趋势
- 人工智能在教育中的应用
- 虚拟现实教学技术
- 大数据教育分析

### 2. 教师能力需求
- 数字化教学设计能力
- 在线教学平台操作
- 教育数据分析技能

### 3. 培训内容规划
- 基础技能培训
- 进阶应用培训
- 创新实践培训

## 管理要点

*在此处记录培训需求预测的关键要点...*`,
    category: 'training_needs_management',
    tags: ['培训需求与管理', '信息技术', '需求预测', '数字化转型'],
    starred: true,
    source: '培训需求与管理',
    courseId: 'tnm_006',
    courseType: 'training_needs_management',
    videoInfo: {
      type: 'single_video',
      totalVideos: 1,
      totalDuration: 3600, // 60分钟
      watchedDuration: 0, // 0分钟，0%进度
      overallProgress: 0,
      videos: [
        {
          id: 'video_001',
          title: '信息技术培训需求预测方法',
          url: 'https://example.com/video1',
          duration: 3600, // 60分钟
          progress: 0, // 未开始
          instructor: '王工程师'
        }
      ]
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
    // 模拟学习时间信息 - 未开始的培训
    learningSchedule: {
      startTime: '1/8 09:00',
      endTime: '1/15 17:00',
      duration: '7天'
    }
  }
];

// 生成培训需求与管理数据的函数
export const generateTrainingNeedsManagementData = () => {
  return TRAINING_NEEDS_MANAGEMENT_DATA.map(item => ({
    ...item,
    id: generateId() // 重新生成ID确保唯一性
  }));
};