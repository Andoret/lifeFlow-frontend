import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const hasSession = Boolean(localStorage.getItem('access_token'));

  if (!hasSession) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
