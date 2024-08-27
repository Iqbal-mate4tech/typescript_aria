import React from 'react';
import {
  Modal, Box, Card, CardContent, CardHeader, Typography, TextField, Button, Grid, TextareaAutosize
} from '@mui/material';

interface POQuantityModalProps {
  showModal: boolean;
  closeModal: () => void;
  poId?: string;
  sku?: string;
  description: string;
  qtyOrdered: string;
  qtyReceivedAlready: string;
  qtyReceived: string;
  setQtyReceived: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  onDoneClick: () => void;
}

export const POQuantityModal: React.FC<POQuantityModalProps> = (props) => {
  const {
    showModal, closeModal, poId, sku, description, qtyOrdered, qtyReceivedAlready, qtyReceived, setQtyReceived, comment, setComment, onDoneClick
  } = props;

  return (
    <Modal open={showModal} onClose={closeModal} aria-labelledby="po-quantity-modal">
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title="Update Quantity"
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {poId && (
                <>
                  <Grid item xs={5}>
                    <Typography variant="subtitle1"><strong>POID</strong></Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1">{poId}</Typography>
                  </Grid>
                </>
              )}

              {sku && (
                <>
                  <Grid item xs={5}>
                    <Typography variant="subtitle1"><strong>SKU</strong></Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body1">{sku}</Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Description</strong></Typography>
                <Typography variant="body1">{description}</Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Qty Ordered</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1">{qtyOrdered}</Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Qty Received</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1">{qtyReceivedAlready}</Typography>
              </Grid>

              <Grid item xs={7}>
                <Typography variant="subtitle1"><strong>Qty Receiving</strong></Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={qtyReceived}
                  onChange={(e) => setQtyReceived(e.target.value)}
                />
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
                  Receive
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

export default POQuantityModal;
