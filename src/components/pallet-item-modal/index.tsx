import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Alert,
} from '@mui/material';

interface PalletItemModalProps {
  modal: any; // Replace with actual type if available
  showModal: boolean;
  onBarcodeBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onModalFieldChange: (field: string, value: string) => void;
  userName: string;
  onDoneClick: () => void;
  closeModal: () => void;
  handleFieldChange: (field: string, value: any) => void;
  sendingInner: boolean;
  setSendingInner: (value: boolean) => void;
  handleDidNumberBlur: () => void;
  handleItoNumberBlur: () => void;
}

export const PalletItemModal: React.FC<PalletItemModalProps> = ({
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
  handleItoNumberBlur,
}) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (modal.quantity > modal.cartons_send) {
      setAlertMessage('Quantity cannot be greater than Cartons to send.');
      setShowAlert(true);
    }
  }, [modal.quantity, modal.cartons_send]);

  return (
    <>
      <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{modal.id && modal.id > 0 ? 'Update Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <RadioGroup
                    value={sendingInner ? 'inner' : 'outer'}
                    onChange={(e) => {
                      const isInner = e.target.value === 'inner';

                      setSendingInner(isInner);
                      handleFieldChange('sendingInner', isInner);
                    }}
                    row
                  >
                    <FormControlLabel
                      value="inner"
                      control={<Radio />}
                      label="Inner"
                    />
                    <FormControlLabel
                      value="outer"
                      control={<Radio />}
                      label="Outer"
                    />
                  </RadioGroup>
                </Grid>

                {!modal.ito_Number && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="DID Number"
                      name="did_Number"
                      value={modal.did_Number}
                      onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                      onBlur={handleDidNumberBlur}
                    />
                  </Grid>
                )}

                {!modal.did_Number && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ITO Number"
                      name="ito_Number"
                      value={modal.ito_Number}
                      onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                      onBlur={handleItoNumberBlur}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Barcode"
                    name="barcode"
                    value={modal.barcode}
                    onBlur={onBarcodeBlur}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={modal.description}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Outer"
                    name="outer"
                    value={modal.outer}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Inner"
                    name="inner"
                    value={modal.inner}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Qty to Send"
                    name="qty_to_send"
                    value={modal.qty_to_send}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                    disabled
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Remaining Qty"
                    name="remaining_qty"
                    value={modal.remaining_qty}
                    onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                    disabled
                  />
                </Grid>

                {sendingInner ? (
                  <>
                    {/* Render inner sending fields */}
                  </>
                ) : (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Cartons to Send"
                        name="cartons_send"
                        value={modal.cartons_send}
                        onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Remaining Cartons"
                        name="remaining_cartons"
                        value={modal.remaining_cartons}
                        onChange={(e) => onModalFieldChange(e.target.name, e.target.value)}
                        disabled
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={sendingInner ? 'Add Number of Inners' : 'Add Number of Cartons'}
                    name="quantity"
                    value={modal.quantity}
                    onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <strong>Added By: {userName}</strong>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onDoneClick}>
            Done
          </Button>
          <Button variant="outlined" onClick={closeModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {showAlert && (
        <Alert
          severity="error"
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
    </>
  );
};
