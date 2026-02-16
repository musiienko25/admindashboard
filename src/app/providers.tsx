import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { authStore } from '@/entities/user/model';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    authStore.checkAuth();
  }, []);

  return <BrowserRouter>{children}</BrowserRouter>;
}
