import {defineStore} from "pinia";
import {useMe} from "@/store/me";
import api from "@/services/apiService";

export const useAuth = defineStore('auth', {
  state: () => ({}),

  actions: {
    sanctum() {
      return api.get('sanctum/csrf-cookie');
    },
    login(email, password) {
      const meStore = useMe()
      return api.post('api/login', {
        email, password
      }).then(r => {
        meStore.user = r.data.data
      })
    },
    logout() {
      const meStore = useMe();
      return api.post('api/logout').then(() => {
        meStore.user = null
      })
    },
    registrar(primeiroNome, sobrenome = '', email, password) {
      return api.post('api/registro', {
        primeiro_nome: primeiroNome,
        sobrenome: sobrenome,
        email: email,
        password: password,
      })
    },
    verificarEmail(token) {
      return api.post('api/verificar-email', {
        token,
      })
    },
    esqueciSenha(email) {
      return api.post('api/esqueci-senha', {
        email
      })
    },
    resetarSenha(token, password) {
      return api.post('api/resetar-senha', {
        token, password
      })
    }
  },

  getters: {
    isLoggedIn() {
      const meStore = useMe()
      return !!meStore.user
    }
  }

})
