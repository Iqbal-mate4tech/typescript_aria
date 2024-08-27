import React from 'react';
import { Modal, Box, Card, CardContent, CardHeader, TextField, Button, Grid } from '@mui/material';

interface MasterModalProps {
  showModal: boolean;
  closeModal: () => void;
  id?: string | number;
  name: string;
  setName: (name: string) => void;
  onDoneClick: () => void;
}

export const MasterModal: React.FC<MasterModalProps> = (props) => {
  const { showModal, closeModal, id, name, setName, onDoneClick } = props;

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title={id ? `Update (${id})` : 'Add New'}
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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

export default MasterModal;
