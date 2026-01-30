

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:default="{ isActive }">
      <v-card title="Login Dialog">
        <form @submit.prevent="doLogin">
          <v-card-text>
            <v-text-field v-model="username" label="Username" />
            <v-text-field v-model="password" label="Password" type="password" />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" text="Login" /> <!-- triggers form submit on Enter -->
          </v-card-actions>
        </form>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

</style>

<script setup>
  import { ref } from 'vue';
  import { apiService } from "@/apiService.js";
  import { useComponentStore } from '@/stores';
  import router from "@/router/index.js";
  import {useAuthStore} from "@/stores/auth.js";
  const store = useComponentStore()
  const auth = useAuthStore()

  const username = ref('');
  const password = ref('');

  const closeDialog = () => {
    store.isLoginActive = false;
  }

  const doLogin = async () => {
    const token = await apiService.doLogin(username.value, password.value)
    if (token) {
      localStorage.setItem('token', token)
      auth.isUserLoggedIn = true
      router.push('/main')
    }
  }

</script>
