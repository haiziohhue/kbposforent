import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React from "react";
import InputMask from "react-input-mask";
import { HttpError } from "@refinedev/core";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, SaveButton } from "@refinedev/mui";
import { CloseOutlined } from "@mui/icons-material";
import { IGeneraleDta } from "../../../interfaces";

export const EditRestaurantData: React.FC<
  UseModalFormReturnType<IGeneraleDta, HttpError, IGeneraleDta>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
}) => {
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "600px" } }}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Modifier</Typography>}
        breadcrumb={<div style={{ display: "none" }} />}
        headerProps={{
          avatar: (
            <IconButton
              onClick={() => close()}
              sx={{
                width: "30px",
                height: "30px",
                mb: "5px",
              }}
            >
              <CloseOutlined />
            </IconButton>
          ),
          action: null,
        }}
        footerButtonProps={{
          sx: {
            display: "none",
          },
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <DialogContent>
          <Box
            component="form"
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <form onSubmit={handleSubmit(onFinish)}>
              <Stack gap="10px" marginTop="10px">
                <FormControl>
                  <FormLabel required>Nom</FormLabel>
                  <OutlinedInput
                    id="Nom"
                    {...register("nom", {
                      required: "This field is required",
                    })}
                  />
                  {errors.nom && (
                    <FormHelperText error>{errors.nom.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Adresse</FormLabel>
                  <OutlinedInput
                    id="Adresse"
                    {...register("adresse", {
                      required: "This field is required",
                    })}
                  />
                  {errors.adresse && (
                    <FormHelperText error>
                      {errors.adresse.message}
                    </FormHelperText>
                  )}
                </FormControl>
                {/* Phone */}
                <FormControl>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "text.primary",
                    }}
                  >
                    N° Telephone
                  </FormLabel>
                  <InputMask
                    mask="(999) 999 99 99"
                    disabled={false}
                    {...register("phone1")}
                  >
                    {/* @ts-expect-error False alarm */}
                    {(props: TextFieldProps) => (
                      <TextField
                        {...props}
                        size="small"
                        margin="none"
                        variant="outlined"
                      />
                    )}
                  </InputMask>
                  {errors.phone1 && (
                    <FormHelperText error>
                      {errors.phone1.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <SaveButton {...saveButtonProps} /> */}
          <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
        </DialogActions>
      </Edit>
    </Dialog>
  );
};
