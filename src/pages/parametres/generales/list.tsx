import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useNavigation,
  useDelete,
  useBack,
} from "@refinedev/core";
import { useDataGrid, List, CreateButton, DateField } from "@refinedev/mui";

import Grid from "@mui/material/Grid";

import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";

import { Delete, Edit } from "@mui/icons-material";

import { useModalForm } from "@refinedev/react-hook-form";

import { IGeneraleDta } from "../../../interfaces";
import { CreateRestaurantData } from "./create";
import { EditRestaurantData } from "./edit";
import { Button } from "@mui/material";

export const ListRestaurantData: React.FC<IResourceComponentsProps> = () => {
  const { edit } = useNavigation();
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps } = useDataGrid<IGeneraleDta, HttpError>({
    initialPageSize: 10,
    meta: { populate: "*" },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<IGeneraleDta>>(
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
        field: "adresse",
        headerName: "Adresse",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "phone1",
        headerName: "N°Tel",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "phone2",
        headerName: "N°Tel",
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
                resource: "data-restaurants",
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

  //
  const createDrawerFormProps = useModalForm<
    IGeneraleDta,
    HttpError,
    IGeneraleDta
  >({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<
    IGeneraleDta,
    HttpError,
    IGeneraleDta
  >({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;

  //
  return (
    <>
      <CreateRestaurantData {...createDrawerFormProps} />
      <EditRestaurantData {...editDrawerFormProps} />
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
