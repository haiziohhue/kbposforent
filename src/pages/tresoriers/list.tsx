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
import {
  IOrderFilterVariables,
  ITresor,
  ITresorFilterVariables,
} from '../../interfaces';

import { TresorTypes } from '../../components/tresor/TresorTypes';

export const ListTresor: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();

  const { dataGridProps, search, filters } = useDataGrid<
    ITresor,
    HttpError,
    ITresorFilterVariables
  >({
    initialPageSize: 10,
    meta: { populate: '*' },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { q, type, user } = params;

      filters.push({
        field: 'q',
        operator: 'eq',
        value: q !== '' ? q : undefined,
      });

      filters.push({
        field: 'table.id',
        operator: 'eq',
        value: (type ?? [].length) > 0 ? type : undefined,
      });

      filters.push({
        field: 'user.id',
        operator: 'eq',
        value: user,
      });

      return filters;
    },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<ITresor>>(
    () => [
      {
        field: 'id',
        headerName: 'N° Operation',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
      },

      {
        field: 'type',
        headerName: 'Type',
        headerAlign: 'center',
        align: 'center',
        renderCell: function render({ row }) {
          return <TresorTypes status={row?.type} />;
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'titre',
        headerName: 'Titre',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
      },

      {
        field: 'total',
        headerName: 'Total',
        headerAlign: 'center',
        align: 'center',
        renderCell: function render({ row }) {
          return (
            <NumberField
              options={{
                currency: 'USD',
                style: 'currency',
              }}
              value={row.montant}
              sx={{ fontSize: '14px' }}
            />
          );
        },
        flex: 1,
        minWidth: 100,
      },

      {
        field: 'user',
        headerName: 'User',
        // valueGetter: ({ row }) => row.user.fullName,
        flex: 1,
        minWidth: 150,
        sortable: false,
      },

      {
        field: 'createdAt',
        headerName: 'Date',
        flex: 1,
        minWidth: 170,
        renderCell: function render({ row }) {
          return (
            <DateField
              value={row.createdAt}
              format="LLL"
              sx={{ fontSize: '14px' }}
            />
          );
        },
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
                resource: 'tresoriers',
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
                resource: 'cammandes',
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

  const { register, handleSubmit, control } = useForm<
    BaseRecord,
    HttpError,
    IOrderFilterVariables
  >({
    defaultValues: {
      etat: getDefaultFilter('etat', filters, 'in'),
      q: getDefaultFilter('q', filters, 'eq'),
      table: getDefaultFilter('table.id', filters, 'eq'),
      caisse: getDefaultFilter('caisse.id', filters, 'eq'),
      user: getDefaultFilter('user.id', filters, 'eq'),
    },
  });

  const { autocompleteProps: tableAutocompleteProps } = useAutocomplete({
    resource: 'tables',
    defaultValue: getDefaultFilter('table.id', filters, 'eq'),
  });
  const { autocompleteProps: caisseAutocompleteProps } = useAutocomplete({
    resource: 'caisses',
    defaultValue: getDefaultFilter('caisse.id', filters, 'eq'),
  });
  // const { autocompleteProps: orderAutocompleteProps } = useAutocomplete({
  //   resource: 'orderStatuses',
  // });

  const { autocompleteProps: userAutocompleteProps } = useAutocomplete({
    resource: 'users',
    defaultValue: getDefaultFilter('user.id', filters, 'eq'),
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
          <CardHeader title="Filtrer" />
          <CardContent sx={{ pt: 0 }}>
            <Box
              component="form"
              sx={{ display: 'flex', flexDirection: 'column' }}
              autoComplete="off"
              onSubmit={handleSubmit(search)}
            >
              <TextField
                {...register('q')}
                label="Recherche"
                placeholder="N° Commande etc"
                margin="normal"
                fullWidth
                autoFocus
                size="small"
              />
              <Controller
                control={control}
                name="table"
                render={({ field }) => (
                  <Autocomplete
                    {...tableAutocompleteProps}
                    {...field}
                    // onChange={(_, value) => {
                    //   field.onChange(value.map((p) => p.nom ?? p));
                    // }}
                    onChange={(_, value) => {
                      field.onChange(value?.id ?? value);
                    }}
                    getOptionLabel={(item) => {
                      return item?.nom ? item.nom : item;
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.id?.toString() ===
                        (value?.id ?? value)?.toString()
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Table"
                        placeholder="Table"
                        margin="normal"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="caisse"
                render={({ field }) => (
                  <Autocomplete
                    {...caisseAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value?.id ?? value);
                    }}
                    getOptionLabel={(item) => {
                      return item?.nom ? item.nom : item;
                    }}
                    // getOptionLabel={(item) => {
                    //   return item.title
                    //     ? item.title
                    //     : caisseAutocompleteProps?.options?.find(
                    //         (p) => p.id.toString() === item.toString()
                    //       )?.title ?? '';
                    // }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.id?.toString() ===
                        (value?.id ?? value)?.toString()
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Caisse"
                        placeholder="Caisse"
                        margin="normal"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="user"
                render={({ field }) => (
                  <Autocomplete
                    {...userAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value?.id ?? value);
                    }}
                    getOptionLabel={(item) => {
                      return item.fullName
                        ? item.fullName
                        : userAutocompleteProps?.options?.find(
                            (p) => p.id.toString() === item.toString()
                          )?.fullName ?? '';
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.id?.toString() ===
                        (value?.id ?? value)?.toString()
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Utilisateur"
                        placeholder="Utilisateur"
                        margin="normal"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                )}
              />
              <br />
              <Button type="submit" variant="contained">
                Filtrer
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={9}>
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
              show('tresoriers', id);
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
