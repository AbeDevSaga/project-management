// hooks/useSessionManager.ts
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useSessionManager = () => {
  const { currentSession } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && currentSession) {
      // Store the current session in sessionStorage
      sessionStorage.setItem('currentSession', currentSession);
      
      // Listen for storage events to detect session changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'currentSession' && e.newValue !== currentSession) {
          window.location.reload(); // Refresh if session changed
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [currentSession]);
};