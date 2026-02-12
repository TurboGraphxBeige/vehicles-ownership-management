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

function VehicleDialog({selectedVehicle, brands, models, isVehicleDialogOpened, onClose, setIsVehicleDialogOpened, deleteVehicle, fetchVehiclesFromAPI}) {
    console.log('selectedVehicle', selectedVehicle);

    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [selectedModel, setSelectedModel] = React.useState('');
    const [makingYear, setMakingYear] = React.useState('');
    const [purchaseDate, setPurchaseDate] = React.useState('');
    const [pricePaid, setPricePaid] = React.useState('');
    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);

    useEffect(()=>  {
        setSelectedBrand(selectedVehicle.model.brand.brand_id)
        setSelectedModel(selectedVehicle.model.model_id)
        setMakingYear(selectedVehicle.making_year)
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
            onClose
            console.log(res)
        }

    }

    const handleCancel = () => {
        setIsVehicleDialogOpened
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
            onClose
            console.log('selectedVehicle.photos', res)
            console.log(selectedVehicle.photos, selectedVehicle.photos)
            selectedVehicle.photos.push(res.data[0])
            console.log("after", selectedVehicle.photos)
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
            onClose
            selectedVehicle.photos.forEach((photo, index) => {
                if (photo_id === photo.vehicle_photo_id) {
                    selectedVehicle.photos.splice(index, 1)
                }
            })
        }

    };


    const buildDialogTitle = () => {
        const brand_name = selectedVehicle.model.brand.brand_name
        const model_name = selectedVehicle.model.model_name
        const making_year = selectedVehicle.making_year
        return brand_name + ' ' + model_name + ' ' + making_year
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

    const photos = selectedVehicle.photos

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

            isVehicleDialogOpened && (
            <>
            <Dialog
                open={isVehicleDialogOpened}
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
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Brand</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    value={selectedBrand}
                                    label="Brand"
                                    onChange={handleChange('brand')}
                                >
                                    {brands.map((brand) => (
                                        <MenuItem key={brand.brand_id} value={brand.brand_id}> {brand.brand_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid  size={6}>
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Model</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    value={selectedModel}
                                    label="Model"
                                    onChange={handleChange('model')}
                                >
                                    {models.map((model) => (
                                        <MenuItem key={model.model_id} value={model.model_id}> {model.model_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={6}>
                            <FormControl variant="outlined" fullWidth>
                                <TextField value={makingYear} id="standard-basic" label="Making Year" variant="standard" onChange={ (event) => setMakingYear(event.target.value) } />

                            </FormControl>
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
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                aria-label="basic tabs example"
                            >

                                        <Tab label='Photos' value='Photos'/>
                                        <Tab label='Services' value='Services'/>
                                        <Tab label='Observations' value='Observations'/>


                            </Tabs>
                        </Box>

                        {/* Tab Panels */}
                        {selectedTab === 'Photos' && (
                            <Box sx={{ width: '100%', height: 500 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* File Upload Button */}
                                    <Button
                                        sx={{marginTop: 1}}
                                        component="label"
                                        variant="contained"
                                        startIcon={<FaPlus  />}
                                    >
                                        <Typography>Add</Typography>
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/jpeg"
                                        />
                                    </Button>

                                    {/* Display selected file name */}
                                    {selectedFile && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton
                                                color="success"
                                                onClick={handleFileUpload}
                                                size="small"
                                            >
                                                <CheckIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={handleFileDelete}
                                                size="small"

                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>

                                            <Typography variant="body2">
                                                {selectedFile.name}
                                            </Typography>
                                        </Box>
                                    )}

                                </Box>
                            <ImageList sx={{ width: '100%', height: '85%' }} cols={3} rowHeight={'auto'}>
                                {photos.map((photo) => (
                                    <ImageListItem
                                        key={photo.vehicle_photo_id}

                                        sx={{ cursor: 'pointer'}}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                zIndex: 2000,
                                                borderRadius: '50%', // Optional: round the background
                                            }}
                                        >

                                            <Button sx={{
                                                minWidth: 'auto',
                                                minHeight: 'auto',
                                                width: 'auto',
                                                height: 'auto',
                                                backgroundColor: '#00000025',
                                                borderRadius: 100,
                                                padding: 0.5, m:0, "&:hover":{backgroundColor: '#00000065'} }}
                                                    onClick={() => handleDeleteImage(photo)}
                                            ><DeleteIcon sx={{color: '#950000'}}  fontSize="small" /></Button>
                                        </Box>
                                        <img
                                            src={imageUrl(photo.image.data)}
                                            alt={photo.original_name}
                                            loading="lazy"
                                            onClick={() => handleImageClick(photo)}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                            </Box>
                        )}
                        {selectedTab === 'Services' && (
                            <Box sx={{ width: '100%', height: 500 }}>
                            <Typography>**Content for Tab 2**</Typography>
                            <TableList selectedVehicle={selectedVehicle}/>
                            </Box>
                        )}
                        {selectedTab === 'Observations' && (
                            <Box sx={{ width: '100%', height: 500 }}>
                                <Typography>**Content for Tab 3**</Typography>

                            </Box>
                        )}
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
                            onClick={onClose}
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

export default VehicleDialog