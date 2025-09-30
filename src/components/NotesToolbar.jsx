import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

const NotesToolbar = ({
  filteredNotes,
  viewMode,
  onViewModeChange,
  onCalendarClick,
  onGenerateMockData,
  onCreateNote,
  selectedCategory
}) => {
  return (
    <div className="content-header">
      <div className="header-left">
        <h2 className="notes-count">
          {filteredNotes.length} 个笔记
        </h2>
      </div>
      
      <div className="header-right">
        <Space>
          {/* 视图切换按钮 */}
          <div className="view-toggle">
            <Tooltip title="网格视图">
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => onViewModeChange('grid')}
                size="small"
              />
            </Tooltip>
            <Tooltip title="列表视图">
              <Button
                type={viewMode === 'list' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => onViewModeChange('list')}
                size="small"
              />
            </Tooltip>
          </div>

          {/* 日历按钮 */}
          <Tooltip title="查看日历">
            <Button
              icon={<CalendarOutlined />}
              onClick={onCalendarClick}
              size="small"
            >
              日历
            </Button>
          </Tooltip>

          {/* 生成模拟数据按钮 - 仅在开发环境显示 */}
          {process.env.NODE_ENV === 'development' && (
            <Tooltip title="生成模拟数据">
              <Button
                icon={<ExperimentOutlined />}
                onClick={onGenerateMockData}
                size="small"
                type="dashed"
              >
                生成数据
              </Button>
            </Tooltip>
          )}

          {/* 新建笔记按钮 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateNote}
            size="small"
          >
            新建主题
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default NotesToolbar;