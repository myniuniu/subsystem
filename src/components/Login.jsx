import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, Checkbox, Divider, message, Select, Modal } from 'antd';
import { PhoneOutlined, MailOutlined, LockOutlined, UserOutlined, QrcodeOutlined, CloudOutlined, LeftOutlined } from '@ant-design/icons';
import LoginMoreModal from './LoginMoreModal';

const { Title, Text, Paragraph } = Typography;

const Login = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [step, setStep] = useState('input');
  const [agree, setAgree] = useState(true);
  const [remember, setRemember] = useState(false);
  const [form] = Form.useForm();
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [countryCode, setCountryCode] = useState('+86');
  const inputsRef = React.useRef(Array.from({ length: 6 }, () => React.createRef()));
  const [policyModal, setPolicyModal] = useState({ open: false, type: 'terms' });

  const handleLogin = async () => {
    try {
      if (!agree) {
        message.warning('请先勾选协议');
        return;
      }
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        const profile = {
          id: 'user_default',
          name: '张老师',
          phone: values.phone || '',
          email: values.email || '',
          avatar: '👨‍🏫',
          org: '北京国人通教育科技有限公司'
        };
        try {
          localStorage.setItem('guoren_session', JSON.stringify({ loggedIn: true, profile }));
          localStorage.setItem('guoren_remember_login', remember ? '1' : '0');
        } catch {}
        message.success('登录成功，欢迎回来');
        setLoading(false);
        if (onSuccess) onSuccess();
        else {
          try {
            window.location.hash = 'smart-notes';
          } catch {}
        }
      }, 600);
    } catch {}
  };

  const toggleMethod = () => {
    setLoginMethod(prev => (prev === 'phone' ? 'email' : 'phone'));
    form.resetFields();
    setStep('input');
  };

  React.useEffect(() => {
    if (step === 'code') {
      setCountdown(59);
      setCodeDigits(['', '', '', '', '', '']);
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem('guoren_remember_login');
      if (v === '1') setRemember(true);
      if (v === '0') setRemember(false);
    } catch {}
  }, []);

  const maskedPhone = React.useMemo(() => {
    const p = form.getFieldValue('phone') || '';
    const s = String(p).replace(/\s/g, '');
    if (!s) return '';
    if (s.length <= 4) return s;
    return `${countryCode}${s.slice(0, 4)}******${s.slice(-2)}`;
  }, [step, countryCode]);

  const handleDigitChange = (idx, val) => {
    const c = val.replace(/\D/g, '').slice(0, 1);
    const next = [...codeDigits];
    next[idx] = c;
    setCodeDigits(next);
    if (c && idx < 5) {
      const ref = inputsRef.current[idx + 1];
      if (ref && ref.current) ref.current.focus();
    }
  };

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !codeDigits[idx] && idx > 0) {
      const ref = inputsRef.current[idx - 1];
      if (ref && ref.current) ref.current.focus();
    }
  };

  const handleNextStepPhone = async () => {
    if (!agree) {
      message.warning('请先勾选协议');
      return;
    }
    try {
      await form.validateFields(['phone']);
      setStep('code');
    } catch {}
  };

  const handleSSOLogin = () => {
    try {
      const url = `${window.location.origin}/sso/login`;
      window.open(url, '_blank');
    } catch {}
    message.info('正在跳转至 SSO 登录');
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e6f0ff 0%, #f7fbff 100%)' }}>
      <div style={{ width: 'min(980px, 94vw)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'stretch' }}>
        <div
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src="/assets/果仁-头像.png" alt="果仁AI" style={{ width: 40, height: 40, borderRadius: 12 }} />
              <Title level={4} style={{ margin: 0, color: '#1f2937' }}>果仁·沉浸式AI学习空间</Title>
            </div>
            <div style={{ width: '100%', height: 320, borderRadius: 24, background: 'linear-gradient(180deg,#ffffff,#f5f7fb)', border: '1px solid #eef0f6', display: 'grid', placeItems: 'center', marginBottom: 18 }}>
              <div style={{ width: 280, height: 200, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, bottom: 0, width: 120, height: 80, background: '#e9eef8', borderRadius: 12 }} />
                <div style={{ position: 'absolute', left: 110, bottom: 0, width: 60, height: 40, background: '#c8d8ff', borderRadius: 10 }} />
                <div style={{ position: 'absolute', left: 80, bottom: 40, width: 160, height: 140, background: '#f0f4ff', borderRadius: 20, border: '1px solid #e6ecfb' }} />
                <div style={{ position: 'absolute', left: 120, bottom: 80, width: 36, height: 36, background: '#9fb7ff', borderRadius: 18 }} />
                <div style={{ position: 'absolute', left: 40, bottom: 20, width: 24, height: 24, background: '#8fd3a8', borderRadius: 6 }} />
                <div style={{ position: 'absolute', right: 24, top: 20, width: 48, height: 24, background: '#ffd66b', borderRadius: 6 }} />
              </div>
            </div>
        
          </div>
        </div>

        <Card
          style={{ borderRadius: 16, background: '#ffffff', boxShadow: '0 12px 36px rgba(31,41,55,0.08)', padding: 0, position: 'relative' }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ position: 'absolute', right: 0, top: 0, width: 64, height: 64, background: 'linear-gradient(135deg,#eaeaff 0%,#c9ceff 100%)', borderTopRightRadius: 16, borderBottomLeftRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrcodeOutlined style={{ fontSize: 20, color: '#6b6ef6' }} />
          </div>
          <Title level={4} style={{ marginTop: 0, color: '#1f2937' }}>欢迎使用果仁</Title>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, marginBottom: 8 }}>
            <Button type="link" onClick={() => { setLoginMethod('phone'); setStep('input'); }} style={{ padding: 0, color: loginMethod === 'phone' ? '#6b6ef6' : '#4b5563' }}>手机号</Button>
            <Button type="link" onClick={() => { setLoginMethod('email'); setStep('input'); }} style={{ padding: 0, color: loginMethod === 'email' ? '#6b6ef6' : '#4b5563' }}>邮箱</Button>
          </div>
          <Form form={form} layout="vertical" size="large">
            {loginMethod === 'phone' && step === 'input' && (
              <>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      validator: (_, value) => {
                        const s = String(value || '').replace(/\s/g, '');
                        if (!s) return Promise.resolve();
                        if (!/^\d+$/.test(s)) return Promise.reject(new Error('请输入有效手机号'));
                        const expect = countryCode === '+86' ? 11 : countryCode === '+852' ? 8 : countryCode === '+853' ? 8 : 9;
                        if (s.length !== expect) return Promise.reject(new Error(`请输入${expect}位手机号`));
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      value={countryCode}
                      onChange={setCountryCode}
                      options={[{ value: '+86', label: '+86' }, { value: '+852', label: '+852' }, { value: '+853', label: '+853' }, { value: '+886', label: '+886' }]}
                      style={{ width: 120 }}
                    />
                    <Input prefix={<PhoneOutlined />} placeholder="请输入你的手机号" allowClear />
                  </Space.Compact>
                </Form.Item>
                <Button type="primary" block size="large" style={{ borderRadius: 8 }} onClick={handleNextStepPhone}>
                  下一步
                </Button>
              </>
            )}
            {loginMethod === 'phone' && step === 'code' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Button type="link" icon={<LeftOutlined />} onClick={() => setStep('input')} style={{ padding: 0 }}>返回</Button>
                </div>
                <Title level={4} style={{ marginTop: 0 }}>输入手机号验证码</Title>
                <Paragraph style={{ color: '#6b7280' }}>
                  请输入发送至 <span style={{ color: '#111827', fontWeight: 600 }}>{maskedPhone || `${countryCode}**********`}</span> 的 6 位验证码，10 分钟内有效。
                  如未收到，请重新获取验证码或 <a onClick={() => message.info('打开帮助文档示例')}>查看帮助文档</a>
                </Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                  {codeDigits.map((d, i) => (
                    <React.Fragment key={i}>
                      <Input
                        ref={inputsRef.current[i]}
                        value={d}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        inputMode="numeric"
                        maxLength={1}
                        style={{
                          width: 56,
                          height: 56,
                          textAlign: 'center',
                          fontSize: 20,
                          borderRadius: 10
                        }}
                      />
                      {i === 2 && <span style={{ color: '#9ca3af' }}>-</span>}
                    </React.Fragment>
                  ))}
                </div>
                <Paragraph style={{ color: '#6b7280' }}>
                  {countdown > 0 ? `${countdown} 秒后可重新获取验证码` : (
                    <Button type="link" style={{ padding: 0 }} onClick={() => setCountdown(59)}>重新获取验证码</Button>
                  )}
                </Paragraph>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <Button type="link" style={{ padding: 0 }} onClick={() => { setLoginMethod('email'); setStep('input'); }}>切换到密码验证</Button>
                  <div style={{ color: '#6b7280' }}>
                    手机号已停用？ <a onClick={() => message.info('找回账号示例')}>找回账号</a>
                  </div>
                </div>
                <Button
                  block
                  type="primary"
                  size="large"
                  style={{ marginTop: 12, borderRadius: 8 }}
                  disabled={codeDigits.join('').length !== 6}
                  onClick={handleLogin}
                >
                  下一步
                </Button>
              </>
            )}
            {loginMethod === 'email' && (
              <>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="you@example.com" allowClear />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                </Form.Item>
                <Button type="primary" block loading={loading} onClick={handleLogin} size="large" style={{ borderRadius: 8 }}>
                  登录
                </Button>
              </>
            )}
          </Form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Checkbox checked={agree} onChange={e => setAgree(e.target.checked)} />
              <Text>我已阅读并同意 <a onClick={() => setPolicyModal({ open: true, type: 'terms' })}>服务协议</a> 和 <a onClick={() => setPolicyModal({ open: true, type: 'privacy' })}>隐私政策</a></Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Checkbox checked={remember} onChange={e => { setRemember(e.target.checked); try { localStorage.setItem('guoren_remember_login', e.target.checked ? '1' : '0') } catch {} }} />
              <Text>记住我的登录状态</Text>
            </div>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ textAlign: 'center', color: '#6b7280', marginBottom: 8 }}>更多登录方式</div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block icon={<CloudOutlined />} onClick={handleSSOLogin} style={{ height: 44 }}>
              SSO 登录
            </Button>
            <Button size="large" onClick={() => setShowMore(true)} icon={<UserOutlined />}>
              登录更多账号
            </Button>
          </Space>
        </Card>
      </div>

      <LoginMoreModal open={showMore} onCancel={() => setShowMore(false)} />
      <Modal
        open={policyModal.open}
        title={policyModal.type === 'terms' ? '服务协议' : '隐私政策'}
        footer={null}
        onCancel={() => setPolicyModal(prev => ({ ...prev, open: false }))}
      >
        <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {policyModal.type === 'terms'
            ? '为确保良好体验，请遵守平台使用条款与行为规范。'
            : '我们重视您的隐私，数据仅用于提供与优化服务。'}
        </Paragraph>
      </Modal>
    </div>
  );
};

export default Login;
