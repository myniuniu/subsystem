// 主题分享服务
import { message } from 'antd';

class ThemeShareService {
  constructor() {
    this.sharedThemes = this.getSharedThemes();
    this.shareHistory = this.getShareHistory();
  }

  // 获取已分享的主题
  getSharedThemes() {
    try {
      const stored = localStorage.getItem('shared-themes');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取分享主题失败:', error);
      return [];
    }
  }

  // 获取分享历史
  getShareHistory() {
    try {
      const stored = localStorage.getItem('theme-share-history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('获取分享历史失败:', error);
      return [];
    }
  }

  // 保存分享主题
  saveSharedThemes() {
    try {
      localStorage.setItem('shared-themes', JSON.stringify(this.sharedThemes));
    } catch (error) {
      console.error('保存分享主题失败:', error);
    }
  }

  // 保存分享历史
  saveShareHistory() {
    try {
      localStorage.setItem('theme-share-history', JSON.stringify(this.shareHistory));
    } catch (error) {
      console.error('保存分享历史失败:', error);
    }
  }

  // 分享主题到学习广场
  shareToLearningSquare(theme, shareOptions = {}) {
    try {
      const DEFAULT_SPACE = '技术部-研发'
      const currentSpace = (() => { try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE } })()
      const shareData = {
        id: `shared-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        themeId: theme.key,
        themeName: theme.name,
        themeColors: theme.colors,
        shareType: 'learning_square',
        sharedBy: shareOptions.sharedBy || '当前用户',
        sharedAt: new Date().toISOString(),
        title: shareOptions.title || `${theme.name} - 精美主题分享`,
        description: shareOptions.description || `分享一个精美的${theme.name}主题，快来体验吧！`,
        tags: shareOptions.tags || ['主题', '界面', '美化'],
        space: shareOptions.space || currentSpace,
        isPublic: true,
        likes: 0,
        downloads: 0,
        views: 0,
        category: 'theme',
        difficulty: 'beginner',
        status: 'active'
      };

      // 添加到分享列表
      this.sharedThemes.push(shareData);
      this.saveSharedThemes();

      // 添加到分享历史
      this.shareHistory.unshift({
        id: shareData.id,
        type: 'learning_square',
        themeName: theme.name,
        sharedAt: shareData.sharedAt,
        status: 'success'
      });
      this.saveShareHistory();

      message.success(`主题「${theme.name}」已成功分享到学习广场！`);
      return shareData;
    } catch (error) {
      console.error('分享到学习广场失败:', error);
      message.error('分享失败，请重试');
      return null;
    }
  }

  // 分享“培训项目”到学习广场（用于培训需求管理）
  shareTrainingProjectToLearningSquare(theme, shareOptions = {}) {
    try {
      const DEFAULT_SPACE = '技术部-研发'
      const currentSpace = (() => { try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE } })()
      const project = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        themeId: theme?.key || theme?.id,
        title: shareOptions.title || (theme?.name ? `${theme.name} · 培训项目` : '培训项目'),
        description: shareOptions.description || '',
        tags: shareOptions.tags || ['培训项目'],
        sharedBy: shareOptions.sharedBy || '当前用户',
        sharedAt: new Date().toISOString(),
        space: shareOptions.space || currentSpace,
        status: 'active'
      }

      // 写入本地存储
      const raw = localStorage.getItem('learning_square_training_projects')
      const list = raw ? JSON.parse(raw) : []
      list.unshift(project)
      localStorage.setItem('learning_square_training_projects', JSON.stringify(list))

      // 同步到分享历史
      this.shareHistory.unshift({
        id: project.id,
        type: 'learning_square_training_project',
        themeName: theme?.name || '培训项目',
        sharedAt: project.sharedAt,
        status: 'success'
      })
      this.saveShareHistory()

      message.success(`已将「${project.title}」分享到学习广场 · 培训项目`)
      return project
    } catch (error) {
      console.error('分享到学习广场的培训项目失败:', error)
      message.error('分享失败，请重试')
      return null
    }
  }

  // 获取学习广场的“培训项目”列表
  getLearningSquareTrainingProjects() {
    try {
      const DEFAULT_SPACE = '技术部-研发'
      const currentSpace = (() => { try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE } })()
      const raw = localStorage.getItem('learning_square_training_projects')
      let list = raw ? JSON.parse(raw) : []
      let changed = false
      list = (list || []).map(p => {
        if (!p.space) { changed = true; return { ...p, space: currentSpace } }
        return p
      })
      if (changed) localStorage.setItem('learning_square_training_projects', JSON.stringify(list))
      return list.filter(p => p.status !== 'deleted')
    } catch {
      return []
    }
  }

  // 分享主题给其他人
  shareToUsers(theme, recipients, shareOptions = {}) {
    try {
      const shareData = {
        id: `private-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        themeId: theme.key,
        themeName: theme.name,
        themeColors: theme.colors,
        shareType: 'private',
        sharedBy: shareOptions.sharedBy || '当前用户',
        sharedAt: new Date().toISOString(),
        recipients: recipients,
        message: shareOptions.message || `我发现了一个很棒的主题「${theme.name}」，分享给你！`,
        expiresAt: shareOptions.expiresAt || null,
        permissions: shareOptions.permissions || 'view',
        status: 'sent'
      };

      // 添加到分享历史
      this.shareHistory.unshift({
        id: shareData.id,
        type: 'private',
        themeName: theme.name,
        recipients: recipients.map(r => r.name).join(', '),
        sharedAt: shareData.sharedAt,
        status: 'success'
      });
      this.saveShareHistory();

      message.success(`主题「${theme.name}」已成功分享给 ${recipients.length} 个用户！`);
      return shareData;
    } catch (error) {
      console.error('私人分享失败:', error);
      message.error('分享失败，请重试');
      return null;
    }
  }

  // 生成分享链接
  generateShareLink(theme, shareType = 'public') {
    const baseUrl = window.location.origin;
    const shareId = `${shareType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const shareLink = `${baseUrl}/theme/share/${shareId}?theme=${encodeURIComponent(theme.key)}&name=${encodeURIComponent(theme.name)}`;
    
    // 保存分享链接信息
    const linkData = {
      id: shareId,
      themeId: theme.key,
      themeName: theme.name,
      shareType: shareType,
      link: shareLink,
      createdAt: new Date().toISOString(),
      clicks: 0,
      status: 'active'
    };

    // 可以保存到本地存储或发送到服务器
    const shareLinks = JSON.parse(localStorage.getItem('theme-share-links') || '[]');
    shareLinks.push(linkData);
    localStorage.setItem('theme-share-links', JSON.stringify(shareLinks));

    return shareLink;
  }

  // 获取学习广场的分享主题
  getLearningSquareThemes() {
    try {
      const DEFAULT_SPACE = '技术部-研发'
      const currentSpace = (() => { try { return localStorage.getItem('current_knowledge_space') || DEFAULT_SPACE } catch { return DEFAULT_SPACE } })()
      // 为所有主题补齐 space 字段（若缺失）
      let changed = false
      this.sharedThemes = (this.sharedThemes || []).map(t => {
        if (!t.space) { changed = true; return { ...t, space: currentSpace } }
        return t
      })
      if (changed) this.saveSharedThemes()
    } catch {}
    return this.sharedThemes.filter(theme => theme.shareType === 'learning_square' && theme.status === 'active');
  }

  // 获取分享历史
  getShareHistoryList(limit = 10) {
    return this.shareHistory.slice(0, limit);
  }

  // 删除分享
  deleteShare(shareId) {
    try {
      // 从分享列表中删除
      this.sharedThemes = this.sharedThemes.filter(theme => theme.id !== shareId);
      this.saveSharedThemes();

      // 更新分享历史状态
      const historyItem = this.shareHistory.find(item => item.id === shareId);
      if (historyItem) {
        historyItem.status = 'deleted';
        this.saveShareHistory();
      }

      message.success('分享已删除');
      return true;
    } catch (error) {
      console.error('删除分享失败:', error);
      message.error('删除失败，请重试');
      return false;
    }
  }

  // 更新分享统计
  updateShareStats(shareId, stats) {
    try {
      const shareItem = this.sharedThemes.find(theme => theme.id === shareId);
      if (shareItem) {
        Object.assign(shareItem, stats);
        this.saveSharedThemes();
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新分享统计失败:', error);
      return false;
    }
  }

  // 点赞分享
  likeShare(shareId) {
    const shareItem = this.sharedThemes.find(theme => theme.id === shareId);
    if (shareItem) {
      shareItem.likes = (shareItem.likes || 0) + 1;
      this.saveSharedThemes();
      return shareItem.likes;
    }
    return 0;
  }

  // 下载主题
  downloadTheme(shareId) {
    const shareItem = this.sharedThemes.find(theme => theme.id === shareId);
    if (shareItem) {
      shareItem.downloads = (shareItem.downloads || 0) + 1;
      this.saveSharedThemes();
      return shareItem;
    }
    return null;
  }

  // 查看主题详情
  viewTheme(shareId) {
    const shareItem = this.sharedThemes.find(theme => theme.id === shareId);
    if (shareItem) {
      shareItem.views = (shareItem.views || 0) + 1;
      this.saveSharedThemes();
      return shareItem;
    }
    return null;
  }
}

// 创建单例实例
const themeShareService = new ThemeShareService();

export default themeShareService;