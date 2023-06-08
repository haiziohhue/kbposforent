import React, { useContext } from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  CrudFilters,
  HttpError,
  useNavigation,
  useUpdate,
  getDefaultFilter,
  useDelete,
  useCreate,
} from "@refinedev/core";
import {
  useDataGrid,
  NumberField,
  DateField,
  useAutocomplete,
  List,
} from "@refinedev/mui";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Autocomplete from "@mui/material/Autocomplete";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import {
  DataGrid,
  GridColumns,
  GridActionsCellItem,
  GridCellParams,
} from "@mui/x-data-grid";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { IOrder, IOrderFilterVariables } from "../../interfaces";
import { OrderStatus } from "../../components/order/OrderStatus";
import { OrderTypes } from "../../components/order/OrderTypes";
import { Edit } from "@mui/icons-material";
import { ShowOrder } from "./show";

import { useNavigate } from "react-router-dom";

export const ListOrdes: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();
  const { mutate: mutateCreate } = useCreate();

  //
  const navigate = useNavigate();
  const { dataGridProps, search, filters } = useDataGrid<
    IOrder,
    HttpError,
    IOrderFilterVariables
  >({
    initialPageSize: 10,
    sorters: {
      permanent: [
        {
          field: "code",
          order: "desc",
        },
      ],
    },
    meta: { populate: "*" },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { code, table, caisse, users_permissions_user, etat, type } =
        params;

      filters.push({
        field: "code",
        operator: "contains",
        value: code !== "" ? code : undefined,
      });

      filters.push({
        field: "table.id",
        operator: "eq",
        value: (table ?? [].length) > 0 ? table : undefined,
      });
      filters.push({
        field: "caisse.id",
        operator: "eq",
        value: (caisse ?? [].length) > 0 ? caisse : undefined,
      });

      filters.push({
        field: "users_permissions_user.id",
        operator: "eq",
        value: users_permissions_user,
      });

      filters.push({
        field: "etat",
        operator: "in",
        value: (etat ?? []).length > 0 ? etat : undefined,
      });
      filters.push({
        field: "type",
        operator: "in",
        value: (type ?? []).length > 0 ? type : undefined,
      });

      return filters;
    },
  });

  const columns = React.useMemo<GridColumns<IOrder>>(
    () => [
      {
        field: "code",
        headerName: "Commande",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "etat",
        headerName: "Etat",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return <OrderStatus status={row.etat} />;
        },
        flex: 1,
        minWidth: 90,
      },
      {
        field: "type",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return <OrderTypes status={row.type} />;
        },
        flex: 1,
        minWidth: 100,
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
              value={row.total}
              sx={{ fontSize: "14px" }}
            />
          );
        },
        flex: 1,
        minWidth: 120,
      },
      {
        field: "table",
        headerName: "Table",
        valueGetter: ({ row }) => row?.table?.nom,
        flex: 1,
        minWidth: 90,
      },
      {
        field: "caisse",
        headerName: "Caisse",
        valueGetter: ({ row }) => row?.caisse?.nom,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "user",
        headerName: "User",
        valueGetter: ({ row }) => row?.users_permissions_user?.username,
        flex: 1,
        minWidth: 100,
      },

      {
        field: "createdAt",
        headerName: "Date-Creation",
        flex: 1,
        minWidth: 120,
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row.createdAt}
              format="LL"
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
        minWidth: 150,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { row, id } = params;
          if (row.etat === "En cours") {
            return (
              <>
                <GridActionsCellItem
                  key={2}
                  icon={<CheckOutlinedIcon color="success" />}
                  sx={{ padding: "2px 6px", color: "#4caf50" }}
                  label=""
                  showInMenu
                  onClick={() => {
                    mutate({
                      resource: "commandes",
                      id,
                      values: {
                        etat: "Validé",
                      },
                    });
                    mutateCreate({
                      resource: "tresoriers",
                      values: {
                        type: "Vente",
                        titre: "Vente",
                        user: row?.users_permissions_user?.id,
                        montant: row?.total,
                      },
                    });
                  }}
                />

                <GridActionsCellItem
                  key={2}
                  icon={<Edit color="warning" />}
                  sx={{ padding: "2px 6px", color: "#ff9800" }}
                  label=""
                  showInMenu
                  onClick={() => {
                    navigate("/menus?selectedOrder=" + params.row.id);
                  }}
                />

                <GridActionsCellItem
                  key={2}
                  icon={<CloseOutlinedIcon color="error" />}
                  sx={{ padding: "2px 6px", color: "#f44336" }}
                  label=""
                  showInMenu
                  onClick={() => {
                    mutate({
                      resource: "commandes",
                      id,
                      values: {
                        etat: "Annulé",
                      },
                    });
                  }}
                />
              </>
            );
          } else if (row.etat === "Annulé") {
            return (
              <>
                <GridActionsCellItem
                  key={2}
                  icon={<Edit color="warning" />}
                  sx={{ padding: "2px 6px", color: "#ff9800" }}
                  label=""
                  showInMenu
                  onClick={() => {
                    navigate("/menus?selectedOrder=" + params.row.id);
                  }}
                />
              </>
            );
          }
        },
      },
    ],
    []
  );

  const { show } = useNavigation();

  const { register, handleSubmit, control } = useForm<
    BaseRecord,
    HttpError,
    IOrderFilterVariables
  >({
    defaultValues: {
      etat: getDefaultFilter("etat", filters, "in"),
      type: getDefaultFilter("type", filters, "in"),
      code: getDefaultFilter("code", filters, "contains"),
      table: getDefaultFilter("table.id", filters, "eq"),
      caisse: getDefaultFilter("caisse.id", filters, "eq"),
      users_permissions_user: getDefaultFilter(
        "users_permissions_user.id",
        filters,
        "eq"
      ),
    },
  });

  const { autocompleteProps: tableAutocompleteProps } = useAutocomplete({
    resource: "tables",
    defaultValue: getDefaultFilter("table.id", filters, "eq"),
  });
  const { autocompleteProps: caisseAutocompleteProps } = useAutocomplete({
    resource: "caisses",
    defaultValue: getDefaultFilter("caisse.id", filters, "eq"),
  });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
    defaultValue: getDefaultFilter("users_permissions_user.id", filters, "eq"),
  });

  //
  const [selectedRowId, setSelectedRowId] = React.useState<number>();

  const createDrawerFormProps = useModalForm<IOrder, HttpError, IOrder>({
    refineCoreProps: {},
  });

  const {
    modal: { show: showOrderDrawer },
  } = createDrawerFormProps;
  //
  return (
    <>
      {/* <EditOrder id={selectedRowId}/> */}
      <ShowOrder id={selectedRowId} {...createDrawerFormProps} />
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
                  {...register("code")}
                  label="Recherche"
                  placeholder="N° Commande"
                  margin="normal"
                  fullWidth
                  autoFocus
                  size="small"
                />
                <Controller
                  control={control}
                  name="table"
                  render={({ field }) => (
                    <Autocomplete
                      {...tableAutocompleteProps}
                      {...field}
                      // onChange={(_, value) => {
                      //   field.onChange(value.map((p) => p.nom ?? p));
                      // }}
                      onChange={(_, value) => {
                        field.onChange(value?.id ?? value);
                      }}
                      getOptionLabel={(item) => {
                        return item?.nom ? item.nom : item;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.id?.toString() ===
                          (value?.id ?? value)?.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Table"
                          placeholder="Table"
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
                  name="caisse"
                  render={({ field }) => (
                    <Autocomplete
                      {...caisseAutocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value?.id ?? value);
                      }}
                      getOptionLabel={(item) => {
                        return item?.nom ? item.nom : item;
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.id?.toString() ===
                          (value?.id ?? value)?.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Caisse"
                          placeholder="Caisse"
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
                  name="users_permissions_user"
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
                <Controller
                  control={control}
                  name="etat"
                  render={({ field }) => (
                    <Autocomplete
                      {...userAutocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value);
                      }}
                      options={["Validé", "En cours", "Annulé"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Etat"
                          placeholder="Etat"
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
                  name="type"
                  render={({ field }) => (
                    <Autocomplete
                      {...userAutocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value);
                      }}
                      options={["Emporté", "Sur place"]}
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
            createButtonProps={{
              sx: {
                display: "none",
              },
            }}
          >
            <DataGrid
              {...dataGridProps}
              columns={columns}
              filterModel={undefined}
              autoHeight
              // onRowClick={({ id }) => {
              //   showOrderDrawer(id);
              //   setSelectedRowId(id)
              //   console.log(id)
              // }}
              onRowClick={(params) => {
                const rowId = Number(params.id); // Convert the id to a number
                setSelectedRowId(rowId);
                showOrderDrawer(rowId);
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
