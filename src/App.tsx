import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import "./App.css";
import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
} from "@refinedev/mui";

import { CircularProgress, CssBaseline, GlobalStyles } from "@mui/material";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { DataProvider } from "@refinedev/strapi-v4";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, axiosInstance } from "./authProvider";
import { Header } from "./components/header";
import { API_URL, TOKEN_KEY } from "./constants";
import { ColorModeContextProvider } from "./contexts/color-mode";

import {
  MenuBook,
  AccountBalanceWallet,
  AccountBalance,
  AddShoppingCart,
  Settings,
  TableRestaurant,
  Fastfood,
  Widgets,
  LocalGroceryStore,
  Category,
  Payments,
  People,
  TextSnippet,
} from "@mui/icons-material";
import { CreateMenu, EditMenu, ListMenus } from "./pages/menus";
import {
  CreateOrder,
  EditOrder,
  ListOrdes,
  ShowOrder,
} from "./pages/commandes";
import {
  EditCategory,
  ListCategories,
} from "./pages/settings/gestionMenu/categories";
import { EditCaisse, ListCaisses } from "./pages/settings/gestionMenu/caisses";
import { EditTable, ListTables } from "./pages/settings/gestionMenu/tables";
import { MenusList } from "./pages/caisse";
import { ListTresor } from "./pages/tresoriers";
import { CreateUser, EditUser, ListUsers } from "./pages/settings/users";
import { AuthPage } from "./pages/auth/AuthPage";
import {
  CreateCategoryDepense,
  ListCategoryDepense,
} from "./pages/settings/tresor";
import { CreateIngredient, ListIngredients } from "./pages/stocks/produit";
import { useEffect, useState } from "react";
import { IUserMe } from "./interfaces";
import axios from "axios";
import {
  CreateRestaurantData,
  EditRestaurantData,
  ListRestaurantData,
} from "./pages/settings/generales";
import { Title } from "./components/title";

import { SettingsList } from "./pages/parametres/SettingsList";
import { StockList } from "./pages/stocks/suiviStock/list";

import { ListAchat } from "./pages/stocks/achat/list";

function App() {
  //

  const [user, setUser] = useState<IUserMe | null>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/users/me?populate=*`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
          setloading(false);
        } else {
          setloading(false);
        }
      })
      .catch((e) => {
        setloading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="error" size={60} />
      </div>
    );
  }
  //

  if (user) {
    return (
      <BrowserRouter>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
              {user?.role?.name === "Caissier" && (
                <Refine
                  authProvider={authProvider}
                  dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                  notificationProvider={notificationProvider}
                  routerProvider={routerBindings}
                  resources={[
                    {
                      name: "menus",
                      list: "/menus",
                      create: "/commandes/create",
                      edit: "",
                      show: "",
                      meta: {
                        label: "Caisse",
                        canDelete: true,
                        icon: <AccountBalance />,
                      },
                    },
                    {
                      name: "commandes",
                      list: "/commandes",
                      create: "/commandes/create",
                      edit: "/commandes/edit/:id",
                      show: "/commandes/show/:id",
                      meta: {
                        canDelete: true,
                        icon: <AddShoppingCart />,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                  }}
                >
                  <Routes>
                    <>
                      <Route
                        element={
                          <Authenticated
                            fallback={<CatchAllNavigate to="/login" />}
                          >
                            <ThemedLayoutV2
                              Header={() => <Header sticky />}
                              Sider={() => <ThemedSiderV2 Title={Title} />}
                            >
                              <Outlet />
                            </ThemedLayoutV2>
                          </Authenticated>
                        }
                      >
                        <Route
                          index
                          element={<NavigateToResource resource="menus" />}
                        />

                        <>
                          {/* Menus */}
                          <Route path="/menus">
                            <Route index element={<MenusList />} />
                            <Route path="create" element={<CreateOrder />} />
                          </Route>
                          {/* Orders */}
                          <Route path="/commandes">
                            <Route index element={<ListOrdes />} />
                            <Route path="create" element={<CreateOrder />} />
                            <Route path="edit/:id" element={<EditOrder />} />
                            <Route path="show/:id" element={<ShowOrder />} />
                          </Route>
                        </>

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
                          element={<AuthPage type="login" />}
                        />
                      </Route>
                    </>
                  </Routes>

                  <RefineKbar />
                  <UnsavedChangesNotifier />
                </Refine>
              )}
              {user?.role?.name === "Admin" && (
                <Refine
                  authProvider={authProvider}
                  dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                  notificationProvider={notificationProvider}
                  routerProvider={routerBindings}
                  resources={[
                    {
                      name: "",
                      list: "/caisse",
                      create: "/commandes/create",
                      edit: "",
                      show: "",
                      meta: {
                        label: "Caisse",
                        canDelete: true,
                        icon: <AccountBalance />,
                      },
                    },
                    {
                      name: "commandes",
                      list: "/commandes",
                      create: "/commandes/create",
                      edit: "/commandes/edit/:id",
                      show: "/commandes/show/:id",
                      meta: {
                        canDelete: true,
                        icon: <AddShoppingCart />,
                      },
                    },
                    {
                      name: "tresoriers",
                      list: "/tresoriers",
                      create: "/tresoriers/create",
                      edit: "",
                      show: "",
                      meta: {
                        label: "Trésorerie",
                        canDelete: true,
                        icon: <Payments />,
                      },
                    },
                    {
                      name: "menus",
                      list: "/menus",
                      create: "/menus/create",
                      edit: "/menus/edit/:id",
                      meta: {
                        label: "Gestion de Menu",
                        canDelete: true,
                        icon: <MenuBook />,
                      },
                    },
                    {
                      name: "gestionDeStock",
                      meta: {
                        label: "Gestion de Stock",
                        icon: <Widgets />,
                      },
                    },
                    {
                      name: "ingredients",
                      list: "/stocks/produit",
                      create: "/stocks/produit/create",
                      edit: "/stocks/produit/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestionDeStock",
                        label: "List Ingredients",
                        icon: false,
                      },
                    },
                    {
                      name: "achats",
                      list: "/stocks/achat",
                      create: "/stocks/achat/create",
                      edit: "/stocks/achat/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestionDeStock",
                        label: "Achat",
                        icon: false,
                      },
                    },
                    {
                      name: "Stocks",
                      list: "/stocks/suiviStock",
                      create: "/stocks/users/create",
                      edit: "/stocks/users/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestionDeStock",
                        label: "Suivi de Stock",
                        icon: false,
                      },
                    },

                    {
                      name: "parametres",
                      list: "/parametres",
                      meta: {
                        label: "Paramètres",
                        icon: <Settings />,
                      },
                    },
                    {
                      name: "settings",
                      meta: {
                        label: "Paramètres",
                        icon: <Settings />,
                      },
                    },

                    {
                      name: "gestiondemenu",
                      meta: {
                        label: "Gestion de Menu",
                        parent: "settings",
                        icon: <Fastfood />,
                      },
                    },
                    {
                      name: "gestionStock",
                      meta: {
                        label: "Gestion de Stock",
                        parent: "settings",
                        icon: <Widgets />,
                      },
                    },
                    {
                      name: "categories",
                      list: "/settings/gestionMenu/categories",
                      create: "/settings/gestionMenu/categories/create",
                      edit: "/settings/gestionMenu/categories/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestiondemenu",
                        icon: <Category />,
                      },
                    },

                    {
                      name: "tables",
                      list: "/settings/gestionMenu/tables",
                      create: "/settings/gestionMenu/tables/create",
                      edit: "/settings/gestionMenu/tables/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestiondemenu",
                        icon: <TableRestaurant />,
                      },
                    },
                    {
                      name: "caisses",
                      list: "/settings/gestionMenu/caisses",
                      create: "/settings/gestionMenu/caisses/create",
                      edit: "/settings/gestionMenu/caisses/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestiondemenu",
                        icon: <AccountBalanceWallet />,
                      },
                    },
                    {
                      name: "users",
                      list: "/settings/users",
                      create: "/settings/users/create",
                      edit: "/settings/users/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "settings",
                        icon: <People />,
                        label: "Utilisateur",
                      },
                    },
                    {
                      name: "data-restaurants",
                      list: "/settings/data-restaurants",
                      create: "/settings/data-restaurants/create",
                      edit: "/settings/data-restaurants/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "settings",
                        icon: <TextSnippet />,
                        label: "Paramètre Générale",
                      },
                    },
                    {
                      name: "categorie-depenses",
                      list: "/settings/tresor",
                      create: "/settings/tresor/create",

                      meta: {
                        canDelete: true,
                        parent: "settings",
                        icon: <AccountBalanceWallet />,
                      },
                    },
                    {
                      name: "ingredients",
                      list: "/settings/gestionStock/ingredients",
                      create: "/settings/gestionStock/ingredients/create",
                      edit: "/settings/gestionStock/ingredients/edit/:id",
                      meta: {
                        canDelete: true,
                        parent: "gestionStock",
                        icon: <LocalGroceryStore />,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                  }}
                >
                  <Routes>
                    <>
                      <Route
                        element={
                          <Authenticated
                            fallback={<CatchAllNavigate to="/login" />}
                          >
                            <ThemedLayoutV2
                              Header={() => <Header sticky />}
                              Sider={() => <ThemedSiderV2 Title={Title} />}
                            >
                              <Outlet />
                            </ThemedLayoutV2>
                          </Authenticated>
                        }
                      >
                        <Route
                          index
                          element={<NavigateToResource resource="menus" />}
                        />

                        <>
                          {/* Menus */}
                          <Route path="/caisse">
                            <Route index element={<MenusList />} />
                            <Route path="create" element={<CreateOrder />} />
                          </Route>
                          {/* Orders */}
                          <Route path="/commandes">
                            <Route index element={<ListOrdes />} />
                            <Route path="create" element={<CreateOrder />} />
                            <Route path="edit/:id" element={<EditOrder />} />
                            <Route path="show/:id" element={<ShowOrder />} />
                          </Route>
                          {/* Tresories */}
                          <Route path="/tresoriers">
                            <Route index element={<ListTresor />} />
                          </Route>
                          {/* Gestion de Menu */}
                          <Route path="/menus">
                            <Route index element={<ListMenus />} />
                            <Route path="create" element={<CreateMenu />} />
                            <Route path="edit/:id" element={<EditMenu />} />
                          </Route>
                          {/* Gestion de Stock */}
                          <Route path="/stocks">
                            <Route path="/stocks/produit">
                              <Route index element={<ListIngredients />} />
                              <Route
                                path="create"
                                element={<CreateIngredient />}
                              />
                            </Route>
                            <Route path="/stocks/achat">
                              <Route index element={<ListAchat />} />
                              <Route
                                path="create"
                                element={<CreateIngredient />}
                              />
                            </Route>
                            <Route path="/stocks/suiviStock">
                              <Route index element={<StockList />} />
                            </Route>
                          </Route>
                          {/* Settings */}
                          <Route path="/parametres">
                            <Route index element={<SettingsList />} />
                          </Route>

                          {/* Settings */}
                          <Route path="/settings">
                            <Route path="/settings/gestionMenu">
                              <Route path="/settings/gestionMenu/categories">
                                <Route index element={<ListCategories />} />

                                <Route
                                  path="edit/:id"
                                  element={<EditCategory />}
                                />
                              </Route>
                              <Route path="/settings/gestionMenu/caisses">
                                <Route index element={<ListCaisses />} />
                                <Route
                                  path="edit/:id"
                                  element={<EditCaisse />}
                                />
                              </Route>
                              <Route path="/settings/gestionMenu/tables">
                                <Route index element={<ListTables />} />
                                <Route
                                  path="edit/:id"
                                  element={<EditTable />}
                                />
                              </Route>
                            </Route>
                            <Route path="/settings/users">
                              <Route index element={<ListUsers />} />
                              <Route path="create" element={<CreateUser />} />
                              <Route path="edit/:id" element={<EditUser />} />
                            </Route>
                            <Route path="/settings/data-restaurants">
                              <Route index element={<ListRestaurantData />} />
                              <Route
                                path="create"
                                element={<CreateRestaurantData />}
                              />
                              <Route
                                path="edit/:id"
                                element={<EditRestaurantData />}
                              />
                            </Route>
                            <Route path="/settings/gestionStock">
                              <Route path="/settings/gestionStock/ingredients">
                                <Route index element={<ListIngredients />} />
                                <Route
                                  path="create"
                                  element={<CreateIngredient />}
                                />
                                {/* <Route path="edit/:id" element={<EditMenu />} /> */}
                              </Route>
                            </Route>
                            <Route path="/settings/tresor">
                              <Route index element={<ListCategoryDepense />} />
                              <Route
                                path="create"
                                element={<CreateCategoryDepense />}
                              />
                              <Route path="edit/:id" element={<EditUser />} />
                            </Route>
                          </Route>
                        </>

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
                          element={<AuthPage type="login" />}
                        />
                      </Route>
                    </>
                  </Routes>

                  <RefineKbar />
                  <UnsavedChangesNotifier />
                </Refine>
              )}
            </RefineSnackbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
              <Refine
                authProvider={authProvider}
                dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                notificationProvider={notificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "menus",
                    list: "/menus",
                    create: "/commandes/create",
                    edit: "",
                    show: "",
                    meta: {
                      label: "Caisse",
                      canDelete: true,
                      icon: <AccountBalance />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                }}
              >
                <Routes>
                  <>
                    <Route
                      element={
                        <Authenticated
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2
                            Header={() => <Header sticky />}
                            Sider={() => <ThemedSiderV2 Title={Title} />}
                          >
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="menus" />}
                      />

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
                        element={<AuthPage type="login" />}
                      />
                    </Route>
                  </>
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
}

export default App;
