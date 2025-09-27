// 组织培训模拟数据状态验证测试
import { getTrainingStatusInfo, TRAINING_STATUS } from '../src/utils/trainingStatusUtils.js';

// 模拟当前时间为 2024年12月27日 15:00
const mockCurrentTime = new Date('2024-12-27T15:00:00');
Date.now = () => mockCurrentTime.getTime();

// 测试数据样本
const trainingNotes = [
  {
    title: '【组织培训】新教师教学方法培训',
    learningSchedule: {
      startTime: '12/24 09:00',
      endTime: '12/30 17:00',
      duration: '6天'
    },
    videoInfo: {
      type: 'multi_video',
      totalVideos: 5,
      totalDuration: 3600, // 60分钟
      watchedDuration: 2160, // 36分钟，60%进度
      overallProgress: 60
    },
    status: '预期：进行中'
  },
  {
    title: '【组织培训】教育技术应用实践',
    learningSchedule: {
      startTime: '12/15 09:30',
      endTime: '12/22 16:30',
      duration: '7天'
    },
    videoInfo: {
      type: 'multi_video',
      totalVideos: 3,
      totalDuration: 5400, // 90分钟
      watchedDuration: 5400, // 全部完成
      overallProgress: 100
    },
    status: '预期：已结束'
  },
  {
    title: '【组织培训】课程设计与开发',
    learningSchedule: {
      startTime: '1/5 10:00',
      endTime: '1/12 15:00',
      duration: '7天'
    },
    videoInfo: {
      type: 'multi_video',
      totalVideos: 4,
      totalDuration: 4800, // 80分钟
      watchedDuration: 1200, // 20分钟，25%进度
      overallProgress: 25
    },
    status: '预期：未开始'
  }
];

console.log('=== 组织培训模拟数据状态验证测试 ===');
console.log(`当前模拟时间: ${mockCurrentTime.toLocaleString()}`);
console.log('');

trainingNotes.forEach((note, index) => {
  console.log(`测试 ${index + 1}: ${note.title}`);
  console.log(`${note.status}`);
  
  const statusInfo = getTrainingStatusInfo(note);
  
  if (statusInfo) {
    console.log(`实际状态: ${statusInfo.statusConfig.icon} ${statusInfo.statusConfig.label}`);
    console.log(`剩余天数: ${statusInfo.remainingDays}天`);
    console.log(`时间进度: ${statusInfo.currentProgress}%`);
    
    if (statusInfo.isInProgress) {
      console.log(`每日学习建议: ${statusInfo.dailyLearningTime.formattedTime}`);
    }
    
    // 验证状态是否符合预期
    let expectedStatus;
    if (note.status.includes('未开始')) expectedStatus = TRAINING_STATUS.NOT_STARTED;
    else if (note.status.includes('进行中')) expectedStatus = TRAINING_STATUS.IN_PROGRESS;
    else if (note.status.includes('已结束')) expectedStatus = TRAINING_STATUS.COMPLETED;
    
    const isCorrect = statusInfo.status === expectedStatus;
    console.log(`状态验证: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
  } else {
    console.log('❌ 无法获取状态信息');
  }
  
  console.log('---');
});

console.log('=== 测试完成 ===');