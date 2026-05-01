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
import {useEffect} from "react";
import ConfirmDelete from "./ConfirmDelete.tsx"
import FormControl from "@mui/material/FormControl";
import {TextField} from "@mui/material";
import type { VehicleComponent } from "../types/VehicleComponent.ts";
import type { VehicleComponentSystem } from "../types/VehicleComponentSystem.ts";
import apiService from "../services/api.service.ts";
import type { Maintenance } from "../types/Maintenance.ts";

//selectedVehicle={selectedVehicle} selectedMaintenance={selectedMaintenance} isServiceDialogOpened={isServiceDialogOpened} closeServiceDialog

interface MaintenanceDialogProps {
    selectedMaintenance: Maintenance | null;
    setSelectedMaintenance: (maintenance: Maintenance | null) => void;
    isMaintenanceDialogOpened: boolean;
    onClose: () => void;

}



function MaintenanceDialog(props: MaintenanceDialogProps ) {

    const {
        selectedMaintenance,
        setSelectedMaintenance,
        isMaintenanceDialogOpened,
        onClose,
    } = props;

    console.log('selectedMaintenance', selectedMaintenance);
    console.log('maintenanceDialog', props)

    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);
    const [observationDate, setObservationDate] = React.useState<Dayjs>();
    const [vehicleComponent, setVehicleComponent] = React.useState<VehicleComponent | null>(null);
    const [vehicleComponentSystem, setVehicleComponentSystem] = React.useState<VehicleComponentSystem | null>(null);
    const [description, setDescription] = React.useState<string | null>(null);
    const [cost, setCost] = React.useState<number | null>(null);
    const [notes, setNotes] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<string | null>(null);


    useEffect(()=>  {
        setObservationDate(selectedMaintenance?.observation_date ? dayjs(selectedMaintenance.observation_date) : dayjs() );
        //setSelectedContact(selectedMaintenance?.contact_id);
        setVehicleComponent(selectedMaintenance?.vehicle_component_id)
        setVehicleComponentSystem(selectedMaintenance?.vehicle_component_system_id)
        setDescription(selectedMaintenance?.description)
        setCost(selectedMaintenance?.cost)
        setNotes(selectedMaintenance?.notes)
        setStatus(selectedMaintenance?.status)


        console.log('selectedMaintenance in dialog', selectedMaintenance);
    }, [selectedMaintenance]);

    const closeMaintenanceDialog = () => {
        setIsMaintenanceDialogOpened(false);
        setSelectedMaintenance(null);
    }

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

    const handleDateTimeChange = (selectedMaintenanceDate: Dayjs | null) => {
        const date = selectedMaintenanceDate?.toDate();
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setObservationDate(formattedDate);
        console.log('handleDateTimeChange', selectedMaintenanceDate?.toDate(), formattedDate);
    }

    const buildDialogTitle = () => {
        const service_date = selectedMaintenance?.service_date || undefined
        return service_date
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

            isMaintenanceDialogOpened && (
            <>
            <Dialog
                open={props.isMaintenanceDialogOpened}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '75%',
                        maxWidth: 'none', // Important to override default constraints
                        margin: '0 auto'  // Centers the dialog
                    }
                }}
            >


                    <DialogTitle align={"center"}>Maintenance</DialogTitle>

                <DialogContent>
                    <Grid sx={{padding:1}} container spacing={2}>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    {/*<DateTimePicker label="Purchase Date" onChange={handleDateTimeChange}/>*/}
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
                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={description} id="standard-basic" label="Description" variant="standard" onChange={ (event) => setDescription(event.target.value) } />

                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={cost} id="standard-basic" label="Estimated Costs" variant="standard" onChange={ (event) => setCost(event.target.value) } />

                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={notes} id="standard-basic" label="Priority" variant="standard" onChange={ (event) => setNotes(event.target.value) } />
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
                        {selectedMaintenance !== null ? (
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

                        {selectedMaintenance !== null ? (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={false}
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

export default MaintenanceDialog