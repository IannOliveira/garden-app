import {defineStore} from "pinia";
import {useMe} from "@/store/me";
import axios from "axios";

export const useAuth = defineStore('auth', {
  state: () => ({}),

  actions: {
    sanctum() {
      return axios.get('sanctum/csrf-cookie');
    },
    login(email, password) {
      const meStore = useMe()
      return axios.post('api/login', {
        email, password
      }).then(r => {
        meStore.user = r.data.data
      })
    },
    logout() {
      const meStore = useMe();
      return axios.post('api/logout').then(() => {
        meStore.user = null
      })
    },
    registrar(primeiroNome, sobrenome = '', email, password) {
      return axios.post('api/registro', {
        primeiro_nome: primeiroNome,
        sobrenome: sobrenome,
        email: email,
        password: password,
      })
    },
    verificarEmail(token) {
      return axios.post('api/verificar-email', {
        token,
      })
    },
    esqueciSenha(email) {
      return axios.post('api/esqueci-senha', {
        email
      })
    },
    resetarSenha(token, password) {
      return axios.post('api/resetar-senha', {
        token, password
      })
    },
    listaClientes() {
      return axios.get('api/cliente');
    },
    cadastrarCliente(formValues) {
      return axios.post('api/cliente', formValues)
    },
    editarCliente(id, formValues) {
      return axios.put('api/cliente/' + id, formValues)
    },
    excluirCliente(id) {
      return axios.delete('api/cliente/' + id);
    },
    listaFornecedor(){
      return axios.get('api/fornecedor')
    },
    cadastrarFornecedor(formValues){
      return axios.post('api/fornecedor', formValues);
    },
    editarFornecedor(id, formValues){
      return axios.put('api/fornecedor/' +id, formValues)
    },
    listaContas(){
      return axios.get('api/contas');
    },
    cadastrarContas(formValues){
      return axios.post('api/contas', formValues);
    },
    pagarContas(id, formValues) {
      return axios.put('api/contas/' +id, formValues);
    },
    excluirConta(id){
      return axios.delete('api/contas/' +id);
    },
    editarConta(id, formValues){
      return axios.put('api/contas/update/' +id, formValues)
    },
    listaProdutos(){
      return axios.get('api/produtos');
    },
    cadastrarProduto(formValues){
      return axios.post('api/produtos', formValues);
    },
    editarProduto(id, formValues){
      return axios.put('api/produtos/' +id, formValues)
    },


  },

  getters: {
    isLoggedIn() {
      const meStore = useMe()
      return !!meStore.user
    }
  }

})
