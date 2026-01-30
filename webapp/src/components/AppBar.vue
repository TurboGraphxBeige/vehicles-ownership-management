<template>
  <v-app-bar app>
    <v-btn text @click="navigate('Dashboard')">Dashboard</v-btn>
    <v-btn @click="navigate('Vehicles')">Vehicles</v-btn>
    <v-spacer></v-spacer>

    <v-btn prepend-icon="mdi-account-group-outline" @click="navigate('Users')">Users</v-btn>

    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item prepend-icon="mdi-account" v-if="store.isUserLoggedIn" @click="profileAction">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-logout" v-if="store.isUserLoggedIn" @click="logoutAction">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
  import { ref } from 'vue'
  import { apiService } from '@/apiService.js'
  import router from '@/router/index.js'
  import { useComponentStore } from '@/stores'

  const store = useComponentStore()

  const navigate = async (section) => {
    console.log('store.isUserLoggedIn', store.isUserLoggedIn)
    if (!store.isUserLoggedIn) {
      store.isLoginActive = true
      return
    }
    await store.setCurrentComponent(section)
  }

  const profileAction = () => {
    console.log('profileAction')
  }

  const logoutAction = async () => {
    console.log('logout action', localStorage.token)
    await apiService.doLogout(localStorage.token)
    await router.push('/login')
  }
</script>

<style scoped>

</style>
