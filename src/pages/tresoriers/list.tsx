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
  useDelete,
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

import {
  DataGrid,
  GridColumns,
  GridActionsCellItem,
  GridCellParams,
} from "@mui/x-data-grid";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { ITresor, ITresorFilterVariables } from "../../interfaces";

import { TresorTypes } from "../../components/tresor/TresorTypes";
import { CreateDepense } from "./create";
import { Delete, Edit } from "@mui/icons-material";
import { EditDepense } from "./edit";
import { InputAdornment } from "@mui/material";

export const ListTresor: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps, search, filters } = useDataGrid<
    ITresor,
    HttpError,
    ITresorFilterVariables
  >({
    initialPageSize: 10,
    sorters: {
      permanent: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
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
        value: user,
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
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridCellParams) => {
          const { row } = params;
          if (row.type === "Dépense") {
            return (
              <>
                <GridActionsCellItem
                  key={1}
                  label=""
                  icon={<Edit color="success" />}
                  onClick={() => showEditModal(row.id)}
                />

                <GridActionsCellItem
                  key={2}
                  sx={{ padding: "2px 6px" }}
                  label=""
                  icon={<Delete color="error" />}
                  onClick={() => {
                    mutateDelete({
                      resource: "tresoriers",
                      id: row.id,
                      mutationMode: "undoable",
                      undoableTimeout: 10000,
                    });
                  }}
                />
              </>
            );
          }
        },
      },
      // {
      //   field: "actions",
      //   type: "actions",
      //   headerName: "Actions",
      //   flex: 1,
      //   minWidth: 100,
      //   sortable: false,
      //   getActions: ({ row }) => [
      //     <GridActionsCellItem
      //       key={1}
      //       label=""
      //       icon={<Edit color="success" />}
      //       // onClick={() => edit("tresoriers", row.id)}
      //       onClick={()=> showEditModal(row.id)}
      //     />,

      //     <GridActionsCellItem
      //       key={2}
      //       // icon={<CloseOutlinedIcon color="error" />}
      //       sx={{ padding: "2px 6px" }}
      //       label=""
      //       icon={<Delete color="error" />}
      //       onClick={() => {
      //         mutateDelete({
      //           resource: "tresoriers",
      //           id: row.id,
      //           mutationMode: "undoable",
      //           undoableTimeout: 10000,
      //         });
      //       }}
      //     />,
      //   ],
      // },
    ],
    []
  );

  const { show } = useNavigation();

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
  const editDrawerFormProps = useModalForm<ITresor, HttpError, ITresor>({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
  //
  const calculateTotalSum = (rows: ITresor[]): number => {
    return rows.reduce(
      (sum, row) => sum + parseInt(row.montant.toString(), 10),
      0
    );
  };
  const formattedNumber = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  }).format(calculateTotalSum(dataGridProps.rows as ITresor[]));

  //
  return (
    <>
      <CreateDepense {...createDrawerFormProps} />
      <EditDepense {...editDrawerFormProps} />
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
          <Box sx={{ mt: 10 }}>
            {/* <TextField
            label="Total Sum"
            type="number"
            variant="outlined"
            value={formattedNumber}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">DZD</InputAdornment>
              ),
            }}
          /> */}
            <TextField
              label="Total"
              value={formattedNumber}
              disabled
              fullWidth
            />
          </Box>
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
                Ajouter Dépenses
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
