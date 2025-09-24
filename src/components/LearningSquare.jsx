import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Avatar,
  Rate,
  Carousel,
  Tabs,
  Badge,
  Statistic,
  Image,
  Empty,
  message
} from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  BookOutlined,
  RightOutlined,
  HeartOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  FilterOutlined
} from '@ant-design/icons';

// 导入智能笔记服务
import notesService from '../services/notesService';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const LearningSquare = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  // 测试组件是否正常加载
  useEffect(() => {
    console.log('学习广场组件已加载');
  }, []);

  // 热门课程数据
  const hotCourses = [
    {
      id: 1,
      title: 'Python数据分析与可视化',
      instructor: '张教授',
      avatar: 'https://via.placeholder.com/64x64/52c41a/ffffff?text=张',
      cover: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Python+Data',
      price: 299,
      originalPrice: 599,
      rating: 4.8,
      students: 12580,
      duration: '25小时',
      level: '中级',
      tag: '热销',
      description: '从零开始学习Python数据分析，掌握pandas、matplotlib等核心库'
    },
    {
      id: 2,
      title: '机器学习算法实战',
      instructor: '李博士',
      avatar: 'https://via.placeholder.com/64x64/722ed1/ffffff?text=李',
      cover: 'https://via.placeholder.com/300x200/722ed1/ffffff?text=Machine+Learning',
      price: 399,
      originalPrice: 799,
      rating: 4.9,
      students: 8960,
      duration: '35小时',
      level: '高级',
      tag: '精品',
      description: '深入学习机器学习算法原理，包含大量实战项目案例'
    },
    {
      id: 3,
      title: 'React前端开发全栈',
      instructor: '王工程师',
      avatar: 'https://via.placeholder.com/64x64/f5222d/ffffff?text=王',
      cover: 'https://via.placeholder.com/300x200/f5222d/ffffff?text=React+Development',
      price: 199,
      originalPrice: 399,
      rating: 4.7,
      students: 15670,
      duration: '30小时',
      level: '中级',
      tag: '新课',
      description: '全面掌握React生态系统，从基础到高级应用开发'
    },
    {
      id: 4,
      title: 'UI/UX设计思维与实践',
      instructor: '陈设计师',
      avatar: 'https://via.placeholder.com/64x64/fa8c16/ffffff?text=陈',
      cover: 'https://via.placeholder.com/300x200/fa8c16/ffffff?text=UI+UX+Design',
      price: 599,
      originalPrice: 999,
      rating: 4.6,
      students: 6780,
      duration: '40小时',
      level: '中级',
      tag: '推荐',
      description: '系统学习设计思维，掌握产品设计的完整流程'
    }
  ];

  // 处理搜索
  const handleSearch = (value) => {
    setSearchQuery(value);
    console.log('搜索课程:', value);
  };

  // 处理分类选择
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log('选择分类:', category);
  };

  // 处理课程点击
  const handleCourseClick = (course) => {
    console.log('点击课程:', course);
  };

  // 处理课程收藏
  const handleCourseFavorite = (courseId) => {
    console.log('收藏课程:', courseId);
  };

  // 处理课程分享
  const handleCourseShare = (courseId) => {
    console.log('分享课程:', courseId);
  };

  // 处理开始学习 - 创建智能笔记
  const handleStartLearning = async (course) => {
    try {
      console.log('开始学习课程:', course);
      
      // 检查是否已经创建过笔记
      const existingNotes = notesService.getAllNotes();
      const existingNote = existingNotes.find(note => 
        note.source === '学习广场' && note.courseId === course.id
      );
      
      if (existingNote) {
        message.warning('该课程已经在智能笔记中，请前往智能笔记-学习广场查看');
        return;
      }
      
      // 创建新笔记
      const newNote = notesService.createNoteFromCourse(course);
      
      if (newNote) {
        message.success(`成功开始学习「${course.title}」！笔记已创建在智能笔记-学习广场中`);
      } else {
        message.error('创建学习笔记失败，请重试');
      }
    } catch (error) {
      console.error('开始学习失败:', error);
      message.error('开始学习失败，请重试');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎓 学习广场
      </Title>
      
      {/* 简化版本的搜索区域 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '20px' }}>
          发现优质课程，开启学习之旅
        </Title>
        <Search
          placeholder="搜索课程、讲师、技能..."
          allowClear
          enterButton
          size="large"
          style={{ maxWidth: '500px' }}
          onSearch={handleSearch}
        />
      </div>

      {/* 简化版本的课程展示 */}
      <Row gutter={[24, 24]}>
        {hotCourses.map(course => (
          <Col xs={24} sm={12} lg={6} key={course.id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: '200px', 
                  background: course.cover.includes('Python') ? '#1890ff' : 
                             course.cover.includes('Machine') ? '#722ed1' :
                             course.cover.includes('React') ? '#f5222d' : '#fa8c16',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  {course.title}
                </div>
              }
              actions={[
                <HeartOutlined key="like" onClick={() => handleCourseFavorite(course.id)} />,
                <ShareAltOutlined key="share" onClick={() => handleCourseShare(course.id)} />,
                <PlayCircleOutlined key="play" onClick={() => handleCourseClick(course)} />
              ]}
            >
              <Card.Meta
                avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{course.instructor[0]}</Avatar>}
                title={<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{course.title}</div>}
                description={
                  <div>
                    <div style={{ marginBottom: '8px', color: '#666' }}>{course.instructor}</div>
                    <div style={{ marginBottom: '8px' }}>
                      <Rate disabled defaultValue={course.rating} style={{ fontSize: '12px' }} />
                      <span style={{ marginLeft: '8px', color: '#999', fontSize: '12px' }}>{course.rating}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Tag color="blue" size="small">{course.level}</Tag>
                      <span style={{ marginLeft: '8px', color: '#999', fontSize: '12px' }}>
                        <ClockCircleOutlined /> {course.duration}
                      </span>
                    </div>
                    <div style={{ color: '#f5222d', fontSize: '16px', fontWeight: 'bold' }}>
                      ¥{course.price}
                      {course.originalPrice && (
                        <span style={{ 
                          marginLeft: '8px', 
                          color: '#999', 
                          textDecoration: 'line-through', 
                          fontSize: '14px' 
                        }}>
                          ¥{course.originalPrice}
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <Button 
                        type="primary" 
                        size="small"
                        block
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartLearning(course);
                        }}
                        style={{ 
                          borderRadius: '6px',
                          fontWeight: 'bold'
                        }}
                      >
                        开始学习
                      </Button>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Button type="primary" size="large" icon={<RightOutlined />}>
          查看更多课程
        </Button>
      </div>
    </div>
  );
};

export default LearningSquare;