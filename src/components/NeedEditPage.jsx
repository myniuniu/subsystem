import React, { useState, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  Space,
  message,
  Upload,
  List,
  Card,
  Divider,
  Tag,
  Avatar,
  Tooltip,
  Select,
  Row,
  Col,
  Modal,
  Checkbox,
  Popconfirm,
  Dropdown
} from 'antd';
import MaterialAddPage from './MaterialAddPage';
import ExploreModal from './ExploreModal';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  LinkOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
  RobotOutlined,
  UserOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  GlobalOutlined,
  MoreOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NeedEditPage = ({ onBack, onViewChange, selectedNeed, mode = 'create' }) => {
  // 资料收集相关状态
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: '教师专业发展指导手册.pdf', type: 'application/pdf', uploadTime: '刚刚' },
    { id: 2, name: '现代教育技术应用培训资料.pdf', type: 'application/pdf', uploadTime: '2分钟前' },
    { id: 3, name: '核心素养导向的课程设计指南.pdf', type: 'application/pdf', uploadTime: '5分钟前' }
  ]);
  
  // 多选功能状态
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [links, setLinks] = useState([
    { id: 2, url: 'https://teacher-training.edu.cn', title: '教师培训资源平台', addTime: '刚刚' },
    { id: 3, url: 'https://education-tech.org', title: '教育技术发展研究网', addTime: '3分钟前' },
    { id: 4, url: 'https://core-competency.edu', title: '核心素养教育资源库', addTime: '8分钟前' }
  ]);
  const [newLink, setNewLink] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMaterialAddModal, setShowMaterialAddModal] = useState(false);
  const [websiteType, setWebsiteType] = useState('normal'); // 'normal' 或 'video'
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  // 文字内容相关状态
  const [textContent, setTextContent] = useState('');
  const [addedTexts, setAddedTexts] = useState([
    { 
      id: 4, 
      title: '教师培训需求分析', 
      content: '在教育改革不断深化、教育技术飞速发展的当下，传统的教学模式和教师知识结构已难以完全适配新时代教育教学的要求。当前，部分教师在教学过程中面临诸多挑战，例如，对核心素养导向的课程设计理解不够深入，难以将核心素养有效融入课堂教学环节；在运用多媒体、人工智能等现代教育技术辅助教学时，存在操作不熟练、应用方式单一等问题，无法充分发挥技术对教学的赋能作用；同时，面对学生个性化发展需求日益增长的情况，教师在差异化教学策略的制定与实施方面能力不足，难以满足不同学习层次、不同兴趣特长学生的学习需求。此外，随着教育评价体系的不断完善，教师对新型教育评价方法的掌握和运用也存在欠缺，影响了教学质量的进一步提升。为解决上述问题，助力教师提升专业素养和教学能力，更好地适应教育发展新形势，特开展本次教师培训。', 
      addTime: '刚刚' 
    },
    { 
      id: 5, 
      title: '教师信息技术能力提升方案', 
      content: '随着信息技术在教育领域的深度融合，教师的信息技术应用能力已成为影响教学质量的关键因素。本方案旨在通过系统性培训，帮助教师掌握现代教育技术工具的使用方法，提升数字化教学设计能力，培养创新教学思维。培训内容包括：多媒体课件制作技巧、在线教学平台操作、教学资源数字化处理、学习分析与数据驱动教学、人工智能辅助教学应用等核心模块。通过理论学习与实践操作相结合的方式，确保教师能够熟练运用信息技术优化教学过程，提高教学效果。', 
      addTime: '10分钟前' 
    },
    { 
      id: 6, 
      title: '差异化教学策略研究', 
      content: '面对学生个体差异日益显著的教学现实，传统的"一刀切"教学模式已无法满足所有学生的学习需求。差异化教学作为一种以学生为中心的教学理念，强调根据学生的学习风格、能力水平、兴趣特点等因素，灵活调整教学内容、方法和评价方式。本研究通过分析不同类型学生的学习特征，提出了多元化的教学策略：包括分层教学法、合作学习模式、项目式学习、翻转课堂等创新教学方法。同时，探讨了如何运用学习分析技术，实现精准教学和个性化学习支持，为教师实施差异化教学提供科学依据和实践指导。', 
      addTime: '15分钟前' 
    }
  ]);
  
  // 课程视频相关状态
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [courseVideos, setCourseVideos] = useState([
    { id: 4, title: '现代教学方法与技巧', url: 'https://edu-video.com/modern-teaching', addTime: '刚刚' },
    { id: 5, title: '信息技术与课程整合', url: 'https://edu-video.com/tech-integration', addTime: '5分钟前' },
    { id: 6, title: '学生心理发展与教育', url: 'https://edu-video.com/student-psychology', addTime: '12分钟前' }
  ]);

  // 研究论文相关状态
  const [researchPapers, setResearchPapers] = useState([
    { 
      id: 1, 
      title: '基于核心素养的教师专业发展研究', 
      authors: '张明华, 李晓红, 王建国', 
      journal: '教育研究', 
      year: '2023', 
      abstract: '本研究基于核心素养理念，构建了教师专业发展的理论框架，通过对500名中小学教师的调研，分析了当前教师在核心素养导向教学中面临的挑战，提出了系统性的专业发展路径和策略建议。',
      keywords: ['核心素养', '教师专业发展', '教学能力', '培训体系'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '信息技术与教育教学深度融合的实证研究', 
      authors: '陈志强, 刘美玲', 
      journal: '中国电化教育', 
      year: '2023', 
      abstract: '研究采用混合研究方法，深入分析了信息技术在教育教学中的应用现状，识别了技术融合的关键影响因素，构建了深度融合的评价指标体系，为教师信息技术能力提升提供了科学依据。',
      keywords: ['信息技术', '教育融合', '数字化教学', '教师培训'],
      addTime: '5分钟前' 
    },
    { 
      id: 3, 
      title: '差异化教学策略对学生学习效果的影响研究', 
      authors: '赵丽娟, 孙文博, 马晓峰', 
      journal: '教育科学研究', 
      year: '2022', 
      abstract: '通过准实验设计，比较分析了差异化教学策略与传统教学方法对不同类型学生学习效果的影响，结果表明差异化教学能显著提升学生的学习动机和学业成就，为教师实施个性化教学提供了实证支持。',
      keywords: ['差异化教学', '个性化学习', '学习效果', '教学策略'],
      addTime: '10分钟前' 
    }
  ]);

  // 调研报告相关状态
  const [surveys, setSurveys] = useState([
    { 
      id: 1, 
      title: '2023年全国中小学教师培训需求调研报告', 
      organization: '教育部教师工作司', 
      date: '2023年8月', 
      summary: '本次调研覆盖全国31个省市自治区，共收集有效问卷15,847份。调研发现，教师在信息技术应用、学科教学能力、学生心理健康教育等方面存在较大培训需求，其中67%的教师希望加强现代教育技术培训。',
      keyFindings: ['信息技术应用能力不足', '缺乏差异化教学方法', '学生心理健康教育知识欠缺', '教育评价方法单一'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '教师专业发展现状与需求分析报告', 
      organization: '中国教育科学研究院', 
      date: '2023年6月', 
      summary: '通过深度访谈和问卷调查相结合的方式，对1,200名一线教师进行了专业发展现状调研。结果显示，教师普遍认为当前培训内容与实际教学需求存在脱节，希望获得更多实用性强的培训内容。',
      keyFindings: ['培训内容实用性不强', '培训形式单一', '缺乏持续跟踪指导', '评价反馈机制不完善'],
      addTime: '8分钟前' 
    },
    { 
      id: 3, 
      title: '数字化时代教师能力素养调研分析', 
      organization: '华东师范大学教育学部', 
      date: '2023年4月', 
      summary: '针对数字化转型背景下教师能力素养现状进行深入调研，发现教师在数字化教学设计、在线教学实施、学习数据分析等方面能力有待提升，建议建立分层分类的数字化能力培训体系。',
      keyFindings: ['数字化教学设计能力薄弱', '在线教学技能不足', '数据分析应用缺乏', '数字化评价方法陌生'],
      addTime: '15分钟前' 
    }
  ]);

  // 案例研究相关状态
  const [caseStudies, setCaseStudies] = useState([
    { 
      id: 1, 
      title: '北京市海淀区教师信息技术能力提升培训案例', 
      location: '北京市海淀区', 
      duration: '2022年9月-2023年6月', 
      participants: '全区中小学教师2,800人', 
      description: '海淀区教委实施的大规模教师信息技术能力提升培训项目，采用"理论学习+实践操作+跟踪指导"的培训模式，取得显著成效。',
      methods: ['分层培训', '项目式学习', '同伴互助', '专家指导'],
      outcomes: ['教师信息技术应用能力显著提升', '数字化教学资源使用率提高85%', '学生学习效果明显改善', '形成可复制推广的培训模式'],
      addTime: '刚刚' 
    },
    { 
      id: 2, 
      title: '上海市浦东新区差异化教学实践案例', 
      location: '上海市浦东新区', 
      duration: '2022年3月-2023年2月', 
      participants: '试点学校教师450人', 
      description: '浦东新区选取15所试点学校，开展差异化教学策略培训与实践，通过课堂观察、学生访谈等方式评估培训效果，形成了系统的差异化教学实施方案。',
      methods: ['行动研究', '课例研讨', '反思总结', '经验分享'],
      outcomes: ['教师差异化教学意识增强', '个性化教学策略更加丰富', '学生学习积极性提高', '教学质量稳步提升'],
      addTime: '12分钟前' 
    },
    { 
      id: 3, 
      title: '深圳市南山区教师专业学习共同体建设案例', 
      location: '深圳市南山区', 
      duration: '2021年9月-2023年7月', 
      participants: '区内各学科教师1,200人', 
      description: '南山区教育局构建了以学科为纽带的教师专业学习共同体，通过定期研讨、课题研究、成果分享等活动，促进教师专业成长和教学质量提升。',
      methods: ['学习共同体', '课题研究', '同课异构', '成果展示'],
      outcomes: ['教师专业发展内驱力增强', '学科教学水平整体提升', '形成浓厚的研究氛围', '建立可持续发展机制'],
      addTime: '20分钟前' 
    }
  ]);
  
  // 问答区域相关状态
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 快捷操作相关状态
  const [quickActions] = useState([
    { key: 'summarize', label: '内容总结', icon: <FileTextOutlined /> },
    { key: 'extract', label: '关键信息提取', icon: <CopyOutlined /> },
    { key: 'translate', label: '翻译', icon: <ShareAltOutlined /> },
    { key: 'analyze', label: '深度分析', icon: <RobotOutlined /> }
  ]);
  
  // 操作结果相关状态
  const [operationResults, setOperationResults] = useState([]);
  
  // 操作面板相关状态
  const [selectedOperation, setSelectedOperation] = useState('audio'); // 当前选中的操作类型
  
  // 探索弹窗相关状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  
  // 操作记录状态
  const [operationRecords, setOperationRecords] = useState({
    audio: [],
    video: [],
    mindmap: [],
    'training-plan': [
      {
        id: 1001,
        title: '培训方案设计与实施指南',
        source: '培训管理系统',
        time: '刚刚',
        type: 'training-plan',
        content: `
          <h3 style="color: #1890ff; margin-bottom: 15px;">📋 企业培训方案设计框架</h3>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f8ff; border-radius: 8px;">
            <h4 style="color: #1890ff; margin-bottom: 10px;">🎯 培训目标设定</h4>
            <div style="margin-left: 15px;">
              <p><strong>总体目标：</strong>提升员工综合素质和专业技能，增强企业核心竞争力</p>
              <p><strong>具体目标：</strong></p>
              <ul style="margin-left: 20px;">
                <li>提高管理人员的领导力和决策能力</li>
                <li>增强技术人员的专业技能和创新能力</li>
                <li>培养员工的团队协作和沟通技巧</li>
                <li>建立学习型组织文化</li>
              </ul>
            </div>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background-color: #fff7e6; border-radius: 8px;">
            <h4 style="color: #fa8c16; margin-bottom: 10px;">📚 课程体系设计</h4>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">培训模块</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">课程内容</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">学时</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">目标人群</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">管理技能</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">领导力、决策分析、团队管理</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">40学时</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">中高层管理者</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">专业技能</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">技术更新、工艺改进、质量控制</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">60学时</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">技术人员</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">通用技能</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">沟通协调、时间管理、创新思维</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">30学时</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">全体员工</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">企业文化</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">价值观传递、制度解读、团队建设</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">20学时</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">新员工</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background-color: #f6ffed; border-radius: 8px;">
            <h4 style="color: #52c41a; margin-bottom: 10px;">👨‍🏫 师资配置方案</h4>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 10px;">
              <div style="flex: 1; margin: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>内部讲师：</strong>60%<br>
                <small>企业高管、技术专家、优秀员工</small>
              </div>
              <div style="flex: 1; margin: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>外部专家：</strong>30%<br>
                <small>行业专家、咨询顾问、高校教授</small>
              </div>
              <div style="flex: 1; margin: 5px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>在线课程：</strong>10%<br>
                <small>知名平台、专业机构、认证课程</small>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f0ff; border-radius: 8px;">
            <h4 style="color: #722ed1; margin-bottom: 10px;">🎓 培训方式选择</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div style="padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>线下培训</strong>
                <ul style="margin: 5px 0 0 15px; font-size: 12px;">
                  <li>面授课程</li>
                  <li>工作坊</li>
                  <li>实地考察</li>
                  <li>导师制</li>
                </ul>
              </div>
              <div style="padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>线上培训</strong>
                <ul style="margin: 5px 0 0 15px; font-size: 12px;">
                  <li>在线课程</li>
                  <li>直播培训</li>
                  <li>微课学习</li>
                  <li>移动学习</li>
                </ul>
              </div>
              <div style="padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>混合式培训</strong>
                <ul style="margin: 5px 0 0 15px; font-size: 12px;">
                  <li>翻转课堂</li>
                  <li>项目制学习</li>
                  <li>行动学习</li>
                  <li>案例研讨</li>
                </ul>
              </div>
              <div style="padding: 10px; background: white; border-radius: 4px; border: 1px solid #d9d9d9;">
                <strong>实践培训</strong>
                <ul style="margin: 5px 0 0 15px; font-size: 12px;">
                  <li>岗位轮换</li>
                  <li>项目参与</li>
                  <li>技能竞赛</li>
                  <li>经验分享</li>
                </ul>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background-color: #fff1f0; border-radius: 8px;">
            <h4 style="color: #f5222d; margin-bottom: 10px;">📊 效果评估体系</h4>
            <div style="margin-bottom: 15px;">
              <h5 style="color: #f5222d; margin-bottom: 8px;">柯氏四级评估模型</h5>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">评估层级</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">评估内容</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">评估方法</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">权重</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 6px;">反应层</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">学员满意度</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">问卷调查、访谈</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">20%</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 6px;">学习层</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">知识技能掌握</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">考试测评、技能演示</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">30%</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 6px;">行为层</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">行为改变程度</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">360度评估、观察记录</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">30%</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 6px;">结果层</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">业务成果改善</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">绩效指标、ROI分析</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-bottom: 20px; padding: 15px; background-color: #e6fffb; border-radius: 8px;">
            <h4 style="color: #13c2c2; margin-bottom: 10px;">⏰ 实施时间安排</h4>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div style="margin: 5px 0;"><strong>方案制定：</strong>1-2周</div>
              <div style="margin: 5px 0;"><strong>资源准备：</strong>2-3周</div>
              <div style="margin: 5px 0;"><strong>培训实施：</strong>3-6个月</div>
              <div style="margin: 5px 0;"><strong>效果评估：</strong>持续进行</div>
            </div>
          </div>

          <div style="margin-top: 15px; padding: 10px; background-color: #feffe6; border-radius: 8px;">
            <p style="margin: 0; color: #a0d911;"><strong>💡 实施建议：</strong>建立培训管理委员会，制定详细的实施计划，确保各部门协调配合。定期收集反馈，及时调整培训内容和方式，确保培训效果最大化。</p>
          </div>
        `
      }
    ],
    report: [
      {
        id: 1002,
        title: '培训课表安排与时间管理',
        source: '课程管理系统',
        time: '刚刚',
        type: 'report',
        content: `
          <h3 style="color: #1890ff; margin-bottom: 15px;">📹 录播视频课程安排表</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">课程序号</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">视频课程名称</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">主讲教师</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">视频时长</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">课程类型</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">观看状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">01</td>
                <td style="border: 1px solid #ddd; padding: 10px;">企业管理基础理论精讲</td>
                <td style="border: 1px solid #ddd; padding: 10px;">李教授</td>
                <td style="border: 1px solid #ddd; padding: 10px;">180分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #e6f7ff; color: #1890ff; padding: 2px 8px; border-radius: 4px;">理论课程</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px;">✓ 可观看</span></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">02</td>
                <td style="border: 1px solid #ddd; padding: 10px;">团队协作与沟通技巧实战</td>
                <td style="border: 1px solid #ddd; padding: 10px;">王老师</td>
                <td style="border: 1px solid #ddd; padding: 10px;">165分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #fff7e6; color: #fa8c16; padding: 2px 8px; border-radius: 4px;">实操课程</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px;">✓ 可观看</span></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">03</td>
                <td style="border: 1px solid #ddd; padding: 10px;">项目管理实务案例解析</td>
                <td style="border: 1px solid #ddd; padding: 10px;">张经理</td>
                <td style="border: 1px solid #ddd; padding: 10px;">195分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f9f0ff; color: #722ed1; padding: 2px 8px; border-radius: 4px;">案例课程</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px;">✓ 可观看</span></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">04</td>
                <td style="border: 1px solid #ddd; padding: 10px;">创新思维与问题解决方法</td>
                <td style="border: 1px solid #ddd; padding: 10px;">陈专家</td>
                <td style="border: 1px solid #ddd; padding: 10px;">120分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #fff1f0; color: #f5222d; padding: 2px 8px; border-radius: 4px;">思维训练</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px;">✓ 可观看</span></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">05</td>
                <td style="border: 1px solid #ddd; padding: 10px;">数字化转型与应用实践</td>
                <td style="border: 1px solid #ddd; padding: 10px;">刘顾问</td>
                <td style="border: 1px solid #ddd; padding: 10px;">135分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #e6fffb; color: #13c2c2; padding: 2px 8px; border-radius: 4px;">技术课程</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px;">✓ 可观看</span></td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">06</td>
                <td style="border: 1px solid #ddd; padding: 10px;">综合能力测评与总结</td>
                <td style="border: 1px solid #ddd; padding: 10px;">全体教师</td>
                <td style="border: 1px solid #ddd; padding: 10px;">90分钟</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #feffe6; color: #a0d911; padding: 2px 8px; border-radius: 4px;">测评课程</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="background: #fff2e8; color: #fa541c; padding: 2px 8px; border-radius: 4px;">⏳ 待开放</span></td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f8ff; border-radius: 8px;">
            <h4 style="color: #1890ff; margin-bottom: 10px;">📊 录播课程统计信息</h4>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <div style="margin: 5px 0;"><strong>课程总数：</strong>6门</div>
              <div style="margin: 5px 0;"><strong>总视频时长：</strong>885分钟（约14.75小时）</div>
              <div style="margin: 5px 0;"><strong>主讲教师：</strong>5位</div>
              <div style="margin: 5px 0;"><strong>可观看课程：</strong>5门</div>
            </div>
          </div>
          <div style="margin-top: 15px; padding: 10px; background-color: #fff7e6; border-radius: 8px;">
            <p style="margin: 0; color: #d48806;"><strong>📝 观看须知：</strong>所有录播视频课程支持随时观看，建议按序号顺序学习。每门课程观看完毕后请完成相应的课后练习。最后一门测评课程将在前5门课程全部完成后开放。</p>
          </div>
          <div style="margin-top: 10px; padding: 10px; background-color: #f6ffed; border-radius: 8px;">
            <p style="margin: 0; color: #389e0d;"><strong>🎯 学习建议：</strong>建议每天观看1-2门课程，合理安排学习进度。视频支持倍速播放、暂停回看等功能，可根据个人学习节奏调整。</p>
          </div>
        `
      },
      {
        id: 1003,
        title: '参训人员清单',
        source: '人员管理系统',
        time: '刚刚',
        type: 'report',
        content: `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">姓名</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">部门</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">职位</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">工作年限</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">培训需求</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">联系方式</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">张明</td>
                <td style="border: 1px solid #ddd; padding: 10px;">技术部</td>
                <td style="border: 1px solid #ddd; padding: 10px;">高级工程师</td>
                <td style="border: 1px solid #ddd; padding: 10px;">5年</td>
                <td style="border: 1px solid #ddd; padding: 10px;">项目管理、团队协作</td>
                <td style="border: 1px solid #ddd; padding: 10px;">zhangming@company.com</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">李华</td>
                <td style="border: 1px solid #ddd; padding: 10px;">市场部</td>
                <td style="border: 1px solid #ddd; padding: 10px;">市场专员</td>
                <td style="border: 1px solid #ddd; padding: 10px;">3年</td>
                <td style="border: 1px solid #ddd; padding: 10px;">数据分析、营销策略</td>
                <td style="border: 1px solid #ddd; padding: 10px;">lihua@company.com</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">王芳</td>
                <td style="border: 1px solid #ddd; padding: 10px;">人事部</td>
                <td style="border: 1px solid #ddd; padding: 10px;">人事主管</td>
                <td style="border: 1px solid #ddd; padding: 10px;">7年</td>
                <td style="border: 1px solid #ddd; padding: 10px;">法律法规、绩效管理</td>
                <td style="border: 1px solid #ddd; padding: 10px;">wangfang@company.com</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">刘强</td>
                <td style="border: 1px solid #ddd; padding: 10px;">财务部</td>
                <td style="border: 1px solid #ddd; padding: 10px;">财务分析师</td>
                <td style="border: 1px solid #ddd; padding: 10px;">4年</td>
                <td style="border: 1px solid #ddd; padding: 10px;">财务软件、风险控制</td>
                <td style="border: 1px solid #ddd; padding: 10px;">liuqiang@company.com</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">陈静</td>
                <td style="border: 1px solid #ddd; padding: 10px;">客服部</td>
                <td style="border: 1px solid #ddd; padding: 10px;">客服经理</td>
                <td style="border: 1px solid #ddd; padding: 10px;">6年</td>
                <td style="border: 1px solid #ddd; padding: 10px;">沟通技巧、客户关系</td>
                <td style="border: 1px solid #ddd; padding: 10px;">chenjing@company.com</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            <strong>统计信息：</strong>共5名参训人员，涵盖技术部、市场部、人事部、财务部、客服部等5个部门。
            平均工作年限：5年。主要培训需求集中在管理技能、专业技术和沟通协作等方面。
          </p>
        `
      }
    ],
    ppt: [],
    webcode: [],
    file: [],
    text: [],
    link: []
  });

  // 内容查看弹窗状态
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalContent, setModalContent] = useState('');

  // 预览功能状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState('');
  
  // Hover状态管理 - 统一管理所有项目的hover状态
  const [hoveredItems, setHoveredItems] = useState({});
  const [previewData, setPreviewData] = useState(null);
  
  // 智能需求相关状态
  const [smartNotes, setSmartNotes] = useState([]);
  const [showSmartNotesModal, setShowSmartNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // 编辑模式相关状态
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [needTitle, setNeedTitle] = useState('');
  const [needContent, setNeedContent] = useState('');

  // 初始化编辑数据
  useEffect(() => {
    if (selectedNeed && mode === 'edit') {
      setNeedTitle(selectedNeed.title || '');
      setNeedContent(selectedNeed.content || '');
      // 如果有其他需要预填充的数据，也在这里设置
      if (selectedNeed.materials) {
        setUploadedFiles(selectedNeed.materials || []);
      }
      if (selectedNeed.links) {
        setLinks(selectedNeed.links || []);
      }
      if (selectedNeed.texts) {
        setAddedTexts(selectedNeed.texts || []);
      }
      if (selectedNeed.videos) {
        setCourseVideos(selectedNeed.videos || []);
      }
    }
  }, [selectedNeed, mode]);

  // 保存需求
  const handleSaveNeed = () => {
    if (!needTitle.trim()) {
      message.error('请输入需求标题');
      return;
    }
    
    const needData = {
      id: selectedNeed?.id || Date.now(),
      title: needTitle,
      content: needContent,
      materials: uploadedFiles,
      links: links,
      texts: addedTexts,
      videos: courseVideos,
      updateTime: new Date().toLocaleString()
    };

    // 这里可以调用保存API
    message.success(mode === 'edit' ? '需求更新成功' : '需求创建成功');
    
    // 返回上一页
    if (onBack) {
      onBack();
    }
  };

  // 处理探索功能
  const handleExplore = (exploreData) => {
    const { query, source } = exploreData;
    
    // 模拟探索结果
    const mockResults = {
      web: [
        {
          id: Date.now() + 1,
          title: `关于"${query}"的网络资源`,
          url: `https://search.example.com/q=${encodeURIComponent(query)}`,
          content: `通过网络搜索找到的关于"${query}"的相关内容...`,
          addTime: '刚刚',
          source: 'Web搜索'
        }
      ],
      'google-drive': [
        {
          id: Date.now() + 2,
          title: `Google云端硬盘中的"${query}"相关文档`,
          url: `https://drive.google.com/search?q=${encodeURIComponent(query)}`,
          content: `从Google云端硬盘中找到的关于"${query}"的文档...`,
          addTime: '刚刚',
          source: 'Google云端硬盘'
        }
      ]
    };
    
    // 根据选择的来源添加结果到对应的资料列表
    const results = mockResults[source] || [];
    
    if (results.length > 0) {
      // 添加到链接列表
      setLinks(prev => [...results.map(r => ({
        id: r.id,
        url: r.url,
        title: r.title,
        addTime: r.addTime
      })), ...prev]);
      
      // 添加到文本内容列表
      setAddedTexts(prev => [...results.map(r => ({
        id: r.id + 1000,
        title: r.title,
        content: r.content,
        addTime: r.addTime,
        source: r.source
      })), ...prev]);
      
      message.success(`成功从${source === 'web' ? 'Web' : 'Google云端硬盘'}探索到${results.length}条相关资源`);
    } else {
      message.info('未找到相关资源，请尝试其他关键词');
    }
  };

  // 操作按钮点击处理函数
  const handleOperationClick = (operationType) => {
    const operationTitles = {
      audio: '音频概览',
      video: '视频概览', 
      mindmap: '思维导图',
      report: '分析报告',
      ppt: 'PPT演示',
      webcode: '网页代码',
      'training-plan': '培训方案',
      schedule: '课表',
      participants: '参训人员清单'
    };

    // 计算所有资料的总数
    const totalMaterials = uploadedFiles.length + addedTexts.length + courseVideos.length + links.length;

    // 对于培训方案，使用独立的培训方案类型；对于课表、参训人员，生成报告类型的操作记录
    const recordType = operationType === 'training-plan' ? 'training-plan' : 
                      ['schedule', 'participants'].includes(operationType) ? 'report' : operationType;

    const newRecord = {
      id: Date.now(),
      title: `基于${totalMaterials}个资料生成${operationTitles[operationType]}`,
      source: `${totalMaterials}个来源`,
      time: '刚刚',
      type: operationType === 'training-plan' ? 'training-plan' : recordType
    };

    setOperationRecords(prev => ({
      ...prev,
      [recordType]: [newRecord, ...prev[recordType]]
    }));

    message.success(`${operationTitles[operationType]}已生成并添加到操作记录`);
  };

  // 保存AI回复到需求
  const handleSaveToNote = (content) => {
    const newRecord = {
      id: Date.now(),
      title: `AI问答需求 - ${new Date().toLocaleString()}`,
      source: 'AI智能问答',
      time: '刚刚',
      type: 'report',
      content: content
    };

    setOperationRecords(prev => ({
      ...prev,
      report: [newRecord, ...prev.report]
    }));

    message.success('AI回复已保存到需求');
  };

  // 处理更多操作菜单点击
  const handleMoreAction = (action, record) => {
    switch (action) {
      case 'submit':
        // 提交培训方案
        message.loading('正在提交培训方案...', 1);
        setTimeout(() => {
          message.success(`培训方案"${record.title}"已成功提交！`);
          // 这里可以添加实际的提交逻辑，比如调用API
          console.log('提交培训方案:', record);
        }, 1000);
        break;
      case 'convertToSource':
        // 将操作记录转换为资料来源
        const newMaterial = {
          id: Date.now(),
          title: record.title,
          content: record.content || `来源于操作记录：${record.title}`,
          addTime: '刚刚',
          source: record.source || '操作记录转换'
        };
        
        // 根据记录类型添加到对应的资料数组
        if (record.type === 'report' || record.type === 'mindmap' || record.type === 'training-plan') {
          setAddedTexts(prev => [newMaterial, ...prev]);
        } else if (record.type === 'video' || record.type === 'audio') {
          setCourseVideos(prev => [{
            ...newMaterial,
            url: record.url || 'https://converted-from-record.com'
          }, ...prev]);
        } else {
          setAddedTexts(prev => [newMaterial, ...prev]);
        }
        
        message.success(`已将"${record.title}"转换为来源并保存到资料`);
        break;
      case 'delete':
        // 从操作记录中删除该记录
        setOperationRecords(prev => {
          const newRecords = { ...prev };
          Object.keys(newRecords).forEach(type => {
            newRecords[type] = newRecords[type].filter(r => r.id !== record.id);
          });
          return newRecords;
        });
        message.success(`已删除"${record.title}"`);
        break;
      default:
        break;
    }
  };

  // 获取更多操作菜单项
  const getMoreMenuItems = (record) => {
    const commonItems = [
      {
        key: 'delete',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🗑️</span>
            <span>删除</span>
          </div>
        ),
        onClick: () => handleMoreAction('delete', record)
      }
    ];

    // 培训方案类型添加提交按钮
    if (record.type === 'training-plan') {
      return [
        {
          key: 'submit',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📤</span>
              <span>提交</span>
            </div>
          ),
          onClick: () => handleMoreAction('submit', record)
        },
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertToSource', record)
        },
        ...commonItems
      ];
    }

    // 报告类型添加额外选项
    if (record.type === 'report') {
      return [
        {
          key: 'convertToSource',
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <span>转换为来源</span>
            </div>
          ),
          onClick: () => handleMoreAction('convertToSource', record)
        },
        ...commonItems
      ];
    }

    return commonItems;
  };

  // 处理记录点击打开
  const handleRecordClick = (record) => {
    setCurrentRecord(record);
    
    // 直接显示记录的内容，不进行包装
    if (record.content) {
      setModalContent(record.content);
    } else {
      // 如果没有内容，显示简单的提示
      setModalContent(`
        <div style="padding: 20px; text-align: center; color: #999;">
          <p>暂无具体内容</p>
        </div>
      `);
    }
    
    setShowContentModal(true);
  };

  // 文件上传处理
  const handleFileUpload = (info) => {
    const { status, originFileObj, response } = info.file;
    
    if (status === 'done') {
      const newFile = {
        id: Date.now(),
        name: originFileObj.name,
        size: originFileObj.size,
        type: originFileObj.type,
        uploadTime: new Date().toISOString(),
        content: '文件内容预览...'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      message.success(`${originFileObj.name} 上传成功`);
    } else if (status === 'error') {
      message.error(`${originFileObj.name} 上传失败`);
    }
  };

  // 添加链接
  const handleAddLink = () => {
    if (!newLink.trim()) {
      message.warning('请输入有效的链接地址');
      return;
    }
    
    const linkObj = {
      id: Date.now(),
      url: newLink,
      title: '链接标题',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, linkObj]);
    setNewLink('');
    message.success('链接添加成功');
  };

  // 添加网站地址处理函数
  const handleAddWebsite = () => {
    if (!websiteUrl.trim()) {
      message.warning('请输入有效的网站地址');
      return;
    }

    // 验证视频网站地址
    if (websiteType === 'video') {
      const isBilibili = websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv');
      const isXiaohongshu = websiteUrl.includes('xiaohongshu.com') || websiteUrl.includes('xhslink.com');
      
      if (!isBilibili && !isXiaohongshu) {
        message.warning('视频地址仅支持B站和小红书链接');
        return;
      }
    }
    
    const websiteObj = {
      id: Date.now(),
      url: websiteUrl,
      type: websiteType,
      title: websiteType === 'video' ? '视频链接' : '网站链接',
      platform: websiteType === 'video' ? 
        (websiteUrl.includes('bilibili.com') || websiteUrl.includes('b23.tv') ? 'B站' : '小红书') : 
        '普通网站',
      addTime: new Date().toISOString()
    };
    
    setLinks(prev => [...prev, websiteObj]);
    setWebsiteUrl('');
     message.success(`${websiteType === 'video' ? '视频' : '网站'}地址添加成功`);
   };

   // 添加文字内容处理函数
   const handleAddText = () => {
     if (!textContent.trim()) {
       message.warning('请输入文字内容');
       return;
     }

     const textObj = {
       id: Date.now(),
       content: textContent.trim(),
       type: 'text',
       title: textContent.trim().length > 20 ? textContent.trim().substring(0, 20) + '...' : textContent.trim(),
       addTime: new Date().toISOString()
     };

     setAddedTexts(prev => [...prev, textObj]);
     setTextContent('');
     message.success('文字内容添加成功');
   };

   // 删除文字内容
   const handleDeleteText = (textId) => {
     setAddedTexts(prev => prev.filter(text => text.id !== textId));
     message.success('文字内容删除成功');
   };

   // 添加课程视频
   const handleAddVideo = () => {
     if (!videoTitle.trim()) {
       message.error('请输入视频标题');
       return;
     }
     if (!videoUrl.trim()) {
       message.error('请输入视频链接');
       return;
     }

     // 简单的URL验证
     const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/;
     if (!urlPattern.test(videoUrl)) {
       message.error('请输入有效的视频链接');
       return;
     }

     const videoObj = {
       id: Date.now(),
       title: videoTitle.trim(),
       url: videoUrl.trim(),
       addedAt: new Date().toLocaleString()
     };

     setCourseVideos(prev => [...prev, videoObj]);
     setVideoTitle('');
     setVideoUrl('');
     message.success('课程视频添加成功');
   };

   // 删除课程视频
   const handleDeleteVideo = (videoId) => {
     setCourseVideos(prev => prev.filter(video => video.id !== videoId));
     message.success('课程视频删除成功');
   };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `基于您上传的资料，我理解您的问题是："${inputMessage}"。根据现有资料分析，我建议...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // 执行快捷操作
  const handleQuickAction = (actionKey) => {
    const action = quickActions.find(a => a.key === actionKey);
    const result = {
      id: Date.now(),
      action: action.label,
      content: `${action.label}的结果内容...`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    setOperationResults(prev => [result, ...prev]);
    message.success(`${action.label}操作完成`);
  };

  // 删除文件
  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    message.success('文件删除成功');
  };

  // 删除链接
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
    message.success('链接删除成功');
  };

  // 多选功能处理函数
  const handleSelectMaterial = (materialId, checked) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allMaterialIds = [
        ...uploadedFiles.map(file => `file-${file.id}`),
        ...addedTexts.map(text => `text-${text.id}`),
        ...courseVideos.map(video => `video-${video.id}`),
        ...links.map(link => `link-${link.id}`)
      ];
      setSelectedMaterials(allMaterialIds);
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleBatchDelete = () => {
    selectedMaterials.forEach(materialId => {
      const [type, id] = materialId.split('-');
      const numId = parseInt(id);
      
      switch (type) {
        case 'file':
          setUploadedFiles(prev => prev.filter(file => file.id !== numId));
          break;
        case 'text':
          setAddedTexts(prev => prev.filter(text => text.id !== numId));
          break;
        case 'video':
          setCourseVideos(prev => prev.filter(video => video.id !== numId));
          break;
        case 'link':
          setLinks(prev => prev.filter(link => link.id !== numId));
          break;
      }
    });
    setSelectedMaterials([]);
    message.success(`已删除 ${selectedMaterials.length} 个资料`);
  };

  const handleViewMaterial = (material, type) => {
    // 直接预览原材料
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 预览资料功能
  const handlePreviewMaterial = (material, type) => {
    setPreviewData(material);
    setPreviewType(type);
    setShowPreviewModal(true);
  };

  // 智能需求生成功能
  const generateSmartNote = (material, type) => {
    let smartNote = {
      id: Date.now(),
      type: type,
      title: material.title || material.name,
      originalData: material,
      summary: '',
      keyPoints: [],
      tags: [],
      possibleQuestions: [],
      createdAt: new Date().toLocaleString()
    };

    // 根据不同类型生成智能摘要
    switch (type) {
      case 'file':
        smartNote.summary = `文件资料：${material.name}，类型：${material.type || '未知'}。该文件可能包含重要的教学资源或参考材料，建议进一步分析文件内容以提取关键信息，用于教师培训和教学改进。`;
        smartNote.keyPoints = ['文件已上传', '待内容分析', '可用于AI问答', '支持多种格式'];
        smartNote.tags = ['文件', material.type || '未知类型', '教学资源'];
        smartNote.possibleQuestions = [
          '这个文件的主要内容是什么？',
          '文件中有哪些关键信息点？',
          '如何将这个文件应用到教学中？',
          '文件内容与当前教学目标的关联性如何？'
        ];
        break;
      
      case 'video':
        smartNote.summary = `视频资料：${material.title}。该视频可能包含教学演示、培训内容或案例分析，是重要的视觉学习材料。建议观看并记录要点，提取可用于教师培训的关键信息。`;
        smartNote.keyPoints = ['视频已添加', '包含音视频内容', '适合深度学习', '可重复观看'];
        smartNote.tags = ['视频', '学习资料', '教师培训'];
        if (material.url.includes('bilibili.com')) {
          smartNote.tags.push('B站');
        } else if (material.url.includes('youtube.com')) {
          smartNote.tags.push('YouTube');
        }
        smartNote.possibleQuestions = [
          '视频中展示了哪些教学方法？',
          '视频内容如何应用到实际教学中？',
          '视频中有哪些值得学习的教学技巧？',
          '如何基于视频内容设计培训活动？'
        ];
        break;
      
      case 'link':
        smartNote.summary = `网站链接：${material.title}。该网页可能包含教育资源、研究报告或教学工具，是有价值的在线参考资料。建议浏览并提取关键内容，用于丰富教学资源库。`;
        smartNote.keyPoints = ['网站已添加', '可在线访问', '内容待分析', '实时更新'];
        smartNote.tags = ['网站', '在线资源', '教育工具'];
        smartNote.possibleQuestions = [
          '网站提供了哪些教育资源？',
          '如何利用网站内容进行教学？',
          '网站中的信息如何与课程内容结合？',
          '网站是否提供可下载的教学材料？'
        ];
        break;
      
      case 'text':
        const wordCount = material.content.length;
        const hasMarkdown = /[*_`#\[\]]/g.test(material.content);
        smartNote.summary = `文字内容：${material.title}，共${wordCount}字。${hasMarkdown ? '包含格式化内容，' : ''}该文本可能包含教学理论、实践经验或培训要点，可直接用于AI分析和问答，是重要的知识资源。`;
        smartNote.keyPoints = [
          `文字长度：${wordCount}字`,
          hasMarkdown ? '包含Markdown格式' : '纯文本内容',
          '可直接分析',
          '知识密度高'
        ];
        smartNote.tags = ['文字', hasMarkdown ? 'Markdown' : '纯文本', '知识库'];
        smartNote.possibleQuestions = [
          '文本中的核心观点是什么？',
          '如何将文本内容应用到教学实践中？',
          '文本提到了哪些教学策略？',
          '文本内容如何帮助教师专业发展？'
        ];
        break;

      case 'paper':
        smartNote.summary = `研究论文：${material.title}，作者：${material.author}，发表于${material.year}年。该论文提供了学术研究视角，包含理论基础和实证分析，是教师培训中重要的理论支撑材料。`;
        smartNote.keyPoints = [
          `作者：${material.author}`,
          `发表年份：${material.year}`,
          material.journal ? `期刊：${material.journal}` : '会议论文',
          '学术权威性高'
        ];
        smartNote.tags = ['研究论文', '学术资源', '理论基础', '教师培训'];
        smartNote.possibleQuestions = [
          '论文的主要研究发现是什么？',
          '研究方法对教学实践有何启示？',
          '论文结论如何指导教师培训？',
          '研究成果如何应用到课堂教学中？'
        ];
        break;

      case 'survey':
        smartNote.summary = `调研报告：${material.title}，由${material.organization}于${material.year}年发布。该报告基于实际调研数据，反映了教育现状和趋势，为教师培训提供数据支撑和实践指导。`;
        smartNote.keyPoints = [
          `调研机构：${material.organization}`,
          `调研年份：${material.year}`,
          material.sampleSize ? `样本规模：${material.sampleSize}` : '大规模调研',
          '数据权威可靠'
        ];
        smartNote.tags = ['调研报告', '数据分析', '教育现状', '培训指导'];
        smartNote.possibleQuestions = [
          '调研揭示了哪些教育问题？',
          '调研数据如何指导教师培训方向？',
          '报告中的建议如何落实到教学中？',
          '调研结果对教师发展有何意义？'
        ];
        break;

      case 'case':
        smartNote.summary = `案例研究：${material.title}，实施学校：${material.school}，实施于${material.year}年。该案例展示了具体的教学实践过程和效果，为教师培训提供可借鉴的实践经验和操作指南。`;
        smartNote.keyPoints = [
          `实施学校：${material.school}`,
          `实施年份：${material.year}`,
          material.participants ? `参与人数：${material.participants}` : '实践案例',
          '可操作性强'
        ];
        smartNote.tags = ['案例研究', '实践经验', '教学改进', '培训案例'];
        smartNote.possibleQuestions = [
          '案例中采用了哪些教学策略？',
          '实施过程中遇到了什么挑战？',
          '案例的成功经验如何复制推广？',
          '案例对教师培训有哪些启发？'
        ];
        break;
    }

    return smartNote;
  };

  // 批量生成智能需求
  const handleGenerateSmartNotes = () => {
    const notes = [];
    
    // 为所有资料生成智能需求
    uploadedFiles.forEach(file => {
      notes.push(generateSmartNote(file, 'file'));
    });
    
    addedTexts.forEach(text => {
      notes.push(generateSmartNote(text, 'text'));
    });
    
    courseVideos.forEach(video => {
      notes.push(generateSmartNote(video, 'video'));
    });
    
    links.forEach(link => {
      notes.push(generateSmartNote(link, 'link'));
    });

    // 为新增的材料类型生成智能需求
    researchPapers.forEach(paper => {
      notes.push(generateSmartNote(paper, 'paper'));
    });

    surveys.forEach(survey => {
      notes.push(generateSmartNote(survey, 'survey'));
    });

    caseStudies.forEach(caseStudy => {
      notes.push(generateSmartNote(caseStudy, 'case'));
    });

    if (notes.length > 0) {
      setSmartNotes(notes);
      setShowSmartNotesModal(true);
      message.success(`已生成 ${notes.length} 条智能需求`);
    } else {
      message.info('暂无资料可生成智能需求');
    }
  };

  // 渲染文件预览内容
  const renderFilePreview = (file) => {
    const fileType = file.type || file.name.split('.').pop().toLowerCase();
    
    if (fileType.includes('pdf') || fileType === 'pdf') {
      return (
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url || '#')}&embedded=true`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            PDF预览 - {file.name}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        <div>
          <h3>{file.name}</h3>
          <p>文件类型: {fileType}</p>
          <p>暂不支持此文件类型的在线预览</p>
        </div>
      </div>
    );
  };

  // 渲染视频预览内容
  const renderVideoPreview = (video) => {
    const getVideoEmbedUrl = (url) => {
      if (url.includes('bilibili.com')) {
        const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
        if (bvMatch) {
          return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&autoplay=0`;
        }
      }
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId[1]}`;
        }
      }
      return url;
    };

    const embedUrl = getVideoEmbedUrl(video.url);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{video.title}</h3>
          <p style={{ color: '#666' }}>视频链接: <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
        </div>
        <div style={{ height: '400px', width: '100%' }}>
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
            title={video.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  // 渲染链接预览内容
  const renderLinkPreview = (link) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{link.title}</h3>
          <p style={{ color: '#666' }}>网站地址: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        </div>
        <div style={{ height: '500px', width: '100%' }}>
          <iframe
            src={link.url}
            style={{ width: '100%', height: '100%', border: '1px solid #d9d9d9', borderRadius: '8px' }}
            title={link.title}
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          网站预览 - 如无法显示，请点击上方链接直接访问
        </div>
      </div>
    );
  };

  // 渲染文字预览内容
  const renderTextPreview = (text) => {
    // 简单的 Markdown 渲染
    const renderMarkdown = (content) => {
      let html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/`(.*?)`/g, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #1890ff;">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 4px;" />')
        .replace(/\n/g, '<br />');
      
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>{text.title}</h3>
          <p style={{ color: '#666' }}>添加时间: {text.addTime}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          {renderMarkdown(text.content)}
        </div>
      </div>
    );
  };

  // 渲染研究论文预览
  const renderPaperPreview = (paper) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📄 {paper.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>作者:</strong> {paper.author}</p>
            <p><strong>发表年份:</strong> {paper.year}</p>
            <p><strong>期刊/会议:</strong> {paper.journal || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>摘要</h4>
          <p>{paper.abstract || '暂无摘要信息'}</p>
          {paper.keywords && (
            <>
              <h4>关键词</h4>
              <p>{paper.keywords}</p>
            </>
          )}
          {paper.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看完整论文 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染调研报告预览
  const renderSurveyPreview = (survey) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📊 {survey.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>调研机构:</strong> {survey.organization}</p>
            <p><strong>调研年份:</strong> {survey.year}</p>
            <p><strong>样本规模:</strong> {survey.sampleSize || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>调研概述</h4>
          <p>{survey.summary || '暂无概述信息'}</p>
          {survey.keyFindings && (
            <>
              <h4>主要发现</h4>
              <p>{survey.keyFindings}</p>
            </>
          )}
          {survey.methodology && (
            <>
              <h4>调研方法</h4>
              <p>{survey.methodology}</p>
            </>
          )}
          {survey.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={survey.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看完整报告 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染案例研究预览
  const renderCasePreview = (caseStudy) => {
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3>📋 {caseStudy.title}</h3>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            <p><strong>实施学校:</strong> {caseStudy.school}</p>
            <p><strong>实施年份:</strong> {caseStudy.year}</p>
            <p><strong>参与人数:</strong> {caseStudy.participants || '未知'}</p>
          </div>
        </div>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
          maxHeight: '400px',
          overflow: 'auto',
          lineHeight: '1.6'
        }}>
          <h4>案例背景</h4>
          <p>{caseStudy.background || '暂无背景信息'}</p>
          {caseStudy.implementation && (
            <>
              <h4>实施过程</h4>
              <p>{caseStudy.implementation}</p>
            </>
          )}
          {caseStudy.results && (
            <>
              <h4>实施效果</h4>
              <p>{caseStudy.results}</p>
            </>
          )}
          {caseStudy.lessons && (
            <>
              <h4>经验总结</h4>
              <p>{caseStudy.lessons}</p>
            </>
          )}
          {caseStudy.url && (
            <div style={{ marginTop: '16px' }}>
              <a href={caseStudy.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                查看详细案例 →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 计算选中状态
  const allMaterials = [
    ...uploadedFiles.map(file => `file-${file.id}`),
    ...addedTexts.map(text => `text-${text.id}`),
    ...courseVideos.map(video => `video-${video.id}`),
    ...links.map(link => `link-${link.id}`)
  ];
  const isAllSelected = allMaterials.length > 0 && selectedMaterials.length === allMaterials.length;
  const isIndeterminate = selectedMaterials.length > 0 && selectedMaterials.length < allMaterials.length;



  // 返回
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.close();
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      {/* 左侧资料收集区域 */}
      <div style={{ flex: 2.5, background: '#fff', margin: '16px 0 16px 16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            {/* 页面头部 - 标题和操作按钮 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                    {mode === 'edit' ? '📝 编辑需求' : '📝 新建需求'}
                  </Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {mode === 'edit' && (
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={handleSaveNeed}
                      size="small"
                    >
                      保存
                    </Button>
                  )}
                  {onBack && (
                    <Button 
                      type="text" 
                      icon={<ArrowLeftOutlined />} 
                      onClick={handleBack}
                      style={{ color: '#666' }}
                      size="small"
                    >
                      返回
                    </Button>
                  )}
                </div>
              </div>
              

            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
                  📚 资料收集
                </Title>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedMaterials.length > 0 && (
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除选中的 ${selectedMaterials.length} 个资料吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                    >
                      删除选中
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </div>
            
            {/* 操作按钮区域 */}
            <div style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                style={{ flex: 1 }}
                onClick={() => {
                  setShowMaterialAddModal(true);
                }}
              >
                添加
              </Button>
              <Button 
                type="default" 
                style={{ flex: 1 }}
                onClick={() => setShowExploreModal(true)}
              >
                探索
              </Button>
            </div>
            
            <Divider style={{ margin: '16px 0' }} />
            
            {/* 选择所有来源 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: 12,
              border: '1px solid #e9ecef'
            }}>
              <span style={{ color: '#495057', fontSize: '14px' }}>选择所有来源</span>
              <Checkbox 
                style={{ marginLeft: 'auto' }}
                checked={selectedMaterials.length > 0 && selectedMaterials.length === (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length
                )}
                indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < (
                  uploadedFiles.length + addedTexts.length + courseVideos.length + links.length
                )}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            
            {/* 统一的资料列表 */}
            <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {/* 已上传文件 */}
              {uploadedFiles.map(file => {
                const isHovered = hoveredItems[`file-${file.id}`] || false;
                return (
                  <Card 
                    key={`file-${file.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`file-${file.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`file-${file.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`file-${file.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`file-${file.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(file, 'file')}
                      >
                        {isHovered ? (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'rename',
                                  label: '重命名',
                                  icon: <EditOutlined />,
                                  onClick: () => {
                                    const newName = prompt('请输入新的文件名:', file.name);
                                    if (newName && newName.trim()) {
                                      setUploadedFiles(prev => 
                                        prev.map(f => 
                                          f.id === file.id ? { ...f, name: newName.trim() } : f
                                        )
                                      );
                                      message.success('文件重命名成功');
                                    }
                                  }
                                },
                                {
                                  key: 'delete',
                                  label: '删除',
                                  icon: <DeleteOutlined />,
                                  onClick: () => {
                                    Modal.confirm({
                                      title: '确认删除',
                                      content: `确定要删除文件"${file.name}"吗？`,
                                      okText: '确定',
                                      cancelText: '取消',
                                      onOk: () => handleDeleteFile(file.id)
                                    });
                                  },
                                  danger: true
                                }
                              ]
                            }}
                            trigger={['click']}
                          >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{file.name}</Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`file-${file.id}`)}
                        onChange={(e) => handleSelectMaterial(`file-${file.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 添加的文字 */}
              {addedTexts.map(text => {
                const isHovered = hoveredItems[`text-${text.id}`] || false;
                return (
                  <Card 
                    key={`text-${text.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`text-${text.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`text-${text.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`text-${text.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`text-${text.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(text, 'text')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的标题:', text.title);
                                      if (newTitle && newTitle.trim()) {
                                        setAddedTexts(prev => 
                                          prev.map(t => 
                                            t.id === text.id ? { ...t, title: newTitle.trim() } : t
                                          )
                                        );
                                        message.success('文字重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除文字"${text.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteText(text.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <FileTextOutlined style={{ fontSize: 16, color: '#52c41a', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{text.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {text.content.length > 50 ? text.content.substring(0, 50) + '...' : text.content}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`text-${text.id}`)}
                        onChange={(e) => handleSelectMaterial(`text-${text.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 课程视频 */}
              {courseVideos.map(video => {
                const isHovered = hoveredItems[`video-${video.id}`] || false;
                return (
                  <Card 
                    key={`video-${video.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`video-${video.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`video-${video.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`video-${video.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`video-${video.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(video, 'video')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的视频标题:', video.title);
                                      if (newTitle && newTitle.trim()) {
                                        setCourseVideos(prev => 
                                          prev.map(v => 
                                            v.id === video.id ? { ...v, title: newTitle.trim() } : v
                                          )
                                        );
                                        message.success('视频重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除视频"${video.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteVideo(video.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <div style={{ fontSize: 16, marginRight: 8 }}>🎥</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{video.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {video.url}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`video-${video.id}`)}
                        onChange={(e) => handleSelectMaterial(`video-${video.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 保存的链接 */}
              {links.map(link => {
                const isHovered = hoveredItems[`link-${link.id}`] || false;
                return (
                  <Card 
                    key={`link-${link.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`link-${link.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`link-${link.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`link-${link.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`link-${link.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(link, 'link')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的链接标题:', link.title);
                                      if (newTitle && newTitle.trim()) {
                                        setLinks(prev => 
                                          prev.map(l => 
                                            l.id === link.id ? { ...l, title: newTitle.trim() } : l
                                          )
                                        );
                                        message.success('链接重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除链接"${link.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => handleDeleteLink(link.id)
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <LinkOutlined style={{ fontSize: 16, color: '#fa8c16', marginRight: 8 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{link.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {link.url}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`link-${link.id}`)}
                        onChange={(e) => handleSelectMaterial(`link-${link.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 研究论文 */}
              {researchPapers.map(paper => {
                const isHovered = hoveredItems[`paper-${paper.id}`] || false;
                return (
                  <Card 
                    key={`paper-${paper.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`paper-${paper.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`paper-${paper.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`paper-${paper.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`paper-${paper.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(paper, 'paper')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的论文标题:', paper.title);
                                      if (newTitle && newTitle.trim()) {
                                        setResearchPapers(prev => 
                                          prev.map(p => 
                                            p.id === paper.id ? { ...p, title: newTitle.trim() } : p
                                          )
                                        );
                                        message.success('论文重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除论文"${paper.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => setResearchPapers(prev => prev.filter(p => p.id !== paper.id))
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <div style={{ fontSize: 16, marginRight: 8 }}>📄</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{paper.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {paper.author} • {paper.year}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`paper-${paper.id}`)}
                        onChange={(e) => handleSelectMaterial(`paper-${paper.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 调研报告 */}
              {surveys.map(survey => {
                const isHovered = hoveredItems[`survey-${survey.id}`] || false;
                return (
                  <Card 
                    key={`survey-${survey.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`survey-${survey.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`survey-${survey.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`survey-${survey.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`survey-${survey.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(survey, 'survey')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的报告标题:', survey.title);
                                      if (newTitle && newTitle.trim()) {
                                        setSurveys(prev => 
                                          prev.map(s => 
                                            s.id === survey.id ? { ...s, title: newTitle.trim() } : s
                                          )
                                        );
                                        message.success('报告重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除报告"${survey.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => setSurveys(prev => prev.filter(s => s.id !== survey.id))
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <div style={{ fontSize: 16, marginRight: 8 }}>📊</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{survey.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {survey.organization} • {survey.year}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`survey-${survey.id}`)}
                        onChange={(e) => handleSelectMaterial(`survey-${survey.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
              
              {/* 案例研究 */}
              {caseStudies.map(caseStudy => {
                const isHovered = hoveredItems[`case-${caseStudy.id}`] || false;
                return (
                  <Card 
                    key={`case-${caseStudy.id}`} 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: selectedMaterials.includes(`case-${caseStudy.id}`) ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedMaterials.includes(`case-${caseStudy.id}`) ? '#f6ffed' : 'white'
                    }}
                    onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [`case-${caseStudy.id}`]: true }))}
                    onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [`case-${caseStudy.id}`]: false }))}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                        onClick={() => handleViewMaterial(caseStudy, 'case')}
                      >
                        {isHovered ? (
                           <Dropdown
                             menu={{
                               items: [
                                 {
                                   key: 'rename',
                                   label: '重命名',
                                   icon: <EditOutlined />,
                                   onClick: () => {
                                      const newTitle = prompt('请输入新的案例标题:', caseStudy.title);
                                      if (newTitle && newTitle.trim()) {
                                        setCaseStudies(prev => 
                                          prev.map(c => 
                                            c.id === caseStudy.id ? { ...c, title: newTitle.trim() } : c
                                          )
                                        );
                                        message.success('案例重命名成功');
                                      }
                                    }
                                 },
                                 {
                                    key: 'delete',
                                    label: '删除',
                                    icon: <DeleteOutlined />,
                                    onClick: () => {
                                      Modal.confirm({
                                        title: '确认删除',
                                        content: `确定要删除案例"${caseStudy.title}"吗？`,
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => setCaseStudies(prev => prev.filter(c => c.id !== caseStudy.id))
                                      });
                                    },
                                    danger: true
                                  }
                               ]
                             }}
                             trigger={['click']}
                           >
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<MoreOutlined />}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: 8 }}
                            />
                          </Dropdown>
                        ) : (
                          <div style={{ fontSize: 16, marginRight: 8 }}>📋</div>
                        )}
                        <div style={{ flex: 1 }}>
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>{caseStudy.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }} ellipsis>
                            {caseStudy.school} • {caseStudy.year}
                          </Text>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedMaterials.includes(`case-${caseStudy.id}`)}
                        onChange={(e) => handleSelectMaterial(`case-${caseStudy.id}`, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
      </div>

      {/* 中间问答区域 */}
      <div style={{ flex: 5, margin: '16px', background: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>
              💬 智能问答
            </Title>
          </div>
          
          {/* 摘要区域 */}
          <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ color: '#1890ff' }}>📋 针对所有来源的摘要</Text>
            </div>
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff' }}>
               <Paragraph style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                 收集的资料全面覆盖了教师专业发展与培训的各个维度，包括专业发展指导手册、现代教育技术应用资料、核心素养课程设计指南等理论文献；教师培训平台、教育技术研究网站等在线资源；培训需求分析、信息技术能力提升方案、差异化教学策略等实践方案；现代教学方法、技术整合、学生心理发展等专业视频；以及相关的实证研究论文、调研报告和成功案例分析。这些材料从理论基础、实践指导、技术应用、案例借鉴等多个角度，为教师专业发展和培训体系建设提供了系统性的参考依据和实施指导。
               </Paragraph>
             </Card>
            

          </div>
          
          {/* 消息列表 */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 500px)' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 16 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8
                }}>
                  {msg.type === 'assistant' && (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )}
                  <div style={{
                    maxWidth: '70%'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: msg.type === 'user' ? '#1890ff' : '#f6f6f6',
                      color: msg.type === 'user' ? '#fff' : '#333'
                    }}>
                      <Text style={{ color: 'inherit' }}>{msg.content}</Text>
                    </div>
                    {msg.type === 'assistant' && (
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                          size="small"
                          type="text"
                          icon={<SaveOutlined />}
                          onClick={() => handleSaveToNote(msg.content)}
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            padding: '4px 8px',
                            height: 'auto'
                          }}
                        >
                          保存到需求
                        </Button>
                      </div>
                    )}
                  </div>
                  {msg.type === 'user' && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div style={{ padding: '12px 16px', backgroundColor: '#f6f6f6', borderRadius: '12px' }}>
                  <Text>正在思考中...</Text>
                </div>
              </div>
            )}
          </div>
          

          
          {/* 输入区域 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
            <Space.Compact style={{ width: '100%', position: 'relative' }}>
              {/* 选中资料数量提示 - 浮动显示 */}
              {selectedMaterials.length > 0 && (
                <div style={{ 
                  position: 'absolute',
                  top: '-24px',
                  left: '0',
                  padding: '2px 8px', 
                  backgroundColor: '#f6ffed', 
                  border: '1px solid #b7eb8f', 
                  borderRadius: '12px',
                  fontSize: '10px',
                  color: '#52c41a',
                  zIndex: 10,
                  whiteSpace: 'nowrap'
                }}>
                  📋 {selectedMaterials.length}个资料
                </div>
              )}
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={selectedMaterials.length > 0 ? `基于已选择的 ${selectedMaterials.length} 个资料，请输入您的问题...` : "请先选择资料后再输入问题..."}
                autoSize={{ minRows: 1, maxRows: 3 }}
                disabled={selectedMaterials.length === 0}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputMessage.trim() || selectedMaterials.length === 0}
              >
                发送
              </Button>
            </Space.Compact>

          </div>
        </div>

        {/* 右侧操作区域 */}
        <div style={{ flex: 2.5, background: '#fff', margin: '16px 16px 16px 0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 上半部分 - 功能概览 */}
          <div style={{ padding: '20px', flex: 1 }}>
            <Title level={5} style={{ marginBottom: 16, color: '#1f1f1f' }}>
              🛠️ 操作面板
            </Title>
            
            {/* 功能卡片网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 16 }}>
              {/* 音频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('audio')}
                style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🎵</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#1565c0' 
                  }}>音频概览</Text>
                </div>
              </Card>
              
              {/* 视频概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('video')}
                style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>📹</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#2e7d32' 
                  }}>视频概览</Text>
                </div>
              </Card>
              
              {/* 思维导图 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('mindmap')}
                style={{ 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>🧠</div>
                  <Text style={{ 
                    fontSize: '11px', 
                    fontWeight: 500, 
                    color: '#c2185b' 
                  }}>思维导图</Text>
                </div>
              </Card>
              
              {/* 报告 */}
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'brief',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📄</span>
                          <span>简报文档</span>
                        </div>
                      ),
                      onClick: () => message.info('简报文档功能开发中')
                    },
                    {
                      key: 'guide',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📖</span>
                          <span>学习指南</span>
                        </div>
                      ),
                      onClick: () => message.info('学习指南功能开发中')
                    },
                    {
                      key: 'faq',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>❓</span>
                          <span>常见问题解答</span>
                        </div>
                      ),
                      onClick: () => message.info('常见问题解答功能开发中')
                    },
                    {
                      key: 'timeline',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>⏰</span>
                          <span>时间轴</span>
                        </div>
                      ),
                      onClick: () => message.info('时间轴功能开发中')
                    }
                  ]
                }}
                trigger={['hover']}
                placement="bottomLeft"
                overlayClassName="report-dropdown"
              >
                <Card 
                  size="small" 
                  hoverable
                  onClick={() => handleOperationClick('report')}
                  style={{ 
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ padding: '6px 0' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>📊</div>
                    <Text style={{ 
                      fontSize: '11px', 
                      fontWeight: 500, 
                      color: '#ef6c00' 
                    }}>报告</Text>
                  </div>
                </Card>
              </Dropdown>
              
              {/* PPT概览 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('ppt')}
                style={{ 
                  background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📽️</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#d32f2f' 
                   }}>PPT概览</Text>
                 </div>
              </Card>
              
              {/* 网页代码 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('webcode')}
                style={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>💻</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#7b1fa2' 
                   }}>网页代码</Text>
                 </div>
              </Card>
              
              {/* 培训方案 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('training-plan')}
                style={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #a5d6a7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📋</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#388e3c' 
                   }}>培训方案</Text>
                 </div>
              </Card>
              
              {/* 课表 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('schedule')}
                style={{ 
                  background: 'linear-gradient(135deg, #fff8e1 0%, #ffcc02 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>📅</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#f57c00' 
                   }}>课表</Text>
                 </div>
              </Card>
              
              {/* 参训人员清单 */}
              <Card 
                size="small" 
                hoverable
                onClick={() => handleOperationClick('participants')}
                style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ padding: '6px 0' }}>
                   <div style={{ fontSize: '20px', marginBottom: '6px' }}>👥</div>
                   <Text style={{ 
                     fontSize: '11px', 
                     fontWeight: 500, 
                     color: '#1976d2' 
                   }}>参训人员</Text>
                 </div>
              </Card>
              

            </div>
          </div>
          
          {/* 下半部分 - 操作记录 */}
          <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
              {Object.values(operationRecords).flat().map(record => {
                const getIcon = (type) => {
                    switch(type) {
                      case 'audio': return '🎵';
                      case 'video': return '📹';
                      case 'mindmap': return '🧠';
                      case 'report': return '📊';
                      case 'ppt': return '📽️';
                      case 'webcode': return '💻';
                      case 'file': return '📄';
                      case 'text': return '📝';
                      case 'link': return '🔗';
                      default: return '📄';
                    }
                  };
                
                return (
                  <Card 
                    key={record.id}
                    size="small" 
                    hoverable
                    style={{ 
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleRecordClick(record)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ fontSize: '16px', marginTop: '2px' }}>
                        {getIcon(record.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text 
                          style={{ 
                            fontSize: '12px', 
                            fontWeight: 500, 
                            color: '#1f1f1f',
                            display: 'block',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}
                          ellipsis={{ tooltip: record.title }}
                        >
                          {record.title}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.source}
                          </Text>
                          <Text style={{ fontSize: '10px', color: '#999' }}>
                            {record.time}
                          </Text>
                        </div>
                      </div>
                      {(record.type === 'audio' || record.type === 'video') && (
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>▶</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordClick(record);
                          }}
                        />
                      )}
                      <Dropdown
                        menu={{ items: getMoreMenuItems(record) }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<div style={{ fontSize: '12px' }}>⋯</div>}
                          style={{ padding: '2px 4px', height: 'auto', minWidth: 'auto' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </Card>
                );
              })}
              
              {Object.values(operationRecords).flat().length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  暂无操作记录
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 上传弹窗 */}
      <Modal
      title="添加来源"
      open={showUploadModal}
      onCancel={() => setShowUploadModal(false)}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        {/* 文档上传区域 */}
        <div style={{ marginBottom: 32 }}>
          <Title level={5} style={{ marginBottom: 16 }}>文档上传</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            请选择要上传的文档，NotebookLM 智能需求支持以下格式的资料来源：
          </Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
            (示例：教育方案、课程设计材料、研究报告、会议文档内容、辅导文档等)
          </Text>
          <Upload.Dragger
            multiple
            onChange={handleFileUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.txt,.md"
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">上传文档</p>
            <p className="ant-upload-hint">
              拖放文档文件到此处，或点击上传
            </p>
          </Upload.Dragger>
          <Text type="secondary" style={{ fontSize: 12 }}>
            支持的文档类型：PDF, txt, Markdown 等格式（例如 .md）
          </Text>
        </div>

        <Divider />

        {/* 网站地址添加区域 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>添加网站地址</Title>
          
          {/* 网站类型选择 */}
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>网站类型：</Text>
            <Select
              value={websiteType}
              onChange={setWebsiteType}
              style={{ width: 120, marginRight: 16 }}
            >
              <Option value="normal">普通网站</Option>
              <Option value="video">视频网站</Option>
            </Select>
            {websiteType === 'video' && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                支持B站、小红书视频
              </Text>
            )}
          </div>
          
          {/* 网站地址输入 */}
          <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder={websiteType === 'video' ? '输入B站或小红书视频链接' : '输入网站地址'}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onPressEnter={handleAddWebsite}
              prefix={<LinkOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWebsite}>
              添加
            </Button>
          </Space.Compact>
          
          {/* 示例说明 */}
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            {websiteType === 'video' ? 
              '示例：https://www.bilibili.com/video/BV1xx411c7mu 或 https://www.xiaohongshu.com/explore/xxx' :
              '示例：https://www.example.com'
            }
          </Text>
         </div>

         <Divider />

         {/* 文字内容添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加文字</Title>
           
           {/* 文字内容输入 */}
           <div style={{ marginBottom: 16 }}>
             <TextArea
               placeholder="输入文字内容..."
               value={textContent}
               onChange={(e) => setTextContent(e.target.value)}
               rows={4}
               maxLength={1000}
               showCount
               style={{ marginBottom: 12 }}
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddText}
               block
             >
               添加文字
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             添加的文字内容将作为资料来源，可用于AI问答和分析
           </Text>
         </div>

         <Divider />

         {/* 课程视频添加区域 */}
         <div>
           <Title level={5} style={{ marginBottom: 16 }}>添加课程视频</Title>
           
           {/* 视频标题输入 */}
           <div style={{ marginBottom: 12 }}>
             <Input
               placeholder="输入视频标题..."
               value={videoTitle}
               onChange={(e) => setVideoTitle(e.target.value)}
               maxLength={100}
               showCount
             />
           </div>
           
           {/* 视频链接输入 */}
           <div style={{ marginBottom: 16 }}>
             <Input
               placeholder="输入视频链接..."
               value={videoUrl}
               onChange={(e) => setVideoUrl(e.target.value)}
               addonBefore="🎥"
             />
             <Button 
               type="primary" 
               icon={<PlusOutlined />} 
               onClick={handleAddVideo}
               block
               style={{ marginTop: 12 }}
             >
               添加视频
             </Button>
           </div>
           
           {/* 说明文字 */}
           <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
             支持各类视频平台链接，如B站、YouTube、腾讯视频等
           </Text>
           <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
             示例：https://www.bilibili.com/video/BV1xx411c7mu
           </Text>
         </div>

      </div>
       </Modal>
       


      {/* 资料预览弹窗 */}
      <Modal
        title={`预览 - ${previewData?.title || '资料'}`}
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowPreviewModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {previewData && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {previewType === 'file' && renderFilePreview(previewData)}
            {previewType === 'video' && renderVideoPreview(previewData)}
            {previewType === 'link' && renderLinkPreview(previewData)}
            {previewType === 'text' && renderTextPreview(previewData)}
            {previewType === 'paper' && renderPaperPreview(previewData)}
            {previewType === 'survey' && renderSurveyPreview(previewData)}
            {previewType === 'case' && renderCasePreview(previewData)}
          </div>
        )}
      </Modal>

      {/* 内容查看弹窗 */}
      <Modal
        title={currentRecord?.title || '内容查看'}
        open={showContentModal}
        onCancel={() => setShowContentModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowContentModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{ top: 20 }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: modalContent }}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        />
      </Modal>
      
      {/* 资料添加弹窗 */}
      <MaterialAddPage 
        visible={showMaterialAddModal}
        onClose={() => setShowMaterialAddModal(false)}
      />
      
      {/* 智能需求弹窗 */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RobotOutlined style={{ color: '#1890ff' }} />
          {smartNotes.length === 1 ? '资料智能预览' : '智能需求预览'}
        </div>}
        open={showSmartNotesModal}
        onCancel={() => {
          setShowSmartNotesModal(false);
          setSelectedNote(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowSmartNotesModal(false);
            setSelectedNote(null);
          }}>
            关闭
          </Button>
        ]}
        width={900}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {smartNotes.length > 0 ? (
            <div>
              <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae7ff' }}>
                 <Text type="secondary">
                   {smartNotes.length === 1 ? 
                     '🤖 AI智能分析该资料，为您提供摘要、关键要点和标签分类' : 
                     `📝 已为您生成 ${smartNotes.length} 条智能需求，包含资料摘要、关键要点和标签分类`
                   }
                 </Text>
               </div>
              
              <List
                itemLayout="vertical"
                dataSource={smartNotes}
                renderItem={(note, index) => (
                  <List.Item
                    key={note.id}
                    style={{
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: selectedNote?.id === note.id ? '#f6ffed' : '#fafafa',
                      borderRadius: '8px',
                      border: selectedNote?.id === note.id ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                          {note.type === 'file' && '📄'}
                          {note.type === 'video' && '🎥'}
                          {note.type === 'link' && '🔗'}
                          {note.type === 'text' && '📝'}
                          {note.type === 'paper' && '📄'}
                          {note.type === 'survey' && '📊'}
                          {note.type === 'case' && '📋'}
                          {' '}{note.title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {note.createdAt}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {note.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex} size="small" color={
                            note.type === 'file' ? 'blue' : 
                            note.type === 'video' ? 'red' : 
                            note.type === 'link' ? 'green' : 
                            note.type === 'text' ? 'orange' :
                            note.type === 'paper' ? 'purple' :
                            note.type === 'survey' ? 'cyan' :
                            note.type === 'case' ? 'magenta' : 'default'
                          }>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    
                    <Paragraph style={{ margin: 0, marginBottom: 12, color: '#666' }}>
                      {note.summary}
                    </Paragraph>
                    
                    {selectedNote?.id === note.id && (
                      <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e8f4fd' }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#1890ff' }}>关键要点：</Title>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {note.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} style={{ marginBottom: 4, color: '#666' }}>{point}</li>
                          ))}
                        </ul>
                        
                        {note.possibleQuestions && note.possibleQuestions.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#52c41a' }}>可能问的问题：</Title>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {note.possibleQuestions.map((question, questionIndex) => (
                                <li key={questionIndex} style={{ marginBottom: 4, color: '#666' }}>{question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                          <Button 
                            size="small" 
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewMaterial(note.originalData, note.type);
                            }}
                          >
                            预览原资料
                          </Button>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              message.success('需求已保存到操作记录');
                              // 这里可以添加保存到操作记录的逻辑
                            }}
                          >
                            保存需求
                          </Button>
                        </div>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无智能需求</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>请先添加资料，然后点击"智能需求"按钮生成</div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 探索弹窗 */}
      <ExploreModal
        visible={showExploreModal}
        onClose={() => setShowExploreModal(false)}
        onExplore={handleExplore}
      />
    </>
  );
};

export default NeedEditPage;