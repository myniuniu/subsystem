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
  message,
  Divider
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
  FilterOutlined,
  BulbOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
  DownloadOutlined
} from '@ant-design/icons';

// 导入智能笔记服务
import notesService from '../services/notesService';
// 导入主题分享服务
import themeShareService from '../services/themeShareService';
import './LearningSquare.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const LearningSquare = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sharedThemes, setSharedThemes] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');

  // 测试组件是否正常加载
  useEffect(() => {
    console.log('学习广场组件已加载');
    loadSharedThemes();
  }, []);

  // 加载分享的主题
  const loadSharedThemes = () => {
    const themes = themeShareService.getLearningSquareThemes();
    setSharedThemes(themes);
  };

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

  // 处理主题点赞
  const handleThemeLike = (themeId) => {
    themeShareService.likeTheme(themeId);
    loadSharedThemes(); // 重新加载数据
    message.success('点赞成功！');
  };

  // 处理主题收藏
  const handleThemeFavorite = (theme) => {
    try {
      // 将主题保存到智能笔记的学习广场分类中
      const favoriteNote = {
        id: `theme_${theme.id}_${Date.now()}`,
        title: `主题：${theme.title}`,
        content: `收藏的主题：${theme.title}\n\n主题描述：${theme.description || '暂无描述'}\n\n收藏时间：${new Date().toLocaleString()}`,
        category: 'learning_square',
        source: '学习广场',
        tags: ['主题收藏', ...(theme.tags || [])],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        themeData: theme // 保存完整的主题数据
      };
      
      // 使用notesService保存收藏的主题
      notesService.createNote(favoriteNote);
      message.success(`主题「${theme.title}」已收藏到智能笔记！`);
    } catch (error) {
      console.error('收藏主题失败:', error);
      message.error('收藏失败，请重试');
    }
  };

  return (
    <div className="learning-square" style={{ 
      height: 'calc(100vh - 64px)', // 减去Header高度
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部搜索区域 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: '0 0 16px 16px',
        marginBottom: '16px',
        flexShrink: 0
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            🎓 学习广场
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
            发现优质课程，开启学习之旅
          </Text>
        </div>
        <Search
          placeholder="搜索课程、主题、讲师..."
          allowClear
          enterButton
          size="large"
          style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}
          onSearch={handleSearch}
        />
      </div>

      {/* 主要内容区域 - 可滚动 */}
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        padding: '0 24px'
      }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          style={{ height: '100%' }}
          tabBarStyle={{ marginBottom: '16px' }}
        >
          <TabPane 
            tab={
              <span>
                <VideoCameraOutlined />
                精品课程
              </span>
            } 
            key="courses"
          >
            <div style={{ 
              height: 'calc(100vh - 280px)', // 调整高度
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {/* 课程统计卡片 */}
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '12px' }}>
                    <Statistic
                      title="热门课程"
                      value={hotCourses.length}
                      prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '12px' }}>
                    <Statistic
                      title="学习人数"
                      value={hotCourses.reduce((sum, course) => sum + course.students, 0)}
                      prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', borderRadius: '12px' }}>
                    <Statistic
                      title="平均评分"
                      value={4.8}
                      prefix={<StarOutlined style={{ color: '#faad14' }} />}
                      valueStyle={{ color: '#faad14' }}
                      precision={1}
                    />
                  </Card>
                </Col>
              </Row>

              {/* 课程列表 */}
              <Row gutter={[16, 16]}>
                {hotCourses.map(course => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
                    <Card
                      hoverable
                      style={{ 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      cover={
                        <div style={{ 
                          height: '160px', 
                          background: course.cover.includes('Python') ? 'linear-gradient(135deg, #1890ff, #36cfc9)' : 
                                     course.cover.includes('Machine') ? 'linear-gradient(135deg, #722ed1, #eb2f96)' :
                                     course.cover.includes('React') ? 'linear-gradient(135deg, #f5222d, #fa8c16)' : 
                                     'linear-gradient(135deg, #fa8c16, #fadb14)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '16px',
                          textAlign: 'center',
                          position: 'relative'
                        }}>
                          <div style={{ 
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {course.tag}
                          </div>
                          <PlayCircleOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                          <div>{course.title}</div>
                        </div>
                      }
                      actions={[
                        <HeartOutlined key="like" onClick={() => handleCourseFavorite(course.id)} />,
                        <ShareAltOutlined key="share" onClick={() => handleCourseShare(course.id)} />,
                        <Button 
                          type="text" 
                          size="small"
                          onClick={() => handleStartLearning(course)}
                          style={{ color: '#1890ff', fontWeight: 'bold' }}
                        >
                          开始学习
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{course.instructor[0]}</Avatar>}
                        title={<div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>{course.title}</div>}
                        description={
                          <div>
                            <div style={{ marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                              {course.instructor}
                            </div>
                            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <Rate disabled defaultValue={course.rating} style={{ fontSize: '12px' }} />
                                <span style={{ marginLeft: '4px', color: '#999', fontSize: '12px' }}>
                                  {course.rating}
                                </span>
                              </div>
                              <Tag color="blue" size="small">{course.level}</Tag>
                            </div>
                            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#999' }}>
                              <ClockCircleOutlined /> {course.duration} • {course.students.toLocaleString()}人学习
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <span style={{ color: '#f5222d', fontSize: '16px', fontWeight: 'bold' }}>
                                  ¥{course.price}
                                </span>
                                {course.originalPrice && (
                                  <span style={{ 
                                    marginLeft: '8px', 
                                    color: '#999', 
                                    textDecoration: 'line-through', 
                                    fontSize: '12px' 
                                  }}>
                                    ¥{course.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <BulbOutlined />
                主题
                <Badge count={sharedThemes.length} size="small" style={{ marginLeft: '8px' }} />
              </span>
            } 
            key="themes"
          >
            <div style={{ 
              height: 'calc(100vh - 280px)', // 调整高度
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {sharedThemes.length > 0 ? (
                <>
                  {/* 主题统计 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12}>
                      <Card size="small" style={{ textAlign: 'center', borderRadius: '12px' }}>
                        <Statistic
                          title="分享主题"
                          value={sharedThemes.length}
                          prefix={<BulbOutlined style={{ color: '#52c41a' }} />}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card size="small" style={{ textAlign: 'center', borderRadius: '12px' }}>
                        <Statistic
                          title="总下载量"
                          value={sharedThemes.reduce((sum, theme) => sum + (theme.downloads || 0), 0)}
                          prefix={<DownloadOutlined style={{ color: '#1890ff' }} />}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 主题列表 */}
                  <Row gutter={[16, 16]}>
                    {sharedThemes.map((theme) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={theme.id}>
                        <Card
                          hoverable
                          style={{ 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '100%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          cover={
                            <div style={{
                              height: '120px',
                              background: `linear-gradient(135deg, ${theme.themeColors?.primary || '#1890ff'}, ${theme.themeColors?.secondary || '#36cfc9'})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              position: 'relative'
                            }}>
                              <div style={{ 
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(255,255,255,0.2)',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                fontSize: '10px'
                              }}>
                                主题
                              </div>
                              <BulbOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                              <div style={{ fontSize: '14px' }}>{theme.title}</div>
                            </div>
                          }
                          actions={[
                            <Button 
                              type="text" 
                              icon={<HeartOutlined />} 
                              onClick={() => handleThemeLike(theme.id)}
                              size="small"
                            >
                              {theme.likes || 0}
                            </Button>,
                            <Button 
                              type="text" 
                              icon={<StarOutlined />} 
                              onClick={() => handleThemeFavorite(theme)}
                              size="small"
                            >
                              收藏
                            </Button>
                          ]}
                        >
                          <Card.Meta
                            avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{theme.sharedBy?.[0] || 'U'}</Avatar>}
                            title={<div style={{ fontSize: '14px', fontWeight: 'bold' }}>{theme.title}</div>}
                            description={
                              <div>
                                <div style={{ marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                                  {theme.sharedBy || '匿名用户'}
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  <Rate disabled defaultValue={theme.rating || 5} style={{ fontSize: '12px' }} />
                                  <span style={{ marginLeft: '8px', color: '#999', fontSize: '12px' }}>
                                    {theme.rating || 5}
                                  </span>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                  {theme.tags?.map(tag => (
                                    <Tag key={tag} color="blue" size="small">{tag}</Tag>
                                  ))}
                                </div>
                                <div style={{ color: '#999', fontSize: '12px' }}>
                                  <ClockCircleOutlined /> {new Date(theme.sharedAt).toLocaleDateString()}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              ) : (
                <Empty 
                  description="暂无分享的主题"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ marginTop: '60px' }}
                >
                  <Button type="primary" icon={<BulbOutlined />}>
                    分享我的主题
                  </Button>
                </Empty>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningSquare;