import * as React from 'react';
import ButtonAppBar from "./MainTopBar.tsx";
import MainTopBar from "./MainTopBar.tsx";
import VehiclesCards from "./VehiclesCards.tsx";
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Input,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import apiService from "../services/api.service.ts";

function NewVehicleDialog({isVehicleDialogOpened, brands, models, onClose, fetchVehiclesFromAPI}) {

    console.log('Main', models);

    //const [open, setOpen] = useState<boolean>(isNewVehicleDialogOpened);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    //function handleClose() {
    //    setOpen(false)
    //}
    const [selectedBrand, setSelectedBrand] = React.useState('');
    const [selectedModel, setSelectedModel] = React.useState('');
    const [makingYear, setMakingYear] = React.useState('');
    const [purchaseDate, setPurchaseDate] = React.useState('');

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
            onClose(false)
            console.log(res)
        }

    }

    const handleCancel = () => {
        onClose(false)
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('handleFileChange', file);
    };
    const handleFileDelete = () => {
        setSelectedFile(null);
    };

    const [selectedFile, setSelectedFile] = React.useState(null);
    return (
        <Dialog
            open={isVehicleDialogOpened}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"

        >


                <DialogTitle align={"center"}>Add New Vehicle</DialogTitle>

            <DialogContent>
                <Grid sx={{padding:1}} container spacing={4}>

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
                            <TextField id="standard-basic" label="Making Year" variant="standard" onChange={ (event) => setMakingYear(event.target.value) } />

                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                    </Grid>
                    <Grid size={6}>


                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                {/*<DateTimePicker label="Purchase Date" onChange={handleDateTimeChange}/>*/}
                                <DatePicker
                                    label="Select Date"
                                    // value={selectedDate}
                                    onChange={handleDateTimeChange}
                                    format="YYYY-MM-DD"
                                    views={['year', 'month', 'day']}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* File Upload Button */}
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Main Picture
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/jpeg"
                                />
                            </Button>

                            {/* Display selected file name */}
                            {selectedFile && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">
                                        {selectedFile.name}
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        onClick={handleFileDelete}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                        </Box>
                    </Grid>
                </Grid>
                <DialogActions>
                    <Button
                        color="primary"
                        sx={{ mr: 2 }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={false}
                        onClick={handleAddNewVehicle}
                    >
                        Add New Vehicle
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>



    )
}

export default NewVehicleDialog