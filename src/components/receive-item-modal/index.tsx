import React from 'react';
import {
  Modal, Box, Card, CardContent, CardHeader, Typography, TextField, Button, Grid
} from '@mui/material';
import { getVariance } from '../../shared/common';

interface ReceiveItemModalProps {
  showModal: boolean;
  closeModal: () => void;
  onDoneClick: () => void;
  onModalFieldChange: (name: string, value: string) => void;
  modal: {
    quantity: number;
    receivedCount: number;
  };
}

export const ReceiveItemModal: React.FC<ReceiveItemModalProps> = (props) => {
  const { showModal, closeModal, onDoneClick, onModalFieldChange, modal } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onModalFieldChange(e.target.name, e.target.value);
  };

  return (
    <Modal open={showModal} onClose={closeModal} aria-labelledby="receive-item-modal">
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title="Receive Item"
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Quantity</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1"><strong>{modal.quantity}</strong></Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Received Count</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="receivedCount"
                      value={modal.receivedCount}
                      onChange={onChange}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Variance</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1"><strong>{getVariance(modal.quantity, modal.receivedCount)}</strong></Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid container spacing={2} justifyContent="center">
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

export default ReceiveItemModal;
