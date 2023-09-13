import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { HttpError } from "@refinedev/core";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Create } from "@refinedev/mui";

import { CartContext } from "../../contexts/cart/CartProvider";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CloseOutlined } from "@mui/icons-material";
import { IMenu } from "interfaces";
import { API_URL } from "../../constants";

export const CreateMenuCompose: React.FC<
  UseModalFormReturnType<IMenu, HttpError, IMenu>
> = ({ saveButtonProps, modal: { visible, close } }) => {
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
        id: item?.ingredient?.data?.id,
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
    const flattenedIngredients = selectedIngredients.flat();
    const mergedIngredients = {};

    for (const ingredient of flattenedIngredients) {
      const { id, nom, prix } = ingredient;

      if (mergedIngredients[nom]) {
        mergedIngredients[nom].count += 1;
        mergedIngredients[nom].prix += prix;
      } else {
        mergedIngredients[nom] = { id, nom, count: 1, prix };
      }
    }

    const mergedIngredientsArray = Object.values(mergedIngredients);
    const newItem: any = {
      id: Math.random(),
      menus: {
        prix: totalPrice,
        ingredients: (mergedIngredientsArray || []).map((item) => ({
          id: (item as { id?: number }).id,
          nom: (item as { nom?: string }).nom || "",
          prix: (item as { prix?: number }).prix || 0,
          count: (item as { count?: number }).count,
        })),
        titre: `${selectedCategory} Personalisé`,
        image: {
          url: "/uploads/menu_Compose_cb43bf60d1.png",
        },
      },
      titre: `${selectedCategory} Personalisé`,
      quantity: 1,
      prix: totalPrice,
      image: "/uploads/menu_Compose_cb43bf60d1.png",

      component: "menus.menu-compose",
      categorie: selectedCategory,
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    close();
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
                    label="choisissez une catégorie"
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
                            label="Choisissez un ingrédient"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                  ))}
                </>
              )}
              <div>
                <h3>Totale: {calculateTotalPrice()} DA</h3>
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            endIcon={<AddShoppingCartIcon />}
          >
            Ajouter
          </Button>
          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
