<template>
  <v-app>
    <v-container>
      <h1>Dashboard</h1>
    </v-container>
  </v-app>
</template>

<script>

import axios from "axios";
import { ref, onMounted} from "vue";
import { useComponentStore } from '@/stores';

const store = useComponentStore();



export default {
  name: 'Maison',
  setup() {
    const store = useComponentStore();
    const maisons = ref([]);
    const getMaisons = async () => {
      try {
        const response = await axios.get('/api/cars/getcars');
        store.setMaisons(response.data);
        maisons.value = response.data;
        console.log(maisons.value);
        return maisons;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
      getMaisons(); // Call the method on component load
    });

    return {
      getMaisons,
      maisons
    };
  },
}
</script>

<style scoped>

</style>
