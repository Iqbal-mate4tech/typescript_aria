// src/pages/pallet/[id].tsx
"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';

import { useRouter, useParams } from 'next/navigation';


import { useSelector } from 'react-redux';
import {
  Card, CardContent, CardHeader, Typography, Grid, Button, TextField, Select, MenuItem, InputLabel, IconButton, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Snackbar, Alert
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import jsPDF from 'jspdf';

import * as XLSX from 'xlsx';


import 'jspdf-autotable';

import {
  addUpdatePalletsMasterDataAction, addItemToListAction, unMountAddUpdateData,
  savePalletAction, palletItemsAction, updatePalletAction, receivedPalletItemsAction, updatePalletFormData,
  getItemDescriptionAction, getDIDdescriptionAction, getITODetailsAction, getdidnumbervalidAction,
  getstorepoAction
} from '../pallet/action';
import { useAppDispatch } from '../../store';
import AppHeader from '@/components/app-header';
import SingleSelect from '@/components/single-select';
import PalletItemModal from '@/components/pallet-item-modal';
import ReceiveItemModal from '@/components/receive-item-modal';
import DirectToStore from '@/components/direct-to-store';
import { AppAlert } from '@/components/app-alert';
import {
  getUtcDateTime, hasPermission, isValidStatusToChange, getUserStore,
  getVariance, setItemStatusColor
} from '../../../shared/common';
import { webUrl } from '../../../shared/constants';
import useAuth from '@/components/withAuth';



const AddUpdatePallet = () => {
  const isAuthenticated = useAuth(); // Check if the user is authenticated
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const palletStatus = useSelector((state: any) => state.pallet.palletStatus);
  const palletStore = useSelector((state: any) => state.pallet.palletStore);
  const palletCategory = useSelector((state: any) => state.pallet.palletCategory);
  const palletTypes = useSelector((state: any) => state.pallet.palletTypes);
  const palletBuilders = useSelector((state: any) => state.pallet.palletBuilders);
  const pallets = useSelector((state: any) => state.pallet.pallets);
  const palletItems = useSelector((state: any) => state.pallet.palletItems);
  const userStore = getUserStore();

  // const userName = localStorage.getItem('userName');

  const [userName, setUserName] = useState<any>(null);
  const [userType, setUserType] = useState<any>(null);


  const [formData, setFormData] = useState<any>({ createdBy: userName, modal: {} });

  // const [formData, setFormData] = useState<any>({ createdBy: localStorage.getItem('userName'), modal: {} });
  const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>(undefined);
  const [palletItemId, setPalletItemId] = useState(0);
  const [showItemConfirm, setShowItemConfirm] = useState<boolean>(false);
  const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false);
  const [noOfPallet, setNoOfPallet] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [showDirectToStoreModal, setShowDirectToStoreModal] = useState<boolean>(false);
  const [conNumber, setConNumber] = useState<string>('');
  const [selected, setSelected] = useState('Male');
  const [showDownloadOptions, setShowDownloadOptions] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [sendingInner, setSendingInner] = useState<boolean>(false);
  const [didNumberError, setDidNumberError] = useState<string>('');
  const [storePoOptions, setStorePoOptions] = useState<any>([]);

  const [errors, setErrors] = useState({
    // store: '',
    // category: '',
    // palletType: '',
    // weight: '',
    // builtBy: '',
    // status: ''
  });


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
    const store_id = formData.store;

    if (!didNumber) return ''; // Clear error when field is empty

    if (store_id === null || store_id === undefined || store_id === '') return 'Please select a store first'; // Return error message

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
    setFormData((prevFormData: any) => {
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
    if (formData.store) {
      const fetchStorePo = async () => {
        const response = await dispatch(getstorepoAction(formData.store));

        if (response && response.purchaseOrders) {
          const options = response.purchaseOrders.map((po: any) => ({
            value: String(po.id),  // Ensure value is a string to match formData.pallet_store_po
            label: po.name
          }));

          setStorePoOptions(options);  // Update the available PO options

        } else {
          setStorePoOptions([]);  // Clear options on error or no data
        }
      };

      fetchStorePo();
    }
  }, [formData.store, formData.pallet_store_po]);



  useEffect(() => {
    // if (isAuthenticated) {
    dispatch(addUpdatePalletsMasterDataAction());
    setInitialData();

    // }


    return () => {
      dispatch(unMountAddUpdateData());
    };
  }, []);










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
          pallet_store_po: palletToUpdate.pallet_store_po,
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

  const onFieldChange = async (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: value ? '' : prevErrors[name],
    }));
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
    if (!palletStore) return '';
    const store = palletStore.find((store: any) => store.id === storeId);


    return store ? store.store_name : '';
  };

  const generatePDF = () => {
    if (!formData) return;

    const doc: any = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Pallet Information', 20, 20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const idText = `Pallet ID: ${formData.id || 'N/A'}`;
    const storeName = `Store Name: ${getStoreName(formData.store) || 'N/A'}`;

    const maxWidth = doc.internal.pageSize.getWidth() - 40; // Adjust for margins
    const idWidth = doc.getTextWidth(idText);

    doc.text(idText, 20, 40);
    doc.text(storeName, 20 + idWidth + 10, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const leftColumn = 20;
    const rightColumn = 100;
    let currentRow = 50; // Adjusted spacing

    doc.text('Pallet Type:', leftColumn, currentRow);
    doc.text(formData.palletType || 'N/A', rightColumn, currentRow);
    currentRow += 8; // Reduced spacing

    doc.text('Weight:', leftColumn, currentRow);
    doc.text(formData.weight || 'N/A', rightColumn, currentRow);
    currentRow += 8; // Reduced spacing

    doc.text('Last Status Changed By:', leftColumn, currentRow);
    doc.text(formData.last_status_changed_by || 'N/A', rightColumn, currentRow);
    currentRow += 8; // Reduced spacing

    doc.text('Contents:', leftColumn, currentRow);
    const contentLines = doc.splitTextToSize(formData.Contents || 'N/A', 180);

    doc.text(contentLines, rightColumn, currentRow);
    currentRow += 8 * contentLines.length; // Reduced spacing

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
      startY: currentRow + 5,
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
    const _formData = formData;

    _formData.modal[name] = value;
    setFormData({ ..._formData });
  };



  const onItemRowClick = (index: number) => {
    setItemDetailsToShowIndex(index === itemDetailsToShowIndex ? undefined : index);
  };



  const onDoneClick = () => {
    const ito = formData.modal.did_Number;

    const itemData = {
      id: formData.modal.id,
      quantity: formData.modal.quantity,
      ito: ito,
      qty_to_send: formData.modal.qty_to_send,
      remaining_qty: formData.modal.remaining_qty,
      inners_send: formData.modal.inners_send,
      remaining_inners: formData.modal.remaining_inners,
      cartons_send: formData.modal.cartons_send,
      remaining_cartons: formData.modal.remaining_cartons,
      barcode: formData.modal.barcode,
      outer: formData.modal.outer,
      description: formData.modal.description,
      inner: formData.modal.inner,
      oh_quantity: formData.modal.oh_quantity,
      added_by: formData.modal.id > 0 ? formData.modal.addedBy : userName,
      added_on: formData.modal.id > 0 ? formData.modal.addedOn : getUtcDateTime(),
      pallet_id: formData.id,
      received_by: formData.modal.receivedBy,
      received_count: formData.modal.receivedCount,
      received_variance: formData.modal.variance,
      sendingInner: sendingInner,
    };

    // Cloning to avoid mutability issues

    if (itemData.id && itemData.id > 0) {
      const _palletItems = palletItems;

      _palletItems.forEach((element: any, index: any) => {
        if (element.id === itemData.id) _palletItems[index] = itemData;
      });

      dispatch(receivedPalletItemsAction(_palletItems));
    } else if (selectedItemIndex !== undefined || selectedItemIndex === 0) {
      const _palletItems = palletItems;

      _palletItems.forEach((element: any, index: any) => {
        if (element.id === itemData.id) _palletItems[index] = itemData;
      });
      dispatch(receivedPalletItemsAction(_palletItems));
    } else {
      dispatch(addItemToListAction(itemData));
    }

    setSelectedItemIndex(undefined);
    setFormData({
      ...formData,
      modal: {}
    });
  };





  const closeModal = () => {
    setShowModal(false);
    setFormData({ ...formData, modal: {} });
    setDidNumberError('');
    setItemDetailsToShowIndex(undefined);
    setShowReceiveModal(false);
  };

  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  const onClickSave = () => {


    //     const newErrors = {};

    //     // Validate store
    //     if (formData.store === null || formData.store === undefined || formData.store === '') {
    //         newErrors.store = 'Store is required';
    //     }

    //     // Validate category
    //     if (!formData.category) {
    //         newErrors.category = 'Category is required';
    //     }

    //     // Validate pallet type
    //     if (!formData.palletType) {
    //         newErrors.palletType = 'Pallet Type is required';
    //     }

    //     // Validate weight
    //     if (!formData.weight) {
    //         newErrors.weight = 'Weight is required';
    //     }

    //     // Validate built by
    //     if (!formData.builtBy) {
    //         newErrors.builtBy = 'Built By is required';
    //     }

    //     // Validate status
    //     if (!formData.status) {
    //         newErrors.status = 'Status is required';
    //     }

    //     // If there are any errors, stop execution and set the error state
    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);

    // return;
    //     }

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
      pallet_store_po: formData.pallet_store_po,
      status: formData.status,
      other_notes: formData.notes,
      contents: formData.Contents,
      last_status_changed_by: userName,
      last_status_changed_date: getUtcDateTime(),
      date_created: formData.id ? formData.date_created : getUtcDateTime(),
      palletItems: palletItems || undefined,
      supplier: formData.id ? formData.supplier : supplier,
      con_number: formData.con_number,
    };

    if (formData.status?.toLowerCase() === 'wrapped') {
      palletData.wrapped_by = userName;
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
        response ?
          setAlertMessage("Updated successfully!!!") :
          setAlertMessage("Updation failed!!!");
        setShowAlert(true);
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
        .then((response: any) => {
          setApiResponse(response);
          response && setAlertMessage("Saved successfully!!!");
          setShowAlert(true);
          response && dispatch(updatePalletFormData({ callApi: true }));
          setShowDirectToStoreModal(false);
          setNoOfPallet('');
          setSupplier('');
          setConNumber('');
        })
        .catch(() => {
          setShowAlert(true);
          setAlertMessage("Saved failed!!!");
        });
    } else {
      dispatch(savePalletAction(palletData)).then((response: any) => {
        setApiResponse(response);
        response ?
          setAlertMessage("Saved successfully!!!") :
          setAlertMessage("Saved failed!!!");
        setShowAlert(true);
        response && dispatch(updatePalletFormData({ callApi: true }));
      });
    }
  };




  const onItemEdit = (data: any) => {
    setShowModal(true);
    setPalletItemId(data.id);

    const isSendingInner = ['True', true].includes(data.sending_inner || data.sendingInner);

    setFormData((formData: any) => ({
      ...formData,
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


  const onITOBlur = (e: any) => {
    if (e?.target?.value) {
      dispatch(getITODetailsAction(e.target.value)).then((response: any) => {
        if (response?.[0]) {
          onModalFieldChange('description', response[0].description);
        }
      });
    }
  };





  const onBarcodeBlur = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;

    const barcode = e.target.value;
    const { modal } = formData;

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
            received_by: userName,
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
            received_by: userName,
          }
          : item
      );

      dispatch(receivedPalletItemsAction(_palletItems));

    }

    closeModal();
    setSelectedItemIndex(undefined);
  };

  const onDeletePalletItem = () => {
    let _palletItems;

    if (palletItemId && palletItemId > 0)
      _palletItems = palletItems.filter((item: any) => item.id !== palletItemId);
    else {
      _palletItems = palletItems.filter((item: any, index: any) => index !== selectedItemIndex);
    }

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
            onClick={(e) => { e.stopPropagation(); onItemRowClick(index) }}
            style={{ marginBottom: 10, cursor: 'pointer' }} // Pointer cursor on hover
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  <Typography variant="subtitle1"><strong>{value.id || 'New'}</strong></Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography variant="subtitle1">Quantity<strong>{value.quantity}</strong></Typography>
                </Grid>
                <Grid item md={2}>
                  {setItemStatusColor(value, formData.currentStatus) && (
                    <Fab
                      size="small"
                      color={setItemStatusColor(value, formData.currentStatus) === 'green' ? 'primary' : 'secondary'}
                      style={{ backgroundColor: setItemStatusColor(value, formData.currentStatus) }}
                    />
                  )}
                </Grid>
                <Grid item md={4} />
                <Grid item md={2} style={{ textAlign: 'right' }}>
                  {hasPermission('DeletePalletItem') && (
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={(e) => { e.stopPropagation(); setShowItemConfirm(true); setAlertMessage('Are you sure to delete?'); setPalletItemId(value.id); setSelectedItemIndex(index); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('UpdatePalletItem') && (
                    <Tooltip title="Edit">
                      <IconButton onClick={(e) => { e.stopPropagation(); setSelectedItemIndex(index); onItemEdit(value); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasPermission('ReceiveItem') && formData.currentStatus && (formData.currentStatus === 'Dispatched' || formData.currentStatus === 'Received') && (
                    <Tooltip title="Receive Item">
                      <IconButton onClick={(e) => { e.stopPropagation(); setSelectedItemIndex(index); onReceiveEdit(value); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
              {index === itemDetailsToShowIndex && (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={4}><Typography>DID No.: <strong>{value.ito}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Barcode: <strong>{value.barcode}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Quantity: <strong>{value.quantity}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Description: <strong>{value.description}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Outer: <strong>{value.outer}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Inner: <strong>{value.inner}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Received: <strong>{value.received_count}</strong></Typography></Grid>
                    <Grid item md={4}><Typography>Added by: <strong>{value.added_by}</strong></Typography></Grid>
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
          <AppHeader headerText={formData.id ? `Update Pallet (${formData.id})` : 'Add Pallet'} redirectTo={(path: string) => router.push(path)} />
          <div style={{ padding: '20px' }}>
            <Card style={{ marginBottom: '25px' }}>
              <CardHeader title="Pallet Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={2} xs={6}>
                    {/* <InputLabel>Store</InputLabel> */}
                    <SingleSelect
                      name="store"
                      options={palletStore}
                      optionValue="id"
                      optionName="store_name"
                      onChange={onFieldChange}
                      value={formData.store || ''}
                      disabled={!!userStore}

                    // {errors.store && <strong color="danger">{errors.store}</strong>}
                    />
                  </Grid>
                  <Grid item md={2} xs={6}>
                    {/* <InputLabel>Category</InputLabel> */}
                    <SingleSelect
                      name="category"
                      options={palletCategory}
                      optionValue="category_name"
                      optionName="category_name"
                      onChange={onFieldChange}
                      value={formData.category || ''}
                      disabled={!!userStore}

                    // {errors.category && <strong color="danger">{errors.category}</strong>}
                    />
                  </Grid>
                  <Grid item md={2} xs={6}>
                    {/* <InputLabel>Pallet Type</InputLabel> */}
                    <SingleSelect
                      name="palletType"
                      options={palletTypes}
                      optionValue="type"
                      optionName="type"
                      onChange={onFieldChange}
                      value={formData.palletType || ''}
                      disabled={!!userStore}

                    // {errors.palletType && <strong color="danger">{errors.palletType}</strong>}
                    />
                  </Grid>
                  <Grid item md={3} xs={6}>
                    {/* <InputLabel>Built By</InputLabel> */}
                    <SingleSelect
                      name="builtBy"
                      options={palletBuilders}
                      optionValue="builder_name"
                      optionName="builder_name"
                      onChange={onFieldChange}
                      value={formData.builtBy || ''}
                      disabled={!!userStore}

                    // {errors.builtBy && <strong color="danger">{errors.builtBy}</strong>}
                    />
                  </Grid>
                  <Grid item md={3} xs={6}>
                    {/* <InputLabel>PO</InputLabel> */}
                    <SingleSelect
                      name='pallet_store_po'
                      options={storePoOptions} // Using fetched store PO options
                      optionValue='label'
                      optionName='label'
                      onChange={onFieldChange}
                      value={formData.pallet_store_po || ''}
                      disabled={!!userStore}
                    />

                    {/* {errors.pallet_store_po && <strong color="danger">{errors.pallet_store_po}</strong>} */}
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ margin: '25px 0' }}>
                  <Grid item md={2} xs={6}>
                    <InputLabel>Weight</InputLabel>
                    <TextField
                      name="weight"
                      value={formData.weight || ''}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      disabled={!!userStore}
                      fullWidth

                    // {errors.weight && <strong color="danger">{errors.weight}</strong>}
                    />
                  </Grid>
                  <Grid item md={2} xs={6}>
                    <InputLabel>Contents</InputLabel>
                    <TextField
                      name="Contents"
                      value={formData.Contents || ''}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      disabled={!!userStore}
                      fullWidth
                      multiline
                    />
                  </Grid>
                  <Grid item md={2} xs={6}>
                    <InputLabel>Other Notes</InputLabel>
                    <TextField
                      name="notes"
                      value={formData.notes || ''}
                      onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid item md={2} xs={6}>
                    <InputLabel>Created By</InputLabel>
                    <Typography variant="body1"><strong>{formData.createdBy || ''}</strong></Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                {formData.id && (
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={6}>
                      {/* <InputLabel>Status</InputLabel> */}
                      <SingleSelect
                        name="status"
                        options={palletStatus}
                        optionValue={(userType === 'manager' || userType === 'admin' || userType === 'buyer') ? 'status_name' : 'status'}
                        optionName={(userType === 'manager' || userType === 'admin' || userType === 'buyer') ? 'status_name' : 'status'}
                        onChange={onFieldChange}
                        value={formData.status || ''}

                      // {errors.status && <strong color="danger">{errors.status}</strong>}
                      />
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <InputLabel>Last Status Changed By</InputLabel>
                      <Typography variant="body1"><strong>{formData.last_status_changed_by || ''}</strong></Typography>
                    </Grid>
                    <Grid item md={4} xs={6}>
                      <InputLabel>Last Status Changed Date</InputLabel>
                      <Typography variant="body1"><strong>{formData.last_status_changed_date || ''}</strong></Typography>
                    </Grid>
                  </Grid>
                )}
                {!formData.id && (
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={6}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status || ''}
                        onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="Wrapped">Wrapped</MenuItem>
                        <MenuItem value="on Hold">on Hold</MenuItem>
                      </Select>
                      {/* {errors.status && <strong color="danger">{errors.status}</strong>} */}
                    </Grid>
                  </Grid>
                )}
              </CardContent>
              <CardContent>
                <Grid container spacing={2}>
                  {hasPermission('AddPalletItem') && (
                    <Grid item md={2} xs={6}>
                      <Button variant="contained" color="primary" size="large" style={{ padding: '13px 0' }} fullWidth
                        onClick={() => setShowModal(true)}>
                        Add Item
                      </Button>
                    </Grid>
                  )}
                  <Grid item md={2} xs={6}>
                    <Button variant="contained" color="primary" size="large" style={{ padding: '13px 0' }} fullWidth
                      disabled={formData.store === null || formData.store === undefined || formData.store === '' ||
                        !formData.category || !formData.palletType || !formData.weight || !formData.builtBy || !formData.status}
                      onClick={onClickSave}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={6}>
                    <Button variant="contained" size="large" style={{ padding: '13px 0' }} fullWidth
                      onClick={() => router.push(webUrl.pallet)}>
                      Back
                    </Button>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    <Button variant="contained" size="large" style={{ padding: '13px 0' }} fullWidth
                      onClick={() => setShowDownloadOptions(true)}>
                      Download Pick List
                    </Button>
                  </Grid>
                  <Grid item md={3} xs={6}>
                    {
                      formData.id ||

                      <Button variant="contained" size="large" style={{ padding: '13px 0' }} fullWidth onClick={() => { setShowDirectToStoreModal(true) }}>
                        Add Direct To Store
                      </Button>

                    }
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

              // userName={localStorage.getItem('userName')}
              userName={formData.modal.id && formData.modal.id > 0 ? formData.modal.addedBy : userName}
              onDoneClick={onDoneClick}
              closeModal={closeModal}
              handleFieldChange={handleFieldChange}
              sendingInner={sendingInner}
              setSendingInner={setSendingInner}
              handleDidNumberBlur={handleDidNumberBlur}
              didNumberError={didNumberError}  // Pass error state as prop
              setDidNumberError={setDidNumberError}
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
}



export default AddUpdatePallet;




