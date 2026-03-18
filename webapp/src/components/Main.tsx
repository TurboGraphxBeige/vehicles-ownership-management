import {useState, useEffect } from 'react';
import MainTopBar from "./MainTopBar.tsx";
import VehiclesCards from "./VehiclesCards.tsx";
import NewVehicleDialog from "./NewVehicleDialog.tsx"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FaPlus } from 'react-icons/fa';
import apiService from "../services/api.service.ts";
import VehicleDialog from "./VehicleDialog.tsx";
import type {Vehicle} from "../types/Vehicle.ts";

function Main() {

    const [vehicles, setVehicles] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [users, setUsers] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [isNewVehicleDialogOpened, setIsNewVehicleDialogOpened] = useState<boolean>(false);
    const [isVehicleDialogOpened, setIsVehicleDialogOpened] = useState<boolean>(false);

    const fetchVehiclesFromAPI = async ()=> {
        const api_data = await apiService.getVehicles();
        setVehicles(api_data);
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            await fetchVehiclesFromAPI();

        };

        const fetchBrands = async () => {
            const api_data = await apiService.getBrands();
            console.log('api_data', api_data);
            setBrands(api_data);
        };

        const fetchModels = async () => {
            const api_data = await apiService.getModels();
            console.log('api_data', api_data);
            setModels(api_data);
        };
        const fetchUsers = async () => {
            const api_data = await apiService.getUsers();
            console.log('api_data', api_data);
            setUsers(api_data);
        };

        fetchModels();
        fetchBrands();
        fetchVehicles();
        fetchUsers();
    }, []);


    function handleOpenNewVehicleDialog() {
        setIsNewVehicleDialogOpened(true);
    }

    const handleOpenVehicleDialog = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsVehicleDialogOpened(!isVehicleDialogOpened);
    }


    const deleteVehicle = async (vehicleId: string)=> {
        console.log('deleteVehicle', vehicleId);
        const res = await apiService.deleteVehicle(vehicleId);

        if (res.status === 200) {
            fetchVehiclesFromAPI()
            setIsVehicleDialogOpened(false);
        }
        console.log(res)
    }

    return (
        <>
            <MainTopBar />

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4">Vehicles</Typography>
                <Button sx={{ px: 1, mx: 2 }} variant="contained" color="primary" onClick={handleOpenNewVehicleDialog}>
                    <FaPlus  />
                    New
                </Button>
            </Box>
            <VehiclesCards vehicles={vehicles} handleOpenVehicleDialog={handleOpenVehicleDialog}/>
            <NewVehicleDialog brands={brands} models={models} isNewVehicleDialogOpened={isNewVehicleDialogOpened} fetchVehiclesFromAPI={ () => fetchVehiclesFromAPI()} onClose={ () => setIsNewVehicleDialogOpened(false) } />
            {selectedVehicle ? (
                <VehicleDialog
                    brands={brands}
                    models={models}
                    selectedVehicle={selectedVehicle}
                    deleteVehicle={deleteVehicle}
                    isVehicleDialogOpened={isVehicleDialogOpened}
                    onClose={ () => setIsVehicleDialogOpened(false) }
                    fetchVehiclesFromAPI={ () => fetchVehiclesFromAPI() }
                    users={users}
                />
                ) : null}
        </>
    )
}

export default Main