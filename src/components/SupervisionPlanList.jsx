import React from 'react';
import { Card, Row, Col, Typography, Tag, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ShareAltOutlined, PushpinOutlined, PushpinFilled, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 督导计划卡片清单（样式同专项模版）
const SupervisionPlanList = ({ items = [], onEdit, onDelete, onShare, onTogglePin }) => {
  const handleEdit = (item) => onEdit && onEdit(item);
  const handleDelete = (item) => onDelete && onDelete(item);
  const handleShare = (item) => onShare && onShare(item);
  const handleTogglePin = (item) => onTogglePin && onTogglePin(item);

  if (!items || items.length === 0) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>暂无督导计划</div>;
  }

  return (
    <Row gutter={[16, 16]}>
      {items.map(item => (
        <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
          <Card
            className="note-card"
            hoverable
            onClick={() => handleEdit(item)}
            style={{ cursor: 'pointer' }}
            actions={[
              <Tooltip title="编辑">
                <EditOutlined onClick={(e) => { e.stopPropagation(); handleEdit(item); }} />
              </Tooltip>,
              <Tooltip title="分享">
                <ShareAltOutlined onClick={(e) => { e.stopPropagation(); handleShare(item); }} />
              </Tooltip>,
              <Tooltip title={item.pinned ? '取消置顶' : '置顶'}>
                {item.pinned ? (
                  <PushpinFilled onClick={(e) => { e.stopPropagation(); handleTogglePin(item); }} />
                ) : (
                  <PushpinOutlined onClick={(e) => { e.stopPropagation(); handleTogglePin(item); }} />
                )}
              </Tooltip>,
              <Popconfirm title="确定删除该计划？" onConfirm={() => handleDelete(item)} okText="确定" cancelText="取消">
                <Tooltip title="删除">
                  <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                </Tooltip>
              </Popconfirm>
            ]}
          >
            <div className="note-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="note-category" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined className="category-icon" />
                <Text type="secondary" className="category-text">
                  {item.typeLabel || '督导计划'}
                </Text>
                {item.date && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
                    <CalendarOutlined />
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                  </span>
                )}
                {item.published ? (
                  <Tag color="green" style={{ marginLeft: 8 }}>已发布</Tag>
                ) : (
                  <Tag style={{ marginLeft: 8 }}>草稿</Tag>
                )}
              </div>
            </div>
            <Title level={5} className="note-title" ellipsis={{ rows: 2 }}>
              {item.title}
            </Title>
            <Paragraph className="note-content" ellipsis={{ rows: 3 }} type="secondary">
              {item.description}
            </Paragraph>
            <div className="note-tags">
              {(item.tags || []).slice(0, 3).map(tag => (
                <Tag key={tag} size="small">{tag}</Tag>
              ))}
              {item.tags && item.tags.length > 3 && (
                <Tag key="more" size="small">+{item.tags.length - 3}</Tag>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SupervisionPlanList;