import { defineStore } from 'pinia';
import clienteService from '@/services/clienteService';

export const useClienteStore = defineStore('cliente', {
  state: () => ({
    clientes: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchClientes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await clienteService.getAll();
        this.clientes = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Erro ao carregar clientes';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async cadastrarCliente(data) {
      this.loading = true;
      this.error = null;
      try {
        await clienteService.create(data);
        await this.fetchClientes();
      } catch (err) {
        this.error = err.response?.data?.error || 'Erro ao cadastrar cliente';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async editarCliente(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await clienteService.update(id, data);
        await this.fetchClientes();
      } catch (err) {
        this.error = err.response?.data?.error || 'Erro ao editar cliente';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async excluirCliente(id) {
      this.loading = true;
      this.error = null;
      try {
        await clienteService.delete(id);
        this.clientes = this.clientes.filter(c => String(c.id) !== String(id));
      } catch (err) {
        this.error = err.response?.data?.error || 'Erro ao excluir cliente';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
