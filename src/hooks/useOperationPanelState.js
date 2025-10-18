import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { OPERATION_CARDS } from '../constants/noteEditConstants';

// 操作面板状态管理Hook
export const useOperationPanelState = (noteCategory = null) => {
  console.log('=== useOperationPanelState 调用 ===');
  console.log('接收到的 noteCategory:', noteCategory);
  console.log('noteCategory 类型:', typeof noteCategory);
  console.log('================================');

  // 根据分类过滤工具的函数
  const getFilteredCards = (category) => {
    console.log('getFilteredCards 被调用，分类:', category);
    // 组织培训分类：仅默认显示指定的六个工具
    if (category === 'organizational_training') {
      const allowedKeys = [
        'learning-plan',
        'audio',
        'video',
        'mindmap',
        'report',
        'scenario'
      ];
      const filtered = OPERATION_CARDS.filter(card => allowedKeys.includes(card.key));
      // 固定顺序输出
      const ordered = allowedKeys
        .map(key => filtered.find(c => c.key === key))
        .filter(Boolean);
      console.log('组织培训分类，返回的卡片:', ordered);
      return ordered;
    }
    
    // 如果是培训需求与管理分类，返回培训相关工具
    if (category === 'training_needs_management') {
      // 只显示指定的四个工具：培训方案、课表、培训报告、培训报表
      const trainingCards = OPERATION_CARDS.filter(card => 
        card.key === 'training-plan' || 
        card.key === 'schedule' || 
        card.key === 'training-report' ||
        card.key === 'training-dashboard'
      );
      
      console.log('培训需求管理分类，返回的卡片:', trainingCards);
      return trainingCards;
    }
    
    // 如果是培训产品研发分类，显示课程研发工具和视频切片工具
    if (category === 'training_product_development') {
      // 获取AI工具配置
  const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
  let addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
  // 过滤已移除的智能写作工具，防止历史数据继续显示
  addedAITools = addedAITools.filter(id => id !== 'smart-writer');
      
  console.log('localStorage ai-tools-config:', aiToolsConfig);
  console.log('localStorage added-ai-tools-to-panel:', addedAITools);
      
      // 如果课程研发工具不存在，自动创建并添加
      if (!addedAITools.includes('course-development')) {
        console.log('课程研发工具不存在，自动创建...');
        
        // 创建课程研发工具配置
        const courseDevConfig = {
          key: 'course-development',
          title: '课程研发',
          icon: '📚',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        };
        
        // 更新配置
        aiToolsConfig['course-development'] = courseDevConfig;
        addedAITools.push('course-development');
        
  // 保存到localStorage（与 OperationPanel 保持一致的键名）
  localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig));
  localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(addedAITools));
        
        console.log('课程研发工具已自动创建并添加');
      }
      
      // 取消自动创建“视频切片”工具，避免与面板内 AI 工具屋重复
      
      // 查找培训产品研发相关的AI工具
      const trainingProductDevCards = [];
      
      // 添加课程研发工具
      if (addedAITools.includes('course-development') && aiToolsConfig['course-development']) {
        const config = aiToolsConfig['course-development'];
        const aiCard = {
          key: 'course-development',
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        };
        trainingProductDevCards.push(aiCard);
        console.log('找到课程研发AI工具:', aiCard);
      }
      
      // 不在此处注入“视频切片”AI工具，统一通过面板添加，避免重复
      
      console.log('培训产品研发分类，返回的卡片:', trainingProductDevCards);
      return trainingProductDevCards;
    }

    // 如果是组织培训分类，默认仅显示六个工具并保持固定顺序
    if (category === 'organizational_training') {
      const orderedKeys = [
        'learning-plan',
        'audio',
        'video',
        'mindmap',
        'report',
        'scenario'
      ];
      const orgTrainingCards = orderedKeys
        .map(key => OPERATION_CARDS.find(card => card.key === key))
        .filter(Boolean);
      console.log('组织培训分类，返回的卡片:', orgTrainingCards);
      return orgTrainingCards;
    }

    // 如果是作业系统分类，默认注入并仅显示相关作业工具
    if (category === 'homework_system') {
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
      const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');

      const homeworkToolIds = [
        'homework-center',
        'grading-assistant',
        'unit-assignment-design',
        // 作业设计扩展
        'custom-unit-homework-design',
        'recompose-unit-assignment-design',
        'graphic-homework-design',
        // 作文批改
        'primary-chinese-essay-grader',
        'primary-english-essay-grader',
        'junior-chinese-essay-grader',
        'junior-english-essay-grader',
        'senior-chinese-essay-grader',
        'senior-english-essay-grader',
        // 默写改错
        'chinese-dictation-correction',
        'english-dictation-correction',
        // 出题工具
        'knowledge-point-question-generator',
        'chapter-question-generator',
        'unit-question-generator',
        'question-set-generator',
        'logic-question-generator',
        'multiple-choice-generator',
        'image-question-generator',
        'smart-question-bank-manager'
      ];

      const defaultConfigs = {
        'homework-center': {
          key: 'homework-center',
          title: '作业中心',
          icon: '📘',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'grading-assistant': {
          key: 'grading-assistant',
          title: '阅卷助手',
          icon: '阅',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#c41d7f'
        },
        'unit-assignment-design': {
          key: 'unit-assignment-design',
          title: '单元作业设计',
          icon: '作',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        // 作业设计扩展
        'custom-unit-homework-design': {
          key: 'custom-unit-homework-design',
          title: '自定义单元作业',
          icon: '自',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #d6e4ff 100%)',
          color: '#1d4ed8'
        },
        'recompose-unit-assignment-design': {
          key: 'recompose-unit-assignment-design',
          title: '重组单元作业设计',
          icon: '重',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'graphic-homework-design': {
          key: 'graphic-homework-design',
          title: '图形设计',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        },
        // 作文批改
        'primary-chinese-essay-grader': {
          key: 'primary-chinese-essay-grader',
          title: '小学语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        },
        'primary-english-essay-grader': {
          key: 'primary-english-essay-grader',
          title: '小学英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'junior-chinese-essay-grader': {
          key: 'junior-chinese-essay-grader',
          title: '初中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
          color: '#faad14'
        },
        'junior-english-essay-grader': {
          key: 'junior-english-essay-grader',
          title: '初中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'senior-chinese-essay-grader': {
          key: 'senior-chinese-essay-grader',
          title: '高中语文作文批改',
          icon: '语',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'senior-english-essay-grader': {
          key: 'senior-english-essay-grader',
          title: '高中英文作文批改',
          icon: '英',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        },
        // 默写改错
        'chinese-dictation-correction': {
          key: 'chinese-dictation-correction',
          title: '语文默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%)',
          color: '#fa541c'
        },
        'english-dictation-correction': {
          key: 'english-dictation-correction',
          title: '英语默写改错',
          icon: '默',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        // 出题工具
        'knowledge-point-question-generator': {
          key: 'knowledge-point-question-generator',
          title: '知识点出题',
          icon: '知',
          gradient: 'linear-gradient(135deg, #f0e6ff 0%, #e6d7ff 100%)',
          color: '#722ed1'
        },
        'chapter-question-generator': {
          key: 'chapter-question-generator',
          title: '章节出题',
          icon: '章',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'unit-question-generator': {
          key: 'unit-question-generator',
          title: '单元出题',
          icon: '单',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'question-set-generator': {
          key: 'question-set-generator',
          title: '题组出题',
          icon: '组',
          gradient: 'linear-gradient(135deg, #fff0f6 0%, #ffd6e7 100%)',
          color: '#eb2f96'
        },
        'logic-question-generator': {
          key: 'logic-question-generator',
          title: '逻辑出题',
          icon: '逻',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          color: '#52c41a'
        },
        'multiple-choice-generator': {
          key: 'multiple-choice-generator',
          title: '选择题出题',
          icon: '选',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'image-question-generator': {
          key: 'image-question-generator',
          title: '图像题出题',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        },
        'smart-question-bank-manager': {
          key: 'smart-question-bank-manager',
          title: '智能题库管理',
          icon: '库',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        }
      };

      // 注入缺失的工具配置与ID
      let changed = false;
      homeworkToolIds.forEach(id => {
        if (!addedAITools.includes(id)) {
          addedAITools.push(id);
          changed = true;
        }
        if (!aiToolsConfig[id]) {
          aiToolsConfig[id] = defaultConfigs[id];
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig));
        localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(addedAITools));
        console.log('作业系统工具默认注入完成:', homeworkToolIds);
      }

      // 仅显示作业系统相关工具
      const homeworkCards = homeworkToolIds.map(id => {
        const config = aiToolsConfig[id];
        if (config) {
          return {
            key: id,
            title: config.title,
            icon: config.icon,
            gradient: config.gradient,
            color: config.color,
            isAITool: true
          };
        }
        return null;
      }).filter(Boolean);

      console.log('作业系统分类，返回的卡片:', homeworkCards);
      return homeworkCards;
    }

    // 如果是教研室分类，默认注入并仅显示六个教研室工具
    if (category === 'teaching_research_office') {
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
      const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');

      const teachingToolIds = [
        'verbatim-transcript',
        'large-unit-design',
        'interdisciplinary-design',
        'unit-assignment-design',
        'large-unit-academic-case',
        'teacher-research-project'
      ];

      const defaultConfigs = {
        'verbatim-transcript': {
          key: 'verbatim-transcript',
          title: '逐字稿工具',
          icon: '稿',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        },
        'large-unit-design': {
          key: 'large-unit-design',
          title: '大单元设计',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        },
        'interdisciplinary-design': {
          key: 'interdisciplinary-design',
          title: '跨学科设计',
          icon: '跨',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'unit-assignment-design': {
          key: 'unit-assignment-design',
          title: '单元作业设计',
          icon: '作',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'large-unit-academic-case': {
          key: 'large-unit-academic-case',
          title: '大单元学历案',
          icon: '案',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'teacher-research-project': {
          key: 'teacher-research-project',
          title: '教师课题研究',
          icon: '研',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        }
      };

      // 注入缺失的工具配置与ID
      let changed = false;
      teachingToolIds.forEach(id => {
        if (!addedAITools.includes(id)) {
          addedAITools.push(id);
          changed = true;
        }
        if (!aiToolsConfig[id]) {
          aiToolsConfig[id] = defaultConfigs[id];
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig));
        localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(addedAITools));
        console.log('教研室工具默认注入完成:', teachingToolIds);
      }

      // 仅显示六个教研室工具
      const teachingCards = teachingToolIds.map(id => {
        const config = aiToolsConfig[id];
        if (config) {
          return {
            key: id,
            title: config.title,
            icon: config.icon,
            gradient: config.gradient,
            color: config.color,
            isAITool: true
          };
        }
        return null;
      }).filter(Boolean);

      // 额外加入基础工具中的“场景模拟”卡片
      const scenarioCard = OPERATION_CARDS.find(card => card.key === 'scenario');
      const finalCards = scenarioCard ? [...teachingCards, scenarioCard] : teachingCards;

      console.log('教研室分类，返回的卡片:', finalCards);
      return finalCards;
    }

    // 如果是教学设计分类，默认注入并仅显示教学设计相关工具
    if (category === 'teaching_design') {
      const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
      const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');

      const teachingDesignToolIds = [
        'teaching-assistant',
        'verbatim-transcript',
        'large-unit-design',
        'interdisciplinary-design',
        'unit-assignment-design',
        'open-class-design',
        'guided-learning-plan',
        'lesson-presentation',
        'evaluation-rubric',
        'unit-academic-case',
        'ai-picture-book',
        'cloud-word-cards',
        'sticker-materials',
        'digital-human-speech',
        'comic-strip',
        'quick-designer',
        'children-simple-drawings',
        'ai-video',
        'audio-video-text-converter',
        'ppt-courseware'
      ];

      const defaultConfigs = {
        'teaching-assistant': {
          key: 'teaching-assistant',
          title: '教学助手',
          icon: '🎓',
          gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
          color: '#fa8c16'
        },
        'verbatim-transcript': {
          key: 'verbatim-transcript',
          title: '逐字稿工具',
          icon: '稿',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        },
        'large-unit-design': {
          key: 'large-unit-design',
          title: '大单元设计',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        },
        'interdisciplinary-design': {
          key: 'interdisciplinary-design',
          title: '跨学科设计',
          icon: '跨',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'unit-assignment-design': {
          key: 'unit-assignment-design',
          title: '单元作业设计',
          icon: '作',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
        ,
        'open-class-design': {
          key: 'open-class-design',
          title: '公开课设计',
          icon: '公',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'guided-learning-plan': {
          key: 'guided-learning-plan',
          title: '导学案',
          icon: '导',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'lesson-presentation': {
          key: 'lesson-presentation',
          title: '说课稿',
          icon: '说',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'evaluation-rubric': {
          key: 'evaluation-rubric',
          title: '评价量规',
          icon: '评',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#531dab'
        },
        'unit-academic-case': {
          key: 'unit-academic-case',
          title: '单元学历案',
          icon: '单',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#0958d9'
        },
        'ai-picture-book': {
          key: 'ai-picture-book',
          title: 'AI绘本',
          icon: '📖',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'cloud-word-cards': {
          key: 'cloud-word-cards',
          title: '云朵字卡',
          icon: '☁️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        },
        'sticker-materials': {
          key: 'sticker-materials',
          title: '贴纸素材',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'digital-human-speech': {
          key: 'digital-human-speech',
          title: '数字人说话',
          icon: '🧑‍🎤',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'comic-strip': {
          key: 'comic-strip',
          title: '连环画',
          icon: '🎞️',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'quick-designer': {
          key: 'quick-designer',
          title: '快速设计师',
          icon: '速',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'children-simple-drawings': {
          key: 'children-simple-drawings',
          title: '儿童简笔画',
          icon: '🖍️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        },
        'ai-video': {
          key: 'ai-video',
          title: 'AI视频',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'audio-video-text-converter': {
          key: 'audio-video-text-converter',
          title: '音视频文本互转',
          icon: '🔄',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'ppt-courseware': {
          key: 'ppt-courseware',
          title: 'PPT课件',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      };

      // 注入缺失的工具配置与ID
      let changed = false;
      teachingDesignToolIds.forEach(id => {
        if (!addedAITools.includes(id)) {
          addedAITools.push(id);
          changed = true;
        }
        if (!aiToolsConfig[id]) {
          aiToolsConfig[id] = defaultConfigs[id];
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem('ai-tools-config', JSON.stringify(aiToolsConfig));
        localStorage.setItem('added-ai-tools-to-panel', JSON.stringify(addedAITools));
        console.log('教学设计工具默认注入完成:', teachingDesignToolIds);
      }

      // 仅显示教学设计相关工具
      const teachingDesignCards = teachingDesignToolIds.map(id => {
        const config = aiToolsConfig[id];
        if (config) {
          return {
            key: id,
            title: config.title,
            icon: config.icon,
            gradient: config.gradient,
            color: config.color,
            isAITool: true
          };
        }
        return null;
      }).filter(Boolean);

      console.log('教学设计分类，返回的卡片:', teachingDesignCards);
      return teachingDesignCards;
    }

    // 如果是学情分析分类，默认仅显示学情分析相关智能工具（不注入全局localStorage）
    if (category === 'learning_analytics') {
      const learningAnalyticsToolIds = [
        // 班主任
        'classmaster-performance-dashboard',
        'classmaster-passline-analysis',
        'classmaster-student-honesty-analysis',
        'classmaster-class-exam-analysis',
        // 学科老师
        'subject-unit-small-tests',
        'subject-exam-paper-analysis',
        'subject-student-performance-analysis',
        'subject-historical-exam-analysis',
        // 年级组
        'grade-multi-class-exam-analysis',
        'grade-passline-analysis',
        'grade-historical-exam-analysis',
        // 联考分析（不同版本）
        'league-exam-performance-analysis',
        'league-exam-performance-plus',
        'league-exam-performance-pro',
        'league-exam-performance-ultra'
      ];

      const defaultConfigs = {
        'classmaster-performance-dashboard': {
          key: 'classmaster-performance-dashboard',
          title: '成绩数据看板',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        },
        'classmaster-passline-analysis': {
          key: 'classmaster-passline-analysis',
          title: '高中新上线分析',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'classmaster-student-honesty-analysis': {
          key: 'classmaster-student-honesty-analysis',
          title: '学生诚卷分析',
          icon: '🧭',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#9254de'
        },
        'classmaster-class-exam-analysis': {
          key: 'classmaster-class-exam-analysis',
          title: '班级考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'subject-unit-small-tests': {
          key: 'subject-unit-small-tests',
          title: '单元小测分析',
          icon: '🧪',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'subject-exam-paper-analysis': {
          key: 'subject-exam-paper-analysis',
          title: '试卷学科分析',
          icon: '📄',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'subject-student-performance-analysis': {
          key: 'subject-student-performance-analysis',
          title: '学科薄弱生分析',
          icon: '📉',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        },
        'subject-historical-exam-analysis': {
          key: 'subject-historical-exam-analysis',
          title: '学科历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'grade-multi-class-exam-analysis': {
          key: 'grade-multi-class-exam-analysis',
          title: '年级多班考试分析',
          icon: '🏫',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        },
        'grade-passline-analysis': {
          key: 'grade-passline-analysis',
          title: '年级及科目过线分析',
          icon: '📈',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#52c41a'
        },
        'grade-historical-exam-analysis': {
          key: 'grade-historical-exam-analysis',
          title: '年级历次考试分析',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'league-exam-performance-analysis': {
          key: 'league-exam-performance-analysis',
          title: '联考成绩分析',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'league-exam-performance-plus': {
          key: 'league-exam-performance-plus',
          title: '联考成绩分析Plus',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'league-exam-performance-pro': {
          key: 'league-exam-performance-pro',
          title: '联考成绩分析Pro',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'league-exam-performance-ultra': {
          key: 'league-exam-performance-ultra',
          title: '联考成绩分析Ultra',
          icon: '🏆',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      };

      const learningCards = learningAnalyticsToolIds.map(id => defaultConfigs[id]).filter(Boolean).map(config => ({
        key: config.key,
        title: config.title,
        icon: config.icon,
        gradient: config.gradient,
        color: config.color,
        isAITool: true
      }));

      console.log('学情分析分类，返回的卡片:', learningCards);
      return learningCards;
    }

    // 如果是教育课题分类，默认仅显示教育课题相关智能工具（不注入全局存储）
    if (category === 'educational_topics') {
      const educationalTopicToolIds = [
        // 课题申报
        'topic-selection-recommendation',
        'topic-selection-evaluation',
        'topic-application-guidance',
        'topic-subdivision-guidance',
        // 课题研究
        'topic-technical-roadmap',
        'opening-report-guidance',
        'midterm-report-guidance',
        'final-report-guidance',
        'topic-paper-guidance',
        // 教学成果奖
        'teaching-achievement-application',
        'teaching-achievement-report',
        'teaching-achievement-materials'
      ];

      const defaultConfigs = {
        'topic-selection-recommendation': {
          key: 'topic-selection-recommendation',
          title: '课题选题推荐',
          icon: '荐',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1677ff'
        },
        'topic-selection-evaluation': {
          key: 'topic-selection-evaluation',
          title: '课题选题评估',
          icon: '评',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        },
        'topic-application-guidance': {
          key: 'topic-application-guidance',
          title: '课题申报指导',
          icon: '申',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        },
        'topic-subdivision-guidance': {
          key: 'topic-subdivision-guidance',
          title: '课题细分指导',
          icon: '细',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'topic-technical-roadmap': {
          key: 'topic-technical-roadmap',
          title: '课题技术路线图',
          icon: '图',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#389e0d'
        },
        'opening-report-guidance': {
          key: 'opening-report-guidance',
          title: '开题报告指导',
          icon: '开',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'midterm-report-guidance': {
          key: 'midterm-report-guidance',
          title: '中期报告指导',
          icon: '中',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'final-report-guidance': {
          key: 'final-report-guidance',
          title: '结题报告指导',
          icon: '结',
          gradient: 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)',
          color: '#d4b106'
        },
        'topic-paper-guidance': {
          key: 'topic-paper-guidance',
          title: '课题论文指导',
          icon: '文',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1677ff'
        },
        'teaching-achievement-application': {
          key: 'teaching-achievement-application',
          title: '教学成果申报书',
          icon: '申',
          gradient: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
          color: '#f5222d'
        },
        'teaching-achievement-report': {
          key: 'teaching-achievement-report',
          title: '教学成果报告',
          icon: '报',
          gradient: 'linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%)',
          color: '#2f54eb'
        },
        'teaching-achievement-materials': {
          key: 'teaching-achievement-materials',
          title: '教学成果支撑材料',
          icon: '材',
          gradient: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          color: '#389e0d'
        }
      };

      const educationalCards = educationalTopicToolIds
        .map(id => defaultConfigs[id])
        .filter(Boolean)
        .map(config => ({
          key: config.key,
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        }));

      console.log('教育课题分类，返回的卡片:', educationalCards);
      return educationalCards;
    }

    // 如果是课堂融合分类，默认仅显示课堂融合相关智能工具（不注入全局存储）
    if (category === 'classroom_integration') {
      const classroomIntegrationToolIds = [
        'ai-picture-book',
        'cloud-word-cards',
        'sticker-materials',
        'digital-human-speech',
        'comic-strip',
        'quick-designer',
        'children-simple-drawings',
        'ai-video',
        'audio-video-text-converter',
        'ppt-courseware'
      ];

      const defaultConfigs = {
        'ai-picture-book': {
          key: 'ai-picture-book',
          title: 'AI绘本',
          icon: '📖',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'cloud-word-cards': {
          key: 'cloud-word-cards',
          title: '云朵字卡',
          icon: '☁️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        },
        'sticker-materials': {
          key: 'sticker-materials',
          title: '贴纸素材',
          icon: '🎯',
          gradient: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          color: '#722ed1'
        },
        'digital-human-speech': {
          key: 'digital-human-speech',
          title: '数字人讲课',
          icon: '🧑‍🎤',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'comic-strip': {
          key: 'comic-strip',
          title: '连环画',
          icon: '🎞️',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'quick-designer': {
          key: 'quick-designer',
          title: '快手设计师',
          icon: '速',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
          color: '#1890ff'
        },
        'children-simple-drawings': {
          key: 'children-simple-drawings',
          title: '儿童简笔画',
          icon: '🖍️',
          gradient: 'linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)',
          color: '#40a9ff'
        },
        'ai-video': {
          key: 'ai-video',
          title: 'AI视频',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        },
        'audio-video-text-converter': {
          key: 'audio-video-text-converter',
          title: '音视频文本互转',
          icon: '🔄',
          gradient: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
          color: '#13c2c2'
        },
        'ppt-courseware': {
          key: 'ppt-courseware',
          title: 'PPT课件',
          icon: '📊',
          gradient: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
          color: '#fa8c16'
        }
      };

      const integrationCards = classroomIntegrationToolIds
        .map(id => defaultConfigs[id])
        .filter(Boolean)
        .map(config => ({
          key: config.key,
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        }));

      console.log('课堂融合分类，返回的卡片:', integrationCards);
      return integrationCards;
    }
    // 其他分类返回所有工具（保持原有逻辑）
    const defaultCards = OPERATION_CARDS.filter(card => card.key !== 'addTool');
    
    // 获取AI工具配置
  const aiToolsConfig = JSON.parse(localStorage.getItem('ai-tools-config') || '{}');
  const addedAITools = JSON.parse(localStorage.getItem('added-ai-tools-to-panel') || '[]');
    
    // 创建AI工具卡片
    const aiToolCards = addedAITools.map(toolId => {
      const config = aiToolsConfig[toolId];
      if (config) {
        const aiCard = {
          key: toolId,
          title: config.title,
          icon: config.icon,
          gradient: config.gradient,
          color: config.color,
          isAITool: true
        };
        return aiCard;
      }
      return null;
    }).filter(Boolean);
    
    const allCards = [...defaultCards, ...aiToolCards];
    
    // 确保知识图谱在第一位，试题在第二位，学习计划在第三位，阅卷工具在第四位
    const knowledgeGraphCard = allCards.find(card => card.key === 'knowledge-graph');
    const questionCard = allCards.find(card => card.key === 'question');
    const learningPlanCard = allCards.find(card => card.key === 'learning-plan');
    const gradingCard = allCards.find(card => card.key === 'grading');
    
    // 分离AI工具卡片和其他基础工具卡片
    const aiCards = allCards.filter(card => card.isAITool);
    const otherBasicCards = allCards.filter(card => 
      card.key !== 'knowledge-graph' && 
      card.key !== 'question' &&
      card.key !== 'learning-plan' &&
      card.key !== 'grading' &&
      !card.isAITool
    );
    
    const orderedCards = [];
    if (knowledgeGraphCard) orderedCards.push(knowledgeGraphCard);
    if (questionCard) orderedCards.push(questionCard);
    if (learningPlanCard) orderedCards.push(learningPlanCard);
    if (gradingCard) orderedCards.push(gradingCard);
    
    // AI工具卡片优先显示在基础工具之后，其他工具之前
    orderedCards.push(...aiCards);
    orderedCards.push(...otherBasicCards);
    
    // 确保返回的工具数量不超过18个
    return orderedCards.slice(0, 18);
  };

  // 可见工具卡片状态 - 初始化默认工具
  const [visibleCards, setVisibleCards] = useState(() => {
    return getFilteredCards(noteCategory);
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  
  // 加载状态管理
  const [loadingCards, setLoadingCards] = useState([]);
  
  // 添加加载状态
  const addLoadingCard = (cardKey) => {
    setLoadingCards(prev => [...prev, cardKey]);
  };
  
  // 移除加载状态
  const removeLoadingCard = (cardKey) => {
    setLoadingCards(prev => prev.filter(key => key !== cardKey));
  };
  
  // 监听AI工具添加事件，实时更新操作面板
  useEffect(() => {
    const handleAIToolsChange = () => {
      setVisibleCards(getFilteredCards(noteCategory));
    };
    
    // 监听 storage 事件
    window.addEventListener('storage', handleAIToolsChange);
    // 监听自定义事件
    window.addEventListener('aiToolsChanged', handleAIToolsChange);
    
    return () => {
      window.removeEventListener('storage', handleAIToolsChange);
      window.removeEventListener('aiToolsChanged', handleAIToolsChange);
    };
  }, [noteCategory]);

  // 当分类变化时，更新可见工具卡片
  useEffect(() => {
    setVisibleCards(getFilteredCards(noteCategory));
  }, [noteCategory]);
  
  // 练习模式相关状态
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // 学习计划查看器状态
  const [planViewMode, setPlanViewMode] = useState('summary');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // 阅卷查看器状态
  const [gradingViewMode, setGradingViewMode] = useState('summary');
  const [selectedStudent, setSelectedStudent] = useState(null);

  return {
    visibleCards,
    setVisibleCards,
    isEditMode,
    setIsEditMode,
    showCardSelector,
    setShowCardSelector,
    loadingCards,
    addLoadingCard,
    removeLoadingCard,
    practiceMode,
    setPracticeMode,
    userAnswers,
    setUserAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    showResults,
    setShowResults,
    score,
    setScore,
    planViewMode,
    setPlanViewMode,
    selectedDate,
    setSelectedDate,
    gradingViewMode,
    setGradingViewMode,
    selectedStudent,
    setSelectedStudent
  };
};

// 模态框状态管理Hook
export const useModalState = () => {
  const [questionConfigVisible, setQuestionConfigVisible] = useState(false);
  const [learningPlanModalVisible, setLearningPlanModalVisible] = useState(false);
  const [reportSelectionVisible, setReportSelectionVisible] = useState(false);
  const [showThemeSelectModal, setShowThemeSelectModal] = useState(false);
  const [classroomEvaluationVisible, setClassroomEvaluationVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentActionType, setCurrentActionType] = useState(null);

  return {
    questionConfigVisible,
    setQuestionConfigVisible,
    learningPlanModalVisible,
    setLearningPlanModalVisible,
    reportSelectionVisible,
    setReportSelectionVisible,
    showThemeSelectModal,
    setShowThemeSelectModal,
    classroomEvaluationVisible,
    setClassroomEvaluationVisible,
    currentRecord,
    setCurrentRecord,
    currentActionType,
    setCurrentActionType
  };
};

// 数据源检查Hook
export const useSourceDataCheck = ({ uploadedFiles, addedTexts, courseVideos, links }) => {
  const hasSourceData = Boolean(
    (uploadedFiles && uploadedFiles.length > 0) ||
    (addedTexts && addedTexts.length > 0) ||
    (courseVideos && courseVideos.length > 0) ||
    (links && links.length > 0)
  );

  const sourceInfo = {
    total: (uploadedFiles?.length || 0) + (addedTexts?.length || 0) + (courseVideos?.length || 0) + (links?.length || 0),
    details: hasSourceData ? 
      `已添加${(uploadedFiles?.length || 0)}个文件、${(addedTexts?.length || 0)}段文本、${(courseVideos?.length || 0)}个视频、${(links?.length || 0)}个链接` : 
      '暂无数据源'
  };

  return {
    hasSourceData,
    sourceInfo
  };
};