import React from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid
} from '@mui/material';

interface DirectToStoreProps {
  showModal: boolean;
  closeModal: () => void;
  noOfPallet: string;
  setNoOfPallet: (value: string) => void;
  supplier: string;
  setSupplier: (value: string) => void;
  conNumber: string;
  setConNumber: (value: string) => void;
  onDoneClick: () => void;
}

const DirectToStore: React.FC<DirectToStoreProps> = (props) => {
  return (
    <Dialog open={props.showModal} onClose={props.closeModal} className="direct-to-store-modal">
      <DialogTitle>Direct to Store</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="No. of Pallet"
              name="noOfPallet"
              value={props.noOfPallet}
              onChange={(e) => props.setNoOfPallet(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Supplier"
              name="supplier"
              value={props.supplier}
              onChange={(e) => props.setSupplier(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Con. Number"
              name="conNumber"
              value={props.conNumber}
              onChange={(e) => props.setConNumber(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDoneClick} color="primary" variant="contained">
          Save
        </Button>
        <Button onClick={props.closeModal} color="secondary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DirectToStore;
