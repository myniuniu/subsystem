// 组织培训状态和进度计算工具函数

/**
 * 培训状态枚举
 */
export const TRAINING_STATUS = {
  NOT_STARTED: 'not_started',    // 未开始
  IN_PROGRESS: 'in_progress',    // 进行中
  COMPLETED: 'completed'         // 已结束
};

/**
 * 培训状态显示配置
 */
export const STATUS_CONFIG = {
  [TRAINING_STATUS.NOT_STARTED]: {
    label: '未开始',
    color: '#8c8c8c',
    bgColor: '#f5f5f5',
    icon: '📅'
  },
  [TRAINING_STATUS.IN_PROGRESS]: {
    label: '进行中',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    icon: '🔄'
  },
  [TRAINING_STATUS.COMPLETED]: {
    label: '已结束',
    color: '#52c41a',
    bgColor: '#f6ffed',
    icon: '✅'
  }
};

/**
 * 解析时间字符串为Date对象
 * @param {string} timeStr - 时间字符串，格式如 "12/26 09:00"
 * @returns {Date} 解析后的Date对象
 */
export const parseTimeString = (timeStr) => {
  if (!timeStr) return null;
  
  const currentYear = new Date().getFullYear();
  const [datePart, timePart] = timeStr.split(' ');
  const [month, day] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  
  return new Date(currentYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
};

/**
 * 计算培训状态
 * @param {Object} learningSchedule - 学习时间安排
 * @returns {string} 培训状态
 */
export const calculateTrainingStatus = (learningSchedule) => {
  if (!learningSchedule || !learningSchedule.startTime || !learningSchedule.endTime) {
    return TRAINING_STATUS.NOT_STARTED;
  }

  const now = new Date();
  const startTime = parseTimeString(learningSchedule.startTime);
  const endTime = parseTimeString(learningSchedule.endTime);

  if (now < startTime) {
    return TRAINING_STATUS.NOT_STARTED;
  } else if (now > endTime) {
    return TRAINING_STATUS.COMPLETED;
  } else {
    return TRAINING_STATUS.IN_PROGRESS;
  }
};

/**
 * 计算剩余天数
 * @param {Object} learningSchedule - 学习时间安排
 * @returns {number} 剩余天数，负数表示已过期
 */
export const calculateRemainingDays = (learningSchedule) => {
  if (!learningSchedule || !learningSchedule.endTime) {
    return 0;
  }

  const now = new Date();
  const endTime = parseTimeString(learningSchedule.endTime);
  
  if (!endTime) return 0;

  const timeDiff = endTime - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff;
};

/**
 * 计算当前进度百分比
 * @param {Object} learningSchedule - 学习时间安排
 * @returns {number} 进度百分比 (0-100)
 */
export const calculateCurrentProgress = (learningSchedule) => {
  if (!learningSchedule || !learningSchedule.startTime || !learningSchedule.endTime) {
    return 0;
  }

  const now = new Date();
  const startTime = parseTimeString(learningSchedule.startTime);
  const endTime = parseTimeString(learningSchedule.endTime);

  if (!startTime || !endTime) return 0;

  if (now <= startTime) {
    return 0;
  } else if (now >= endTime) {
    return 100;
  } else {
    const totalDuration = endTime - startTime;
    const elapsedDuration = now - startTime;
    return Math.round((elapsedDuration / totalDuration) * 100);
  }
};

/**
 * 计算平均每天需要的学习时间
 * @param {Object} learningSchedule - 学习时间安排
 * @param {Object} videoInfo - 视频信息
 * @returns {Object} 包含平均每天学习时间的对象
 */
export const calculateDailyLearningTime = (learningSchedule, videoInfo) => {
  if (!learningSchedule || !videoInfo) {
    return {
      totalMinutes: 0,
      dailyMinutes: 0,
      dailyHours: 0,
      formattedTime: '0分钟'
    };
  }

  const remainingDays = calculateRemainingDays(learningSchedule);
  
  if (remainingDays <= 0) {
    return {
      totalMinutes: 0,
      dailyMinutes: 0,
      dailyHours: 0,
      formattedTime: '已结束'
    };
  }

  // 计算剩余学习时间（分钟）
  let remainingMinutes = 0;
  
  if (videoInfo.type === 'single_video') {
    const totalSeconds = videoInfo.duration || 0;
    const watchedSeconds = (totalSeconds * (videoInfo.progress || 0)) / 100;
    remainingMinutes = Math.round((totalSeconds - watchedSeconds) / 60);
  } else if (videoInfo.type === 'multi_video') {
    const totalSeconds = videoInfo.totalDuration || 0;
    const watchedSeconds = videoInfo.watchedDuration || 0;
    remainingMinutes = Math.round((totalSeconds - watchedSeconds) / 60);
  }

  if (remainingMinutes <= 0) {
    return {
      totalMinutes: 0,
      dailyMinutes: 0,
      dailyHours: 0,
      formattedTime: '已完成'
    };
  }

  // 计算平均每天需要的学习时间
  const dailyMinutes = Math.ceil(remainingMinutes / remainingDays);
  const dailyHours = Math.floor(dailyMinutes / 60);
  const remainingMinutesInHour = dailyMinutes % 60;

  let formattedTime = '';
  if (dailyHours > 0) {
    formattedTime = `${dailyHours}小时${remainingMinutesInHour > 0 ? remainingMinutesInHour + '分钟' : ''}`;
  } else {
    formattedTime = `${dailyMinutes}分钟`;
  }

  return {
    totalMinutes: remainingMinutes,
    dailyMinutes,
    dailyHours,
    formattedTime
  };
};

/**
 * 获取培训的完整状态信息
 * @param {Object} note - 笔记对象
 * @returns {Object} 完整的状态信息
 */
export const getTrainingStatusInfo = (note) => {
  if (!note || !note.learningSchedule) {
    return null;
  }

  const status = calculateTrainingStatus(note.learningSchedule);
  const statusConfig = STATUS_CONFIG[status];
  const remainingDays = calculateRemainingDays(note.learningSchedule);
  const currentProgress = calculateCurrentProgress(note.learningSchedule);
  const dailyLearningTime = calculateDailyLearningTime(note.learningSchedule, note.videoInfo);

  return {
    status,
    statusConfig,
    remainingDays: Math.max(0, remainingDays), // 确保不显示负数
    currentProgress,
    dailyLearningTime,
    isInProgress: status === TRAINING_STATUS.IN_PROGRESS,
    isCompleted: status === TRAINING_STATUS.COMPLETED,
    isNotStarted: status === TRAINING_STATUS.NOT_STARTED
  };
};