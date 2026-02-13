import Grid from '@mui/material/Grid';
import type { GridProps } from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import type {Vehicle} from "../types/Vehicle";
import imageUrl from "../utils/imageUrl.ts";

interface VehicleCardsProps {
    vehicles: Vehicle[];
    handleOpenVehicleDialog: (vehicle: Vehicle) => void;
}

function VehicleCards({vehicles, handleOpenVehicleDialog}: VehicleCardsProps) {

    const containerProps: GridProps = {
        container: true,
        spacing: 4
    };

    const gridItemProps: GridProps = {

    };

    return (

        <Grid {...containerProps}>
            {vehicles.map((vehicle: Vehicle, index: number) => (
                <Grid
                    {...gridItemProps}
                    key={vehicle.vehicle_id || index}
                >
                    <Card raised sx={{ minWidth: 200 }} component="div">
                        <CardContent>
                            <CardMedia
                                sx={{ objectFit: "contain", maxHeight: 200 }}
                                component="img"

                                image={imageUrl(vehicle.photos?.[0]?.image?.data)}
                                title="green iguana"
                            />
                            <Typography variant="h4" component="div">
                                {vehicle.model.brand.brand_name} {vehicle.model.model_name}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                                {vehicle.making_year}
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