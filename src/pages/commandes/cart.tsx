import React, { useContext } from 'react';
import { CartContext } from '../../contexts/cart/CartProvider';
import { ICartMenu } from '../../interfaces';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { API_URL } from '../../constants';

export const Cart: React.FC = () => {
  const { cartState, dispatch } = useContext(CartContext);
  const { cartItems } = cartState;

  const handleRemoveItem = (itemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity: newQuantity },
    });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  // Calculate the subtotal for each item
  const calculateSubtotal = (item: ICartMenu) => {
    return item.menus.prix * item.quantity;
  };

  // Calculate the total for all items in the cart
  const calculateTotal = () => {
    let total = 0;
    for (const item of cartItems) {
      total += calculateSubtotal(item);
    }
    return total;
  };
  return (
    <Stack>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p> // empty shopping cart svg
      ) : (
        <>
          {cartItems.map((item) => (
            <>
              <Card
                key={item.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  position: 'relative',
                  height: '100%',
                  width: '100%',
                }}
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
                    alt={item.menus.titre}
                    //   image={image?.url}
                    image={`${API_URL}${item.menus.image?.url}`}
                  />
                </Box>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flex: 1,
                  }}
                >
                  <Divider />

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '18px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.menus.titre}
                  </Typography>

                  {/* <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '24px',
                        overflowWrap: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                      }}
                    >{`${prix} DA`}</Typography> */}
                </CardContent>
                <CardActions
                  sx={{
                    display: 'flex',
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
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    {item.quantity > 1 && (
                      <Button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity === 1 ? 1 : item.quantity - 1
                          )
                        }
                      >
                        -
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
              <li key={item.id}>
                <span>{item.menus.titre}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Subtotal: {calculateSubtotal(item)}</span>
                <button onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
                {/* <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                /> */}
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
                {item.quantity > 1 && (
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        item.quantity === 1 ? 1 : item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>
                )}
              </li>
            </>
          ))}

          <p>Total: {calculateTotal()}</p>
          <button onClick={handleClearCart}>Clear Cart</button>
        </>
      )}
    </Stack>
  );
};
