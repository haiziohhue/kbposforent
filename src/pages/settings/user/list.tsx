import React from 'react';
import {
  IResourceComponentsProps,
  BaseRecord,
  CrudFilters,
  HttpError,
  useTranslate,
  useNavigation,
  useUpdate,
  useExport,
  getDefaultFilter,
} from '@refinedev/core';
import {
  useDataGrid,
  NumberField,
  DateField,
  useAutocomplete,
  List,
  ExportButton,
  FileField,
} from '@refinedev/mui';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { DataGrid, GridColumns, GridActionsCellItem } from '@mui/x-data-grid';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { IUser } from '../../../interfaces';
import { API_URL } from '../../../constants';
import { Avatar } from '@mui/material';

export const ListUsers: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();

  const { dataGridProps, search } = useDataGrid<IUser, HttpError>({
    initialPageSize: 10,
    meta: { populate: '*' },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<IUser>>(
    () => [
      {
        field: 'username',
        headerName: 'UserName',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 90,
      },

      {
        field: 'photo',
        headerName: 'Avatar',
        renderCell: function render({ row }) {
          return <Avatar src={`${API_URL}${row.photo?.url}`} />;
        },

        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
      },

      {
        field: 'nom',
        headerName: 'Nom',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 90,
      },

      {
        field: 'prenom',
        headerName: 'Prenom',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 90,
      },
      {
        field: 'phone',
        headerName: 'N° Tel',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 90,
      },
      {
        field: 'role',
        headerName: 'Role',
        valueGetter: ({ row }) => row?.role.name,
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        minWidth: 100,
        sortable: false,
        getActions: ({ id }) => [
          <GridActionsCellItem
            key={1}
            icon={<CheckOutlinedIcon color="success" />}
            sx={{ padding: '2px 6px' }}
            label=""
            showInMenu
            onClick={() => {
              mutate({
                resource: 'users',
                id,
                values: {
                  status: {
                    id: 2,
                    text: 'Ready',
                  },
                },
              });
            }}
          />,

          <GridActionsCellItem
            key={2}
            icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: '2px 6px' }}
            label=""
            showInMenu
            onClick={() =>
              mutate({
                resource: 'users',
                id,
                values: {
                  status: {
                    id: 5,
                    text: 'Cancelled',
                  },
                },
              })
            }
          />,
        ],
      },
    ],
    []
  );

  const { show } = useNavigation();

  // const { isLoading, triggerExport } = useExport<IOrder>({
  //   sorter,
  //   filters,
  //   pageSize: 50,
  //   maxItemCount: 50,
  //   mapData: (item) => {
  //     return {
  //       id: item.id,
  //       amount: item.amount,
  //       orderNumber: item.orderNumber,
  //       status: item.status.text,
  //       store: item.store.title,
  //       user: item.user.firstName,
  //     };
  //   },
  // });

  return (
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
              show('users', id);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sx={{
              ...dataGridProps.sx,
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </List>
      </Grid>
    </Grid>
  );
};
