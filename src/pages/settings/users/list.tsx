import React from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useNavigation,
  useUpdate,
  useExport,
  useDelete,
} from "@refinedev/core";
import { useDataGrid, List, ExportButton, CreateButton } from "@refinedev/mui";

import Grid from "@mui/material/Grid";

import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";

import { IUser } from "../../../interfaces";
import { API_URL } from "../../../constants";
import { Avatar } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export const ListUsers: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();
  const { edit } = useNavigation();
  const { mutate: mutateDelete } = useDelete();
  const { dataGridProps, search, filters } = useDataGrid<IUser, HttpError>({
    initialPageSize: 10,
    meta: { populate: "*" },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<IUser>>(
    () => [
      {
        field: "username",
        headerName: "UserName",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },

      {
        field: "photo",
        headerName: "Avatar",
        renderCell: function render({ row }) {
          return <Avatar src={`${API_URL}${row.photo?.url}`} />;
        },

        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 80,
      },

      {
        field: "nom",
        headerName: "Nom",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },

      {
        field: "prenom",
        headerName: "Prenom",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      {
        field: "phone",
        headerName: "N° Tel",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 90,
      },
      // {
      //   field: "role",
      //   headerName: "Role",
      //   valueGetter: ({ row }) => row?.role?.name,
      //   flex: 1,
      //   minWidth: 150,
      //   sortable: false,
      // },
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
            onClick={() => edit("users", row.id)}
          />,

          <GridActionsCellItem
            key={2}
            // icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: "2px 6px" }}
            label=""
            icon={<Delete color="error" />}
            onClick={() => {
              mutateDelete({
                resource: "users",
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

  const { isLoading, triggerExport } = useExport<IUser>({
    filters,
    pageSize: 50,
    maxItemCount: 50,
    mapData: (item) => {
      return {
        id: item.id,
        username: item.username,
        nom: item.nom,
        prenom: item.prenom,
        email: item.email,
        phone: item.phone,
        date_naissance: item.date_naissance,
        adresse: item.adresse,
      };
    },
  });

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} lg={3}></Grid> */}
      <Grid item xs={12} lg={12}>
        <List
          wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
          headerProps={{
            // action: (
            //   <ExportButton onClick={triggerExport} loading={isLoading} />
            // ),
          }}
          headerButtons={
            <CreateButton variant="contained" sx={{ marginBottom: "5px" }}>
              Ajouter Utilisateur
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
  );
};
