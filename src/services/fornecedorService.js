import api from './apiService';

const fornecedorService = {
  async getAll() {
    return api.get('api/fornecedor');
  },
  
  async create(data) {
    return api.post('api/fornecedor', data);
  },
  
  async update(id, data) {
    return api.put(`api/fornecedor/${id}`, data);
  },
  
  async delete(id) {
    return api.delete(`api/fornecedor/${id}`);
  }
};

export default fornecedorService;
