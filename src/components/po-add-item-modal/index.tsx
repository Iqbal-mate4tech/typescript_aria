import React from 'react';

import {
  Modal, Box, Card, CardContent, CardHeader, TextField, Button, Grid, Typography, TextareaAutosize
} from '@mui/material';

interface POQAddItemModalProps {
  showModal: boolean;
  closeModal: () => void;
  poid: string;
  SupplierSku: string;
  Qty: string;
  setQty: (value: string) => void;
  storeid: string;
  setStoreid: (value: string) => void;
  userstoreid: string;
  setUserstoreid: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  cartonqty: string;
  setCartonqty: (value: string) => void;
  innerqty: string;
  setInnerqty: (value: string) => void;
  dateReceive: string;
  userName: string;
  comment: string;
  setComment: (value: string) => void;
  onDoneClick: () => void;
}

const POQAddItemModal: React.FC<POQAddItemModalProps> = (props) => {
  const {
    showModal, closeModal, poid, SupplierSku, Qty, setQty, storeid, setStoreid, userstoreid, setUserstoreid,
    description, setDescription, cartonqty, setCartonqty, innerqty, setInnerqty, dateReceive, userName, comment, setComment, onDoneClick
  } = props;

  return (
    <Modal open={showModal} onClose={closeModal} aria-labelledby="po-add-item-modal">
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title="Add Item PO"
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Typography variant="subtitle1"><strong>POID</strong></Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1">{poid}</Typography>
              </Grid>

              <Grid item xs={5}>
                <Typography variant="subtitle1"><strong>SKU</strong></Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1">{SupplierSku}</Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Qty</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={Qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Store ID</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={storeid}
                  onChange={(e) => setStoreid(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>User Store ID</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={userstoreid}
                  onChange={(e) => setUserstoreid(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Description</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Carton Qty</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={cartonqty}
                  onChange={(e) => setCartonqty(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Inner Qty</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={innerqty}
                  onChange={(e) => setInnerqty(e.target.value)}
                />
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Date Received</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1"><strong>{dateReceive}</strong></Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Added By</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1"><strong>{userName}</strong></Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Comment</strong></Typography>
                <TextareaAutosize
                  minRows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#c4c4c4' }}
                />
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" color="primary" fullWidth onClick={onDoneClick}>
                  Done
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" fullWidth onClick={closeModal}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default POQAddItemModal;
