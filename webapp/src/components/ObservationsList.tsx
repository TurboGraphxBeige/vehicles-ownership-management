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
import type {Observation} from "../types/Observation.ts";
import type {Vehicle} from "../types/Vehicle.ts";
import authStore from "../stores/components.store.ts";
import { useSelector } from 'react-redux';
import type { AuthState } from '../stores/components.store.ts';

interface selectedObservationProps {
    selectedService: Service;
    closeObservationDialog: () => void;
    setIsObservationDialogOpened: ()=> void;
    isObservationDialogOpened: boolean;
    setSelectedObservation: () => void;
    selectedObservation: Observation;
    selectedVehicle: Vehicle;

}

function ObservationsList(props: selectedObservationProps) {
    const {
        selectedService,
        closeObservationDialog,
        setIsObservationDialogOpened,
        isObservationDialogOpened,
        setSelectedObservation,
        selectedObservation,
        selectedVehicle,

    } = props;

    // select the whole selectedObservation
    const selectedObservationtest = useSelector((state: AuthState) => state.selectedObservation);
    console.log('selectedObservationtest' , selectedObservationtest)

    const firstObservation: Observation = selectedVehicle.observations?.[0];
    const headers: (keyof Observation)[] = firstObservation ? (Object.keys(firstObservation) as (keyof Observation)[]) : ([] as (keyof Observation)[]);

    const formatHeader = (header: string) => {
        return header.split('_').join(' ');
    };

    const handleButtonClick = (row: Observation) => {
        console.log('row', row)
        setSelectedObservation(row);
        setIsObservationDialogOpened(true);
    }

    let filteredObservations: Observation[] = [];
    if (selectedService) {
        filteredObservations = selectedVehicle.observations.filter(observation => observation.service_id === selectedService.service_id);
    } else {
        filteredObservations = selectedVehicle.observations
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead stickyHeader>
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
                        {filteredObservations ? filteredObservations.map((row: Observation) => (
                            <TableRow key={row.observation_id}>
                                <TableCell>
                                    <IconButton

                                        onClick={() => handleButtonClick(row)}
                                        size="small"
                                    >
                                        <LaunchIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                {headers.map((header: string) => (
                                    header.includes('id') ? null : (<TableCell align={"center"} key={header}>{row[header as keyof Observation]}</TableCell>)
                                ))}

                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}

export default ObservationsList