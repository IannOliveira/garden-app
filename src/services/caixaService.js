import api from './apiService';

export const CaixaService = {
  getAll: (params) => api.get('api/caixa', { params }),
};
