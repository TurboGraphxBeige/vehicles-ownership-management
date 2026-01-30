import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isUserLoggedIn: false,
    loggedInUsername: null,
    token: null,
  }),
  actions: {
    async restoreSession() {
      const { apiService } = await import('@/apiService.js')
      const token = localStorage.getItem('token')
      if (!token) return false
      this.token = token
      try {
        const res = await apiService.verifyToken(token)
        //this.isUserLoggedIn = res
      } catch (error) {
        //this.isUserLoggedIn = false
        //this.token = null
        localStorage.removeItem('token')
      }
    },
  },

})
