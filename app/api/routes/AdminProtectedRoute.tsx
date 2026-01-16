import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';

const AdminProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  const { isLoading, isError } = useQuery({
    queryKey: ['admin-me'],
    queryFn: adminAPI.getMe,
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  if (isLoading) {
    return <div className="p-6">Checking authentication…</div>;
  }

  if (isError) {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
