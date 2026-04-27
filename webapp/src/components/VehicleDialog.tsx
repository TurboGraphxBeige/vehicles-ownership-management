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
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {IconButton} from '@mui/material';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ImageList from '@mui/material/ImageList';
import {ImageListItem} from "@mui/material";
import { FaPlus } from 'react-icons/fa';
import ClearIcon from '@mui/icons-material/Clear';

import apiService from "../services/api.service.ts";
import {type SyntheticEvent, useEffect} from "react";
import ConfirmDelete from "./ConfirmDelete.tsx"
import ServicesList from "./ServicesList.tsx";
import imageUrl from "../utils/imageUrl.ts";

import type {Photo} from "../types/Photo";
import type {Model} from "../types/Model.ts";
import type {Brand} from "../types/Brand.ts";
import type {User} from "../types/User.ts";
import type {Contact} from "../types/Contact.ts";
import type { AxiosResponse } from 'axios';
import type { Vehicle } from "../types/Vehicle";
import ServiceDialog from "./ServiceDialog.tsx";
import ObservationDialog from "./ObservationDialog.tsx";
import MaintenanceDialog from "./MaintenanceDialog.tsx";
import type { Service } from "../types/Service.ts";
import type { Maintenance } from "../types/Maintenance.ts"
import type { Observation } from "../types/Observation.ts"
import MaintenancesList from "./MaintenancesList.tsx";
import ObservationsList from "./ObservationsList.tsx";

interface VehicleDialogProps {
    selectedVehicle: Vehicle;
    brands: Brand[];
    models: Model[];
    isVehicleDialogOpened: boolean;
    setSelectedVehicle: () => void;
    onClose: () => void;
    deleteVehicle: (id: string) => Promise<void> | void;
    fetchVehiclesFromAPI: () => Promise<void> | void;
    users: User[];
    contacts: Contact[];
}


function VehicleDialog(props: VehicleDialogProps) {
    const {
        selectedVehicle,
        brands,
        models,
        setSelectedVehicle,
        isVehicleDialogOpened,
        onClose,
        deleteVehicle,
        fetchVehiclesFromAPI,
        users,
        contacts,
    } = props;

    console.log('selectedVehicle', selectedVehicle);

    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [selectedModel, setSelectedModel] = React.useState('');
    const [makingYear, setMakingYear] = React.useState('');
    const [selectedUser, setSelectedUser] = React.useState<string | null>('');
    const [selectedContact, setSelectedContact] = React.useState<string | null>('');
    const [purchaseDate, setPurchaseDate] = React.useState('');
    const [pricePaid, setPricePaid] = React.useState('');
    const [isConfirmDeleteOpened, setIsConfirmDeleteOpened] = React.useState(false);
    const [isServiceDialogOpened, setIsServiceDialogOpened] = React.useState(false);
    const [isMaintenanceDialogOpened, setIsMaintenanceDialogOpened] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<Service | null>( null );
    const [selectedObservation, setSelectedObservation] = React.useState<Observation | null>( null );
    const [isObservationDialogOpened, setIsObservationDialogOpened] = React.useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = React.useState<Maintenance | null>( null );


    useEffect(() => {
        if (selectedVehicle) {
            setSelectedBrand(selectedVehicle.model.brand.brand_id);
            setSelectedModel(selectedVehicle.model.model_id);
            setMakingYear(selectedVehicle.making_year);
            setPurchaseDate(selectedVehicle.purchase_date);
            setPricePaid(selectedVehicle.price_paid);
            setSelectedUser(selectedVehicle.user_id);
            setSelectedContact(selectedVehicle.contact_id);
        }
        console.log('isObservationDialogOpened', isObservationDialogOpened);
    }, [selectedVehicle, isServiceDialogOpened, isObservationDialogOpened]);


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
        setIsConfirmDeleteOpened(true);
    }

    const handleConfirmDelete = () => {
        deleteVehicle(selectedVehicle.vehicle_id)
    }
    const handleChange = (mytype:string) => (event: SelectChangeEvent) => {
        switch (mytype) {
            case 'brand':
                setSelectedBrand(event.target.value as string);
                break;
            case 'model':
                setSelectedModel(event.target.value as string);
                break;
            case 'making_year':
                setMakingYear(event.target.value as string);
                break;
            case 'user':
                setSelectedUser(event.target.value as string);
                break;
            case 'contact':
                setSelectedContact(event.target.value as string);
                break;
            default:
                break;
        }
    };



    const handleDateTimeChange = (selectedPurchaseDate: Dayjs | null) => {
        const date = selectedPurchaseDate?.toDate();
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setPurchaseDate(formattedDate);
    }

    const handleUpdateVehicle = async () => {
        const data: any = {}
        if (selectedModel) { data.model_id = selectedModel.model_id }
        if (makingYear) { data.making_year = makingYear }
        if (purchaseDate) { data.purchase_date = purchaseDate }
        if (pricePaid) { data.price_paid = pricePaid }
        if (selectedUser) { data.user_id = selectedUser; console.log('selectedUser.user_id', selectedUser) }
        if (selectedContact) { data.contact_id = selectedContact; console.log('selectedContact.contact_id', selectedContact) }
        const res = await apiService.updateVehicle(selectedVehicle.vehicle_id, data)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            onClose()
        }

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = event.target.files?.[0] ?? null;
        setSelectedFile(file);
    };

    const handleAddService = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsServiceDialogOpened(true);
    };

    const handleAddObservation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsObservationDialogOpened(true);
    };

    const handleAddMaintenance = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsMaintenanceDialogOpened(true);
    };

    const handleFileDelete = () => {
        setSelectedFile(null);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const fd = new FormData()
        fd.append('vehicle_id', selectedVehicle.vehicle_id)
        fd.append('mimetype', 'image/jpeg')
        fd.append('original_name', '')
        fd.append('file', selectedFile)

        const res: AxiosResponse = await apiService.uploadImage(fd)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            setSelectedFile(null);
            onClose
            console.log('selectedVehicle.photos', res.data)
            console.log(selectedVehicle.photos, selectedVehicle.photos)
            selectedVehicle!.photos!.push(res.data)
            console.log("after", selectedVehicle.photos)
        }

    };


    const handleDeleteImage = async (photo_to_delete: Photo) => {
        const photo_id: string = photo_to_delete.vehicle_photo_id;
        const vehicle_id: string = photo_to_delete.vehicle_id;


        const res: AxiosResponse = await apiService.deleteImage(vehicle_id, photo_id)
        console.log('handleDeleteImage', res);
        if (res.status === 201 && res.data > 0) {
            fetchVehiclesFromAPI()
            setSelectedFile(null);
            onClose
            selectedVehicle!.photos!.forEach((photo: Photo, index: number) => {
                if (photo_id === photo.vehicle_photo_id) {
                    selectedVehicle!.photos!.splice(index, 1)
                }
            })
        }

    };


    const buildDialogTitle = () => {
        const brand_name = selectedVehicle!.model.brand.brand_name ?? ''
        const model_name = selectedVehicle!.model.model_name ?? ''
        const making_year = selectedVehicle!.making_year ?? ''
        return brand_name + ' ' + model_name + ' ' + making_year
    }

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);


    const tabsList: string[] = ['Services', 'Observations', 'Maintenances', 'Photos']

    const [selectedTab, setSelectedTab] = React.useState(tabsList[0]);

    const handleTabChange = (_event: SyntheticEvent , newValue: string) => {
        setSelectedTab(newValue);
    };

    const photos = selectedVehicle?.photos

    const closeServiceDialog = () => {
        setIsServiceDialogOpened(false);
        setSelectedService(null);
    }

    const closeMaintenanceDialog = () => {
        setIsMaintenanceDialogOpened(false);
        setSelectedMaintenance(null);
    }

    const closeObservationDialog = () => {
        setIsObservationDialogOpened(false);
        setSelectedObservation(null);
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
                                    {brands.map((brand: Brand) => (
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
                                    {models.map((model: Model) => (
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

                        <Grid size={6}>

                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Owner</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    value={selectedUser}
                                    label="Owner"
                                    onChange={handleChange('user')}
                                >
                                    {users.map((user: User) => (
                                        <MenuItem key={user.user_id} value={user.user_id}> {user.first_name ?? user.user_id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl variant="outlined"  fullWidth>
                                <InputLabel id="first-select-label">Seller</InputLabel>
                                <Select
                                    labelId="first-select-label"
                                    value={selectedContact}
                                    label="Seller"
                                    onChange={handleChange('contact')}
                                >
                                    {contacts.map((contact: Contact) => (
                                        <MenuItem key={contact.contact_id} value={contact.contact_id}> {contact.contact_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                aria-label="basic tabs example"
                            >

                                <Tab label='Services' value='Services'/>
                                <Tab label='Observations' value='Observations'/>
                                <Tab label='Maintenances' value='Maintenances'/>
                                <Tab label='Photos' value='Photos'/>
                            </Tabs>
                        </Box>

                        {/* Tab Panels */}
                        {selectedTab === 'Photos' && (
                            <Box sx={{ width: '100%', paddingTop: 2, height: 500 }}>
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
                                { photos?.length ? (
                                <ImageList sx={{ width: '100%', height: '85%' }} cols={3} rowHeight={'auto'}>
                                    {photos.map((photo: Photo) => (
                                        <ImageListItem
                                            key={photo?.vehicle_photo_id}

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
                                                src={imageUrl(photo?.image?.data)}
                                                alt={photo?.original_name}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList> ) : null }
                            </Box>
                        )}
                        {selectedTab === 'Services' && (
                            <Box sx={{ width: '100%', paddingTop: 2, height: 500 }}>
                                <Button
                                    sx={{marginTop: 1}}
                                    component="label"
                                    variant="contained"
                                    startIcon={<FaPlus  />}
                                    onClick={handleAddService}
                                >
                                    <Typography>Add</Typography>
                                </Button>
                                <ServicesList
                                    contacts={contacts}
                                    selectedService={selectedService}
                                    setSelectedService={ setSelectedService}
                                    isServiceDialogOpened={isServiceDialogOpened}
                                    selectedVehicle={selectedVehicle}
                                    setSelectedVehicle={setSelectedVehicle}
                                    setIsServiceDialogOpened={setIsServiceDialogOpened}
                                    onClose={ closeServiceDialog }
                                />
                            </Box>
                        )}
                        {selectedTab === 'Observations' && (
                            <Box sx={{ width: '100%', paddingTop: 2, height: 500 }}>
                                <Button
                                    sx={{marginTop: 1}}
                                    component="label"
                                    variant="contained"
                                    startIcon={<FaPlus  />}
                                    onClick={handleAddObservation}
                                >
                                    <Typography>Add</Typography>
                                </Button>
                                    <ObservationsList
                                        selectedObservation={selectedObservation}
                                        setSelectedObservation={ setSelectedObservation }
                                        isObservationDialogOpened={isObservationDialogOpened}
                                        selectedVehicle={selectedVehicle}
                                        setIsObservationDialogOpened={setIsObservationDialogOpened}
                                        onClose={ closeObservationDialog }
                                    />

                            </Box>
                        )}
                        {selectedTab === 'Maintenances' && (
                            <Box sx={{ width: '100%', paddingTop: 2, height: 500 }}>
                                <Button
                                    sx={{marginTop: 1}}
                                    component="label"
                                    variant="contained"
                                    startIcon={<FaPlus  />}
                                    onClick={handleAddMaintenance}
                                >
                                    <Typography>Add</Typography>
                                </Button>
                                    <MaintenancesList selectedMaintenance={selectedMaintenance} setSelectedMaintenance={ setSelectedMaintenance } isMaintenanceDialogOpened={isMaintenanceDialogOpened} selectedVehicle={selectedVehicle} setIsMaintenanceDialogOpened={setIsMaintenanceDialogOpened} onClose={ closeMaintenanceDialog } />
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
                            onClick={handleUpdateVehicle}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <ServiceDialog
                selectedVehicle={selectedVehicle}
                contacts={contacts}
                selectedService={selectedService}
                setSelectedService={() => setSelectedService}
                isServiceDialogOpened={isServiceDialogOpened}
                onClose={closeServiceDialog}/>
            <ObservationDialog
                selectedVehicle={selectedVehicle}
                //selectedObservation={selectedObservation}
                fetchVehiclesFromAPI={fetchVehiclesFromAPI}
                setSelectedObservation={() => setSelectedObservation}
                isObservationDialogOpened={isObservationDialogOpened}
                onClose={closeObservationDialog}/>
            <MaintenanceDialog
                selectedVehicle={selectedVehicle}
                selectedMaintenance={selectedMaintenance}
                setSelectedMaintenance={() => setSelectedMaintenance}
                isMaintenanceDialogOpened={isMaintenanceDialogOpened}
                onClose={closeMaintenanceDialog}/>
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