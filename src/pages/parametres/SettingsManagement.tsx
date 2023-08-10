import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ResizeDataGrid from "../../components/reusable/ResizeDataGrid";
import { Add, Close } from "@mui/icons-material";

type ParamsProps = {
  title: string;
};

type ParamsList = {
  [key: string]: ParamsProps;
};
export const ParamsList = {
  data_restaurants: {
    title: "Categorie",
  },
  categories: {
    title: "Categorie",
  },
};
export const SettingsManagement = ({ element, handleClose }) => {
  const { title } = ParamsList[element];
  const open = element !== null;
  const [columns, setcolumns] = useState<any>([]);
  const [data, setdata] = useState<any>({});
  const [rows, setrows] = useState<any>([]);
  const getData = async () => {
    try {
      const response = await axios.get(`/api/${element}`);
      setdata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData();
  }, [element]);
  console.log(data);
  return (
    <Box>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
          id="alert-dialog-title"
        >
          <Box>
            <Typography sx={{ mt: 2 }} variant="h1" color={"primary.main"}>
              {title}
            </Typography>
          </Box>

          <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
        </DialogTitle>

        {/* <Box sx={{ display: "flex", p: 2, m: 2, gap: 3, flexWrap: "wrap" }}>
          {columns.map((e) => {
            if (e.type === "singleSelect") {
              return (
                <Select
                  //   onChange={(e, k) => handleChange(e as any)}
                  sx={{ width: "25%" }}
                  value={data[e.field]}
                  name={e.field}
                >
                  {e.valueOptions.map((option: any) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
                </Select>
              );
            }

            return (
              <TextField
                sx={{ width: "30%" }}
                label={e.headerName}
                // onChange={handleChange}
                value={data[e.field]}
                name={e.field}
                placeholder={e.headerName}
                type={e.type}
              />
            );
          })}
          <Button
            startIcon={<Add />}
            variant="contained"
            // onClick={() => {
            //   ajouterSetting();
            // }}
          >
            Ajouter
          </Button>
        </Box> */}
        <DialogContent>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ height: 300 }}>
            <ResizeDataGrid
              editMode="row"
              //   processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(error) => {
                console.log(error);
              }}
              columns={[
                ...columns,
                // {
                //   field: "action",
                //   headerName: "Action",
                //   width: 150,
                //   renderCell: (params) => (
                //     <IconButton
                //       onClick={() => {
                //         supprimerSetting(params.row.id);
                //       }}
                //     >
                //       <DeleteIcon color="error" />
                //     </IconButton>
                //   ),
                // },
              ]}
              rows={rows}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
