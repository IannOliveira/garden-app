import api from './apiService';

const clienteService = {
  getAll() {
    return api.get('api/cliente');
  },
  create(data) {
    return api.post('api/cliente', data);
  },
  update(id, data) {
    return api.put(`api/cliente/${id}`, data);
  },
  delete(id) {
    return api.delete(`api/cliente/${id}`);
  }
};

export default clienteService;
