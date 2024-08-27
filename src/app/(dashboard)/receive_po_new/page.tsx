'use client';

import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, CardContent, Typography, Grid, TextField, Box, Switch,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import  AppHeader  from '@/components/app-header';
import {
  getPOIDDescriptionAction, addPoItemsAction, receivePOAction
} from './action';
import { RootState } from '../../store';
import { AppAlert } from '@/components/app-alert';
import POQuantityModal from '@/components/po-quantity-modal';
import POQAdditemModal from '@/components/po-add-item-modal';
import BarcodeReader from 'react-barcode-reader';
import KeyboardEventHandler from 'react-keyboard-event-handler';

const ReceiveItotoggle: React.FC = () => {
  const [searchData, setSearchData] = useState({ modal: {} });
  const [toggle, setToggle] = useState(false);
  const [poid, setPoid] = useState<string | false>(false);
  const [supplierSku, setSupplierSku] = useState<string | false>(false);
  const [alertMessage, setAlertMessage] = useState({ show: false, msg: '', headerText: '', btnCancelText: '', btnOkText: '' });
  const [comment, setComment] = useState('');
  const [qtyReceived, setQtyReceived] = useState('');
  const [qtyReceivedAlready, setQtyReceivedAlready] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [addshowModal, setAddshowModal] = useState(false);
  const [qtyOrdered, setQtyOrdered] = useState<number | false>(false);
  const [Qty, setQty] = useState<number | false>(false);
  const [dateReceive, setDateReceive] = useState<string | false>(false);
  const [storeid, setStoreid] = useState<string | false>(false);
  const [userstoreid, setUserstoreid] = useState<string | false>(false);
  const [description, setDescription] = useState<string | false>(false);
  const [cartonqty, setCartonqty] = useState<number | false>(false);
  const [innerqty, setInnerqty] = useState<number | false>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const barcodeScan = useSelector((state: RootState) => state.itotoggle?.barcodeScan || []);  const userName = localStorage.getItem('userName') || '';

  const onDoneClick = () => {
    let _quantityReceived = parseInt(qtyReceivedAlready) !== -1
      ? parseInt(qtyReceived) + parseInt(qtyReceivedAlready || '0')
      : parseInt(qtyReceived);

    const data = {
      poId: poid,
      supplierSku: supplierSku,
      qtyReceived: _quantityReceived,
      qtyOrdered: qtyOrdered,
      comment: comment,
      status: parseInt(qtyOrdered as string) === _quantityReceived ? 'received-status' : 'variance-status',
    };

    if (document.getElementById(supplierSku as string)) {
      document.getElementById(supplierSku as string)!.innerHTML = _quantityReceived.toString();
    }

    barcodeScan?.forEach((item) => {
      if (item.SupplierSku === supplierSku) {
        item.QtyReceived = _quantityReceived;
      }
    });

    receiveItems(data);
    setShowModal(false);
  };

  const onReceiveDoneClick = () => {
    const data = {
      poid: poid,
      SupplierSku: supplierSku,
      qty: Qty,
      date_received: dateReceive,
      added_by: userName,
      store_id: storeid,
      user_store_id: userstoreid,
      description: description,
      carton_qty: cartonqty,
      inner_qty: innerqty,
    };

    dispatch(addPoItemsAction(data)).then((response) => {
      if (response) {
        setAddshowModal(false);
        setAlertMessage({ show: true, msg: 'PO successfully received', headerText: 'Done' });
      } else {
        setAlertMessage({ show: true, msg: 'Updation failed', headerText: '' });
      }
    });
  };

  const handleKeyDown = (paste_value: string) => {
    if (!toggle) {
      dispatch(getPOIDDescriptionAction(paste_value)).then((response: any) => {
        if (response) {
          setPoid(paste_value);
          setToggle(true);
        } else {
          setAlertMessage({ show: true, msg: `No PO found with id=${paste_value}` });
        }
      });
    } else {
      const result = barcodeScan?.find(item => item.SupplierSku === paste_value);
      if (result) {
        setSupplierSku(paste_value);
        setQtyOrdered(result.QtyOrdered);
        setQtyReceived(result.QtyReceived === -1 ? result.QtyOrdered : result.QtyOrdered - result.QtyReceived);
        setQtyReceivedAlready(result.QtyReceived);
        setShowModal(true);
      } else {
        const dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        setDateReceive(dt);
        setAlertMessage({
          show: true,
          msg: `The product with SKU=${paste_value} is not found in this PO. Do you still want to add this?`,
          headerText: 'Warning',
          btnCancelText: 'No',
          btnOkText: 'Yes',
        });
        setSupplierSku(paste_value);
        setPoid(poid);
      }
    }
  };

  const receiveItems = (data: any) => {
    if (data.poId && data.supplierSku && data.qtyReceived) {
      dispatch(receivePOAction(data)).then((response: any) => {
        if (!response) {
          setAlertMessage({ show: true, msg: 'Updation failed', headerText: '' });
        }
      });
    } else {
      setAlertMessage({ show: true, msg: 'No item to receive.', headerText: '' });
    }
  };

  const barcodeitems = () => {
    return barcodeScan?.map((value, index) => (
      <Card key={index} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>{value.SupplierSku}</strong></Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong>{value.QtyOrdered}</strong></Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1"><strong><span id={value.SupplierSku}>{value.QtyReceived != null ? value.QtyReceived : 0}</span></strong></Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ));
  };

  const handleBarcodeScan = (data: string) => {
    handleKeyDown(data);
  };

  const getDom = () => {
    return !toggle ? (
      <Box>
        <Typography variant="h4">Scan PO</Typography>
        <TextField
          label="PO Id"
          fullWidth
          variant="outlined"
          onBlur={(e) => handleKeyDown(e.target.value)}
        />
      </Box>
    ) : (
      <Card sx={{ padding: 2, marginBottom: 2 }}>
        <Button variant="contained" onClick={() => setToggle(false)}>
          Back
        </Button>
        <Typography variant="h5" sx={{ marginTop: 2 }}>PO ID: {poid}</Typography>
        <CardContent>
          <Typography variant="h6">PO Items Receive List</Typography>
          <Box>{barcodeitems()}</Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <KeyboardEventHandler handleKeys={['ctrl+enter']} onKeyEvent={(key, e) => handleKeyDown(e?.clipboardData?.getData('Text') || '')} />
      <BarcodeReader onScan={handleBarcodeScan} />
      <AppHeader headerText="Receive PO" redirectTo={router.push} />
      <Box sx={{ padding: 2 }}>
        {getDom()}
      </Box>

      <POQuantityModal
        comment={comment}
        qtyReceived={qtyReceived}
        setComment={setComment}
        setQtyReceived={setQtyReceived}
        qtyOrdered={qtyOrdered}
        showModal={showModal}
        qtyReceivedAlready={qtyReceivedAlready}
        onDoneClick={onDoneClick}
        closeModal={() => setShowModal(false)}
      />

      <POQAdditemModal
        comment={comment}
        poid={poid as string}
        showModal={addshowModal}
        SupplierSku={supplierSku as string}
        setComment={setComment}
        Qty={Qty as number}
        storeid={storeid as string}
        setStoreid={setStoreid}
        userstoreid={userstoreid as string}
        setUserstoreid={setUserstoreid}
        description={description as string}
        setDescription={setDescription}
        cartonqty={cartonqty as number}
        setCartonqty={setCartonqty}
        innerqty={innerqty as number}
        setInnerqty={setInnerqty}
        userName={userName}
        dateReceive={dateReceive as string}
        setQty={setQty}
        setDateReceive={setDateReceive}
        onDoneClick={onReceiveDoneClick}
        closeModal={() => setAddshowModal(false)}
      />

      <AppAlert
        showAlert={alertMessage.show}
        headerText={alertMessage.headerText || 'Error'}
        message={alertMessage.msg}
        btnCancelText={alertMessage.btnCancelText || 'Ok'}
        cancelClick={() => setAlertMessage({ ...alertMessage, show: false })}
        btnOkText={alertMessage.btnOkText}
        okClick={() => setAddshowModal(true)}
      />
    </>
  );
};

export default ReceiveItotoggle;
