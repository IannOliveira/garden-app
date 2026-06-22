import api from './apiService';

const produtoService = {
  async getAll() {
    return api.get('api/produtos');
  },
  
  async create(data) {
    return api.post('api/produtos', data);
  },
  
  async update(id, data) {
    return api.put(`api/produtos/${id}`, data);
  },
  
  async delete(id) {
    return api.delete(`api/produtos/${id}`);
  }
};

export default produtoService;
