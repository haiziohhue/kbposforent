import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useReducer, useState } from "react";

import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
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
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";

import axios from "axios";

import { CloseOutlined } from "@mui/icons-material";
import { ICategory, IMenu } from "interfaces";

type Option = "Dessert" | "Pizza";
type Menu = {
  option: Option;
  name: string;
  description: string;
};

type State = {
  menu: Menu;
};

const initialState: State = {
  menu: {
    option: "Dessert",
    name: "",
    description: "",
  },
};

type Action =
  | { type: "SET_OPTION"; payload: Option }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        menu: { ...state.menu, option: action.payload },
      };
    case "SET_NAME":
      return {
        ...state,
        menu: { ...state.menu, name: action.payload },
      };
    case "SET_DESCRIPTION":
      return {
        ...state,
        menu: { ...state.menu, description: action.payload },
      };
    default:
      return state;
  }
};
export const CreateMenuCompose: React.FC<
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
  const [{ menu }, dispatch] = useReducer(reducer, initialState);
  const options: Option[] = ["Dessert", "Pizza"];
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        breadcrumb={<div style={{ display: "none" }} />}
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
              <Stack gap="10px" marginTop="10px">
                <Autocomplete
                  id="menuOption"
                  options={options}
                  value={menu.option}
                  onChange={(event, value) =>
                    dispatch({ type: "SET_OPTION", payload: value as Option })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose an Option"
                      variant="outlined"
                    />
                  )}
                />
                {menu.option === "Dessert" && (
                  <>
                    <TextField
                      label="Dessert Name"
                      variant="outlined"
                      value={menu.name}
                      onChange={(e) =>
                        dispatch({ type: "SET_NAME", payload: e.target.value })
                      }
                    />
                    <TextField
                      label="Dessert Description"
                      variant="outlined"
                      value={menu.description}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_DESCRIPTION",
                          payload: e.target.value,
                        })
                      }
                    />
                  </>
                )}
                {menu.option === "Pizza" && (
                  <>
                    <TextField
                      label="Pizza Name"
                      variant="outlined"
                      value={menu.name}
                      onChange={(e) =>
                        dispatch({ type: "SET_NAME", payload: e.target.value })
                      }
                    />
                    <TextField
                      label="Pizza Description"
                      variant="outlined"
                      value={menu.description}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_DESCRIPTION",
                          payload: e.target.value,
                        })
                      }
                    />
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => console.log(menu)}
                >
                  Create Menu
                </Button>
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
