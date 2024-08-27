'use client';

import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardContent, CardHeader, TextField, Grid, Typography, Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '@/components/app-header';
import {
  getPOIDdescriptionAction, AddPoItemsAction, receivePOAction, UpdateQtytoOdooAction
} from './action';
import { RootState } from '../../store';
import POQuantityModal from '@/components/po-quantity-modal';
import POQAdditemModal from '@/components/po-add-item-modal';
import {AppAlert} from '@/components/app-alert';

const ReceivePONewOdoo: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const barcodeScan = useSelector((state: RootState) => state.receiveodoo.barcodeScan);
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  const [toggle, setToggle] = useState(false);
  const [poid, setPoid] = useState<string | undefined>();
  const [odooId, setOdooId] = useState<number | undefined>();
  const [supplierSku, setSupplierSku] = useState<string | undefined>();
  const [alertMessage, setAlertMessage] = useState({ show: false, msg: '', headerText: '', btnCancelText: '', btnOkText: '' });
  const [comment, setComment] = useState('');
  const [qtyReceived, setQtyReceived] = useState('');
  const [qtyReceivedAlready, setQtyReceivedAlready] = useState('');
  const [qtyOrdered, setQtyOrdered] = useState<number | undefined>();
  const [qtyToReceive, setQtyToReceive] = useState<number | undefined>();
  const [dateReceive, setDateReceive] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [addShowModal, setAddShowModal] = useState(false);
  const [storeid, setStoreid] = useState<string | undefined>();
  const [userStoreid, setUserStoreid] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [cartonQty, setCartonQty] = useState<number | undefined>();
  const [innerQty, setInnerQty] = useState<number | undefined>();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement> | string) => {
    const pasteValue = typeof event === 'string' ? event : event.clipboardData?.getData('Text') || '';
    if (!toggle) {
      dispatch(getPOIDdescriptionAction(pasteValue)).then((response: any) => {
        if (response) {
          setPoid(pasteValue);
          setToggle(true);
        } else {
          setAlertMessage({ show: true, msg: `No PO found with id=${pasteValue}` });
        }
      });
    } else {
      const result = barcodeScan?.[0]?.data.order_lines.find((item: any) => item.barcode === pasteValue);
      if (result) {
        setSupplierSku(pasteValue);
        setQtyOrdered(result.qty_ordered);
        setQtyToReceive(result.qty_to_receive);
        setQtyReceived(result.qty_to_receive);
        setOdooId(result.id);
        setShowModal(true);
      } else {
        const dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        setDateReceive(dt);
        setAlertMessage({
          show: true,
          msg: `The product with SKU=${pasteValue} is not found in this PO. Do you still want to add this?`,
          headerText: 'Warning',
          btnCancelText: 'No',
          btnOkText: 'Yes'
        });
        setSupplierSku(pasteValue);
        setPoid(poid);
      }
    }
  };

  const receiveItems = (data: { orderline_id: number; qty_to_receive: number }) => {
    if (data.orderline_id && data.qty_to_receive) {
      dispatch(UpdateQtytoOdooAction(data)).then((response: any) => {
        response || setAlertMessage({ show: true, msg: 'Updation failed' });
        setShowModal(false);
      });
    } else {
      setAlertMessage({ show: true, msg: 'No item to receive.' });
    }
  };

  const onDoneClick = () => {
    const data = {
      orderline_id: odooId!,
      qty_to_receive: qtyToReceive!,
    };
    receiveItems(data);
  };

  const onReceiveDoneClick = () => {
    const response_data = {
      poid: poid!,
      SupplierSku: supplierSku!,
      qty: parseInt(qtyReceived),
      date_received: dateReceive!,
      added_by: userName!,
      store_id: storeid!,
      user_store_id: userStoreid!,
      description: description!,
      carton_qty: cartonQty!,
      inner_qty: innerQty!,
    };
    dispatch(AddPoItemsAction(response_data)).then((response: any) => {
      response || setAlertMessage({ show: true, msg: 'Updation failed' });
      setAddShowModal(false);
    });
  };

  const clearData = () => {
    setShowModal(false);
    setAddShowModal(false);
    setStoreid('');
    setQtyReceived('');
    setInnerQty(undefined);
    setCartonQty(undefined);
    setDescription('');
    setUserStoreid('');
  };

  const closeModal = () => {
    clearData();
  };

  const barcodeItems = () => {
    return barcodeScan?.[0]?.data.order_lines.map((value: any, index: number) => (
      <Card key={index} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>{value.barcode}</strong></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>{value.qty_ordered}</strong></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>{value.qty_to_receive}</strong></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>{value.qty_received}</strong></Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ));
  };

  const getDom = () => {
    if (!toggle) {
      return (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4">Scan PO</Typography>
          <TextField
            name="innerqty"
            fullWidth
            onBlur={(e) => handleKeyDown(e.target.value)}
          />
        </Box>
      );
    } else {
      return (
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={() => setToggle(!toggle)}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5">PO ID: {poid}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={() => {}}
                >
                  Validate
                </Button>
              </Grid>
            </Grid>
            {barcodeItems()}
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <>
      <AppHeader headerText="Receive PO Odoo" redirectTo={router.push} />
      <Box sx={{ padding: 2 }}>{getDom()}</Box>
      <POQuantityModal
        comment={comment}
        qtyReceived={qtyToReceive || 0}
        setComment={setComment}
        setQtyReceived={setQtyToReceive}
        qtyOrdered={qtyOrdered || 0}
        showModal={showModal}
        qtyReceivedAlready={qtyReceivedAlready || 0}
        onDoneClick={onDoneClick}
        closeModal={closeModal}
      />
      <POQAdditemModal
        comment={comment}
        poid={poid}
        showModal={addShowModal}
        SupplierSku={supplierSku}
        setComment={setComment}
        Qty={qtyReceived}
        storeid={storeid}
        setStoreid={setStoreid}
        userStoreid={userStoreid}
        setUserStoreid={setUserStoreid}
        description={description}
        setDescription={setDescription}
        cartonQty={cartonQty}
        setCartonQty={setCartonQty}
        innerQty={innerQty}
        setInnerQty={setInnerQty}
        userName={userName || ''}
        dateReceive={dateReceive}
        setQty={setQtyReceived}
        setDateReceive={setDateReceive}
        onDoneClick={onReceiveDoneClick}
        closeModal={closeModal}
      />
      <AppAlert
        showAlert={alertMessage.show}
        headerText={alertMessage.headerText || 'Error'}
        message={alertMessage.msg}
        btnCancelText={alertMessage.btnCancelText || 'Ok'}
        cancelClick={() => setAlertMessage({ show: false, msg: '', headerText: '', btnCancelText: '', btnOkText: '' })}
        btnOkText={alertMessage.btnOkText || false}
        okClick={() => setAddShowModal(true)}
      />
    </>
  );
};

export default ReceivePONewOdoo;
