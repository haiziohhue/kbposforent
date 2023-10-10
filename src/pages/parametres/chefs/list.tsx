import { Delete, Edit } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
} from "@refinedev/core";
import { CreateButton, List, useDataGrid } from "@refinedev/mui";
import { useModalForm } from "@refinedev/react-hook-form";
import { ICategory, IChef } from "interfaces";
import React from "react";
import { CreateChef } from "./create";
import { EditChef } from "./edit";

export const ListChefs: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps } = useDataGrid<IChef, HttpError>({
    initialPageSize: 10,
    meta: { populate: "*" },
  });

  const columns = React.useMemo<GridColDef<IChef>[]>(
    () => [
      {
        field: "chef",
        headerName: "Chef",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "categories",
        headerName: "Categories",
        headerAlign: "center",
        valueGetter: ({ row }) =>
          row?.categories?.map((cat: ICategory) => cat?.nom),
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
            onClick={() => showEditModal(row.id)}
          />,

          <GridActionsCellItem
            key={2}
            // icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: "2px 6px" }}
            label=""
            icon={<Delete color="error" />}
            onClick={() => {
              mutateDelete({
                resource: "chefs",
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
  const createDrawerFormProps = useModalForm<IChef, HttpError, IChef>({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IChef, HttpError, IChef>({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;

  //
  return (
    <>
      <CreateChef {...createDrawerFormProps} />
      <EditChef {...editDrawerFormProps} />
      <Grid container spacing={2}>
        {/* <Grid item xs={12} lg={3}></Grid> */}
        <Grid item xs={12} lg={12}>
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
                Ajouter Chef
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
