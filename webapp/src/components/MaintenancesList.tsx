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
import type {Maintenance} from "../types/Maintenance.ts";
import type {Vehicle} from "../types/Vehicle.ts";

interface selectedMaintenanceProps {
    selectedService: Partial<Service | null>;
    closeMaintenanceDialog: () => void;
    setIsMaintenanceDialogOpened: (value: boolean)=> void;
    isMaintenanceDialogOpened: boolean;
    setSelectedMaintenance: (maintenance: Maintenance) => void;
    //selectedMaintenance: Maintenance | null;
    selectedVehicle: Vehicle;

}

function MaintenancesList(props: selectedMaintenanceProps) {
    const {
        selectedService,
        //closeMaintenanceDialog,
        setIsMaintenanceDialogOpened,
        //isMaintenanceDialogOpened,
        setSelectedMaintenance,
        //selectedMaintenance,
        selectedVehicle,

    } = props;

    const firstMaintenance: Maintenance = selectedVehicle.maintenances?.[0];
    const headers: (keyof Maintenance)[] = firstMaintenance ? (Object.keys(firstMaintenance) as (keyof Maintenance)[]) : ([] as (keyof Maintenance)[]);

    const formatHeader = (header: string) => {
        return header.split('_').join(' ');
    };

    const handleButtonClick = (row: Maintenance) => {
        console.log('row', row)
        setSelectedMaintenance(row);
        setIsMaintenanceDialogOpened(true);
    }

    let filteredMaintenances: Maintenance[] = [];
    if (selectedService) {
        filteredMaintenances = selectedVehicle.maintenances.filter(maintenance => maintenance.service_id === selectedService.service_id);
    } else {
        filteredMaintenances = selectedVehicle.maintenances
    }

    console.log('filteredMaintenances', filteredMaintenances);
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
                        {filteredMaintenances ? filteredMaintenances.map((row: Maintenance) => (
                            <TableRow key={row.maintenance_id}>
                                <TableCell>
                                    <IconButton

                                        onClick={() => handleButtonClick(row)}
                                        size="small"
                                    >
                                        <LaunchIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                {headers.map((header: string) => (
                                    header.includes('id') ? null : (<TableCell align={"center"} key={header}>{row[header as keyof Maintenance]}</TableCell>)
                                ))}

                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    );
}

export default MaintenancesList