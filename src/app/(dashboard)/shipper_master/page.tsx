"use client";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, Grid, IconButton, Typography, Box, Container, Tooltip, Snackbar, Alert } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";

import AppHeader from "@components/app-header";
import { useAppDispatch, type RootState } from "../../store"; // Adjust the import to match your store's file structure
import { addUpdateShipperAction, deleteShipperAction } from "../../action"; // Adjust these imports as needed
import { palletShipperAction } from "../pallet/action";
import { AppAlert } from "@components/app-alert";
import MasterModal from "@components/master-modal"; // Adjust the imports as needed
import useAuth from "@components/withAuth";


const ShipperMaster: React.FC = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();


  const shipper = useSelector((state: RootState) => state.pallet.palletShipper);

  const [id, setId] = useState<any>(undefined);
  const [name, setName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [flashMessage, setFlashMessage] = useState<string>("");
  const [flashSeverity, setFlashSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    // if (isAuthenticated) {
    dispatch(palletShipperAction());

    // }
  }, []);

  const onAddClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setId(undefined);
    setName("");
  };

  const onDoneClick = async () => {
    const request: any = { shipper_name: name };

    if (id) request.shipper_id = id;

    const response = await dispatch(addUpdateShipperAction(request));

    if (response) {
      closeModal();
      setId(undefined);
      setName('');
      dispatch(palletShipperAction());
      showFlashMessage("Record saved successfully!", "success");
    } else {
      setAlertMessage("Save failed.");
      setShowAlert(true);
    }
  };

  const onDeleteClick = async () => {
    const response = await dispatch(deleteShipperAction(id));

    if (response) {
      setShowConfirm(false);
      setId(undefined);
      setName('');
      dispatch(palletShipperAction());
      showFlashMessage("Record deleted successfully!", "success");
    } else {
      setAlertMessage("Deletion failed.");
      setShowAlert(true);
    }
  };

  const showFlashMessage = (message: string, severity: "success" | "error") => {
    setFlashMessage(message);
    setFlashSeverity(severity);
    setOpenSnackbar(true);
  };

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  const renderCards = () => {
    return shipper && Array.isArray(shipper) ? (
      shipper.map((value: any, index: number) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6">
                  Name:<strong> {value.shipper_name}</strong>
                </Typography>
                <Typography variant="body2">
                  ID: <strong>{value.shipper_id}</strong>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setShowModal(true);
                      setId(value.shipper_id);
                      setName(value.shipper_name);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setShowConfirm(true);
                      setAlertMessage("Are you sure to delete?");
                      setId(value.shipper_id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card>
        <CardContent>No records found</CardContent>
      </Card>
    );
  };



  return (
    <Container>
      <AppHeader
        headerText="Shipper Master"
        showAdd={true}
        onAddClick={onAddClick}
        redirectTo={(url: string) => router.push(url)}
      />
      <Box mt={2}>{renderCards()}</Box>
      <MasterModal
        name={name}
        setName={setName}
        id={id}
        showModal={showModal}
        onDoneClick={onDoneClick}
        closeModal={closeModal}
      />
      <AppAlert
        showAlert={showConfirm}
        headerText="Confirm"
        message={alertMessage}
        btnCancelText="Cancel"
        btnOkText="Yes"
        okClick={onDeleteClick}
        cancelClick={() => setShowConfirm(false)}
      />
      <AppAlert
        showAlert={showAlert}
        headerText="Message"
        message={alertMessage}
        btnCancelText="OK"
        cancelClick={() => setShowAlert(false)}
      />

      {/* Snackbar for Flash Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={flashSeverity} onClose={() => setOpenSnackbar(false)}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShipperMaster;
