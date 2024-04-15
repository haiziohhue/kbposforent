import React, { useEffect, useState } from "react";
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
import { CrudFilters, useList } from "@refinedev/core";
import { IOrder } from "interfaces";
import { AnalyticsCard } from "./card";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { CalendarToday } from "@mui/icons-material";
import moment from "moment";
import { PopularMenusCard } from "./popular";
import { API_URL } from "../../constants";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

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

  const { dataGridProps, search } = useDataGrid<IOrder>({
    resource: "commandes",
    initialPageSize: 10,
    sorters: {
      permanent: [
        {
          field: "id",
          order: "asc",
        },
      ],
    },
    meta: { populate: "deep" },
    onSearch: () => {
      const filters: CrudFilters = [];
      if (periode[0].startDate && periode[0].endDate) {
        const startDate = moment(periode[0].startDate)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");
        const endDate = moment(periode[0].endDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]");

        filters.push({
          field: "createdAt",
          operator: "between",
          value: [startDate, endDate],
        });
      }
      return filters;
    },
  });
  //
  console.log(dataGridProps?.rows);
  // Date Picker
  const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePicker = () => {
    setAnchorEl(null);
  };

  const applyDateRange = () => {
    search({});
    closeDatePicker();
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

  // Ingredients Consumption Function
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
            menuItem?.menu?.ingredients?.forEach((ingredientItem) => {
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

  const gridData = ingredientsConsumption(dataGridProps?.rows || []).map(
    (row, index) => ({
      ...row,
      id: index + 1,
    })
  );

  //

  // Analytics cards Function
  function countOrdersByTypeAndStatus(orders) {
    return orders?.reduce(
      (counts, order) => {
        const { type, etat, total, createdAt } = order;
        counts.totalCount++;

        // Count by type

        if (type === "Emporté" && etat === "Validé") {
          counts.Emporté++;
        } else if (type === "Sur place" && etat === "Validé") {
          counts["Sur place"]++;
        }

        // Count by status
        counts[etat] = counts[etat] ? counts[etat] + 1 : 1;
        // Sum total for orders with etat "Validé"
        if (etat === "Validé") {
          counts.totalValidé += parseInt(total) || 0;
        }
        const date = new Date(createdAt).toLocaleDateString();
        if (!counts.dates.includes(date)) {
          counts.dates.push(date);
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
        dates: [],
      }
    );
  }

  const orderCounts = countOrdersByTypeAndStatus(dataGridProps?.rows || []);

  // Popular Menus Function
  function countMenus(orders) {
    const menuCounts = new Map();
    const validOrders = orders?.filter((order) => order?.etat === "Validé");

    validOrders.forEach((order) => {
      order.menu.forEach((menuItem) => {
        if (menuItem.__component === "menus.commande-menu") {
          const menuName = menuItem?.menu?.titre;
          const menuImage = menuItem?.menu?.image.url;

          const entry = menuCounts.get(menuName) || {
            count: 0,
            image: menuImage,
          };

          entry.count++;

          menuCounts.set(menuName, entry);
        }
      });
    });

    const sortedMenus = Array.from(menuCounts.entries()).sort(
      (a, b) => b[1].count - a[1].count
    );

    return sortedMenus;
  }
  // Fetch popular dishes when orders data changes
  const [popularDishes, setPopularDishes] = useState<[any, any][]>([]);

  useEffect(() => {
    if (dataGridProps) {
      const dishes = countMenus(dataGridProps?.rows || []);
      setPopularDishes(dishes);
    }
  }, [dataGridProps?.rows]);

  // Charts
  // Area Chart
  function countOrdersByDateAndStatus(orders) {
    const orderCountsByDate: { date: string; count: number }[] = [];

    orders.forEach((order) => {
      if (order.etat === "Validé") {
        const orderDate = order.createdAt?.split("T")[0];

        const existingEntryIndex = orderCountsByDate.findIndex(
          (entry) => entry.date === orderDate
        );

        if (existingEntryIndex !== -1) {
          orderCountsByDate[existingEntryIndex].count++;
        } else {
          orderCountsByDate.push({ date: orderDate, count: 1 });
        }
      }
    });

    return orderCountsByDate;
  }

  const orderCountsByDate = countOrdersByDateAndStatus(
    dataGridProps?.rows || []
  );

  // Pie Chart
  interface RevenueEntry {
    label: string;
    value: number;
  }
  function calculateRevenueByCategory(orders) {
    const filteredOrders = orders.filter((order) => order.etat === "Validé");

    const revenueByCategory: RevenueEntry[] = [];

    filteredOrders.forEach((order) => {
      order.menu.forEach((menuItem) => {
        if (menuItem.__component === "menus.commande-menu") {
          const categoryName = menuItem?.menu?.categorie.nom;
          const price = parseFloat(menuItem?.menu?.prix);
          const total = price * menuItem?.quantite;

          const existingCategory = revenueByCategory.find(
            (entry) => entry.label === categoryName
          );

          if (existingCategory) {
            existingCategory.value += total;
          } else {
            revenueByCategory.push({ label: categoryName, value: total });
          }
        }
      });
    });

    return revenueByCategory;
  }

  const revenueByCategory = calculateRevenueByCategory(
    dataGridProps?.rows || []
  );

  //
  const size = {
    width: 400,
    height: 200,
  };

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
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
      // {
      //   field: "quantityInMenuCompose",
      //   headerName: "Quantité utilisée dans Menu Compose",
      //   headerAlign: "center",
      //   align: "center",
      //   flex: 1,
      //   minWidth: 150,
      // },
      // {
      //   field: "quantityInSupplements",
      //   headerName: "Quantité utilisée dans Suppléments",
      //   headerAlign: "center",
      //   align: "center",
      //   flex: 1,
      //   minWidth: 150,
      // },
    ],
    []
  );
  return (
    <Paper
      sx={{
        paddingX: { xs: 3, md: 2 },
        paddingY: { xs: 2, md: 3 },
        my: 0.5,
        backgroundColor: "rgba(250, 250, 250, 1)",
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            size="large"
            onClick={openDatePicker}
            startIcon={<CalendarToday />}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          >
            {periode[0].startDate && periode[0].endDate
              ? `${moment(periode[0].startDate).format(
                  "DD/MM/YYYY"
                )} → ${moment(periode[0].endDate).format("DD/MM/YYYY")}`
              : "date de début → date de fin"}
          </Button>
        </Box>

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
          gap={4}
        >
          {/* Cards */}

          <Grid container spacing={4}>
            <Grid item xs={12} lg={3}>
              <AnalyticsCard
                title="Revenu total"
                img="images/wallet.svg"
                value={orderCounts?.["totalValidé"] || 0}
                color="rgba(249, 240, 234, 1)"
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <AnalyticsCard
                title="Commandes"
                img="images/Vector.svg"
                value={orderCounts?.["Validé"] || 0}
                color="rgba(234, 249, 242, 1)"
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <AnalyticsCard
                title="Sur place"
                img="images/Group.svg"
                value={orderCounts?.["Sur place"] || 0}
                color="rgba(249, 234, 234, 1)"
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <AnalyticsCard
                title="A emporter"
                img="images/pack.svg"
                value={orderCounts?.["Emporté"] || 0}
                color="rgba(249, 244, 234, 1)"
              />
            </Grid>
          </Grid>
          {/* Charts */}
          <Grid container spacing={4}>
            <Grid item xs={12} lg={7}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 450,
                  maxHeight: 450,
                  overflow: "auto",
                  width: "100%",
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <LineChart
                  width={600}
                  height={400}
                  series={[
                    {
                      data: orderCountsByDate?.map((entry) => entry?.count),
                      label: "Commandes",
                      area: true,
                      showMark: true,
                      curve: "monotoneX",
                      connectNulls: true,
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: orderCountsByDate?.map((entry) => entry?.date),
                    },
                  ]}
                  sx={{
                    ".MuiLineElement-root": {
                      display: "none",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 450,
                  maxHeight: 450,
                  overflow: "auto",
                  width: "100%",
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <PieChart
                  series={[{ data: revenueByCategory, innerRadius: 80 }]}
                  {...size}
                >
                  <PieCenterLabel>
                    {orderCounts?.["totalValidé"] || 0}
                  </PieCenterLabel>
                </PieChart>
              </Box>
            </Grid>
          </Grid>
          {/* Consumption */}
          <Grid container spacing={4}>
            <Grid item xs={12} lg={3}>
              <Box
                sx={{
                  height: 350,
                  maxHeight: 350,
                  overflow: "auto",
                  width: "100%",
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Plats Tendances
                </Typography>
                <Stack spacing={2}>
                  {popularDishes.map(([menu, { count, image }], index) => (
                    <PopularMenusCard
                      key={index}
                      title={menu}
                      img={`${API_URL}${image}`}
                      value={count}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Box
                sx={{
                  height: 350,
                  maxHeight: 350,
                  overflow: "auto",
                  width: "100%",
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Consommation
                </Typography>
                <DataGrid
                  {...dataGridProps}
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
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Paper>
  );
};
