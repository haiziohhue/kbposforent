import React from "react";

import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { HttpError } from "@refinedev/core";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { SaveButton } from "@refinedev/mui";
import { ICatDepense } from "../../../interfaces";

export const CreateCategoryDepense: React.FC<
  UseModalFormReturnType<ICatDepense, HttpError, ICatDepense>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  formState: { errors },
}) => {
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500, padding: 3 } }}
    >
      <DialogTitle>
        {" "}
        {<Typography fontSize={24}>Ajouter Categorie Depense </Typography>}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            id="nom"
            {...register("nom", {
              required: "This field is required",
            })}
            error={!!errors.nom}
            helperText={errors.nom?.message}
            margin="normal"
            fullWidth
            label="Nom"
            name="nom"
            InputProps={{
              inputProps: {
                style: { textTransform: "capitalize" },
                maxLength: 50,
                onChange: (event) => {
                  const target = event.target as HTMLInputElement;
                  target.value =
                    target.value.charAt(0).toUpperCase() +
                    target.value.slice(1);
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
      </DialogActions>
    </Dialog>
  );
};
