import api from './apiService';

const contasService = {
  async getAll() {
    return api.get('api/contas');
  },
  
  async create(data) {
    return api.post('api/contas', data);
  },
  
  async update(id, data) {
    return api.put(`api/contas/update/${id}`, data);
  },
  
  async delete(id) {
    return api.delete(`api/contas/${id}`);
  },
  
  async pay(id, data) {
    return api.put(`api/contas/${id}`, data);
  }
};

export default contasService;
