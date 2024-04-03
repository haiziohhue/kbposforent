import {
  UseModalFormReturnType,
  useStepsForm,
} from "@refinedev/react-hook-form";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ICategory, IMenu } from "../../interfaces";
import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
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
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { API_URL, TOKEN_KEY } from "../../constants";
import axios from "axios";
import { Add, Close, CloseOutlined, Delete, Done } from "@mui/icons-material";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import ResizeDataGrid from "../../components/reusable/ResizeDataGrid";

const initialState = {
  articles: [],
  produits: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "SET_PRODUITS":
      return { ...state, produits: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const EditMenu: React.FC<
  UseModalFormReturnType<IMenu, HttpError, IMenu>
> = ({
  saveButtonProps,
  control,
  setValue,
  modal: { visible, close },
  register,
  refineCore: { queryResult },

  setError,
  formState: { errors },
}) => {
  const {
    steps: { currentStep, gotoStep },
  } = useStepsForm<IMenu, HttpError, IMenu>({
    stepsProps: {
      isBackValidate: false,
    },

    warnWhenUnsavedChanges: true,
  });
  const [{ articles, produits }, dispatch] = useReducer(reducer, initialState);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const stepTitles = ["Données Generales", "Les Ingredients"];
  const menuData = queryResult?.data?.data;
  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });

  // Image upload
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
      setValue("image", res.data[0].id, { shouldValidate: true });

      setIsUploadLoading(false);
    } catch (error) {
      setError("image", { message: "Upload failed. Please try again." });
      setIsUploadLoading(false);
    }
  };
  console.log(articles);
  //
  const addArticle = () => {
    const newArticle = {
      article: { id: 0, label: "" },
      quantite: 0,
      state: true,
      unite: "",
    };

    dispatch({ type: "SET_ARTICLES", payload: [...articles, newArticle] });
  };
  //
  //delete row by index
  const deleteRow = (index: unknown) => {
    dispatch({
      type: "SET_ARTICLES",
      payload: articles.filter((_, i) => i !== index),
    });
  };
  //Get Products
  const fetchProduits = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stocks?populate=deep`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      const data = await res.json();

      const produitsData = data.data.map((e) => ({
        id: e.id,
        ...e.attributes,
      }));
      dispatch({ type: "SET_PRODUITS", payload: produitsData });
    } catch (err) {
      console.log(err);
    }
  }, []);

  //Get Menu By id
  const fetchMenuByID = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/menus/${menuData?.id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
      const data = await res.json();
      const deepData = data?.data?.attributes;
      const ingredientsArray = deepData?.ingredients || [];

      const articlesArray = ingredientsArray?.map((e) => ({
        article: {
          id: e.ingredient?.data?.id || 0,
          label: e.ingredient?.data?.attributes?.nom || "",
          value: {
            id: e.ingredient?.data?.id || 0,
            ...e.ingredient?.data?.attributes,
          },
        },
        quantite: e?.quantite_demande || 0,
        unite: e.ingredient?.data?.attributes?.unite || "",
        state: false,
      }));
      dispatch({
        type: "SET_ARTICLES",
        payload: articlesArray,
      });
    } catch (err) {
      console.log(err);
    }
  }, [menuData?.id]);
  //

  useEffect(() => {
    fetchProduits();
    fetchMenuByID();
  }, [fetchMenuByID, fetchProduits]);

  useEffect(() => {
    setValue(
      "ingredients",
      articles
        ?.filter((k) => !k.state)
        ?.map((article) => ({
          ingredient: article.article.id,
          quantite_demande: article.quantite,
        }))
    );
  }, [articles, setValue]);

  console.log(articles);
  //
  const columns: GridColDef[] = [
    {
      field: "article",
      headerName: "Article",
      width: 200,
      resizable: true,
      type: "string",
      minWidth: 200,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridCellParams) => {
        if (params.row.state)
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Autocomplete
                id="tags-filled"
                value={params.row.article}
                options={produits
                  ?.filter(
                    (k) => !articles.map((e) => e.article.id).includes(k.id)
                  )
                  .map((option) => {
                    return {
                      label: option.ingredient?.data?.attributes?.nom,
                      id: option.id,
                      value: option,
                    };
                  })}
                sx={{
                  flex: 1,
                }}
                freeSolo
                onChange={(event, newValue) => {
                  if (!newValue.value) return;
                  const products = articles.map((e, i) => {
                    if (i === params.row.id) {
                      return {
                        ...e,
                        article: newValue,
                        prix: newValue.value.prix,
                      };
                    }

                    return e;
                  });

                  dispatch({ type: "SET_ARTICLES", payload: products });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Produit"
                  />
                )}
              />
            </Box>
          );
        return (
          <Typography variant="body1">{params.row.article.label}</Typography>
        );
      },
    },
    {
      field: "unite",
      headerName: "Unite",
      width: 120,
      resizable: true,
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        if (params.row.state) {
          return (
            <TextField
              value={
                params.row?.article?.value?.ingredient?.data?.attributes?.unite
              }
              fullWidth
              onChange={(e) => {
                const updatedArticles = articles.map((row, i) =>
                  params.row.id === i
                    ? { ...row, article: { label: e.target.value } }
                    : row
                );
                dispatch({
                  type: "SET_ARTICLES",
                  payload: updatedArticles,
                });
              }}
              variant="outlined"
              placeholder=""
              disabled
            />
          );
        }
        return (
          <Typography variant="body1">
            {params.row?.article?.value?.ingredient?.data?.attributes?.unite ??
              ""}
          </Typography>
        );
      },
    },

    {
      field: "quantite",
      headerName: "Quantité",
      width: 150,
      resizable: true,
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        if (params.row.state)
          return (
            <TextField
              value={params.row.quantite}
              fullWidth
              onChange={(e) => {
                dispatch({
                  type: "SET_ARTICLES",
                  payload: articles.map((row, i) =>
                    params.row.id === i
                      ? { ...row, quantite: +e.target.value || 0 }
                      : row
                  ),
                });
              }}
            />
          );
        return <Typography variant="body1">{params.row.quantite}</Typography>;
      },
    },

    {
      field: "state",
      headerName: "",
      width: 120,
      resizable: true,
      type: "boolean",
      headerAlign: "left",
      align: "left",
      pinnable: true,
      renderCell: (params) => {
        if (params.row.state)
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {params.row.article.value && (
                <Done
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                  color="primary"
                  onClick={() => {
                    if (params.row.article.value)
                      dispatch({
                        type: "SET_ARTICLES",
                        payload: articles.map((row, i) =>
                          params.row.id === i ? { ...row, state: false } : row
                        ),
                      });
                  }}
                />
              )}

              <Delete
                sx={{ cursor: "pointer" }}
                fontSize="small"
                color="error"
                onClick={() => deleteRow(params.row.id)}
              />
            </Box>
          );
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Close
              sx={{ cursor: "pointer" }}
              fontSize="small"
              color="error"
              onClick={() => deleteRow(params.row.id)}
            />
          </Box>
        );
      },
    },
  ];

  // Steps
  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
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
                    src={
                      imageURL ? imageURL : `${API_URL}${menuData?.image?.url}`
                    }
                    alt="Menu Image"
                  >
                    {isUploadLoading && <CircularProgress />}
                  </Avatar>
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
              </Stack>

              {errors.image && !isUploadLoading && (
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
                  <FormHelperText error>{errors.titre.message}</FormHelperText>
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
                  <FormHelperText error>{errors.active.message}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </>
        );

      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                height: 150 + 50 * articles.length,
                maxHeight: 350,
                width: "100%",
                overflow: `auto `,
              }}
            >
              <ResizeDataGrid
                sx={{
                  fontSize: 14,
                }}
                onCellKeyDown={(p, e) => {
                  e.stopPropagation();
                }}
                hideFooter
                columns={columns}
                onRowDoubleClick={(params) => {
                  const products = articles.map((row, i) =>
                    params.row.id === i ? { ...row, state: true } : row
                  );

                  dispatch({ type: "SET_ARTICLES", payload: products });
                }}
                rows={articles.map((e, i) => ({
                  id: i,
                  ...e,
                }))}
              />
            </Box>
            <Button
              sx={{
                my: 4,
                alignSelf: "start",
              }}
              variant="outlined"
              onClick={addArticle}
              startIcon={<Add />}
            >
              Ajouter un article
            </Button>
          </Box>
        );
    }
  };
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 600 } }}
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
                  <StepButton onClick={() => gotoStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <br />
            {renderFormByStep(currentStep)}
          </Box>
        </DialogContent>
        <DialogActions>
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
              <SaveButton {...saveButtonProps}>Enregistrer</SaveButton>
            )}
          </>
        </DialogActions>
      </Edit>
    </Dialog>
  );
};
