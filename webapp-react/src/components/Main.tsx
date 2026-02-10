import {useState, React, useEffect } from 'react';
import MainTopBar from "./MainTopBar.tsx";
import VehiclesCards from "./VehiclesCards.tsx";
import NewVehicleDialog from "./NewVehicleDialog.tsx"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FaPlus } from 'react-icons/fa';
import {Navigate} from "react-router-dom";
import apiService from "../services/api.service.ts";
import VehicleDialog from "./VehicleDialog.tsx";

function Main() {

    const [vehicles, setVehicles] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState()
    const [isNewVehicleDialogOpened, setIsNewVehicleDialogOpened] = useState<boolean>(false);
    const [isVehicleDialogOpened, setIsVehicleDialogOpened] = useState<boolean>(false);

    async function fetchVehiclesFromAPI () {
        const api_data = await apiService.getVehicles();
        setVehicles(api_data);
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            await fetchVehiclesFromAPI();

        };

        const fetchBrands = async () => {
            const api_data = await apiService.getBrands();
            setBrands(api_data);
        };

        const fetchModels = async () => {
            const api_data = await apiService.getModels();
            setModels(api_data);
        };

        fetchModels();
        fetchBrands();
        fetchVehicles();
    }, []);


    function handleOpenNewVehicleDialog() {
        setIsNewVehicleDialogOpened(true);
    }

    const handleOpenVehicleDialog = (vehicle) => {
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
                <Button sx={{ px: 1, mx: 1 }} variant="contained" color="primary" onClick={handleOpenNewVehicleDialog}>
                    <FaPlus  />
                    New
                </Button>
            </Box>
            <VehiclesCards vehicles={vehicles} handleOpenVehicleDialog={handleOpenVehicleDialog}/>
            <NewVehicleDialog brands={brands} models={models} isNewVehicleDialogOpened={isNewVehicleDialogOpened} fetchVehiclesFromAPI={ () => fetchVehiclesFromAPI()} onClose={ () => setIsNewVehicleDialogOpened(false) } />
            {selectedVehicle ? (
                <VehicleDialog selectedVehicle={selectedVehicle} deleteVehicle={deleteVehicle} isVehicleDialogOpened={isVehicleDialogOpened} onClose={ () => setIsVehicleDialogOpened(false) } fetchVehiclesFromAPI={ () => fetchVehiclesFromAPI() } />
                ) : null}
        </>
    )
}

export default Main