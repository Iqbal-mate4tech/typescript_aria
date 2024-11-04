// src/pages/pallet/index.tsx
"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import {
  Card, CardContent, CardHeader, Typography, Button, TextField, Grid, IconButton, Fab, Tooltip
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import {
  palletsAction, unmountPalletsAction, palletsMasterDataAction,
  clearPalletsAction, palletItemsAction, savePalletItemAction,
  deletePalletAction, deletePalletItemAction, updatePalletItemAction,
  updatePalletFormData, getItemDescriptionAction, syncPriceAction, syncPriceStatusAction,
  getDIDdescriptionAction,
  getdidnumbervalidAction, savePalletAction
} from './action';
import AppHeader from '@/components/app-header';
import SingleSelect from '@/components/single-select';
import PalletItemModal from '@/components/pallet-item-modal';
import { AppAlert } from '@/components/app-alert';
import StatusModal from '@/components/status-modal';
import {
  getUtcDateTime, hasPermission, isValidStatusToChange,
  getUserStore, getDayDiff, setItemStatusColor, convertTZ
} from '../../../shared/common';
import { webUrl, config } from '../../../shared/constants';
import { updatePalletShippingStatusAction } from '../pallet-booking/action';
import { printLabel } from './label';
import { useAppDispatch } from '../../store';
import useAuth from '@components/withAuth';



const Pallet: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthenticated = useAuth();



  const [detailsToShowIndex, setDetailsToShowIndex] = useState<any>(undefined);
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<any>(undefined);
  const [pageNo, setPageNo] = useState<number>(1);
  const [searchData, setSearchData] = useState<any>({ modal: {} });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [palletId, setPalletId] = useState<any>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [palletItemId, setPalletItemId] = useState<number>(0);
  const [showItemConfirm, setShowItemConfirm] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [showSyncConfirm, setShowSyncConfirm] = useState<boolean>(false);
  const [statusOfRow, setStatusOfRow] = useState('');
  const [sendingInner, setSendingInner] = useState<boolean>(false);
  const [didNumberError, setDidNumberError] = useState('');

  const [userName, setUserName] = useState<any>(null);
  const [userType, setUserType] = useState<any>(null);


  const palletStatus = useSelector((state: any) => state.pallet.palletStatus);
  const palletStore = useSelector((state: any) => state.pallet.palletStore);
  const palletCategory = useSelector((state: any) => state.pallet.palletCategory);
  const pallets = useSelector((state: any) => state.pallet.pallets);
  const palletItems = useSelector((state: any) => state.pallet.palletItems);

  // const userName = useSelector(() => typeof window !== 'undefined' ? localStorage.getItem('userName') : '');
  const userStore = getUserStore();
  const callApi = useSelector((state: any) => state.pallet.formData.callApi);
  const syncStatus = useSelector((state: any) => state.pallet.syncStatus);

  // const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : ''




  useEffect(() => {
    // Check if running on the client to access `localStorage`
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || '';

      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType');

      setUserType(storedUserType);
    }
  }, []);





  const handleDidNumberBlur = async (e: ChangeEvent<HTMLInputElement>) => {
    const didNumber = e.target.value;
    const store_id = searchData.store;

    if (!didNumber) return ''; // Clear error when field is empty

    if (!store_id) return 'Please select a store first'; // Return error message

    try {
      const response = await dispatch(getdidnumbervalidAction(didNumber, store_id));

      if (!response || response[0]?.Error) {
        return response[0]?.Error || 'Invalid DID Number';
      } else {
        return ''; // No error
      }
    } catch (error) {
      console.error('Error validating DID Number:', error);

      return 'Error validating DID Number'; // Return error on failure
    }
  };


  const handleFieldChange = (name: string, value: string | number) => {
    setSearchData((prevFormData: any) => {
      const updatedModal = { ...prevFormData.modal, [name]: value };

      const quantity = parseInt(updatedModal.quantity) || 0;
      const qtyToSend = parseInt(updatedModal.qty_to_send) || 0;
      const totalCartons = parseInt(updatedModal.cartons_send) || 0;
      const totalInners = parseInt(updatedModal.inners_send) || 0;
      const pouter = parseInt(updatedModal.outer) || 0;
      const pinner = parseInt(updatedModal.inner) || 0;

      // Adjust calculations based on sendingInner
      if (['quantity', 'qtyToSend', 'totalCartons', 'pouter', 'pinner'].includes(name)) {
        if (sendingInner) {
          updatedModal.qty_to_send = qtyToSend;
          updatedModal.remaining_qty = qtyToSend - quantity * pinner;
          updatedModal.inners_send = totalInners;
          updatedModal.remaining_inners = totalInners - quantity;
        } else {
          updatedModal.qty_to_send = qtyToSend;
          updatedModal.remaining_qty = qtyToSend - quantity * pouter;
          updatedModal.cartons_send = totalCartons;
          updatedModal.remaining_cartons = totalCartons - quantity;
        }
      }

      return { ...prevFormData, modal: updatedModal };
    });
  };




  useEffect(() => {
    dispatch(palletsMasterDataAction());
    hasPermission('Sync') && dispatch(syncPriceStatusAction());
    (userStore || searchData.modal.callApi) && getPallets();
    dispatch(updatePalletFormData({ callApi: '' }));

    return () => {
      if (pathname.indexOf(webUrl.addUpdatePallet) < 0) {
        dispatch(unmountPalletsAction());
      }
    };
  }, []);





  const getPallets = (e?: any) => {
    getPalletData(pageNo, e);
  };


  const onFieldChange = (name: string, value: any) => {
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const onModalFieldChange = (name: string, value: any) => {
    const _formData = { ...searchData };

    _formData.modal[name] = value;
    setSearchData(_formData);
  };

  const getPalletData = (page = 1, event?: any) => {
    const request: any = { page: page };

    if (searchData) {
      if (userStore) request.store_id = userStore;
      else if (searchData.searchStore) request.store_id = searchData.searchStore;
      if (searchData.searchPalletId) request.id = searchData.searchPalletId;
      if (searchData.searchStatus) request.status = searchData.searchStatus;
      if (searchData.searchCategory) request.category = searchData.searchCategory;
      if (searchData.searchContents) request.contents = searchData.searchContents;
      if (searchData.searchDescription) request.description = searchData.searchDescription;
      if (searchData.searchBarcode) request.barcode = searchData.searchBarcode;
    }

    dispatch(palletsAction(request)).then(() => {
      event && event.target.complete();
    });

    setPageNo(page + 1);
  };





  const onSearchClick = () => {
    dispatch(clearPalletsAction());
    setDetailsToShowIndex(undefined);
    setItemDetailsToShowIndex(undefined);
    getPalletData(1);
  };

  const onClearClick = () => {
    setSearchData({ modal: {} });
    dispatch(clearPalletsAction());
    setDetailsToShowIndex(undefined);
    setItemDetailsToShowIndex(undefined);
    setPageNo(1);
  };



  const onRowClick = (index: any, id: any) => {
    if (index === detailsToShowIndex) {
      setDetailsToShowIndex(undefined);
    } else {
      dispatch(palletItemsAction(id)).then(() => {
        setDetailsToShowIndex(index);
      });
    }

    setItemDetailsToShowIndex(undefined);
  };

  const onItemRowClick = (index: number) => {
    setItemDetailsToShowIndex(index === itemDetailsToShowIndex ? undefined : index);
  };

  const onDoneClick = () => {
    const ito = searchData.modal.did_Number;

    const itemData = {
      id: searchData.modal.id,
      quantity: searchData.modal.quantity,
      ito: ito,
      qty_to_send: searchData.modal.remaining_qty,
      inners_send: searchData.modal.inners_send,
      remaining_inners: searchData.modal.remaining_inners,
      cartons_send: searchData.modal.cartons_send,
      remaining_cartons: searchData.modal.remaining_cartons,
      barcode: searchData.modal.barcode,
      outer: searchData.modal.outer,
      description: searchData.modal.description,
      inner: searchData.modal.inner,
      oh_quantity: searchData.modal.oh_quantity,
      added_by: searchData.modal.id > 0 ? searchData.modal.addedBy : userName,
      added_on: searchData.modal.id > 0 ? searchData.modal.addedOn : getUtcDateTime(),
      pallet_id: searchData.id,
      received_by: searchData.modal.receivedBy,
      received_count: searchData.modal.receivedCount,
      received_variance: searchData.modal.variance,
      sendingInner: sendingInner,
    };

    if (searchData.modal.id && searchData.modal.id > 0) {
      dispatch(updatePalletItemAction(itemData)).then((response: any) => {
        if (!response) {
          setAlertMessage('Updation failed!!!');
          setShowAlert(true);
        } else {
          dispatch(palletItemsAction(palletId));
          closeModal();
          setPalletId(0);
          setPalletItemId(0);
          setItemDetailsToShowIndex(undefined);
        }
      });
    } else {
      dispatch(savePalletItemAction(itemData)).then((response: any) => {
        if (!response) {
          setAlertMessage('Save failed!!!');
          setShowAlert(true);
        } else {
          dispatch(palletItemsAction(palletId));
          closeModal();
          setPalletId(0);
        }
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowStatusModal(false);
    setSearchData({
      ...searchData,
      status: '',
      currentStatus: '',
      modal: {},
    });
  };




  const onItemEdit = (data: any) => {
    setShowModal(true);
    setPalletItemId(data.id);
    setPalletId(data.pallet_id);

    const isSendingInner = ['True', true].includes(data.sending_inner || data.sendingInner);

    setSearchData((searchData: any) => ({
      ...searchData,
      modal: {
        id: data.id,
        quantity: data.quantity,
        did_Number: data.ito,
        barcode: data.barcode,
        outer: data.outer,
        description: data.description,
        inner: data.inner,
        addedBy: data.added_by,
        addedOn: data.added_on,
        palletId: data.pallet_id,
        index: data.index,
        receivedCount: data.received_count,
        variance: data.received_variance,
        receivedBy: data.received_by,
        oh_quantity: data.oh_quantity,
        qty_to_send: data.qty_to_send,
        remaining_qty: data.remaining_qty,
        inners_send: data.inners_send,
        remaining_inners: data.remaining_inners,
        cartons_send: data.cartons_send,
        remaining_cartons: data.remaining_cartons,
        sendingInner: isSendingInner,
      },
    }));

    setSendingInner(isSendingInner);
  };




  const onBarcodeBlur = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;

    const barcode = e.target.value;
    const { modal } = searchData;

    try {
      let didDescriptionResponse;
      const quantity = parseInt(modal.quantity) || 0;
      let pinner = 0, pouter = 0;

      const response = await dispatch(getItemDescriptionAction(barcode));

      if (response || response[0]) {
        pouter = response.Carton_Qty || 0;
        pinner = Math.round(response.custom3) || 0;

        onModalFieldChange('description', response.Short_Description || '');
        onModalFieldChange('outer', pouter);
        onModalFieldChange('inner', pinner);
        onModalFieldChange('oh_quantity', response.ohquantity || 0);
      }

      if (modal.did_Number) {
        didDescriptionResponse = await dispatch(getDIDdescriptionAction(modal.did_Number, barcode));
      }

      if (didDescriptionResponse && didDescriptionResponse[0]) {
        const { qty_to_send, total_cartons, done_cartons, total_inners } = didDescriptionResponse[0];

        if (sendingInner) {
          onModalFieldChange('qty_to_send', qty_to_send);
          onModalFieldChange('remaining_qty', qty_to_send - quantity * pinner);
          onModalFieldChange('inners_send', total_inners);
          onModalFieldChange('remaining_inners', total_inners - quantity);
        } else {
          onModalFieldChange('qty_to_send', qty_to_send);
          onModalFieldChange('remaining_qty', qty_to_send - quantity * pouter);
          onModalFieldChange('cartons_send', total_cartons);
          onModalFieldChange('remaining_cartons', total_cartons - done_cartons);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const onSyncClick = () => {
    setShowSyncConfirm(false);
    dispatch(syncPriceAction());
  };

  const onSyncConfirm = () => {
    setShowSyncConfirm(true);
    setAlertMessage(syncStatus ? 'Do you want to stop sync?' : 'Do you want to start sync?');
  };



  const onStatusEdit = (data: any) => {
    setShowStatusModal(true);
    setPalletId(data.id);
    const _status = JSON.parse(JSON.stringify(data.status));

    setUpdatedStatus(_status);
    setSearchData({
      ...searchData,
      currentStatus: data.status,
    });
  };

  const changeStatus = (name: string, value: any) => {
    setUpdatedStatus(value);
  };

  const onDoneStatusClick = () => {
    if (updatedStatus === searchData.currentStatus) {
      closeModal();
      setPalletId(0);

      return;
    }

    if (updatedStatus === 'Dispatched') {
      setAlertMessage('Cannot change status to dispatched from this page. Please use the dispatch page.');
      setShowAlert(true);

      return;
    }

    if (updatedStatus === 'Booked') {
      setAlertMessage('Cannot change status to booked from this page. Please use the booking page.');
      setShowAlert(true);

      return;
    }

    if (!isValidStatusToChange(updatedStatus, searchData.currentStatus)) {
      setAlertMessage(`You cannot change status from "${searchData.currentStatus}" to "${updatedStatus}"`);
      setShowAlert(true);

      return;
    }

    const request = {
      id: palletId,
      status: updatedStatus,
      user: userName,
    };

    dispatch(updatePalletShippingStatusAction(request)).then((response: any) => {
      response || setAlertMessage("Updation failed!!!");
      response || setShowAlert(true);
      response && closeModal();
      response && setPalletId(0);
      response && onSearchClick();

      const palletData = {
        id: request.id,
        status: request.status,
        last_status_changed_by: request.user
      };

      dispatch(savePalletAction(palletData))
        .then(() => {
          console.log('Pallet data sent to Odoo successfully');
        })
        .catch((error) => {
          console.error('Error sending pallet data to Odoo:', error);
        });
    });
  };



  const onDeletePallet = () => {
    setShowConfirm(false);
    dispatch(deletePalletAction(palletId)).then((response: any) => {
      setAlertMessage(response ? 'Deleted successfully!!!' : 'Deletion failed!!!');
      setShowAlert(true);
      setPalletId(0);

      if (response) {
        getPalletData();
        setDetailsToShowIndex(undefined);
        setItemDetailsToShowIndex(undefined);
      }
    });
  };

  // need some attention
  const setStatusColor = (value: any) => {
    if (value && value?.status) {
      const status = value?.status.toLowerCase();

      if (status === 'in depot' && value.in_depot_date && getDayDiff(value?.in_depot_date) !== undefined && getDayDiff(value?.in_depot_date)! > 3) {
        return 'in-depot-status';
      } else if (value.is_all_item_received === false && status === 'received') {
        return 'variance-status';
      } else if (['request to hold', 'request to dispatch', 'received'].includes(status)) {
        return 'received-status';
      } else if (status === 'other (see notes)') {
        return 'others-status';
      }
    }
  };

  const onDeletePalletItem = () => {
    setShowItemConfirm(false);
    dispatch(deletePalletItemAction(palletItemId)).then((response: any) => {
      setAlertMessage(response ? 'Deleted successfully!!!' : 'Deletion failed!!!');
      setShowAlert(true);
      setPalletItemId(0);

      if (response) {
        dispatch(palletItemsAction(palletId));
        setItemDetailsToShowIndex(undefined);
      }
    });
  };


  if (!isAuthenticated) {
    return null;
  }

  const palletItemsData = () => (
    <>
      {palletItems && palletItems.length > 0 ? (
        palletItems.map((value: any, index: number) => (
          <Card key={index} onClick={(e) => { e.stopPropagation(); onItemRowClick(index) }} style={{ marginBottom: 10, cursor: 'pointer' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle1"><strong>{value.barcode}</strong></Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2">Qty <strong>{value.quantity}</strong></Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'right' }}>
                  {hasPermission('UpdatePalletItem') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={(e) => {
                        e.stopPropagation();
                        onItemEdit(value);
                      }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('DeletePalletItem') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); setShowItemConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletItemId(value.id); setPalletId(value.pallet_id); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={10} >
                  <Typography variant="body2"><strong>{value.description}</strong></Typography>
                </Grid>
                {setItemStatusColor(value, statusOfRow) && (
                  <Grid item xs={2}>
                    <Fab
                      size="small"
                      color={setItemStatusColor(value, statusOfRow) === 'success' ? 'primary' : 'secondary'}

                      style={{ backgroundColor: setItemStatusColor(value, statusOfRow) }}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">DID No. <strong>{value.ito}</strong></Typography>
                </Grid>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={6}><Typography variant="body2">Item Id <strong>{value.id}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Outer <strong>{value.outer}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Inner <strong>{value.inner}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Received <strong>{value.received_count}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Added by <strong>{value.added_by}</strong></Typography></Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card><CardContent>No record</CardContent></Card>
      )}
    </>
  );

  const palletData = () => (
    <>
      {pallets && pallets[0] && Array.isArray(pallets[0]) ? (
        pallets[0].map((value: any, index: number) => (
          <Card key={index} onClick={() => { onRowClick(index, value.id); setStatusOfRow(value.status); }} style={{ marginBottom: 10, cursor: 'pointer' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={6} xs={3}>
                  <Typography variant="subtitle1"><strong>{value.id}</strong></Typography>
                </Grid>
                <Grid item md={4} xs={3}>
                  {setStatusColor(value) && (

                    <Fab
                      size="small"
                      color={
                        setStatusColor(value) === 'in-depot-status' ? 'primary' : 'secondary'
                      }
                      style={{ backgroundColor: setStatusColor(value) }}
                    />

                  )}
                </Grid>
                <Grid item md={2} xs={6} style={{ textAlign: 'right' }}>
                  {hasPermission('DeletePallet') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); setShowConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletId(value.id); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('UpdatePallet') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={(e) => { e.stopPropagation(); router.push(`${webUrl.addUpdatePallet}/${value.id}`) }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={2} xs={2}>
                  <Typography variant="body2"><strong>{value.store_name}</strong></Typography>
                </Grid>
                <Grid item md={2} xs={4}>
                  <Typography variant="body2"><strong>{value.status}</strong></Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <Typography variant="body2"><strong>{value.last_status_changed_date ? value.last_status_changed_date.split(' ')[0] : 'No Date'}</strong></Typography>
                </Grid>
                <Grid item md={4} xs={2} style={{ textAlign: 'right' }}>
                  {hasPermission('UpdateStatus') && (
                    <Tooltip title="Change Status">
                      <IconButton onClick={(e) => { e.stopPropagation(); onStatusEdit(value) }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              {index === detailsToShowIndex && (
                <>
                  <Grid container spacing={8}>
                    <Grid item md={3} xs={6}><Typography variant="body2">Category <strong>{value.category}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Consignment no. <strong>{value.con_number}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Supplier <strong>{value.supplier}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Freight Company <strong>{value.freight_company}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Pallet Type <strong>{value.pallet_type}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Weight <strong>{value.weight}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Wrapped on <strong>{convertTZ(value.wrapped_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Wrapped by <strong>{value.wrapped_by}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Contents <strong>{value.Contents}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Sent on <strong>{convertTZ(value.sent_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Received on <strong>{convertTZ(value.received_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Built by <strong>{value.built_by}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Last changed by <strong>{value.last_status_changed_by}</strong></Typography></Grid>
                    <Grid item md={3} xs={6}><Typography variant="body2">Last changed on <strong>{convertTZ(value.last_status_changed_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                  </Grid>
                  <Grid container spacing={4} style={{ marginTop: 25 }} justifyContent="flex-end">
                    {hasPermission('AddPalletItem') && (
                      <Grid item md={3} xs={4}>
                        <Button variant="contained" color="primary" size="large" style={{ padding: '13px 0' }} fullWidth
                          onClick={(e) => { e.stopPropagation(); setShowModal(true); setPalletId(value.id); }}>
                          Add Item
                        </Button>
                      </Grid>
                    )}
                    {hasPermission('PrintLabel') && (
                      <Grid item md={3} xs={4}>
                        <Button variant="contained" color="primary" size="large" style={{ padding: '13px 0' }} fullWidth
                          onClick={(e) => { e.stopPropagation(); printLabel(value) }}>
                          Print Label
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  <Card style={{ marginTop: 26 }}>
                    <CardHeader title="Pallet Items" />
                    <CardContent>
                      {palletItemsData()}

                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card><CardContent>No record</CardContent></Card>
      )}
    </>
  );

  return (
    <>
      <AppHeader
        headerText="Pallets"
        redirectTo={(path: string) => router.push(path)}
        showAddPalletIcon={hasPermission('AddPallet')}
        showBookingIcon={hasPermission('Booking')}
        showDispatchIcon={hasPermission('Dispatch')}
        showSyncIcon={hasPermission('Sync')}
        onSyncClick={onSyncConfirm}
        syncStatus={syncStatus}
      />
      <div style={{ padding: 10 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardHeader title="Search Criteria" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={3} xs={6}>
                <TextField
                  label="Pallet Id"
                  name="searchPalletId"
                  value={searchData.searchPalletId}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <SingleSelect

                  // label="Store"
                  name="searchStore"
                  options={palletStore}
                  optionValue="id"
                  optionName="store_name"
                  onChange={onFieldChange}
                  disabled={!!userStore}
                  value={userStore || searchData.searchStore}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <SingleSelect

                  // label="Status"
                  name="searchStatus"
                  options={palletStatus}
                  optionValue={(userType === 'manager' || userType === 'admin' || userType === 'buyer') ? 'status_name' : 'status'}
                  optionName={(userType === 'manager' || userType === 'admin' || userType === 'buyer') ? 'status_name' : 'status'}
                  onChange={onFieldChange}
                  value={searchData.searchStatus}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <SingleSelect

                  // label="Category"
                  name="searchCategory"
                  options={palletCategory}
                  optionValue="category_name"
                  optionName="category_name"
                  onChange={onFieldChange}
                  value={searchData.searchCategory}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 10 }}>

              <Grid item md={3} xs={6}>
                <TextField
                  label="Barcode"
                  name="searchBarcode"
                  value={searchData.searchBarcode}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TextField
                  label="Contents"
                  name="searchContents"
                  value={searchData.searchContents}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TextField
                  label="Description"
                  name="searchDescription"
                  value={searchData.searchDescription}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 10, justifyContent: 'flex-end' }}>
              <Grid item md={3} xs={6}>
                <Button variant="contained" color="primary" onClick={onSearchClick}
                  size="large" style={{ padding: '13px 0' }} fullWidth>
                  Search
                </Button>
              </Grid>
              <Grid item md={3} xs={6}>
                <Button variant="contained" onClick={onClearClick} fullWidth size="large" style={{ padding: '13px 0' }}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Search Result" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={3} xs={6}>
                <Fab size="small" color="success" className="received-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>Received/Request</Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Fab size="small" color="warning" className="variance-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>Variance</Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Fab size="small" color="primary" className="in-depot-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>In Depot</Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Fab size="small" color="secondary" className="others-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>Others</Typography>
              </Grid>
            </Grid>
            <div style={{ marginTop: 20 }}>{palletData()}</div>
          </CardContent>
        </Card>
      </div>

      <PalletItemModal
        modal={searchData.modal}
        showModal={showModal}
        onBarcodeBlur={onBarcodeBlur}
        onModalFieldChange={onModalFieldChange}
        userName={searchData.modal.id && searchData.modal.id > 0 ? searchData.modal.addedBy : userName}
        onDoneClick={onDoneClick}
        closeModal={closeModal}
        handleFieldChange={handleFieldChange}
        sendingInner={sendingInner}
        setSendingInner={setSendingInner}
        handleDidNumberBlur={handleDidNumberBlur}
        didNumberError={didNumberError}  // Pass error state as prop
        setDidNumberError={setDidNumberError}
      />

      <AppAlert
        showAlert={showAlert}
        headerText="Message"
        message={alertMessage}
        btnCancelText="OK"
        cancelClick={() => setShowAlert(false)}
      />

      <AppAlert
        showAlert={showConfirm}
        headerText="Confirm"
        message={alertMessage}
        btnCancelText="Cancel"
        btnOkText="Yes"
        okClick={onDeletePallet}
        cancelClick={() => { setShowConfirm(false); setPalletId(0); }}
      />

      <AppAlert
        showAlert={showItemConfirm}
        headerText="Confirm"
        message={alertMessage}
        btnCancelText="Cancel"
        btnOkText="Yes"
        okClick={onDeletePalletItem}
        cancelClick={() => { setShowItemConfirm(false); setPalletItemId(0); }}
      />

      <AppAlert
        showAlert={showSyncConfirm}
        headerText="Confirm"
        message={alertMessage}
        btnCancelText="Cancel"
        btnOkText="Yes"
        okClick={onSyncClick}
        cancelClick={() => setShowSyncConfirm(false)}
      />

      <StatusModal
        palletStatus={palletStatus}
        status={updatedStatus}
        showModal={showStatusModal}
        onModalFieldChange={changeStatus}
        userName={userName}
        userType={userType}
        onDoneClick={onDoneStatusClick}
        closeModal={closeModal}
      />
    </>
  );
};

export default Pallet;
