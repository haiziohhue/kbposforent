import { Box, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useEffect } from "react";
import dayjs from "dayjs";

import { List, useDataGrid } from "@refinedev/mui";
import { HttpError } from "@refinedev/core";
import { IStock } from "interfaces";
import { useNavigate } from "react-router-dom";

export const StockList = () => {
  const navigate = useNavigate();
  const { dataGridProps } = useDataGrid<IStock, HttpError>({
    initialPageSize: 10,
    meta: { populate: "deep" },
  });
  console.log(dataGridProps.rows);
  const columns = React.useMemo<GridColDef<IStock>[]>(
    () => [
      {
        field: "id",
        headerName: "Stock ID",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 60,
      },
      {
        field: "nom",
        headerName: "Ingredients",
        headerAlign: "center",
        align: "center",
        flex: 1,
        valueGetter: (params) => {
          return params.row?.ingredient?.nom;
        },
        minWidth: 200,
      },
      {
        field: "quantite",
        headerName: "Quantite",
        headerAlign: "center",
        align: "center",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "publishedAt",
        headerAlign: "center",
        align: "center",
        headerName: "Date de création",
        type: "date",
        minWidth: 200,
        valueGetter: (params) => {
          return new Date(params.row.publishedAt);
        },
        renderCell(params) {
          return (
            <Typography>{dayjs(params.value).format("DD-MM-YYYY")}</Typography>
          );
        },
      },
    ],
    []
  );

  //
  // const getData = useCallback(() => {
  //   getSuiviStock("populate=deep").then((res) => {
  //     const data = res.data.data.map((e) => {
  //       return {
  //         id: e.id,
  //         ...e.attributes,
  //       };
  //     });
  //     console.log(data);
  //     setRows(data);
  //   });
  // }, []);
  // useEffect(() => {
  //   getData();
  // }, []);
  //

  return (
    <List
      wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
      createButtonProps={{
        sx: {
          display: "none",
        },
      }}
    >
      <DataGrid
        {...dataGridProps}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        columns={columns}
        onCellClick={(params: GridCellParams) => {
          navigate(`product/${params.row?.article?.data?.id}`, {
            state: { data: params.row },
          });
        }}
        autoHeight
        sx={{
          fontSize: 14,
          ...dataGridProps.sx,
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </List>
  );
};

// const getSuiviStock = (filter) => {
//   return axios.get(`${API_URL}/api/stocks?${filter}`);
// };
