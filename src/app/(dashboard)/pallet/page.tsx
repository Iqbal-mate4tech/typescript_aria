// src/pages/pallet/index.tsx
"use client"
import React, { useState, useEffect } from 'react';

import { useRouter,usePathname } from 'next/navigation';

import {
  Card, CardContent, CardHeader, Typography, Button, TextField, Grid, IconButton, 
  Fab, Tooltip
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import {
  palletsAction, unmountPalletsAction, palletsMasterDataAction,
  clearPalletsAction, palletItemsAction, savePalletItemAction,
  deletePalletAction, deletePalletItemAction, updatePalletItemAction,
  updatePalletFormData, getItemDescriptionAction, syncPriceAction, syncPriceStatusAction
} from './action';
import  AppHeader  from '@/components/app-header';
import  SingleSelect  from '@/components/single-select';
import  {PalletItemModal}  from '@/components/pallet-item-modal';
import { AppAlert } from '@/components/app-alert';
import  StatusModal  from '@/components/status-modal';
import { getUtcDateTime, hasPermission, isValidStatusToChange, 
  getUserStore, getDayDiff, setItemStatusColor, convertTZ } from '../../../shared/common';
import { webUrl, config } from '../../../shared/constants';
import { printLabel } from './label';

const Pallet: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [detailsToShowIndex, setDetailsToShowIndex] = useState<number | undefined>(undefined);
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<number | undefined>(undefined);
  const [pageNo, setPageNo] = useState(1);
  const [searchData, setSearchData] = useState<any>({ modal: {} });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [palletId, setPalletId] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [palletItemId, setPalletItemId] = useState(0);
  const [showItemConfirm, setShowItemConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [statusOfRow, setStatusOfRow] = useState('');
  const pathname = usePathname()

  const palletStatus = useSelector((state: any) => state.pallet.palletStatus);
  const palletStore = useSelector((state: any) => state.pallet.palletStore);
  const palletCategory = useSelector((state: any) => state.pallet.palletCategory);
  const pallets = useSelector((state: any) => state.pallet.pallets);
  const palletItems = useSelector((state: any) => state.pallet.palletItems);
  const userName = useSelector(() => localStorage.getItem('userName'));
  const userStore = getUserStore();
  const callApi = useSelector((state: any) => state.pallet.formData?.callApi);
  const syncStatus = useSelector((state: any) => state.pallet.syncStatus);

  useEffect(() => {
    dispatch(palletsMasterDataAction());
    if (hasPermission('Sync')) dispatch(syncPriceStatusAction());
    if (userStore || callApi) getPallets();
    dispatch(updatePalletFormData({ callApi: '' }));

    return () => {
      if (router && router.pathname && !router.pathname.includes('/addUpdatePallet')) dispatch(unmountPalletsAction());
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
    const request: any = { page };

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

  const onRowClick = (index: number, id: number) => {
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
    const itemData = {
      id: searchData.modal.id,
      pallet_id: palletId,
      quantity: searchData.modal.quantity,
      ito: searchData.modal.itoNumber,
      barcode: searchData.modal.barcode,
      outer: searchData.modal.outer,
      description: searchData.modal.description,
      inner: searchData.modal.inner,
      added_by: searchData.modal.id && searchData.modal.id > 0 ? searchData.addedBy : userName,
      added_on: searchData.modal.id && searchData.modal.id > 0 ? searchData.addedOn : getUtcDateTime(),
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

    setSearchData({
      ...searchData,
      modal: {
        id: data.id,
        quantity: data.quantity,
        itoNumber: data.ito,
        barcode: data.barcode,
        outer: data.outer,
        description: data.description,
        inner: data.inner,
        addedBy: data.added_by,
        addedOn: data.added_on,
      },
    });
  };

  const onBarcodeBlur = (e: any) => {
    if (e?.target?.value) {
      dispatch(getItemDescriptionAction(e.target.value)).then((response: any) => {
        if (response && response[0]) {
          onModalFieldChange('description', response[0].description);
        }
      });
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

    dispatch(updatePalletItemAction(request)).then((response: any) => {
      if (!response) {
        setAlertMessage('Updation failed!!!');
        setShowAlert(true);
      } else {
        closeModal();
        setPalletId(0);
        onSearchClick();
      }
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

  const setStatusColor = (value: any) => {
    if (value?.status) {
      if (value.status.toLowerCase() === 'in depot' && value.in_depot_date && getDayDiff(value.in_depot_date) > 3) {
        return 'in-depot-status';
      } else if (value.is_all_item_received !== null && !value.is_all_item_received && value.status.toLowerCase() === 'received') {
        return 'variance-status';
      } else if (
        value.status.toLowerCase() === 'request to hold' ||
        value.status.toLowerCase() === 'request to dispatch' ||
        value.status.toLowerCase() === 'received'
      ) {
        return 'received-status';
      } else if (value.status.toLowerCase() === 'other (see notes)') {
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

  const palletItemsData = () => (
    <>
      {palletItems && palletItems.length > 0 ? (
        palletItems.map((value: any, index: number) => (
          <Card key={index} onClick={() => onItemRowClick(index)} style={{ marginBottom: 10, cursor: 'pointer' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Typography variant="subtitle1"><strong>{value.barcode}</strong></Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="subtitle2">Qty <strong>{value.quantity}</strong></Typography>
                </Grid>
                <Grid item md={3} style={{ textAlign: 'right' }}>
                  {hasPermission('UpdatePalletItem') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onItemEdit(value)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('DeletePalletItem') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => { setShowItemConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletItemId(value.id); setPalletId(value.pallet_id); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={10}>
                  <Typography variant="body2"><strong>{value.description}</strong></Typography>
                </Grid>
                {setItemStatusColor(value, statusOfRow) && (
                  <Grid item md={2}>
                    <Fab
                      size="small"
                      color={setItemStatusColor(value, statusOfRow) === 'success' ? 'primary' : 'secondary'}
                      
                      style={{ backgroundColor: setItemStatusColor(value, statusOfRow) }}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <Typography variant="body2">ITO no. <strong>{value.ito}</strong></Typography>
                </Grid>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={12}><Typography variant="body2">Item Id <strong>{value.id}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Outer <strong>{value.outer}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Inner <strong>{value.inner}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Received <strong>{value.received_count}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Added by <strong>{value.added_by}</strong></Typography></Grid>
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
                <Grid item md={2}>
                  <Typography variant="subtitle1"><strong>{value.id}</strong></Typography>
                </Grid>
                {setStatusColor(value) && (
                  <Grid item>
                    <Fab
                      size="small"
                      color={setStatusColor(value) === 'success' ? 'primary' : 'secondary'}
                      
                      style={{ backgroundColor: setStatusColor(value) }}
                    />
                  </Grid>
                )}
                <Grid item md={8} />
                <Grid item md={2} style={{ textAlign: 'right' }}>
                  {hasPermission('DeletePallet') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => { setShowConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletId(value.id); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('UpdatePallet') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={() => router.push(`${webUrl.addUpdatePallet}/${value.id}`)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  <Typography variant="body2"><strong>{value.store_name}</strong></Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="body2"><strong>{value.status}</strong></Typography>
                </Grid>
                <Grid item md={4}>
                  <Typography variant="body2"><strong>{value.last_status_changed_date ? value.last_status_changed_date.split(' ')[0] : 'No Date'}</strong></Typography>
                </Grid>
                <Grid item md={4} style={{ textAlign: 'right' }}>
                  {hasPermission('UpdateStatus') && (
                    <Tooltip title="Change Status">
                      <IconButton onClick={() => onStatusEdit(value)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              {index === detailsToShowIndex && (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={12}><Typography variant="body2">Category <strong>{value.category}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Consignment no. <strong>{value.con_number}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Supplier <strong>{value.supplier}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Freight Company <strong>{value.freight_company}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Pallet Type <strong>{value.pallet_type}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Weight <strong>{value.weight}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Wrapped on <strong>{convertTZ(value.wrapped_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Wrapped by <strong>{value.wrapped_by}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Contents <strong>{value.Contents}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Sent on <strong>{convertTZ(value.sent_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Received on <strong>{convertTZ(value.received_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Built by <strong>{value.built_by}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Last changed by <strong>{value.last_status_changed_by}</strong></Typography></Grid>
                    <Grid item md={12}><Typography variant="body2">Last changed on <strong>{convertTZ(value.last_status_changed_date, config.BRISBANE_TIME_ZONE)}</strong></Typography></Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    {hasPermission('AddPalletItem') && (
                      <Grid item md={3}>
                        <Button variant="contained" color="primary" onClick={() => { setShowModal(true); setPalletId(value.id); }}>
                          Add Item
                        </Button>
                      </Grid>
                    )}
                    {hasPermission('PrintLabel') && (
                      <Grid item md={3}>
                        <Button variant="contained" color="primary" onClick={() => printLabel(value)}>
                          Print Label
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  <Card style={{ marginTop: 20 }}>
                    <CardHeader title="Pallet Items" />
                    <CardContent>{palletItemsData()}</CardContent>
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
        title="Pallets"
        redirectTo={(path: string) => router.push(path)}
        showAddPalletIcon={hasPermission('AddPallet')}
        showBookingIcon={hasPermission('Booking')}
        showDispatchIcon={hasPermission('Dispatch')}
        showSyncIcon={hasPermission('Sync')}
        onSyncClick={onSyncConfirm}
        syncStatus={syncStatus}
      />
      <div style={{ padding: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardHeader title="Search Criteria" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <TextField
                  label="Pallet Id"
                  name="searchPalletId"
                  value={searchData.searchPalletId}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={4}>
                <SingleSelect
                  label="Store"
                  name="searchStore"
                  options={palletStore}
                  optionValue="id"
                  optionName="store_name"
                  onChange={onFieldChange}
                  disabled={!!userStore}
                  value={userStore || searchData.searchStore}
                />
              </Grid>
              <Grid item md={4}>
                <SingleSelect
                  label="Status"
                  name="searchStatus"
                  options={palletStatus}
                  optionValue="status_name"
                  optionName="status_name"
                  onChange={onFieldChange}
                  value={searchData.searchStatus}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
              <Grid item md={4}>
                <SingleSelect
                  label="Category"
                  name="searchCategory"
                  options={palletCategory}
                  optionValue="category_name"
                  optionName="category_name"
                  onChange={onFieldChange}
                  value={searchData.searchCategory}
                />
              </Grid>
              <Grid item md={4}>
                <TextField
                  label="Barcode"
                  name="searchBarcode"
                  value={searchData.searchBarcode}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={4}>
                <TextField
                  label="Contents"
                  name="searchContents"
                  value={searchData.searchContents}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
              <Grid item md={4}>
                <TextField
                  label="Description"
                  name="searchDescription"
                  value={searchData.searchDescription}
                  onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <Button variant="contained" color="primary" onClick={onSearchClick} fullWidth>
                  Search
                </Button>
              </Grid>
              <Grid item md={3}>
                <Button variant="contained" onClick={onClearClick} fullWidth>
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
              <Grid item md={4.5}>
                <Fab size="small" color="success"  className="received-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>Received/Request</Typography>
              </Grid>
              <Grid item md={2.5}>
                <Fab size="small" color="warning"  className="variance-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>Variance</Typography>
              </Grid>
              <Grid item md={2.5}>
                <Fab size="small" color="primary"  className="in-depot-status" />
                <Typography variant="body2" style={{ display: 'inline-block', marginLeft: 10 }}>In Depot</Typography>
              </Grid>
              <Grid item md={2.5}>
                <Fab size="small" color="secondary"  className="others-status" />
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
        onDoneClick={onDoneStatusClick}
        closeModal={closeModal}
      />
    </>
  );
};

export default Pallet;
