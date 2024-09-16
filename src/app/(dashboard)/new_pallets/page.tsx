"use client";
import type { ClipboardEvent } from "react";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import {  useSelector } from "react-redux";


import AppHeader from "../../../components/app-header";
import {
  getITODescriptionAction,
  updateCartonQtyAction,
  palletsAction,
  unmountPalletsAction,
  palletsMasterDataAction,
  syncPriceStatusAction,
  updatePalletFormData,
  receivePOAction,
  getPODescriptionAction,
} from "./action";
import { useAppDispatch, type RootState } from "../../store";
import {AppAlert} from "../../../components/app-alert";

const PalletNew: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [toggle, setToggle] = useState<boolean>(false);
  const [ito, setIto] = useState<string | false>(false);

  const [alertMessage, setAlertMessage] = useState({
    show: false,
    msg: "",
    headerText: "",
    btnCancelText: "",
    btnOkText: "",
  });

  const [poid, setPoid] = useState<string | false>(false);
  const [screen, setScreen] = useState<number>(1);

  // Redux state selectors
  const barcodeScan = useSelector((state: RootState) => state.pallet.barcodeScan);
  const barcodeScanPo = useSelector((state: RootState) => state.pallet.barcodeScanPo);

  // Action dispatchers
  const handleUnmount = () => dispatch(unmountPalletsAction());

  const fetchPalletsData = () => {
    dispatch(palletsMasterDataAction());
    dispatch(palletsAction({ page: 1 }));
    dispatch(syncPriceStatusAction());
  };

  const handleFormUpdate = (data: any) => dispatch(updatePalletFormData(data));

  const handleKeyDown = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pasteValue = event.clipboardData.getData("Text");

    if (pasteValue) {
      if (screen === 3) {
        dispatch(getITODescriptionAction(pasteValue)).then((response) => {
          if (response) {
            setIto(pasteValue);
            setToggle(true);
            setScreen(2);
          } else {
            setAlertMessage({
              show: true,
              msg: `No ITO found with id=${pasteValue}`,
              headerText: "Error",
              btnCancelText: "Ok",
              btnOkText: "",
            });
          }
        });
      } else if (screen === 2) {
        const result = barcodeScan?.find((item) => item.SKU === pasteValue);

        if (result) {
          const cartonPicked = parseInt(result.CartonPicked || "0") + 1;

          const response_data = {
            CartonPicked: cartonPicked,
            ITOID: ito as string,
            SKU: pasteValue,
          };

          if (cartonPicked > result.TotalCarton) {
            setAlertMessage({
              show: true,
              msg: "Picked qty can't be greater than total carton qty",
              headerText: "Error",
              btnCancelText: "Ok",
              btnOkText: "",
            });
          } else {
            dispatch(updateCartonQtyAction(response_data)).then((response) => {
              if (response) {
                const resultIndex = barcodeScan.findIndex(
                  (item) => item.SKU === pasteValue
                );

                barcodeScan[resultIndex].CartonPicked = cartonPicked;
                document.getElementById(pasteValue)!.innerText = `${cartonPicked}`;
              }
            });
          }
        }
      } else if (screen === 4) {
        dispatch(getPODescriptionAction(pasteValue)).then((response) => {
          if (response) {
            setPoid(pasteValue);
            setToggle(true);
            setScreen(5);
          } else {
            setAlertMessage({
              show: true,
              msg: `No PO found with id=${pasteValue}`,
              headerText: "Error",
              btnCancelText: "Ok",
              btnOkText: "",
            });
          }
        });
      } else if (screen === 5) {
        const result = barcodeScanPo?.find(
          (item) => item.SupplierSku === pasteValue
        );

        if (result) {
          const qtyReceived = parseInt(result.QtyReceived || "0") + 1;

          const response_data = {
            qtyReceived,
            poId: poid as string,
            supplierSku: pasteValue,
          };

          dispatch(receivePOAction(response_data)).then((response) => {
            if (response) {
              const resultIndex = barcodeScanPo.findIndex(
                (item) => item.SupplierSku === pasteValue
              );

              barcodeScanPo[resultIndex].QtyReceived = qtyReceived;
              document.getElementById(pasteValue)!.innerText = `${qtyReceived}`;
            }
          });
        }
      }
    }
  };

  const renderBarcodeItems = () => {
    return barcodeScan?.map((value, index) => (
      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>{value.SKU}</strong>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">{value.QtyProposed}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <span id={value.SKU}>
                  {value.CartonPicked != null ? value.CartonPicked : 0}
                </span>
                /{value.TotalCarton}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ));
  };

  const renderBarcodePoItems = () => {
    return barcodeScanPo?.map((value, index) => (
      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1">
                <strong>{value.SupplierSku}</strong>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">{value.QtyOrdered}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                <span id={value.SupplierSku}>
                  {value.QtyReceived != null ? value.QtyReceived : 0}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ));
  };

  const renderScreen = () => {
    switch (screen) {
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setScreen(4)}
              >
                Scan PO
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setScreen(3)}
              >
                Scan ITO
              </Button>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardHeader
              title="ITO Items Receive List"
              action={<Button onClick={() => setScreen(3)}>Back</Button>}
            />
            <CardContent>{renderBarcodeItems()}</CardContent>
          </Card>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setScreen(1)}>
              Back
            </Button>
            <Typography variant="h4" align="center" sx={{ mt: 2 }}>
              Scan ITO
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setScreen(1)}>
              Back
            </Button>
            <Typography variant="h4" align="center" sx={{ mt: 2 }}>
              Scan PO
            </Typography>
          </Box>
        );
      case 5:
        return (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardHeader
              title="PO Items Receive List"
              action={<Button onClick={() => setScreen(4)}>Back</Button>}
            />
            <CardContent>{renderBarcodePoItems()}</CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box onPaste={handleKeyDown} sx={{ p: 2 }}>
      <AppHeader headerText="ADD ITEM IN PALLET" redirectTo={router.push} />
      {renderScreen()}
      <AppAlert
        showAlert={alertMessage.show}
        headerText={alertMessage.headerText || "Error"}
        message={alertMessage.msg}
        btnCancelText={alertMessage.btnCancelText || "Ok"}
        cancelClick={() => setAlertMessage({ show: false, msg: "" })}
        btnOkText={alertMessage.btnOkText}
        okClick={() => setToggle(true)}
      />
    </Box>
  );
};

export default PalletNew;
