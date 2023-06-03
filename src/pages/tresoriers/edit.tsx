import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useEffect, useState } from "react";

import { HttpError, useGetIdentity, useList } from "@refinedev/core";
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
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {  Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { ICatDepense, ITresor, IUser } from "../../interfaces";

export const EditDepense: React.FC<
  UseModalFormReturnType<ITresor, HttpError, ITresor>
> = ({
  saveButtonProps,
  control,
  modal: { visible, close },
  register,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
  setValue,
}) => {
  const { autocompleteProps: userAutocompleteProps } = useAutocomplete<IUser>({
    resource: "users",
  });
  const { autocompleteProps: catDepenseAutocompleteProps } =
    useAutocomplete<ICatDepense>({
      resource: "categorie-depenses",
    });

  //
  const { data: user } = useGetIdentity<IUser>();
  const { data: users } = useList<IUser>({
    resource: "users",
  });
  //
  const userId = user && user?.id;
  //
  //
  useEffect(() => {
    setValue("type", "Dépense");
    setValue(
      "user",
      users?.data.find((user: IUser) => user.id === userId)
    );
  }, [setValue, userId, users?.data]);
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "800px" } }}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Ajouter Dépense</Typography>}
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
                  <FormLabel required>Category</FormLabel>
                  <Controller
                    control={control}
                    name="categorie_depense"
                    rules={{
                      required: "This field is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...catDepenseAutocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value?.id);
                        }}
                        getOptionLabel={(item) => {
                          return item.nom ? item.nom : "";
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
                            error={!!errors.categorie_depense?.message}
                            required
                          />
                        )}
                      />
                    )}
                  />
                  {errors.categorie_depense && (
                    <FormHelperText error>
                      {errors.categorie_depense.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Objet</FormLabel>
                  <OutlinedInput
                    id="titre"
                    {...register("titre", {
                      required: "This field is required",
                    })}
                  />
                  {errors.titre && (
                    <FormHelperText error>
                      {errors.titre.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  {/* Montant */}
                  <FormControl fullWidth>
                    <FormLabel required>Mode de Paiment</FormLabel>
                    <Controller
                      control={control}
                      name="paiement"
                      rules={{
                        required: "This field is required",
                      }}
                      // defaultValue={'sur place'}
                      render={({ field }) => (
                        <Autocomplete
                          size="medium"
                          {...field}
                          onChange={(_, value) => {
                            field.onChange(value);
                          }}
                          options={["Chèque", "Espèce"]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              error={!!errors.type}
                              required
                            />
                          )}
                        />
                      )}
                    />
                    {errors.paiement && (
                      <FormHelperText error>
                        {errors.paiement.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel required>Montant</FormLabel>
                    <OutlinedInput
                      id="montant"
                      {...register("montant", {
                        required: "This field is required",
                      })}
                      type="number"
                      startAdornment={
                        <InputAdornment position="start">DA</InputAdornment>
                      }
                    />
                    {errors.montant && (
                      <FormHelperText error>
                        {errors.montant.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <FormControl>
                  <FormLabel required>Bénéficiaire</FormLabel>
                  <Controller
                    control={control}
                    name="beneficier"
                    rules={{
                      required: "This field is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...userAutocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value?.id);
                        }}
                        getOptionLabel={(item) => {
                          return item.nom ? item.nom : "";
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
                            error={!!errors.beneficier?.message}
                            required
                          />
                        )}
                      />
                    )}
                  />
                  {errors.beneficier && (
                    <FormHelperText error>
                      {errors.beneficier.message}
                    </FormHelperText>
                  )}
                </FormControl>
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
      </Edit>
    </Dialog>
  );
};
