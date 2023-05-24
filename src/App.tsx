import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from '@refinedev/mui';

import { CssBaseline, GlobalStyles } from '@mui/material';
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { DataProvider } from '@refinedev/strapi-v4';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { authProvider, axiosInstance } from './authProvider';
import { Header } from './components/header';
import { API_URL } from './constants';
import { ColorModeContextProvider } from './contexts/color-mode';
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from './pages/blog-posts';
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from './pages/categories';
import {
  MenuBook,
  AccountBalanceWallet,
  AccountBalance,
  AddShoppingCart,
  Settings,
  TableRestaurant,
  Fastfood,
  RestaurantMenu,
  Widgets,
  Restaurant,
  Category,
} from '@mui/icons-material';
import {
  CreateMenu,
  EditMenu,
  ListMenus,
} from './pages/settings/gestionMenu/menus';
import {
  CreateOrder,
  EditOrder,
  ListOrdes,
  ShowOrder,
} from './pages/commandes';
import {
  CreateCategory,
  EditCategory,
  ListCategories,
} from './pages/settings/gestionMenu/categories';
import {
  CreateCaisse,
  EditCaisse,
  ListCaisses,
} from './pages/settings/gestionMenu/caisses';
import {
  CreateTable,
  EditTable,
  ListTables,
} from './pages/settings/gestionMenu/tables';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <RefineSnackbarProvider>
            <Refine
              // authProvider={authProvider}
              dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: 'menus',
                  list: '/blog-posts',
                  create: '/blog-posts/create',
                  edit: '/blog-posts/edit/:id',
                  show: '/blog-posts/show/:id',
                  meta: {
                    label: 'Caisse',
                    canDelete: true,
                    icon: <AccountBalance />,
                  },
                },
                {
                  name: 'commandes',
                  list: '/commandes',
                  create: '/commandes/create',
                  edit: '/commandes/edit/:id',
                  show: '/commandes/show/:id',
                  meta: {
                    canDelete: true,
                    icon: <AddShoppingCart />,
                  },
                },
                {
                  name: 'settings',
                  meta: {
                    label: 'Paramètres',
                    icon: <Settings />,
                  },
                },

                {
                  name: 'gestiondemenu',
                  meta: {
                    label: 'Gestion de Menu',
                    parent: 'settings',
                    icon: <Fastfood />,
                  },
                },
                {
                  name: 'categories',
                  list: '/settings/gestionMenu/categories',
                  create: '/settings/gestionMenu/categories/create',
                  edit: '/settings/gestionMenu/categories/edit/:id',
                  meta: {
                    canDelete: true,
                    parent: 'gestiondemenu',
                    icon: <Category />,
                  },
                },
                {
                  name: 'menus',
                  list: 'settings/gestionMenu/menus',
                  create: '/settings/gestionMenu/menus/create',
                  edit: '/settings/gestionMenu/menus/edit/:id',
                  meta: {
                    canDelete: true,
                    parent: 'gestiondemenu',
                    icon: <MenuBook />,
                  },
                },
                {
                  name: 'tables',
                  list: '/settings/gestionMenu/tables',
                  create: '/settings/gestionMenu/tables/create',
                  edit: '/settings/gestionMenu/tables/edit/:id',
                  meta: {
                    canDelete: true,
                    parent: 'gestiondemenu',
                    icon: <TableRestaurant />,
                  },
                },
                {
                  name: 'caisses',
                  list: '/settings/gestionMenu/caisses',
                  create: '/settings/gestionMenu/caisses/create',
                  edit: '/settings/gestionMenu/caisses/edit/:id',
                  meta: {
                    canDelete: true,
                    parent: 'gestiondemenu',
                    icon: <AccountBalanceWallet />,
                  },
                },

                // {
                //   name: 'blog-posts',
                //   list: '/blog-posts',
                //   create: '/blog-posts/create',
                //   edit: '/blog-posts/edit/:id',
                //   show: '/blog-posts/show/:id',
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                {
                  name: 'categories',
                  list: '/categories',
                  create: '/categories/create',
                  edit: '/categories/edit/:id',
                  show: '/categories/show/:id',
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2 Header={() => <Header sticky />}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="caisse" />}
                  />
                  {/* Menus */}
                  <Route path="/blog-posts">
                    <Route index element={<BlogPostList />} />
                    <Route path="create" element={<BlogPostCreate />} />
                    <Route path="edit/:id" element={<BlogPostEdit />} />
                    <Route path="show/:id" element={<BlogPostShow />} />
                  </Route>
                  {/* Orders */}
                  <Route path="/commandes">
                    <Route index element={<ListOrdes />} />
                    <Route path="create" element={<CreateOrder />} />
                    <Route path="edit/:id" element={<EditOrder />} />
                    <Route path="show/:id" element={<ShowOrder />} />
                  </Route>
                  {/* Settings */}
                  <Route path="/settings">
                    {/* <Route index element={<CategoryList />} /> */}
                    <Route path="/settings/gestionMenu">
                      <Route path="/settings/gestionMenu/menus">
                        <Route index element={<ListMenus />} />
                        <Route path="create" element={<CreateMenu />} />
                        <Route path="edit/:id" element={<EditMenu />} />
                      </Route>
                      <Route path="/settings/gestionMenu/categories">
                        <Route index element={<ListCategories />} />
                        {/* <Route path="create" element={<CreateCategory />} /> */}
                        <Route path="edit/:id" element={<EditCategory />} />
                      </Route>
                      <Route path="/settings/gestionMenu/caisses">
                        <Route index element={<ListCaisses />} />
                        <Route path="create" element={<CreateCaisse />} />
                        <Route path="edit/:id" element={<EditCaisse />} />
                      </Route>
                      <Route path="/settings/gestionMenu/tables">
                        <Route index element={<ListTables />} />
                        <Route path="create" element={<CreateTable />} />
                        <Route path="edit/:id" element={<EditTable />} />
                      </Route>
                    </Route>
                  </Route>
                  {/* <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="create" element={<CategoryCreate />} />
                    <Route path="edit/:id" element={<CategoryEdit />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                  </Route> */}
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          defaultValues: {
                            email: 'demo@refine.dev',
                            password: 'demodemo',
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={<AuthPage type="register" />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<AuthPage type="forgotPassword" />}
                  />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
