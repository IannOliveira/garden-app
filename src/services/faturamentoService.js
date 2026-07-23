import api from './apiService';

export const FaturamentoService = {
  getAll: (params) => api.get('api/faturamento', { params }),
  create: (data) => api.post('api/faturamento', data),
  delete: (id, motivo) => api.delete(`api/faturamento/${id}`, { data: { motivo } }),
};
