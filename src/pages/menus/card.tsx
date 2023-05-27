import React, { useContext, useState } from 'react';

import { BaseKey } from '@refinedev/core';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit, MoreVert } from '@mui/icons-material';
import { API_URL } from '../../constants';
import { ICartMenu, IMenu } from '../../interfaces';
import { CartContext } from '../../contexts/cart/CartProvider';

type MenuCard = {
  menu: IMenu;
  selectedCards: IMenu[];
  onCardSelect: (selectedCards: IMenu[]) => void;
  onAddToCart: (menu: IMenu) => void;
};
export const MenuCard: React.FC<MenuCard> = ({
  menu,
  selectedCards,
  onCardSelect,
  onAddToCart,
}) => {
  const { titre, image, prix } = menu;
  const { dispatch } = useContext(CartContext);

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
  // const handleAddToCart = () => {
  //   onAddToCart(menu);
  // };
  const handleAddToCart = () => {
    const newItem: ICartMenu = {
      id: menu.id,
      // name: menu.titre || '',
      // price: menu.prix,
      menus: menu,
      quantity: 1,
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
    console.log(newItem);
  };
  console.log(selectedCards);
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '300px',
        backgroundColor: isSelected ? '#ffebee' : 'white',
      }}
      onClick={handleCardClick}
    >
      <CardHeader sx={{ padding: 0, mt: 2 }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: 60, sm: 84, lg: 108, xl: 144 },
            height: { xs: 60, sm: 84, lg: 108, xl: 144 },
            borderRadius: '50%',
          }}
          alt={titre}
          //   image={image?.url}
          image={`${API_URL}${image?.url}`}
        />
      </Box>
      <CardContent
        sx={{
          paddingX: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flex: 1,
        }}
      >
        <Divider />
        <Tooltip title={titre}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '18px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {titre}
          </Typography>
        </Tooltip>

        <Tooltip title={`${prix} DA`} placement="top">
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '24px',
              overflowWrap: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
            }}
          >{`${prix} DA`}</Typography>
        </Tooltip>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          paddingX: '36px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isSelected && (
            <Button variant="contained" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};
