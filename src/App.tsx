import {Authenticated, Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import "./App.css";
import {
    ErrorComponent,
    RefineSnackbarProvider,
    ThemedLayoutV2,
    ThemedSiderV2,
    useNotificationProvider,
} from "@refinedev/mui";

import {CircularProgress, CssBaseline, GlobalStyles} from "@mui/material";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {DataProvider} from "@refinedev/strapi-v4";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {authProvider, axiosInstance} from "./authProvider";
import {Header} from "./components/header";
import {API_URL, TOKEN_KEY} from "./constants";
import {ColorModeContextProvider} from "./contexts/color-mode";

import {
    DashboardOutlined,
    FoodBankOutlined,
    ListAltOutlined,
    MenuBook,
    PaymentsOutlined,
    SettingsOutlined,
    WidgetsOutlined,
} from "@mui/icons-material";
import {CreateMenu, EditMenu, ListMenus} from "./pages/menus";
import {CreateOrder, ListOrdes, NewEdit, ShowOrder} from "./pages/commandes";

import {MenusList} from "./pages/caisse";
import {ListTresor} from "./pages/tresoriers";
import {CreateUser, EditUser, ListUsers} from "./pages/parametres/users";
import {AuthPage} from "./pages/auth/AuthPage";
import {ListCategoryDepense} from "./pages/parametres/categorieDepense";
import {ListIngredients} from "./pages/stocks/produit";
import {useEffect, useState} from "react";
import {IUserMe} from "./interfaces";
import axios from "axios";
import {ListRestaurantData} from "./pages/parametres/generales";
import {Title} from "./components/title";
import {SettingsList} from "./pages/parametres/SettingsList";
import {StockList} from "./pages/stocks/suiviStock/list";
import {ListAchat} from "./pages/stocks/achat/list";
import {ListBC} from "./pages/stocks/bonChef/list";
import {ListChefs} from "./pages/parametres/chefs";
import {ListCategories} from "./pages/parametres/categories";
import {ListTables} from "./pages/parametres/tables";
import {ListCaisses} from "./pages/parametres/caisses";
import {ListCaissesLogs} from "./pages/gestionCaisse/list";
import {Dashboard} from "./pages/dashboard";
import {ListUnites} from "./pages/parametres/unites";
import {ScheduleList} from "./pages/HR/schedule";
import {SalaryList} from "./pages/HR/salary";
import {HRManageList} from "./pages/HR/manage/list";

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
                <CircularProgress color="error" size={60}/>
            </div>
        );
    }
    //

    if (user) {
        return (
            <BrowserRouter>
                <RefineKbarProvider>
                    <ColorModeContextProvider>
                        <CssBaseline/>
                        <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                        <RefineSnackbarProvider>
                            {user?.role?.name === "Caissier" && (
                                <Refine
                                    authProvider={authProvider}
                                    dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                                    notificationProvider={useNotificationProvider}
                                    routerProvider={routerBindings}
                                    resources={[
                                        {
                                            name: "Dashboard",
                                            list: "/dashboard",
                                            meta: {
                                                label: "Dashboard",
                                                icon: <DashboardOutlined/>,
                                            },
                                        },
                                        {
                                            name: "",
                                            list: "/caisse",
                                            create: "/commandes/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                label: "Caisse",
                                                canDelete: true,
                                                icon: <FoodBankOutlined/>,
                                            },
                                        },
                                        {
                                            name: "commandes",
                                            list: "/commandes",
                                            create: "/commandes/create",
                                            edit: "/commandes/newEdit/:id",
                                            show: "/commandes/show/:id",
                                            meta: {
                                                canDelete: true,
                                                icon: <ListAltOutlined/>,
                                            },
                                        },
                                        {
                                            name: "tresoriers",
                                            meta: {
                                                label: "Trésorerie",
                                                icon: <PaymentsOutlined/>,
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
                                                parent: "tresoriers",
                                                canDelete: true,
                                                icon: false,
                                            },
                                        },
                                        {
                                            name: "logs-caisses",
                                            list: "/gestionCaisse",
                                            create: "/gestionCaisse/open",
                                            edit: "/gestionCaisse/close",
                                            show: "",
                                            meta: {
                                                label: "Journal",
                                                parent: "tresoriers",
                                                icon: false,
                                            },
                                        },
                                    ]}
                                    options={{
                                        syncWithLocation: true,
                                        warnWhenUnsavedChanges: true,
                                        projectId: "3RwuuB-53ClMu-OzbxuH",
                                    }}
                                >
                                    <Routes>
                                        <>
                                            <Route
                                                element={
                                                    <Authenticated
                                                        key="authenticated-routes"
                                                        fallback={<CatchAllNavigate to="/login"/>}
                                                    >
                                                        <ThemedLayoutV2
                                                            Header={() => <Header sticky/>}
                                                            Sider={() => <ThemedSiderV2 Title={Title}/>}
                                                        >
                                                            <Outlet/>
                                                        </ThemedLayoutV2>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route index element={<MenusList/>}/>

                                                <>
                                                    <Route path="/dashboard">
                                                        <Route index element={<Dashboard/>}/>
                                                    </Route>
                                                    {/* Menus */}
                                                    <Route path="/caisse">
                                                        <Route index element={<MenusList/>}/>
                                                        <Route path="create" element={<CreateOrder/>}/>
                                                    </Route>
                                                    {/* Orders */}
                                                    <Route path="/commandes">
                                                        <Route index element={<ListOrdes/>}/>
                                                        <Route path="create" element={<CreateOrder/>}/>
                                                        <Route path="newEdit/:id" element={<NewEdit/>}/>
                                                        <Route path="show/:id" element={<ShowOrder/>}/>
                                                    </Route>
                                                    {/* Tresories */}
                                                    <Route path="/tresoriers">
                                                        <Route index element={<ListTresor/>}/>
                                                    </Route>
                                                    {/* logs */}
                                                    <Route path="/gestionCaisse">
                                                        <Route index element={<ListCaissesLogs/>}/>
                                                    </Route>
                                                </>

                                                <Route path="*" element={<ErrorComponent/>}/>
                                            </Route>
                                            <Route
                                                element={
                                                    <Authenticated
                                                        key="authenticated-routes"
                                                        fallback={<Outlet/>}
                                                    >
                                                        <NavigateToResource/>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route
                                                    path="/login"
                                                    element={<AuthPage type="login"/>}
                                                />
                                            </Route>
                                        </>
                                    </Routes>

                                    <RefineKbar/>
                                    <UnsavedChangesNotifier/>
                                </Refine>
                            )}
                            {user?.role?.name === "Serveur" && (
                                <Refine
                                    authProvider={authProvider}
                                    dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                                    notificationProvider={useNotificationProvider}
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
                                                icon: <FoodBankOutlined/>,
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
                                                        key="authenticated-routes"
                                                        fallback={<CatchAllNavigate to="/login"/>}
                                                    >
                                                        <ThemedLayoutV2
                                                            Header={() => <Header sticky/>}
                                                            Sider={() => <ThemedSiderV2 Title={Title}/>}
                                                        >
                                                            <Outlet/>
                                                        </ThemedLayoutV2>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route index element={<MenusList/>}/>

                                                <>
                                                    {/* Menus */}
                                                    <Route path="/caisse">
                                                        <Route index element={<MenusList/>}/>
                                                        <Route path="create" element={<CreateOrder/>}/>
                                                    </Route>
                                                </>

                                                <Route path="*" element={<ErrorComponent/>}/>
                                            </Route>
                                            <Route
                                                element={
                                                    <Authenticated
                                                        key="authenticated-routes"
                                                        fallback={<Outlet/>}
                                                    >
                                                        <NavigateToResource/>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route
                                                    path="/login"
                                                    element={<AuthPage type="login"/>}
                                                />
                                            </Route>
                                        </>
                                    </Routes>

                                    <RefineKbar/>
                                    <UnsavedChangesNotifier/>
                                </Refine>
                            )}
                            {user?.role?.name === "Admin" && (
                                <Refine
                                    authProvider={authProvider}
                                    dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                                    notificationProvider={useNotificationProvider}
                                    routerProvider={routerBindings}
                                    resources={[
                                        {
                                            name: "Dashboard",
                                            list: "/dashboard",
                                            meta: {
                                                label: "Dashboard",
                                                icon: <DashboardOutlined/>,
                                            },
                                        },
                                        {
                                            name: "HR Manager",
                                            list: "/HR",
                                            meta: {
                                                label: "HR manager",
                                                icon: <DashboardOutlined/>,
                                            },
                                        }, {
                                            name: "HR Schedule",
                                            list: "/HR/schedule",
                                            meta: {
                                                label: "Schedule",
                                                parent: "HR Manager",
                                                icon: <DashboardOutlined/>,
                                            },
                                        }, {
                                            name: "HR Salary",
                                            list: "/HR/salary",
                                            meta: {
                                                label: "Salary",
                                                parent: "HR Manager",
                                                icon: <DashboardOutlined/>,
                                            },
                                        },{
                                            name: "HR Manager",
                                            list: "/HR/manager",
                                            meta: {
                                                label: "manager",
                                                parent: "HR Manager",
                                                icon: <DashboardOutlined/>,
                                            },
                                        },
                                        {
                                            name: "",
                                            list: "/caisse",
                                            create: "/commandes/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                label: "Caisse",
                                                canDelete: true,
                                                icon: <FoodBankOutlined/>,
                                            },
                                        },
                                        {
                                            name: "commandes",
                                            list: "/commandes",
                                            create: "/commandes/create",
                                            edit: "/commandes/newEdit/:id",
                                            show: "/commandes/show/:id",
                                            meta: {
                                                canDelete: true,
                                                icon: <ListAltOutlined/>,
                                            },
                                        },
                                        {
                                            name: "tresoriers",
                                            meta: {
                                                label: "Trésorerie",
                                                icon: <PaymentsOutlined/>,
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
                                                parent: "tresoriers",
                                                canDelete: true,
                                                icon: false,
                                            },
                                        },
                                        {
                                            name: "logs-caisses",
                                            list: "/gestionCaisse",
                                            create: "/gestionCaisse/open",
                                            edit: "/gestionCaisse/close",
                                            show: "",
                                            meta: {
                                                label: "Journal",
                                                parent: "tresoriers",
                                                icon: false,
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
                                                icon: <MenuBook/>,
                                            },
                                        },
                                        {
                                            name: "gestionDeStock",
                                            meta: {
                                                label: "Gestion de Stock",
                                                icon: <WidgetsOutlined/>,
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
                                                label: "Articles",
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
                                            name: "bon-chefs",
                                            list: "/stocks/bonChef",
                                            create: "/stocks/bonChef/create",
                                            edit: "/stocks/bonChef/edit/:id",
                                            meta: {
                                                canDelete: true,
                                                parent: "gestionDeStock",
                                                label: "Bon Chef",
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
                                                icon: <SettingsOutlined/>,
                                            },
                                        },
                                        {
                                            name: "data-restaurants",
                                            list: "/parametres/generales",
                                            create: "/parametres/generales/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                label: "Donnée de Restaurant",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "categories",
                                            list: "/parametres/categories",
                                            create: "/parametres/categories/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "tables",
                                            list: "/parametres/tables",
                                            create: "/parametres/tables/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "caisses",
                                            list: "/parametres/caisses",
                                            create: "/parametres/caisses/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "chefs",
                                            list: "/parametres/chefs",
                                            create: "/parametres/chefs/create",

                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "unites",
                                            list: "/parametres/unites",
                                            create: "/parametres/unites/create",

                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "categorie-depenses",
                                            list: "/parametres/categorieDepense",
                                            create: "/parametres/categorieDepense/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "categorie-ingredients",
                                            list: "/parametres/categorieIngredient",
                                            create: "/parametres/categorieIngredient/create",
                                            edit: "",
                                            show: "",
                                            meta: {
                                                hide: true,
                                                parent: "parametres",
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "users",
                                            list: "/parametres/users",
                                            create: "/parametres/users/create",
                                            edit: "/parametres/users/edit/:id",
                                            meta: {
                                                canDelete: true,
                                                parent: "parametres",
                                                hide: true,
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
                                                        key="authenticated-routes"
                                                        fallback={<CatchAllNavigate to="/login"/>}
                                                    >
                                                        <ThemedLayoutV2
                                                            Header={() => <Header sticky/>}
                                                            Sider={() => <ThemedSiderV2 Title={Title}/>}
                                                        >
                                                            <Outlet/>
                                                        </ThemedLayoutV2>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route index element={<MenusList/>}/>

                                                <>
                                                    <Route path="/dashboard">
                                                        <Route index element={<Dashboard/>}/>
                                                    </Route>
                                                    {/* Menus */}
                                                    <Route path="/caisse">
                                                        <Route index element={<MenusList/>}/>
                                                        <Route path="create" element={<CreateOrder/>}/>
                                                    </Route>
                                                    {/* Orders */}
                                                    <Route path="/commandes">
                                                        <Route index element={<ListOrdes/>}/>
                                                        <Route path="create" element={<CreateOrder/>}/>
                                                        <Route path="newEdit/:id" element={<NewEdit/>}/>
                                                        <Route path="show/:id" element={<ShowOrder/>}/>
                                                    </Route>
                                                    {/* Tresories */}
                                                    <Route path="/tresoriers">
                                                        <Route index element={<ListTresor/>}/>
                                                    </Route>
                                                    {/* logs */}
                                                    <Route path="/gestionCaisse">
                                                        <Route index element={<ListCaissesLogs/>}/>
                                                    </Route>
                                                    {/* hr manager*/}
                                                    <Route path="/HR">
                                                        <Route path="schedule"  element={<ScheduleList/>}/>
                                                        <Route path="salary" element={<SalaryList/>}/>
                                                        <Route path="manager" element={<HRManageList/>}/>
                                                    </Route>
                                                    {/* Gestion de Menu */}
                                                    <Route path="/menus">
                                                        <Route index element={<ListMenus/>}/>
                                                        <Route path="create" element={<CreateMenu/>}/>
                                                        <Route path="edit/:date" element={<EditMenu/>}/>
                                                    </Route>
                                                    {/* Gestion de Stock */}
                                                    <Route path="/stocks">
                                                        <Route path="/stocks/produit">
                                                            <Route index element={<ListIngredients/>}/>
                                                        </Route>
                                                        <Route path="/stocks/achat">
                                                            <Route index element={<ListAchat/>}/>
                                                        </Route>
                                                        <Route path="/stocks/bonChef">
                                                            <Route index element={<ListBC/>}/>
                                                        </Route>
                                                        <Route path="/stocks/suiviStock">
                                                            <Route index element={<StockList/>}/>
                                                        </Route>
                                                    </Route>
                                                    {/* Settings */}
                                                    <Route path="/parametres">
                                                        <Route index element={<SettingsList/>}/>
                                                    </Route>
                                                    <Route path="/parametres/generales">
                                                        <Route index element={<ListRestaurantData/>}/>
                                                    </Route>
                                                    <Route path="/parametres/categories">
                                                        <Route index element={<ListCategories/>}/>
                                                    </Route>
                                                    <Route path="/parametres/tables">
                                                        <Route index element={<ListTables/>}/>
                                                    </Route>
                                                    <Route path="/parametres/caisses">
                                                        <Route index element={<ListCaisses/>}/>
                                                    </Route>
                                                    <Route path="/parametres/chefs">
                                                        <Route index element={<ListChefs/>}/>
                                                    </Route>
                                                    <Route path="/parametres/unites">
                                                        <Route index element={<ListUnites/>}/>
                                                    </Route>
                                                    <Route path="/parametres/categorieDepense">
                                                        <Route index element={<ListCategoryDepense/>}/>
                                                    </Route>

                                                    <Route path="/parametres/users">
                                                        <Route index element={<ListUsers/>}/>
                                                        <Route path="create" element={<CreateUser/>}/>
                                                        <Route path="edit/:id" element={<EditUser/>}/>
                                                    </Route>
                                                </>

                                                <Route path="*" element={<ErrorComponent/>}/>
                                            </Route>
                                            <Route
                                                element={
                                                    <Authenticated
                                                        key="authenticated-routes"
                                                        fallback={<Outlet/>}
                                                    >
                                                        <NavigateToResource/>
                                                    </Authenticated>
                                                }
                                            >
                                                <Route
                                                    path="/login"
                                                    element={<AuthPage type="login"/>}
                                                />
                                            </Route>
                                        </>
                                    </Routes>

                                    <RefineKbar/>
                                    <UnsavedChangesNotifier/>
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
                        <CssBaseline/>
                        <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                        <RefineSnackbarProvider>
                            <Refine
                                authProvider={authProvider}
                                dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                                notificationProvider={useNotificationProvider}
                                routerProvider={routerBindings}
                                resources={[
                                    {
                                        name: "",
                                        list: "/caisse",
                                        meta: {
                                            label: "Caisse",
                                            canDelete: true,
                                            icon: <FoodBankOutlined/>,
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
                                                    key="authenticated-routes"
                                                    fallback={<CatchAllNavigate to="/login"/>}
                                                >
                                                    <ThemedLayoutV2
                                                        Header={() => <Header sticky/>}
                                                        Sider={() => <ThemedSiderV2 Title={Title}/>}
                                                    >
                                                        <Outlet/>
                                                    </ThemedLayoutV2>
                                                </Authenticated>
                                            }
                                        >
                                            <Route index element={<MenusList/>}/>

                                            <Route path="*" element={<ErrorComponent/>}/>
                                        </Route>
                                        <Route
                                            element={
                                                <Authenticated
                                                    key="authenticated-routes"
                                                    fallback={<Outlet/>}
                                                >
                                                    <NavigateToResource/>
                                                </Authenticated>
                                            }
                                        >
                                            <Route
                                                path="/login"
                                                element={<AuthPage type="login"/>}
                                            />
                                        </Route>
                                    </>
                                </Routes>

                                <RefineKbar/>
                                <UnsavedChangesNotifier/>
                            </Refine>
                        </RefineSnackbarProvider>
                    </ColorModeContextProvider>
                </RefineKbarProvider>
            </BrowserRouter>
        );
    }
}

export default App;
