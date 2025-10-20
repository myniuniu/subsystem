import { message } from 'antd';
import { TIME_REGEX, MATERIAL_ICONS, OPERATION_TYPES, MARK_COLORS, MARK_NAMES, MARK_ICONS } from '../constants/noteEditConstants';

// 获取直播流状态（live / scheduled / ended）
export const getLiveStreamStatus = (stream) => {
  try {
    if (!stream || typeof stream !== 'object') return 'scheduled';

    // 1) 优先使用显式状态字段
    const rawStatus = String(stream.status || stream.liveStatus || stream.state || '')
      .trim()
      .toLowerCase();
    if (['live', 'streaming', 'on_air', 'ongoing'].includes(rawStatus)) return 'live';
    if (['scheduled', 'upcoming', 'pending', 'not_started', 'ready'].includes(rawStatus)) return 'scheduled';
    if (['ended', 'finished', 'completed', 'offline'].includes(rawStatus)) return 'ended';

    // 2) 时间推断：支持 schedule/date + startTime/endTime 的组合
    const now = new Date();
    const dateStr = stream?.schedule?.date || stream?.liveDate || stream?.date || null;
    const startStr = stream?.schedule?.start || stream?.schedule?.startTime || stream?.startTime || stream?.start_at || stream?.startAt || null;
    const endStr = stream?.schedule?.end || stream?.schedule?.endTime || stream?.endTime || stream?.end_at || stream?.endAt || null;

    const parseDateTime = (d, t) => {
      if (d && t) {
        // 例如：'2025-01-28' + '19:00'
        return new Date(`${d} ${t}`);
      }
      if (t) return new Date(t);
      if (d) return new Date(d);
      return null;
    };

    const startTime = parseDateTime(dateStr, startStr);
    const endTime = parseDateTime(dateStr, endStr);

    if (startTime && now < startTime) return 'scheduled';
    if (startTime && endTime) {
      if (now >= startTime && now <= endTime) return 'live';
      if (now > endTime) return 'ended';
    }
    if (startTime && !endTime && now >= startTime) return 'live';

    // 3) 回退缺省：按“未开始”处理
    return 'scheduled';
  } catch {
    return 'scheduled';
  }
};

// 时间格式化函数
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 将时间文本转换为超链接
export const convertTimeToLinks = (content) => {
  return content.replace(TIME_REGEX, (match, minutes, seconds, hours) => {
    const totalSeconds = hours ? 
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) :
      parseInt(minutes) * 60 + parseInt(seconds);
    
    return `<a href="#" onclick="handleTimeClick(${totalSeconds})" style="color: #1890ff; text-decoration: underline; cursor: pointer;">${match}</a>`;
  });
};

// 获取操作记录图标
export const getOperationIcon = (type) => {
  return MATERIAL_ICONS[type] || '📄';
};

// 生成基于实际来源的摘要内容
export const generateSummaryContent = (uploadedFiles, links, addedTexts, courseVideos, organizationalCourses) => {
  const allSources = [];
  
  if (uploadedFiles.length > 0) {
    allSources.push(`文档资料：${uploadedFiles.map(file => file.name).join('、')}`);
  }
  
  if (links.length > 0) {
    allSources.push(`网站链接：${links.map(link => link.title || link.url).join('、')}`);
  }
  
  if (addedTexts.length > 0) {
    allSources.push(`文本内容：${addedTexts.map(text => text.title).join('、')}`);
  }
  
  if (courseVideos.length > 0) {
    allSources.push(`视频资源：${courseVideos.map(video => video.title).join('、')}`);
  }
  
  if (organizationalCourses.length > 0) {
    allSources.push(`组织培训：${organizationalCourses.map(course => course.title).join('、')}`);
  }
  
  if (allSources.length === 0) {
    return '暂无资料来源，请先添加文档、链接、文本或视频资源，系统将基于这些内容自动生成智能摘要。';
  }
  
  const sourceTypes = [];
  if (uploadedFiles.length > 0) sourceTypes.push('文档资料');
  if (links.length > 0) sourceTypes.push('网站资源');
  if (addedTexts.length > 0) sourceTypes.push('文本内容');
  if (courseVideos.length > 0) sourceTypes.push('视频教程');
  if (organizationalCourses.length > 0) sourceTypes.push('组织培训');
  
  return `已收集的资料包含${sourceTypes.join('、')}等多种类型的信息源。${allSources.join('；')}。这些资料为您提供了全面的信息基础，涵盖了相关主题的多个维度和视角，有助于深入理解和学习相关内容。`;
};

// 生成智能笔记
export const generateSmartNote = (material, type) => {
  let smartNote = {
    id: Date.now(),
    type: type,
    title: material.title || material.name,
    originalData: material,
    summary: '',
    keyPoints: [],
    tags: [],
    createdAt: new Date().toLocaleString()
  };

  switch (type) {
    case 'file':
      smartNote.summary = `文件资料：${material.name}，类型：${material.type || '未知'}。建议进一步分析文件内容以提取关键信息。`;
      smartNote.keyPoints = ['文件已上传', '待内容分析', '可用于AI问答'];
      smartNote.tags = ['文件', material.type || '未知类型'];
      break;
    
    case 'video':
      smartNote.summary = `视频资料：${material.title}。视频内容可能包含重要的学习材料，建议观看并记录要点。`;
      smartNote.keyPoints = ['视频已添加', '包含音视频内容', '适合深度学习'];
      smartNote.tags = ['视频', '学习资料'];
      if (material.url.includes('bilibili.com')) {
        smartNote.tags.push('B站');
      } else if (material.url.includes('youtube.com')) {
        smartNote.tags.push('YouTube');
      }
      break;
    
    case 'link':
      smartNote.summary = `网站链接：${material.title}。网页内容可能包含有价值的信息，建议浏览并提取关键内容。`;
      smartNote.keyPoints = ['网站已添加', '可在线访问', '内容待分析'];
      smartNote.tags = ['网站', '在线资源'];
      break;
    
    case 'text':
      const wordCount = material.content.length;
      const hasMarkdown = /[*_`#\[\]]/g.test(material.content);
      smartNote.summary = `文字内容：${material.title}，共${wordCount}字。${hasMarkdown ? '包含格式化内容，' : ''}可直接用于AI分析和问答。`;
      smartNote.keyPoints = [
        `文字长度：${wordCount}字`,
        hasMarkdown ? '包含Markdown格式' : '纯文本内容',
        '可直接分析'
      ];
      smartNote.tags = ['文字', hasMarkdown ? 'Markdown' : '纯文本'];
      break;
    
    case 'course':
      smartNote.summary = `组织培训课程：${material.title}。${material.description || ''}培训类型：${material.trainingType}，学习时长：${material.duration}。`;
      smartNote.keyPoints = [
        `培训类型：${material.trainingType}`,
        `学习时长：${material.duration}`,
        `课程状态：${material.status}`,
        '来源：组织培训'
      ];
      smartNote.tags = ['组织培训', material.trainingType, '课程'];
      break;
  }

  return smartNote;
};

// 创建新的场景模拟
export const createNewScenario = (uploadedFiles, addedTexts) => {
  const scenarioTemplates = [
    {
      title: '实战操作演练',
      description: '基于您的资料内容，设计实际操作场景，让学员在模拟环境中练习关键技能',
      icon: '⚡',
      tags: ['实战演练', '技能训练', '操作规范'],
      applicableScenes: ['技能培训', '标准化操作', '质量控制']
    },
    {
      title: '问题解决训练',
      description: '模拟常见问题和挑战情况，训练学员的分析判断和解决问题的能力',
      icon: '🧩',
      tags: ['问题解决', '逻辑思维', '应变能力'],
      applicableScenes: ['能力提升', '思维训练', '实际应用']
    },
    {
      title: '团队协作场景',
      description: '设计需要多人配合的工作场景，提升团队协作和沟通协调能力',
      icon: '👥',
      tags: ['团队协作', '沟通技巧', '协调配合'],
      applicableScenes: ['团队建设', '协作训练', '沟通提升']
    },
    {
      title: '客户互动模拟',
      description: '模拟与客户的各种互动场景，提升服务意识和客户满意度',
      icon: '🤝',
      tags: ['客户服务', '沟通技巧', '服务质量'],
      applicableScenes: ['服务培训', '客户关系', '满意度提升']
    },
    {
      title: '创新思维训练',
      description: '通过开放性场景设计，激发学员的创新思维和创造力',
      icon: '💡',
      tags: ['创新思维', '创造力', '思维拓展'],
      applicableScenes: ['创新培训', '思维开发', '能力拓展']
    }
  ];

  const randomTemplate = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
  
  let personalizedTitle = randomTemplate.title;
  let personalizedDescription = randomTemplate.description;
  
  if (uploadedFiles.length > 0) {
    const fileKeywords = uploadedFiles.map(file => file.name).join('');
    if (fileKeywords.includes('火锅') || fileKeywords.includes('美食')) {
      personalizedTitle = `餐饮${randomTemplate.title}`;
      personalizedDescription = personalizedDescription.replace('您的资料内容', '餐饮行业相关内容');
    } else if (fileKeywords.includes('培训') || fileKeywords.includes('教学')) {
      personalizedTitle = `培训${randomTemplate.title}`;
      personalizedDescription = personalizedDescription.replace('您的资料内容', '培训教学相关内容');
    }
  }
  
  if (addedTexts.length > 0) {
    const textKeywords = addedTexts.map(text => text.content).join('');
    if (textKeywords.includes('管理') || textKeywords.includes('运营')) {
      personalizedTitle = `管理${randomTemplate.title}`;
      personalizedDescription = personalizedDescription.replace('学员', '管理人员');
    }
  }

  return {
    id: `ai-created-${Date.now()}`,
    title: personalizedTitle,
    description: personalizedDescription,
    icon: randomTemplate.icon,
    tags: [...randomTemplate.tags, 'AI生成'],
    applicableScenes: randomTemplate.applicableScenes
  };
};

// 获取推荐场景模拟
export const getRecommendedScenarios = (uploadedFiles, links, addedTexts, courseVideos) => {
  const scenarios = [];
  
  if (uploadedFiles.some(file => file.name.includes('火锅') || file.name.includes('美食'))) {
    scenarios.push({
      id: 'cooking-scenario',
      title: '餐饮服务场景模拟',
      description: '模拟餐厅服务流程，包括点餐、制作、上菜等环节的实际操作',
      icon: '🍽️',
      tags: ['餐饮服务', '客户接待', '流程管理'],
      applicableScenes: ['餐厅培训', '服务标准化', '客户体验优化']
    });
    
    scenarios.push({
      id: 'cooking-training',
      title: '烹饪技能培训',
      description: '通过实际操作演练，掌握火锅制作的关键技巧和标准流程',
      icon: '👨‍🍳',
      tags: ['技能培训', '标准化操作', '质量控制'],
      applicableScenes: ['厨师培训', '新员工入职', '技能考核']
    });
  }
  
  if (links.some(link => link.title.includes('美食') || link.url.includes('food'))) {
    scenarios.push({
      id: 'marketing-scenario',
      title: '美食营销推广模拟',
      description: '模拟美食产品的线上线下营销推广活动，包括社交媒体运营、活动策划等',
      icon: '📱',
      tags: ['营销推广', '社交媒体', '品牌建设'],
      applicableScenes: ['市场推广', '品牌宣传', '客户获取']
    });
  }
  
  if (addedTexts.some(text => text.content.includes('小吃') || text.content.includes('美食'))) {
    scenarios.push({
      id: 'cultural-experience',
      title: '文化体验场景',
      description: '设计沉浸式的地方美食文化体验活动，让参与者深入了解美食背后的文化内涵',
      icon: '🏮',
      tags: ['文化传承', '体验设计', '教育培训'],
      applicableScenes: ['文化教育', '旅游体验', '团队建设']
    });
  }
  
  if (courseVideos.some(video => video.title.includes('教程') || video.title.includes('制作'))) {
    scenarios.push({
      id: 'skill-assessment',
      title: '技能评估与认证',
      description: '建立标准化的技能评估体系，通过实际操作考核员工的专业技能水平',
      icon: '🏆',
      tags: ['技能评估', '认证体系', '标准化'],
      applicableScenes: ['员工考核', '技能认证', '培训效果评估']
    });
  }
  
  // 通用场景推荐
  scenarios.push({
    id: 'team-collaboration',
    title: '团队协作训练',
    description: '通过模拟真实工作场景，提升团队成员之间的协作能力和沟通效率',
    icon: '🤝',
    tags: ['团队协作', '沟通技巧', '效率提升'],
    applicableScenes: ['团队建设', '新员工融入', '跨部门协作']
  });
  
  scenarios.push({
    id: 'customer-service',
    title: '客户服务场景',
    description: '模拟各种客户服务情况，训练员工的应变能力和服务技巧',
    icon: '💬',
    tags: ['客户服务', '应变能力', '服务质量'],
    applicableScenes: ['客服培训', '投诉处理', '服务标准化']
  });
  
  scenarios.push({
    id: 'crisis-management',
    title: '应急处理演练',
    description: '模拟突发情况和紧急事件，训练员工的应急处理能力和危机管理技巧',
    icon: '🚨',
    tags: ['应急处理', '危机管理', '安全培训'],
    applicableScenes: ['安全培训', '应急演练', '风险管控']
  });
  
  return scenarios;
};

// 初始化可用工具数据
export const initializeAvailableTools = () => {
  const tools = [
    {
      id: 'data_visualization',
      name: '数据可视化',
      icon: '📈',
      category: 'data_analysis',
      description: '创建互动式数据图表和可视化报告',
      tags: ['数据', '图表', '分析']
    },
    {
      id: 'statistical_analysis',
      name: '统计分析',
      icon: '📉',
      category: 'data_analysis',
      description: '进行高级统计分析和数据挖掘',
      tags: ['统计', '分析', '数据挖掘']
    },
    {
      id: 'survey_tool',
      name: '问卷调查',
      icon: '📋',
      category: 'data_analysis',
      description: '设计和发布在线问卷，收集和分析数据',
      tags: ['问卷', '调查', '数据收集']
    },
    {
      id: 'team_collaboration',
      name: '团队协作',
      icon: '🤝',
      category: 'collaboration',
      description: '实时协作编辑和项目管理平台',
      tags: ['协作', '团队', '项目管理']
    },
    {
      id: 'video_conference',
      name: '视频会议',
      icon: '📹',
      category: 'collaboration',
      description: '高清视频通话和在线会议工具',
      tags: ['视频', '会议', '通话']
    },
    {
      id: 'whiteboard',
      name: '在线白板',
      icon: '🎨',
      category: 'collaboration',
      description: '多人实时协作的数字白板',
      tags: ['白板', '绘图', '头脑风暴']
    },
    {
      id: 'flashcard',
      name: '闪卡记忆',
      icon: '🃏',
      category: 'learning',
      description: '创建和管理智能闪卡记忆卡片',
      tags: ['记忆', '学习', '闪卡']
    },
    {
      id: 'quiz_maker',
      name: '测验制作',
      icon: '❓',
      category: 'learning',
      description: '制作互动性测验和考试',
      tags: ['测验', '考试', '互动']
    },
    {
      id: 'progress_tracker',
      name: '学习进度',
      icon: '📈',
      category: 'learning',
      description: '跟踪和分析学习进度和成果',
      tags: ['进度', '跟踪', '分析']
    },
    {
      id: 'content_generator',
      name: '内容生成',
      icon: '✍️',
      category: 'creation',
      description: 'AI驱动的内容创作和编辑工具',
      tags: ['AI', '内容', '创作']
    },
    {
      id: 'design_tool',
      name: '设计工具',
      icon: '🎨',
      category: 'creation',
      description: '在线图形设计和编辑平台',
      tags: ['设计', '图形', '编辑']
    },
    {
      id: 'presentation_maker',
      name: '演示制作',
      icon: '📄',
      category: 'creation',
      description: '创建专业的演示文稿和幻灯片',
      tags: ['演示', '幻灯片', 'PPT']
    },
    {
      id: 'calendar_scheduler',
      name: '日程管理',
      icon: '📅',
      category: 'productivity',
      description: '智能日程安排和时间管理',
      tags: ['日程', '时间管理', '安排']
    },
    {
      id: 'task_manager',
      name: '任务管理',
      icon: '✅',
      category: 'productivity',
      description: '高效的任务跟踪和管理系统',
      tags: ['任务', '管理', 'GTD']
    },
    {
      id: 'note_organizer',
      name: '笔记整理',
      icon: '📁',
      category: 'productivity',
      description: '智能笔记分类和管理工具',
      tags: ['笔记', '整理', '分类']
    }
  ];
  
  const categories = [
    { value: 'all', label: '全部工具', icon: '🛠️' },
    { value: 'data_analysis', label: '数据分析', icon: '📈' },
    { value: 'collaboration', label: '协作工具', icon: '🤝' },
    { value: 'learning', label: '学习工具', icon: '📚' },
    { value: 'creation', label: '创作工具', icon: '✍️' },
    { value: 'productivity', label: '实用工具', icon: '⚙️' }
  ];
  
  return { tools, categories };
};

// 处理标记操作
export const createMarkContent = (markType, selectedSubtitleText, selectedSubtitleTime, selectedMaterial) => {
  const timeText = formatTime(selectedSubtitleTime);
  const markContent = `<div style="background-color: ${MARK_COLORS[markType]}20; padding: 8px; border-left: 4px solid ${MARK_COLORS[markType]}; border-radius: 4px; margin: 8px 0;"><strong>${MARK_ICONS[markType]} [${timeText}] ${MARK_NAMES[markType]}：</strong>${selectedSubtitleText}</div>`;
  
  return markContent;
};

// 创建新笔记记录
export const createNewNoteRecord = (markType, selectedSubtitleText, selectedSubtitleTime, selectedMaterial) => {
  const timeText = formatTime(selectedSubtitleTime);
  
  return {
    id: Date.now(),
    title: `【${MARK_NAMES[markType]}标记】${selectedSubtitleText.length > 15 ? selectedSubtitleText.substring(0, 15) + '...' : selectedSubtitleText}`,
    source: `${MARK_NAMES[markType]}标记 - ${selectedMaterial?.title || '视频'}`,
    time: '刚刚',
    type: 'note',
    content: `<p style="background-color: ${MARK_COLORS[markType]}20; padding: 8px; border-left: 4px solid ${MARK_COLORS[markType]}; border-radius: 4px;"><strong>【${MARK_NAMES[markType]}标记】</strong>${selectedSubtitleText}</p><p><strong>时间点：</strong>${timeText}</p><p><strong>来源：</strong>${selectedMaterial?.title || '视频'}</p>`,
    videoId: selectedMaterial?.id,
    annotationTime: selectedSubtitleTime,
    markType: markType,
    markColor: MARK_COLORS[markType]
  };
};

// 验证URL格式
export const validateUrl = (url) => {
  const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
  return urlPattern.test(url);
};

// 检查视频网站类型
export const checkVideoWebsiteType = (url) => {
  const isBilibili = url.includes('bilibili.com') || url.includes('b23.tv');
  const isXiaohongshu = url.includes('xiaohongshu.com') || url.includes('xhslink.com');
  
  return { isBilibili, isXiaohongshu };
};

// 获取视频嵌入URL
export const getVideoEmbedUrl = (url) => {
  if (url.includes('bilibili.com')) {
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
    }
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}`;
    }
  }
  return url;
};

// 简单的 Markdown 渲染
export const renderMarkdown = (content) => {
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff;">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 4px;" />')
    .replace(/\n/g, '<br />');
  
  return html;
};