
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Button, Typography, Grid, TextField, IconButton, Checkbox, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { FlashOn, FlashOff, Edit, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { webUrl } from '@/shared/constants';
import AppHeader from '@/components/app-header';
import SingleSelect from '@/components/single-select';
import {AppAlert} from '@/components/app-alert';
import ProductUpdateModal from '@/components/product-update-modal';
import { productAction, unmountProductAction, productTypeAction, clearProductFormData, updateProductFormData, clearProductAction, updateProductAction, updateProductDescriptionAction, syncProductsAction } from './action';
import { uploadFilesToS3 } from './file-uploader';

const Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [pageNo, setPageNo] = useState(1);
  const [detailsToShowIndex, setDetailsToShowIndex] = useState<number | undefined>(undefined);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [productId, setProductId] = useState(0);
  const [productDescription, setProductDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productToSync, setProductToSync] = useState<any[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const productState = useSelector((state: any) => state.product);
  const { formData, products, productTypes } = productState;

  useEffect(() => {
    getProducts();
    dispatch(productTypeAction());

    return () => {
      dispatch(unmountProductAction());
    };
  }, []);

  const onRowClick = (index: number) => {
    setDetailsToShowIndex(index === detailsToShowIndex ? undefined : index);
  };

  const getProducts = (e?: any) => {
    getProductData(pageNo, e);
  };

  const onFieldChange = (name: string, value: any) => {
    dispatch(updateProductFormData({ [name]: value }));
  };

  const getProductData = (page = 1, event?: any) => {
    const request = { page, ...formData };
    dispatch(productAction(request)).then(() => {
      if (event) event.target.complete();
      setIsAllChecked(false);
      setProductToSync([]);
    });
    setPageNo(page + 1);
  };

  const onSearchClick = () => {
    dispatch(clearProductAction());
    getProductData(1);
  };

  const onClearClick = () => {
    dispatch(clearProductAction());
    dispatch(clearProductFormData());
    setPageNo(1);
  };

  const setStatusColor = (value: any) => {
    return value?.published_at ? 'published-status' : 'un-published-status';
  };

  const publishProduct = (id: number) => {
    updateProduct({ ids: [id], published_status: true });
  };

  const unPublish = () => {
    setShowConfirm(false);
    updateProduct({ ids: [productId], published_status: false });
  };

  const updateProduct = (data: any) => {
    dispatch(updateProductAction(data)).then((response: any) => {
      if (response) {
        setProductId(0);
        setProductToSync([]);
        onSearchClick();
      } else {
        setAlertMessage("Updation failed.");
        setShowAlert(true);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFilesToS3(files);
    }
  };

  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeModal = () => {
    setShowUpdateModal(false);
    setProductId(0);
    setProductDescription('');
    setSeoTitle('');
    setSeoDescription('');
  };

  const onDoneClick = () => {
    const request = {
      id: productId.toString(),
      description: productDescription,
      seo_title: seoTitle,
      seo_description: seoDescription
    };

    dispatch(updateProductDescriptionAction(request)).then((response: any) => {
      if (response) {
        closeModal();
        onSearchClick();
      } else {
        setAlertMessage("Updation failed.");
        setShowAlert(true);
      }
    });
  };

  const onProductChecked = (product: any, checked: boolean) => {
    let _products = [...productToSync];
    if (checked) {
      _products.push({ id: product.id, imageUrl: `${webUrl.linodeObjectUrl}${product.sku}.jpg` });
    } else {
      _products = _products.filter(p => p.id !== product.id);
    }
    setProductToSync(_products);
  };

  const productSync = () => {
    if (productToSync.length > 0) {
      const req = { ids: productToSync };
      dispatch(syncProductsAction(req)).then((response: any) => {
        if (response) {
          setProductToSync([]);
          onSearchClick();
        } else {
          setAlertMessage("Sync failed.");
          setShowAlert(true);
        }
      });
    } else {
      setAlertMessage("Please select product to sync.");
      setShowAlert(true);
    }
  };

  const allProductPublish = () => {
    if (productToSync.length > 0) {
      updateProduct({
        ids: productToSync.map(p => p.id),
        published_status: true
      });
    } else {
      setAlertMessage("Please select product to publish.");
      setShowAlert(true);
    }
  };

  const allProductUnPublish = () => {
    if (productToSync.length > 0) {
      updateProduct({
        ids: productToSync.map(p => p.id),
        published_status: false
      });
    } else {
      setAlertMessage("Please select product to un-publish.");
      setShowAlert(true);
    }
  };

  const isChecked = (id: number) => {
    return productToSync.some(p => p.id === id);
  };

  const onAllChecked = (checked: boolean) => {
    setIsAllChecked(checked);
    if (checked) {
      const productsToSync = products.product.map((p: any) => ({
        id: p.id,
        imageUrl: `${webUrl.linodeObjectUrl}${p.sku}.jpg`
      }));
      setProductToSync(productsToSync);
    } else {
      setProductToSync([]);
    }
  };

  const renderProducts = () => {
    return products?.product?.length ? products.product.map((product: any, index: number) => (
      <Card key={index} onClick={() => onRowClick(index)} style={{ marginBottom: '16px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <img className="product-img" src={product.image} alt="" style={{ width: '100%', borderRadius: '8px' }} />
            </Grid>
            <Grid item xs={10}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6"><strong>{product.title}</strong></Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  {product.published_at ? (
                    <IconButton color="secondary" onClick={(e) => {
                      e.stopPropagation();
                      setShowConfirm(true);
                      setAlertMessage("Are you sure to un-publish?");
                      setProductId(product.id);
                    }}>
                      <FlashOff />
                    </IconButton>
                  ) : (
                    <IconButton color="primary" onClick={(e) => {
                      e.stopPropagation();
                      publishProduct(product.id);
                    }}>
                      <FlashOn />
                    </IconButton>
                  )}
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    setProductId(product.id);
                    setProductDescription(product.description);
                    setSeoTitle(product.seo_title);
                    setSeoDescription(product.seo_description);
                    setShowUpdateModal(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <Checkbox
                    checked={isChecked(product.id)}
                    onClick={e => e.stopPropagation()}
                    onChange={e => onProductChecked(product, e.target.checked)}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2"><strong>{product.quantity} in stock</strong></Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2"><strong>{product.product_type}</strong></Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2"><strong>${product.price}</strong></Typography>
                </Grid>
              </Grid>
              {index === detailsToShowIndex && (
                <Grid container spacing={2} style={{ marginTop: '16px' }}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Barcode: <strong>{product.barcode}</strong></Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">Published at: <strong>{product.published_at}</strong></Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">Description: <strong>{product.description}</strong></Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )) : (
      <Card>
        <CardContent>No records found</CardContent>
      </Card>
    );
  };

  return (
    <>
      <AppHeader
        headerText="Products"
        redirectTo={router.push}
        showProductSyncIcon={true}
        onProductSyncClick={productSync}
        uploadProductImg={true}
        onUploadProductImg={handleAddPhotoClick}
        publishProduct={true}
        onPublishProduct={allProductPublish}
        unPublishProduct={true}
        onUnPublishProduct={allProductUnPublish}
      />
      <div style={{ padding: '16px' }}>
        <Card style={{ marginBottom: '24px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputLabel>Title</InputLabel>
                <TextField
                  name="searchTitle"
                  value={formData.searchTitle}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Type</InputLabel>
                <SingleSelect
                  name="searchType"
                  options={productTypes}
                  optionValue="product_type_code"
                  optionName="product_type_description"
                  onChange={onFieldChange}
                  value={formData.searchType}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Status</InputLabel>
                <SingleSelect
                  name="searchStatus"
                  options={[
                    { key: 'published', value: 'Published' },
                    { key: 'unpublished', value: 'Un-Published' },
                    { key: 'any', value: 'Any' }
                  ]}
                  optionValue="key"
                  optionName="value"
                  onChange={onFieldChange}
                  value={formData.searchStatus}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Tag</InputLabel>
                <TextField
                  name="searchTag"
                  value={formData.searchTag}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Barcode</InputLabel>
                <TextField
                  name="searchBarcode"
                  value={formData.searchBarcode}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={onSearchClick}>
                  Search
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" onClick={onClearClick}>
                  Clear
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" onClick={() => router.push('/pallet')}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <CardContent style={{ padding: 0 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <IconButton onClick={() => pageNo > 2 && getProductData(pageNo - 2)} disabled={pageNo <= 2}>
                  <ArrowBack color={pageNo <= 2 ? 'disabled' : 'primary'} />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{pageNo - 1}</Typography>
              </Grid>
              <Grid item>
  <IconButton 
    onClick={() => getProductData(pageNo)} 
    disabled={!products || !products.nextCursor}>
    <ArrowForward color={products && products.nextCursor ? 'primary' : 'disabled'} />
  </IconButton>
</Grid>
              <Grid item xs={5} style={{ textAlign: 'right' }}>
                <Checkbox
                  checked={isAllChecked}
                  onChange={(e) => onAllChecked(e.target.checked)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {renderProducts()}

        <AppAlert
          showAlert={showConfirm}
          headerText="Confirm"
          message={alertMessage}
          btnCancelText="Cancel"
          btnOkText="Yes"
          okClick={unPublish}
          cancelClick={() => setShowConfirm(false)}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept="image/*"
          onChange={handleFileUpload}
        />
        <ProductUpdateModal
          productDescription={productDescription}
          setProductDescription={setProductDescription}
          seoTitle={seoTitle}
          setSeoTitle={setSeoTitle}
          seoDescription={seoDescription}
          setSeoDescription={setSeoDescription}
          showModal={showUpdateModal}
          onDoneClick={onDoneClick}
          closeModal={closeModal}
        />
        <AppAlert
          showAlert={showAlert}
          headerText="Message"
          message={alertMessage}
          btnCancelText="OK"
          cancelClick={() => setShowAlert(false)}
        />
      </div>
    </>
  );
};

export default Product;
