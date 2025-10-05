import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { Download, Monitor, QrCode } from 'lucide-react';
import { QRCode as AntQRCode } from 'antd';
import './DesktopDownloadModal.css';

const { Title, Paragraph } = Typography;

const DesktopDownloadModal = ({ open, onCancel, onInstallPWA, qrUrl }) => {
  const value = qrUrl || window.location.origin;

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
            <div className="left-title">添加到电脑桌面</div>
          </div>
          <Paragraph className="left-desc">下次可以在桌面快捷访问果仁AI</Paragraph>
          <Button type="primary" size="large" onClick={onInstallPWA} icon={<Download size={18} />}>
            立即添加
          </Button>
        </div>
        <div className="divider" />
        <div className="desktop-download-right">
          <div className="right-header">
            <QrCode size={28} color="#13c2c2" />
            <div className="right-title">微信扫码即可体验</div>
          </div>
          <Paragraph className="right-desc">多端数据双向同步</Paragraph>
          <div className="qr-wrapper">
            <AntQRCode value={value} size={180} color="#000" bordered={false} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DesktopDownloadModal;