import {
  HttpError,
  IResourceComponentsProps,
  useApiUrl,
  useTable,
  getDefaultFilter,
  useList,
} from '@refinedev/core';
import React, { useEffect, useState } from 'react';

import { CreateButton, useAutocomplete, useDataGrid } from '@refinedev/mui';
import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import { CategoryFilter } from '../settings/gestionMenu/menus/CategoryFilter';
import { CaisseFilter } from '../../components/menu/CaisseFilter';
import { ICaisse, IMenu, IOrder, ITable } from '../../interfaces';
import { MenuCard } from './card';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

export const MenusList: React.FC<IResourceComponentsProps> = () => {
  const [selctedMenu, setSelectedMenu] = useState<IMenu[]>([]);
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IOrder, HttpError, IOrder>();
  const apiUrl = useApiUrl();
  console.log(apiUrl);
  const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
    useTable<IMenu>({
      resource: `menus`,
      initialPageSize: 12,
      meta: { populate: ['image'] },
    });

  const menus: IMenu[] = tableQueryResult.data?.data || [];
  console.log(menus);

  const { autocompleteProps } = useAutocomplete<ITable>({
    resource: 'tables',
  });

  //

  const { data: caisses, isLoading } = useList<ICaisse>({
    resource: 'caisses',
  });
  const [selctedCaisse, setSelectedCaisse] = useState<number>(1);
  const handleListItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    caisseId: number
  ) => {
    setSelectedCaisse(caisseId);
  };
  useEffect(() => {
    setValue('caisse', selctedCaisse);
  }, [selctedCaisse, setValue]);
  return (
    <>
      <Grid container columns={16} spacing={2}>
        <Grid item xs={16} md={12}>
          <Paper
            sx={{
              paddingX: { xs: 3, md: 2 },
              paddingY: { xs: 2, md: 3 },
              my: 0.5,
            }}
          >
            <Stack
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              padding={1}
              direction="row"
              gap={2}
            >
              {/* <Typography variant="h5">Menus</Typography> */}
              <Paper
                component="form"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 400,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Recherche"
                  inputProps={{
                    'aria-label': 'product search',
                  }}
                  value={getDefaultFilter('titre', filters, 'contains')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFilters([
                      {
                        field: 'titre',
                        operator: 'contains',
                        value:
                          e.target.value !== '' ? e.target.value : undefined,
                      },
                    ]);
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{ p: '10px' }}
                  aria-label="search"
                >
                  <Search />
                </IconButton>
              </Paper>
            </Stack>
            <Stack padding="8px">
              <CategoryFilter setFilters={setFilters} filters={filters} />
            </Stack>
            <Grid container>
              {menus.length > 0 ? (
                menus.map((menu: IMenu) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    xl={3}
                    key={menu.id}
                    sx={{ padding: '8px' }}
                  >
                    <MenuCard
                      menu={menu}
                      selectedCards={selctedMenu}
                      onCardSelect={setSelectedMenu}
                    />
                  </Grid>
                ))
              ) : (
                <Grid container justifyContent="center" padding={3}>
                  <Typography variant="body2">Pas de Menus</Typography>
                </Grid>
              )}
            </Grid>
            <Pagination
              count={pageCount}
              variant="outlined"
              color="primary"
              shape="rounded"
              sx={{
                display: 'flex',
                justifyContent: 'end',
                paddingY: '20px',
              }}
              onChange={(event: React.ChangeEvent<unknown>, page: number) => {
                event.preventDefault();
                setCurrent(page);
              }}
            />
          </Paper>
        </Grid>
        <Grid
          item
          sm={0}
          md={4}
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Paper
            sx={{
              paddingX: { xs: 3, md: 2 },
              paddingY: { xs: 2, md: 3 },
              my: 0.5,
            }}
          >
            <Stack padding="8px">
              {/* <CaisseFilter /> */}
              <form onSubmit={handleSubmit(onFinish)}>
                <Stack gap="10px" marginTop="10px">
                  {/* Caisse */}
                  <Stack>
                    <List
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {caisses?.data.map((caisse: ICaisse) => (
                        <Button
                          key={caisse.id}
                          onClick={(
                            event: React.MouseEvent<
                              HTMLButtonElement,
                              MouseEvent
                            >
                          ) => handleListItemClick(event, caisse?.id)}
                          variant={
                            selctedCaisse === caisse.id
                              ? 'contained'
                              : 'outlined'
                          }
                          sx={{
                            borderRadius: '30px',
                          }}
                          disabled={isLoading}
                        >
                          <ListItemText primary={caisse.nom} />
                          <input
                            type="hidden"
                            {...register('caisse')}
                            value={caisse?.id}
                          />
                        </Button>
                      ))}
                    </List>
                  </Stack>
                  {/* Table */}
                  <FormControl>
                    <Controller
                      control={control}
                      name="table"
                      rules={{
                        required: 'This field is required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          disablePortal
                          {...autocompleteProps}
                          {...field}
                          onChange={(_, value) => {
                            field.onChange(value?.id);
                          }}
                          getOptionLabel={(item) => {
                            return item.nom ? item.nom : '';
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
                              variant="outlined"
                              error={!!errors.table?.message}
                              required
                            />
                          )}
                        />
                      )}
                    />
                    {errors.table && (
                      <FormHelperText error>
                        {errors.table.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {/* Type */}
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="type"
                      rules={{
                        required: 'This field is required',
                      }}
                      // defaultValue={'sur place'}
                      render={({ field }) => (
                        <Autocomplete
                          size="medium"
                          {...field}
                          onChange={(_, value) => {
                            field.onChange(value);
                          }}
                          options={['Sur Place', 'Emporté']}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Type"
                              error={!!errors.type}
                              required
                            />
                          )}
                        />
                      )}
                    />
                    {errors.type && (
                      <FormHelperText error>
                        {errors.type.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <button type="submit">Submit</button>
              </form>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
