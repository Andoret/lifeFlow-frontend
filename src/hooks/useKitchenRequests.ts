import { useCallback, useEffect, useState } from 'react';
import { kitchenService } from '../services/kitchen.service';
import type { KitchenRequest } from '../types/kitchen';

export function useKitchenRequests(userId: number | null) {
  const [requests, setRequests] = useState<KitchenRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await kitchenService.getAll();
      setRequests(data.requests);
    } catch {
      setError('No se pudo cargar el historial');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const create = async (ingredients: string[]) => {
    const { data } = await kitchenService.create(ingredients);
    await fetchRequests();
    return data.request;
  };

  const remove = async (id: number) => {
    await kitchenService.delete(id);
    await fetchRequests();
  };

  return { requests, loading, error, refetch: fetchRequests, create, remove };
}
