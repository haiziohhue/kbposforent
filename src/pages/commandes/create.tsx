import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  List,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  HttpError,
  IResourceComponentsProps,
  useGetIdentity,
  useList,
} from "@refinedev/core";
import { Create, useAutocomplete } from "@refinedev/mui";
import React, { useContext, useEffect, useState } from "react";
import { ICaisse, ICartMenu, IOrder, ITable, IUser } from "../../interfaces";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/cart/CartProvider";
import { Add, CloseOutlined, Remove } from "@mui/icons-material";
import { API_URL } from "../../constants";
import axios from "axios";

export const CreateOrder: React.FC<IResourceComponentsProps> = () => {
  const { data: user } = useGetIdentity<IUser>();
  const navigate = useNavigate();
  const {
    saveButtonProps,
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IOrder, HttpError, IOrder>();

  //
  const { autocompleteProps } = useAutocomplete<ITable>({
    resource: "tables",
  });

  //

  const { data: caisses, isLoading } = useList<ICaisse>({
    resource: "caisses",
  });
  //

  const { data: users } = useList<IUser>({
    resource: "users",
  });
  //
  const userId = user && user?.id;
  //

  const [selectedCaisse, setSelectedCaisse] = useState<ICaisse | undefined>(
    undefined
  );
  useEffect(() => {
    const caisseId = user?.caisse?.id;
    if (caisseId) {
      const foundCaisse = caisses?.data?.find(
        (caisse: ICaisse) => caisse?.id === caisseId
      );

      setSelectedCaisse(foundCaisse || undefined);
      localStorage.setItem("selectedCaisseId", String(caisseId));
    } else {
      setSelectedCaisse(undefined);
      localStorage.removeItem("selectedCaisseId");
    }
  }, [caisses?.data, user?.caisse]);

  useEffect(() => {
    setValue(
      "users_permissions_user",
      users?.data?.find((user: IUser) => user?.id === userId)
    );
    setValue("etat", "En cours");
    setValue("caisse", selectedCaisse);
  }, [selectedCaisse, setValue, userId, users?.data]);
  // ...

  const handleListItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    caisseId: ICaisse
  ) => {
    setSelectedCaisse(caisseId);
  };

  // Cart
  const { cartState, dispatch } = useContext(CartContext);
  const { cartItems } = cartState;

  const handleRemoveItem = (itemId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: itemId, quantity: newQuantity },
    });
  };

  const handleClearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  // Calculate the subtotal for each item
  const calculateSubtotal = (item: ICartMenu) => {
    return item.menus?.prix * item?.quantity;
  };

  // Calculate the total for all items in the cart
  const calculateTotal = () => {
    let total = 0;
    for (const item of cartItems) {
      total += calculateSubtotal(item);
    }
    return total;
  };
  console.log(cartItems);
  const onFinishHandler = async (data: IOrder) => {
    const payload = {
      ...data,
      // menus: cartItems.map((item) => ({
      //   menu: [item.id],
      //   quantite: item.quantity,
      // })),

      menu: cartItems.map((item) => {
        const componentType = item?.component;
        if (componentType === "menus.Commande-menu") {
          return {
            __component: "menus.commande-menu",
            menu: item?.id,
            quantite: item?.quantity,
          };
        } else if (componentType === "menus.menu-compose") {
          return {
            __component: "menus.menu-compose",
            categorie: item?.categorie,
            ingredient: item?.menus?.ingredients?.map((item) => ({
              ingredient: item?.id,
            })),
            prix: item?.prix,
            quantite: item?.quantity,
            titre: item?.titre,
            image: item?.image,
          };
        }
      }),

      total: calculateTotal(),
    };

    try {
      const response = await axios.post(`${API_URL}/api/commandes`, {
        data: payload,
      });
      console.log("Request succeeded:", response.data);
      handleClearCart();
      navigate(`/commandes`);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={<div style={{ display: "none" }} />}
      goBack={<div style={{ display: "none" }} />}
      footerButtonProps={{
        sx: {
          display: "none",
        },
      }}
      // wrapperProps={{ sx: { overflowY: 'scroll', height: '100vh' } }}
    >
      <form onSubmit={handleSubmit(onFinishHandler)}>
        <Box sx={{ gap: 2 }}>
          <Stack gap={1} marginY={1.5}>
            {/* Caisse */}
            <Stack>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {caisses?.data?.map((caisse: ICaisse) => (
                  <Button
                    key={caisse.id}
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => handleListItemClick(event, caisse)}
                    variant={
                      selectedCaisse?.id === caisse?.id
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      borderRadius: "30px",
                    }}
                    disabled={isLoading}
                  >
                    <ListItemText primary={caisse.nom} />
                    <input
                      type="hidden"
                      {...register("caisse")}
                      // value={caisse}
                    />
                  </Button>
                ))}
              </List>
            </Stack>
            {/* Type */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="type"
                rules={{
                  required: "This field is required",
                }}
                // defaultValue={'sur place'}
                render={({ field }) => (
                  <Autocomplete
                    size="medium"
                    {...field}
                    onChange={(_, value) => {
                      field.onChange(value);
                    }}
                    options={["Sur place", "Emporté"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Type"
                        error={!!errors.type}
                        required
                      />
                    )}
                  />
                )}
              />
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </FormControl>
            {/* Table */}
            {watch("type") === "Sur place" && (
              <FormControl>
                <Controller
                  control={control}
                  name="table"
                  rules={{
                    required: "This field is required",
                  }}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      {...autocompleteProps}
                      {...field}
                      onChange={(_, value) => {
                        field.onChange(value?.id);
                      }}
                      getOptionLabel={(item) => {
                        return item.nom ? item.nom : "";
                      }}
                      getOptionDisabled={(option) => option.etat === "Occupé"}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.id?.toString() ===
                          (value?.id ?? value)?.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Table"
                          variant="outlined"
                          error={!!errors.table?.message}
                          required
                        />
                      )}
                    />
                  )}
                />
                {errors.table && (
                  <FormHelperText error>{errors.table.message}</FormHelperText>
                )}
              </FormControl>
            )}
          </Stack>
          <Divider />
          {/* Cart */}
          <Box
            sx={{
              height: "50vh",
              width: "100%",
              overflowY: "scroll",
              gap: 1.5,
            }}
          >
            <Stack
              sx={{
                width: "100%",
                gap: 1.5,
                my: 3,
              }}
            >
              {cartItems.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="images/empty_cart_1.svg"
                    alt="empty shopping cart"
                    style={{
                      padding: 6,
                      width: 150,
                    }}
                  />
                </Box>
              ) : (
                <>
                  {cartItems?.map((item) => (
                    <>
                      <Card
                        key={item.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          height: "100%",
                          width: "100%",
                          padding: 1,
                        }}
                      >
                        <CardHeader
                          sx={{ padding: 0, mt: 1 }}
                          avatar={
                            <IconButton
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{
                                width: "30px",
                                height: "30px",
                              }}
                            >
                              <CloseOutlined />
                            </IconButton>
                          }
                        />
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
                                width: { xs: 60, sm: 60, lg: 60, xl: 100 },
                                height: { xs: 60, sm: 60, lg: 60, xl: 100 },
                                borderRadius: "50%",
                              }}
                              alt={item.menus?.titre}
                              image={`${API_URL}${item.menus?.image?.url}`}
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
                                  fontSize: "14px",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.menus?.titre}
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    marginLeft: 10,
                                  }}
                                >
                                  x{item?.quantity}
                                </span>
                              </Typography>
                              <Box>
                                {item?.menus?.ingredients?.flatMap((item) => (
                                  <Typography>
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
                                {calculateSubtotal(item)}
                              </Typography>
                            </CardContent>
                            <CardActions
                              sx={{
                                display: "flex",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <Add />
                                </Button>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item?.quantity}
                                </Typography>
                                {item.quantity > 1 && (
                                  <Button
                                    variant="contained"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity === 1
                                          ? 1
                                          : item.quantity - 1
                                      )
                                    }
                                  >
                                    <Remove />
                                  </Button>
                                )}
                              </Box>
                            </CardActions>
                          </Box>
                        </Stack>
                      </Card>
                    </>
                  ))}
                </>
              )}
            </Stack>
          </Box>
          <Divider />
          <Stack direction="row" justifyContent="space-between" px={2} my={2}>
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
              {calculateTotal()}
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            my: 3,
          }}
        >
          <Button variant="contained" type="submit">
            Confirmer
          </Button>
          <Button variant="outlined" onClick={handleClearCart}>
            Annuler
          </Button>
        </Box>
      </form>
    </Create>
  );
};
