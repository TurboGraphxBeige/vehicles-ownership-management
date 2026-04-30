import axios from 'axios';
import authStore from "../stores/components.store.ts";
import startRefreshTimer from "../utils/refreshTokenTimer.ts"; '../utils/refreshTokens.ts';

function getAPIUrl() {
    if (import.meta.env.VITE_NODE_ENV === 'dev') {
        return 'http://localhost:3001/v1'
    } else {
        return '/api/v1'
    }

}


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
            const response = await axios.post(getAPIUrl() + '/login', {
                username,
                password,
            }, { withCredentials: true })
            console.log('response', response)
            if (response.data) {
                startRefreshTimer();
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
                getAPIUrl() + '/verifytoken',
                {},
                {
                    headers: buildHeader(token),
                })

            if (response.status !== 200) {
                // if (refreshToken) {
                //     return true;
                // }

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
                startRefreshTimer();
                return true
            }
        } catch (error) {
            const res= error?.response;
            if (res?.status === 401 && res.data?.expired === true) {
                this.refreshToken();
            }
            console.log(error)
        }
    },


    async refreshToken () {
        console.log('refreshToken called')
        try {
            //const token = localStorage.getItem('refreshToken');
            const response = await axios.post(
                getAPIUrl() + '/refreshtoken',
                {},
                { withCredentials: true })
            console.log('refreshtoken response', response)
            if (response.status !== 200) {
                localStorage.removeItem('token')
                authStore.dispatch({
                    type: 'TOKEN_VERIFIED',
                    payload: { username: '' },
                })
                return false
            } else {
                localStorage.setItem('token', response.data.access_token.token)
                authStore.dispatch({
                    type: 'TOKEN_VERIFIED',
                    payload: { username: response.data.access_token.username },
                })
                startRefreshTimer();
                return true
            }
        } catch (error) {
            console.log(error)
        }
    },


    async getVehicles () {

        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + `/vehicles`, {
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
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + '/brands', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        console.log('getBrands2222', response.data)
        return response.data
    },

    async getModels () {

        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + '/models', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        console.log('sdfgdfdf', response)
        return response.data
    },

    async newCar (data: FormData) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.post(getAPIUrl() + '/vehicles',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

    async updateVehicle (vehicle_id: string, data: FormData) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.put(`${getAPIUrl()}/vehicles/${encodeURIComponent(vehicle_id)}`,
            data,
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

    async updateObservation (vehicle_id: string, observation_id: string, data: FormData) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.put(`${getAPIUrl()}/vehicles/${encodeURIComponent(vehicle_id)}/observations/${encodeURIComponent(observation_id)}`,
            data,
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

    async deleteVehicle (vehicle_id: string) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.delete(`${getAPIUrl()}/vehicles/${encodeURIComponent(vehicle_id)}`,
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
            throw new Error('Invalid token')
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
        const response = await axios.post(getAPIUrl() + '/vehicles/' + vehicle_id + '/images',
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
            throw new Error('Invalid token')
        }

        const response = await axios.delete(getAPIUrl() + '/vehicles/' + vehicle_id + '/images/' + photo_id,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.token,
                },
            })
        return response
    },

    async getVehicleImages (vehicle_id: string) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + '/vehicles/' + vehicle_id + '/images/', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        return response
    },

    async getUsers () {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + '/users/', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        return response.data
    },

    async getContacts () {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }
        const response = await axios.get(getAPIUrl() + '/contacts/', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
            },
        })
        return response.data
    },

    async newService (data: FormData) {
        if (!localStorage.token) {
            throw new Error('Invalid token')
        }

        const vehicle_id: string = data.get('vehicle_id') as string
        if (!vehicle_id) { throw new Error('vehicle_id is required') }
        const response = await axios.post(`${getAPIUrl()}/vehicles/${encodeURIComponent(vehicle_id)}/services`,
            data,
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