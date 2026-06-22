import { defineStore } from 'pinia';
import contasService from '@/services/contasService';

export const useContasStore = defineStore('contas', {
  state: () => ({
    contas: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchContas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await contasService.getAll();
        this.contas = response.data.data;
      } catch (error) {
        this.error = 'Erro ao carregar contas';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addConta(data) {
      this.loading = true;
      this.error = null;
      try {
        await contasService.create(data);
        await this.fetchContas();
      } catch (error) {
        this.error = 'Erro ao cadastrar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateConta(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await contasService.update(id, data);
        await this.fetchContas();
      } catch (error) {
        this.error = 'Erro ao atualizar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async payConta(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await contasService.pay(id, data);
        await this.fetchContas();
      } catch (error) {
        this.error = 'Erro ao pagar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeConta(id) {
      this.loading = true;
      this.error = null;
      try {
        await contasService.delete(id);
        this.contas = this.contas.filter(c => String(c.id) !== String(id));
      } catch (error) {
        this.error = 'Erro ao excluir conta';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
