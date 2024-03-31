import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useList } from "@refinedev/core";
import { IOrder } from "interfaces";
import { AnalyticsCard } from "./card";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { CalendarToday } from "@mui/icons-material";
import moment from "moment";

export const Dashboard = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [periode, setPeriode] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const { data } = useList<IOrder>({
    resource: "commandes",
    meta: {
      populate: "deep",
      filter: {
        field: "createdAt",
        operator: "between",
        value: [
          moment(periode[0].startDate)
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          moment(periode[0].endDate)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
        ],
      },
    },
  });
  //
  const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePicker = () => {
    setAnchorEl(null);
  };

  const applyDateRange = () => {
    closeDatePicker();
    // handleSubmit(search)();
  };
  const clearDateSelection = () => {
    setPeriode([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
  };
  //

  const { data: statDta } = useList<IOrder>({
    resource: "stat",
    // meta: { populate: "deep" },
  });

  const { dataGridProps } = useDataGrid<IOrder>({
    resource: "commandes",
    initialPageSize: 10,
    sorters: {
      permanent: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
    meta: { populate: "deep" },
  });
  //
  console.log(dataGridProps.rows);
  console.log(data?.data);
  // function ingredientsConsumption(data) {
  //   const ingredientMap = new Map();

  //   // Function to update ingredient quantities
  //   const updateIngredientQuantities = (
  //     ingredientItem,
  //     quantity,
  //     isMenuCompose
  //   ) => {
  //     const { nom: ingredientName } = ingredientItem.ingredient;
  //     const currentIngredient = ingredientMap.get(ingredientName) || {
  //       totalQuantityInCommandes: 0,
  //       quantityInMenu: 0,
  //       quantityInMenuCompose: 0,
  //       quantityInSupplements: 0,
  //     };

  //     ingredientMap.set(ingredientName, {
  //       totalQuantityInCommandes:
  //         currentIngredient.totalQuantityInCommandes + quantity,
  //       quantityInMenu: isMenuCompose
  //         ? currentIngredient.quantityInMenu
  //         : currentIngredient.quantityInMenu + quantity,
  //       quantityInMenuCompose: isMenuCompose
  //         ? currentIngredient.quantityInMenuCompose + quantity
  //         : currentIngredient.quantityInMenuCompose,
  //       quantityInSupplements: currentIngredient.quantityInSupplements,
  //     });
  //   };

  //   // Process menu-compose items
  //   data?.forEach((order) => {
  //     order?.menu?.forEach((menuItem) => {
  //       if (menuItem.__component === "menus.menu-compose") {
  //         menuItem?.ingredients?.forEach((ingredientItem) => {
  //           const { quantite } = ingredientItem;
  //           updateIngredientQuantities(
  //             ingredientItem,
  //             parseInt(quantite),
  //             true
  //           );
  //         });
  //       }
  //     });
  //   });

  //   // Process commande-menu items
  //   data?.forEach((order) => {
  //     order?.menu?.forEach((menuItem) => {
  //       if (menuItem.__component !== "menus.menu-compose") {
  //         menuItem?.menu.ingredients?.forEach((ingredientItem) => {
  //           const { quantite_demande } = ingredientItem;
  //           updateIngredientQuantities(
  //             ingredientItem,
  //             parseInt(quantite_demande),
  //             false
  //           );
  //         });
  //       }
  //     });
  //   });

  //   // Convert the map to an array of objects
  //   const gridData = Array.from(ingredientMap, ([ingredient, values]) => ({
  //     ingredient,
  //     ...values,
  //   }));
  //   return gridData;
  // }
  // function ingredientsConsumption(data) {
  //   const ingredientMap = new Map();

  //   // Function to update ingredient quantities
  //   const updateIngredientQuantities = (
  //     ingredientItem,
  //     quantity,
  //     isMenuCompose,
  //     isSupplement
  //   ) => {
  //     const { nom: ingredientName } =
  //       ingredientItem.ingredient || ingredientItem;
  //     const currentIngredient = ingredientMap.get(ingredientName) || {
  //       totalQuantityInCommandes: 0,
  //       quantityInMenu: 0,
  //       quantityInMenuCompose: 0,
  //       quantityInSupplements: 0,
  //     };

  //     ingredientMap.set(ingredientName, {
  //       totalQuantityInCommandes:
  //         currentIngredient.totalQuantityInCommandes + quantity,
  //       quantityInMenu: isMenuCompose
  //         ? currentIngredient.quantityInMenu
  //         : currentIngredient.quantityInMenu + quantity,
  //       quantityInMenuCompose: isMenuCompose
  //         ? currentIngredient.quantityInMenuCompose + quantity
  //         : currentIngredient.quantityInMenuCompose,
  //       quantityInSupplements: isSupplement
  //         ? currentIngredient.quantityInSupplements + quantity
  //         : currentIngredient.quantityInSupplements,
  //     });
  //   };

  //   // Process menu-compose, menu, and supplement items
  //   data?.forEach((order) => {
  //     order?.menu?.forEach((menuItem) => {
  //       console.log(menuItem);
  //       if (menuItem.__component === "menus.commande-menu") {
  //         menuItem?.menu.ingredients?.forEach((ingredientItem) => {
  //           const { quantite_demande } = ingredientItem;
  //           updateIngredientQuantities(
  //             ingredientItem,
  //             parseInt(quantite_demande),
  //             false,
  //             false
  //           );
  //         });
  //         // Process supplement items for menu items
  //         menuItem?.suplimentaires?.forEach((supplementItem) => {
  //           const { quantite } = supplementItem;
  //           const { ingredient } = supplementItem;
  //           updateIngredientQuantities(
  //             { ingredient },
  //             parseInt(quantite),
  //             false,
  //             true
  //           );
  //         });
  //       } else if (menuItem.__component === "menus.menu-compose") {
  //         menuItem?.ingredients?.forEach((ingredientItem) => {
  //           const { quantite } = ingredientItem;
  //           updateIngredientQuantities(
  //             ingredientItem,
  //             parseInt(quantite),
  //             true,
  //             false
  //           );
  //         });
  //       }
  //     });
  //   });

  //   // Convert the map to an array of objects
  //   const gridData = Array.from(ingredientMap, ([ingredient, values]) => ({
  //     ingredient,
  //     ...values,
  //   }));
  //   return gridData;
  // }
  function ingredientsConsumption(data) {
    if (!data) {
      return [];
    }

    const ingredientMap = new Map();

    const updateIngredientQuantities = (
      ingredientItem,
      quantity,
      isMenuCompose,
      isSupplement,
      count
    ) => {
      if (!ingredientItem || !ingredientItem.ingredient) {
        return;
      }

      const { nom: ingredientName } = ingredientItem.ingredient;
      const parsedQuantity = parseInt(quantity);
      const parsedCount = parseInt(count);
      if (isNaN(parsedQuantity) || isNaN(parsedCount)) {
        return;
      }

      const currentIngredient = ingredientMap.get(ingredientName) || {
        totalQuantityInCommandes: 0,
        quantityInMenu: 0,
        quantityInMenuCompose: 0,
        quantityInSupplements: 0,
      };

      ingredientMap.set(ingredientName, {
        totalQuantityInCommandes:
          currentIngredient.totalQuantityInCommandes +
          (isSupplement ? parsedQuantity : 0) +
          (isSupplement ? 0 : parsedQuantity),
        quantityInMenu: isMenuCompose
          ? currentIngredient.quantityInMenu
          : isSupplement
          ? currentIngredient.quantityInMenu
          : currentIngredient.quantityInMenu + parsedQuantity,
        quantityInMenuCompose: isMenuCompose
          ? currentIngredient.quantityInMenuCompose + parsedQuantity
          : currentIngredient.quantityInMenuCompose,
        quantityInSupplements: isSupplement
          ? currentIngredient.quantityInSupplements + parsedQuantity
          : currentIngredient.quantityInSupplements,
      });
    };

    data.forEach((order) => {
      if (order.etat === "Validé") {
        const orderQuantity = order.quantite || 1;
        order?.menu?.forEach((menuItem) => {
          if (menuItem.__component === "menus.commande-menu") {
            menuItem?.menu.ingredients?.forEach((ingredientItem) => {
              updateIngredientQuantities(
                ingredientItem,
                ingredientItem.quantite_demande * orderQuantity,
                false,
                false,
                ingredientItem.count || 1
              );
            });
            menuItem?.suplimentaires?.forEach((supplementItem) => {
              updateIngredientQuantities(
                { ingredient: supplementItem.ingredient },
                supplementItem.quantite * orderQuantity,
                false,
                true,
                supplementItem.count || 1
              );
            });
          } else if (menuItem.__component === "menus.menu-compose") {
            menuItem?.ingredients?.forEach((ingredientItem) => {
              updateIngredientQuantities(
                ingredientItem,
                ingredientItem.quantite * orderQuantity,
                true,
                false,
                ingredientItem.count || 1
              );
            });
          }
        });
      }
    });

    const gridData = Array.from(ingredientMap, ([ingredient, values]) => ({
      ingredient,
      ...values,
    }));
    return gridData;
  }

  const gridData = ingredientsConsumption(data?.data || []).map(
    (row, index) => ({
      ...row,
      id: index + 1,
    })
  );

  console.log("GridData", gridData);
  //

  //
  function countOrdersByTypeAndStatus(orders) {
    return orders?.reduce(
      (counts, order) => {
        const { type, etat, total } = order;
        counts.totalCount++;

        // Count by type
        // counts[type] = counts[type] ? counts[type] + 1 : 1;

        if (type === "Emporté" && etat === "Validé") {
          counts.Emporté++;
        } else if (type === "Sur place" && etat === "Validé") {
          counts["Sur place"]++;
        }

        // Count by status
        counts[etat] = counts[etat] ? counts[etat] + 1 : 1;
        // Sum total for orders with etat "Validé"
        if (etat === "Validé") {
          counts.totalValidé += parseInt(total) || 0; // Add the total to the existing sum
        }

        return counts;
      },
      {
        totalCount: 0,
        Emporté: 0,
        "Sur place": 0,
        Validé: 0,
        "En cours": 0,
        Annulé: 0,
        totalValidé: 0,
      }
    );
  }

  // Call the function and log the results
  const orderCounts = countOrdersByTypeAndStatus(data?.data);
  //   console.log("Total Orders:", orderCounts?.totalCount);
  //   console.log("Emporté Orders:", orderCounts?.["Emporté"] || 0);
  //   console.log("Sur place Orders:", orderCounts?.["Sur place"] || 0);
  //   console.log("Validé Orders:", orderCounts?.["Validé"] || 0);
  //   console.log("En cours Orders:", orderCounts?.["En cours"] || 0);
  //   console.log("Annulé Orders:", orderCounts?.["Annulé"] || 0);
  //   console.log("ATotale Validé:", orderCounts?.["totalValidé"] || 0);
  //

  //
  const columns = React.useMemo<GridColDef<any>[]>(
    () => [
      {
        field: "ingredient",
        headerName: "Ingredient",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "totalQuantityInCommandes",
        headerName: "Quantité en commande",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "quantityInMenu",
        headerName: "Quantité utilisée dans Menu",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "quantityInMenuCompose",
        headerName: "Quantité utilisée dans Menu Compose",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "quantityInSupplements",
        headerName: "Quantité utilisée dans Suppléments",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
    ],
    []
  );
  return (
    <Paper
      sx={{
        paddingX: { xs: 3, md: 2 },
        paddingY: { xs: 2, md: 3 },
        my: 0.5,
      }}
    >
      {/* cards */}
      <Typography variant="h5">Dashboard</Typography>
      <Stack spacing={2}>
        <Button
          size="large"
          onClick={openDatePicker}
          startIcon={<CalendarToday />}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        >
          {periode[0].startDate && periode[0].endDate
            ? `${moment(periode[0].startDate).format("DD/MM/YYYY")} → ${moment(
                periode[0].endDate
              ).format("DD/MM/YYYY")}`
            : "date de début → date de fin"}
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={closeDatePicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DateRangePicker
              onChange={(item) => setPeriode([item.selection])}
              ranges={periode}
              showSelectionPreview={false}
              showPreview={false}
            />
            <Button
              onClick={applyDateRange}
              variant="contained"
              style={{ marginTop: "16px" }}
            >
              Appliquer
            </Button>

            <Button
              onClick={clearDateSelection}
              variant="contained"
              style={{ marginTop: "16px" }}
            >
              Effacer la sélection
            </Button>
          </div>
        </Popover>
        <Stack
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          flexWrap="wrap"
          padding={1}
          gap={1}
        >
          {/* <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            ></Paper> */}
          <AnalyticsCard
            title="Revenu total"
            img="images/wallet.svg"
            value={orderCounts?.["totalValidé"] || 0}
            color="rgba(249, 240, 234, 1)"
          />

          <AnalyticsCard
            title="Commandes"
            img="images/Vector.svg"
            value={orderCounts?.["Validé"] || 0}
            color="rgba(234, 249, 242, 1)"
          />

          <AnalyticsCard
            title="Sur place"
            img="images/Group.svg"
            value={orderCounts?.["Sur place"] || 0}
            color="rgba(249, 234, 234, 1)"
          />
          <AnalyticsCard
            title="A emporter"
            img="images/pack.svg"
            value={orderCounts?.["Emporté"] || 0}
            color="rgba(249, 244, 234, 1)"
          />
        </Stack>
        {/* DataGrid */}
        <Box
          sx={{
            height: 500,
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          <DataGrid
            // {...dataGridProps}
            rows={gridData}
            columns={columns}
            filterModel={undefined}
            autoHeight
            pageSizeOptions={[5, 10, 20, 50, 100]}
            sx={{
              ...dataGridProps.sx,
              "& .MuiDataGrid-row": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};
