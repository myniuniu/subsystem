import React from 'react';
import { Tabs } from 'antd';
import DocumentBasicConfigTab from './DocumentBasicConfigTab';

// 研修成果配置页的“考核设置”页签内容（完全复制“考试”类型的“考试”页签结构）
const DocumentAssessmentTab = ({ draft, updateDraft, configModal, formatConfigs, phaseMaterials, getDefaultConfig }) => {
  return (
    <Tabs
      defaultActiveKey="config"
      size="small"
      tabBarStyle={{ marginBottom: 8 }}
      items={[
        {
          key: 'config',
          label: '考核配置',
          children: (
            <DocumentBasicConfigTab 
              draft={draft} 
              updateDraft={updateDraft}
              configModal={configModal}
              formatConfigs={formatConfigs}
              phaseMaterials={phaseMaterials}
              getDefaultConfig={getDefaultConfig}
            />
          )
        }
      ]}
    />
  );
};

export default DocumentAssessmentTab;