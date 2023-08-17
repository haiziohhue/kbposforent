// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   IconButton,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import ResizeDataGrid from "../../components/reusable/ResizeDataGrid";
// import { Add, Close, Delete } from "@mui/icons-material";
// import { API_URL } from "../../constants";
// import { useSearchParams } from "react-router-dom";
// import Swal from "sweetalert2";

// type ParamsProps = {
//   title: string;
// };

// type ParamsList = {
//   [key: string]: ParamsProps;
// };
// export const ParamsList = {
//   "data-restaurants": {
//     title: "Données De Restaurant",
//   },
//   categorie: {
//     title: "Categories",
//   },
//   caisse: {
//     title: "Gestion Des Caisses",
//   },
//   table: {
//     title: "Gestion Des Tables",
//   },
//   categorie_depense: {
//     title: "Categories Depenses",
//   },
// };

// export const SettingsManagement = ({ element, handleClose }) => {
//   const { title } = ParamsList[element];
//   const open = element !== null;
//   const [columns, setcolumns] = useState<any>([]);
//   const [data, setdata] = useState<any>({});
//   const [rows, setrows] = useState<any>([]);
//   const [loading, setloading] = useState(false);
//   const [refresh, setrefresh] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const getData = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/parametre-values?filters[parametre][nom][$eq]=${element}&populate=*`
//       );

//       const data = response.data?.data;
//       const list = data?.map((e: any) => ({ id: e.id, ...e.attributes }));
//       const col = list[0]?.parametre?.data?.attributes.schema?.data;
//       console.log(col);
//       setSearchParams({ ...searchParams, id: list[0]?.parametre.data.id });
//       const uData = {};
//       setdata(uData);
//       setcolumns(col || []);
//       setrows(list?.map((e) => ({ id: e.id, ...e.value })));
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     getData();
//   }, [element]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setdata((prev: any) => {
//       return {
//         ...prev,
//         [e.target.name]: e.target.value,
//       };
//     });
//   };
//   const ajouterSetting = async () => {
//     const rd = {
//       data: {
//         parametre: [Number(searchParams.get("id"))],
//         value: data,
//       },
//     };

//     try {
//       const response = await axios.post(`${API_URL}/api/parametre-values`, rd);

//       if (response.status === 200) {
//         Swal.fire({
//           title: "Succés",
//           text: "Paramétre ajouté avec succés",
//           icon: "success",
//           confirmButtonText: "Ok",
//         });
//         getData();
//       }
//     } catch (error) {
//       console.error("Error adding setting:", error);
//     }
//   };

//   // Edit
//   const processRowUpdate = async (nouveauRow, oldRow) => {
//     console.log("nouveauRow:", nouveauRow);
//     console.log("oldRow:", oldRow);
//     // eslint-disable-next-line no-var
//     var changed = { ...nouveauRow };
//     delete changed.id;
//     if (JSON.stringify(nouveauRow) === JSON.stringify(oldRow)) {
//       console.log("No change detected");
//       return;
//     }
//     const rd = {
//       data: {
//         parametre: [Number(searchParams.get("id"))],
//         value: changed,
//       },
//     };
//     console.log("rd:", rd);

//     try {
//       const res = await updateSetting(oldRow.id, rd);
//       console.log("Update response:", res);

//       if (res.status === 200) {
//         Swal.fire({
//           title: "Succés",
//           text: "Paramétre modifié avec succés",
//           icon: "success",
//           confirmButtonText: "Ok",
//         });
//         return nouveauRow;
//       } else {
//         return oldRow;
//       }
//     } catch (error) {
//       console.error("Error updating setting:", error);
//       return oldRow;
//     }
//   };

//   //
//   const supprimerSetting = (id: number) => {
//     Swal.fire({
//       title: "Etes vous sur?",
//       text: "Vous ne pourrez pas revenir en arrière!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Oui, supprimer!",
//       cancelButtonText: "Non, annuler!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteSetting(id).then((res) => {
//           if (res.status === 200) {
//             Swal.fire({
//               title: "Succés",
//               text: "Paramétre supprimé avec succés",
//               icon: "success",
//               confirmButtonText: "Ok",
//             });
//             getData();
//           }
//         });
//       }
//     });
//   };
//   console.log(Number(searchParams.get("id")));
//   return (
//     <Box>
//       <Dialog
//         fullWidth
//         maxWidth="md"
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 2,
//           }}
//           id="alert-dialog-title"
//         >
//           <Box>
//             <Typography
//               sx={{
//                 mt: 2,
//                 textTransform: "uppercase",
//                 fontSize: 20,
//                 fontWeight: "bold",
//               }}
//               color={"primary.main"}
//             >
//               {title}
//             </Typography>
//           </Box>

//           <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
//         </DialogTitle>

//         <Box sx={{ display: "flex", p: 2, m: 2, gap: 3, flexWrap: "wrap" }}>
//           {columns?.map((e) => {
//             return (
//               <TextField
//                 key={e.field}
//                 sx={{ width: "30%" }}
//                 label={e.headerName}
//                 onChange={handleChange}
//                 value={data[e.field]}
//                 name={e.field}
//                 placeholder={e.headerName}
//                 type={e.type}
//               />
//             );
//           })}
//           <Button
//             startIcon={<Add />}
//             variant="contained"
//             onClick={() => {
//               ajouterSetting();
//             }}
//           >
//             Ajouter
//           </Button>
//         </Box>
//         <DialogContent>
//           <Divider sx={{ mb: 3 }} />
//           <Box sx={{ height: 300 }}>
//             <ResizeDataGrid
//               editMode="row"
//               processRowUpdate={processRowUpdate}
//               onProcessRowUpdateError={(error) => {
//                 console.log(error);
//               }}
//               columns={[
//                 ...columns,
//                 {
//                   field: "action",
//                   headerName: "Action",
//                   width: 150,
//                   renderCell: (params) => (
//                     <IconButton
//                       onClick={() => {
//                         supprimerSetting(params.row.id);
//                       }}
//                     >
//                       <Delete color="error" />
//                     </IconButton>
//                   ),
//                 },
//               ]}
//               refreshParent={refresh}
//               loading={loading}
//               rows={rows}
//             />
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };
// const deleteSetting = (id: number) => {
//   return axios.delete(`${API_URL}/api/parametre-values/${id}`);
// };
// const updateSetting = (data, id) => {
//   return axios.put(`${API_URL}/api/parametre-values/${id}`, data);
// };
import React from "react";

const SettingsManagement = () => {
  return <div>SettingsManagement</div>;
};

export default SettingsManagement;
