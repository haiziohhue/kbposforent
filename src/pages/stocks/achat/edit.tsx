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
  FormHelperText,
  FormLabel,
  IconButton,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { API_URL } from "../../../constants";
import dayjs from "dayjs";
import { IAchat } from "interfaces";
import React, { useCallback, useEffect, useReducer } from "react";
import ResizeDataGrid from "../../../components/reusable/ResizeDataGrid";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

//
const initialState = {
  articles: [],
  produits: [],
  br: {
    dateTime: dayjs(),
    source: "",
    note: "",
  },
};
//

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "SET_PRODUITS":
      return { ...state, produits: action.payload };
    case "SET_BR":
      return { ...state, br: action.payload };
    default:
      return state;
  }
};
//
interface EditBR {
  id: number | undefined;
}
export const EditAchat: React.FC<
  UseModalFormReturnType<IAchat, HttpError, IAchat> & EditBR
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  formState: { errors },
  id,
}) => {
  //
  const [{ articles, br, produits }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const handleChange = (event) => {
    dispatch({
      type: "SET_BR",
      payload: { ...br, [event.target.name]: event.target.value },
    });
  };
  const addArticle = () => {
    const newArticle = {
      article: { id: 0, label: "" },
      quantite: 0,
      prix: 1,
      date_expiration: dayjs(),
      total: 1,
      state: true,
    };
    newArticle.total = calculateSubtotal(newArticle);
    dispatch({ type: "SET_ARTICLES", payload: [...articles, newArticle] });
  };
  // Calculate the subtotal for each article
  const calculateSubtotal = (article) => {
    return article.prix * article.quantite;
  };

  // Calculate the total for all items in the articles
  const calculateTotal = () => {
    let total = 0;
    for (const article of articles) {
      total += calculateSubtotal(article);
    }
    return total;
  };
  //
  const formattedNumber = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  })?.format(calculateTotal());
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
      const res = await fetch(`${API_URL}/api/stocks?populate=deep`);
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
  //Get BR By id
  const fetchBRByID = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/achats/${id}?populate=deep`);
      const data = await res.json();
      const deepData = data?.data?.attributes;
      const ingredientsArray = deepData?.ingredients || [];
      dispatch({ type: "SET_BR", payload: deepData });
      const articlesArray = ingredientsArray?.map((e) => ({
        article: {
          id: e.stock?.data?.id || 0,
          label:
            e.stock?.data?.attributes?.ingredient?.data?.attributes?.nom || "",
          value: {
            id: e.stock?.data?.id || 0,
            ...e.stock?.data?.attributes?.ingredient?.data?.attributes,
          },
        },
        quantite: e?.quantite || 0,
        prix: e?.cout || 0,
        stock: e.stock?.data?.attributes?.quantite || 0,
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
    fetchBRByID();
  }, [fetchBRByID, fetchProduits]);
  //

  //

  //

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
      field: "prix",
      headerName: "Prix",
      width: 150,
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
      field: "date_expiration",
      headerName: "Date Expiration",
      width: 180,
      resizable: true,
      type: "date",
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => {
        return new Date(params.row.date_expiration);
      },
      renderCell: (params) => {
        if (params.row.state) {
          return (
            <TextField
              type="date"
              value={dayjs(params.row.date_expiration).format("YYYY-MM-DD")}
              fullWidth
              onChange={(e) => {
                dispatch({
                  type: "SET_ARTICLES",
                  payload: articles.map((row, i) =>
                    params.row.id === i
                      ? {
                          ...row,
                          date_expiration: dayjs(e.target.value).toISOString(),
                        }
                      : row
                  ),
                });
              }}
            />
          );
        }
        return (
          <Typography variant="body1">
            {dayjs(params.row.date_expiration).format("YYYY-MM-DD")}
          </Typography>
        );
      },
    },
    // {
    //   field: "total",
    //   headerName: "Total",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   valueGetter: (params) => {
    //     const row = params.row;
    //     return row.prix * row.quantite;
    //   },
    //   renderCell: (params) => (
    //     <Typography variant="body1">{params.value}</Typography>
    //   ),
    // },
    {
      field: "total",
      headerName: "Total",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => calculateSubtotal(params.row),
      renderCell: (params) => (
        <Typography variant="body1">{calculateSubtotal(params.row)}</Typography>
      ),
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
  //
  const onFinishHandler = async () => {
    const payload = {
      source: br.source,
      note: br.note,
      ingredients: articles
        ?.filter((k) => !k.state)
        ?.map((article) => ({
          stock: article.article.id,
          quantite: article.quantite,
          cout: article.prix,
          total: calculateSubtotal(article),
          date_expiration: article.date_expiration,
        })),
      total: calculateTotal(),
      etat: "Validé",
    };
    try {
      const response = await axios.put(`${API_URL}/api/achats/${id}`, {
        data: payload,
      });
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
      PaperProps={{
        sx: {
          width: "100%",
          height: "800px",
          maxWidth: "1200px",
        },
      }}
    >
      <Edit
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Modifier Achat</Typography>}
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
            <Stack gap="10px" flexDirection="row">
              <FormControl fullWidth>
                <FormLabel required>Source</FormLabel>
                <OutlinedInput
                  id="Nom"
                  value={br?.source}
                  {...register("source", {
                    required: "This field is required",
                  })}
                  onChange={handleChange}
                />
                {errors.source && (
                  <FormHelperText error>{errors.source.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Note</FormLabel>
                <OutlinedInput
                  id="Note"
                  value={br?.note}
                  {...register("note")}
                  onChange={handleChange}
                />
                {errors.note && (
                  <FormHelperText error>{errors.note.message}</FormHelperText>
                )}
              </FormControl>
            </Stack>
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
              <TextField
                label="Totale"
                value={formattedNumber}
                disabled
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
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
      </Edit>
    </Dialog>
  );
};
