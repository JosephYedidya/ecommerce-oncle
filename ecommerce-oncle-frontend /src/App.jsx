import { useState, useEffect } from 'react';
import { Button, Layout, ConfigProvider, theme } from 'antd';
import { LogoutOutlined, BgColorsOutlined } from '@ant-design/icons';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CashierDashboard from './components/CashierDashboard';

const { Header, Content } = Layout;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setIsLoggedIn(true);
      setUserRole(savedRole);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const themeConfig = {
    token: {
      colorPrimary: '#1890ff',
    },
    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  if (!isLoggedIn) {
    return <ConfigProvider theme={themeConfig}><Login onLogin={handleLogin} /></ConfigProvider>;
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingInline: 24 }}>
          <h2 style={{ color: 'white', margin: 0 }}>📦 E-commerce Stock</h2>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ color: 'white' }}>👤 {userRole}</span>
            <Button 
              icon={<BgColorsOutlined />}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{ padding: '24px' }}>
          <div style={{ borderRadius: 8 }}>
            {userRole === 'Admin' && <AdminDashboard />}
            {userRole === 'Caissière' && <CashierDashboard />}
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}