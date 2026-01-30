<template>


  <v-container class="fill-height" max-width="900">

    <div>
    <v-row>



        <v-col v-for="item in items" :key="item.id" cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="item.firstname"
            target="_blank"
            :title="item.lastname"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>

<!--    <div>
      <h1>Data from API</h1>
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.firstname }}</li>
        <li v-for="maison in maisons" :key="maison.id">{{ maison.adresse }}</li>

      </ul>
    </div>-->

    <v-row>
      <v-col
        v-for="maison in maisons"
        :key="maison.maison_uuid"
        cols="12" sm="12" md="6"
      >
      <v-card>
        <v-card-title>
          {{ maison.adresse }}<br>
          {{ maison.ville }}, QC<br>
          {{ maison.code_postal }}

        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <strong>Lot:</strong> {{ maison.no_lot }}<br>
          <strong>Date de signature (notaire):</strong> {{ maison.date_signature_notaire }}<br>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary">View Details</v-btn>
          <v-btn color="secondary" @click="openEditMaisonDialog(maison.maison_uuid)">Edit</v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
    </v-row>

  </v-container>

  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
    <form @submit.prevent="submit">
      <v-text-field
        v-model="no_lot.value.value"
        label="Numéro de lot"
      ></v-text-field>

      <v-text-field
        v-model="adresse.value.value"
        label="Adresse"
      ></v-text-field>

      <v-text-field
        v-model="ville.value.value"
        label="Ville"
      ></v-text-field>


      <v-text-field
        v-model="date_signature_notaire.value.value"
        label="Date de signature (notaire)"
      ></v-text-field>


      <v-date-picker v-model="date_signature_notaire.value.value" @input="" />

      <v-text-field
        v-model="date_emmenagement.value.value"
        label="Date du déménagement"
      ></v-text-field>

      <v-text-field
        v-model="code_postal.value.value"
        label="Code postal"
      ></v-text-field>

      <v-btn
        class="me-4"
        type="submit"
        @click="onSubmit(current_maison_uuid, date_signature_notaire.value.value)"
      >
        submit
      </v-btn>

      <v-btn @click="handleReset">
        clear
      </v-btn>
    </form>
    </v-card>
  </v-dialog>

</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useField, useForm } from 'vee-validate';
import { defineProps } from 'vue';

const items = ref([]);
const maisons = ref([]);
const maison = ref([]);
const dialog = ref(false);



//// Props

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true,
  }
});

////

// Function to fetch data from the API

const updateDate = async (date) => {
  date_signature_notaire = date;
  console.log("asdasdasdasdasdasdasds");
};


const getMaisons = async () => {
  try {
    const response = await axios.get('/api/maison/getmaisons');
    maisons.value = response.data; // Update the reactive variable
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getMaison = async (maison_uuid) => {
  console.log('biscuit', maison_uuid);
  //console.log(maisons.value);
  //res.json(result.rows);
  const my_maison = maisons.value;
  maison.value = Object.values(my_maison).filter(item => item.maison_uuid === maison_uuid)
  //const maisons_json = JSON.stringify(maisons.value);
  console.log('maisons json', maison);



};


let current_maison_uuid;
const openEditMaisonDialog = async (maison_uuid) => {
  //current_maison_uuid = maison_uuid;
  await getMaison(maison_uuid);
  //console.log(maison.value[0].adresse);


  adresse.value.value = maison.value[0].adresse;
  code_postal.value.value = maison.value[0].code_postal;
  no_lot.value.value = maison.value[0].no_lot;
  ville.value.value = maison.value[0].ville;
  current_maison_uuid = maison_uuid;

  date_signature_notaire.value.value = maison.value[0].date_signature_notaire;
  date_emmenagement.value.value = maison.value[0].date_emmenagement;

  dialog.value = true;
}


const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    adresse (value) {
      if (/^[0-9-]{7,}$/.test(value)) return true

      return 'Phone number needs to be at least 7 digits.'
    },
    code_postal (value) {
      if (/^[0-9-]{7,}$/.test(value)) return true

      return 'Phone number needs to be at least 7 digits.'
    }
  },
});


// Define a method to handle form submission
const onSubmit = async (maison_uuid, date_signature_notaire) => {
  try {
    const response = await axios.put('/api/maison/setmaison', null,  {params: {maison_uuid: maison_uuid, date_signature_notaire: date_signature_notaire}});
    console.log(response.data);
    maison.value = response.data; // Update the reactive variable
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  dialog.value = false;
};


const adresse = useField('adresse')
const code_postal = useField('code_postal')
const no_lot = useField('no_lot')
const ville = useField('ville')
const date_signature_notaire = useField('date_signature_notaire')
const date_emmenagement = useField('date_emmenagement')





onMounted(getMaisons);
</script>
