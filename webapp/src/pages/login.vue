<script setup>

import Login from "@/components/Login.vue";
const showLoginDialog = true
</script>

<template>

  <v-app>
    <Login v-model="showLoginDialog" />
  </v-app>


</template>

<style scoped>

</style>
