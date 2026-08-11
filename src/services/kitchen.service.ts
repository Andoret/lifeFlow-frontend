import { apiClient } from '../api/apiClient';
import type { KitchenRequest } from '../types/kitchen';

type RequestsResponse = { status: boolean; requests: KitchenRequest[] };
type RequestResponse = { status: boolean; request: KitchenRequest };

export const kitchenService = {
  getAll() {
    return apiClient.get<RequestsResponse>('/kitchen/requests');
  },

  create(ingredients: string[]) {
    return apiClient.post<RequestResponse>('/kitchen/requests', { ingredients });
  },

  delete(id: number) {
    return apiClient.delete<RequestResponse>(`/kitchen/requests/${id}`);
  },
};
