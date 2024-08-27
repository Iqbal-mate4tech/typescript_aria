"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { IconButton, Card, CardContent, Typography, Grid, Tooltip, Box, Container, Snackbar, Alert } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import AppHeader from "@/components/app-header";
import MasterModal from "@/components/master-modal";
import {AppAlert} from "@/components/app-alert";
import { palletTypesAction } from "../pallet/action";
import { deletePalletTypeAction, addUpdatePalletTypeAction } from "../../action";
import useAuth from "@components/withAuth";

const PalletTypeMaster: React.FC = () => {
  const isAuthenticated = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const types = useSelector((state: RootState) => state.pallet.palletTypes);

  const [id, setId] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [flashMessage, setFlashMessage] = useState<string>("");
  const [flashSeverity, setFlashSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(palletTypesAction());
    }
  }, [isAuthenticated, dispatch]);

  const onAddClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setId(undefined);
    setName("");
  };

  const onDoneClick = async () => {
    const request = { type: name };
    if (id) request.id = id;

    const response = await dispatch(addUpdatePalletTypeAction(request));
    if (response) {
      closeModal();
      dispatch(palletTypesAction());
      showFlashMessage("Record saved successfully!", "success");
    } else {
      setAlertMessage("Save failed.");
      setShowAlert(true);
    }
  };

  const onDeleteClick = async () => {
    const response = await dispatch(deletePalletTypeAction(id));
    if (response) {
      setShowConfirm(false);
      dispatch(palletTypesAction());
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

  const renderCards = () => {
    return types && Array.isArray(types) ? (
      types.map((value: any, index: number) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6">{value.type}</Typography>
                <Typography variant="body2">ID: {value.id}</Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setShowModal(true);
                      setId(value.id);
                      setName(value.type);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setShowConfirm(true);
                      setAlertMessage("Are you sure to delete?");
                      setId(value.id);
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

  if (!isAuthenticated) return null; // Prevent rendering if not authenticated

  return (
    <Container>
      <AppHeader
        headerText="Pallet Type Master"
        showAdd={true}
        onAddClick={onAddClick}
        redirectTo={(url: string) => router.push(url)}
      />
      <Box mt={2}>
        {renderCards()}
      </Box>
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={flashSeverity} onClose={() => setOpenSnackbar(false)}>
          {flashMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PalletTypeMaster;
