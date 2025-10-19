// 共享的“新教师教学方法培训”主题讨论消息数据
// 使用函数生成，以保持时间相对当前的动态效果

export const getNewTeacherTrainingMessages = () => ([
  {
    id: 1001,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '欢迎大家参加“新教师教学方法培训”。直播周五19:30—21:00，录播24小时内上线；研讨周日20:00；实践作业下周三截止。',
    time: new Date(Date.now() - 120 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1002,
    senderId: 'student_1',
    senderName: '学员王小明',
    content: '请问直播回放在哪里看？',
    time: new Date(Date.now() - 110 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1003,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '录播链接会发布在课程主页“资源”板块，并在群公告置顶。',
    time: new Date(Date.now() - 105 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1004,
    senderId: 'student_2',
    senderName: '学员李华',
    content: '研讨是否需要提前准备材料？',
    time: new Date(Date.now() - 100 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1005,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '需要，建议每人准备10分钟微课的教学流程与互动设计草案。',
    time: new Date(Date.now() - 95 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1006,
    senderId: 'student_3',
    senderName: '学员赵倩',
    content: '实践作业评分标准是什么？',
    time: new Date(Date.now() - 92 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1007,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '评分包含目标清晰、活动设计、评价方式、课堂管理四项，各25分；优秀≥90分。',
    time: new Date(Date.now() - 88 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1008,
    senderId: 'student_4',
    senderName: '学员周磊',
    content: '作业提交方式是什么？',
    time: new Date(Date.now() - 85 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1009,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '在“作业提交”入口上传PDF与教学演示视频，命名：姓名-学科-微课题目。',
    time: new Date(Date.now() - 82 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1010,
    senderId: 'student_5',
    senderName: '学员陈敏',
    content: '如果直播时间冲突，能否申请补课？',
    time: new Date(Date.now() - 80 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1011,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '可以，提交申请后安排周一晚补录直播，并共享录播链接。',
    time: new Date(Date.now() - 77 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1012,
    senderId: 'assistant',
    senderName: '教研助理',
    content: '已创建研讨话题“新教师课堂管理技巧”，研讨链接已置顶，欢迎提前留言。',
    time: new Date(Date.now() - 75 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1013,
    senderId: 'student_1',
    senderName: '学员王小明',
    content: '感谢！另问是否提供课堂观察表模板？',
    time: new Date(Date.now() - 72 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1014,
    senderId: 'admin',
    senderName: '培训管理员',
    content: '有的，模板与示例已更新至资源区，包含教师行为、学生参与、时间分配等维度。',
    time: new Date(Date.now() - 70 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  },
  {
    id: 1015,
    senderId: 'student_2',
    senderName: '学员李华',
    content: '好的，谢谢！',
    time: new Date(Date.now() - 68 * 60 * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    type: 'text'
  }
]);