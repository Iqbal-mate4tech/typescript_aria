import React from 'react';
import {
  Modal, Box, Card, CardContent, CardHeader, Typography, TextField, Button, Grid
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface ProductUpdateModalProps {
  showModal: boolean;
  closeModal: () => void;
  productDescription: string;
  setProductDescription: (data: string) => void;
  seoTitle: string;
  setSeoTitle: (value: string) => void;
  seoDescription: string;
  setSeoDescription: (value: string) => void;
  onDoneClick: () => void;
}

export const ProductUpdateModal: React.FC<ProductUpdateModalProps> = (props) => {
  const {
    showModal, closeModal, productDescription, setProductDescription, seoTitle, setSeoTitle, seoDescription, setSeoDescription, onDoneClick
  } = props;

  return (
    <Modal open={showModal} onClose={closeModal} aria-labelledby="product-update-modal">
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5, p: 2 }}>
        <Card>
          <CardHeader
            title="Update Product"
            sx={{ textAlign: 'center', backgroundColor: '#f5f5f5' }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="subtitle1"><strong>Description</strong></Typography>
              </Grid>
              <Grid item xs={9}>
                <CKEditor
                  editor={ClassicEditor as any}  // Force the type here
                  data={productDescription}
                  onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    setProductDescription(data);
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1"><strong>SEO Title</strong></Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1"><strong>SEO Description</strong></Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </Grid>

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

export default ProductUpdateModal;
