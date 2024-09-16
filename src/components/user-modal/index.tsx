import React from 'react';

import {
  Card, CardContent, CardHeader, Button, Typography,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel
} from '@mui/material';

import SingleSelect from '../single-select'; // Assuming you've converted SingleSelect already

interface UserMasterModalProps {
  showModal: boolean;
  id?: number;
  name: string;
  setName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  types: Array<{ [key: string]: string | number }>;
  store: string;
  setStore: (value: string) => void;
  admin: boolean;
  setAdmin: (value: boolean) => void;
  onDoneClick: () => void;
  closeModal: () => void;
}

const UserMasterModal: React.FC<UserMasterModalProps> = (props) => {
  const {
    showModal, id, name, setName, password, setPassword, type, setType,
    types, store, setStore, admin, setAdmin, onDoneClick, closeModal
  } = props;

  return (
    <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>{id ? `Update (${id})` : 'Add New'}</DialogTitle>
      <DialogContent>
        <Card variant="outlined" >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>User Name</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>Password</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>User Type</Typography>
              </Grid>
              <Grid item xs={8}>
                <SingleSelect
                  name="type"
                  options={types}
                  optionValue="user_type"
                  optionName="user_type"
                  value={type}
                  onChange={(name, value) => setType(value)}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>Store</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>Is Admin</Typography>
              </Grid>
              <Grid item xs={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={admin}
                      onChange={(e) => setAdmin(e.target.checked)}
                    />
                  }
                  label=""
                />
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

export default UserMasterModal;
