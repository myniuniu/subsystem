/**
 * 规则调度器 - 处理定时执行规则的调度功能
 */

class RuleScheduler {
  constructor() {
    this.scheduledRules = new Map(); // 存储已调度的规则
    this.timers = new Map(); // 存储定时器
    this.isRunning = false;
  }

  /**
   * 启动调度器
   */
  start() {
    if (this.isRunning) {
      console.log('规则调度器已在运行中');
      return;
    }
    
    this.isRunning = true;
    console.log('规则调度器已启动');
    
    // 启动主循环，每分钟检查一次
    this.mainTimer = setInterval(() => {
      this.checkScheduledRules();
    }, 60000); // 60秒检查一次
  }

  /**
   * 停止调度器
   */
  stop() {
    if (!this.isRunning) {
      console.log('规则调度器未在运行');
      return;
    }
    
    this.isRunning = false;
    
    // 清除主定时器
    if (this.mainTimer) {
      clearInterval(this.mainTimer);
      this.mainTimer = null;
    }
    
    // 清除所有规则定时器
    this.timers.forEach((timer, ruleId) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers.clear();
    
    console.log('规则调度器已停止');
  }

  /**
   * 添加规则到调度器
   * @param {Object} rule - 规则对象
   * @param {Function} executeCallback - 执行回调函数
   */
  addRule(rule, executeCallback) {
    if (rule.scheduleType !== 'scheduled') {
      console.log(`规则 ${rule.name} 不是定时执行类型，跳过调度`);
      return;
    }

    if (!rule.schedule) {
      console.warn(`规则 ${rule.name} 缺少调度配置`);
      return;
    }

    // 移除已存在的调度
    this.removeRule(rule.id);

    // 添加新的调度
    this.scheduledRules.set(rule.id, {
      rule,
      executeCallback,
      lastExecuted: null,
      nextExecution: this.calculateNextExecution(rule.schedule)
    });

    // 设置定时器
    this.scheduleRule(rule.id);
    
    console.log(`规则 ${rule.name} 已添加到调度器，下次执行时间: ${this.scheduledRules.get(rule.id).nextExecution}`);
  }

  /**
   * 从调度器中移除规则
   * @param {string} ruleId - 规则ID
   */
  removeRule(ruleId) {
    if (this.timers.has(ruleId)) {
      const timer = this.timers.get(ruleId);
      clearTimeout(timer);
      clearInterval(timer);
      this.timers.delete(ruleId);
    }
    
    if (this.scheduledRules.has(ruleId)) {
      const ruleName = this.scheduledRules.get(ruleId).rule.name;
      this.scheduledRules.delete(ruleId);
      console.log(`规则 ${ruleName} 已从调度器中移除`);
    }
  }

  /**
   * 更新规则调度
   * @param {Object} rule - 更新后的规则对象
   * @param {Function} executeCallback - 执行回调函数
   */
  updateRule(rule, executeCallback) {
    if (this.scheduledRules.has(rule.id)) {
      this.removeRule(rule.id);
    }
    
    if (rule.enabled && rule.scheduleType === 'scheduled') {
      this.addRule(rule, executeCallback);
    }
  }

  /**
   * 计算下次执行时间
   * @param {Object} schedule - 调度配置
   * @returns {Date} 下次执行时间
   */
  calculateNextExecution(schedule) {
    const now = new Date();
    let nextExecution = new Date(now);

    switch (schedule.type) {
      case 'interval':
        // 间隔执行
        const intervalMs = this.parseInterval(schedule.interval);
        nextExecution.setTime(now.getTime() + intervalMs);
        break;

      case 'daily':
        // 每日执行
        const [hours, minutes] = schedule.time.split(':').map(Number);
        nextExecution.setHours(hours, minutes, 0, 0);
        
        // 如果今天的时间已过，设置为明天
        if (nextExecution <= now) {
          nextExecution.setDate(nextExecution.getDate() + 1);
        }
        break;

      case 'weekly':
        // 每周执行
        const targetDay = schedule.dayOfWeek; // 0-6, 0为周日
        const [weekHours, weekMinutes] = schedule.time.split(':').map(Number);
        
        nextExecution.setHours(weekHours, weekMinutes, 0, 0);
        
        // 计算到目标星期几的天数
        const currentDay = now.getDay();
        let daysUntilTarget = targetDay - currentDay;
        
        if (daysUntilTarget < 0 || (daysUntilTarget === 0 && nextExecution <= now)) {
          daysUntilTarget += 7;
        }
        
        nextExecution.setDate(nextExecution.getDate() + daysUntilTarget);
        break;

      case 'monthly':
        // 每月执行
        const targetDate = schedule.dayOfMonth;
        const [monthHours, monthMinutes] = schedule.time.split(':').map(Number);
        
        nextExecution.setDate(targetDate);
        nextExecution.setHours(monthHours, monthMinutes, 0, 0);
        
        // 如果本月的时间已过，设置为下月
        if (nextExecution <= now) {
          nextExecution.setMonth(nextExecution.getMonth() + 1);
        }
        
        // 处理月末日期问题
        if (nextExecution.getDate() !== targetDate) {
          nextExecution.setDate(0); // 设置为上月最后一天
        }
        break;

      default:
        // 默认1小时后执行
        nextExecution.setTime(now.getTime() + 3600000);
    }

    return nextExecution;
  }

  /**
   * 解析间隔时间字符串
   * @param {string} interval - 间隔字符串，如 "30m", "2h", "1d"
   * @returns {number} 毫秒数
   */
  parseInterval(interval) {
    const match = interval.match(/^(\d+)([mhd])$/);
    if (!match) {
      console.warn(`无效的间隔格式: ${interval}，使用默认1小时`);
      return 3600000; // 1小时
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'm': return value * 60 * 1000; // 分钟
      case 'h': return value * 60 * 60 * 1000; // 小时
      case 'd': return value * 24 * 60 * 60 * 1000; // 天
      default: return 3600000; // 默认1小时
    }
  }

  /**
   * 为规则设置定时器
   * @param {string} ruleId - 规则ID
   */
  scheduleRule(ruleId) {
    const ruleData = this.scheduledRules.get(ruleId);
    if (!ruleData) return;

    const { rule, executeCallback, nextExecution } = ruleData;
    const now = new Date();
    const delay = nextExecution.getTime() - now.getTime();

    if (delay <= 0) {
      // 立即执行
      this.executeRule(ruleId);
      return;
    }

    // 设置定时器
    const timer = setTimeout(() => {
      this.executeRule(ruleId);
    }, delay);

    this.timers.set(ruleId, timer);
  }

  /**
   * 执行规则
   * @param {string} ruleId - 规则ID
   */
  async executeRule(ruleId) {
    const ruleData = this.scheduledRules.get(ruleId);
    if (!ruleData) return;

    const { rule, executeCallback } = ruleData;
    
    try {
      console.log(`开始执行定时规则: ${rule.name}`);
      
      // 执行规则
      await executeCallback(rule);
      
      // 更新最后执行时间
      ruleData.lastExecuted = new Date();
      
      // 计算下次执行时间
      ruleData.nextExecution = this.calculateNextExecution(rule.schedule);
      
      // 设置下次执行的定时器
      this.scheduleRule(ruleId);
      
      console.log(`规则 ${rule.name} 执行完成，下次执行时间: ${ruleData.nextExecution}`);
      
    } catch (error) {
      console.error(`规则 ${rule.name} 执行失败:`, error);
      
      // 即使执行失败，也要设置下次执行
      ruleData.nextExecution = this.calculateNextExecution(rule.schedule);
      this.scheduleRule(ruleId);
    }
  }

  /**
   * 检查所有已调度的规则
   */
  checkScheduledRules() {
    const now = new Date();
    
    this.scheduledRules.forEach((ruleData, ruleId) => {
      const { rule, nextExecution } = ruleData;
      
      // 检查规则是否仍然启用
      if (!rule.enabled) {
        this.removeRule(ruleId);
        return;
      }
      
      // 检查是否需要执行
      if (nextExecution && nextExecution <= now) {
        // 如果没有对应的定时器，说明可能错过了执行时间
        if (!this.timers.has(ruleId)) {
          console.log(`检测到错过的执行时间，立即执行规则: ${rule.name}`);
          this.executeRule(ruleId);
        }
      }
    });
  }

  /**
   * 获取调度器状态
   * @returns {Object} 调度器状态信息
   */
  getStatus() {
    const scheduledRulesInfo = Array.from(this.scheduledRules.entries()).map(([ruleId, ruleData]) => ({
      ruleId,
      ruleName: ruleData.rule.name,
      enabled: ruleData.rule.enabled,
      scheduleType: ruleData.rule.schedule?.type,
      lastExecuted: ruleData.lastExecuted,
      nextExecution: ruleData.nextExecution
    }));

    return {
      isRunning: this.isRunning,
      scheduledRulesCount: this.scheduledRules.size,
      activeTimersCount: this.timers.size,
      scheduledRules: scheduledRulesInfo
    };
  }

  /**
   * 手动触发规则执行（用于测试）
   * @param {string} ruleId - 规则ID
   */
  triggerRule(ruleId) {
    if (this.scheduledRules.has(ruleId)) {
      console.log(`手动触发规则执行: ${this.scheduledRules.get(ruleId).rule.name}`);
      this.executeRule(ruleId);
    } else {
      console.warn(`规则 ${ruleId} 不在调度器中`);
    }
  }
}

// 创建全局调度器实例
const ruleScheduler = new RuleScheduler();

// 在页面加载时启动调度器
if (typeof window !== 'undefined') {
  // 浏览器环境
  window.addEventListener('load', () => {
    ruleScheduler.start();
  });
  
  // 页面卸载时停止调度器
  window.addEventListener('beforeunload', () => {
    ruleScheduler.stop();
  });
}

export default ruleScheduler;