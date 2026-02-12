import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import {IconButton} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LaunchIcon from '@mui/icons-material/Launch';
import * as React from "react";
import ServiceDialog from "./ServiceDialog.tsx";

function TableList({selectedVehicle}) {
    const headers = Object.keys(selectedVehicle.services?.[0])
    //headers.unshift('')
    const formatHeader = (header) => {
        return header.split('_').join(' ');
    };

    const closeServiceDialog = () => {
        setIsServiceDialogOpened(false)
    }

    const handleButtonClick = (row) => {
        console.log(row)
        setselectedService(row)
        setIsServiceDialogOpened(true)
    }

    const [isServiceDialogOpened, setIsServiceDialogOpened] = React.useState(false);
    const [selectedService, setselectedService] = React.useState('');


    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>

                            </TableCell>
                            {headers.map((header, i) => (
                                header.includes('id') ? null : (
                                    <TableCell align={"center"}>
                                        <Typography variant="button">{formatHeader(header)}</Typography>
                                    </TableCell>
                                )
                            ))}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedVehicle.services.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleButtonClick(row)}
                                        size="small"
                                    >
                                        <LaunchIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                {headers.map((header) => (
                                    header.includes('id') ? null : (<TableCell align={"center"} key={header}>{row[header]}</TableCell>)
                                ))}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ServiceDialog selectedVehicle={selectedVehicle} selectedService={selectedService} isServiceDialogOpened={isServiceDialogOpened} closeServiceDialog={() => closeServiceDialog}/>
        </>
    );
}

export default TableList