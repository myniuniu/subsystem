// 学习进度数据服务
class LearningProgressService {
  constructor() {
    this.storageKey = 'learning_progress_data';
    this.initializeData();
  }

  // 初始化数据
  initializeData() {
    const existingData = this.getStoredData();
    if (!existingData) {
      const initialData = {
        totalStudyTime: 0,
        weeklyGoal: 40, // 每周目标学习时长（小时）
        subjects: [
          {
            id: 'math',
            name: '数学',
            icon: '📊',
            totalTime: 0,
            targetTime: 100,
            completedLessons: 0,
            totalLessons: 50,
            lastStudyDate: null,
            difficulty: 'medium'
          },
          {
            id: 'english',
            name: '英语',
            icon: '🌍',
            totalTime: 0,
            targetTime: 80,
            completedLessons: 0,
            totalLessons: 40,
            lastStudyDate: null,
            difficulty: 'easy'
          },
          {
            id: 'programming',
            name: '编程',
            icon: '💻',
            totalTime: 0,
            targetTime: 120,
            completedLessons: 0,
            totalLessons: 60,
            lastStudyDate: null,
            difficulty: 'hard'
          },
          {
            id: 'science',
            name: '科学',
            icon: '🔬',
            totalTime: 0,
            targetTime: 90,
            completedLessons: 0,
            totalLessons: 45,
            lastStudyDate: null,
            difficulty: 'medium'
          }
        ],
        dailyRecords: [],
        studyGoals: [
          {
            id: 'goal1',
            title: '完成数学基础课程',
            description: '完成所有数学基础章节的学习',
            progress: 0,
            target: 100,
            deadline: this.getDateAfterDays(30),
            priority: 'high',
            completed: false
          },
          {
            id: 'goal2',
            title: '英语口语练习',
            description: '每日进行30分钟英语口语练习',
            progress: 0,
            target: 30,
            deadline: this.getDateAfterDays(7),
            priority: 'medium',
            completed: false
          },
          {
            id: 'goal3',
            title: '编程项目实践',
            description: '完成一个完整的编程项目',
            progress: 0,
            target: 100,
            deadline: this.getDateAfterDays(60),
            priority: 'high',
            completed: false
          }
        ],
        achievements: {
          totalCertificates: 0,
          completedCourses: 0,
          studyStreak: 0,
          totalProjects: 0
        },
        activities: []
      };
      this.saveData(initialData);
      return initialData;
    }
    return existingData;
  }

  // 获取存储的数据
  getStoredData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading stored data:', error);
      return null;
    }
  }

  // 保存数据
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // 获取所有学习进度数据
  getAllData() {
    return this.getStoredData() || this.initializeData();
  }

  // 获取学科进度
  getSubjectProgress() {
    const data = this.getAllData();
    return data.subjects.map(subject => ({
      ...subject,
      progressPercentage: Math.round((subject.completedLessons / subject.totalLessons) * 100),
      timeProgressPercentage: Math.round((subject.totalTime / subject.targetTime) * 100)
    }));
  }

  // 获取每日学习趋势数据
  getDailyTrend(days = 7) {
    const data = this.getAllData();
    const today = new Date();
    const trendData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecord = data.dailyRecords.find(record => record.date === dateStr);
      trendData.push({
        date: dateStr,
        studyTime: dayRecord ? dayRecord.studyTime : 0,
        completedTasks: dayRecord ? dayRecord.completedTasks : 0,
        day: date.toLocaleDateString('zh-CN', { weekday: 'short' })
      });
    }

    return trendData;
  }

  // 获取本周学习统计
  getWeeklyStats() {
    const data = this.getAllData();
    const weeklyData = this.getDailyTrend(7);
    const totalWeeklyTime = weeklyData.reduce((sum, day) => sum + day.studyTime, 0);
    
    return {
      totalTime: totalWeeklyTime,
      targetTime: data.weeklyGoal,
      progressPercentage: Math.round((totalWeeklyTime / data.weeklyGoal) * 100),
      averageDaily: Math.round(totalWeeklyTime / 7 * 10) / 10,
      completedDays: weeklyData.filter(day => day.studyTime > 0).length
    };
  }

  // 获取学习目标
  getStudyGoals() {
    const data = this.getAllData();
    return data.studyGoals.map(goal => ({
      ...goal,
      progressPercentage: Math.round((goal.progress / goal.target) * 100),
      daysLeft: this.getDaysUntil(goal.deadline),
      isOverdue: new Date(goal.deadline) < new Date()
    }));
  }

  // 获取成就统计
  getAchievements() {
    const data = this.getAllData();
    const subjects = this.getSubjectProgress();
    
    return {
      ...data.achievements,
      completedSubjects: subjects.filter(s => s.progressPercentage >= 100).length,
      averageProgress: Math.round(subjects.reduce((sum, s) => sum + s.progressPercentage, 0) / subjects.length),
      totalStudyTime: Math.round(data.totalStudyTime)
    };
  }

  // 获取最近活动
  getRecentActivities(limit = 5) {
    const data = this.getAllData();
    return data.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  // 添加学习记录
  addStudyRecord(subjectId, studyTime, completedLessons = 0) {
    const data = this.getAllData();
    const today = new Date().toISOString().split('T')[0];
    
    // 更新学科数据
    const subject = data.subjects.find(s => s.id === subjectId);
    if (subject) {
      subject.totalTime += studyTime;
      subject.completedLessons += completedLessons;
      subject.lastStudyDate = today;
    }

    // 更新总学习时间
    data.totalStudyTime += studyTime;

    // 更新每日记录
    let dayRecord = data.dailyRecords.find(record => record.date === today);
    if (!dayRecord) {
      dayRecord = { date: today, studyTime: 0, completedTasks: 0 };
      data.dailyRecords.push(dayRecord);
    }
    dayRecord.studyTime += studyTime;
    dayRecord.completedTasks += completedLessons;

    // 添加活动记录
    data.activities.push({
      id: Date.now().toString(),
      type: 'study',
      subject: subject ? subject.name : '未知科目',
      description: `学习了 ${studyTime} 小时`,
      timestamp: new Date().toISOString(),
      icon: subject ? subject.icon : '📚'
    });

    this.saveData(data);
    return data;
  }

  // 更新学习目标进度
  updateGoalProgress(goalId, progress) {
    const data = this.getAllData();
    const goal = data.studyGoals.find(g => g.id === goalId);
    
    if (goal) {
      goal.progress = Math.min(progress, goal.target);
      goal.completed = goal.progress >= goal.target;
      
      if (goal.completed) {
        data.activities.push({
          id: Date.now().toString(),
          type: 'achievement',
          subject: '目标达成',
          description: `完成目标：${goal.title}`,
          timestamp: new Date().toISOString(),
          icon: '🎯'
        });
      }
    }

    this.saveData(data);
    return data;
  }

  // 添加新的学习目标
  addStudyGoal(title, description, target, deadline, priority = 'medium') {
    const data = this.getAllData();
    const newGoal = {
      id: `goal_${Date.now()}`,
      title,
      description,
      progress: 0,
      target,
      deadline,
      priority,
      completed: false
    };

    data.studyGoals.push(newGoal);
    this.saveData(data);
    return newGoal;
  }

  // 删除学习目标
  removeStudyGoal(goalId) {
    const data = this.getAllData();
    data.studyGoals = data.studyGoals.filter(goal => goal.id !== goalId);
    this.saveData(data);
    return data;
  }

  // 更新周目标
  updateWeeklyGoal(hours) {
    const data = this.getAllData();
    data.weeklyGoal = hours;
    this.saveData(data);
    return data;
  }

  // 获取学习统计摘要
  getStudySummary() {
    const data = this.getAllData();
    const subjects = this.getSubjectProgress();
    const weeklyStats = this.getWeeklyStats();
    const goals = this.getStudyGoals();

    return {
      totalStudyTime: Math.round(data.totalStudyTime),
      completedLessons: subjects.reduce((sum, s) => sum + s.completedLessons, 0),
      totalLessons: subjects.reduce((sum, s) => sum + s.totalLessons, 0),
      weeklyProgress: weeklyStats.progressPercentage,
      activeGoals: goals.filter(g => !g.completed).length,
      completedGoals: goals.filter(g => g.completed).length,
      studyStreak: this.calculateStudyStreak(),
      averageSubjectProgress: Math.round(subjects.reduce((sum, s) => sum + s.progressPercentage, 0) / subjects.length)
    };
  }

  // 计算学习连续天数
  calculateStudyStreak() {
    const data = this.getAllData();
    const sortedRecords = data.dailyRecords
      .filter(record => record.studyTime > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedRecords.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedRecords.length; i++) {
      const recordDate = new Date(sortedRecords[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (recordDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // 辅助方法：获取指定天数后的日期
  getDateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // 辅助方法：计算距离指定日期的天数
  getDaysUntil(dateStr) {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 重置所有数据
  resetAllData() {
    localStorage.removeItem(this.storageKey);
    return this.initializeData();
  }

  // 导出数据
  exportData() {
    const data = this.getAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `learning_progress_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // 导入数据
  importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      this.saveData(data);
      return { success: true, message: '数据导入成功' };
    } catch (error) {
      return { success: false, message: '数据格式错误' };
    }
  }
}

// 创建单例实例
const learningProgressService = new LearningProgressService();

export default learningProgressService;