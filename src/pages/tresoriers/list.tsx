import React, { useState } from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  CrudFilters,
  HttpError,
  getDefaultFilter,
  useDelete,
} from "@refinedev/core";
import {
  useDataGrid,
  NumberField,
  DateField,
  useAutocomplete,
  List,
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
import { DateRangePicker } from "react-date-range";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
} from "@mui/x-data-grid";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { ITresor, ITresorFilterVariables } from "../../interfaces";

import { TresorTypes } from "../../components/tresor/TresorTypes";
import { CreateDepense } from "./create";
import { CalendarToday, Delete, Edit } from "@mui/icons-material";
import { EditDepense } from "./edit";
import { Popover } from "@mui/material";
import moment from "moment";

export const ListTresor: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  //
  const [periode, setPeriode] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  //
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
      const { titre, type, user, caisse } = params;

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
        field: "caisse.id",
        operator: "eq",
        value: (caisse ?? [].length) > 0 ? caisse : undefined,
      });
      filters.push({
        field: "user.id",
        operator: "eq",
        value: user,
      });
      if (periode[0].startDate && periode[0].endDate) {
        const startDate = moment(periode[0].startDate)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");
        const endDate = moment(periode[0].endDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");

        filters.push({
          field: "createdAt",
          operator: "between",
          value: [startDate, endDate],
        });
      }
      return filters;
    },
  });

  const columns = React.useMemo<GridColDef<ITresor>[]>(
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
        valueGetter: ({ row }) => row?.user?.username,
        flex: 1,
        minWidth: 100,
        sortable: false,
      },
      {
        field: "caisse",
        headerName: "Caisse",
        valueGetter: ({ row }) => row?.caisse?.nom,
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
    ],
    []
  );

  const { register, handleSubmit, control } = useForm<
    BaseRecord,
    HttpError,
    ITresorFilterVariables
  >({
    defaultValues: {
      titre: getDefaultFilter("titre", filters, "eq"),
      type: getDefaultFilter("type", filters, "in"),
      user: getDefaultFilter("user.id", filters, "eq"),
      caisse: getDefaultFilter("caisse.id", filters, "eq"),
    },
  });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: "users",
    defaultValue: getDefaultFilter("user.id", filters, "eq"),
  });
  const { autocompleteProps: caisseAutocompleteProps } = useAutocomplete({
    resource: "caisses",
    defaultValue: getDefaultFilter("caisse.id", filters, "eq"),
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

  const calculateTotalSum = (rows: ITresor[], targetType: string): number => {
    return rows.reduce((sum, row) => {
      if (row.type === targetType) {
        return sum + parseInt(row.montant.toString(), 10);
      }
      return sum;
    }, 0);
  };
  const totalSumDepense = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  }).format(calculateTotalSum(dataGridProps.rows as ITresor[], "Dépense"));
  const totalSumVente = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 2,
  }).format(calculateTotalSum(dataGridProps.rows as ITresor[], "Vente"));

  //

  //
  const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePicker = () => {
    setAnchorEl(null);
  };

  const applyDateRange = () => {
    closeDatePicker();
    handleSubmit(search)();
  };
  const clearDateSelection = () => {
    setPeriode([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
  };
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
          <Box
            sx={{ display: "flex", flexDirection: "column", mt: 10, gap: 3 }}
          >
            <TextField
              label="Totale Ventes"
              value={totalSumVente}
              disabled
              fullWidth
            />
            <TextField
              label="Totale Dépenses"
              value={totalSumDepense}
              disabled
              fullWidth
            />
            {/* <TextField
              label="Totale Dépense"
              value={totalSumDepense}
              disabled
              fullWidth
            /> */}
          </Box>
        </Grid>
        <Grid item xs={12} lg={9}>
          <List
            wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
            headerButtons={
              <CreateButton
                onClick={() => showCreateModal()}
                variant="contained"
                sx={{ marginBottom: "5px" }}
              >
                Ajouter Dépenses
              </CreateButton>
            }
          >
            <Button
              size="large"
              onClick={openDatePicker}
              startIcon={<CalendarToday />}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            >
              {periode[0].startDate && periode[0].endDate
                ? `${moment(periode[0].startDate).format(
                    "DD/MM/YYYY"
                  )} → ${moment(periode[0].endDate).format("DD/MM/YYYY")}`
                : "date de début → date de fin"}
            </Button>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={closeDatePicker}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DateRangePicker
                  onChange={(item) => setPeriode([item.selection])}
                  ranges={periode}
                  showSelectionPreview={false}
                  showPreview={false}
                />
                <Button
                  onClick={applyDateRange}
                  variant="contained"
                  style={{ marginTop: "16px" }}
                >
                  Appliquer
                </Button>
                <Button
                  onClick={clearDateSelection}
                  variant="contained"
                  style={{ marginTop: "16px" }}
                >
                  Effacer la sélection
                </Button>
              </div>
            </Popover>
            <Box
              sx={{
                height: 150 + 50 * dataGridProps?.rows?.length,
                maxHeight: 500,
                overflow: "auto",
              }}
            >
              <DataGrid
                {...dataGridProps}
                columns={columns}
                filterModel={undefined}
                autoHeight
                pageSizeOptions={[10, 20, 50, 100]}
                sx={{
                  ...dataGridProps.sx,
                  "& .MuiDataGrid-row": {
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </List>
        </Grid>
      </Grid>
    </>
  );
};
