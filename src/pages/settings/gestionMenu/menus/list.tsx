import {
  HttpError,
  IResourceComponentsProps,
  useApiUrl,
  useTable,
  getDefaultFilter,
} from '@refinedev/core';
import React from 'react';
import { IMenu } from '../../../../interfaces';
import { CreateButton, useDataGrid } from '@refinedev/mui';
import {
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { MenuItem } from './item';
import { useModalForm } from '@refinedev/react-hook-form';
import { CreateMenu } from './create';
import { CategoryFilter } from './CategoryFilter';

export const ListMenus: React.FC<IResourceComponentsProps> = () => {
  const apiUrl = useApiUrl();
  console.log(apiUrl);
  const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
    useTable<IMenu>({
      resource: `menus`,
      initialPageSize: 12,
      meta: { populate: ['image'] },
    });
  const createDrawerFormProps = useModalForm<IMenu, HttpError, IMenu>({
    refineCoreProps: { action: 'create', meta: { populate: ['image'] } },
  });

  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IMenu, HttpError, IMenu>({
    refineCoreProps: { action: 'edit', meta: { populate: ['image'] } },
  });

  const {
    modal: { show: showEditModal },
  } = editDrawerFormProps;
  const menus: IMenu[] = tableQueryResult.data?.data || [];
  console.log(menus);
  return (
    <>
      <CreateMenu {...createDrawerFormProps} />
      {/* <EditProduct {...editDrawerFormProps} /> */}
      <Paper
        sx={{
          paddingX: { xs: 3, md: 2 },
          paddingY: { xs: 2, md: 3 },
          my: 0.5,
        }}
      >
        <Grid container columns={16}>
          <Grid item xs={16} md={12}>
            <Stack
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              padding={1}
              direction="row"
              gap={2}
            >
              <Typography variant="h5">Menus</Typography>
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
              <CreateButton
                onClick={() => showCreateModal()}
                variant="contained"
                sx={{ marginBottom: '5px' }}
              >
                Ajouter Menu
              </CreateButton>
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
                    <MenuItem menu={menu} show={showEditModal} />
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
            <Stack padding="8px">
              <Typography variant="subtitle1">
                Utilisez des tags pour filtrer votre recherche
              </Typography>
              <CategoryFilter setFilters={setFilters} filters={filters} />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
