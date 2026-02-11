import React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {Checkbox} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useState} from "react";

function ConfirmDelete({isConfirmDeleteOpened, dialogMessage, handleCancelConfirmDelete, handleConfirmDelete}) {

    console.log('isConfirmDeleteOpened', dialogMessage)

    const [isConfirmChecked, setIsConfirmChecked] = useState(false);

    const handleCancel = () => {
        handleCancelConfirmDelete()
        setIsConfirmChecked(false);
    }

    return (
        <Dialog
            open={isConfirmDeleteOpened}
            onClose={ () => handleCancel}
        >
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
                <Box sx={{p:2}}>
                <Typography>{dialogMessage}</Typography>
                </Box>
                <Box>
                <FormControlLabel
                    label="Really Delete?"
                    control={<Checkbox color="error" checked={isConfirmChecked} onChange={() => setIsConfirmChecked(!isConfirmChecked)} /> }/>
                </Box>
            </DialogContent>

            <DialogActions>

                <Button
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => handleCancel()}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={!isConfirmChecked}
                    onClick={() => handleConfirmDelete()}
                >
                    Delete
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ConfirmDelete