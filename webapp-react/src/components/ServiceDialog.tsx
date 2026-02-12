import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {TextField} from "@mui/material";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/ListItem";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Input,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/material/Tab';
import ImageList from '@mui/material/ImageList';
import {ImageListItem} from "@mui/material";
import { FaPlus } from 'react-icons/fa';
import ClearIcon from '@mui/icons-material/Clear';

import apiService from "../services/api.service.ts";
import {useEffect} from "react";
import ConfirmDelete from "./ConfirmDelete.tsx"
import ImageCarousel from "./ImageCarousel";
import TableList from "./TableList.tsx";

function ServiceDialog({selectedVehicle, selectedService, brands, models, isServiceDialogOpened, closeServiceDialog, setisServiceDialogOpened, deleteVehicle, fetchVehiclesFromAPI}) {
    console.log('selectedService', selectedService);


    const [purchaseDate, setPurchaseDate] = React.useState('');
    const [pricePaid, setPricePaid] = React.useState('');
    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);

    useEffect(()=>  {
        setPurchaseDate(selectedVehicle.purchase_date)
    }, []);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleCancelConfirmDelete = () => {
        setIsConfirmDeleteOpened(false);
    }
    const handleDeleteVehicle = () => {
        console.log('handleDeleteVehicle')
        setIsConfirmDeleteOpened(true);
    }

    const handleConfirmDelete = () => {
        deleteVehicle(selectedVehicle.vehicle_id)
    }
    const handleChange = (mytype:string) => (event: SelectChangeEvent) => {
        console.log('mytype', mytype);
        switch (mytype) {
            case 'brand':
                setSelectedBrand(event.target.value as string);
                break;
            case 'model':
                setSelectedModel(event.target.value as string);
                break;
            case 'making_year':
                setMakingYear(event.target.value as string);
            default:
                break;
        }
    };

    const handleDateTimeChange = (selectedPurchaseDate) => {
        const date = new Date(selectedPurchaseDate);
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setPurchaseDate(formattedDate);
        console.log('handleDateTimeChange', formattedDate);
    }

    const handleAddNewVehicle = async () => {
        const fd = new FormData()
        fd.append('model_id', selectedModel)
        fd.append('making_year', makingYear)
        fd.append('purchase_date', purchaseDate)
        fd.append('file', selectedFile)
        console.log('handleAddNewVehicle', fd);

        const res = await apiService.newCar(fd)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            closeServiceDialog
            console.log(res)
        }

    }

    const handleCancel = () => {
        setisServiceDialogOpened
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('handleFileChange', file);
    };
    const handleFileDelete = () => {
        setSelectedFile(null);
    };

    const handleFileUpload = async () => {
        const fd = new FormData()
        // selectedFile.vehicle_id
        fd.append('vehicle_id', selectedVehicle.vehicle_id)
        fd.append('mimetype', 'image/jpeg')
        fd.append('original_name', '')
        fd.append('file', selectedFile)
        console.log('handleFileUpload', fd);

        const res = await apiService.uploadImage(fd)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            setSelectedFile(null);
            closeServiceDialog

            selectedVehicle.photos.push(res.data[0])

        }

    };


    const handleDeleteImage = async (photo_to_delete) => {
        const photo_id: string = photo_to_delete.vehicle_photo_id;
        const vehicle_id: string = photo_to_delete.vehicle_id;
        console.log('handleDeleteImage', photo_id);

        const res = await apiService.deleteImage(vehicle_id, photo_id)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            setSelectedFile(null);
            closeServiceDialog
            selectedVehicle.photos.forEach((photo, index) => {
                if (photo_id === photo.vehicle_photo_id) {
                    selectedVehicle.photos.splice(index, 1)
                }
            })
        }

    };


    const buildDialogTitle = () => {
        const service_date = selectedService.service_date
        return service_date
    }

    const [selectedFile, setSelectedFile] = React.useState(null);

    const tabsList: string[] = ['Photos', 'Services', 'Observations']

    const [selectedTab, setSelectedTab] = React.useState(tabsList[0]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleImageClick = (item) => {
        console.log(item);
    }



    function imageUrl(data) {
        const byteArray = data; // Example array of byte integers

        const byteArrayToString = (byteArray) => {
            let str = '';
            for (let i = 0; i < byteArray.length; i += 65536) {
                str += String.fromCharCode.apply(null, byteArray.slice(i, i + 65536));
            }
            return str;
        };

        const base64String = btoa(byteArrayToString(byteArray));
        const image = `data:image/jpeg;base64,${base64String}`;
        return image;
    }


    return (

            isServiceDialogOpened && (
            <>
            <Dialog
                open={isServiceDialogOpened}
                onClose={closeServiceDialog()}
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
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={selectedService.service_date} id="standard-basic" label="Making Year" variant="standard" onChange={ (event) => setMakingYear(event.target.value) } />
                            </FormControl>
                        </Grid>

                        <Grid size={6}>

                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={pricePaid} id="standard-basic" label="Price Paid" variant="standard" onChange={ (event) => setPricePaid(event.target.value) } />
                            </FormControl>
                        </Grid>
                        <Grid size={6}>


                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    {/*<DateTimePicker label="Purchase Date" onChange={handleDateTimeChange}/>*/}
                                    <DatePicker
                                        label="Purchase Date"
                                        value={dayjs(purchaseDate)}
                                        onChange={handleDateTimeChange}
                                        format="YYYY-MM-DD"
                                        views={['year', 'month', 'day']}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>

                        </Grid>



                        <Grid size={12}>

                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%' }}>

                    </Box>
                    <DialogActions>
                        <Button
                            color="error"
                            sx={{mr: 'auto'}}
                            onClick={ handleDeleteVehicle }
                            >
                            Delete
                        </Button>
                        <Button
                            color="primary"
                            sx={{ mr: 2 }}
                            onClick={closeServiceDialog()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={false}
                            onClick={handleAddNewVehicle}
                        >
                            Update
                        </Button>
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