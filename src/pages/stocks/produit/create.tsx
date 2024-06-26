import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React from "react";

import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { CloseOutlined } from "@mui/icons-material";
import { IIngredients, IUnite } from "../../../interfaces";
import { Controller } from "react-hook-form";

export const CreateIngredient: React.FC<
  UseModalFormReturnType<IIngredients, HttpError, IIngredients>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  control,
  formState: { errors },
}) => {
  const { autocompleteProps } = useAutocomplete<IUnite>({
    resource: "unites",
  });

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "700px" } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        title={
          <Typography fontSize={24}>Ajouter Ingredient / Article</Typography>
        }
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
            <Stack gap="10px" marginTop="10px">
              <FormControl>
                <FormLabel required>Nom d'Ingredient / Article</FormLabel>
                <TextField
                  id="nom"
                  {...register("nom", {
                    required: "This field is required",
                  })}
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                  margin="normal"
                  fullWidth
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
                {errors.nom && (
                  <FormHelperText error>{errors.nom.message}</FormHelperText>
                )}
              </FormControl>

              {/* Unitées de mesure */}
              {/* <FormControl>
                <FormLabel>Unité de mesure</FormLabel>
                <TextField
                  id="unite"
                  {...register("unite")}
                  margin="normal"
                  fullWidth
                  name="unite"
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
                {errors.unite && (
                  <FormHelperText error>{errors.unite.message}</FormHelperText>
                )}
              </FormControl> */}
              <FormControl>
                <FormLabel required>Unité de mesure</FormLabel>
                <Controller
                  control={control}
                  name="unite"
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      {...autocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value?.id);
                      }}
                      getOptionLabel={(item) => {
                        return item.unite ? item.unite : "";
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.id?.toString() ===
                          (value?.id ?? value)?.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          error={!!errors.unite?.message}
                          required
                        />
                      )}
                    />
                  )}
                />
                {errors.unite && (
                  <FormHelperText error>{errors.unite.message}</FormHelperText>
                )}
              </FormControl>
              {/* Note */}
              <FormControl>
                <FormLabel>Note</FormLabel>
                <TextField
                  id="note"
                  {...register("description")}
                  multiline
                  minRows={5}
                  maxRows={5}
                  margin="normal"
                  fullWidth
                  name="description"
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
                {errors.description && (
                  <FormHelperText error>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
        </DialogActions>
      </Create>
    </Dialog>
  );
};
