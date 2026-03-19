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
import type {Service} from "../types/Service.ts";
import FormControl from "@mui/material/FormControl";
import {TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type {Contact} from "../types/Contact.ts";
import MenuItem from "@mui/material/MenuItem";
import type {User} from "../types/User.ts";

//selectedVehicle={selectedVehicle} selectedService={selectedService} isServiceDialogOpened={isServiceDialogOpened} closeServiceDialog

interface ServiceDialogProps {
    selectedService: Service;
    setSelectedService: (service: Service) => void;
    isServiceDialogOpened: boolean;
    onClose: () => void;
    contacts: Contact[];

}

function ServiceDialog(props: ServiceDialogProps ) {

    const {
        selectedService,
        isServiceDialogOpened,
        onClose,
        contacts,
    } = props;

    console.log('selectedService', selectedService);
    console.log('serviceDialog', props)

    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);
    const [serviceDate, setServiceDate] = React.useState<string>('');
    const [selectedContact, setSelectedContact] = React.useState<string>('');

    useEffect(()=>  {
        setServiceDate(selectedService?.service_date);
        setSelectedContact(selectedService?.contact_id);
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
        console.log('handleDateTimeChange', formattedDate);
    }



    const buildDialogTitle = () => {
        const service_date = selectedService?.service_date || undefined
        return service_date
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
                                        value={dayjs(serviceDate)}
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
                                    //onChange={handleContactChange}
                                >
                                    {contacts.map((contact: Contact) => (
                                        <MenuItem key={contact.contact_id} value={contact.contact_id}> {contact.contact_name ?? contact.contact_id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={selectedService?.service_request_description} id="standard-basic" label="Service Request Description" variant="standard" onChange={ (event) => setMakingYear(event.target.value) } />

                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={selectedService?.notes} id="standard-basic" label="Notes" variant="standard" onChange={ (event) => setMakingYear(event.target.value) } />

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
                            <Button variant="contained">Add</Button>
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