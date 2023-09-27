import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useDelete,
} from "@refinedev/core";
import { useDataGrid, List, CreateButton, DateField } from "@refinedev/mui";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { IAchat } from "../../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateAchat } from "./create";
import { EditAchat } from "./edit";

export const ListAchat: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const [selectedRowId, setSelectedRowId] = React.useState<number>();
  const { dataGridProps } = useDataGrid<IAchat, HttpError>({
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
        minWidth: 170,
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
        getActions: ({ row }) => [
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
            icon={<Delete color="error" />}
            onClick={() => {
              mutateDelete({
                resource: "achats",
                id: row.id,
                mutationMode: "undoable",
                undoableTimeout: 10000,
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
              <CreateButton
                onClick={() => showCreateModal()}
                variant="contained"
                sx={{ marginBottom: "5px" }}
              >
                Ajouter
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
