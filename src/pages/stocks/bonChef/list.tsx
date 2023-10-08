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
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridCellParams,
} from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import { CalendarToday, Cancel, Close, Edit, Reply } from "@mui/icons-material";
import { IBC } from "../../../interfaces";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { CreateBC } from "./create";
import { EditBC } from "./edit";
import axios from "axios";
import { API_URL } from "../../../constants";
import moment from "moment";
import { Button, Popover } from "@mui/material";
import { BonChefAchatStatus } from "../../../components/order/BonChefAchatStatus";
import { RestBC } from "./reste";

export const ListBC: React.FC<IResourceComponentsProps> = () => {
  // const { mutate: mutateDelete } = useDelete();
  const { mutate } = useUpdate();
  const { handleSubmit } = useForm();
  const [responseData, setResponseData] = React.useState<any[]>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<number>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState(false);
  //
  const [periode, setPeriode] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //
  const { dataGridProps, search } = useDataGrid<IBC, HttpError>({
    initialPageSize: 10,
    syncWithLocation: true,
    liveMode: "auto",
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
  //
  const updateData = (newData) => {
    const updatedData = [...responseData, newData];
    setResponseData(updatedData);
  };

  // React.useEffect(() => {
  //   axios
  //     .get(`${API_URL}/api/bon-chefs?populate=*`)
  //     .then((response) => {
  //       const responseData = response?.data?.data;
  //       const filteredData = responseData?.map((item) => ({
  //         id: item?.id,
  //         ...item?.attributes,
  //         chef: item?.attributes?.chef?.data?.attributes?.chef,
  //       }));

  //       setResponseData(filteredData);
  //       setFilteredData(filteredData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data from API", error);
  //     });
  // }, []);
  const fetchData = () => {
    axios
      .get(
        `${API_URL}/api/bon-chefs??pagination[page]=1&pagination[pageSize]=10&populate=deep&sort=id%3Adesc&`
      )
      .then((response) => {
        const responseData = response?.data?.data;
        setRefresh(true);
        console.log("Request succeeded:", responseData);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  };

  // React.useEffect(() => {
  //   fetchData();
  // }, []);
  console.log(responseData);
  //
  const columns = React.useMemo<GridColDef<IBC>[]>(
    () => [
      {
        field: "id",
        headerName: "N° Bon",
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
        field: "chef",
        headerName: "Chef",
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => row?.chef?.chef,
        flex: 1,
        minWidth: 90,
      },

      {
        field: "createdAt",
        headerName: "Date de Creation",
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
          const { row, id } = params;
          if (row.etat === "Validé") {
            return (
              <>
                <GridActionsCellItem
                  key={1}
                  label=""
                  icon={<Edit color="success" />}
                  onClick={() => {
                    showEditModal(row.id), setSelectedRowId(row.id);
                  }}
                />
                <GridActionsCellItem
                  key={2}
                  label=""
                  icon={<Reply color="warning" />}
                  onClick={() => {
                    showRestModal(row.id), setSelectedRowId(row.id);
                  }}
                />
                <GridActionsCellItem
                  key={3}
                  // icon={<CloseOutlinedIcon color="error" />}
                  sx={{ padding: "2px 6px" }}
                  label=""
                  icon={<Cancel color="error" />}
                  onClick={() => {
                    mutate({
                      resource: "bon-chefs",
                      id,
                      mutationMode: "undoable",
                      undoableTimeout: 10000,
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
              <GridActionsCellItem
                key={1}
                label=""
                icon={<Edit color="success" />}
                onClick={() => {
                  showEditModal(row.id), setSelectedRowId(row.id);
                }}
              />
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
      //   getActions: ({ row, id }) => [
      //     <GridActionsCellItem
      //       key={1}
      //       label=""
      //       icon={<Edit color="success" />}
      //       onClick={() => {
      //         showEditModal(row.id), setSelectedRowId(row.id);
      //       }}
      //     />,
      //     <GridActionsCellItem
      //       key={1}
      //       label=""
      //       icon={<KeyboardReturn color="warning" />}
      //       onClick={() => {
      //         showRestModal(row.id), setSelectedRowId(row.id);
      //       }}
      //     />,

      //     <GridActionsCellItem
      //       key={2}
      //       // icon={<CloseOutlinedIcon color="error" />}
      //       sx={{ padding: "2px 6px" }}
      //       label=""
      //       icon={<Close color="error" />}
      //       onClick={() => {
      //         mutate({
      //           resource: "bon-chefs",
      //           id,
      //           mutationMode: "undoable",
      //           undoableTimeout: 10000,
      //           values: {
      //             etat: "Annulé",
      //           },
      //         });
      //       }}
      //     />,
      //   ],
      // },
    ],
    []
  );

  //
  const createDrawerFormProps = useModalForm<IBC, HttpError, IBC>({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IBC, HttpError, IBC>({
    refineCoreProps: { action: "edit", meta: { populate: "deep" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;

  const restDrawerFormProps = useModalForm<IBC, HttpError, IBC>({
    refineCoreProps: { action: "edit", meta: { populate: "deep" } },
  });

  const {
    modal: { show: showRestModal },
  } = restDrawerFormProps;
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
    const filtered = responseData.filter((item) => {
      const createdAt = moment(item.createdAt);
      return createdAt.isBetween(
        moment(periode[0].startDate).startOf("day"),
        moment(periode[0].endDate).endOf("day")
      );
    });
    setFilteredData(filtered);
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
      <CreateBC {...createDrawerFormProps} updateData={updateData} />
      <EditBC id={selectedRowId} {...editDrawerFormProps} />
      <RestBC id={selectedRowId} {...restDrawerFormProps} />
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
              // rows={filteredData}
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
