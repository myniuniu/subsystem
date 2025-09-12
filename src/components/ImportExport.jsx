import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Button,
  Upload,
  message,
  Select,
  Card,
  Typography,
  Space,
  Divider,
  Alert,
  Progress,
  List,
  Tag
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  FileTextOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import notesService from '../services/notesService';
import './ImportExport.css';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const ImportExport = ({ visible, onClose, notes, onImportComplete }) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeTags: true,
    includeCategories: true
  });
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);

  // 导出功能
  const handleExport = () => {
    try {
      let exportData;
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (exportFormat) {
        case 'json':
          exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalNotes: notes.length,
            notes: notes.map(note => ({
              ...note,
              ...(exportOptions.includeMetadata ? {} : {
                createdAt: undefined,
                updatedAt: undefined,
                id: undefined
              }),
              ...(exportOptions.includeTags ? {} : { tags: undefined }),
              ...(exportOptions.includeCategories ? {} : { category: undefined })
            }))
          };
          downloadFile(
            JSON.stringify(exportData, null, 2),
            `smart-notes-${timestamp}.json`,
            'application/json'
          );
          break;
          
        case 'markdown':
          exportData = generateMarkdownExport(notes);
          downloadFile(
            exportData,
            `smart-notes-${timestamp}.md`,
            'text/markdown'
          );
          break;
          
        case 'txt':
          exportData = generateTextExport(notes);
          downloadFile(
            exportData,
            `smart-notes-${timestamp}.txt`,
            'text/plain'
          );
          break;
          
        case 'csv':
          exportData = generateCSVExport(notes);
          downloadFile(
            exportData,
            `smart-notes-${timestamp}.csv`,
            'text/csv'
          );
          break;
      }
      
      message.success(`成功导出 ${notes.length} 条笔记`);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    }
  };

  // 生成Markdown格式导出
  const generateMarkdownExport = (notes) => {
    let content = `# 智能笔记导出\n\n`;
    content += `导出时间: ${new Date().toLocaleString()}\n`;
    content += `笔记总数: ${notes.length}\n\n`;
    content += `---\n\n`;
    
    notes.forEach((note, index) => {
      content += `## ${index + 1}. ${note.title}\n\n`;
      
      if (exportOptions.includeCategories && note.category) {
        content += `**分类:** ${note.category}\n\n`;
      }
      
      if (exportOptions.includeTags && note.tags.length > 0) {
        content += `**标签:** ${note.tags.join(', ')}\n\n`;
      }
      
      content += `${note.content}\n\n`;
      
      if (exportOptions.includeMetadata) {
        content += `*创建时间: ${new Date(note.createdAt).toLocaleString()}*\n`;
        content += `*更新时间: ${new Date(note.updatedAt).toLocaleString()}*\n\n`;
      }
      
      content += `---\n\n`;
    });
    
    return content;
  };

  // 生成纯文本格式导出
  const generateTextExport = (notes) => {
    let content = `智能笔记导出\n`;
    content += `==================\n\n`;
    content += `导出时间: ${new Date().toLocaleString()}\n`;
    content += `笔记总数: ${notes.length}\n\n`;
    
    notes.forEach((note, index) => {
      content += `${index + 1}. ${note.title}\n`;
      content += `${'='.repeat(note.title.length + 3)}\n\n`;
      
      if (exportOptions.includeCategories && note.category) {
        content += `分类: ${note.category}\n`;
      }
      
      if (exportOptions.includeTags && note.tags.length > 0) {
        content += `标签: ${note.tags.join(', ')}\n`;
      }
      
      if (exportOptions.includeCategories || exportOptions.includeTags) {
        content += `\n`;
      }
      
      content += `${note.content}\n\n`;
      
      if (exportOptions.includeMetadata) {
        content += `创建时间: ${new Date(note.createdAt).toLocaleString()}\n`;
        content += `更新时间: ${new Date(note.updatedAt).toLocaleString()}\n\n`;
      }
      
      content += `${'='.repeat(50)}\n\n`;
    });
    
    return content;
  };

  // 生成CSV格式导出
  const generateCSVExport = (notes) => {
    const headers = ['标题', '内容', '分类', '标签', '创建时间', '更新时间', '收藏'];
    let csv = headers.join(',') + '\n';
    
    notes.forEach(note => {
      const row = [
        `"${note.title.replace(/"/g, '""')}"`,
        `"${note.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${note.category || ''}"`,
        `"${note.tags.join('; ')}"`,
        `"${new Date(note.createdAt).toLocaleString()}"`,
        `"${new Date(note.updatedAt).toLocaleString()}"`,
        note.isFavorite ? '是' : '否'
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  };

  // 下载文件
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入功能
  const handleImport = async (file) => {
    setImporting(true);
    setImportProgress(0);
    setImportResults(null);
    
    try {
      const text = await readFileAsText(file);
      let importData;
      let importedNotes = [];
      
      // 根据文件类型解析
      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text);
        importedNotes = importData.notes || importData;
      } else if (file.name.endsWith('.md')) {
        importedNotes = parseMarkdownImport(text);
      } else if (file.name.endsWith('.txt')) {
        importedNotes = parseTextImport(text);
      } else if (file.name.endsWith('.csv')) {
        importedNotes = parseCSVImport(text);
      } else {
        throw new Error('不支持的文件格式');
      }
      
      // 验证和处理导入的笔记
      const processedNotes = [];
      const errors = [];
      
      for (let i = 0; i < importedNotes.length; i++) {
        setImportProgress(Math.round((i / importedNotes.length) * 100));
        
        try {
          const note = processImportedNote(importedNotes[i], i);
          if (note) {
            processedNotes.push(note);
          }
        } catch (error) {
          errors.push(`第 ${i + 1} 条笔记: ${error.message}`);
        }
        
        // 模拟处理延迟
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      setImportProgress(100);
      
      // 保存导入的笔记
      for (const note of processedNotes) {
        notesService.createNote(note);
      }
      
      const results = {
        total: importedNotes.length,
        success: processedNotes.length,
        errors: errors.length,
        errorDetails: errors
      };
      
      setImportResults(results);
      
      if (processedNotes.length > 0) {
        message.success(`成功导入 ${processedNotes.length} 条笔记`);
        onImportComplete && onImportComplete();
      }
      
      if (errors.length > 0) {
        message.warning(`${errors.length} 条笔记导入失败`);
      }
      
    } catch (error) {
      console.error('导入失败:', error);
      message.error(`导入失败: ${error.message}`);
      setImportResults({
        total: 0,
        success: 0,
        errors: 1,
        errorDetails: [error.message]
      });
    } finally {
      setImporting(false);
    }
    
    return false; // 阻止默认上传行为
  };

  // 读取文件内容
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('文件读取失败'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  // 解析Markdown导入
  const parseMarkdownImport = (text) => {
    const notes = [];
    const sections = text.split(/^## \d+\. /m).slice(1);
    
    sections.forEach(section => {
      const lines = section.split('\n');
      const title = lines[0].trim();
      
      let content = '';
      let category = '';
      let tags = [];
      
      let contentStartIndex = 1;
      
      // 解析元数据
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('**分类:**')) {
          category = line.replace('**分类:**', '').trim();
          contentStartIndex = i + 1;
        } else if (line.startsWith('**标签:**')) {
          tags = line.replace('**标签:**', '').trim().split(',').map(t => t.trim());
          contentStartIndex = i + 1;
        } else if (line && !line.startsWith('*') && !line.startsWith('---')) {
          break;
        }
      }
      
      // 提取内容
      for (let i = contentStartIndex; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('*创建时间:') || line.startsWith('---')) {
          break;
        }
        content += line + '\n';
      }
      
      if (title && content.trim()) {
        notes.push({
          title,
          content: content.trim(),
          category,
          tags
        });
      }
    });
    
    return notes;
  };

  // 解析纯文本导入
  const parseTextImport = (text) => {
    const notes = [];
    const sections = text.split(/={50,}/).slice(1);
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      
      const titleLine = lines.find(line => /^\d+\. /.test(line));
      if (!titleLine) return;
      
      const title = titleLine.replace(/^\d+\. /, '').trim();
      let content = '';
      let category = '';
      let tags = [];
      
      let contentStarted = false;
      
      for (const line of lines) {
        if (line.startsWith('分类:')) {
          category = line.replace('分类:', '').trim();
        } else if (line.startsWith('标签:')) {
          tags = line.replace('标签:', '').trim().split(',').map(t => t.trim());
        } else if (!line.includes('=') && !line.startsWith('创建时间:') && 
                   !line.startsWith('更新时间:') && line !== titleLine) {
          if (contentStarted || (!line.startsWith('分类:') && !line.startsWith('标签:'))) {
            content += line + '\n';
            contentStarted = true;
          }
        }
      }
      
      if (title && content.trim()) {
        notes.push({
          title,
          content: content.trim(),
          category,
          tags
        });
      }
    });
    
    return notes;
  };

  // 解析CSV导入
  const parseCSVImport = (text) => {
    const lines = text.split('\n');
    const notes = [];
    
    // 跳过标题行
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = parseCSVLine(line);
      if (columns.length >= 2) {
        const [title, content, category = '', tagsStr = ''] = columns;
        const tags = tagsStr ? tagsStr.split(';').map(t => t.trim()).filter(t => t) : [];
        
        if (title && content) {
          notes.push({
            title,
            content,
            category,
            tags
          });
        }
      }
    }
    
    return notes;
  };

  // 解析CSV行
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // 跳过下一个引号
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // 处理导入的笔记
  const processImportedNote = (note, index) => {
    if (!note.title || !note.content) {
      throw new Error('标题和内容不能为空');
    }
    
    return {
      title: note.title.substring(0, 200), // 限制标题长度
      content: note.content,
      category: note.category || '默认',
      tags: Array.isArray(note.tags) ? note.tags.slice(0, 10) : [], // 限制标签数量
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  return (
    <Modal
      title="导入导出笔记"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="import-export-modal"
    >
      <Tabs defaultActiveKey="export">
        <TabPane tab="导出笔记" key="export">
          <div className="export-content">
            <Card title="导出设置" className="export-settings-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>导出格式:</Text>
                  <Select
                    value={exportFormat}
                    onChange={setExportFormat}
                    style={{ width: 200, marginLeft: 16 }}
                  >
                    <Option value="json">JSON 格式</Option>
                    <Option value="markdown">Markdown 格式</Option>
                    <Option value="txt">纯文本格式</Option>
                    <Option value="csv">CSV 格式</Option>
                  </Select>
                </div>
                
                <Divider />
                
                <div>
                  <Text strong>导出选项:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space direction="vertical">
                      <label>
                        <input
                          type="checkbox"
                          checked={exportOptions.includeMetadata}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            includeMetadata: e.target.checked
                          })}
                        />
                        <span style={{ marginLeft: 8 }}>包含元数据（创建时间、更新时间等）</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={exportOptions.includeTags}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            includeTags: e.target.checked
                          })}
                        />
                        <span style={{ marginLeft: 8 }}>包含标签</span>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={exportOptions.includeCategories}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            includeCategories: e.target.checked
                          })}
                        />
                        <span style={{ marginLeft: 8 }}>包含分类</span>
                      </label>
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
            
            <Card title="导出预览" className="export-preview-card">
              <Paragraph>
                <Text>将要导出 </Text>
                <Text strong>{notes.length}</Text>
                <Text> 条笔记</Text>
              </Paragraph>
              
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                size="large"
              >
                开始导出
              </Button>
            </Card>
          </div>
        </TabPane>
        
        <TabPane tab="导入笔记" key="import">
          <div className="import-content">
            <Alert
              message="支持的文件格式"
              description="支持导入 JSON、Markdown、纯文本和 CSV 格式的笔记文件。请确保文件格式正确。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Card title="选择文件" className="import-upload-card">
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleImport}
                showUploadList={false}
                disabled={importing}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽文件到此区域上传
                </p>
                <p className="ant-upload-hint">
                  支持 .json、.md、.txt、.csv 格式文件
                </p>
              </Dragger>
            </Card>
            
            {importing && (
              <Card title="导入进度" className="import-progress-card">
                <Progress percent={importProgress} status="active" />
                <Text>正在处理笔记...</Text>
              </Card>
            )}
            
            {importResults && (
              <Card title="导入结果" className="import-results-card">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text>成功导入: {importResults.success} 条</Text>
                  </div>
                  
                  {importResults.errors > 0 && (
                    <div>
                      <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                      <Text>导入失败: {importResults.errors} 条</Text>
                    </div>
                  )}
                  
                  {importResults.errorDetails.length > 0 && (
                    <div>
                      <Text strong>错误详情:</Text>
                      <List
                        size="small"
                        dataSource={importResults.errorDetails}
                        renderItem={(error, index) => (
                          <List.Item>
                            <Text type="danger">{error}</Text>
                          </List.Item>
                        )}
                        style={{ maxHeight: 200, overflow: 'auto' }}
                      />
                    </div>
                  )}
                </Space>
              </Card>
            )}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ImportExport;