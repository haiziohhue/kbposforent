import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useEffect, useState } from "react";

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
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { IIngredients } from "../../../../interfaces";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const CreateIngredient: React.FC<
  UseModalFormReturnType<IIngredients, HttpError, IIngredients>
> = ({
  saveButtonProps,
  control,
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
      PaperProps={{ sx: { width: "100%", height: "700px" } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Ajouter Ingredient</Typography>}
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

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <FormLabel required>Quantite</FormLabel>
                    <OutlinedInput
                      type="number"
                      id="quantite"
                      {...register("quantite", {
                        required: "This field is required",
                      })}
                    />
                    {errors.quantite && (
                      <FormHelperText error>
                        {errors.quantite.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel required>Cout</FormLabel>
                    <OutlinedInput
                      id="Cout"
                      {...register("cout", {
                        required: "This field is required",
                      })}
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">DA</InputAdornment>
                      }
                    />
                    {errors.cout && (
                      <FormHelperText error>
                        {errors.cout.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <FormLabel required>Source</FormLabel>
                    <OutlinedInput
                      type="text"
                      id="source"
                      {...register("source", {
                        required: "This field is required",
                      })}
                    />
                    {errors.source && (
                      <FormHelperText error>
                        {errors.source.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {/* date_expiration */}
                  <FormControl fullWidth>
                    <FormLabel>Date d'Expiration</FormLabel>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {/* <DatePicker
                            value={watch('date_naissance') }
                            format="DD-MM-YYYY"
                             onChange={(newValue) => setDate(newValue)}
                        
                       
                          /> */}
                      <Controller
                        name="date_expiration"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                              field.onChange(dayjs(newValue))
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                    {errors.date_expiration && (
                      <FormHelperText error>
                        {errors.date_expiration.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                {/* Note */}
                <FormControl>
                  <FormLabel>Note</FormLabel>
                  <OutlinedInput
                    id="note"
                    {...register("note")}
                    multiline
                    minRows={5}
                    maxRows={5}
                  />
                  {errors.note && (
                    <FormHelperText error>{errors.note.message}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton {...saveButtonProps} />
          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
