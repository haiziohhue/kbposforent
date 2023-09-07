import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Controller } from "react-hook-form";
import { CartContext } from "../../contexts/cart/CartProvider";
import axios from "axios";

import { CloseOutlined } from "@mui/icons-material";
import { ICategory, IMenu } from "interfaces";
import { API_URL } from "../../constants";

export const CreateMenuCompose: React.FC<
  UseModalFormReturnType<IMenu, HttpError, IMenu>
> = ({
  saveButtonProps,

  modal: { visible, close },
}) => {
  const { dispatch } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
  const [responseData, setResponseData] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get(
        `${API_URL}/api/categories?populate=categorie_ingredients,categorie_ingredients.ingredients,categorie_ingredients.ingredients.ingredient`
      )
      .then((response) => {
        setResponseData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data from API", error);
      });
  }, []);

  console.log(responseData);

  //
  const getIngredientsForCategory = (
    categoriesData: any[],
    selectedCategory: string | null
  ) => {
    if (!selectedCategory) {
      return [];
    }

    const selectedCategoryData = categoriesData?.find(
      (category) => category?.attributes?.nom === selectedCategory
    );
    console.log(selectedCategoryData);

    if (!selectedCategoryData) {
      return [];
    }

    const ingredientsData =
      selectedCategoryData?.attributes?.categorie_ingredients?.data;
    console.log(ingredientsData);
    const ingredients = ingredientsData?.map((ingredient) => ({
      nom: ingredient?.attributes?.nom,
      ingredients: ingredient?.attributes?.ingredients?.map((item) => ({
        nom: item?.ingredient?.data?.attributes?.nom,
        prix: item?.prix,
      })),
    }));

    return ingredients;
  };
  //
  const categories = Array.from(
    new Set(
      responseData
        .map(
          (category: { attributes: { nom: string } }) =>
            category?.attributes?.nom
        )
        .filter(Boolean)
    )
  );

  //
  const ingredients = getIngredientsForCategory(responseData, selectedCategory);
  console.log(categories);
  console.log(ingredients);
  console.log(
    ingredients.map((item) => item?.ingredients.map((ing) => ing?.nom))
  );
  //

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    const flattenedIngredients = selectedIngredients.flat();

    for (const ingredient of flattenedIngredients) {
      if (ingredient && ingredient.prix !== undefined) {
        totalPrice += parseFloat(ingredient.prix) || 0;
      }
    }

    return totalPrice; // Format the total price with two decimal places
  };
  const totalPrice = calculateTotalPrice();
  console.log(selectedIngredients);
  //
  const handleAddToCart = () => {
    const newItem: any = {
      id: Math.random(),
      menus: {
        prix: totalPrice,
        ingredients: ingredients.flatMap((item) =>
          item?.ingredients.map((ing) => ({ nom: ing?.nom }))
        ),
        titre: `${selectedCategory} Personalisé`,
      },
      name: `${selectedCategory} Personalisé`,
      quantity: 1,
      prix: totalPrice,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    console.log(newItem);
  };
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        breadcrumb={<div style={{ display: "none" }} />}
        title={<Typography fontSize={24}>Ajouter Menu</Typography>}
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
        footerButtonProps={{
          sx: {
            display: "none",
          },
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <DialogContent>
          <Box
            component="form"
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <Autocomplete
                id="menuCategory"
                options={categories}
                onChange={(event, value) => setSelectedCategory(value as any)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a Category"
                    variant="outlined"
                  />
                )}
              />

              {selectedCategory && (
                <>
                  {ingredients?.map((categorieIngredient, index) => (
                    <div key={index}>
                      <h3>{categorieIngredient?.nom}</h3>
                      <Autocomplete
                        id={`ingredientAutocomplete-${index}`}
                        options={categorieIngredient?.ingredients || []}
                        getOptionLabel={(option) =>
                          `${option.nom} - ${option.prix} DA`
                        }
                        value={selectedIngredients[index] || []}
                        onChange={(_, value) => {
                          const updatedIngredients = [...selectedIngredients];
                          updatedIngredients[index] = value;
                          setSelectedIngredients(updatedIngredients);
                        }}
                        multiple
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose an Ingredient"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                  ))}
                </>
              )}
              <div>
                <h3>Total Price: {calculateTotalPrice()} DA</h3>
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            // endIcon={<AddShoppingCartIcon />}
          >
            Ajouter
          </Button>
          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
