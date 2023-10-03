import React from "react";
import { Button, Popover } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import { DateField, List, useDataGrid } from "@refinedev/mui";
import { CrudFilters, HttpError } from "@refinedev/core";
import { IStock } from "interfaces";
import { useNavigate } from "react-router-dom";
import { useForm } from "@refinedev/react-hook-form";
import moment from "moment";
import { CalendarToday } from "@mui/icons-material";

export const StockList = () => {
  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  //
  const [periode, setPeriode] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //
  const { dataGridProps, search } = useDataGrid<IStock, HttpError>({
    initialPageSize: 10,
    meta: { populate: "deep" },
    onSearch: () => {
      const filters: CrudFilters = [];

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
      return filters;
    },
  });

  const columns = React.useMemo<GridColDef<IStock>[]>(
    () => [
      {
        field: "id",
        headerName: "Stock ID",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 60,
      },
      {
        field: "nom",
        headerName: "Ingredients",
        headerAlign: "center",
        align: "center",
        flex: 1,
        valueGetter: (params) => {
          return params.row?.ingredient?.nom;
        },
        minWidth: 200,
      },
      {
        field: "quantite",
        headerName: "Quantite",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "publishedAt",
        headerAlign: "center",
        align: "center",
        headerName: "Date de création",
        type: "date",
        minWidth: 200,
        valueGetter: (params) => {
          return new Date(params.row.publishedAt);
        },
        renderCell(params) {
          return (
            <DateField
              value={params.value}
              format="LLL"
              sx={{ fontSize: "14px" }}
            />
          );
        },
        // renderCell(params) {
        //   return (
        //     <Typography>{dayjs(params.value).format("DD-MM-YYYY")}</Typography>
        //   );
        // },
      },
    ],
    []
  );
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
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };
  //
  return (
    <List
      wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
      createButtonProps={{
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
        {`${moment(periode[0].startDate).format("DD/MM/YYYY")} → ${moment(
          periode[0].endDate
        ).format("DD/MM/YYYY")}`}
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
      <DataGrid
        {...dataGridProps}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        columns={columns}
        // onCellClick={(params: GridCellParams) => {
        //   navigate(`product/${params.row?.article?.data?.id}`, {
        //     state: { data: params.row },
        //   });
        // }}
        autoHeight
        sx={{
          fontSize: 14,
          ...dataGridProps.sx,
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </List>
  );
};
