'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button, Card, CardContent, CardHeader, TextField, InputLabel, Grid, Fab, Typography, Box, CardActions
} from '@mui/material';
import { useSelector } from 'react-redux';

import AppHeader from '@/components/app-header';
import {
  poAction, unmountPOAction, clearPOAction, poItemsAction, poMasterDataAction, uploadPOAction, receivePOAction
} from './action';
import SingleSelect from '@/components/single-select';
import { getUserStore } from '@/shared/common';
import { AppAlert } from '@/components/app-alert';
import POQuantityModal from '@/components/po-quantity-modal';
import { useAppDispatch, type RootState } from '../../store';
import useAuth from '@/components/withAuth';


const PurchaseOrder: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAuth();





  const [detailsToShowIndex, setDetailsToShowIndex] = useState<any>(undefined);
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<any>(undefined);
  const [pageNo, setPageNo] = useState<any>(1);
  const [searchData, setSearchData] = useState<any>({ modal: {} });
  const [alertMessage, setAlertMessage] = useState<any>('');
  const [showAlert, setShowAlert] = useState<any>(false);
  const [comment, setComment] = useState<any>('');
  const [qtyReceived, setQtyReceived] = useState<any>('');
  const [qtyReceivedAlready, setQtyReceivedAlready] = useState<any>('');
  const [showModal, setShowModal] = useState<any>(false);
  const [qtyOrdered, setQtyOrdered] = useState<any>(false);
  const [poId, setPOId] = useState<any>(false);
  const [sku, setSKU] = useState<any>(false);
  const [userName, setUserName] = useState<any>(null);

  const po = useSelector((state: RootState) => state.purchaseOrder.po);
  const poItems = useSelector((state: RootState) => state.purchaseOrder.poItems);
  const poStore = useSelector((state: RootState) => state.purchaseOrder.poStore);
  const userStore = getUserStore();
  const poStatus = useSelector((state: RootState) => state.purchaseOrder.poStatus);

  useEffect(() => {
    // Check if running on the client to access `localStorage`
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || '';

      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    dispatch(poMasterDataAction());
    if (userStore) getPO();

    return () => {
      dispatch(unmountPOAction());
    };
  }, []);

  const getPO = (e?: any) => {
    getPOData(pageNo, e);
  };

  const onFieldChange = (name: string, value: any) => {
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const getPOData = (page = 1, event?: any) => {
    const request: any = { page };

    if (searchData) {
      if (userStore) request.store_id = userStore;
      else if (searchData.searchStore) request.store_id = searchData.searchStore;
      if (searchData.searchPOId) request.POid = searchData.searchPOId;
      if (searchData.searchStatus) request.ReceiveStatus_Id = searchData.searchStatus;
      if (searchData.searchSINo) request.SupplierInvoiceNo = searchData.searchSINo;
      if (searchData.barcode) request.SupplierSku = searchData.barcode;
    }

    dispatch(poAction(request)).then(() => {
      event && event.target.complete();
    });

    setPageNo(page + 1);
  };

  const onSearchClick = () => {
    dispatch(clearPOAction());
    setDetailsToShowIndex(undefined);
    setItemDetailsToShowIndex(undefined);
    getPOData(1);
  };

  const onClearClick = () => {
    setSearchData({ modal: {} });
    dispatch(clearPOAction());
    setDetailsToShowIndex(undefined);
    setItemDetailsToShowIndex(undefined);
    setPageNo(1);
  };

  const onRowClick = (index: number, id: any, skipIndexing = false) => {
    if (!skipIndexing && index === detailsToShowIndex) {
      setDetailsToShowIndex(undefined);
    } else {
      dispatch(poItemsAction(id)).then(() => {
        setDetailsToShowIndex(index);
      });
    }

    setItemDetailsToShowIndex(undefined);
  };

  const onItemRowClick = (index: number) => {
    setItemDetailsToShowIndex(index === itemDetailsToShowIndex ? undefined : index);
  };

  const poUploadClick = (e: React.MouseEvent, poId: any) => {
    e.stopPropagation();

    const data = {
      POID: poId,
      ReceivedBy: userName,
    };

    dispatch(uploadPOAction(data)).then((response: any) => {
      response && onSearchClick();
      setAlertMessage(response || 'Updation failed.');
      setShowAlert(true);
    });
  };

  const onReceiveClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setShowModal(true);
    setQtyOrdered(item.QtyOrdered);
    setQtyReceived(item.QtyOrdered);
    setQtyReceivedAlready(item.QtyReceived);
    setComment(item.Comments);
    setSKU(item.SupplierSku);
    setPOId(item.POId);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onDoneClick = () => {
    const data = {
      POID: poId,
      SupplierSku: sku,
      QuantityReceived: qtyReceived,
      Comment: comment,
      Variance: parseInt(qtyOrdered) - parseInt(qtyReceived),
      ReceivedBy: userName,
    };

    if (data.POID && data.SupplierSku && data.QuantityReceived) {
      dispatch(receivePOAction(data)).then((response: any) => {
        if (response) {
          setShowModal(false);
          onRowClick(detailsToShowIndex, data.POID, true);
        } else {
          setAlertMessage('Updation failed.');
          setShowAlert(true);
        }
      });
    } else {
      setAlertMessage('No item to receive.');
      setShowAlert(true);
    }
  };

  const setStatus = (value: any) => {
    if (parseInt(value.QtyOrdered) === parseInt(value.QtyReceived)) return 'received-status';
    if (parseInt(value.QtyReceived) === 0) return 'not-received-status';

    return 'variance-status';
  };

  if (!isAuthenticated) {
    return null; // Avoid rendering if not authenticated
  }

  const poItemsData = () => {
    return poItems && poItems[0] && poItems[0].length > 0 ? (
      poItems[0].map((value: any, index: number) => (
        <Card
          key={index}
          sx={{
            marginBottom: 2,
            width: '100%',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
            '&:hover': {
              backgroundColor: '#f1f1f1',
              boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={(e) => { e.stopPropagation(); onItemRowClick(index); }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="h6">{value.SupplierSku}</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Fab size="small" className={`status-fab ${setStatus(value)}`} sx={{
                  backgroundColor: setStatusColor(value),
                  color: '#fff'
                }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{value.description}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Qty Ordered: <strong>{value.QtyOrdered}</strong></Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body1">Qty Received: <strong>{value.QtyReceived}</strong></Typography>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <Grid item xs={12}>
                  <Typography variant="body2">Product ID: <strong>{value.ProductId}</strong></Typography>
                  <Typography variant="body2">Variance: <strong>{value.Variance}</strong></Typography>
                  <Typography variant="body2">Comments: <strong>{value.Comments}</strong></Typography>
                  <Typography variant="body2">Received By: <strong>{value.ReceivedBy}</strong></Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card><CardContent>No record</CardContent></Card>
    );
  };

  const poData = () => {
    return po && po[0] && Array.isArray(po[0]) ? (
      po[0].map((value: any, index: number) => (
        <Card
          key={index}
          sx={{
            marginBottom: 4,
            backgroundColor: '#f0f4ff',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e2e7ff',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={() => onRowClick(index, value.POid)}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="h6">{value.POid}</Typography>
              </Grid>
              {value.ReceiveStatus !== 'UPLOADED' && value.ReceiveStatus === 'READY' && value.POStatus === 'On-Order' && (
                <Grid item xs={4}>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{ width: '100%' }}
                    onClick={(e) => poUploadClick(e, value.POid)}
                  >
                    Upload
                  </Button>
                </Grid>
              )}
              {value.ReceiveStatus === 'UPLOADED' && (
                <Grid item xs={4}>
                  <Fab size="small" disabled className="status-fab" sx={{ backgroundColor: '#2196f3', color: '#fff' }} />
                </Grid>
              )}
              {value.ReceiveStatus === 'MANUAL' && (
                <Grid item xs={4}>
                  <Fab size="small" disabled className="status-fab" sx={{ backgroundColor: '#9c27b0', color: '#fff' }} />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <Typography>PO Status: <strong>{value.POStatus}</strong></Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Last Updated: <strong>{value.LastUpdated?.replace('GMT', '')}</strong></Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Store: <strong>{value.store_name}</strong></Typography>
              </Grid>
            </Grid>
            {index === detailsToShowIndex && (
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <Typography>Container Number: <strong>{value.ContainerNumber}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Items: <strong>{value.items}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Items Received: <strong>{parseInt(value.items) - parseInt(value.QtyNotReceived)}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Items Not Received: <strong>{value.QtyNotReceived}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Supplier Invoice No.: <strong>{value.SupplierInvoiceNo}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Supplier: <strong>{value.supplier}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Received By: <strong>{value.ReceivedBy}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Receive Status: <strong>{value.ReceiveStatus ? 'Yes' : 'No'}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Special Order: <strong>{value.SpecialOrder ? 'Yes' : 'No'}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Date Created: <strong>{value.DateCreated?.replace('GMT', '')}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Last Updated: <strong>{value.LastUpdated?.replace('GMT', '')}</strong></Typography>
                </Grid>
                <Card className="pallet-items" sx={{ marginTop: 2, width: '100%' }}>
                  <CardHeader title="PO Items" />
                  <CardContent className="pallet-items">{poItemsData()}</CardContent>
                </Card>
              </Grid>
            )}
          </CardContent>
        </Card>
      ))
    ) : (
      <Card><CardContent>No record</CardContent></Card>
    );
  };

  const setStatusColor = (value: any) => {
    switch (setStatus(value)) {
      case 'received-status':
        return '#4caf50';
      case 'not-received-status':
        return '#f44336';
      case 'variance-status':
        return '#ff9800';
      default:
        return '#9c27b0';
    }
  };

  return (
    <>
      <AppHeader headerText="Purchase Order" redirectTo={router.push} />
      <Box sx={{ padding: 2 }}>
        <Card className="search-criteria" sx={{ marginBottom: 4 }}>
          <CardHeader title="Search Criteria" />
          <CardContent className="search-field-section">
            <Grid container spacing={2}>
              <Grid item md={2} xs={6}>
                <InputLabel>PO Id</InputLabel>
                <TextField
                  name="searchPOId"
                  value={searchData.searchPOId || ''}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <InputLabel>Store</InputLabel>
                <SingleSelect
                  name="searchStore"
                  options={poStore}
                  optionValue="id"
                  optionName="store_name"
                  onChange={onFieldChange}
                  disabled={!!userStore}
                  value={userStore || searchData.searchStore}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <InputLabel>Status</InputLabel>
                <SingleSelect
                  name="searchStatus"
                  options={poStatus}
                  optionValue="po_status_id"
                  optionName="po_status_name"
                  onChange={onFieldChange}
                  value={searchData.searchStatus}
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <InputLabel>Supplier Invoice No.</InputLabel>
                <TextField
                  name="searchSINo"
                  value={searchData.searchSINo || ''}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={2} xs={6}>
                <InputLabel>Barcode</InputLabel>
                <TextField
                  name="barcode"
                  value={searchData.barcode || ''}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 2, justifyContent: 'flex-end' }}>
              <Grid item md={3} xs={6}>
                <Button variant="contained" onClick={onSearchClick}
                  size="large" style={{ padding: '15px 0', marginTop: '17px' }} fullWidth>
                  Search
                </Button>
              </Grid>
              <Grid item md={3} xs={6}>
                <Button variant="contained" onClick={onClearClick}
                  size="large" style={{ padding: '15px 0', marginTop: '17px' }} fullWidth>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="search-result pallet-items" sx={{ marginTop: 2, marginBottom: 4 }}>
          <CardHeader title="Search Result" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={4}>
                <Fab size="small" sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>Received</Typography>
              </Grid>
              <Grid item md={2.5} xs={4}>
                <Fab size="small" sx={{ backgroundColor: '#f44336', color: '#fff' }} />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>Not Received</Typography>
              </Grid>
              <Grid item md={2.5} xs={4}>
                <Fab size="small" sx={{ backgroundColor: '#ff9800', color: '#fff' }} />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>Variance</Typography>
              </Grid>
              <Grid item md={2.5} xs={4}>
                <Fab size="small" sx={{ backgroundColor: '#2196f3', color: '#fff' }} />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>Uploaded</Typography>
              </Grid>
              <Grid item md={2} xs={4}>
                <Fab size="small" sx={{ backgroundColor: '#9c27b0', color: '#fff' }} />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>Manual</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent className="search-result-data">{poData()}</CardContent>
        </Card>
      </Box>

      <AppAlert
        showAlert={showAlert}
        headerText="Message"
        message={alertMessage}
        btnCancelText="OK"
        cancelClick={() => setShowAlert(false)}
      />

      <POQuantityModal
        comment={comment}
        qtyReceived={qtyReceived}
        setComment={setComment}
        setQtyReceived={setQtyReceived}
        qtyOrdered={qtyOrdered}
        showModal={showModal}
        qtyReceivedAlready={qtyReceivedAlready}
        onDoneClick={onDoneClick}
        closeModal={closeModal}
        sku={sku}
        poId={poId}
      />
    </>
  );
};

export default PurchaseOrder;
