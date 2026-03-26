import { useState } from 'react';
import { Button, Input, Select } from 'antd';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');

  const handleLogin = () => {
    if (!email) {
      alert('Email requis');
      return;
    }
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    onLogin(role);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h1>Connexion</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Select
        value={role}
        onChange={setRole}
        style={{ width: '100%', marginBottom: 10 }}
        options={[
          { label: 'Admin', value: 'Admin' },
          { label: 'Caissière', value: 'Caissière' }
        ]}
      />
      <Button type="primary" block onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}