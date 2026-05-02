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
import type {Service} from "../types/Service.ts";
import type {Observation} from "../types/Observation.ts";
import type {Vehicle} from "../types/Vehicle.ts";
import authStore from "../stores/components.store.ts";

interface selectedObservationProps {
    selectedService: Service | null;
    setIsObservationDialogOpened: (value: boolean) => void;
    isObservationDialogOpened: boolean;
    setSelectedObservation: (observation: Observation) => void;
    selectedVehicle: Vehicle;

}

function ObservationsList(props: selectedObservationProps) {
    const {
        selectedService,
        setIsObservationDialogOpened,
        setSelectedObservation,
        selectedVehicle
    } = props;

    const firstObservation: Observation = selectedVehicle.observations?.[0];
    const headers: (keyof Observation)[] = firstObservation ? (Object.keys(firstObservation) as (keyof Observation)[]) : ([] as (keyof Observation)[]);

    const formatHeader = (header: string) => {
        return header.split('_').join(' ');
    };

    const handleButtonClick = (row: Observation) => {
        console.log('row', row)
        setSelectedObservation(row);

        // authStore.dispatch({
        //     type: "SELECTED_OBSERVATION_UPDATED",
        //     payload: { selectedObservation: row }
        // });

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
                <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
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