import React from 'react';
import {
  Card, CardContent, CardHeader, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Typography
} from '@mui/material';
import SingleSelect from '../single-select'; // Assuming you've converted SingleSelect already

interface StatusModalProps {
  showModal: boolean;
  palletStatus: Array<{ [key: string]: string | number }>;
  status: string;
  userName: string;
  onModalFieldChange: (name: string, value: string | number) => void;
  onDoneClick: () => void;
  closeModal: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = (props) => {
  const { showModal, palletStatus, status, userName, onModalFieldChange, onDoneClick, closeModal } = props;

  return (
    <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>Status</Typography>
              </Grid>
              <Grid item xs={8}>
                <SingleSelect
                  name="status"
                  options={palletStatus}
                  optionValue={(localStorage.getItem('userType') === 'manager' || localStorage.getItem('userType') === 'admin' || localStorage.getItem('userType') === 'buyer') ? 'status_name' : 'status'}
                  optionName={(localStorage.getItem('userType') === 'manager' || localStorage.getItem('userType') === 'admin' || localStorage.getItem('userType') === 'buyer') ? 'status_name' : 'status'}
                  value={status}
                  onChange={onModalFieldChange}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography>Changed By</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography><strong>{userName}</strong></Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onDoneClick}>Done</Button>
        <Button variant="outlined" color="secondary" onClick={closeModal}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusModal;
