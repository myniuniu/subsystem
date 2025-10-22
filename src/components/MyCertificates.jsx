import React, { useEffect, useState } from 'react'
import { Empty, Input, List, Card, Button, Tag } from 'antd'
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons'
import certificateService from '../services/certificateService'

const { Search } = Input

function MyCertificates() {
  const [query, setQuery] = useState('')
  const [certs, setCerts] = useState([])

  const refresh = () => {
    const list = certificateService.listCertificates(query)
    setCerts(list)
  }

  useEffect(() => {
    refresh()
  }, [query])

  const handleOpen = (cert) => {
    if (cert.fileUrl) {
      window.open(cert.fileUrl, '_blank')
    }
  }

  const handleDownload = (cert) => {
    if (!cert.fileUrl) return
    const a = document.createElement('a')
    a.href = cert.fileUrl
    a.download = `${cert.title || '电子证书'}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>我的证书</h2>
      </div>

      <Search
        placeholder="搜索证书"
        allowClear
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 12 }}
      />

      {certs.length === 0 ? (
        <Empty description="暂无证书" style={{ marginTop: 40 }} />
      ) : (
        <List
          grid={{ gutter: 12, xs: 1, sm: 2, md: 3, lg: 3 }}
          dataSource={certs}
          renderItem={(cert) => (
            <List.Item>
              <Card
                title={cert.title}
                size="small"
                extra={<Tag color="blue">电子证书</Tag>}
              >
                <div style={{ color: 'var(--theme-textSecondary)', marginBottom: 8 }}>
                  <div>证书编号：{cert.serial}</div>
                  <div>颁发日期：{new Date(cert.achievedAt).toLocaleDateString()}</div>
                  {cert.topicTitle && <div>关联主题：{cert.topicTitle}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button type="primary" icon={<FileTextOutlined />} onClick={() => handleOpen(cert)}>查看</Button>
                  <Button icon={<DownloadOutlined />} onClick={() => handleDownload(cert)}>下载</Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default MyCertificates