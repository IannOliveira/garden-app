import { defineStore } from 'pinia';
import fornecedorService from '@/services/fornecedorService';

export const useFornecedorStore = defineStore('fornecedor', {
  state: () => ({
    fornecedores: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchFornecedores() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fornecedorService.getAll();
        this.fornecedores = response.data.data;
      } catch (error) {
        this.error = 'Erro ao carregar fornecedores';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addFornecedor(data) {
      this.loading = true;
      this.error = null;
      try {
        await fornecedorService.create(data);
        await this.fetchFornecedores();
      } catch (error) {
        this.error = 'Erro ao cadastrar fornecedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateFornecedor(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await fornecedorService.update(id, data);
        await this.fetchFornecedores();
      } catch (error) {
        this.error = 'Erro ao atualizar fornecedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFornecedor(id) {
      this.loading = true;
      this.error = null;
      try {
        await fornecedorService.delete(id);
        this.fornecedores = this.fornecedores.filter(f => String(f.id) !== String(id));
      } catch (error) {
        this.error = 'Erro ao excluir fornecedor';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
