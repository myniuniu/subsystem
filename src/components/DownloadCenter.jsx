import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Progress, 
  Tabs, 
  Space, 
  Typography, 
  Statistic, 
  Row, 
  Col,
  Empty,
  Tooltip
} from 'antd'
import { 
  DownloadOutlined, 
  FileOutlined, 
  FolderOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  PauseOutlined, 
  PlayCircleOutlined, 
  DeleteOutlined
} from '@ant-design/icons'
import './DownloadCenter.css'

const DownloadCenter = ({ downloads: propDownloads }) => {
  const [downloads, setDownloads] = useState(propDownloads || [
    {
      id: 1,
      name: 'AI模型训练数据集.zip',
      size: '2.5 GB',
      progress: 100,
      status: 'completed',
      type: 'dataset',
      downloadTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: '机器学习算法文档.pdf',
      size: '15.2 MB',
      progress: 75,
      status: 'downloading',
      type: 'document',
      downloadTime: '2024-01-15 15:45'
    },
    {
      id: 3,
      name: 'Python代码示例.zip',
      size: '8.7 MB',
      progress: 0,
      status: 'paused',
      type: 'code',
      downloadTime: '2024-01-15 16:20'
    },
    {
      id: 4,
      name: '深度学习模型.h5',
      size: '156 MB',
      progress: 100,
      status: 'completed',
      type: 'model',
      downloadTime: '2024-01-14 09:15'
    }
  ])

  const [filter, setFilter] = useState('all')

  const getStatusTag = (status, progress) => {
    switch (status) {
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>
      case 'downloading':
        return <Tag icon={<DownloadOutlined />} color="processing">{progress}%</Tag>
      case 'paused':
        return <Tag icon={<PauseOutlined />} color="warning">已暂停</Tag>
      case 'failed':
        return <Tag icon={<CloseCircleOutlined />} color="error">下载失败</Tag>
      default:
        return <Tag icon={<ClockCircleOutlined />} color="default">等待中</Tag>
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileOutlined style={{ color: '#1890ff' }} />
      case 'dataset':
      case 'code':
        return <FolderOutlined style={{ color: '#52c41a' }} />
      case 'model':
        return <FileOutlined style={{ color: '#722ed1' }} />
      default:
        return <FileOutlined />
    }
  }

  const filteredDownloads = downloads.filter(download => {
    if (filter === 'all') return true
    return download.status === filter
  })

  const handleAction = (id, action) => {
    setDownloads(prev => prev.map(download => {
      if (download.id === id) {
        switch (action) {
          case 'pause':
            return { ...download, status: 'paused' }
          case 'resume':
            return { ...download, status: 'downloading' }
          case 'delete':
            return null
          default:
            return download
        }
      }
      return download
    }).filter(Boolean))
  }

  const { Title } = Typography

  const columns = [
    {
      title: '文件信息',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getTypeIcon(record.type)}
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {record.size} • {record.downloadTime}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (progress, record) => (
        record.status === 'downloading' ? (
          <Progress percent={progress} size="small" />
        ) : null
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => getStatusTag(status, record.progress),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'downloading' && (
            <Tooltip title="暂停">
              <Button
                type="text"
                icon={<PauseOutlined />}
                onClick={() => handleAction(record.id, 'pause')}
              />
            </Tooltip>
          )}
          {record.status === 'paused' && (
            <Tooltip title="继续">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleAction(record.id, 'resume')}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleAction(record.id, 'delete')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'all',
      label: '全部',
      children: null,
    },
    {
      key: 'downloading',
      label: '下载中',
      children: null,
    },
    {
      key: 'completed',
      label: '已完成',
      children: null,
    },
    {
      key: 'paused',
      label: '已暂停',
      children: null,
    },
  ]

  return (
    <div className="download-center">
      <Card className="download-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <DownloadOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={2} style={{ margin: 0 }}>下载中心</Title>
            </Space>
          </Col>
          <Col>
            <Row gutter={32}>
              <Col>
                <Statistic title="总下载" value={downloads.length} />
              </Col>
              <Col>
                <Statistic 
                  title="已完成" 
                  value={downloads.filter(d => d.status === 'completed').length} 
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col>
                <Statistic 
                  title="下载中" 
                  value={downloads.filter(d => d.status === 'downloading').length}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Tabs 
          activeKey={filter} 
          onChange={setFilter}
          items={tabItems}
        />
        
        {filteredDownloads.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredDownloads}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty
            image={<DownloadOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description={
              <span>
                暂无下载记录<br />
                开始使用AI功能，下载的文件将显示在这里
              </span>
            }
          />
        )}
      </Card>
    </div>
  )
}

export default DownloadCenter