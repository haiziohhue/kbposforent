import React, { useEffect, useState } from "react";
import {
  IResourceComponentsProps,
  HttpError,
  useDelete,
} from "@refinedev/core";
import { useDataGrid, List, CreateButton, DateField } from "@refinedev/mui";

import Grid from "@mui/material/Grid";

import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

import { Delete, Edit } from "@mui/icons-material";
import { IBC } from "../../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateBC } from "./create";
import { EditBC } from "./edit";

import axios from "axios";
import { API_URL } from "../../../constants";

export const ListBC: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();

  const [responseData, setResponseData] = useState<any[]>([]);
  const [selectedRowId, setSelectedRowId] = React.useState<number>();

  const { dataGridProps } = useDataGrid<IBC, HttpError>({
    initialPageSize: 10,
    meta: { populate: "deep" },
  });

  //
  const updateData = (newData) => {
    const updatedData = [...responseData, newData];
    setResponseData(updatedData);
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/api/bon-chefs?populate=*`)
      .then((response) => {
        const responseData = response?.data?.data;
        setResponseData(
          responseData.map((item) => ({
            id: item?.id,
            ...item.attributes,
            chef: item.attributes.chef.data.attributes.chef,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);
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
        field: "chef",
        headerName: "Chef",
        headerAlign: "center",
        align: "center",
        // valueGetter: ({ row }) => row?.chef?.chef,
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
                resource: "bon-chefs",
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
  const createDrawerFormProps = useModalForm<IBC, HttpError, IBC>({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IBC, HttpError, IBC>({
    refineCoreProps: { action: "edit", meta: { populate: "*" } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
  //
  return (
    <>
      <CreateBC {...createDrawerFormProps} updateData={updateData} />
      <EditBC id={selectedRowId} {...editDrawerFormProps} />
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
              rows={responseData}
              filterModel={undefined}
              autoHeight
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
