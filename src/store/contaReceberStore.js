import { defineStore } from 'pinia';
import { ContaReceberService } from '@/services/contaReceberService';

export const useContaReceberStore = defineStore('contaReceber', {
  state: () => ({
    contas: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchContas(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ContaReceberService.getAll(params);
        this.contas = response.data.data;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar contas a receber';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async pagarConta(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ContaReceberService.pagar(id, data);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao pagar conta';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
