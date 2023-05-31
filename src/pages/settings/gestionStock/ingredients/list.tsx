import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useNavigation,
  useUpdate,
  useDelete,
} from "@refinedev/core";
import { useDataGrid, List, CreateButton, DateField } from "@refinedev/mui";

import Grid from "@mui/material/Grid";

import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";

import { Avatar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { IIngredients } from "../../../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateIngredient } from "./create";

export const ListIngredients: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();
  const { edit } = useNavigation();
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps, search, filters } = useDataGrid<
    IIngredients,
    HttpError
  >({
    initialPageSize: 10,
    meta: { populate: "*" },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<IIngredients>>(
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
        field: "quantite",
        headerName: "Quantite",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "cout",
        headerName: "Cout",
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
        field: "createdAt",
        headerName: "Date d'Expiration",
        flex: 1,
        minWidth: 170,
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row.date_expiration}
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
        getActions: ({ row }) => [
          <GridActionsCellItem
            key={1}
            label=""
            icon={<Edit color="success" />}
            onClick={() => edit("ingredients", row.id)}
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

  const { show } = useNavigation();

  // const { isLoading, triggerExport } = useExport<IUser>({
  //   filters,
  //   pageSize: 50,
  //   maxItemCount: 50,
  //   mapData: (item) => {
  //     return {
  //       id: item.id,
  //       username: item.username,
  //       nom: item.nom,
  //       prenom: item.prenom,
  //       email: item.email,
  //       phone: item.phone,
  //       date_naissance: item.date_naissance,
  //       adresse: item.adresse,
  //     };
  //   },
  // });

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

  //
  return (
    <>
      <CreateIngredient {...createDrawerFormProps} />
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
            <DataGrid
              {...dataGridProps}
              columns={columns}
              filterModel={undefined}
              autoHeight
              onRowClick={({ id }) => {
                show("users", id);
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
