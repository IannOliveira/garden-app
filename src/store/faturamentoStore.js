import { defineStore } from 'pinia';
import { FaturamentoService } from '@/services/faturamentoService';

export const useFaturamentoStore = defineStore('faturamento', {
  state: () => ({
    faturamentos: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFaturamentos(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await FaturamentoService.getAll(params);
        this.faturamentos = response.data.data;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar faturamentos';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async createFaturamento(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await FaturamentoService.create(data);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.error || err.response?.data?.message || 'Erro ao criar faturamento';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteFaturamento(id, motivo) {
      this.loading = true;
      this.error = null;
      try {
        await FaturamentoService.delete(id, motivo);
      } catch (err) {
        this.error = err.response?.data?.error || err.response?.data?.message || 'Erro ao cancelar faturamento';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
