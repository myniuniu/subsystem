// 资源推荐服务
// 基于用户输入的特征和需求，智能推荐相关资源

import { generateMockResourceData } from '../data/resourceLibraryMockData.js';
import { ResourceType, DifficultyLevel, TargetAudience } from '../types/resourceLibrary.js';

class ResourceRecommendationService {
  constructor() {
    this.resources = [];
    this.categories = [];
    this.initializeData();
  }

  // 初始化数据
  initializeData() {
    const mockData = generateMockResourceData();
    this.resources = mockData.resources;
    this.categories = mockData.categories;
  }

  // 主要推荐方法 - 根据用户输入推荐资源
  async recommendResources(userInput, options = {}) {
    try {
      // 解析用户输入的特征
      const features = this.parseUserInput(userInput);
      
      // 基于特征匹配资源
      const matchedResources = this.matchResourcesByFeatures(features);
      
      // 计算相关性得分并排序
      const scoredResources = this.calculateRelevanceScores(matchedResources, features);
      
      // 返回推荐结果
      const recommendations = scoredResources
        .sort((a, b) => b.score - a.score)
        .slice(0, options.limit || 10)
        .map(item => ({
          resource: item.resource,
          score: item.score,
          reasons: item.reasons
        }));

      return {
        success: true,
        data: {
          recommendations,
          totalMatched: matchedResources.length,
          searchFeatures: features,
          suggestions: this.generateSearchSuggestions(features)
        }
      };
    } catch (error) {
      console.error('资源推荐失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 解析用户输入，提取关键特征
  parseUserInput(input) {
    const features = {
      keywords: [],
      resourceTypes: [],
      difficulty: null,
      targetAudience: [],
      categories: [],
      topics: []
    };

    const inputLower = input.toLowerCase();

    // 提取资源类型关键词
    const typeKeywords = {
      [ResourceType.VIDEO]: ['视频', '录像', '观看', '播放', '影片'],
      [ResourceType.DOCUMENT]: ['文档', '资料', '文件', '手册', '指南', '说明'],
      [ResourceType.GUIDE]: ['指导', '教程', '步骤', '方法', '技巧'],
      [ResourceType.CASE_STUDY]: ['案例', '实例', '例子', '研究', '分析'],
      [ResourceType.TOOL]: ['工具', '软件', '应用', '系统', '平台'],
      [ResourceType.AUDIO]: ['音频', '录音', '听', '声音', '播客']
    };

    Object.entries(typeKeywords).forEach(([type, keywords]) => {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        features.resourceTypes.push(type);
      }
    });

    // 提取难度等级
    if (inputLower.includes('简单') || inputLower.includes('基础') || inputLower.includes('入门')) {
      features.difficulty = DifficultyLevel.EASY;
    } else if (inputLower.includes('困难') || inputLower.includes('高级') || inputLower.includes('深入')) {
      features.difficulty = DifficultyLevel.HARD;
    } else if (inputLower.includes('中等') || inputLower.includes('中级')) {
      features.difficulty = DifficultyLevel.MEDIUM;
    }

    // 提取目标受众
    const audienceKeywords = {
      [TargetAudience.TEACHER]: ['教师', '老师', '授课'],
      [TargetAudience.CLASS_TEACHER]: ['班主任', '班级管理'],
      [TargetAudience.COUNSELOR]: ['心理', '咨询', '辅导'],
      [TargetAudience.PARENT]: ['家长', '父母', '家庭'],
      [TargetAudience.PRINCIPAL]: ['校长', '管理', '领导'],
      [TargetAudience.STUDENT]: ['学生', '学习者', '孩子']
    };

    Object.entries(audienceKeywords).forEach(([audience, keywords]) => {
      if (keywords.some(keyword => inputLower.includes(keyword))) {
        features.targetAudience.push(audience);
      }
    });

    // 提取主题关键词
    const topicKeywords = [
      '心理健康', '焦虑', '抑郁', '情绪', '行为',
      '教学方法', '课堂管理', '评价', '考试',
      '技术', '数字化', 'AI', '虚拟现实', 'VR',
      '家庭教育', '亲子', '沟通', '关系',
      '学校管理', '危机', '制度', '文化'
    ];

    topicKeywords.forEach(topic => {
      if (inputLower.includes(topic)) {
        features.topics.push(topic);
        features.keywords.push(topic);
      }
    });

    // 提取其他关键词（分词简化版）
    const words = input.split(/[\s，。！？,.\!?]+/).filter(word => word.length > 1);
    features.keywords.push(...words);

    return features;
  }

  // 基于特征匹配资源
  matchResourcesByFeatures(features) {
    return this.resources.filter(resource => {
      // 检查资源类型匹配
      if (features.resourceTypes.length > 0 && 
          !features.resourceTypes.includes(resource.resourceType)) {
        return false;
      }

      // 检查难度等级匹配
      if (features.difficulty && resource.difficulty !== features.difficulty) {
        return false;
      }

      // 检查目标受众匹配
      if (features.targetAudience.length > 0) {
        const hasAudienceMatch = features.targetAudience.some(audience => 
          resource.targetAudience.includes(audience)
        );
        if (!hasAudienceMatch) {
          return false;
        }
      }

      return true;
    });
  }

  // 计算相关性得分
  calculateRelevanceScores(resources, features) {
    return resources.map(resource => {
      let score = 0;
      const reasons = [];

      // 标题匹配得分
      const titleMatches = features.keywords.filter(keyword => 
        resource.title.toLowerCase().includes(keyword.toLowerCase())
      );
      if (titleMatches.length > 0) {
        score += titleMatches.length * 10;
        reasons.push(`标题包含关键词: ${titleMatches.join(', ')}`);
      }

      // 描述匹配得分
      const descMatches = features.keywords.filter(keyword => 
        resource.description.toLowerCase().includes(keyword.toLowerCase())
      );
      if (descMatches.length > 0) {
        score += descMatches.length * 5;
        reasons.push(`描述包含关键词: ${descMatches.join(', ')}`);
      }

      // 标签匹配得分
      const tagMatches = features.keywords.filter(keyword => 
        resource.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      );
      if (tagMatches.length > 0) {
        score += tagMatches.length * 8;
        reasons.push(`标签匹配: ${tagMatches.join(', ')}`);
      }

      // 资源类型匹配得分
      if (features.resourceTypes.includes(resource.resourceType)) {
        score += 15;
        reasons.push(`资源类型匹配: ${this.getResourceTypeName(resource.resourceType)}`);
      }

      // 目标受众匹配得分
      const audienceMatches = features.targetAudience.filter(audience => 
        resource.targetAudience.includes(audience)
      );
      if (audienceMatches.length > 0) {
        score += audienceMatches.length * 12;
        reasons.push(`目标受众匹配: ${audienceMatches.join(', ')}`);
      }

      // 难度等级匹配得分
      if (features.difficulty === resource.difficulty) {
        score += 10;
        reasons.push(`难度等级匹配: ${this.getDifficultyName(resource.difficulty)}`);
      }

      // 热门程度加分
      if (resource.stats) {
        score += Math.min(resource.stats.views / 100, 5);
        score += Math.min(resource.stats.rating * 2, 10);
      }

      return {
        resource,
        score: Math.round(score),
        reasons
      };
    });
  }

  // 生成搜索建议
  generateSearchSuggestions(features) {
    const suggestions = [];

    if (features.resourceTypes.length === 0) {
      suggestions.push('尝试指定资源类型，如"视频教程"、"文档资料"');
    }

    if (features.targetAudience.length === 0) {
      suggestions.push('可以指定目标受众，如"教师"、"家长"、"学生"');
    }

    if (!features.difficulty) {
      suggestions.push('可以指定难度等级，如"简单"、"中等"、"困难"');
    }

    if (features.keywords.length < 2) {
      suggestions.push('尝试添加更多关键词来获得更精准的推荐');
    }

    return suggestions;
  }

  // 获取资源类型名称
  getResourceTypeName(type) {
    const typeNames = {
      [ResourceType.GUIDE]: '指导手册',
      [ResourceType.VIDEO]: '视频教程',
      [ResourceType.AUDIO]: '音频资源',
      [ResourceType.DOCUMENT]: '文档资料',
      [ResourceType.TOOL]: '工具软件',
      [ResourceType.CASE_STUDY]: '案例研究'
    };
    return typeNames[type] || type;
  }

  // 获取难度等级名称
  getDifficultyName(difficulty) {
    const difficultyNames = {
      [DifficultyLevel.EASY]: '简单',
      [DifficultyLevel.MEDIUM]: '中等',
      [DifficultyLevel.HARD]: '困难'
    };
    return difficultyNames[difficulty] || difficulty;
  }

  // 根据分类获取资源
  async getResourcesByCategory(categoryId) {
    try {
      const categoryResources = this.resources.filter(resource => 
        resource.category === categoryId
      );

      return {
        success: true,
        data: categoryResources
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 获取热门推荐
  async getPopularRecommendations(limit = 5) {
    try {
      const popularResources = this.resources
        .filter(resource => resource.stats)
        .sort((a, b) => {
          const scoreA = a.stats.views + a.stats.likes * 10 + a.stats.rating * 20;
          const scoreB = b.stats.views + b.stats.likes * 10 + b.stats.rating * 20;
          return scoreB - scoreA;
        })
        .slice(0, limit);

      return {
        success: true,
        data: popularResources
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 创建单例实例
const resourceRecommendationService = new ResourceRecommendationService();

export default resourceRecommendationService;