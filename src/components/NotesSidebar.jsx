import React from 'react';
import { Layout, Input } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  UserOutlined,
  BulbOutlined,
  StarOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  ExperimentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { TRAINING_STATUS, getTrainingStatusInfo } from '../utils/trainingStatusUtils';

const { Sider } = Layout;
const { Search } = Input;

const NotesSidebar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  notes,
  categories
}) => {
  const iconMap = {
    FileTextOutlined,
    FolderOpenOutlined,
    BookOutlined,
    UserOutlined,
    BulbOutlined,
    StarOutlined,
    NodeIndexOutlined,
    RadarChartOutlined,
    ExperimentOutlined,
    TeamOutlined
  };

  const getCategoryCount = (category) => {
    if (category.value === 'all') {
      return notes.length;
    } else if (category.value === 'starred') {
      return notes.filter(note => note.starred).length;
    } else if (category.value === 'learning_square') {
      return notes.filter(note => 
        note.category === 'learning_square' ||
        note.tags?.includes('学习广场') ||
        note.source === '学习广场'
      ).length;
  } else if (category.value === 'organizational_training') {
      const orgTrainingNotes = notes.filter(note => 
        note.courseType === 'organizational_training' || 
        note.tags?.includes('组织培训') ||
        note.category === 'organizational_training' ||
        note.source === '组织培训'
      );
      // 优先显示“进行中”数量；如为0则显示总数，避免误显示为0
      const inProgressCount = orgTrainingNotes.filter(note => {
        const statusInfo = getTrainingStatusInfo(note);
        return statusInfo && statusInfo.status === TRAINING_STATUS.IN_PROGRESS;
      }).length;
      return inProgressCount > 0 ? inProgressCount : orgTrainingNotes.length;
    } else {
      return notes.filter(note => note.category === category.value).length;
    }
  };

  const renderCategoryItem = (category) => {
    const isEmojiIcon = category.icon && category.icon.length <= 2;
    const IconComponent = isEmojiIcon ? null : (iconMap[category.icon] || FileTextOutlined);
    const count = getCategoryCount(category);
    
    return (
      <div
        key={category.value}
        className={`category-item ${
          category.value === 'organizational_training' ? 'organizational-training-category' : ''
        } ${category.type === 'fixed' ? 'fixed-category' : ''} ${
          category.type === 'custom' ? 'custom-category' : ''
        } ${selectedCategory === category.value ? 'active' : ''}`}
        onClick={() => onCategoryChange(category.value)}
      >
        {isEmojiIcon ? (
          <span className="category-icon">{category.icon}</span>
        ) : (
          <IconComponent className="category-icon" />
        )}
        <span className="category-label">
          {category.value === 'organizational_training' ? '组织培训' : category.label}
        </span>
        <span className="category-count">{count}</span>
        {category.value === 'organizational_training' && (
          <span className="category-ribbon">组织</span>
        )}
      </div>
    );
  };

  return (
    <Sider width={280} className="notes-sidebar">
      <div className="sidebar-content">
        {/* 搜索框 */}
        <Search
          placeholder="搜索笔记..."
          allowClear
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />

        {/* 分类列表 */}
        <div className="category-section">
          <div className="category-list">
            {[
              /* 固定显示组织培训分类 */
              <div key="organizational_training_wrapper">
                {renderCategoryItem({
                  value: 'organizational_training',
                  label: '组织培训',
                  icon: 'TeamOutlined',
                  type: 'system'
                })}
              </div>,
              
              /* 系统分类 */
              <div className="category-group system-group" key="system_categories">
                <div className="category-group-title">系统分类</div>
                {categories.filter(category => 
                  category.value !== 'organizational_training' && 
                  (!category.type || category.type === 'system')
                ).map(category => <div key={category.value}>{renderCategoryItem(category)}</div>)}
              </div>,

              /* 专业分类 */
              <div className="category-group" key="fixed_categories">
                <div className="category-group-title">专业分类</div>
                {categories.filter(category => category.type === 'fixed').map(category => <div key={category.value}>{renderCategoryItem(category)}</div>)}
              </div>,

              /* 自定义分类 */
              ...(categories.filter(category => category.type === 'custom').length > 0 ? [
                <div className="category-group" key="custom_categories">
                  <div className="category-group-title">自定义分类</div>
                  {categories.filter(category => category.type === 'custom').map(category => <div key={category.value}>{renderCategoryItem(category)}</div>)}
                </div>
              ] : [])
            ]}
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default NotesSidebar;