import React, { useState } from "react";
import {
  IResourceComponentsProps,
  BaseRecord,
  HttpError,
  getDefaultFilter,
  CrudFilters,
} from "@refinedev/core";
import {
  useDataGrid,
  DateField,
  useAutocomplete,
  List,
  NumberField,
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { ICaisseLogs, ICaisseLogsFilterVariables } from "../../interfaces";
import { CalendarToday } from "@mui/icons-material";
import { Popover, Stack, Typography } from "@mui/material";
import moment from "moment";
import { CaisseStatus } from "../../components/order/CaisseStatus";

export const ListCaissesLogs: React.FC<IResourceComponentsProps> = () => {
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
    ICaisseLogs,
    HttpError,
    ICaisseLogsFilterVariables
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
    meta: { populate: "deep" },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { etat, user, caisse } = params;

      filters.push({
        field: "etat",
        operator: "in",
        value: (etat ?? []).length > 0 ? etat : undefined,
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
  console.log(dataGridProps.rows);
  //
  function calculateTotal(data) {
    if (data && data.ventes !== undefined && data.depenses !== undefined) {
      const total = data.ventes + data.solde_ouverture - data.depenses;
      return total;
    }
    return null;
  }
  //
  const columns = React.useMemo<GridColDef<ICaisseLogs>[]>(
    () => [
      {
        field: "id",
        headerName: "N° Operation",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
        footerClassName: "hide-from-footer",
      },
      {
        field: "createdAt",
        headerName: "Date d'ouverture",
        flex: 1,
        minWidth: 170,
        footerClassName: "hide-from-footer",
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row?.createdAt}
              format="LLL"
              sx={{ fontSize: "12px" }}
            />
          );
        },
      },
      {
        field: "date_cloture",
        headerName: "Date de Clôture",
        flex: 1,
        minWidth: 170,
        footerClassName: "hide-from-footer",
        renderCell: function render({ row }) {
          if (row?.date_cloture) {
            return (
              <DateField
                value={row?.date_cloture}
                format="LLL"
                sx={{ fontSize: "12px" }}
              />
            );
          } else {
            return null;
          }
        },
      },
      {
        field: "caisse",
        headerName: "Caisse",
        headerAlign: "center",
        footerClassName: "hide-from-footer",
        valueGetter: ({ row }) => row?.caisse?.nom,
        flex: 1,
        align: "center",
        minWidth: 100,
      },
      {
        field: "etat",
        headerName: "Etat",
        headerAlign: "center",
        align: "center",
        footerClassName: "hide-from-footer",
        renderCell: function render({ row }) {
          return <CaisseStatus status={row?.etat} />;
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: "user",
        headerName: "Utilisateur",
        footerClassName: "hide-from-footer",
        valueGetter: ({ row }) => row.user?.username,
        flex: 1,

        minWidth: 90,
        sortable: false,
      },
      {
        field: "solde_ouverture",
        headerName: "Solde d'Ouverture",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: "DZD",
                style: "currency",
              }}
              value={row?.solde_ouverture}
              sx={{ fontSize: "12px" }}
            />
          );
        },
        flex: 1,
        minWidth: 120,
      },
      {
        field: "ventes",
        headerName: "Ventes",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: "DZD",
                style: "currency",
              }}
              value={row?.ventes}
              sx={{ fontSize: "12px" }}
            />
          );
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: "depenses",
        headerName: "Depenses",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: "DZD",
                style: "currency",
              }}
              value={row?.depenses}
              sx={{ fontSize: "12px" }}
            />
          );
        },
        flex: 1,
        minWidth: 100,
      },
      // {
      //   field: "solde_cloture",
      //   headerName: "Totale CA",
      //   headerAlign: "center",
      //   align: "center",
      //   renderCell: function render({ row }) {
      //     return (
      //       <NumberField
      //         options={{
      //           currency: "DZD",
      //           style: "currency",
      //         }}
      //         value={row?.solde_cloture}
      //         sx={{ fontSize: "12px" }}
      //       />
      //     );
      //   },
      //   flex: 1,
      //   minWidth: 150,
      // },
      {
        field: "solde_cloture",
        headerName: "Totale CA",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          if (row?.solde_cloture === null) {
            const total = calculateTotal(row);
            return (
              <NumberField
                options={{
                  currency: "DZD",
                  style: "currency",
                }}
                value={total !== null ? total : 0}
                sx={{ fontSize: "12px" }}
              />
            );
          } else {
            return (
              <NumberField
                options={{
                  currency: "DZD",
                  style: "currency",
                }}
                value={row?.solde_cloture}
                sx={{ fontSize: "12px" }}
              />
            );
          }
        },
        flex: 1,
        minWidth: 150,
      },
    ],
    []
  );

  const { register, handleSubmit, control } = useForm<
    BaseRecord,
    HttpError,
    ICaisseLogsFilterVariables
  >({
    defaultValues: {
      etat: getDefaultFilter("etat", filters, "in"),
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

  // const calculateTotalSum = (rows: ICaisseLogs[]): number => {
  //   return rows.reduce(
  //     (sum, row) => sum + parseInt(row.montant?.toString(), 10),
  //     0
  //   );
  // };
  // const formattedNumber = new Intl.NumberFormat("en-DZ", {
  //   style: "currency",
  //   currency: "DZD",
  //   minimumFractionDigits: 2,
  // }).format(calculateTotalSum(dataGridProps.rows as ICaisseLogs[]));

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
  const formatter = new Intl.NumberFormat("en-DZ", {
    style: "currency",
    currency: "DZD",
  });
  //
  const calculateTotalSumSO = (rows: ICaisseLogs | ICaisseLogs[]): number => {
    if (Array.isArray(rows)) {
      return rows.reduce((sum, row) => sum + (row.solde_ouverture || 0), 0);
    } else {
      return rows.solde_ouverture || 0;
    }
  };

  //
  function calculateColumnSum(rows, columnNames) {
    return columnNames?.reduce((totalSums, columnName) => {
      const columnSum = rows?.reduce(
        (sum, row) => sum + (row[columnName] || 0),
        0
      );
      totalSums[columnName] = columnSum;
      return totalSums;
    }, {});
  }
  formatter.format(calculateTotalSumSO(dataGridProps.rows as ICaisseLogs[]));
  //
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={2}>
          <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
            <CardHeader title="Filtrer" />
            <CardContent sx={{ pt: 0 }}>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
                onSubmit={handleSubmit(search)}
              >
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
                      options={["Ouverte", "Fermé"]}
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
          {/* <Box sx={{ mt: 10 }}>
            <TextField
              label="Totale"
              value={formattedNumber}
              disabled
              fullWidth
            />
          </Box> */}
        </Grid>
        <Grid item xs={12} lg={10}>
          <List
            wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
            headerProps={{
              sx: {
                display: "none",
              },
            }}
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
            <Stack>
              <div style={{ maxHeight: 400, width: "100%" }}>
                <DataGrid
                  {...dataGridProps}
                  columns={columns}
                  filterModel={undefined}
                  autoHeight
                  pageSizeOptions={[10, 20, 50, 100]}
                  slots={{
                    footer: function CustomFooter() {
                      const columnsToSum = [
                        "solde_ouverture",
                        "ventes",
                        "depenses",
                        "solde_cloture",
                      ];

                      const totalSums = calculateColumnSum(
                        dataGridProps.rows as ICaisseLogs[],
                        columnsToSum
                      );
                      // Calculate the custom total for the "Totale CA" column
                      let customTotalCA: number | null = 0;
                      if (totalSums["solde_cloture"] === 0) {
                        customTotalCA = calculateTotal({
                          ventes: totalSums["ventes"],
                          solde_ouverture: totalSums["solde_ouverture"],
                          depenses: totalSums["depenses"],
                        });
                      } else {
                        customTotalCA = totalSums["solde_cloture"];
                      }
                      // Render the custom summary row
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: "12px",
                            padding: "8px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            border: "1px solid",
                            borderColor: "#A73A38",
                            borderRadius: "6px",
                          }}
                        >
                          <Typography>Totaux</Typography>
                          {columns.map((column) => (
                            <div
                              key={column.field}
                              style={{
                                flex: 1,
                                textAlign: "center",
                                color:
                                  column.field === "ventes" ||
                                  column.field === "depenses" ||
                                  column.field === "solde_ouverture" ||
                                  column.field === "solde_cloture"
                                    ? "#FFF"
                                    : "#1E1E1E",
                              }}
                            >
                              <Typography> {column.headerName}:</Typography>
                              <br />
                              {column.field === "solde_cloture" ? (
                                // Display the custom total for the "Totale CA" column
                                <Typography>
                                  {formatter.format(customTotalCA)}
                                </Typography>
                              ) : (
                                // Display totals for other columns
                                <Typography>
                                  {formatter.format(totalSums[column.field])}
                                </Typography>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    },
                  }}
                />
              </div>
            </Stack>
          </List>
        </Grid>
      </Grid>
    </>
  );
};
