import React, { useEffect, useReducer } from "react";
import { ICategory } from "interfaces";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { HttpError } from "@refinedev/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { SaveButton } from "@refinedev/mui";
import { TabContext, TabList, TabPanel } from "@mui/lab";

type Option = "Générale" | "Menu composé";
type Category = {
  nom: string;
  type: Option;
};
type State = {
  category: Category;
};

const initialState: State = {
  category: {
    type: "Générale",
    nom: "",
  },
};
type Action =
  | { type: "SET_OPTION"; payload: Option }
  | { type: "SET_NAME"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        category: { ...state.category, type: action.payload },
      };
    case "SET_NAME":
      return {
        ...state,
        category: { ...state.category, nom: action.payload },
      };

    default:
      return state;
  }
};
export const CreateCategory: React.FC<
  UseModalFormReturnType<ICategory, HttpError, ICategory>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  setValue,

  formState: { errors },
}) => {
  //
  const [value, setValu] = React.useState("1");
  const [{ category }, dispatch] = useReducer(reducer, initialState);
  const options: Option[] = ["Générale", "Menu composé"];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValu(newValue);
    const selectedOption = options[parseInt(newValue, 10) - 1] as Option;
    dispatch({ type: "SET_OPTION", payload: selectedOption });
  };
  //
  // Effects
  useEffect(() => {
    setValue("type", category.type);
  }, [category.type, setValue]);
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <DialogTitle>
        {" "}
        {<Typography fontSize={24}>Ajouter Categorie</Typography>}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Générale" value="1" />
                <Tab label="Menu Composé" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TextField
                id="nom"
                value={category.nom}
                {...register("nom", {
                  required: "This field is required",
                })}
                error={!!errors.nom}
                helperText={errors.nom?.message}
                margin="normal"
                fullWidth
                label="Title"
                name="nom"
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
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
            </TabPanel>
            <TabPanel value="2">
              <TextField
                id="nom"
                value={category.nom}
                {...register("nom", {
                  required: "This field is required",
                })}
                error={!!errors.nom}
                helperText={errors.nom?.message}
                margin="normal"
                fullWidth
                label="Title"
                name="nom"
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
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
            </TabPanel>
          </TabContext>
          {/* <input
            type="hidden"
            value={watch("type", category.type)}
            {...register("type")}
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <SaveButton {...saveButtonProps} />
        <Button onClick={close}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
