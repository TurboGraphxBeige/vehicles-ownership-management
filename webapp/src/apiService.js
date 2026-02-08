import axios from 'axios';
import { useComponentStore } from '@/stores';
import {ca} from "vuetify/locale";
import {useAuthStore} from "@/stores/auth.js";
const store = useComponentStore();
const auth = useAuthStore()

const API_URL = 'http://localhost:3000/api/v1'

export const apiService = {

  async doLogin (username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      })

      if (response.data.token) {
        localStorage.token = response.data.token
        auth.isUserLoggedIn = true
        return localStorage.token
      }
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  },

  async doLogout (token) {
    try {
      const response = await axios.post(`${API_URL}/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        })
      if (response.status === 200) {
        auth.token = null
        localStorage.removeItem('token')
        auth.isUserLoggedIn = false
      }
      return response.data
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  },

  async verifyToken (token) {
    try {
      const response = await axios.post(
        `${API_URL}/verifytoken`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
        })

      if (response.status !== 200) {
        auth.token = null
        localStorage.removeItem('token')
        auth.isUserLoggedIn = false
        return false
      } else {
        localStorage.token = token
        auth.isUserLoggedIn = true
        return true
      }
    } catch (error) {
      console.error('Error during verifyToken:', error)
      throw error
    }
  },

  async getCars () {
    if (!localStorage.token) {
      return
    }
    const response = await axios.get(`${API_URL}/vehicles`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token,
      },
    })
    console.log(response.data)
    return response.data
  },

  async getCar (car_id) {
    if (!localStorage.token) {
      return
    }
    const response = await axios.get(`${API_URL}/vehicles/${encodeURIComponent(car_id)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token,
      },

    })
    return response.data
  },

  async getBrands () {
    if (!localStorage.token) {
      return
    }
    const response = await axios.get(`${API_URL}/brands`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token,
      },
    })
    return response.data
  },

  async getCarImages () {
    if (!localStorage.token) {
      return
    }
    let car_ids = []
    for (let car in store.vehicles) {
      car_ids.push(car.id)
    }
    const response = await axios.get(`${API_URL}/vehicles/images?car_id`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.token,
      },
    })
    return response.data
  },

  async newCar (data) {
    console.log(data)
    if (!localStorage.token) {
      return
    }
    const response = await axios.post(`${API_URL}/vehicles`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.token,
        },
      })
    return response
  },

  async deleteVehicle (vehicle_id) {
    if (!localStorage.token) {
      return
    }
    const response = await axios.delete(`${API_URL}/vehicles/${encodeURIComponent(vehicle_id)}`,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.token,
        },
      })
    return response
  },
}
