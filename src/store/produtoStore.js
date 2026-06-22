import { defineStore } from 'pinia';
import produtoService from '@/services/produtoService';

export const useProdutoStore = defineStore('produto', {
  state: () => ({
    produtos: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProdutos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await produtoService.getAll();
        this.produtos = response.data.data;
      } catch (error) {
        this.error = 'Erro ao carregar produtos';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addProduto(data) {
      this.loading = true;
      this.error = null;
      try {
        await produtoService.create(data);
        await this.fetchProdutos();
      } catch (error) {
        this.error = 'Erro ao cadastrar produto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduto(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await produtoService.update(id, data);
        await this.fetchProdutos();
      } catch (error) {
        this.error = 'Erro ao atualizar produto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeProduto(id) {
      this.loading = true;
      this.error = null;
      try {
        await produtoService.delete(id);
        this.produtos = this.produtos.filter(p => String(p.id) !== String(id));
      } catch (error) {
        this.error = 'Erro ao excluir produto';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
