import React, { useEffect, useState } from "react";
import { HttpError, useCreate, useUpdate } from "@refinedev/core";
import {
  UseModalFormReturnType,
  useModalForm,
} from "@refinedev/react-hook-form";

import { Show } from "@refinedev/mui";

import Drawer from "@mui/material/Drawer";

import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import PrintIcon from "@mui/icons-material/Print";
import { IOrder } from "../../interfaces";
import { API_URL, TOKEN_KEY } from "../../constants";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { PrintReceipt } from "../../components/order/PrintReceipt";
import { useNavigate } from "react-router-dom";

interface ShowOrderProps {
  id: number;
}

export const ShowOrder: React.FC<
  UseModalFormReturnType<IOrder, HttpError, IOrder> & ShowOrderProps
> = ({ modal: { visible, close }, id }) => {
  //
  const { mutate } = useUpdate();
  const { mutate: mutateCreate } = useCreate();
  const navigate = useNavigate();
  const [record, setRecord] = useState<IOrder | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/commandes/${id}?populate=deep`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            },
          }
        );
        const data = await response?.json();
        setRecord(data?.data?.attributes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecord();
  }, [id]);
  //
  // Modal
  const createModalFormProps = useModalForm<IOrder, HttpError, IOrder>({});
  const {
    modal: { show: showCreateModal },
  } = createModalFormProps;
  //
  return (
    <>
      <Drawer
        sx={{ zIndex: "1301" }}
        PaperProps={{ sx: { width: { sm: "100%", md: 500 } } }}
        open={visible}
        onClose={close}
        anchor="right"
      >
        <Show
          headerProps={{
            avatar: (
              <IconButton
                onClick={() => close()}
                sx={{
                  width: "30px",
                  height: "30px",
                  mb: "5px",
                }}
              >
                <CloseOutlined />
              </IconButton>
            ),
            action: null,
          }}
          wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
        >
          <Stack>
            <Box
              justifyContent="center"
              alignItems="center"
              sx={{
                paddingX: {
                  xs: 1,
                  md: 6,
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" py={3}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    textTransform: "uppercase",
                    textOverflow: "ellipsis",
                  }}
                >
                  Commande: {record?.code}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    textOverflow: "ellipsis",
                    color: "#ff9800",
                  }}
                >
                  {record?.type}
                </Typography>
                {record?.table && (
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "16px",
                      textOverflow: "ellipsis",
                      color: "#689f38",
                    }}
                  >
                    {record?.table?.data?.attributes?.nom}
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Stack gap={3}>
                <div
                  style={{
                    maxHeight: "550px", // Set the maximum height you desire
                    overflowY: "scroll", // Enable vertical scrollbar when content overflows
                  }}
                >
                  {(record?.menu as any)
                    ?.map((k: any) => ({
                      ...k,
                      menu: k?.menu?.data?.attributes,
                    }))
                    ?.map((item: any) => (
                      <>
                        <Card
                          key={item?.id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            height: "100%",
                            width: "100%",
                            padding: 1,
                          }}
                        >
                          <CardHeader sx={{ padding: 0, mt: 1 }} />
                          <Stack direction="row" sx={{ gap: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{
                                  width: {
                                    xs: 60,
                                    sm: 60,
                                    lg: 80,
                                    xl: 144,
                                  },
                                  height: {
                                    xs: 60,
                                    sm: 60,
                                    lg: 80,
                                    xl: 144,
                                  },
                                  borderRadius: "50%",
                                }}
                                alt={
                                  item?.menu?.titre
                                    ? item?.menu?.titre
                                    : item?.titre
                                }
                                //   image={image?.url}
                                image={
                                  item?.menu?.image?.data?.attributes?.url
                                    ? `${API_URL}${item?.menu?.image?.data?.attributes?.url}`
                                    : "https://res.cloudinary.com/dbryh9xlh/image/upload/v1698673152/menuCompose_wctyxs.png"
                                }
                              />
                            </Box>
                            <Divider
                              orientation="vertical"
                              variant="middle"
                              flexItem
                            />
                            <Box>
                              <CardContent
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                  flex: 1,
                                  padding: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    fontSize: "16px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item?.menu?.titre
                                    ? item?.menu?.titre
                                    : item?.titre}{" "}
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "14px",
                                      marginLeft: 10,
                                    }}
                                  ></span>
                                </Typography>
                                <Box>
                                  {item?.ingredients?.flatMap((item) => (
                                    <Typography key={item?.id}>
                                      ({item?.count} x {item?.nom}) {item?.prix}
                                    </Typography>
                                  ))}
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item?.quantite} {""}x
                                  {item?.menu?.prix
                                    ? item?.menu?.prix
                                    : item?.prix}
                                </Typography>
                              </CardContent>
                            </Box>
                          </Stack>
                        </Card>
                      </>
                    ))}
                </div>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  px={2}
                  my={2}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "16px",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Total:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "16px",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {record?.total} DA
                  </Typography>
                </Stack>
              </Stack>
              {record?.etat === "En cours" ? (
                <>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    gap={2}
                    mt={6}
                    mb={3}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CheckOutlinedIcon color="success" />}
                      sx={{
                        color: "#4caf50",
                        borderColor: "#4caf50",
                        width: "100%",
                      }}
                      onClick={() => {
                        mutate(
                          {
                            resource: "commandes",
                            id,
                            values: {
                              etat: "Validé",
                            },
                          },
                          {
                            onSuccess: () => {
                              mutateCreate({
                                resource: "tresoriers",
                                values: {
                                  type: "Vente",
                                  titre: "Vente",
                                  user: record?.users_permissions_user?.data
                                    ?.id,
                                  montant: record?.total,
                                  caisse: record?.caisse?.data?.id,
                                },
                              });
                            },
                          }
                        );
                        close();
                      }}
                    >
                      Validé
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Edit color="warning" />}
                      sx={{
                        color: "#ff9800",
                        borderColor: "#ff9800",
                        width: "100%",
                      }}
                      onClick={() => {
                        navigate("/caisse?selectedOrder=" + id);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloseOutlinedIcon color="error" />}
                      sx={{
                        color: "#f44336",
                        borderColor: "#f44336",
                        width: "100%",
                      }}
                      onClick={() => {
                        mutate({
                          resource: "commandes",
                          id,
                          values: {
                            etat: "Annulé",
                          },
                        });
                        close();
                      }}
                    >
                      Annulé
                    </Button>
                  </Stack>
                  <Button
                    variant="outlined"
                    startIcon={<PrintIcon color="secondary" />}
                    sx={{
                      color: "#673ab7",
                      borderColor: "#673ab7",
                      width: "100%",
                    }}
                    onClick={() => {
                      showCreateModal();
                    }}
                  >
                    Imprimer
                  </Button>
                </>
              ) : record?.etat === "Validé" ? (
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon color="secondary" />}
                  sx={{
                    color: "#673ab7",
                    borderColor: "#673ab7",
                    width: "100%",
                  }}
                  onClick={() => {
                    showCreateModal();
                  }}
                >
                  Imprimer
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Edit color="warning" />}
                  sx={{
                    color: "#ff9800",
                    borderColor: "#ff9800",
                    width: "100%",
                  }}
                  onClick={() => {
                    navigate("/caisse?selectedOrder=" + id);
                  }}
                >
                  Modifier
                </Button>
              )}
            </Box>
          </Stack>
        </Show>
      </Drawer>
      <PrintReceipt {...createModalFormProps} record={record} />
    </>
  );
};
