// src/pages/pallet/[id].tsx
"use client"
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useRouter ,useParams} from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card, CardContent, CardHeader, Typography, Grid, Button, TextField, Select, MenuItem, InputLabel, IconButton, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import {
    addUpdatePalletsMasterDataAction, addItemToListAction, unMountAddUpdateData,
    savePalletAction, palletItemsAction, updatePalletAction, receivedPalletItemsAction, updatePalletFormData, getItemDescriptionAction, getITODetailsAction
} from '../../pallet/action';
import  AppHeader  from '@/components/app-header';
import  SingleSelect  from '@/components/single-select';
import  PalletItemModal  from '@/components/pallet-item-modal';
import  ReceiveItemModal  from '@/components/receive-item-modal';
import  DirectToStore  from '@/components/direct-to-store';
import { AppAlert } from '@/components/app-alert';
import { getUtcDateTime, hasPermission, isValidStatusToChange, getUserStore,
     getVariance, setItemStatusColor } from '../../../../shared/common';
import { webUrl } from '../../../../shared/constants';
import useAuth from '@/components/withAuth';

const AddUpdatePallet = () => {
  const isAuthenticated = useAuth(); // Check if the user is authenticated
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<any>({ createdBy: localStorage.getItem('userName'), modal: {} });
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>(undefined);
  const [palletItemId, setPalletItemId] = useState(0);
  const [showItemConfirm, setShowItemConfirm] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [noOfPallet, setNoOfPallet] = useState('');
  const [supplier, setSupplier] = useState('');
  const [showDirectToStoreModal, setShowDirectToStoreModal] = useState(false);
  const [conNumber, setConNumber] = useState('');
  const [selected, setSelected] = useState('Male');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const palletStatus = useSelector((state: any) => state.pallet.palletStatus);
  const palletStore = useSelector((state: any) => state.pallet.palletStore);
  const palletCategory = useSelector((state: any) => state.pallet.palletCategory);
  const palletTypes = useSelector((state: any) => state.pallet.palletTypes);
  const palletBuilders = useSelector((state: any) => state.pallet.palletBuilders);
  const pallets = useSelector((state: any) => state.pallet.pallets);
  const palletItems = useSelector((state: any) => state.pallet.palletItems);
  const userStore = getUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(addUpdatePalletsMasterDataAction());
      setInitialData();
    }
    return () => {
      dispatch(unMountAddUpdateData());
    };
  }, [id, isAuthenticated]);

  const setInitialData = () => {
    if (id && pallets && pallets[0]) {
      const palletToUpdate = pallets[0].find((x: any) => x.id === parseInt(id as string));
      if (palletToUpdate) {
        const _formData = {
          id: parseInt(id as string),
          store: parseInt(palletToUpdate.store_id),
          category: palletToUpdate.category,
          palletType: palletToUpdate.pallet_type,
          weight: palletToUpdate.weight,
          builtBy: palletToUpdate.built_by,
          status: palletToUpdate.status,
          status_btn: palletToUpdate.status_btn,
          currentStatus: palletToUpdate.status,
          notes: palletToUpdate.other_notes,
          Contents: palletToUpdate.Contents,
          last_status_changed_by: palletToUpdate.last_status_changed_by,
          last_status_changed_date: palletToUpdate.last_status_changed_date,
          date_created: palletToUpdate.date_created,
          wrapped_by: palletToUpdate.wrapped_by,
          wrapped_date: palletToUpdate.wrapped_date,
          is_all_item_received: palletToUpdate.is_all_item_received,
          sent_date: palletToUpdate.sent_date,
          received_date: palletToUpdate.received_date,
          in_depot_date: palletToUpdate.in_depot_date,
          supplier: palletToUpdate.supplier,
          con_number: palletToUpdate.con_number,
          modal: {},
        };
        setFormData(_formData);
        dispatch(palletItemsAction(id));
      }
    } else {
      dispatch(unMountAddUpdateData());
    }
  };

  const onFieldChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onStatusBtnClick = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setTimeout(() => {
      onClickSave();
    }, 2000);
  };

  const getStoreName = (storeId: number) => {
    if (!palletStore) return 'N/A';
    const store = palletStore.find((store: any) => store.id === storeId);
    return store ? store.store_name : 'N/A';
  };

  const generatePDF = () => {
    if (!formData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Pallet Information', 20, 20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const idText = `Pallet ID: ${formData.id || 'N/A'}`;
    const storeName = `Store Name: ${getStoreName(formData.store) || 'N/A'}`;
    doc.text(idText, 20, 40);
    doc.text(storeName, 80, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(formData.Contents || 'N/A', 180);

    const tableData = palletItems.map((item: any) => [
      item.id,
      item.ito,
      item.barcode,
      item.description,
      item.quantity,
      item.inner,
      item.outer,
    ]);

    const tableHeaders = ['Item ID', 'ITO', 'Barcode', 'Description', 'Quantity', 'Inner', 'Outer'];

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 60 + contentLines.length * 8,
    });

    doc.save(`pick_list_${formData.id || 'N/A'}.pdf`);
  };

  const generateExcel = () => {
    if (!formData) return;

    const palletInfoData = [
      ['Pallet ID', formData.id || 'N/A'],
      ['Store Name', getStoreName(formData.store) || 'N/A'],
      ['Pallet Type', formData.palletType || 'N/A'],
      ['Weight', formData.weight || 'N/A'],
      ['Last Status Changed By', formData.last_status_changed_by || 'N/A'],
      ['Contents', formData.Contents || 'N/A'],
    ];

    const itemDetailsData = [
      ['Item ID', 'ITO Number', 'Barcode', 'Description', 'Quantity', 'Inner', 'Outer'],
      ...palletItems.map((item: any) => [item.id, item.ito, item.barcode, item.description, item.quantity, item.inner, item.outer]),
    ];

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.aoa_to_sheet(palletInfoData);
    ws1['!cols'] = [{ wch: 20 }, { wch: 30 }];
    ws1['!rows'] = palletInfoData.map(() => ({ hpx: 20 }));
    XLSX.utils.book_append_sheet(wb, ws1, 'Pallet Information');

    const ws2 = XLSX.utils.aoa_to_sheet(itemDetailsData);
    ws2['!cols'] = itemDetailsData[0].map(() => ({ wch: 15 }));
    ws2['!rows'] = [{ hpx: 20 }, ...itemDetailsData.slice(1).map(() => ({ hpx: 16 }))];
    XLSX.utils.book_append_sheet(wb, ws2, 'Item Details');

    XLSX.writeFile(wb, `pick_list_${formData.id || 'N/A'}.xlsx`);
  };

  const onModalFieldChange = (name: string, value: any) => {
    const _formData = { ...formData };
    _formData.modal[name] = value;
    setFormData(_formData);
  };

  const onItemRowClick = (index: number) => {
    setItemDetailsToShowIndex(index === itemDetailsToShowIndex ? undefined : index);
  };

  const onDoneClick = () => {
    const itemData = {
      id: formData.modal.id,
      quantity: formData.modal.quantity,
      ito: formData.modal.itoNumber,
      barcode: formData.modal.barcode,
      outer: formData.modal.outer,
      description: formData.modal.description,
      inner: formData.modal.inner,
      added_by: formData.modal.id > 0 ? formData.modal.addedBy : localStorage.getItem('userName'),
      added_on: formData.modal.id > 0 ? formData.modal.addedOn : getUtcDateTime(),
      pallet_id: formData.id,
      received_by: formData.modal.receivedBy,
      received_count: formData.modal.receivedCount,
      received_variance: formData.modal.variance,
    };

    if (itemData.id && itemData.id > 0) {
      const _palletItems = palletItems.map((item: any) => (item.id === itemData.id ? itemData : item));
      dispatch(receivedPalletItemsAction(_palletItems));
    } else if (selectedItemIndex === 0 || selectedItemIndex !== undefined) {
      const _palletItems = palletItems.map((item: any, idx: number) => (idx === selectedItemIndex ? itemData : item));
      dispatch(receivedPalletItemsAction(_palletItems));
    } else {
      dispatch(addItemToListAction(itemData));
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ ...formData, modal: {} });
    setItemDetailsToShowIndex(undefined);
    setShowReceiveModal(false);
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const onClickSave = () => {
    if (formData.id && formData.id > 0 && !isValidStatusToChange(formData.status, formData.currentStatus)) {
      setAlertMessage(`You cannot change status from "${formData.currentStatus}" to "${formData.status}"`);
      setShowAlert(true);
      return;
    }

    const palletData: any = {
      id: formData.id,
      store_id: formData.store,
      category: formData.category,
      pallet_type: formData.palletType,
      weight: formData.weight,
      built_by: formData.builtBy,
      status: formData.status,
      other_notes: formData.notes,
      contents: formData.Contents,
      last_status_changed_by: localStorage.getItem('userName'),
      last_status_changed_date: getUtcDateTime(),
      date_created: formData.id ? formData.date_created : getUtcDateTime(),
      palletItems: palletItems || undefined,
      supplier: formData.id ? formData.supplier : supplier,
      con_number: formData.con_number,
    };

    if (formData.status?.toLowerCase() === 'wrapped') {
      palletData.wrapped_by = localStorage.getItem('userName');
      palletData.wrapped_date = getUtcDateTime();
    }

    if (formData.status?.toLowerCase() === 'in depot') {
      palletData.in_depot_date = getUtcDateTime();
    } else {
      palletData.in_depot_date = formData.in_depot_date;
    }

    if (formData.status?.toLowerCase() === 'dispatched') {
      palletData.sent_date = getUtcDateTime();
    } else {
      palletData.sent_date = formData.sent_date;
    }

    if (formData.status?.toLowerCase() === 'received') {
      palletData.received_date = getUtcDateTime();
    }

    if (formData.id) {
      if (formData.status?.toLowerCase() === 'received') {
        const notReceivedItems = palletData.palletItems.filter((x: any) => x.received_count > 0 && x.received_variance > 0);
        palletData.is_all_item_received = notReceivedItems.length <= 0 ? 1 : 0;
      }

      dispatch(updatePalletAction(palletData)).then((response: any) => {
        setApiResponse(response);
        setFlashMessage({
          open: true,
          message: response ? 'Updated successfully!!!' : 'Updation failed!!!',
          severity: response ? 'success' : 'error',
        });
        response && dispatch(updatePalletFormData({ callApi: true }));
      });
    } else if (noOfPallet) {
      const promises = [];
      palletData.status = 'Dispatched';
      palletData.con_number = conNumber;

      for (let i = 0; i < parseInt(noOfPallet); i++) {
        promises.push(dispatch(savePalletAction(palletData)));
      }

      Promise.all(promises)
        .then((response) => {
          setApiResponse(response);
          setFlashMessage({
            open: true,
            message: 'Saved successfully!!!',
            severity: 'success',
          });
          response && dispatch(updatePalletFormData({ callApi: true }));
          setShowDirectToStoreModal(false);
          setNoOfPallet('');
          setSupplier('');
          setConNumber('');
        })
        .catch(() => {
          setFlashMessage({
            open: true,
            message: 'Save failed!!!',
            severity: 'error',
          });
        });
    } else {
      dispatch(savePalletAction(palletData)).then((response: any) => {
        setApiResponse(response);
        setFlashMessage({
          open: true,
          message: response ? 'Saved successfully!!!' : 'Save failed!!!',
          severity: response ? 'success' : 'error',
        });
        response && dispatch(updatePalletFormData({ callApi: true }));
      });
    }
  };

  const onItemEdit = (data: any) => {
    setShowModal(true);
    setPalletItemId(data.id);

    setFormData({
      ...formData,
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
        palletId: data.pallet_id,
        index: data.index,
        receivedCount: data.received_count,
        variance: data.received_variance,
        receivedBy: data.received_by,
      },
    });
  };

  const onITOBlur = (e: any) => {
    if (e?.target?.value) {
      dispatch(getITODetailsAction(e.target.value)).then((response: any) => {
        if (response?.[0]) {
          onModalFieldChange('description', response[0].description);
        }
      });
    }
  };

  const onBarcodeBlur = (e: any) => {
    if (e?.target?.value) {
      dispatch(getItemDescriptionAction(e.target.value)).then((response: any) => {
        if (response || response?.[0]) {
          onModalFieldChange('description', response.Short_Description);
          onModalFieldChange('outer', response.Carton_Qty);
          onModalFieldChange('inner', Math.round(response.custom3));
        }
      });
    }
  };

  const onReceiveEdit = (data: any) => {
    setShowReceiveModal(true);
    setPalletItemId(data.id);

    setFormData({
      ...formData,
      modal: {
        id: data.id,
        quantity: data.quantity,
        receivedCount: data.received_count,
        variance: data.received_variance,
        palletId: data.pallet_id,
        index: data.index,
      },
    });
  };

  const onReceivedClick = () => {
    if (formData.modal.id && formData.modal.id > 0) {
      const _palletItems = palletItems.map((item: any) =>
        item.id === formData.modal.id
          ? {
              ...item,
              received_count: formData.modal.receivedCount,
              received_variance: getVariance(formData.modal.quantity, formData.modal.receivedCount),
              received_by: localStorage.getItem('userName'),
            }
          : item
      );
      dispatch(receivedPalletItemsAction(_palletItems));
    } else if (selectedItemIndex === 0 || selectedItemIndex !== undefined) {
      const _palletItems = palletItems.map((item: any, idx: number) =>
        idx === selectedItemIndex
          ? {
              ...item,
              received_count: formData.modal.receivedCount,
              received_variance: getVariance(formData.modal.quantity, formData.modal.receivedCount),
              received_by: localStorage.getItem('userName'),
            }
          : item
      );
      dispatch(receivedPalletItemsAction(_palletItems));
    }
    closeModal();
  };

  const onDeletePalletItem = () => {
    const _palletItems = palletItems.filter((item: any) =>
      palletItemId && palletItemId > 0 ? item.id !== palletItemId : item !== palletItems[selectedItemIndex]
    );
    dispatch(receivedPalletItemsAction(_palletItems));
    setShowItemConfirm(false);
    setPalletItemId(0);
    setItemDetailsToShowIndex(undefined);
    setSelectedItemIndex(undefined);
  };

  const onDirectToStoreDoneClick = () => {
    onClickSave();
  };

  const palletItemsData = () => (
    <>
      {palletItems && palletItems.length > 0 ? (
        palletItems.map((value: any, index: number) => (
          <Card
            key={index}
            onClick={() => onItemRowClick(index)}
            style={{ marginBottom: 10, cursor: 'pointer' }} // Pointer cursor on hover
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  <Typography variant="subtitle1"><strong>{value.id || 'New'}</strong></Typography>
                </Grid>
                <Grid item md={2}>
                  {setItemStatusColor(value, formData.currentStatus) && (
                    <Fab
                      size="small"
                      color={setItemStatusColor(value, formData.currentStatus) === 'green' ? 'primary' : 'secondary'}
                      disabled
                      style={{ backgroundColor: setItemStatusColor(value, formData.currentStatus) }}
                    />
                  )}
                </Grid>
                <Grid item md={4} />
                <Grid item md={4} style={{ textAlign: 'right' }}>
                  {hasPermission('DeletePalletItem') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => { setShowItemConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletItemId(value.id); setSelectedItemIndex(index); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('UpdatePalletItem') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={() => { setSelectedItemIndex(index); onItemEdit(value); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('ReceiveItem') && formData.currentStatus && (formData.currentStatus === 'Dispatched' || formData.currentStatus === 'Received') && (
                    <Tooltip title="Receive Item">
                      <IconButton onClick={() => { setSelectedItemIndex(index); onReceiveEdit(value); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><Typography>ITO no.: <strong>{value.ito}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Barcode: <strong>{value.barcode}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Description: <strong>{value.description}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Outer: <strong>{value.outer}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Inner: <strong>{value.inner}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Received: <strong>{value.received_count}</strong></Typography></Grid>
                    <Grid item xs={12}><Typography>Added by: <strong>{value.added_by}</strong></Typography></Grid>
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

  return (
    <>
      {isAuthenticated && (
        <>
          <AppHeader title={formData.id ? `Update Pallet (${formData.id})` : 'Add Pallet'} />
          <div style={{ padding: '20px' }}>
            <Card style={{ marginBottom: '20px' }}>
              <CardHeader title="Pallet Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <InputLabel>Store</InputLabel>
                    <SingleSelect
                      name="store"
                      options={palletStore}
                      optionValue="id"
                      optionName="store_name"
                      onChange={onFieldChange}
                      value={formData.store}
                      disabled={!!userStore}
                    />
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel>Category</InputLabel>
                    <SingleSelect
                      name="category"
                      options={palletCategory}
                      optionValue="category_name"
                      optionName="category_name"
                      onChange={onFieldChange}
                      value={formData.category}
                      disabled={!!userStore}
                    />
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel>Pallet Type</InputLabel>
                    <SingleSelect
                      name="palletType"
                      options={palletTypes}
                      optionValue="type"
                      optionName="type"
                      onChange={onFieldChange}
                      value={formData.palletType}
                      disabled={!!userStore}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <InputLabel>Weight</InputLabel>
                    <TextField
                      name="weight"
                      value={formData.weight}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      disabled={!!userStore}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel>Built By</InputLabel>
                    <SingleSelect
                      name="builtBy"
                      options={palletBuilders}
                      optionValue="builder_name"
                      optionName="builder_name"
                      onChange={onFieldChange}
                      value={formData.builtBy}
                      disabled={!!userStore}
                    />
                  </Grid>
                  <Grid item md={4}>
                    <InputLabel>Created By</InputLabel>
                    <Typography variant="body1"><strong>{formData.createdBy}</strong></Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={formData.id ? 12 : 6}>
                    <InputLabel>Contents</InputLabel>
                    <TextField
                      name="Contents"
                      value={formData.Contents}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      disabled={!!userStore}
                      fullWidth
                      multiline
                    />
                  </Grid>
                  <Grid item md={formData.id ? 12 : 6}>
                    <InputLabel>Other Notes</InputLabel>
                    <TextField
                      name="notes"
                      value={formData.notes}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      fullWidth
                      multiline
                    />
                  </Grid>
                </Grid>
                {formData.id && (
                  <Grid container spacing={2}>
                    <Grid item md={4}>
                      <InputLabel>Status</InputLabel>
                      <SingleSelect
                        name="status"
                        options={palletStatus}
                        optionValue="status_name"
                        optionName="status_name"
                        onChange={onFieldChange}
                        value={formData.status}
                      />
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel>Last Status Changed By</InputLabel>
                      <Typography variant="body1"><strong>{formData.last_status_changed_by}</strong></Typography>
                    </Grid>
                    <Grid item md={4}>
                      <InputLabel>Last Status Changed Date</InputLabel>
                      <Typography variant="body1"><strong>{formData.last_status_changed_date}</strong></Typography>
                    </Grid>
                  </Grid>
                )}
                {!formData.id && (
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Wrapped">Wrapped</MenuItem>
                        <MenuItem value="on Hold">on Hold</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
              <CardContent>
                <Grid container spacing={2}>
                  {hasPermission('AddPalletItem') && (
                    <Grid item md={2}>
                      <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                        Add Item
                      </Button>
                    </Grid>
                  )}
                  <Grid item md={2}>
                    <Button variant="contained" color="primary" onClick={onClickSave}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={2}>
                    <Button variant="contained" onClick={() => router.push(webUrl.pallet)}>
                      Back
                    </Button>
                  </Grid>
                  <Grid item md={2}>
                    <Button variant="contained" onClick={() => setShowDownloadOptions(true)}>
                      Download Pick List
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Items" />
              <CardContent>{palletItemsData()}</CardContent>
            </Card>

            <PalletItemModal
              modal={formData.modal}
              showModal={showModal}
              onBarcodeBlur={onBarcodeBlur}
              onModalFieldChange={onModalFieldChange}
              userName={localStorage.getItem('userName')}
              onDoneClick={onDoneClick}
              closeModal={closeModal}
            />

            <ReceiveItemModal
              modal={formData.modal}
              showModal={showReceiveModal}
              onModalFieldChange={onModalFieldChange}
              onDoneClick={onReceivedClick}
              closeModal={closeModal}
            />

            <AppAlert
              showAlert={showAlert}
              headerText="Message"
              message={alertMessage}
              btnCancelText="OK"
              cancelClick={() => { setShowAlert(false); apiResponse && router.push(webUrl.pallet); }}
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

            <DirectToStore
              showModal={showDirectToStoreModal}
              setNoOfPallet={setNoOfPallet}
              noOfPallet={noOfPallet}
              supplier={supplier}
              setSupplier={setSupplier}
              conNumber={conNumber}
              setConNumber={setConNumber}
              onDoneClick={onDirectToStoreDoneClick}
              closeModal={() => {
                setShowDirectToStoreModal(false);
                setNoOfPallet('');
                setSupplier('');
                setConNumber('');
              }}
            />
          </div>

          <Dialog open={showDownloadOptions} onClose={() => setShowDownloadOptions(false)}>
            <DialogTitle>Download Pick List</DialogTitle>
            <DialogContent>
              <Button variant="contained" color="primary" onClick={generatePDF}>
                Download as PDF
              </Button>
              <Button variant="contained" color="primary" onClick={generateExcel} style={{ marginLeft: '10px' }}>
                Download as Excel
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDownloadOptions(false)} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={flashMessage.open}
            autoHideDuration={6000}
            onClose={() => setFlashMessage({ ...flashMessage, open: false })}
          >
            <Alert onClose={() => setFlashMessage({ ...flashMessage, open: false })} severity={flashMessage.severity}>
              {flashMessage.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
};

export default AddUpdatePallet;
