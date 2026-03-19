import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import {IconButton} from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
import * as React from "react";
import ServiceDialog from "./ServiceDialog.tsx";
import type {Service} from "../types/Service.ts";
import type {Vehicle} from "../types/Vehicle.ts";

interface selectedVehicleProps {
    selectedVehicle: Vehicle;
    closeServiceDialog: () => void;
    setIsServiceDialogOpened: ()=> void;
    isServiceDialogOpened: boolean;
    setSelectedService: () => void;
    selectedService: Service;

}

function TableList(props: selectedVehicleProps) {
    const {
        selectedVehicle,
        closeServiceDialog,
        setIsServiceDialogOpened,
        isServiceDialogOpened,
        setSelectedService,
        selectedService,

    } = props;

    const firstService: Service = selectedVehicle.services?.[0];
    const headers: (keyof Service)[] = firstService ? (Object.keys(firstService) as (keyof Service)[]) : ([] as (keyof Service)[]);

    const formatHeader = (header: string) => {
        return header.split('_').join(' ');
    };

    const handleButtonClick = (row: Service) => {
        console.log('row', row)
        setSelectedService(row);
        setIsServiceDialogOpened(true);
    }

    //const [isServiceDialogOpened, setIsServiceDialogOpened] = React.useState(false);
//    const [selectedService, setselectedService] = React.useState<Service | null>( null );


    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                            {headers.map((header) => (
                                header.includes('id') ? null : (
                                    <TableCell align={"center"}>
                                        <Typography variant="button">{formatHeader(header)}</Typography>
                                    </TableCell>
                                )
                            ))}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedVehicle.services ? selectedVehicle.services.map((row: Service) => (
                            <TableRow key={row.service_id}>
                                <TableCell>
                                    <IconButton

                                        onClick={() => handleButtonClick(row)}
                                        size="small"
                                    >
                                        <LaunchIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                {headers.map((header: string) => (
                                    header.includes('id') ? null : (<TableCell align={"center"} key={header}>{row[header as keyof Service]}</TableCell>)
                                ))}

                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}

export default TableList