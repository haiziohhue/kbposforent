import React, { useEffect, useState } from "react";
import {
  IResourceComponentsProps,
  useTable,
  getDefaultFilter,
  HttpError,
  useList,
  useGetIdentity,
} from "@refinedev/core";
import {
  Drawer,
  Grid,
  Hidden,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Search, ShoppingCart } from "@mui/icons-material";
import { CategoryFilter } from "../menus/CategoryFilter";
import { ICaisseLogs, IMenu, IUser } from "../../interfaces";
import { MenuCard } from "./card";
import { CreateOrder } from "../commandes";
import { useSearchParams } from "react-router-dom";
import { NewEdit } from "../commandes/newEdit";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateMenuCompose } from "./compose";
import { OpenCaisse } from "../gestionCaisse/open";

export const MenusList: React.FC<IResourceComponentsProps> = () => {
  const [selctedMenu, setSelectedMenu] = useState<IMenu[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrder = searchParams.get("selectedOrder");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [caisseEtat, setCaisseEtat] = useState<ICaisseLogs | undefined>(
    undefined
  );
  //
  const createDrawerFormProps = useModalForm<IMenu, HttpError, IMenu>({
    refineCoreProps: { action: "create", meta: { populate: ["image"] } },
  });
  const {
    modal: { show: showCreateModal },
  } = createDrawerFormProps;
  //
  //
  const openDrawerFormProps = useModalForm<ICaisseLogs, HttpError, ICaisseLogs>(
    {
      refineCoreProps: { action: "create" },
      modalProps: {
        defaultVisible: true,
      },
    }
  );

  // const {
  //   modal: { show: showOpenModal },
  // } = openDrawerFormProps;

  //
  const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
    useTable<IMenu>({
      resource: `menus`,
      initialPageSize: 12,
      meta: { populate: ["image"] },
    });

  const menus: IMenu[] = tableQueryResult.data?.data || [];
  //
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  //
  //
  const { data: caissesLogs } = useList<ICaisseLogs>({
    resource: "logs-caisses",
    meta: { populate: "deep" },
  });
  //
  const { data: user } = useGetIdentity<IUser>();
  //
  useEffect(() => {
    const caisseState = localStorage.getItem("selectedCaisseEtat");
    if (caisseState) {
      const foundCaisse = caissesLogs?.data?.find(
        (caisse) => caisse?.etat === "Ouverte"
      );
      setCaisseEtat(foundCaisse || undefined);
    } else {
      setCaisseEtat(undefined);
    }
  }, [caissesLogs?.data]);

  //

  return (
    <>
      {caisseEtat?.etat !== "Ouverte" &&
        (user?.role?.name === "Caissier" || user?.role?.name === "Admin") && (
          <OpenCaisse {...openDrawerFormProps} />
        )}

      <CreateMenuCompose {...createDrawerFormProps} />
      <Grid container columns={16} spacing={2}>
        <Grid item xs={16} md={12}>
          <Paper
            sx={{
              paddingX: { xs: 3, md: 2 },
              paddingY: { xs: 2, md: 3 },
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
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Recherche"
                  inputProps={{
                    "aria-label": "product search",
                  }}
                  value={getDefaultFilter("titre", filters, "contains")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFilters([
                      {
                        field: "titre",
                        operator: "contains",
                        value:
                          e.target.value !== "" ? e.target.value : undefined,
                      },
                    ]);
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <Search />
                </IconButton>
              </Paper>
            </Stack>
            <Stack
              padding="8px"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <CategoryFilter setFilters={setFilters} filters={filters} />
              <Hidden mdUp>
                <IconButton
                  onClick={toggleDrawer}
                  color="primary"
                  aria-label="Open Drawer"
                >
                  <ShoppingCart />
                </IconButton>
              </Hidden>
            </Stack>
            <Grid container>
              {/* <Card
                onClick={() => showCreateModal()}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  borderWidth: 2,
                  paddingX: "36px",
                  cursor: "pointer",
                  height: "100%",
                  marginX: 1.5,
                  marginY: 1,
                  color: "rgb(239, 83, 80)",
                  // backgroundColor:
                  //   mode === "light"
                  //     ? "rgba(211, 47, 47, 0.08)"
                  //     : "rgba(239, 83, 80, 0.16)",
                }}
              >
                <CardHeader sx={{ padding: 0, mt: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia
                    sx={{
                      width: { xs: 60, sm: 84, lg: 108, xl: 144 },
                      height: { xs: 60, sm: 84, lg: 108, xl: 144 },
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    paddingX: "36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "18px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Composez
                  </Typography>
                  <Add sx={{ width: "60px", height: "60px" }} />
                </CardContent>
              </Card> */}
              {menus.length > 0 ? (
                menus
                  .filter((menu: IMenu) => menu.active === true)
                  .map((menu: IMenu) => (
                    <Grid
                      item
                      xs={6}
                      md={6}
                      lg={4}
                      xl={3}
                      key={menu.id}
                      sx={{ padding: "8px" }}
                    >
                      <MenuCard
                        menu={menu}
                        selectedCards={selctedMenu}
                        onCardSelect={setSelectedMenu}
                        // onAddToCart={() => addToCart(menu)}
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
                display: "flex",
                justifyContent: "end",
                paddingY: "20px",
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
          sm={2}
          md={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          {selectedOrder ? <NewEdit /> : <CreateOrder />}
        </Grid>

        <Hidden smDown>
          <Grid item sm={2} md={4}>
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={toggleDrawer}
              sx={{ height: "100vh" }}
            >
              {selectedOrder ? <NewEdit /> : <CreateOrder />}
            </Drawer>
          </Grid>
        </Hidden>
        {/* <Button onClick={() => showOpenModal()}>Caisse</Button> */}
      </Grid>
    </>
  );
};
