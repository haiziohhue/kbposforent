import React, { useContext, useState } from "react";

import { BaseKey } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";

import { API_URL } from "../../constants";
import { ICartMenu, IMenu } from "../../interfaces";
import { CartContext } from "../../contexts/cart/CartProvider";
import { ColorModeContext } from "../../contexts/color-mode";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

type MenuCard = {
  menu: IMenu;
  selectedCards: IMenu[];
  onCardSelect: (selectedCards: IMenu[]) => void;
  // onAddToCart: (menu: IMenu) => void;
};
export const MenuCard: React.FC<MenuCard> = ({
  menu,
  selectedCards,
  onCardSelect,
}) => {
  const { titre, image, prix } = menu;
  const { dispatch } = useContext(CartContext);
  const { mode } = useContext(ColorModeContext);
  const handleCardClick = () => {
    if (isSelected) {
      // Remove the card from selectedCards
      const updatedSelectedCards = selectedCards.filter(
        (selectedMenu) => selectedMenu.id !== menu.id
      );
      onCardSelect(updatedSelectedCards);
    } else {
      // Add the card to selectedCards
      const updatedSelectedCards = [...selectedCards, menu];
      onCardSelect(updatedSelectedCards);
    }
  };
  const isSelected = selectedCards.some(
    (selectedMenu) => selectedMenu.id === menu.id
  );

  const handleAddToCart = () => {
    const newItem: ICartMenu = {
      id: menu.id,
      menus: menu,
      quantity: 1,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        height: "100%",
        backgroundColor: isSelected
          ? mode === "light"
            ? "rgba(211, 47, 47, 0.08)"
            : "rgba(239, 83, 80, 0.16)"
          : "default",
      }}
      onClick={handleCardClick}
    >
      <CardHeader sx={{ padding: 0, mt: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 60, sm: 84, lg: 108, xl: 144 },
            height: { xs: 60, sm: 84, lg: 108, xl: 144 },
            borderRadius: "50%",
          }}
          alt={titre}
          image={`${API_URL}${image?.url}`}
        />
      </Box>
      <CardContent
        sx={{
          paddingX: "36px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Divider />
        <Tooltip title={titre}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "18px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {titre}
          </Typography>
        </Tooltip>

        <Tooltip title={`${prix} DA`} placement="top">
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "24px",
              overflowWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >{`${prix} DA`}</Typography>
        </Tooltip>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          paddingX: "36px",
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
          {isSelected && (
            <Button
              variant="contained"
              onClick={handleAddToCart}
              endIcon={<AddShoppingCartIcon />}
            >
              Ajouter
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};
