import React from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  CrudFilters,
  HttpError,

  useNavigation,
  useUpdate,
  useExport,
  getDefaultFilter,
} from "@refinedev/core";
import {
  useDataGrid,
  NumberField,
  DateField,
  useAutocomplete,
  List,
  ExportButton,
  CreateButton,
} from "@refinedev/mui";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Autocomplete from "@mui/material/Autocomplete";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {

  ITresor,
  ITresorFilterVariables,
} from "../../interfaces";

import { TresorTypes } from "../../components/tresor/TresorTypes";
import { CreateDepense } from "./create";

export const ListTresor: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();

  const { dataGridProps, search, filters } = useDataGrid<
    ITresor,
    HttpError,
    ITresorFilterVariables
  >({
    initialPageSize: 10,
    meta: { populate: "*" },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { titre, type, user } = params;

      filters.push({
        field: "titre",
        operator: "eq",
        value: titre !== "" ? titre : undefined,
      });

      filters.push({
        field: "type",
        operator: "in",
        value: (type ?? []).length > 0 ? type : undefined,
      });

      filters.push({
        field: "user.id",
        operator: "eq",
        value:user,
      });

      return filters;
    },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<ITresor>>(
    () => [
      {
        field: "id",
        headerName: "N° Operation",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 100,
      },

      {
        field: "type",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return <TresorTypes status={row?.type} />;
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: "titre",
        headerName: "Objet",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },

      {
        field: "total",
        headerName: "Total",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: "DZD",
                style: "currency",
              }}
              value={row?.montant}
              sx={{ fontSize: "14px" }}
            />
          );
        },
        flex: 1,
        minWidth: 150,
      },

      {
        field: "user",
        headerName: "User",
         valueGetter: ({ row }) => row.user?.username,
        flex: 1,
        minWidth: 100,
        sortable: false,
      },

      {
        field: "createdAt",
        headerName: "Date",
        flex: 1,
        minWidth: 170,
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row.createdAt}
              format="LLL"
              sx={{ fontSize: "14px" }}
            />
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 80,
        sortable: false,
        getActions: ({ id }) => [
          <GridActionsCellItem
            key={1}
            icon={<CheckOutlinedIcon color="success" />}
            sx={{ padding: "2px 6px" }}
            label=""
            showInMenu
            onClick={() => {
              mutate({
                resource: "tresoriers",
                id,
                values: {
                  status: {
                    id: 2,
                    text: "Ready",
                  },
                },
              });
            }}
          />,

          <GridActionsCellItem
            key={2}
            icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: "2px 6px" }}
            label=""
            showInMenu
            onClick={() =>
              mutate({
                resource: "cammandes",
                id,
                values: {
                  status: {
                    id: 5,
                    text: "Cancelled",
                  },
                },
              })
            }
          />,
        ],
      },
    ],
    []
  );

  const { show } = useNavigation();

  // const { isLoading, triggerExport } = useExport<IOrder>({
 
  //   filters,
  //   pageSize: 50,
  //   maxItemCount: 50,
  //   mapData: (item) => {
  //     return {
  //       id: item.id,
  //       amount: item.amount,
  //       orderNumber: item.orderNumber,
  //       status: item.status.text,
  //       store: item.store.title,
  //       user: item.user.firstName,
  //     };
  //   },
  // });

  const { register, handleSubmit, control } = useForm<
    BaseRecord,
    HttpError,
    ITresorFilterVariables
  >({
    defaultValues: {
      titre: getDefaultFilter("titre", filters, "eq"),
      type: getDefaultFilter("type", filters, "in"),
      user: getDefaultFilter("user.id", filters, "eq"),
    },
  });


  // const { autocompleteProps: orderAutocompleteProps } = useAutocomplete({
  //   resource: 'orderStatuses',
  // });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
    defaultValue: getDefaultFilter("user.id", filters, "eq"),
  });
  //
  const createDrawerFormProps = useModalForm<ITresor, HttpError, ITresor>({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  //
  return (
    <>
      <CreateDepense {...createDrawerFormProps} />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
            <CardHeader title="Filtrer" />
            <CardContent sx={{ pt: 0 }}>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
                onSubmit={handleSubmit(search)}
              >
                <TextField
                  {...register("titre")}
                  label="Recherche"
                  placeholder="Objet"
                  margin="normal"
                  fullWidth
                  autoFocus
                  size="small"
                />
             
             <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Autocomplete
                    {...userAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value);
                    }}
                    options={["vente", "Dépense"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type"
                        placeholder="Type"
                        margin="normal"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                )}
              />
                <Controller
                  control={control}
                  name="user"
                  render={({ field }) => (
                    <Autocomplete
                      {...userAutocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value?.id ?? value);
                      }}
                      getOptionLabel={(item) => {
                        return item?.username ? item.username : item;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.id?.toString() ===
                          (value?.id ?? value)?.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Utilisateur"
                          placeholder="Utilisateur"
                          margin="normal"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  )}
                />
                <br />
                <Button type="submit" variant="contained">
                  Filtrer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={9}>
          <List
            wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
            headerProps={
              {
                // action: (
                //   <ExportButton onClick={triggerExport} loading={isLoading} />
                // ),
              }
            }
            headerButtons={
              <CreateButton
                onClick={() => showCreateModal()}
                variant="contained"
                sx={{ marginBottom: "5px" }}
              >
                Ajouter Dépenes
              </CreateButton>
            }
            createButtonProps={
              {
                // sx: {
                //   display: 'none',
                // },
              }
            }
          >
            <DataGrid
              {...dataGridProps}
              columns={columns}
              filterModel={undefined}
              autoHeight
              onRowClick={({ id }) => {
                show("tresoriers", id);
              }}
              rowsPerPageOptions={[10, 20, 50, 100]}
              sx={{
                ...dataGridProps.sx,
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }}
            />
          </List>
        </Grid>
      </Grid>
    </>
  );
};
