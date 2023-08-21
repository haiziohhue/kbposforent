import {
  Add,
  Close,
  CloseOutlined,
  Delete,
  Done,
  Mode,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { API_URL } from "../../../constants";
import { IBC, IChef } from "interfaces";
import React, { useCallback, useEffect, useReducer } from "react";
import ResizeDataGrid from "../../../components/reusable/ResizeDataGrid";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//
const initialState = {
  articles: [],
  produits: [],
  bc: {
    // chef: "",
    chef: {
      chef: "",
      id: null,
    },
    note: "",
  },
};
//

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "SET_PRODUITS":
      return { ...state, produits: action.payload };
    case "SET_BC":
      return { ...state, bc: action.payload };
    default:
      return state;
  }
};
//
export const CreateBC: React.FC<
  UseModalFormReturnType<IBC, HttpError, IBC>
> = ({
  saveButtonProps,

  modal: { visible, close },
  handleSubmit,
}) => {
  //

  const [{ articles, bc, produits }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const handleChange = (event) => {
    dispatch({
      type: "SET_BC",
      payload: { ...bc, [event.target.name]: event.target.value },
    });
  };
  const addArticle = () => {
    const newArticle = {
      article: { id: 0, label: "" },
      quantite: 1,
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
  //

  const { autocompleteProps } = useAutocomplete<IChef>({
    resource: "chefs",
    meta: { populate: "*" },
  });

  //Get Products
  const fetchProduits = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stocks?populate=deep`);
      const data = await res.json();
      console.log(data);
      const produitsData = data.data.map((e) => ({
        id: e.id,
        ...e.attributes,
      }));
      dispatch({ type: "SET_PRODUITS", payload: produitsData });
    } catch (err) {
      console.log(err);
    }
  }, []);
  useEffect(() => {
    fetchProduits();
  }, []);
  //
  console.log(produits);
  //   console.log(articles);
  console.log(autocompleteProps.options);
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
      field: "quantite",
      headerName: "Quantité",
      width: 200,
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
      headerName: "State",
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
              {/* Render your desired icon or component for editing state */}
              {params.row.article.value && (
                <Done
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                  color="primary"
                  onClick={() => {
                    // Add your logic when the edit state is confirmed
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
              {/* Render your desired icon or component for cancelling state */}
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
            {/* Render your desired icon or component for entering edit state */}
            <Mode
              sx={{ cursor: "pointer" }}
              fontSize="small"
              onClick={() => {
                // Add your logic when entering edit state
                dispatch({
                  type: "SET_ARTICLES",
                  payload: articles.map((row, i) =>
                    params.row.id === i ? { ...row, state: false } : row
                  ),
                });
              }}
            />
            {/* Render your desired icon or component for deleting a row */}
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
  const onFinishHandler = async () => {
    const payload = {
      chef: bc.chef.id,
      ingredients: articles
        ?.filter((k) => !k.state)
        ?.map((article) => ({
          stock: article.article.id,
          quantite: article.quantite,
        })),
      etat: "Validé",
    };
    console.log(payload);
    try {
      const response = await axios.post(`${API_URL}/api/bon-chefs`, {
        data: payload,
      });
      console.log("Request succeeded:", response.data);

      //   navigate(`/commandes`);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  //
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{
        sx: {
          width: "100%",
          height: "700px",
          maxWidth: "900px",
        },
      }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Nouveau Bon Chef</Typography>}
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
            <form onSubmit={handleSubmit(onFinishHandler)}>
              <Stack gap="10px" flexDirection="row">
                {/* <FormControl fullWidth>
                  <FormLabel required>Chef</FormLabel>
                  <Controller
                    control={control}
                    name="chef"
                    rules={{
                      required: "This field is required",
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...field}
                        {...autocompleteProps}
                        value={bc.chef}
                        onChange={(_, value) => {
                          field.onChange(value?.id);
                        }}
                        getOptionLabel={(item) => {
                          console.log(item);
                          return item?.chef ? item?.chef : "";
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
                            error={!!errors.chef?.message}
                            required
                          />
                        )}
                      />
                    )}
                  />
                  {errors.chef && (
                    <FormHelperText error>{errors.chef.message}</FormHelperText>
                  )}
                </FormControl> */}
                <FormControl fullWidth>
                  <Autocomplete
                    id="tags-filled"
                    // value={bc.chef ?? ""}
                    options={
                      autocompleteProps.options?.map(
                        (option: { chef: string; id: number }) => {
                          return {
                            label: option?.chef,
                            id: option?.id,
                            value: option,
                          };
                        }
                      ) || []
                    }
                    onChange={(event, newValue) => {
                      if (newValue === null) return;
                      dispatch({
                        type: "SET_BC",
                        payload: { ...bc, chef: newValue },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Entrepot"
                        placeholder="Entrepot"
                      />
                    )}
                  />
                </FormControl>
                {/* <FormControl fullWidth>
                    <FormLabel>Note</FormLabel>
                    <OutlinedInput
                      id="Nom"
                      value={br.note}
                      {...register("note")}
                      onChange={handleChange}
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
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton {...saveButtonProps} />
          <Button
            {...saveButtonProps}
            variant="contained"
            onClick={() => {
              onFinishHandler();
            }}
            sx={{ fontWeight: 500, paddingX: "26px", paddingY: "4px" }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Create>
    </Dialog>
  );
};
