import {
  IResourceComponentsProps,
  useTable,
  getDefaultFilter,
} from "@refinedev/core";
import React, { useContext, useState } from "react";

import {
  Grid,
  IconButton,
  InputBase,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import { CategoryFilter } from "../settings/gestionMenu/menus/CategoryFilter";
import { ICartMenu, IMenu } from "../../interfaces";
import { MenuCard } from "./card";
import { CreateOrder } from "../commandes";
import { useSearchParams } from "react-router-dom";
import { NewEdit } from "../commandes/newEdit";

export const MenusList: React.FC<IResourceComponentsProps> = () => {
  const [selctedMenu, setSelectedMenu] = useState<IMenu[]>([]);
  const [cartItems, setCartItems] = useState<ICartMenu[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrder = searchParams.get("selectedOrder");

  const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
    useTable<IMenu>({
      resource: `menus`,
      initialPageSize: 12,
      meta: { populate: ["image"] },
    });

  const menus: IMenu[] = tableQueryResult.data?.data || [];

  // const addToCart = (menu: IMenu) => {
  //   const newItem: ICartMenu = {
  //     id: menu.id,
  //     menus: menu,
  //     quantity: 1,
  //   };
  //   setCartItems((prevCartItems) => [...prevCartItems, newItem]);
  // };

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
            <Stack padding="8px">
              <CategoryFilter setFilters={setFilters} filters={filters} />
            </Stack>
            <Grid container>
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
          sm={0}
          md={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          {/* <Paper
            sx={{
              paddingX: { xs: 3, md: 2 },
              paddingY: { xs: 2, md: 3 },
              my: 0.5,
            }}
          > */}

          {selectedOrder ? <NewEdit /> : <CreateOrder />}
          {/* </Paper> */}
        </Grid>
      </Grid>
    </>
  );
};
