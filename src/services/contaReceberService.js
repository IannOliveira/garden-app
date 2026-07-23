import api from './apiService';

export const ContaReceberService = {
  getAll: (params) => api.get('api/contas-receber', { params }),
  pagar: (id, data) => api.put(`api/contas-receber/${id}/pagar`, data),
};
