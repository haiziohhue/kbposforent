import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useEffect, useReducer, useState } from "react";

import { HttpError } from "@refinedev/core";
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
  OutlinedInput,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { CloseOutlined } from "@mui/icons-material";
import { ICategory, IIngredients } from "../../../../interfaces";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { API_URL } from "../../../../constants";

type Option = "Générale" | "Menu composé";
type Ingredient = {
  nom: string;
  type: Option;
  quantite?: number;
  date_expiration: Date;
  cout: number;
  source: string;
  note: string;
  categorie?: number | null;
};
type State = {
  ingredient: Ingredient;
};

const initialState: State = {
  ingredient: {
    type: "Générale",
    nom: "",
    quantite: 0,
    date_expiration: new Date(),
    cout: 0,
    source: "",
    note: "",
    categorie: null,
  },
};
type Action =
  | { type: "SET_OPTION"; payload: Option }
  | { type: "SET_QUANTITE"; payload: number }
  | { type: "SET_DATE"; payload: Date }
  | { type: "SET_COUT"; payload: number }
  | { type: "SET_SOURCE"; payload: string }
  | { type: "SET_NOTE"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_CATEGORY"; payload: number | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_OPTION":
      return {
        ...state,
        ingredient: { ...state.ingredient, type: action.payload },
      };
    case "SET_QUANTITE":
      return {
        ...state,
        ingredient: { ...state.ingredient, quantite: action.payload },
      };
    case "SET_NAME":
      return {
        ...state,
        ingredient: { ...state.ingredient, nom: action.payload },
      };
    case "SET_DATE":
      return {
        ...state,
        ingredient: { ...state.ingredient, date_expiration: action.payload },
      };

    case "SET_COUT":
      return {
        ...state,
        ingredient: { ...state.ingredient, cout: action.payload },
      };
    case "SET_SOURCE":
      return {
        ...state,
        ingredient: { ...state.ingredient, source: action.payload },
      };
    case "SET_NOTE":
      return {
        ...state,
        ingredient: { ...state.ingredient, note: action.payload },
      };
    case "SET_CATEGORY":
      return {
        ...state,
        ingredient: { ...state.ingredient, categorie: action.payload },
      };
    default:
      return state;
  }
};
export const CreateIngredient: React.FC<
  UseModalFormReturnType<IIngredients, HttpError, IIngredients>
> = ({
  saveButtonProps,
  control,
  modal: { visible, close },
  register,
  setValue,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
}) => {
  //
  // const { autocompleteProps } = useAutocomplete<ICategory>({
  //   resource: "categories",
  //   meta: { filter: "[type][$eq]=Menu composé" },
  // });
  //

  //
  const [value, setValu] = React.useState("1");
  const [{ ingredient }, dispatch] = useReducer(reducer, initialState);
  const options: Option[] = ["Générale", "Menu composé"];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValu(newValue);
    const selectedOption = options[parseInt(newValue, 10) - 1] as Option;
    dispatch({ type: "SET_OPTION", payload: selectedOption });
  };
  //
  // Effects
  useEffect(() => {
    setValue("type", ingredient.type);
  }, [ingredient.type, setValue]);

  const [record, setRecord] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/categories?filters[type][$eq]=Menu composé`
        );
        const data = await response.json();
        console.log(data);
        setRecord(data?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecord();
  }, []);
  //
  console.log(record);
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "800px" } }}
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
                <form onSubmit={handleSubmit(onFinish)}>
                  <Stack gap="10px" marginTop="10px">
                    <FormControl>
                      <FormLabel required>Nom</FormLabel>
                      <OutlinedInput
                        id="Nom"
                        value={ingredient.nom}
                        {...register("nom", {
                          required: "This field is required",
                        })}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_NAME",
                            payload: e.target.value,
                          })
                        }
                      />
                      {errors.nom && (
                        <FormHelperText error>
                          {errors.nom.message}
                        </FormHelperText>
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
                          value={ingredient.quantite}
                          id="quantite"
                          {...register("quantite", {
                            required: "This field is required",
                          })}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_QUANTITE",
                              payload: parseInt(e.target.value, 10),
                            })
                          }
                        />
                        {errors.quantite && (
                          <FormHelperText error>
                            {errors.quantite.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl fullWidth>
                        <FormLabel required>Prix</FormLabel>
                        <OutlinedInput
                          id="Cout"
                          {...register("cout", {
                            required: "This field is required",
                          })}
                          type="number"
                          value={ingredient.cout}
                          startAdornment={
                            <InputAdornment position="start">DA</InputAdornment>
                          }
                          onChange={(e) =>
                            dispatch({
                              type: "SET_COUT",
                              payload: parseInt(e.target.value, 10),
                            })
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
                          value={ingredient.source}
                          {...register("source", {
                            required: "This field is required",
                          })}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_SOURCE",
                              payload: e.target.value,
                            })
                          }
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
                                // value={field.value ? dayjs(field.value) : null}
                                // onChange={(newValue) =>
                                //   field.onChange(dayjs(newValue))
                                // }
                                // value={ingredient.date_expiration}
                                value={
                                  field.value ? new Date(field.value) : null
                                }
                                onChange={(newValue) =>
                                  newValue !== null &&
                                  dispatch({
                                    type: "SET_DATE",
                                    payload: newValue,
                                  })
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
                        value={ingredient.note}
                        {...register("note")}
                        multiline
                        minRows={5}
                        maxRows={5}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_NOTE",
                            payload: e.target.value,
                          })
                        }
                      />
                      {errors.note && (
                        <FormHelperText error>
                          {errors.note.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </form>
              </TabPanel>
              <TabPanel value="2">
                <form onSubmit={handleSubmit(onFinish)}>
                  <Stack gap="10px" marginTop="10px">
                    <FormControl>
                      <FormLabel required>Nom</FormLabel>
                      <OutlinedInput
                        value={ingredient.nom}
                        id="Nom"
                        {...register("nom", {
                          required: "This field is required",
                        })}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_NAME",
                            payload: e.target.value,
                          })
                        }
                      />
                      {errors.nom && (
                        <FormHelperText error>
                          {errors.nom.message}
                        </FormHelperText>
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
                            // {...autocompleteProps}
                            options={record ?? []}
                            {...field}
                            // onChange={(_, value) => {
                            //   field.onChange(value?.id);
                            // }}
                            onChange={(_, value) =>
                              dispatch({
                                type: "SET_CATEGORY",
                                payload: value?.id ?? null,
                              })
                            }
                            getOptionLabel={(item) => {
                              return item?.attributes?.nom
                                ? item.attributes?.nom
                                : "";
                            }}
                            isOptionEqualToValue={(option, value) =>
                              value === undefined ||
                              option?.id?.toString() ===
                                (value?.id ?? value)?.toString()
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                value={ingredient.categorie}
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
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <FormControl fullWidth>
                        <FormLabel required>Cout</FormLabel>
                        <OutlinedInput
                          id="Cout"
                          value={ingredient.cout}
                          {...register("cout", {
                            required: "This field is required",
                          })}
                          type="number"
                          startAdornment={
                            <InputAdornment position="start">DA</InputAdornment>
                          }
                          onChange={(e) =>
                            dispatch({
                              type: "SET_COUT",
                              payload: parseInt(e.target.value, 10),
                            })
                          }
                        />
                        {errors.cout && (
                          <FormHelperText error>
                            {errors.cout.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Stack>
                </form>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log(ingredient)}
          >
            Create Menu
          </Button>
          <SaveButton {...saveButtonProps} />
          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
