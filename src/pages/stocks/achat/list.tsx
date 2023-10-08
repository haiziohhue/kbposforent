import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  CrudFilters,
  useUpdate,
} from "@refinedev/core";
import {
  useDataGrid,
  List,
  CreateButton,
  DateField,
  RefreshButton,
} from "@refinedev/mui";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { CalendarToday, Cancel, Delete, Edit } from "@mui/icons-material";
import { IAchat } from "../../../interfaces";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { CreateAchat } from "./create";
import { EditAchat } from "./edit";
import moment from "moment";
import { Button, Popover } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { BonChefAchatStatus } from "../../../components/order/BonChefAchatStatus";

export const ListAchat: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();
  const { handleSubmit } = useForm();
  const [selectedRowId, setSelectedRowId] = React.useState<number>();
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
  const { dataGridProps, search } = useDataGrid<IAchat, HttpError>({
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
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColDef<IAchat>[]>(
    () => [
      {
        field: "id",
        headerName: "N°Achat",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "etat",
        headerName: "Etat",
        headerAlign: "center",
        align: "center",
        renderCell: function render({ row }) {
          return <BonChefAchatStatus status={row?.etat} />;
        },
        flex: 1,
        minWidth: 90,
      },
      {
        field: "source",
        headerName: "Source",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "total",
        headerName: "Total",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "createdAt",
        headerName: "Date de Creation",
        flex: 1,
        width: 200,
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row?.createdAt}
              format="LLL"
              sx={{ fontSize: "14px" }}
            />
          );
        },
      },
      {
        field: "note",
        headerName: "Note",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 100,
        sortable: false,
        getActions: ({ row, id }) => [
          <GridActionsCellItem
            key={1}
            label=""
            icon={<Edit color="success" />}
            onClick={() => {
              showEditModal(row.id), setSelectedRowId(row.id);
            }}
          />,

          <GridActionsCellItem
            key={2}
            // icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: "2px 6px" }}
            label=""
            icon={<Cancel color="error" />}
            onClick={() => {
              mutate({
                resource: "achats",
                id,
                mutationMode: "undoable",
                undoableTimeout: 10000,
                values: {
                  etat: "Annulé",
                },
              });
            }}
          />,
        ],
      },
    ],
    []
  );

  //
  const createDrawerFormProps = useModalForm<IAchat, HttpError, IAchat>({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IAchat, HttpError, IAchat>({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
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
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };
  //
  return (
    <>
      <CreateAchat {...createDrawerFormProps} />
      <EditAchat id={selectedRowId} {...editDrawerFormProps} />
      <Grid container spacing={2}>
        {/* <Grid item xs={12} lg={3}></Grid> */}
        <Grid item xs={12} lg={12}>
          <List
            wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
            headerButtons={
              <>
                <CreateButton
                  onClick={() => showCreateModal()}
                  variant="contained"
                  sx={{ marginBottom: "5px" }}
                >
                  Ajouter
                </CreateButton>
                <RefreshButton onClick={() => window.location.reload()} />
              </>
            }
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
              columns={columns}
              filterModel={undefined}
              autoHeight
              pageSizeOptions={[5, 10, 20, 50, 100]}
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
