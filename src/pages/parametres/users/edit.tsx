import React, { useState } from "react";
import axios from "axios";

import InputMask from "react-input-mask";
import {
  IResourceComponentsProps,
  useApiUrl,
  HttpError,
  useCustom,
} from "@refinedev/core";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import Input from "@mui/material/Input";
import type { TextFieldProps } from "@mui/material/TextField";
import { useStepsForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { ICaisse, IRole, IUser } from "../../../interfaces";
import { API_URL, TOKEN_KEY } from "../../../constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const EditUser: React.FC<IResourceComponentsProps> = () => {
  const stepTitles = ["Données Generales", "Données Professionnelles"];
  const apiUrl = useApiUrl();

  const {
    refineCore: { onFinish, formLoading, queryResult },
    control,

    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IUser, HttpError, IUser>({
    stepsProps: {
      isBackValidate: false,
    },
    warnWhenUnsavedChanges: true,
    refineCoreProps: { meta: { populate: "*" } },
  });

  // const imageInput = watch("photo");
  const [date, setDate] = React.useState<Date | null>(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const userData = queryResult?.data?.data;

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });

      setImageURL(`${API_URL}${res.data[0].url}`);
      setValue("photo", res.data[0].id, { shouldValidate: true });

      setIsUploadLoading(false);
    } catch (error) {
      setError("photo", { message: "Upload failed. Please try again." });
      setIsUploadLoading(false);
    }
  };
  //
  const handleChangePassword = async () => {
    if (password !== passwordConfirmation) {
      setError("passwordConfirmation", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword,
          password,
          passwordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );

      console.log("Password changed successfully", response.status);
    } catch (error) {
      console.error("Password change failed", error);
    }
  };
  //

  const { autocompleteProps: caissesAutocompleteProps } =
    useAutocomplete<ICaisse>({
      resource: "caisses",
    });

  //

  const { data } = useCustom<IRole[]>({
    url: `${apiUrl}/users-permissions/roles`,
    method: "get",
  });
  const roles = data?.data?.roles ?? [];

  //
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setshowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  //
  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid
              container
              sx={{
                marginX: { xs: "0px" },
              }}
            >
              <Grid item xs={12} md={4}>
                <Stack gap={1} justifyContent="center" alignItems="center">
                  <label htmlFor="avatar-input">
                    <Input
                      name="photo"
                      id="avatar-input"
                      type="file"
                      sx={{
                        display: "none",
                      }}
                      onChange={onChangeHandler}
                    />
                    <input id="file" {...register("photo")} type="hidden" />
                    <Avatar
                      sx={{
                        cursor: "pointer",
                        width: {
                          xs: "120px",
                          md: "160px",
                          lg: "200px",
                        },
                        height: {
                          xs: "120px",
                          md: "160px",
                          lg: "200px",
                        },
                      }}
                      src={
                        imageURL
                          ? imageURL
                          : `${API_URL}${userData?.photo?.url}`
                      }
                      alt="User Picture"
                    />
                  </label>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Ajouter une photo d'utilisateur
                  </Typography>
                  {/* <Typography sx={{ fontSize: '12px' }}>
                    
                  </Typography> */}
                  {isUploadLoading && <CircularProgress />}
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container>
                  <Grid item paddingX={4} xs={12} md={6}>
                    <Stack gap="24px">
                      {/* Nom */}
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: "8px",
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "text.primary",
                          }}
                        >
                          Nom
                        </FormLabel>
                        <TextField
                          {...register("nom", {
                            required: "This field is required",
                          })}
                          size="small"
                          margin="none"
                          variant="outlined"
                        />
                        {errors.nom && (
                          <FormHelperText error>
                            {errors.nom.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      {/* Prenom */}
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: "8px",
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "text.primary",
                          }}
                        >
                          Prenom
                        </FormLabel>
                        <TextField
                          {...register("prenom", {
                            required: "This field is required",
                          })}
                          size="small"
                          margin="none"
                          variant="outlined"
                        />
                        {errors.prenom && (
                          <FormHelperText error>
                            {errors.prenom.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item paddingX={4} xs={12} md={6}>
                    <Stack gap="24px">
                      {/* date_naissance */}
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: "8px",
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "text.primary",
                          }}
                        >
                          Date de Naissance
                        </FormLabel>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {/* <DatePicker
                            value={watch('date_naissance') }
                            format="DD-MM-YYYY"
                             onChange={(newValue) => setDate(newValue)}
                        
                       
                          /> */}
                          <Controller
                            name="date_naissance"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                selectedSections={undefined}
                                onSelectedSectionsChange={undefined}
                                {...field}
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(newValue) =>
                                  field.onChange(dayjs(newValue))
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                        {errors.date_naissance && (
                          <FormHelperText error>
                            {errors.date_naissance.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      {/* Phone */}
                      <FormControl>
                        <FormLabel
                          required
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
                          mask="999 999 99 99"
                          disabled={false}
                          {...register("phone", {
                            required: "This field is required",
                          })}
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
                        {errors.phone && (
                          <FormHelperText error>
                            {errors.phone.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid
                  item
                  paddingX={4}
                  paddingY={4}
                  xs={12}
                  md={12}
                  justifyContent="flex-end"
                >
                  {/* Address */}
                  <FormControl fullWidth>
                    <FormLabel
                      required
                      sx={{
                        marginBottom: "8px",
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "text.primary",
                      }}
                    >
                      Address
                    </FormLabel>
                    <TextField
                      {...register("adresse", {
                        required: "This field is required",
                      })}
                      margin="none"
                      variant="outlined"
                      // multiline
                      minRows={5}
                      required
                      fullWidth
                    />
                    {errors.adresse && (
                      <FormHelperText error>
                        {errors.adresse.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid container item xs={12} md={12} gap={5}>
                <Grid item xs={8} md={6}>
                  {/* Email */}
                  <FormControl fullWidth>
                    <FormLabel
                      required
                      sx={{
                        marginBottom: "8px",
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "text.primary",
                      }}
                    >
                      Email
                    </FormLabel>
                    <TextField
                      {...register("email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message:
                            "Ce champ doit être une adresse e-mail valide",
                        },
                      })}
                      size="small"
                      margin="none"
                      variant="outlined"
                    />
                    {errors.email && (
                      <FormHelperText error>
                        {errors.email.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={4} md={5}>
                  {/* Role */}
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <FormLabel
                      required
                      sx={{
                        marginBottom: "8px",
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "text.primary",
                      }}
                    >
                      Role
                    </FormLabel>
                    <Controller
                      control={control}
                      name="role"
                      rules={{
                        required: "This field is required",
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          size="small"
                          {...field}
                          options={roles
                            .filter(
                              (role: IRole) =>
                                role?.id === 3 ||
                                role?.id === 4 ||
                                role?.id === 5
                            )
                            .map((r: IRole) => ({ ...r }))}
                          onChange={(_, value) => {
                            field.onChange(value?.id);
                          }}
                          value={roles.filter(
                            (role: IRole) =>
                              role?.id === 3 || role?.id === 4 || role?.id === 5
                          )}
                          // options={[
                          //   { label: "Admin", id: 4 },
                          //   { label: "Caissier", id: 3 },
                          // ]}

                          getOptionLabel={(option) => {
                            return option?.name ? option?.name : "";
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          // isOptionEqualToValue={(option, value) =>
                          //   value === undefined ||
                          //   option?.id?.toString() ===
                          //     (value?.id ?? value)?.toString()
                          // }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              error={!!errors.role?.message}
                              required
                            />
                          )}
                        />
                      )}
                    />
                    {errors.role && (
                      <FormHelperText error>
                        {errors.role.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={4} md={6}>
                {/* UserName */}
                <FormControl fullWidth>
                  <FormLabel
                    required
                    sx={{
                      marginBottom: "8px",
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "text.primary",
                    }}
                  >
                    Username
                  </FormLabel>
                  <TextField
                    {...register("username", {
                      required: "This field is required",
                    })}
                    size="small"
                    margin="none"
                    variant="outlined"
                  />
                  {errors.username && (
                    <FormHelperText error>
                      {errors.username.message}
                    </FormHelperText>
                  )}
                  <Typography
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    min. 3 caractères
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Divider
              sx={{
                marginY: 3,
              }}
            />
            <Box
              sx={{
                marginY: 3,
              }}
            >
              {isChangingPassword ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Typography color="primary">
                    Modifier Mot de passe ( min. 6 caractères )
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        id=""
                        placeholder="Mot de passe actuel"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <OutlinedInput
                        placeholder="Nouveau Mot de passe"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <Typography
                      sx={{
                        fontSize: "12px",
                      }}
                    ></Typography>
                    <FormControl fullWidth>
                      <OutlinedInput
                        placeholder="Confirmez le Mot de passe"
                        type={showPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
                        error={!!errors.passwordConfirmation}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />

                      {errors.passwordConfirmation && (
                        <FormHelperText error>
                          {errors.passwordConfirmation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      sx={{ width: "300px", px: 4 }}
                    >
                      Confirmer
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button onClick={() => setIsChangingPassword(true)}>
                  Modifier Mot de passe
                </Button>
              )}
            </Box>
            <Divider
              sx={{
                marginY: 3,
              }}
            />
          </>
        );
    }
  };

  return (
    <Edit
      isLoading={formLoading}
      title={<Typography fontSize={24}>Modifier Utilisateur</Typography>}
      footerButtons={
        <>
          {currentStep > 0 && (
            <Button
              onClick={() => {
                gotoStep(currentStep - 1);
              }}
            >
              Précédent
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && (
            <Button onClick={() => gotoStep(currentStep + 1)}>Suivant</Button>
          )}
          {currentStep === stepTitles.length - 1 && (
            <SaveButton onClick={handleSubmit(onFinish)}>
              Enregistrer
            </SaveButton>
          )}
        </>
      }
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        autoComplete="off"
      >
        <Stepper nonLinear activeStep={currentStep}>
          {stepTitles.map((label, index) => (
            <Step
              key={label}
              sx={{
                "& .MuiStepLabel-label": {
                  fontSize: "18px",
                  lineHeight: "32px",
                },
              }}
            >
              <StepButton onClick={() => gotoStep(index)}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {renderFormByStep(currentStep)}
      </Box>
    </Edit>
  );
};
