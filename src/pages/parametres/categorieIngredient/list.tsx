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
import { ICatIngredients, ICategory, IIngredients } from "../../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateCatIngredients } from "./create";
import { EditCatIngredients } from "./edit";

export const ListCatIngredients: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const [selectedRowId, setSelectedRowId] = React.useState<number>();
  const { dataGridProps } = useDataGrid<ICatIngredients, HttpError>({
    initialPageSize: 10,
    meta: { populate: "deep" },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColDef<ICatIngredients>[]>(
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
        field: "ingredients",
        headerName: "Ingredients",
        headerAlign: "center",
        valueGetter: ({ row }) =>
          row?.ingredients?.map((ing: any) => ing?.ingredient?.nom),
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
                resource: "categorie-ingredients",
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
    ICatIngredients,
    HttpError,
    ICatIngredients
  >({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<
    ICatIngredients,
    HttpError,
    ICatIngredients
  >({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
  //
  return (
    <>
      <CreateCatIngredients {...createDrawerFormProps} />
      <EditCatIngredients {...editDrawerFormProps} id={selectedRowId} />
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
              // rowsPerPageOptions={[10, 20, 50, 100]}
              pageSizeOptions={[10, 20, 50, 100]}
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
