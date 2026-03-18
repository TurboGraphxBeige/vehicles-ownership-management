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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {IconButton} from '@mui/material';
import { styled } from '@mui/material/styles';
import apiService from "../services/api.service.ts";
import type {Model} from "../types/Model.ts";
import type {Brand} from "../types/Brand.ts";
import {Dayjs} from "dayjs";

interface NewVehicleDialogProps {
    isNewVehicleDialogOpened: boolean;
    brands: Brand[];
    models: Model[];
    onClose: () => void;
    fetchVehiclesFromAPI: () => void;
}

function NewVehicleDialog(props: NewVehicleDialogProps) {

    const {
        isNewVehicleDialogOpened,
        brands,
        models,
        onClose,
        fetchVehiclesFromAPI,
    } = props;

    console.log('Main', models);

    const [selectedBrand, setSelectedBrand] = React.useState<Brand>();
    const [selectedModel, setSelectedModel] = React.useState<Model>();
    const [makingYear, setMakingYear] = React.useState('');
    const [purchaseDate, setPurchaseDate] = React.useState('');
    const [odometerReading, setOdometerReading] = React.useState<string>();
    const [pricePaid, setPricePaid] = React.useState<string>();

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

    const handleBrandChange = (event: SelectChangeEvent) => {
        const result: Brand | undefined = brands.find(brand => {
            return brand.brand_id === event.target.value
        })
        if (result) {
            setSelectedBrand(result);
        }
    }

    const handleModelChange = (event: SelectChangeEvent) => {
        const result: Model | undefined = models.find(model => {
            return model.model_id === event.target.value
        })
        if (result) {
            setSelectedModel(result);
        }
    }



    const handleDateTimeChange = (selectedPurchaseDate: Dayjs | null) => {
        const date = selectedPurchaseDate?.toDate();
        const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
        setPurchaseDate(formattedDate);
    }

    const handleAddNewVehicle = async () => {
        const fd = new FormData()
        if (selectedModel) { fd.append('model_id', selectedModel.model_id) }
        if (makingYear) { fd.append('making_year', makingYear) }
        if (purchaseDate) { fd.append('purchase_date', purchaseDate) }
        if (odometerReading) {fd.append('odometer_reading', odometerReading) }
        if (pricePaid) { fd.append('price_paid', pricePaid) }
        if (selectedFile) fd.append('file', selectedFile)

        const res = await apiService.newCar(fd)

        if (res.status === 201) {
            fetchVehiclesFromAPI()
            onClose()
        }
    }

    const handleCancel = () => {
        onClose()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = event.target.files?.[0] ?? null;
        setSelectedFile(file);
    };

    const handleFileDelete = () => {
        setSelectedFile(null);
    };

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    return (
        <Dialog
            open={isNewVehicleDialogOpened}
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
                                error={!selectedBrand}
                                value={selectedBrand?.brand_id}
                                label="Brand"
                                onChange={handleBrandChange}
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
                                error={!selectedModel}
                                disabled={!selectedBrand}
                                value={selectedModel?.model_id}
                                label="Model"
                                onChange={handleModelChange}
                            >
                                {selectedBrand?.models?.map((model: Model) => (
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
                        <FormControl variant="outlined" fullWidth>
                            <TextField id="standard-basic" label="Odometer Reading" variant="standard" onChange={ (event) => setOdometerReading(event.target.value) } />
                        </FormControl>
                    </Grid>
                    <Grid size={6}>


                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                {/*<DateTimePicker label="Purchase Date" onChange={handleDateTimeChange}/>*/}
                                <DatePicker
                                    label="Purchase Date"
                                    // value={selectedDate}
                                    onChange={handleDateTimeChange}
                                    format="YYYY-MM-DD"
                                    views={['year', 'month', 'day']}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                    </Grid>
                    <Grid size={6}>
                        <FormControl variant="outlined" fullWidth>
                            <TextField id="standard-basic" label="Price Paid ($)" variant="standard" onChange={ (event) => setPricePaid(event.target.value) } />
                        </FormControl>
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