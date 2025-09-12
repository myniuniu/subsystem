import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Card,
  Tag,
  Checkbox,
  Slider,
  Typography,
  Divider,
  Row,
  Col,
  Tooltip,
  Badge,
  Switch,
  InputNumber
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  SaveOutlined,
  HistoryOutlined,
  TagOutlined,
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  ClockCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './AdvancedSearch.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;
const { CheckableTag } = Tag;

const AdvancedSearch = ({
  visible,
  onCancel,
  onSearch,
  categories = [],
  tags = [],
  searchHistory = [],
  onSaveSearch,
  initialFilters = {}
}) => {
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    categories: [],
    tags: [],
    dateRange: null,
    starred: null,
    wordCountRange: [0, 10000],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    includeContent: true,
    caseSensitive: false,
    exactMatch: false,
    ...initialFilters
  });
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(searchFilters);
      loadSavedSearches();
    }
  }, [visible, form, searchFilters]);

  // 加载保存的搜索
  const loadSavedSearches = () => {
    try {
      const saved = localStorage.getItem('smart_notes_saved_searches');
      if (saved) {
        setSavedSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('加载保存的搜索失败:', error);
    }
  };

  // 保存搜索条件
  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      return;
    }

    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...searchFilters },
      createdAt: new Date().toISOString()
    };

    const updatedSavedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSavedSearches);
    
    try {
      localStorage.setItem('smart_notes_saved_searches', JSON.stringify(updatedSavedSearches));
      setSearchName('');
      if (onSaveSearch) {
        onSaveSearch(newSearch);
      }
    } catch (error) {
      console.error('保存搜索失败:', error);
    }
  };

  // 加载保存的搜索
  const handleLoadSavedSearch = (savedSearch) => {
    setSearchFilters(savedSearch.filters);
    form.setFieldsValue(savedSearch.filters);
  };

  // 删除保存的搜索
  const handleDeleteSavedSearch = (searchId) => {
    const updatedSavedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSavedSearches);
    
    try {
      localStorage.setItem('smart_notes_saved_searches', JSON.stringify(updatedSavedSearches));
    } catch (error) {
      console.error('删除保存的搜索失败:', error);
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    const defaultFilters = {
      keyword: '',
      categories: [],
      tags: [],
      dateRange: null,
      starred: null,
      wordCountRange: [0, 10000],
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      includeContent: true,
      caseSensitive: false,
      exactMatch: false
    };
    
    setSearchFilters(defaultFilters);
    form.setFieldsValue(defaultFilters);
  };

  // 执行搜索
  const handleSearch = () => {
    const filters = form.getFieldsValue();
    setSearchFilters(filters);
    
    if (onSearch) {
      onSearch(filters);
    }
  };

  // 处理表单值变化
  const handleFormChange = (changedValues, allValues) => {
    setSearchFilters(allValues);
  };

  // 渲染分类选择
  const renderCategorySelection = () => (
    <Form.Item name="categories" label="分类">
      <Select
        mode="multiple"
        placeholder="选择分类"
        allowClear
        style={{ width: '100%' }}
      >
        {categories.map(category => (
          <Option key={category.id} value={category.id}>
            <Space>
              <span style={{ color: category.color }}>
                {category.icon && '📁'}
              </span>
              {category.name}
            </Space>
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  // 渲染标签选择
  const renderTagSelection = () => (
    <Form.Item name="tags" label="标签">
      <div className="tag-selection">
        {tags.map(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          const isSelected = searchFilters.tags?.includes(tagName);
          
          return (
            <CheckableTag
              key={tagName}
              checked={isSelected}
              onChange={(checked) => {
                const currentTags = searchFilters.tags || [];
                const newTags = checked
                  ? [...currentTags, tagName]
                  : currentTags.filter(t => t !== tagName);
                
                const newFilters = { ...searchFilters, tags: newTags };
                setSearchFilters(newFilters);
                form.setFieldsValue({ tags: newTags });
              }}
              className="selectable-tag"
            >
              <TagOutlined /> {tagName}
            </CheckableTag>
          );
        })}
      </div>
    </Form.Item>
  );

  // 渲染保存的搜索
  const renderSavedSearches = () => (
    <Card 
      title="保存的搜索" 
      size="small" 
      className="saved-searches-card"
      extra={
        <Badge count={savedSearches.length} size="small" />
      }
    >
      {savedSearches.length === 0 ? (
        <Text type="secondary">暂无保存的搜索</Text>
      ) : (
        <div className="saved-searches-list">
          {savedSearches.map(savedSearch => (
            <div key={savedSearch.id} className="saved-search-item">
              <div className="search-info">
                <Text strong>{savedSearch.name}</Text>
                <Text type="secondary" className="search-date">
                  {dayjs(savedSearch.createdAt).format('MM-DD HH:mm')}
                </Text>
              </div>
              <div className="search-actions">
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleLoadSavedSearch(savedSearch)}
                >
                  加载
                </Button>
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={() => handleDeleteSavedSearch(savedSearch.id)}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  // 渲染搜索历史
  const renderSearchHistory = () => (
    <Card title="搜索历史" size="small" className="search-history-card">
      {searchHistory.length === 0 ? (
        <Text type="secondary">暂无搜索历史</Text>
      ) : (
        <div className="search-history-list">
          {searchHistory.slice(0, 5).map((item, index) => (
            <div key={index} className="history-item">
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setSearchFilters({ ...searchFilters, keyword: item });
                  form.setFieldsValue({ keyword: item });
                }}
              >
                <HistoryOutlined /> {item}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <Modal
      title={
        <Space>
          <SearchOutlined />
          高级搜索
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      className="advanced-search-modal"
      footer={[
        <Button key="reset" icon={<ClearOutlined />} onClick={handleReset}>
          重置
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="search" type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
      ]}
    >
      <div className="advanced-search-content">
        <Row gutter={16}>
          <Col span={16}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              className="search-form"
            >
              {/* 关键词搜索 */}
              <Form.Item name="keyword" label="关键词">
                <Input
                  placeholder="输入搜索关键词..."
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  {renderCategorySelection()}
                </Col>
                <Col span={12}>
                  <Form.Item name="starred" label="收藏状态">
                    <Select placeholder="选择收藏状态" allowClear>
                      <Option value={true}>已收藏</Option>
                      <Option value={false}>未收藏</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* 标签选择 */}
              {renderTagSelection()}

              {/* 日期范围 */}
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              {/* 字数范围 */}
              <Form.Item name="wordCountRange" label="字数范围">
                <Slider
                  range
                  min={0}
                  max={10000}
                  step={100}
                  marks={{
                    0: '0',
                    2500: '2.5K',
                    5000: '5K',
                    7500: '7.5K',
                    10000: '10K+'
                  }}
                  tooltip={{
                    formatter: (value) => `${value} 字`
                  }}
                />
              </Form.Item>

              {/* 排序选项 */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="sortBy" label="排序字段">
                    <Select>
                      <Option value="updatedAt">
                        <ClockCircleOutlined /> 更新时间
                      </Option>
                      <Option value="createdAt">
                        <CalendarOutlined /> 创建时间
                      </Option>
                      <Option value="title">
                        <FileTextOutlined /> 标题
                      </Option>
                      <Option value="wordCount">
                        <FileTextOutlined /> 字数
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="sortOrder" label="排序方式">
                    <Select>
                      <Option value="desc">
                        <SortDescendingOutlined /> 降序
                      </Option>
                      <Option value="asc">
                        <SortAscendingOutlined /> 升序
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* 搜索选项 */}
              <Card title="搜索选项" size="small" className="search-options-card">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="includeContent" valuePropName="checked">
                      <Checkbox>搜索内容</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="caseSensitive" valuePropName="checked">
                      <Checkbox>区分大小写</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="exactMatch" valuePropName="checked">
                      <Checkbox>精确匹配</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* 保存搜索 */}
              <Card title="保存搜索" size="small" className="save-search-card">
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="输入搜索名称..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSaveSearch}
                    disabled={!searchName.trim()}
                  >
                    保存
                  </Button>
                </Space.Compact>
              </Card>
            </Form>
          </Col>

          <Col span={8}>
            <div className="search-sidebar">
              {renderSavedSearches()}
              <Divider />
              {renderSearchHistory()}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default AdvancedSearch;