import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { Download, Monitor } from 'lucide-react';
import './DesktopDownloadModal.css';

const { Paragraph } = Typography;

const DesktopDownloadModal = ({ open, onCancel, onInstallPWA, onOpenInstalled, installed = false }) => {

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={520}
      className="desktop-download-modal"
      destroyOnHidden
    >
      <div className="desktop-download-container">
        <div className="desktop-download-left">
          <div className="left-header">
            <Monitor size={28} color="#5b8ff9" />
            <div className="left-title">安装到电脑桌面</div>
          </div>
          <Paragraph className="left-desc">{installed ? '已检测到已安装的应用，可直接打开' : '下次可以在桌面快捷访问果仁AI'}</Paragraph>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={installed ? (onOpenInstalled || (() => {})) : onInstallPWA}
              icon={installed ? <Monitor size={18} /> : <Download size={18} />}
            >
              {installed ? '打开已安装应用' : '立即添加'}
            </Button>
            {!installed && (
              <Button
                size="large"
                className="open-installed-button"
                onClick={onOpenInstalled || (() => {})}
                icon={<Monitor size={18} />}
              >
                我已安装了，直接打开
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DesktopDownloadModal;
