"use client"
import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Button, TextField, Typography, Grid, Container,
    Dialog, DialogTitle, DialogContent, DialogActions, Fab
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  unmountPOAction, clearPOAction, poQuantityAction, receivePOAction, uploadPOAction, poStatusAndItemCountAction
} from '../purchase_order/action';
import POQuantityModal from '../../../components/po-quantity-modal';
import {AppAlert} from '../../../components/app-alert';
import AppHeader from '../../../components/app-header';

const ReceivePO: React.FC = () => {
    const [searchData, setSearchData] = useState({ searchPOId: '', supplierSku: '', modal: {} });
    const [comment, setComment] = useState('');
    const [qtyReceived, setQtyReceived] = useState<string | number>('');
    const [qtyReceivedAlready, setQtyReceivedAlready] = useState<string | number>('');
    const [showModal, setShowModal] = useState(false);
    const [qtyOrdered, setQtyOrdered] = useState<string | number | false>(false);
    const [itemDescription, setItemDescription] = useState<string | false>(false);
    const [poList, setPOList] = useState<any[]>([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [enableUpload, setEnableUpload] = useState(false);
    const [itemCount, setItemCount] = useState<string | number>('');
    const [poSearchEnable, setPOSearchEnable] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();
    const poQuantity = useSelector((state: RootState) => state.purchaseOrder.poQuantity);

    useEffect(() => {
        setPOList(JSON.parse(localStorage.getItem('poList') || '[]'));

        return () => {
            dispatch(unmountPOAction());
        };
    }, [dispatch]);

    const onFieldChange = (name: string, value: string) => {
        setSearchData({
            ...searchData,
            [name]: value
        });
    };

    const onSearchClick = () => {
        if (searchData.searchPOId && searchData.supplierSku) {
            dispatch(poQuantityAction(searchData))
                .then((data: any) => {
                    if (data && data[0]) {
                        setShowModal(true);
                        setQtyOrdered(data[0].QtyOrdered);
                        setItemDescription(data[0].description);
                        if (data[0].QtyReceived == -1)
                            setQtyReceived(data[0].QtyOrdered);
                        else
                            setQtyReceived(data[0].QtyOrdered - data[0].QtyReceived);
                        setQtyReceivedAlready(data[0].QtyReceived);
                        setComment(data[0].Comments);
                        setPOSearchEnable(false);
                    } else {
                        setAlertMessage("Data not found.");
                        setShowAlert(true);
                    }
                });
        } else {
            setAlertMessage("POID/SKU should not be empty.");
            setShowAlert(true);
        }
    };

    const receiveItems = (data: any) => {
        if (data.POID && data.SupplierSku && data.QuantityReceived) {
            dispatch(receivePOAction(data))
                .then((response: boolean) => {
                    response && clearData();
                    response || setAlertMessage("Updation failed.");
                    response || setShowAlert(true);
                    getPOStatusAndItemCount(data.POID);
                });
        } else {
            setAlertMessage("No item to receive.");
            setShowAlert(true);
        }
    };

    const getPOStatusAndItemCount = (poId: string) => {
        if (poId) {
            dispatch(poStatusAndItemCountAction(poId))
                .then((response: any) => {
                    if (response && response[0]) {
                        setEnableUpload(response[0].ReceiveStatus === 'READY' && response[0].POStatus === 'On-Order');
                        setItemCount(response[0].items_count);
                    } else {
                        setAlertMessage("Server Error.");
                        setShowAlert(true);
                    }

                    setTimeout(() => {
                        document.getElementsByName('supplierSku')[1].focus();
                    }, 500);
                });
        }
    };

    const onClearClick = () => {
        setPOList([]);
        clearData();
        dispatch(clearPOAction());
        setSearchData({ searchPOId: '', supplierSku: '' });
        setEnableUpload(false);
        setItemCount('');
        setPOSearchEnable(true);
        setShowConfirm(false);
        localStorage.setItem('poList', JSON.stringify([]));
    };

    const closeModal = () => {
        clearData();
    };

    const onDoneClick = () => {
        const _polist = poList.filter(value => value.poId !== searchData.searchPOId || value.supplierSku !== searchData.supplierSku);
        let _quantityReceived = parseInt(qtyReceivedAlready as string);

        if (_quantityReceived !== -1)
            _quantityReceived = parseInt(qtyReceived as string) + parseInt(qtyReceivedAlready as string || '0');
        else
            _quantityReceived = parseInt(qtyReceived as string);

        const _newList = [
            {
                poId: searchData.searchPOId,
                supplierSku: searchData.supplierSku,
                qtyReceived: _quantityReceived,
                qtyOrdered: qtyOrdered,
                itemDescription: itemDescription,
                comment: comment,
                status: parseInt(qtyOrdered as string) === _quantityReceived ? 'received-status' : 'variance-status'
            },
            ..._polist
        ];

        setPOList(_newList);

        receiveItems({
            POID: searchData.searchPOId,
            SupplierSku: searchData.supplierSku,
            QuantityReceived: qtyReceived,
            Comment: comment,
            Variance: parseInt(qtyOrdered as string) - parseInt(qtyReceived as string),
            ReceivedBy: localStorage.userName
        });

        localStorage.setItem('poList', JSON.stringify(_newList));
    };

    const clearData = () => {
        setShowModal(false);
        setQtyReceived("");
        setComment("");
        setQtyOrdered(false);
        setSearchData({ ...searchData, supplierSku: '' });
    };

    const poUploadClick = () => {
        if (searchData.searchPOId) {
            dispatch(uploadPOAction({ POID: searchData.searchPOId }))
                .then((response: any) => {
                    setAlertMessage(response ? response : "Updation failed.");
                    setShowAlert(true);
                });
        }
    };

    const poData = () => {
        return poList.length > 0 ? poList.map((value, index) => (
            <Card key={index}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography>POID: <strong>{value.poId}</strong></Typography>
                        </Grid>
                        {value.status && (
                            <Grid item xs={12} md={6}>
                                <Fab disabled className={'status-fab ' + value.status} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography>Product Id: <strong>{value.supplierSku}</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Product Description: <strong>{value.itemDescription}</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Qty Ordered: <strong>{value.qtyOrdered}</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Qty Received: <strong>{value.qtyReceived}</strong></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Comments: <strong>{value.comment}</strong></Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )) : <Card><CardContent>No record</CardContent></Card>;
    };

    return (
        <Container>
            <AppHeader headerText='Receive PO' redirectTo={router.push} reload={true} onReloadClick={() => setShowConfirm(true)} />
            <Card className='search-criteria'>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="PO Id"
                            variant="outlined"
                            fullWidth
                            name='searchPOId'
                            value={searchData.searchPOId}
                            disabled={!poSearchEnable}
                            onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="SKU"
                            variant="outlined"
                            fullWidth
                            name='supplierSku'
                            type="number"
                            value={searchData.supplierSku}
                            onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={6}>
                        <Button variant="contained" fullWidth onClick={onSearchClick}>Search</Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button variant="contained" fullWidth onClick={poUploadClick}>Upload</Button>
                    </Grid>
                </Grid>
            </Card>

            <Card className='search-result pallet-items'>
                <CardContent>
                    {itemCount && (
                        <Typography variant="h6" gutterBottom>
                            Items <strong>{poList.length}/{itemCount}</strong>
                        </Typography>
                    )}
                    {poData()}
                </CardContent>
            </Card>

            <POQuantityModal
                comment={comment}
                description={itemDescription}
                qtyReceived={qtyReceived}
                setComment={setComment}
                setQtyReceived={setQtyReceived}
                qtyOrdered={qtyOrdered}
                showModal={showModal}
                qtyReceivedAlready={qtyReceivedAlready}
                onDoneClick={onDoneClick}
                closeModal={closeModal}
            />

            <AppAlert
                showAlert={showAlert}
                headerText='Message'
                message={alertMessage}
                btnCancelText="OK"
                cancelClick={() => setShowAlert(false)}
            />

            <AppAlert
                showAlert={showConfirm}
                headerText='Confirm'
                message="Are you sure you want to clear?"
                btnCancelText="Cancel"
                btnOkText="Yes"
                okClick={onClearClick}
                cancelClick={() => setShowConfirm(false)}
            />
        </Container>
    );
};

export default ReceivePO;
