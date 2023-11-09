import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useEffect, useState } from "react";

import { HttpError, useGetIdentity, useList } from "@refinedev/core";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  List,
  ListItemText,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { ICaisse, ICatDepense, ITresor, IUser } from "../../interfaces";

export const CreateDepense: React.FC<
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
  const [selectedCaisse, setSelectedCaisse] = useState<ICaisse | undefined>(
    undefined
  );
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
  const { data: caisses, isLoading } = useList<ICaisse>({
    resource: "caisses",
  });

  //
  const handleListItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    caisseId: ICaisse
  ) => {
    setSelectedCaisse(caisseId);
  };

  //
  useEffect(() => {
    const caisseId = localStorage.getItem("selectedCaisseId");
    if (caisseId) {
      const parsedCaisseId = parseInt(caisseId, 10);
      const foundCaisse = caisses?.data?.find(
        (caisse) => caisse?.id === parsedCaisseId
      );
      setSelectedCaisse(foundCaisse || undefined);
    } else {
      setSelectedCaisse(undefined);
    }
  }, [caisses?.data]);
  //
  useEffect(() => {
    setValue("type", "Dépense");
    setValue(
      "user",
      users?.data.find((user: IUser) => user.id === userId)
    );
    setValue("caisse", selectedCaisse);
  }, [selectedCaisse, setValue, userId, users?.data]);
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "800px" } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Ajouter Dépense</Typography>}
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
                <Stack>
                  {/* Caisse */}
                  {user?.role?.name === "Caissier" ? (
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "30px",
                        marginX: 20,
                      }}
                      disabled={isLoading}
                    >
                      {selectedCaisse?.nom}
                      <input
                        type="hidden"
                        {...register("caisse")}
                        // value={caisse}
                      />
                    </Button>
                  ) : (
                    <List
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {caisses?.data?.map((caisse: ICaisse) => (
                        <Button
                          key={caisse.id}
                          onClick={(
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ) => handleListItemClick(event, caisse)}
                          variant={
                            selectedCaisse?.id === caisse?.id
                              ? "contained"
                              : "outlined"
                          }
                          sx={{
                            borderRadius: "30px",
                          }}
                          disabled={isLoading}
                        >
                          <ListItemText primary={caisse?.nom} />
                          <input
                            type="hidden"
                            {...register("caisse")}
                            // value={caisse}
                          />
                        </Button>
                      ))}
                    </List>
                  )}
                </Stack>
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
                  <FormLabel>Bénéficiaire</FormLabel>
                  <Controller
                    control={control}
                    name="beneficier"
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
                          <TextField {...params} variant="outlined" />
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
          <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
        </DialogActions>
      </Create>
    </Dialog>
  );
};
