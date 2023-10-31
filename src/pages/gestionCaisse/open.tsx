import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React from "react";

import { HttpError, useGetIdentity, useSelect } from "@refinedev/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ICaisse, ICaisseLogs, IUser } from "../../interfaces";
import { API_URL, TOKEN_KEY } from "../../constants";
import axios from "axios";

export const OpenCaisse: React.FC<
  UseModalFormReturnType<ICaisseLogs, HttpError, ICaisseLogs>
> = ({ saveButtonProps, modal: { visible, close }, formState: { errors } }) => {
  // Get Caisses
  const { options } = useSelect<ICaisse>({
    resource: "caisses",
    optionLabel: "nom",
  });
  //
  const { data: user } = useGetIdentity<IUser>();
  //
  const [caisseId, setCaisseId] = React.useState<string>("");
  const [errorr, setErrorr] = React.useState<string | null>(null);
  const handleChange = (event: SelectChangeEvent<typeof caisseId>) => {
    const {
      target: { value },
    } = event;
    setCaisseId(value);
  };
  //
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  //
  const [showPassword, setshowPassword] = React.useState<boolean>(false);
  const handleClickShowPassword = () => setshowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  //

  const [formData, setFormData] = React.useState({
    password: "",
    solde_ouverture: null,
  });
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // solde_overture: prevData.solde_overture,
    }));
  };
  //
  const onFinishHandler = async () => {
    const payload = {
      // data: formData,
      caisse: caisseId,
      password: formData.password,
      solde_ouverture: formData.solde_ouverture,
      solde_cloture: formData.solde_ouverture,
      etat: "Ouverte",
    };
    console.log(payload);
    try {
      const response = await axios.post(
        `${API_URL}/api/logs-caisses/ouverture`,
        {
          data: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
      console.log("Request succeeded:", response.status);
      close();
      localStorage.setItem("selectedCaisseId", String(caisseId));
      localStorage.setItem("selectedCaisseEtat", "Ouverte");
    } catch (error: any) {
      console.error("Request failed:", error);
      console.log(error);
      if (error?.response) {
        setErrorr(error.response.data.error.message);
      }
    }
  };

  //

  //
  return (
    <Dialog
      open={visible}
      PaperProps={{
        sx: { width: "100%", height: "750px", maxWidth: "1200px" },
      }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        breadcrumb={<div style={{ display: "none" }} />}
        headerProps={{
          action: null,
          sx: {
            display: "none",
          },
        }}
        footerButtonProps={{
          sx: {
            display: "none",
          },
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column" }}
          paddingX={12}
          margin={6}
          gap={4}
        >
          <DialogContent>
            <DialogTitle>
              <Typography
                fontSize={24}
                textAlign="center"
                padding={2}
                marginBottom={3}
              >
                Ouverture de Caisse
              </Typography>
            </DialogTitle>
            <Stack gap={4}>
              <FormControl>
                <InputLabel id="caisse">Caisse</InputLabel>
                <Select
                  value={caisseId}
                  onChange={handleChange}
                  input={<OutlinedInput label="Caisse" />}
                  MenuProps={MenuProps}
                >
                  {options?.map((option) => (
                    <MenuItem key={option?.value} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Password */}
              <FormControl
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
                  autoComplete="current-password"
                  placeholder="Mot de Passe"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
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
              </FormControl>
            </Stack>
            <Stack gap={4}>
              <Typography
                fontSize={24}
                textAlign="center"
                padding={2}
                marginTop={2}
              >
                Indiquez le montant disponible en caisse
              </Typography>
              <FormControl>
                <InputLabel id="solde_overture">Solde d'ouverture</InputLabel>
                <OutlinedInput
                  id="solde_ouverture"
                  type="number"
                  name="solde_ouverture"
                  label="Solde d'ouverture"
                  value={formData.solde_ouverture} // Use formData for the value
                  onChange={handleFormChange}
                  startAdornment={
                    <InputAdornment position="start">DZD</InputAdornment>
                  }
                />
                {errors.solde_ouverture && (
                  <FormHelperText error>
                    {errors.solde_ouverture.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            {errorr && (
              <Typography color="error" variant="h6" sx={{ margin: 2 }}>
                {errorr}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
            <Button
              {...saveButtonProps}
              variant="contained"
              onClick={() => {
                onFinishHandler();
              }}
              sx={{ fontWeight: 500, paddingX: "26px", paddingY: "4px" }}
            >
              Confirmer
            </Button>
            {user?.role?.name === "Admin" && (
              <Button variant="outlined" onClick={() => close()}>
                Annuler
              </Button>
            )}
          </DialogActions>
        </Box>
      </Create>
    </Dialog>
  );
};
