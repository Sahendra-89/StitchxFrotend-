import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, authStorage } from '../lib/api';
import { StitchXDashboard } from '../components/stitchx/StitchXDashboard';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(authStorage.getUser() || { username: 'admin' });

  // Check authentication on mount
  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authStorage.clearToken();
      navigate('/admin/login');
    }
  };

  return (
    <StitchXDashboard
      adminUser={adminUser}
      onLogout={handleLogout}
    />
  );
}

export default AdminDashboard;
