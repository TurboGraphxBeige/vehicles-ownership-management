import React, {useEffect, useState} from 'react';
import ButtonAppBar from "./MainTopBar.tsx";
import MainTopBar from "./MainTopBar.tsx";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import apiService from "../services/api.service.ts";
import CardMedia from '@mui/material/CardMedia';
import VehicleDialog from "./VehicleDialog.tsx";

function VehicleCards({vehicles, handleOpenVehicleDialog}) {



    const theme = useTheme();


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

    function handleOpenButton() {
        console.log("clic345ked")
    }
    return (

        <Grid container  spacing={4} xs={12} sm={6} md={4}>
            {vehicles.map((vehicle, vehicle_id) => (
                <Grid item  key={vehicle_id}>
                    <Card raised sx={{ minWidth: 200 }}>
                        <CardContent>
                            <CardMedia
                                sx={{ objectFit: "contain", maxHeight: 200 }}
                                component="img"

                                image={imageUrl(vehicle.photos[0].image.data)}
                                title="green iguana"
                            />
                            <Typography variant="h4" component="div">
                                {vehicle.model.brand.brand_name} {vehicle.model.model_name}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                {vehicle.making_year} {/* Display card type */}
                            </Typography>

                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Button onClick={ () => handleOpenVehicleDialog(vehicle)} size="small">Open</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}

        </Grid>

    )
}

export default VehicleCards