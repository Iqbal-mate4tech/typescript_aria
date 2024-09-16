import React from 'react';

import {
  Modal, Box, Card, CardContent, CardHeader, TextField, Button, Grid, Typography
} from '@mui/material';

interface PalletItemModalProps {
  showModal: boolean;
  closeModal: () => void;
  modal: {
    id?: string | number;
    itoNumber: string;
    barcode: string;
    description: string;
    quantity: string;
    outer: string;
    inner: string;
  };
  userName: string;
  onModalFieldChange: (name: string, value: string) => void;
  onBarcodeBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onDoneClick: () => void;
}

const PalletItemModal: React.FC<PalletItemModalProps> = (props) => {
  const { showModal, closeModal, modal, userName, onModalFieldChange, onBarcodeBlur, onDoneClick } = props;

  return (
    <Modal open={showModal} onClose={closeModal} aria-labelledby="pallet-item-modal">
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title={modal.id && modal.id > 0 ? 'Update Item' : 'Add Item'}
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="DID Number"
                variant="outlined"
                fullWidth
                value={modal.itoNumber}
                onChange={(e) => onModalFieldChange('itoNumber', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Barcode"
                variant="outlined"
                fullWidth
                value={modal.barcode}
                onBlur={onBarcodeBlur}
                onChange={(e) => onModalFieldChange('barcode', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={modal.description}
                onChange={(e) => onModalFieldChange('description', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                value={modal.quantity}
                onChange={(e) => onModalFieldChange('quantity', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Outer"
                variant="outlined"
                fullWidth
                value={modal.outer}
                onChange={(e) => onModalFieldChange('outer', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Inner"
                variant="outlined"
                fullWidth
                value={modal.inner}
                onChange={(e) => onModalFieldChange('inner', e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                Added By: <strong>{userName}</strong>
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="contained" color="primary" fullWidth onClick={onDoneClick}>
                  Done
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" fullWidth onClick={closeModal}>
                  Close
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default PalletItemModal;
