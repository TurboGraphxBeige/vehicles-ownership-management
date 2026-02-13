import axios from 'axios';
import authStore from "../stores/components.store.ts";

const API_URL = 'http://localhost:3001/v1'

const buildHeader = (token: string) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    }
}
const apiService = {
    async doLogin(username: string, password: string) {

        try {
            console.log('dologin', username, password);
            const response = await axios.post(API_URL + '/login', {
                username,
                password,
            })

            if (response.data.token) {
                return response.data
            }
        } catch (error) {
            console.error('Error during login:', error)
            throw error
        }
    },


    async verifyToken (token: string) {
        try {
            const response = await axios.post(
                API_URL + '/verifytoken',
                {},
                {
                    headers: buildHeader(token),
                })
            console.log('response', response)
            if (response.status !== 200) {
                localStorage.removeItem('token')
                authStore.dispatch({
                    type: 'TOKEN_VERIFIED',
                    payload: { username: '' },
                })
                return false
            } else {
                localStorage.token = token
                authStore.dispatch({
                    type: 'TOKEN_VERIFIED',
                    payload: { username: response.data.username },
                })
                return true
            }
        } catch (error) {

        }
    },


    async getVehicles () {

        if (!localStorage.token) {
            return
        }
        const response = await axios.get(API_URL + `/vehicles`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        console.log('getVehicles222', response.data)
        return response.data
    },


    async getBrands () {
        if (!localStorage.token) {
            return
        }
        const response = await axios.get(API_URL + '/brands', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        return response.data
    },

    async getModels () {
        if (!localStorage.token) {
            return
        }
        const response = await axios.get(API_URL + '/models', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        return response.data
    },

    async newCar (data: string) {
        console.log('fdapi', data)
        if (!localStorage.token) {
            return
        }
        const response = await axios.post(API_URL + '/vehicles',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

    async deleteVehicle (vehicle_id: string) {
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

    async uploadImage (data: FormData) {

        if (!localStorage.token || !data) {
            return
        }

        const vehicleIdEntry = data.get('vehicle_id');
        const vehicle_id = vehicleIdEntry instanceof File
            ? vehicleIdEntry.name
            : (vehicleIdEntry as string | null);

        if (!vehicle_id) {
            throw new Error('Vehicle ID is required');
        }
        if (!vehicle_id) {
            throw new Error('Vehicle ID is required');
        }
        const response = await axios.post(API_URL + '/vehicles/' + vehicle_id + '/images',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },


    async deleteImage (vehicle_id: string, photo_id: string) {
        if (!localStorage.token) {
            return
        }

        const response = await axios.delete(API_URL + '/vehicles/' + vehicle_id + '/images/' + photo_id,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

}

export default apiService;