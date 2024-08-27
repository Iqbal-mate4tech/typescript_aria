"use client"
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Box, Card, CardContent, CardHeader, Button, TextField, Typography, Grid, IconButton, Fab, TextareaAutosize, Tooltip } from '@mui/material';
import { useRouter ,useParams} from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import  AppHeader  from '../../../components/app-header';
import {
    addUpdatePalletsMasterDataAction, addItemToListAction, unMountAddUpdateData,
    savePalletAction, palletItemsAction, updatePalletAction, receivedPalletItemsAction,
     updatePalletFormData, getItemDescriptionAction, getITODetailsAction
} from '../pallet/action';
import  PalletItemModal  from '../../../components/pallet-item-modal';
import { getUtcDateTime, hasPermission, isValidStatusToChange, getUserStore, 
  getVariance, setItemStatusColor } from '../../../shared/common';
import { AppAlert } from '../../../components/app-alert';
import  ReceiveItemModal  from '../../../components/receive-item-modal';
import  DirectToStore  from '../../../components/direct-to-store';
import  SingleSelect  from '../../../components/single-select'; // Ensure this import is included
import { webUrl } from '../../../shared/constants';

const AddUpdatePallet: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    console.log(id);
    console.log(typeof(id));

    const [formData, setFormData] = useState({ createdBy: useSelector(() => localStorage.getItem('userName')), modal: {} });
    const [itemDetailsToShowIndex, setItemDetailsToShowIndex] = useState<number | undefined>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<string>('');
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>();
    const [palletItemId, setPalletItemId] = useState<number>(0);
    const [showItemConfirm, setShowItemConfirm] = useState<boolean>(false);
    const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false);
    const [noOfPallet, setNoOfPallet] = useState<string>('');
    const [supplier, setSupplier] = useState<string>('');
    const [showDirectToStoreModal, setShowDirectToStoreModal] = useState<boolean>(false);
    const [conNumber, setConNumber] = useState<string>('');

    const palletStatus = useSelector((state: any) => state.pallet.palletStatus || []);
    const palletStore = useSelector((state: any) => state.pallet.palletStore || []);
    const palletCategory = useSelector((state: any) => state.pallet.palletCategory || []);
    const palletTypes = useSelector((state: any) => state.pallet.palletTypes || []);
    const palletBuilders = useSelector((state: any) => state.pallet.palletBuilders || []);
    const pallets = useSelector((state: any) => state.pallet.pallets || []);
    const palletItems = useSelector((state: any) => state.pallet.palletItems || []);
    const userStore = useSelector((state: any) => getUserStore());

    const setInitialData = () => {
        // const id = router.query.id;
        if (id && pallets && pallets[0]) {
            const palletToUpdate = pallets[0].find((x: any) => x.id === parseInt(id as string));
            if (palletToUpdate) {
                let _formData = {
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
                    modal: {}
                };
                setFormData(_formData);
                dispatch(palletItemsAction(id));
            }
        } else {
            dispatch(unMountAddUpdateData());
        }
    };

    useEffect(() => {
        dispatch(addUpdatePalletsMasterDataAction());
        setInitialData();

        return () => {
            dispatch(unMountAddUpdateData());
        };
    }, []);

    const onFieldChange = (name: string, value: any) => {
        setFormData({ ...formData, [name]: value });
    };

    const onDeletePalletItem = () => {
        let updatedPalletItems = palletItems.filter((item: any) => item.id !== palletItemId);
        dispatch(receivedPalletItemsAction(updatedPalletItems));
        setShowItemConfirm(false);
        setPalletItemId(0);
        setItemDetailsToShowIndex(undefined);
        setSelectedItemIndex(undefined);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Pallet Information', 20, 20);

        doc.setFontSize(14);
        const idText = `Pallet ID: ${formData.id || 'N/A'}`;
        const storeName = `Store Name: ${getStoreName(formData.store) || 'N/A'}`;
        doc.text(idText, 20, 40);
        doc.text(storeName, 20 + doc.getTextWidth(idText) + 10, 40);

        doc.setFontSize(12);
        let currentRow = 50;

        doc.text('Pallet Type:', 20, currentRow);
        doc.text(formData.palletType || 'N/A', 100, currentRow);
        currentRow += 8;

        doc.text('Weight:', 20, currentRow);
        doc.text(formData.weight || 'N/A', 100, currentRow);
        currentRow += 8;

        doc.text('Last Status Changed By:', 20, currentRow);
        doc.text(formData.last_status_changed_by || 'N/A', 100, currentRow);
        currentRow += 8;

        doc.text('Contents:', 20, currentRow);
        const contentLines = doc.splitTextToSize(formData.Contents || 'N/A', 180);
        doc.text(contentLines, 100, currentRow);
        currentRow += 8 * contentLines.length;

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
        const palletInfoData = [
            ["Pallet ID", formData.id || 'N/A'],
            ["Store Name", getStoreName(formData.store) || 'N/A'],
            ["Pallet Type", formData.palletType || 'N/A'],
            ["Weight", formData.weight || 'N/A'],
            ["Last Status Changed By", formData.last_status_changed_by || 'N/A'],
            ["Contents", formData.Contents || 'N/A'],
        ];

        const itemDetailsData = [
            ["Item ID", "ITO Number", "Barcode", "Description", "Quantity", "Inner", "Outer"],
            ...palletItems.map((item: any) => [item.id, item.ito, item.barcode, item.description, item.quantity, item.inner, item.outer])
        ];

        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.aoa_to_sheet(palletInfoData);
        const ws1cols = [{ wch: 20 }, { wch: 30 }];
        ws1['!cols'] = ws1cols;
        ws1['!rows'] = palletInfoData.map(() => ({ hpx: 20 }));
        XLSX.utils.book_append_sheet(wb, ws1, "Pallet Information");

        const ws2 = XLSX.utils.aoa_to_sheet(itemDetailsData);
        const ws2cols = itemDetailsData[0].map(() => ({ wch: 15 }));
        ws2['!cols'] = ws2cols;
        ws2['!rows'] = [{ hpx: 20 }, ...itemDetailsData.slice(1).map(() => ({ hpx: 16 }))];
        XLSX.utils.book_append_sheet(wb, ws2, "Item Details");

        XLSX.writeFile(wb, `pick_list_${formData.id || 'N/A'}.xlsx`);
    };

    const getStoreName = (storeId: number) => {
        const store = palletStore.find((store: any) => store.id === storeId);
        return store ? store.store_name : '';
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
            received_variance: getVariance(formData.modal.quantity, formData.modal.receivedCount),
        };

        if (itemData.id && itemData.id > 0) {
            const _palletItems = palletItems.map((element: any) => element.id === itemData.id ? itemData : element);
            dispatch(receivedPalletItemsAction(_palletItems));
        } else if (selectedItemIndex !== undefined) {
            const _palletItems = palletItems.map((element: any, elementIndex: number) => elementIndex === selectedItemIndex ? itemData : element);
            dispatch(receivedPalletItemsAction(_palletItems));
        } else {
            dispatch(addItemToListAction(itemData));
        }

        closeModal();
        setSelectedItemIndex(undefined);
        setFormData({ ...formData, modal: {} });
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ ...formData, modal: {} });
        setItemDetailsToShowIndex(undefined);
        setShowReceiveModal(false);
    };

    const onBarcodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value) {
            dispatch(getItemDescriptionAction(e.target.value)).then((response: any) => {
                if (response) {
                    onModalFieldChange('description', response.Short_Description);
                    onModalFieldChange('outer', response.Carton_Qty);
                    onModalFieldChange('inner', Math.round(response.custom3));
                }
            });
        }
    };

    const onITOBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value) {
            dispatch(getITODetailsAction(e.target.value)).then((response: any) => {
                if (response && response[0]) {
                    onModalFieldChange('description', response[0].description);
                }
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
                receivedBy: data.received_by
            }
        });
    };

    const onClickSave = () => {
        if (formData.id && formData.id > 0 && !isValidStatusToChange(formData.status, formData.currentStatus)) {
            setAlertMessage(`You cannot change status from "${formData.currentStatus}" to "${formData.status}"`);
            setShowAlert(true);
            return;
        }

        const palletData = {
            id: formData.id,
            store_id: formData.store,
            category: formData.category,
            pallet_type: formData.palletType,
            weight: formData.weight,
            status: formData.status,
            other_notes: formData.notes,
            contents: formData.Contents,
            last_status_changed_by: localStorage.getItem('userName'),
            last_status_changed_date: getUtcDateTime(),
            date_created: formData.id ? formData.date_created : getUtcDateTime(),
            palletItems: palletItems || undefined,
            supplier: formData.supplier || supplier,
            con_number: formData.con_number || conNumber
        };

        if (formData.status && formData.status.toLowerCase() === 'wrapped') {
            palletData.wrapped_by = localStorage.getItem('userName');
            palletData.wrapped_date = getUtcDateTime();
        }

        if (formData.status && formData.status.toLowerCase() === 'in depot') {
            palletData.in_depot_date = getUtcDateTime();
        } else {
            palletData.in_depot_date = formData.in_depot_date;
        }

        if (formData.status && formData.status.toLowerCase() === 'dispatched') {
            palletData.sent_date = getUtcDateTime();
        } else {
            palletData.sent_date = formData.sent_date;
        }

        if (formData.status && formData.status.toLowerCase() === 'received') {
            palletData.received_date = getUtcDateTime();
        }

        if (formData.id) {
            if (formData.status && formData.status.toLowerCase() === 'received') {
                const notReceivedItems = palletData.palletItems.filter((x: any) => x.received_count && x.received_count > 0 && x.received_variance && x.received_variance > 0);
                palletData.is_all_item_received = (notReceivedItems.length <= 0) ? 1 : 0;
            }

            dispatch(updatePalletAction(palletData)).then((response: any) => {
                setApiResponse(response);
                setAlertMessage(response ? "Updated successfully!!!" : "Updation failed!!!");
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
                .then((response) => {
                    setApiResponse(response);
                    setAlertMessage("Saved successfully!!!");
                    setShowAlert(true);
                    dispatch(updatePalletFormData({ callApi: true }));
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
                setAlertMessage(response ? "Saved successfully!!!" : "Saved failed!!!");
                setShowAlert(true);
                dispatch(updatePalletFormData({ callApi: true }));
            });
        }
    };

    const palletItemsData = () => {
        return palletItems && palletItems.length > 0 ? (
            palletItems.map((value: any, index: number) => (
                <Card key={index} onClick={() => setItemDetailsToShowIndex(index)} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Typography variant="h6">
                                    <strong>{value.id || 'New'}</strong>
                                </Typography>
                            </Grid>
                            {setItemStatusColor(value, formData.currentStatus) && (
                                <Grid item xs={2}>
                                    <Fab size="small" disabled className={`status-fab ${setItemStatusColor(value, formData.currentStatus)}`} />
                                </Grid>
                            )}
                            <Grid item xs={8}>
                                {hasPermission('DeletePalletItem') && (
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowItemConfirm(true);
                                                setAlertMessage("Are you sure to delete?");
                                                setPalletItemId(value.id);
                                                setSelectedItemIndex(index);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {hasPermission('UpdatePalletItem') && (
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedItemIndex(index);
                                                onItemEdit(value);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {hasPermission('ReceiveItem') && formData &&
                                    (formData.currentStatus === 'Dispatched' || formData.currentStatus === 'Received') && (
                                        <Tooltip title="Receive">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItemIndex(index);
                                                    onReceiveEdit(value);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                            </Grid>
                        </Grid>

                        {index === itemDetailsToShowIndex && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            ITO no. <strong>{value.ito}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Barcode <strong>{value.barcode}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Description <strong>{value.description}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Outer <strong>{value.outer}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Inner <strong>{value.inner}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Received <strong>{value.received_count}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Added by <strong>{value.added_by}</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))
        ) : (
            <Card sx={{ marginBottom: 2 }}>
                <CardContent>No record</CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ padding: 2 }}>
            <AppHeader headerText={formData.id ? `Update Pallet (${formData.id})` : 'Add Pallet'} />

            <Card sx={{ marginBottom: 2 }}>
                <CardHeader title={formData.id ? 'Update Pallet' : 'Add Pallet'} />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <SingleSelect
                                name="store"
                                label="Store"
                                value={formData.store}
                                options={palletStore}
                                optionValue="id"
                                optionName="store_name"
                                onChange={onFieldChange}
                                disabled={!!userStore}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SingleSelect
                                name="category"
                                label="Category"
                                value={formData.category}
                                options={palletCategory}
                                optionValue="category_name"
                                optionName="category_name"
                                onChange={onFieldChange}
                                disabled={!!userStore}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SingleSelect
                                name="palletType"
                                label="Pallet Type"
                                value={formData.palletType}
                                options={palletTypes}
                                optionValue="type"
                                optionName="type"
                                onChange={onFieldChange}
                                disabled={!!userStore}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Weight"
                                name="weight"
                                value={formData.weight || ''}
                                onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                                fullWidth
                                disabled={!!userStore}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SingleSelect
                                name="builtBy"
                                label="Built By"
                                value={formData.builtBy}
                                options={palletBuilders}
                                optionValue="builder_name"
                                optionName="builder_name"
                                onChange={onFieldChange}
                                disabled={!!userStore}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                Created By: <strong>{formData.createdBy}</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextareaAutosize
                                minRows={3}
                                placeholder="Contents"
                                name="Contents"
                                value={formData.Contents || ''}
                                onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                                style={{ width: '100%' }}
                                disabled={!!userStore}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextareaAutosize
                                minRows={3}
                                placeholder="Other Notes"
                                name="notes"
                                value={formData.notes || ''}
                                onChange={(e) => onFieldChange(e.target.name, e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>

                    {formData.id && (
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            <Grid item xs={12} md={4}>
                                <SingleSelect
                                    name="status"
                                    label="Status"
                                    value={formData.status}
                                    options={palletStatus}
                                    optionValue="status_name"
                                    optionName="status_name"
                                    onChange={onFieldChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">
                                    Last Status Changed By: <strong>{formData.last_status_changed_by}</strong>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1">
                                    Last Status Changed Date: <strong>{formData.last_status_changed_date}</strong>
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
                <CardContent>
                    <Grid container spacing={2}>
                        {hasPermission('AddPalletItem') && (
                            <Grid item xs={12} md={2}>
                                <Button variant="contained" color="primary" onClick={() => setShowModal(true)} startIcon={<AddIcon />}>
                                    Add Item
                                </Button>
                            </Grid>
                        )}

                        <Grid item xs={12} md={2}>
                            <Button variant="contained" color="primary" onClick={onClickSave}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button variant="contained" color="secondary" onClick={() => router.push(webUrl.pallet)}>
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button variant="contained" color="primary" onClick={generatePDF}>
                                Download as PDF
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button variant="contained" color="primary" onClick={generateExcel}>
                                Download as Excel
                            </Button>
                        </Grid>
                        {!formData.id && (
                            <Grid item xs={12} md={3}>
                                <Button variant="contained" color="primary" onClick={() => setShowDirectToStoreModal(true)}>
                                    Add Direct To Store
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
                <CardHeader title="Items" />
                <CardContent>
                    {palletItemsData()}
                </CardContent>
            </Card>

            <PalletItemModal
                modal={formData.modal}
                showModal={showModal}
                onBarcodeBlur={onBarcodeBlur}
                onModalFieldChange={(name, value) => setFormData({ ...formData, modal: { ...formData.modal, [name]: value } })}
                userName={localStorage.getItem('userName')}
                onDoneClick={onDoneClick}
                closeModal={closeModal}
            />
            <ReceiveItemModal
                modal={formData.modal}
                showModal={showReceiveModal}
                onModalFieldChange={(name, value) => setFormData({ ...formData, modal: { ...formData.modal, [name]: value } })}
                onDoneClick={onDoneClick}
                closeModal={closeModal}
            />
            <AppAlert
                showAlert={showAlert}
                headerText="Message"
                message={alertMessage}
                btnCancelText="OK"
                cancelClick={() => {
                    setShowAlert(false);
                    apiResponse && router.push(webUrl.pallet);
                }}
            />
            <AppAlert
                showAlert={showItemConfirm}
                headerText="Confirm"
                message={alertMessage}
                btnCancelText="Cancel"
                btnOkText="Yes"
                okClick={onDeletePalletItem}
                cancelClick={() => {
                    setShowItemConfirm(false);
                    setPalletItemId(0);
                }}
            />
            <DirectToStore
                showModal={showDirectToStoreModal}
                setNoOfPallet={setNoOfPallet}
                noOfPallet={noOfPallet}
                supplier={supplier}
                setSupplier={setSupplier}
                conNumber={conNumber}
                setConNumber={setConNumber}
                onDoneClick={onClickSave}
                closeModal={() => {
                    setShowDirectToStoreModal(false);
                    setNoOfPallet('');
                    setSupplier('');
                    setConNumber('');
                }}
            />
        </Box>
    );
};

export default AddUpdatePallet;
