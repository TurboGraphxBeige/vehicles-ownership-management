import { defineStore } from 'pinia';

export const useComponentStore = defineStore('component', {
  state: () => ({
    currentComponent: 'Vehicles',
    isLoginActive: false,

    vehicles: [],
    newVehicleDialogIsActive: false,
    vehicleDialogIsActive: false,
    brands: [],
    models: [],
  }),
  actions: {
    setCurrentComponent(component) {
      this.currentComponent = component
    },

    setIsLoginActive(isLoginActive) {
      this.isLoginActive = isLoginActive
    },

    setMaisons(component) {
      this.maisons = component
    },

    async setCars (apiService) {
      this.vehicles = await apiService.getCars()
    },

    async deleteVehicleById(vehicleId) {
      const obj = this.vehicles.find(x => x.vehicle_id === vehicleId)
      const index = obj ? this.vehicles.indexOf(obj) : -1
      if (index !== -1) {
        this.vehicles.splice(index, 1)
      }
    },

    async setBrands (apiService) {
      let temp_brands = await apiService.getBrands()
      console.log('temp_brands', temp_brands)
      this.brands = temp_brands
    },

    async setModels (apiService) {
      let models = await apiService.getModels()
      this.models = models
    },
  },
})
