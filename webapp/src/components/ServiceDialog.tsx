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
import {useEffect, useState} from "react";
import ConfirmDelete from "./ConfirmDelete.tsx"
import type {Service} from "../types/Service.ts";
import FormControl from "@mui/material/FormControl";
import {TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select, {type SelectChangeEvent} from "@mui/material/Select";
import type {Contact} from "../types/Contact.ts";
import MenuItem from "@mui/material/MenuItem";
import type {User} from "../types/User.ts";
import apiService from "../services/api.service.ts";
import type {Vehicle} from "../types/Vehicle.ts";

//selectedVehicle={selectedVehicle} selectedService={selectedService} isServiceDialogOpened={isServiceDialogOpened} closeServiceDialog

interface ServiceDialogProps {
    selectedVehicle: Vehicle;
    selectedService: Service;
    setSelectedService: (service: Service) => void;
    isServiceDialogOpened: boolean;
    onClose: () => void;
    contacts: Contact[];

}

function ServiceDialog(props: ServiceDialogProps ) {

    const {
        selectedVehicle,
        selectedService,
        isServiceDialogOpened,
        onClose,
        contacts,
    } = props;

    console.log('selectedService', selectedService);
    console.log('serviceDialog', props)

    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);
    const [serviceDate, setServiceDate] = React.useState<Dayjs>();
    const [totalCost, setTotalCost] = React.useState<string>('');
    const [selectedContact, setSelectedContact] = React.useState<string>('');
    const [notes, setNotes] = React.useState<string>('');
    const [serviceRequestDescription, setServiceRequestDescription] = React.useState<string>('');

    useEffect(()=>  {
        setServiceDate(selectedService?.service_date ? dayjs(selectedService.service_date) : dayjs() ); // should default to today's date
        setSelectedContact(selectedService?.contact_id);
        setTotalCost(selectedService?.total_cost);
        setNotes(selectedService?.notes);
        setServiceRequestDescription(selectedService?.service_request_description);
        setNotes(selectedService?.notes);
        console.log('selectedService', selectedService);
    }, [selectedService]);


    const handleCancelConfirmDelete = () => {
        onClose();
    }
    const handleDeleteVehicle = () => {
        console.log('handleDeleteVehicle')
        setIsConfirmDeleteOpened(true);
    }

    const handleConfirmDelete = () => {
//        deleteVehicle(selectedVehicle.vehicle_id)
        console.log('handleConfirmDelete')
    }

    const handleDateTimeChange = (selectedServiceDate: Dayjs | null) => {
        const date = selectedServiceDate?.toDate();
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setServiceDate(formattedDate);
        console.log('handleDateTimeChange', selectedServiceDate?.toDate(), formattedDate);
    }



    const buildDialogTitle = () => {
        const service_date = selectedService?.service_date || undefined
        return service_date
    }

    // const handleContactChange = () => {
    //     const selected_contact = selectedContact?.contact_id || undefined
    //     console.log('selected_contactselected_contactselected_contact', selected_contact)
    //     setSelectedContact(selected_contact)
    // }

    const handleContactChange = () => (event: SelectChangeEvent) => {
        console.log('asd')
        setSelectedContact(event.target.value as string);
    };

    const handleAddButon = async () => {
        const fd = new FormData();
        console.log('selectedContact22222222222222222222', selectedContact);
        if (selectedVehicle) { fd.append('vehicle_id', selectedVehicle.vehicle_id) }
        if (selectedContact) { fd.append('contact_id', selectedContact) }
        if (serviceRequestDescription) { fd.append('service_request_description', serviceRequestDescription) }
        if (notes) { fd.append('notes', notes) }
        if (serviceDate) { fd.append('service_date', serviceDate) }
        // if (odometerReading) {fd.append('odometer_reading', odometerReading) }
        if (totalCost) { fd.append('total_cost', totalCost) }
        // if (selectedFile) fd.append('file', selectedFile)

        const res = await apiService.newService(fd)

        if (res.status === 201) {
            //fetchVehiclesFromAPI()
            onClose()
        }
    }

    console.log('CONTACTS', contacts)
    return (

            isServiceDialogOpened && (
            <>
            <Dialog
                open={props.isServiceDialogOpened}
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


                    <DialogTitle align={"center"}>{buildDialogTitle()}</DialogTitle>

                <DialogContent>
                    <Grid sx={{padding:1}} container spacing={2}>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    {/*<DateTimePicker label="Purchase Date" onChange={handleDateTimeChange}/>*/}
                                    <DatePicker
                                        label="Service Date"
                                        value={serviceDate }
                                        onChange={handleDateTimeChange}
                                        format="YYYY-MM-DD"
                                        views={['year', 'month', 'day']}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>

                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Contact</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    value={selectedContact}
                                    label="Contact"
                                    onChange={ (event) => setSelectedContact(event.target.value) }
                                >
                                    {contacts.map((contact: Contact) => (
                                        <MenuItem key={contact.contact_id} value={contact.contact_id}> {contact.contact_name ?? contact.contact_id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={serviceRequestDescription} id="standard-basic" label="Service Request Description" variant="standard" onChange={ (event) => setServiceRequestDescription(event.target.value) } />

                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={totalCost} id="standard-basic" label="Total Cost" variant="standard" onChange={ (event) => setTotalCost(event.target.value) } />
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={notes} id="standard-basic" label="Notes" variant="standard" onChange={ (event) => setNotes(event.target.value) } />

                            </FormControl>
                        </Grid>


                        <Grid size={12}>

                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%' }}>

                    </Box>
                    <DialogActions>
                        {selectedService !== null ? (
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

                        {selectedService !== null ? (
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

export default ServiceDialog