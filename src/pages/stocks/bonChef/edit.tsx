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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { API_URL } from "../../../constants";
import { IBC } from "interfaces";
import React, { useCallback, useEffect, useReducer } from "react";
import ResizeDataGrid from "../../../components/reusable/ResizeDataGrid";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

//
const initialState = {
  articles: [],
  produits: [],
  chefs: [],
  bc: {
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
    case "SET_CHEF":
      return { ...state, chefs: action.payload };
    default:
      return state;
  }
};
//
interface EditBC {
  id: number | undefined;
}
export const EditBC: React.FC<
  UseModalFormReturnType<IBC, HttpError, IBC> & EditBC
> = ({
  saveButtonProps,
  formState: { errors },
  modal: { visible, close },
  id,
}) => {
  //

  const [{ articles, bc, chefs, produits }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const addArticle = () => {
    const newArticle = {
      article: { id: 0, label: "" },
      quantite: 1,
      stock: 0,
      state: true,
      old: false,
    };

    dispatch({ type: "SET_ARTICLES", payload: [...articles, newArticle] });
  };

  //delete row by index
  const deleteRow = (index) => {
    dispatch({
      type: "SET_ARTICLES",
      payload: articles.filter((_, i) => i !== index),
    });
  };
  //

  const handleArticleChange = (
    field: string,
    value: any,
    index: number,
    old: boolean
  ) => {
    if (old) {
      dispatch({
        type: "SET_ARTICLES",
        payload: articles?.map((row) =>
          index === row.id ? { ...row, [field]: value } : row
        ),
      });
    } else {
      const article = articles[index];
      article[field] = value;
      dispatch({
        type: "SET_ARTICLES",
        payload: articles?.map((row, i) => (i === index ? article : row)),
      });
    }
  };
  //Get Products
  const fetchProduits = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stocks?populate=deep`);
      const data = await res.json();

      const produitsData = data?.data?.map((e) => ({
        id: e.id,
        ...e.attributes,
      }));
      dispatch({ type: "SET_PRODUITS", payload: produitsData });
    } catch (err) {
      console.log(err);
    }
  }, []);
  //Get BC By id
  const fetchBCByID = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/bon-chefs/${id}?populate=deep`);
      const data = await res.json();
      const deepData = data?.data?.attributes;
      const ingredientsArray = deepData?.ingredients || [];
      dispatch({ type: "SET_BC", payload: deepData });
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
        stock: e.stock?.data?.attributes?.quantite || 0,
        state: false,
        old: true,
      }));

      dispatch({
        type: "SET_ARTICLES",
        payload: articlesArray,
      });
    } catch (err) {
      console.log(err);
    }
  }, [id]);
  // Get Chefs
  const fetchChefs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/chefs?populate=deep`);
      const data = await res.json();
      const chefData = data?.data;
      console.log(chefData);
      dispatch({
        type: "SET_CHEF",
        payload: chefData?.map((c) => ({
          id: c.id,
          ...c.attributes,
        })),
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchProduits();
    fetchBCByID();
    fetchChefs();
  }, [fetchBCByID, fetchChefs, fetchProduits]);
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
        if (params.row.state && !params.row.old)
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
                    (k) => !articles?.map((e) => e.article.id)?.includes(k.id)
                  )
                  ?.map((option) => {
                    return {
                      label: option.ingredient?.data?.attributes?.nom,
                      id: option.id,
                      stock: option?.quantite,
                      value: option,
                    };
                  })}
                sx={{
                  flex: 1,
                }}
                // onChange={(event, newValue) => {
                //   if (newValue.value) {
                //     if (params.row.old) {
                //       dispatch({
                //         type: "SET_ARTICLES",
                //         payload: articles.map((e) => {
                //           if (e.id === params.row.id) {
                //             return {
                //               ...e,
                //               article: newValue,
                //               prix: newValue.value.prix,
                //               tva: newValue.value.tva,
                //             };
                //           }
                //           return e;
                //         }),
                //       });
                //     } else
                //       dispatch({
                //         type: "SET_ARTICLES",
                //         payload: articles.map((e, i) => {
                //           if (i === params.row.id) {
                //             return {
                //               ...e,
                //               article: newValue,
                //               prix: newValue.value.prix,
                //               tva: newValue.value.tva,
                //             };
                //           }
                //           return e;
                //         }),
                //       });
                //   }
                // }}
                onChange={(event, newValue) => {
                  if (!newValue.value) return;
                  if (params.row.old) {
                    dispatch({
                      type: "SET_ARTICLES",
                      payload: articles.map((e) => {
                        if (e.id === params.row.id) {
                          return {
                            ...e,
                            article: newValue,
                            stock: newValue.stock,
                          };
                        }
                        return e;
                      }),
                    });
                  } else {
                    dispatch({
                      type: "SET_ARTICLES",
                      payload: articles.map((e, i) => {
                        if (i === params.row.id) {
                          return {
                            ...e,
                            article: newValue,
                            stock: newValue.stock,
                          };
                        }
                        return e;
                      }),
                    });
                  }
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
              onChange={(e) =>
                handleArticleChange(
                  params.field,
                  e.target.value,
                  params.row.id,
                  params.row.old
                )
              }
            />
          );
        return <Typography variant="body1">{params.row.quantite}</Typography>;
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 200,
      resizable: true,
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        if (params.row.state)
          return <TextField value={params.row.stock} fullWidth />;
        return <Typography variant="body1">{params.row.stock}</Typography>;
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
              {/* Render your desired icon or component for editing state */}
              {params.row.article.value && (
                <Done
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                  color="primary"
                  onClick={() => {
                    if (params.row.article.value) {
                      if (params.row.old) {
                        dispatch({
                          type: "SET_ARTICLES",
                          payload: articles.map((row) =>
                            params.row.id === row.id
                              ? { ...row, state: false }
                              : row
                          ),
                        });
                      } else {
                        dispatch({
                          type: "SET_ARTICLES",
                          payload: articles.map((row, i) =>
                            params.row.id === i ? { ...row, state: false } : row
                          ),
                        });
                      }
                    }
                  }}
                />
              )}
              {/* Render your desired icon or component for cancelling state */}
              <Close
                sx={{ cursor: "pointer" }}
                fontSize="small"
                color="error"
                onClick={() => {
                  dispatch({
                    type: "SET_ARTICLES",
                    payload: articles.map((row) => {
                      if (row.id === params.row.id) {
                        return { ...row, state: false };
                      }
                      return row;
                    }),
                  });
                }}
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
                if (params.row.old) {
                  dispatch({
                    type: "SET_ARTICLES",
                    payload: articles?.map((row) =>
                      params.row.id === row.id ? { ...row, state: true } : row
                    ),
                  });
                } else {
                  dispatch({
                    type: "SET_ARTICLES",
                    payload: articles?.map((row, i) =>
                      params.row.id === i ? { ...row, state: true } : row
                    ),
                  });
                }
              }}
            />
            {/* Render your desired icon or component for deleting a row */}
            <Delete
              sx={{ cursor: "pointer" }}
              fontSize="small"
              color="error"
              onClick={() => {
                if (params.row.old) {
                  dispatch({
                    type: "SET_ARTICLES",
                    payload: articles.filter((r) => r.id !== params.row.id),
                  });
                } else {
                  deleteRow(params.row.id);
                }
              }}
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
      <Edit
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Modifier Bon Chef</Typography>}
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
                <FormLabel>Chef</FormLabel>
                <Autocomplete
                  id="tags-filled"
                  value={bc?.chef || null}
                  options={chefs}
                  getOptionLabel={(option) => {
                    return option?.data?.attributes?.chef
                      ? option.data.attributes.chef
                      : option?.chef ?? "";
                  }}
                  onChange={(event, newValue) => {
                    if (newValue === null) return;
                    dispatch({
                      type: "SET_BC",
                      payload: { ...bc, chef: newValue || null },
                    });
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      required
                      error={!!errors.chef?.message}
                    />
                  )}
                />
                {errors.chef && (
                  <FormHelperText error>{errors.chef.message}</FormHelperText>
                )}
              </FormControl>
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
                    const products = articles?.map((e) =>
                      Number(params.row.id) === e.id ? { ...e, state: true } : e
                    );

                    dispatch({ type: "SET_ARTICLES", payload: products });
                  }}
                  rows={articles?.map((e, i) => ({
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
