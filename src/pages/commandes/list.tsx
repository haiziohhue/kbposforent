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
import { IOrder, IOrderFilterVariables } from '../../interfaces';
import { OrderStatus } from '../../components/order/OrderStatus';

export const ListOrdes: React.FC<IResourceComponentsProps> = () => {
  const { mutate } = useUpdate();

  const { dataGridProps, search, filters, sorter } = useDataGrid<
    IOrder,
    HttpError,
    IOrderFilterVariables
  >({
    initialPageSize: 10,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { q, table, caisse, user, etat } = params;

      filters.push({
        field: 'q',
        operator: 'eq',
        value: q !== '' ? q : undefined,
      });

      filters.push({
        field: 'table.id',
        operator: 'eq',
        value: (table ?? [].length) > 0 ? table : undefined,
      });

      filters.push({
        field: 'user.id',
        operator: 'eq',
        value: user,
      });

      filters.push({
        field: 'etat',
        operator: 'in',
        value: (etat ?? []).length > 0 ? etat : undefined,
      });

      return filters;
    },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColumns<IOrder>>(
    () => [
      {
        field: 'code',
        headerName: 'Commande',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'etat',
        headerName: 'Etat',
        headerAlign: 'center',
        align: 'center',
        renderCell: function render({ row }) {
          return <OrderStatus status={row.etat} />;
        },
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
              value={row.total}
              sx={{ fontSize: '14px' }}
            />
          );
        },
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'table',
        headerName: 'Table',
        // valueGetter: ({ row }) => row.store.title,
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      {
        field: 'caisse',
        headerName: 'Caisse',
        // valueGetter: ({ row }) => row.store.title,
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      {
        field: 'user',
        headerName: 'User',
        // valueGetter: ({ row }) => row.user.fullName,
        flex: 1,
        minWidth: 150,
        sortable: false,
      },
      // {
      //   field: 'products',
      //   headerName: t('orders.fields.products'),
      //   headerAlign: 'center',
      //   align: 'center',
      //   sortable: false,
      //   renderCell: function render({ row }) {
      //     // return (
      //     //   <CustomTooltip
      //     //     arrow
      //     //     placement="top"
      //     //     title={
      //     //       <Stack sx={{ padding: '2px' }}>
      //     //         {row.products.map((product) => (
      //     //           <li key={product.id}>{product.name}</li>
      //     //         ))}
      //     //       </Stack>
      //     //     }
      //     //   >
      //     //     <Typography sx={{ fontSize: '14px' }}>
      //     //       {t('orders.fields.itemsAmount', {
      //     //         amount: row.products.length,
      //     //       })}
      //     //     </Typography>
      //     //   </CustomTooltip>
      //     // );
      //   },
      //   flex: 1,
      //   minWidth: 100,
      // },
      {
        field: 'createdAt',
        headerName: 'Date-Creation',
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
                resource: 'commandes',
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
          createButtonProps={{
            sx: {
              display: 'none',
            },
          }}
        >
          <DataGrid
            {...dataGridProps}
            columns={columns}
            filterModel={undefined}
            autoHeight
            onRowClick={({ id }) => {
              show('commandes', id);
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
