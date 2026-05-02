import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete.tsx"
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";

import apiService from "../services/api.service.ts";
import type {Vehicle} from "../types/Vehicle.ts";
import authStore from "../stores/components.store.ts";
import { useSelector } from 'react-redux';
import type { AuthState } from '../stores/components.store.ts';
import type {Observation} from "../types/Observation.ts";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type {Service} from "../types/Service.ts";


interface ObservationDialogProps {
    selectedVehicle: Vehicle;
    //selectedObservation: Observation;
    isObservationDialogOpened: boolean;
    onClose: () => void;
    fetchVehiclesFromAPI: () => Promise<void> | void;

}



function ObservationDialog(props: ObservationDialogProps ) {

    const {
        selectedVehicle,
        //selectedObservation,
        isObservationDialogOpened,
        onClose,
        fetchVehiclesFromAPI
    } = props;

    //const selectedObservation2 = useSelector(state => state.counter.value);

    //console.log('selectedObservation', selectedObservation);
    //console.log('observationDialog', props)

    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);
    const selectedObservation: Partial<Observation> = useSelector((state: AuthState) => state.selectedObservation);
    const [observationDate, setObservationDate] = React.useState<Dayjs>();
    const [observation] = React.useState<string | undefined>(selectedObservation.observation_id);
    //const [service, setService] = React.useState<string | undefined>(selectedObservation.service_id);
    const [vehicleComponent, setVehicleComponent] = React.useState<string | undefined>();
    const [vehicleComponentSystem, setVehicleComponentSystem] = React.useState<string | undefined>();
    const [description, setDescription] = React.useState<string | undefined>();
    const [estimatedCost, setEstimatedCost] = React.useState<number | undefined>();
    const [priority, setPriority] = React.useState<string | undefined>();
    const [status, setStatus] = React.useState<string | undefined>();
    //const [vehicle] = React.useState<string | undefined>();


    console.log('selectedObservationtest' , selectedObservation)

    useEffect(()=>  {
        //setObservationDate(selectedObservation?.observation_date ? dayjs(selectedObservation.observation_date) : dayjs() );
        //setSelectedContact(selectedObservation?.contact_id);
        setVehicleComponent(selectedObservation?.vehicle_component_id)
        setVehicleComponentSystem(selectedObservation?.vehicle_component_system_id)
        setDescription(selectedObservation?.description)
        setEstimatedCost(selectedObservation?.estimated_cost)
        setPriority(selectedObservation?.priority)
        setStatus(selectedObservation?.status)


        console.log('selectedObservation in dialog', selectedObservation);
    }, [selectedObservation]);

    // const closeObservationDialog = () => {
    //     setIsObservationDialogOpened(false);
    //     setSelectedObservation(null);
    // }

    const handleCancelConfirmDelete = () => {
        onClose();
    }
    const handleDeleteVehicle = () => {
        console.log('handleDeleteVehicle')
        setIsConfirmDeleteOpened(true);
    }

    const handleConfirmDelete = () => {
        console.log('handleConfirmDelete')
    }

    const handleDateTimeChange = (selectedObservationDate: Dayjs | null) => {
        const date = selectedObservationDate?.toDate();
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setObservationDate(dayjs(formattedDate));
        console.log('handleDateTimeChange', selectedObservationDate?.toDate(), formattedDate);
    }


    const handleUpdateObservation = async () => {
        console.log('handleUpdateObservation', selectedVehicle, selectedObservation)
        const data: any = {}
        if (observation) { data.observation_id = observation }
        //if (service !== undefined) { data.service_id = service }
        //if (vehicle) { data.vehicle_id = vehicle }
        if (vehicleComponent !== undefined) { data.vehicle_component_id = vehicleComponent }
        if (vehicleComponentSystem) { data.vehicle_component_system_id = vehicleComponentSystem }
        if (description) { data.description = description }
        if (estimatedCost !== undefined) { data.estimated_cost = estimatedCost }
        if (priority) { data.priority = priority }
        if (status) { data.status = status }
        if (observationDate) { data.observation_date = observationDate }


        if (selectedObservation.observation_id) {
            const res = await apiService.updateObservation(selectedVehicle.vehicle_id, selectedObservation.observation_id, data)
            console.log('updateObservation res', res)
            if (res.status === 201) {
                //setSelectedObservation(res.data);
                authStore.dispatch({
                    type: "SELECTED_OBSERVATION_UPDATED",
                    payload: { selectedObservation: res.data }
                });
                fetchVehiclesFromAPI()
                onClose()
            }
        }




    }


    const handleAddButon = async () => {
        const fd = new FormData();

        // if (selectedVehicle) { fd.append('vehicle_id', selectedVehicle.vehicle_id) }
        // if (selectedContact) { fd.append('contact_id', selectedContact) }
        // if (serviceRequestDescription) { fd.append('service_request_description', serviceRequestDescription) }
        // if (notes) { fd.append('notes', notes) }
        // if (serviceDate) { fd.append('service_date', serviceDate) }
        // // if (odometerReading) {fd.append('odometer_reading', odometerReading) }
        // if (totalCost) { fd.append('total_cost', totalCost) }
        // if (selectedFile) fd.append('file', selectedFile)

        const res = await apiService.newService(fd)

        if (res.status === 201) {
            //fetchVehiclesFromAPI()
            onClose()
        }
    }

    return (

            isObservationDialogOpened && (
            <>
            <Dialog
                open={props.isObservationDialogOpened}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '75%',
                        maxWidth: 'none',
                        margin: '0 auto'
                    }
                }}
            >


                <DialogTitle align={"center"}>Observation</DialogTitle>

                <DialogContent>
                    <Grid sx={{padding:1}} container spacing={2}>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Observation Date"
                                        value={observationDate}
                                        onChange={handleDateTimeChange}
                                        format="YYYY-MM-DD"
                                        views={['year', 'month', 'day']}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>

                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Service</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    label="Service"
                                >
                                    {(selectedVehicle.services).map((service: Service) => (
                                        <MenuItem key={service.service_id} value={service.service_id}> {service.service_date ?? service.service_id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={description} id="standard-basic" label="Description" variant="standard" onChange={ (event) => setDescription(event.target.value) } />

                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={estimatedCost} id="standard-basic" label="Estimated Costs" variant="standard" onChange={ (event) => setEstimatedCost(Number(event.target.value)) } />

                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={priority} id="standard-basic" label="Priority" variant="standard" onChange={ (event) => setPriority(event.target.value) } />
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={status} id="standard-basic" label="Status" variant="standard" onChange={ (event) => setStatus(event.target.value) } />

                            </FormControl>
                        </Grid>


                        <Grid size={12}>


                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%' }}>

                    </Box>
                    <DialogActions>
                        {selectedObservation !== null ? (
                            <Button
                                color="error"
                                sx={{mr: 'auto'}}
                                onClick={ handleDeleteVehicle }
                            >
                                Delete
                            </Button>
                        ) : null}

                        <Button
                            color="primary"
                            sx={{ mr: 2 }}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        {selectedObservation !== null ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={false}
                                onClick={handleUpdateObservation}
                            >
                                Update
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleAddButon}
                            >Add</Button>
                        )}

                    </DialogActions>
                </DialogContent>
            </Dialog>
            <ConfirmDelete
                isConfirmDeleteOpened={isConfirmDeleteOpened}
                handleCancelConfirmDelete={handleCancelConfirmDelete}
                dialogMessage={'This will delete the vehicle entry and all its associated data?'}
                handleConfirmDelete={handleConfirmDelete}
            />
            </>
        )






    )




}

export default ObservationDialog