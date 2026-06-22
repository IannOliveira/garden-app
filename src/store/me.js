import {defineStore} from "pinia";
import api from "@/services/apiService";

export const useMe = defineStore('me', {
  state: () => ({
    user: null
  }),

  actions: {
    async getMe() {
      this.user = await api.get('api/me').then(r => r.data.data);
    }
  }

})

