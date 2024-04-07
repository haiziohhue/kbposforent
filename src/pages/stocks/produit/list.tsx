import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useDelete,
} from "@refinedev/core";
import { useDataGrid, List, CreateButton } from "@refinedev/mui";
import Grid from "@mui/material/Grid";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { IIngredients } from "../../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateIngredient } from "./create";
import { EditIngredient } from "./edit";
import { Box } from "@mui/material";

export const ListIngredients: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps } = useDataGrid<IIngredients, HttpError>({
    initialPageSize: 10,
    meta: { populate: "*" },
    filters: {
      permanent: [
        {
          field: "deleted",
          operator: "eq",
          value: "false",
        },
      ],
    },
  });

  const columns = React.useMemo<GridColDef<IIngredients>[]>(
    () => [
      {
        field: "nom",
        headerName: "Nom",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "unite",
        headerName: "Unité de Mesure",
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => row.unite?.unite,
        flex: 1,
        minWidth: 90,
      },
      {
        field: "description",
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
                resource: "ingredients",
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
  const createDrawerFormProps = useModalForm<
    IIngredients,
    HttpError,
    IIngredients
  >({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<
    IIngredients,
    HttpError,
    IIngredients
  >({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
  //
  return (
    <>
      <CreateIngredient {...createDrawerFormProps} />
      <EditIngredient {...editDrawerFormProps} />
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
                Ajouter Ingredient
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
            <Box
              sx={{
                maxHeight: 500,
                overflow: "auto",
              }}
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
            </Box>
          </List>
        </Grid>
      </Grid>
    </>
  );
};
