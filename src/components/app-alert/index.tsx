// import React from 'react';
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button
// } from '@mui/material';

// interface AppAlertProps {
//   showAlert: boolean;
//   headerText: string;
//   message: string;
//   btnCancelText: string;
//   btnOkText?: string;
//   cancelClick: () => void;
//   okClick?: () => void;
// }

// export const AppAlert: React.FC<AppAlertProps> = (props) => {
//   return (
//     <Dialog
//       open={props.showAlert}
//       onClose={props.cancelClick}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//     >
//       <DialogTitle id="alert-dialog-title">{props.headerText}</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description">
//           {props.message}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={props.cancelClick} color="primary">
//           {props.btnCancelText}
//         </Button>
//         {props.okClick && (
//           <Button onClick={props.okClick} color="primary" autoFocus>
//             {props.btnOkText}
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

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
