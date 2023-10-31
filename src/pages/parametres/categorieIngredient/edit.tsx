import { Add, Close, CloseOutlined, Delete, Done } from "@mui/icons-material";
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
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { API_URL, TOKEN_KEY } from "../../../constants";
import { ICatIngredients, ICategory } from "interfaces";
import React, { useCallback, useEffect, useReducer } from "react";
import { Controller } from "react-hook-form";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import ResizeDataGrid from "../../../components/reusable/ResizeDataGrid";
import axios from "axios";

//
const initialState = {
  articles: [],
  produits: [],
  categories: [],
  ci: {
    nom: "",
    categories: {
      nom: "",
      id: null,
    },
  },
};
//

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "SET_PRODUITS":
      return { ...state, produits: action.payload };
    case "SET_CI":
      return { ...state, ci: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};
//

interface EditBI {
  id: number | undefined;
}

export const EditCatIngredients: React.FC<
  UseModalFormReturnType<ICatIngredients, HttpError, ICatIngredients> & EditBI
> = ({
  saveButtonProps,
  control,
  modal: { visible, close },
  register,
  formState: { errors },
  id,
}) => {
  //
  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: "categories",
  });
  //
  const [{ articles, ci, produits }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const handleChange = (event) => {
    dispatch({
      type: "SET_CI",
      payload: { ...ci, [event.target.name]: event.target.value },
    });
  };
  const addArticle = () => {
    const newArticle = {
      article: { id: 0, label: "" },
      prix: 0,
      state: true,
    };

    dispatch({ type: "SET_ARTICLES", payload: [...articles, newArticle] });
  };
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
  //get Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories?populate=deep`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
      const data = await res.json();
      const categorieData = data?.data;
      dispatch({
        type: "SET_CATEGORIES",
        payload: categorieData?.map((c) => ({
          id: c.id,
          ...c.attributes,
        })),
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  //
  const fetchBIByID = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/categorie-ingredients/${id}?populate=deep`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
      const data = await res.json();
      const deepData = data?.data?.attributes;
      const ingredientsArray = deepData?.ingredients || [];
      dispatch({ type: "SET_CI", payload: deepData });
      const articlesArray = ingredientsArray?.map((e) => ({
        article: {
          id: e.ingredient?.data?.id || 0,
          label: e.ingredient?.data?.attributes?.nom || "",
          value: {
            id: e.ingredient?.data?.id || 0,
            ...e.ingredient?.data?.attributes,
          },
        },
        prix: e?.prix || 0,

        state: false,
        // old: true,
      }));

      dispatch({
        type: "SET_ARTICLES",
        payload: articlesArray,
      });
    } catch (err) {
      console.log(err);
    }
  }, [id]);
  useEffect(() => {
    fetchProduits();
    fetchBIByID();
    fetchCategories();
  }, [fetchBIByID, fetchCategories, fetchProduits]);
  //
  //
  const columns: GridColDef[] = [
    {
      field: "article",
      headerName: "Article",
      width: 300,
      resizable: true,
      type: "string",
      minWidth: 300,
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
                  .filter(
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
      field: "prix",
      headerName: "Prix",
      width: 200,
      resizable: true,
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        if (params.row.state)
          return (
            <TextField
              value={params.row.prix}
              fullWidth
              onChange={(e) => {
                dispatch({
                  type: "SET_ARTICLES",
                  payload: articles.map((row, i) =>
                    params.row.id === i
                      ? { ...row, prix: +e.target.value || 0 }
                      : row
                  ),
                });
              }}
            />
          );
        return <Typography variant="body1">{params.row.prix}</Typography>;
      },
    },

    {
      field: "state",
      headerName: "",
      width: 100,
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
  //
  const onFinishHandler = async (data: any) => {
    const payload = {
      ...data,
      ingredients: articles
        ?.filter((k) => !k.state)
        ?.map((article) => ({
          ingredient: article.article?.id,
          prix: article.prix,
        })),
      // etat: "Validé",
    };
    try {
      const response = await axios.put(
        `${API_URL}/api/categorie-ingredients/${id}`,
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
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  //

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "900px", maxWidth: "900px" } }}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        title={
          <Typography fontSize={24}>
            Modifier Categories & Ingredient pour Menu composée
          </Typography>
        }
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
            <Stack gap="20px" marginTop="10px" marginBottom="20px">
              <FormControl>
                <FormLabel required>Nom</FormLabel>
                <OutlinedInput
                  id="nom"
                  {...register("nom", {
                    required: "This field is required",
                  })}
                  onChange={handleChange}
                />
                {errors.nom && (
                  <FormHelperText error>{errors.nom.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel required>Categories</FormLabel>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      multiple
                      {...autocompleteProps}
                      // options={categories}
                      {...register("categories", {
                        required: "This field is required",
                      })}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value);
                        dispatch({
                          type: "SET_CI",
                          payload: { ...ci, categories: value },
                        });
                      }}
                      // onChange={(event, newValue) => {
                      //   if (newValue === null) return;
                      //   dispatch({
                      //     type: "SET_CI",
                      //     payload: { ...ci, categories: newValue },
                      //   });
                      // }}
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
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  // height: 150 + 53 * articles.length,
                  height: 250,
                  maxHeight: 250,
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
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <SaveButton {...saveButtonProps} /> */}
          <Button
            {...saveButtonProps}
            variant="contained"
            onClick={() => {
              onFinishHandler(ci);
            }}
            sx={{ fontWeight: 500, paddingX: "26px", paddingY: "4px" }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Edit>
    </Dialog>
  );
};
