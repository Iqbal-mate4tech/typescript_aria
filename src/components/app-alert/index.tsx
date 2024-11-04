import React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface AppAlertProps {
    showAlert: boolean;
    headerText: string;
    message: string;
    btnCancelText: string;
    btnOkText?: string;
    cancelClick: () => void;
    okClick?: () => void;
}

export const AppAlert: React.FC<AppAlertProps> = (props) => {
    const { showAlert, headerText, message, btnCancelText, btnOkText, cancelClick, okClick } = props;

    return (
        <Dialog open={showAlert} onClose={cancelClick}>
            <DialogTitle>{headerText}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelClick} color="secondary">
                    {btnCancelText}
                </Button>
                {okClick && btnOkText && (
                    <Button onClick={okClick} color="primary">
                        {btnOkText}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
