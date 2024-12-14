import React from 'react';
import AuthWrapper from '../Components/auth/AuthWrapper';
import AdminDashboard from "../Components/Admin/AdminDashboard";

const AdminPage = () => {
  return (
    <AuthWrapper requiredRole="admin">
      <div className="admin-page">
        <AdminDashboard />
      </div>
    </AuthWrapper>
  );
};

export default AdminPage;