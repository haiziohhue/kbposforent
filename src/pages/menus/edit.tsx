import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useState } from "react";
import { ICategory, IMenu } from "../../interfaces";
import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { API_URL } from "../../constants";
import axios from "axios";
import { CloseOutlined } from "@mui/icons-material";

export const EditMenu: React.FC<
  UseModalFormReturnType<IMenu, HttpError, IMenu>
> = ({
  saveButtonProps,
  control,
  setValue,
  modal: { visible, close },
  register,
  refineCore: { onFinish },
  handleSubmit,
  setError,
  formState: { errors },
}) => {
  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setIsUploadLoading(true);

      const formData = new FormData();

      const target = event.target;
      const file: File = (target.files as FileList)[0];

      formData.append("files", file);

      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        // },
      });

      setImageURL(`${API_URL}${res.data[0].url}`);
      setValue("image", res.data[0].id, { shouldValidate: true });

      setIsUploadLoading(false);
    } catch (error) {
      setError("image", { message: "Upload failed. Please try again." });
      setIsUploadLoading(false);
    }
  };
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Ajouter Menu</Typography>}
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
              <FormControl sx={{ width: "100%" }}>
                <FormLabel required>Image</FormLabel>
                <Stack
                  display="flex"
                  alignItems="center"
                  border="1px dashed  "
                  borderColor="primary.main"
                  borderRadius="5px"
                  padding="10px"
                  marginTop="5px"
                >
                  <label htmlFor="images-input">
                    <Input
                      id="images-input"
                      type="file"
                      sx={{
                        display: "none",
                      }}
                      onChange={onChangeHandler}
                    />
                    <input
                      id="file"
                      {...register("image", {
                        required: "This field is required",
                      })}
                      type="hidden"
                    />
                    {/* <LoadingButton
                    loading={isUploadLoading}
                    loadingPosition="end"
                    endIcon={<FileUpload />}
                    variant="contained"
                    component="span"
                  >
                    Upload
                  </LoadingButton> */}

                    <Avatar
                      sx={{
                        cursor: "pointer",
                        width: {
                          xs: 100,
                          md: 180,
                        },
                        height: {
                          xs: 100,
                          md: 180,
                        },
                      }}
                      src={imageURL}
                      alt="Menu Image"
                    />
                  </label>
                  <Typography
                    variant="body2"
                    style={{
                      fontWeight: 800,
                      marginTop: "8px",
                    }}
                  >
                    Ajouter une Image
                  </Typography>
                  {/* <Typography style={{ fontSize: "12px" }}>
                    must be 1080x1080 px
                  </Typography> */}
                </Stack>
                {errors.image && (
                  <FormHelperText error>{errors.image.message}</FormHelperText>
                )}
              </FormControl>
              <Stack gap="10px" marginTop="10px">
                <FormControl>
                  <FormLabel required>Nom</FormLabel>
                  <OutlinedInput
                    id="titre"
                    {...register("titre", {
                      required: "This field is required",
                    })}
                    style={{ height: "40px" }}
                  />
                  {errors.titre && (
                    <FormHelperText error>
                      {errors.titre.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <OutlinedInput
                    id="description"
                    {...register("description")}
                    multiline
                    minRows={5}
                    maxRows={5}
                  />
                  {errors.description && (
                    <FormHelperText error>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Prix</FormLabel>
                  <OutlinedInput
                    id="prix"
                    {...register("prix", {
                      required: "This field is required",
                    })}
                    type="number"
                    style={{
                      width: "150px",
                      height: "40px",
                    }}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                  {errors.prix && (
                    <FormHelperText error>{errors.prix.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Categorie</FormLabel>
                  <Controller
                    control={control}
                    name="categorie"
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
                            error={!!errors.categorie?.message}
                            required
                          />
                        )}
                      />
                    )}
                  />
                  {errors.categorie && (
                    <FormHelperText error>
                      {errors.categorie.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel sx={{ marginTop: "10px" }} required>
                    Active
                  </FormLabel>
                  <Controller
                    control={control}
                    {...register("active")}
                    // defaultValue={true}
                    render={({ field }) => (
                      <RadioGroup
                        id="active"
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value === "true";

                          setValue("active", value, {
                            shouldValidate: true,
                          });

                          return value;
                        }}
                        row
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label={"Enable"}
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label={"Disable"}
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.active && (
                    <FormHelperText error>
                      {errors.active.message}
                    </FormHelperText>
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
