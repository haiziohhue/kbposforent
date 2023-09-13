import { CloseOutlined } from "@mui/icons-material";
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
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { ICategory, IChef } from "interfaces";
import React from "react";
import { Controller } from "react-hook-form";

export const CreateChef: React.FC<
  UseModalFormReturnType<IChef, HttpError, IChef>
> = ({
  saveButtonProps,
  control,
  modal: { visible, close },
  register,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
}) => {
  //
  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "600px" } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        breadcrumb={<div style={{ display: "none" }} />}
        title={<Typography fontSize={24}>Ajouter Chef</Typography>}
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
              <Stack gap="20px" marginTop="10px" marginBottom="200px">
                <FormControl>
                  <FormLabel required>Chef</FormLabel>
                  <OutlinedInput
                    id="chef"
                    {...register("chef", {
                      required: "This field is required",
                    })}
                  />
                  {errors.chef && (
                    <FormHelperText error>{errors.chef.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Categories</FormLabel>
                  <Controller
                    control={control}
                    name="categories"
                    rules={{
                      required: "This field is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        multiple
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value);
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
                            error={!!errors.categories?.message}
                            required
                          />
                        )}
                      />
                    )}
                  />
                  {errors.categories && (
                    <FormHelperText error>
                      {errors.categories.message}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Note */}
                {/* <FormControl>
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
                </FormControl> */}
              </Stack>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
