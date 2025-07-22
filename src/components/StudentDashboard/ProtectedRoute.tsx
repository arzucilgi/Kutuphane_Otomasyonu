import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session } = useSessionContext();

  // Yüklenme sırasında hiçbir şey gösterme (isteğe göre spinner konabilir)
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // Oturum yoksa ana sayfaya yönlendir
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Oturum varsa içerikleri göster
  return <>{children}</>;
};

export default ProtectedRoute;
