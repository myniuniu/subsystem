// 勋章数据源：用于“我的勋章”页面与头像菜单统计
// 注意：后续可从服务端或本地存储动态生成，这里先提供静态示例以复刻设计

export const achievementMedals = [
  { id: 'perfect-week-1', label: '完美学习周', value: 4, color: '#d9d9d9', tier: 'silver' },
  { id: 'perfect-week-2', label: '完美学习周', value: 4, color: '#c4c4c4', tier: 'silver' },
  { id: 'perfect-week-3', label: '完美学习周', value: 4, color: '#bfbfbf', tier: 'silver' },
  { id: 'perfect-week-4', label: '完美学习周', value: 4, color: '#b3b3b3', tier: 'silver' },
  { id: 'rate-master-5', label: '神作打分', value: 5, color: '#e6a23c', tier: 'bronze' },
  { id: 'album-complete-10', label: '学完专辑', value: 10, color: '#e6a23c', tier: 'bronze' },
  { id: 'read-cards-50', label: '学习卡片', value: 50, color: '#67c23a', tier: 'green' },
  { id: 'reading-days-200', label: '学习天数', value: 200, color: '#67c23a', tier: 'green' },
  { id: 'reading-days-100', label: '学习天数', value: 100, color: '#67c23a', tier: 'green' },
  { id: 'reading-time-100', label: '学习时长', value: 100, color: '#67c23a', tier: 'green' },
  { id: 'streak-30', label: '连续学习', value: 30, color: '#ff85c0', tier: 'pink' },
  { id: 'perfect-month-4', label: '完美学习月', value: 4, color: '#bfbfbf', tier: 'silver' },
  { id: 'crazy-week-40', label: '狂热学习周', value: 40, color: '#f7d674', tier: 'gold' }
]

export const weeklyChallenge = [
  { id: 'crazy-42w', label: '狂热学习42周', value: 42, tier: 'dark' },
  { id: 'perfect-42w', label: '完美学习42周', value: 42, tier: 'silver' },
  { id: 'perfect-45w', label: '完美学习45周', value: 45, tier: 'silver' },
  { id: 'crazy-41w', label: '狂热学习41周', value: 41, tier: 'gold' },
  { id: 'perfect-41w', label: '完美学习41周', value: 41, tier: 'silver' }
]

export const monthlyChallenge = [
  { id: 'crazy-10m', label: '狂热学习十月', value: 10, tier: 'dark' },
  { id: 'perfect-10m', label: '完美学习十月', value: 10, tier: 'silver' },
  { id: 'perfect-1m', label: '完美学习1月', value: 1, tier: 'silver' }
]

export const getTotalMedalCount = () => {
  return achievementMedals.length
}

export default {
  achievementMedals,
  weeklyChallenge,
  monthlyChallenge,
  getTotalMedalCount
}