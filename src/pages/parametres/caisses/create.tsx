import React from "react";
import { ICaisse } from "interfaces";
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
// import { Visibility, VisibilityOff } from "@mui/icons-material";

export const CreateCaisse: React.FC<
  UseModalFormReturnType<ICaisse, HttpError, ICaisse>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  formState: { errors },
}) => {
  //
  // const [showPassword, setshowPassword] = React.useState<boolean>(false);
  // const handleClickShowPassword = () => setshowPassword((show) => !show);
  // const handleMouseDownPassword = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  // };
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500, padding: 3 } }}
    >
      <DialogTitle>
        {<Typography fontSize={24}>Ajouter Caisse</Typography>}
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
            label="Caisse"
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
          {/* Password */}
          {/* <FormControl
            variant="outlined"
            sx={{
              mb: 0,
            }}
            fullWidth
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Mot de Passe
            </InputLabel>
            <OutlinedInput
              {...register("password", {
                required: true,
              })}
              autoComplete="current-password"
              placeholder="●●●●●●●●"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mot de Passe"
            />
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              min. 6 caractères
            </Typography>
          </FormControl> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
      </DialogActions>
    </Dialog>
  );
};
