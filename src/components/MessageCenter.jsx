import React, { useState } from 'react';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';
import './MessageCenter.css';

const MessageCenter = ({ contacts: propContacts }) => {
  // 联系人数据 - 使用传入的props或默认数据
  const [contacts] = useState(propContacts || [
    {
      id: 'system',
      name: '系统消息',
      type: 'system',
      avatar: '⚙️',
      lastMessage: '系统将于今晚22:00-24:00进行维护升级',
      lastTime: '2024-01-15 10:00',
      unreadCount: 2,
      online: true
    },
    {
      id: 'user1',
      name: '张老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '明天的教研会议资料准备好了吗？',
      lastTime: '2024-01-15 14:30',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user2',
      name: '李主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '课程大纲已经审核通过',
      lastTime: '2024-01-15 09:15',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user3',
      name: '王同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '文档评论已回复，请查看',
      lastTime: '2024-01-14 16:45',
      unreadCount: 3,
      online: true
    },
    {
      id: 'group1',
      name: '教研组群',
      type: 'group',
      avatar: '👥',
      lastMessage: '下周教学计划讨论',
      lastTime: '2024-01-14 15:20',
      unreadCount: 5,
      online: true
    },
    // 新增30个不同姓氏的联系人
    {
      id: 'user4',
      name: '陈老师',
      type: 'user',
      avatar: '👩‍🏫',
      lastMessage: '课件制作得很棒',
      lastTime: '2024-01-14 11:20',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user5',
      name: '刘主任',
      type: 'user',
      avatar: '👨‍💼',
      lastMessage: '会议安排已确定',
      lastTime: '2024-01-14 10:15',
      unreadCount: 2,
      online: false
    },
    {
      id: 'user6',
      name: '杨同事',
      type: 'user',
      avatar: '👩‍💻',
      lastMessage: '项目进展顺利',
      lastTime: '2024-01-14 09:30',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user7',
      name: '赵老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '学生反馈很好',
      lastTime: '2024-01-13 16:45',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user8',
      name: '黄主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '预算申请已批准',
      lastTime: '2024-01-13 15:20',
      unreadCount: 3,
      online: false
    },
    {
      id: 'user9',
      name: '周同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '技术支持及时',
      lastTime: '2024-01-13 14:10',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user10',
      name: '吴老师',
      type: 'user',
      avatar: '👩‍🏫',
      lastMessage: '教学方法很有效',
      lastTime: '2024-01-13 13:25',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user11',
      name: '徐主任',
      type: 'user',
      avatar: '👨‍💼',
      lastMessage: '工作安排合理',
      lastTime: '2024-01-13 12:40',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user12',
      name: '孙同事',
      type: 'user',
      avatar: '👩‍💻',
      lastMessage: '系统运行稳定',
      lastTime: '2024-01-13 11:55',
      unreadCount: 2,
      online: true
    },
    {
      id: 'user13',
      name: '朱老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '课程设计创新',
      lastTime: '2024-01-13 10:30',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user14',
      name: '胡主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '管理效率提升',
      lastTime: '2024-01-12 17:15',
      unreadCount: 1,
      online: false
    },
    {
      id: 'user15',
      name: '郭同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '数据分析完成',
      lastTime: '2024-01-12 16:20',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user16',
      name: '林老师',
      type: 'user',
      avatar: '👩‍🏫',
      lastMessage: '互动效果显著',
      lastTime: '2024-01-12 15:35',
      unreadCount: 3,
      online: true
    },
    {
      id: 'user17',
      name: '何主任',
      type: 'user',
      avatar: '👨‍💼',
      lastMessage: '资源配置优化',
      lastTime: '2024-01-12 14:50',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user18',
      name: '高同事',
      type: 'user',
      avatar: '👩‍💻',
      lastMessage: '功能测试通过',
      lastTime: '2024-01-12 13:25',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user19',
      name: '梁老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '教学质量优秀',
      lastTime: '2024-01-12 12:10',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user20',
      name: '郑主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '流程改进建议',
      lastTime: '2024-01-12 11:45',
      unreadCount: 2,
      online: false
    },
    {
      id: 'user21',
      name: '罗同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '界面设计美观',
      lastTime: '2024-01-12 10:30',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user22',
      name: '宋老师',
      type: 'user',
      avatar: '👩‍🏫',
      lastMessage: '学习效果明显',
      lastTime: '2024-01-11 17:20',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user23',
      name: '谢主任',
      type: 'user',
      avatar: '👨‍💼',
      lastMessage: '协调工作到位',
      lastTime: '2024-01-11 16:15',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user24',
      name: '韩同事',
      type: 'user',
      avatar: '👩‍💻',
      lastMessage: '响应速度快',
      lastTime: '2024-01-11 15:40',
      unreadCount: 3,
      online: true
    },
    {
      id: 'user25',
      name: '冯老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '教材编写完成',
      lastTime: '2024-01-11 14:25',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user26',
      name: '于主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '考核标准明确',
      lastTime: '2024-01-11 13:50',
      unreadCount: 1,
      online: false
    },
    {
      id: 'user27',
      name: '董同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '维护工作及时',
      lastTime: '2024-01-11 12:35',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user28',
      name: '萧老师',
      type: 'user',
      avatar: '👩‍🏫',
      lastMessage: '创新思路独特',
      lastTime: '2024-01-11 11:20',
      unreadCount: 2,
      online: true
    },
    {
      id: 'user29',
      name: '程主任',
      type: 'user',
      avatar: '👨‍💼',
      lastMessage: '执行力度强',
      lastTime: '2024-01-11 10:45',
      unreadCount: 0,
      online: false
    },
    {
      id: 'user30',
      name: '曹同事',
      type: 'user',
      avatar: '👩‍💻',
      lastMessage: '用户体验佳',
      lastTime: '2024-01-11 09:30',
      unreadCount: 1,
      online: true
    },
    {
      id: 'user31',
      name: '袁老师',
      type: 'user',
      avatar: '👨‍🏫',
      lastMessage: '专业水平高',
      lastTime: '2024-01-10 17:15',
      unreadCount: 0,
      online: true
    },
    {
      id: 'user32',
      name: '邓主任',
      type: 'user',
      avatar: '👩‍💼',
      lastMessage: '决策思路清晰',
      lastTime: '2024-01-10 16:40',
      unreadCount: 3,
      online: false
    },
    {
      id: 'user33',
      name: '许同事',
      type: 'user',
      avatar: '👨‍💻',
      lastMessage: '技术实现完美',
      lastTime: '2024-01-10 15:25',
      unreadCount: 0,
      online: true
    }
  ]);

  // 消息历史数据
  const [messageHistory, setMessageHistory] = useState({
    system: [
      {
        id: 1,
        senderId: 'system',
        senderName: '系统',
        content: '欢迎使用教育管理系统！您可以在这里查看系统通知和重要消息。',
        time: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 2,
        senderId: 'system',
        senderName: '系统',
        content: '系统已更新至最新版本，新增了AI助手和智能分析功能。',
        time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 3,
        senderId: 'system',
        senderName: '文档中心',
        content: '张老师对您的文档《教学计划模板》发表了评论："这个模板设计得很实用，建议推广使用。"',
        time: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 4,
        senderId: 'system',
        senderName: '文档中心',
        content: '李主任对您的文档《课程大纲》发表了评论："内容详实，符合新课标要求，已审核通过。"',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 5,
        senderId: 'system',
        senderName: '文档中心',
        content: '王同事对您的文档《教学反思》发表了评论："分析深入，对我的教学很有启发。"',
        time: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 6,
        senderId: 'system',
        senderName: '文档中心',
        content: '陈老师对您的文档《多媒体课件制作指南》发表了评论："步骤清晰，操作简单，非常实用！"',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      },
      {
        id: 7,
        senderId: 'system',
        senderName: '文档中心',
        content: '您的文档《学生评价体系》收到了新的评论，请及时查看并回复。',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'system'
      }
    ],
    user1: [
      {
        id: 3,
        senderId: 'user1',
        senderName: '张老师',
        content: '你好！请问下周的教研活动安排确定了吗？',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      },
      {
        id: 4,
        senderId: 'me',
        senderName: '我',
        content: '已经安排好了，周三下午2点在会议室A，主题是新课标解读。',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      }
    ],
    user2: [
      {
        id: 5,
        senderId: 'user2',
        senderName: '李主任',
        content: '本学期的教学计划已经审核完成，请各位老师按计划执行。',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      }
    ],
    user3: [
      {
        id: 6,
        senderId: 'user3',
        senderName: '王同事',
        content: '刚才看了你分享的课件，设计得很棒！',
        time: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      },
      {
        id: 7,
        senderId: 'user3',
        senderName: '王同事',
        content: '特别是互动环节的设计，学生应该会很喜欢。',
        time: new Date(Date.now() - 3 * 60 * 60 * 1000 + 1 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      },
      {
        id: 8,
        senderId: 'me',
        senderName: '我',
        content: '谢谢夸奖！有什么建议也可以随时交流。',
        time: new Date(Date.now() - 3 * 60 * 60 * 1000 + 2 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      }
    ],
    group1: [
      {
        id: 9,
        senderId: 'user1',
        senderName: '张老师',
        content: '大家好！本周教研组会议主要讨论期末复习安排。',
        time: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      },
      {
        id: 10,
        senderId: 'user2',
        senderName: '李主任',
        content: '好的，我会准备相关的复习资料和考试安排。',
        time: new Date(Date.now() - 6 * 60 * 60 * 1000 + 10 * 60 * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        type: 'text'
      }
    ]
  });

  const [activeContact, setActiveContact] = useState('system');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 发送消息
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      senderId: 'me',
      senderName: '我',
      content: newMessage,
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'text'
    };
    
    // 将消息添加到当前聊天记录中
    setMessageHistory(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), message]
    }));
    
    // 这里应该发送到后端，现在只是模拟
    console.log('发送消息:', message);
    setNewMessage('');
    
    // 模拟对方回复（仅对用户消息）
    if (activeContact !== 'system' && activeContact.startsWith('user')) {
      setTimeout(() => {
        const replyMessage = {
          id: Date.now() + 1,
          senderId: activeContact,
          senderName: contacts.find(c => c.id === activeContact)?.name || '对方',
          content: '收到您的消息，稍后回复',
          time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          type: 'text'
        };
        
        // 将回复消息也添加到聊天记录中
        setMessageHistory(prev => ({
          ...prev,
          [activeContact]: [...(prev[activeContact] || []), replyMessage]
        }));
        
        console.log('收到回复:', replyMessage);
      }, 2000);
    }
  };

  // 获取当前聊天记录
  const getCurrentMessages = () => {
    return messageHistory[activeContact] || [];
  };

  // 获取过滤后的联系人
  const getFilteredContacts = () => {
    if (!searchTerm) return contacts;
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 获取总未读数
  const getTotalUnreadCount = () => {
    return contacts.reduce((total, contact) => total + contact.unreadCount, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="message-center">
      <ContactList
        contacts={contacts}
        activeContact={activeContact}
        onContactSelect={setActiveContact}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalUnreadCount={getTotalUnreadCount()}
      />
      
      <ChatWindow
        activeContact={activeContact}
        contacts={contacts}
        messages={getCurrentMessages()}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default MessageCenter;