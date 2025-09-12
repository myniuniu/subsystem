/**
 * 数据记录服务
 * 用于记录用户行为和笔记访问统计
 */

class DataRecordService {
  constructor() {
    this.storageKey = 'smart_notes_data_records';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        userBehaviors: [],
        noteAccess: [],
        searchHistory: []
      }));
    }
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {
        userBehaviors: [],
        noteAccess: [],
        searchHistory: []
      };
    } catch (error) {
      console.error('获取数据记录失败:', error);
      return {
        userBehaviors: [],
        noteAccess: [],
        searchHistory: []
      };
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('保存数据记录失败:', error);
    }
  }

  // 记录用户行为
  recordUserBehavior(action, details = {}) {
    const data = this.getData();
    const record = {
      id: Date.now() + Math.random(),
      action,
      details,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    data.userBehaviors.push(record);
    
    // 保持最近1000条记录
    if (data.userBehaviors.length > 1000) {
      data.userBehaviors = data.userBehaviors.slice(-1000);
    }
    
    this.saveData(data);
    return record;
  }

  // 记录笔记访问
  recordNoteAccess(noteId, details = {}) {
    const data = this.getData();
    const record = {
      id: Date.now() + Math.random(),
      noteId,
      details,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    data.noteAccess.push(record);
    
    // 保持最近1000条记录
    if (data.noteAccess.length > 1000) {
      data.noteAccess = data.noteAccess.slice(-1000);
    }
    
    this.saveData(data);
    return record;
  }

  // 记录搜索历史
  recordSearch(query, results = []) {
    const data = this.getData();
    const record = {
      id: Date.now() + Math.random(),
      query,
      resultCount: results.length,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    data.searchHistory.push(record);
    
    // 保持最近500条记录
    if (data.searchHistory.length > 500) {
      data.searchHistory = data.searchHistory.slice(-500);
    }
    
    this.saveData(data);
    return record;
  }

  // 获取用户行为统计
  getUserBehaviorStats(days = 30) {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentBehaviors = data.userBehaviors.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );
    
    const stats = {};
    recentBehaviors.forEach(record => {
      stats[record.action] = (stats[record.action] || 0) + 1;
    });
    
    return stats;
  }

  // 获取笔记访问统计
  getNoteAccessStats(days = 30) {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentAccess = data.noteAccess.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );
    
    const stats = {};
    recentAccess.forEach(record => {
      stats[record.noteId] = (stats[record.noteId] || 0) + 1;
    });
    
    return stats;
  }

  // 获取搜索统计
  getSearchStats(days = 30) {
    const data = this.getData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentSearches = data.searchHistory.filter(record => 
      new Date(record.timestamp) >= cutoffDate
    );
    
    return {
      totalSearches: recentSearches.length,
      uniqueQueries: new Set(recentSearches.map(r => r.query)).size,
      avgResultCount: recentSearches.length > 0 
        ? recentSearches.reduce((sum, r) => sum + r.resultCount, 0) / recentSearches.length 
        : 0
    };
  }

  // 清除所有数据
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    this.init();
  }
}

// 创建单例实例
const dataRecordService = new DataRecordService();

export default dataRecordService;