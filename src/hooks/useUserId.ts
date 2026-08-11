import { useContext, useMemo } from 'react';
import { UserContext } from '../context/userContext';

export function useUserId(): number | null {
  const { user } = useContext(UserContext);

  return useMemo(() => {
    if (!user) return null;
    try {
      const parsed = JSON.parse(user) as { userId?: number };
      return parsed.userId ?? null;
    } catch {
      return null;
    }
  }, [user]);
}
