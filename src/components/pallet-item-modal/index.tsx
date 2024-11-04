// components/PalletItemModal.tsx
import React, { useState, useEffect, ChangeEvent, FocusEvent } from 'react';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, RadioGroup, FormControlLabel,
  Radio, Alert, Grid, Typography
} from '@mui/material';

// Define the props using TypeScript types
interface PalletItemModalProps {
  modal: any;
  showModal: boolean;
  onBarcodeBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onModalFieldChange: (name: string, value: string) => void;
  userName: string;
  onDoneClick: () => void;
  closeModal: () => void;
  handleFieldChange: (name: string, value: string) => void;
  sendingInner: boolean;
  setSendingInner: (value: boolean) => void;
  handleDidNumberBlur: (e: FocusEvent<HTMLInputElement>) => Promise<string>;
  didNumberError: string;
  setDidNumberError: (error: string) => void;
}

const PalletItemModal: React.FC<PalletItemModalProps> = ({
  modal,
  showModal,
  onBarcodeBlur,
  onModalFieldChange,
  userName,
  onDoneClick,
  closeModal,
  handleFieldChange,
  sendingInner,
  setSendingInner,
  handleDidNumberBlur,
  didNumberError,
  setDidNumberError,
}) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleDidBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const didNumber = e.target.value;

    if (!didNumber) {
      setDidNumberError(''); // Clear the error if the field is empty

      return;
    }

    const errorMessage = await handleDidNumberBlur(e);

    setDidNumberError(errorMessage); // Update the error state
  };

  const Quantity = sendingInner
    ? modal.quantity * modal.inner
    : modal.quantity * modal.outer;

  const isQuantityExceeded = (): boolean => {
    const enteredQuantity = parseInt(String(Quantity), 10) || 0;
    const availableQuantity = parseInt(modal.oh_quantity, 10) || 0;


    return enteredQuantity > availableQuantity;
  };

  useEffect(() => {
    const didNumberInvalid = !!didNumberError;
    const quantityInvalid = !modal.quantity || modal.quantity <= 0;

    setIsButtonDisabled(didNumberInvalid || quantityInvalid);
  }, [modal.quantity, didNumberError, Quantity]);

  return (
    <Dialog open={showModal} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogTitle>{modal.id ? 'Update Item' : 'Add Item'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Sending</Typography>
            <RadioGroup
              row
              value={sendingInner ? 'inner' : 'outer'}
              onChange={(e) => {
                const isInner = e.target.value === 'inner';

                setSendingInner(isInner);
                handleFieldChange('sendingInner', String(isInner));
              }}
            >
              <FormControlLabel value="inner" control={<Radio />} label="Inner" />
              <FormControlLabel value="outer" control={<Radio />} label="Outer" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="DID Number"
              name="did_Number"
              value={modal.did_Number}
              onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
              onBlur={handleDidBlur}
              error={!!didNumberError}
              helperText={didNumberError}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Barcode"
              name="barcode"
              value={modal.barcode}
              onBlur={onBarcodeBlur}
              onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Description"
              name="description"
              value={modal.description}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Outer"
              name="outer"
              value={modal.outer}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Qty to Send"
              name="qty_to_send"
              value={modal.qty_to_send}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Remaining Qty"
              name="remaining_qty"
              value={modal.remaining_qty}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="OnHand Quantity"
              name="oh_quantity"
              value={modal.oh_quantity}
              disabled
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body1"
              color={isQuantityExceeded() ? 'error' : 'success'}
            >
              {parseInt(modal.oh_quantity, 10) === 0
                ? 'There is no stock available to add this item into pallet'
                : isQuantityExceeded()
                  ? 'Quantity exceeds available amount'
                  : `Available stock: ${modal.oh_quantity}`}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={sendingInner ? 'Add Number of Inners' : 'Add Number of Cartons'}
              name="quantity"
              value={modal.quantity}
              onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Added By: {userName}</strong>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item md={3} xs={6} >
            <Button
              onClick={onDoneClick}
              disabled={isButtonDisabled}
              variant="contained" className="w-full" size="large" style={{ padding: '15px 0' }} fullWidth
            >
              Done
            </Button>
          </Grid>
          <Grid item md={3} xs={6}>
            <Button onClick={closeModal}
              variant="contained" className="w-full" size="large" style={{ padding: '15px 0' }} fullWidth>
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogActions>

      {showAlert && (
        <Alert
          severity="warning"
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
    </Dialog>
  );
};

export default PalletItemModal;
