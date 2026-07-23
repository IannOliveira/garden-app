import { defineStore } from 'pinia';
import { CaixaService } from '@/services/caixaService';

export const useCaixaStore = defineStore('caixa', {
  state: () => ({
    resumo: {
      entradas_cartao: 0,
      entradas_outros: 0,
      saidas: 0,
      saldo_geral: 0,
    },
    lancamentos: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCaixa(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await CaixaService.getAll(params);
        this.resumo = response.data.resumo;
        this.lancamentos = response.data.lancamentos;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar caixa';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
