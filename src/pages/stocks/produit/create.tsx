import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import React, { useEffect, useReducer, useState } from "react";

import { HttpError } from "@refinedev/core";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Create, SaveButton } from "@refinedev/mui";
import { CloseOutlined } from "@mui/icons-material";
import { ICategory, IIngredients } from "../../../interfaces";
import { API_URL } from "../../../constants";

type Ingredient = {
  nom: string;
  unite: string;
  note: string;
};
type State = {
  ingredient: Ingredient;
};

const initialState: State = {
  ingredient: {
    nom: "",
    unite: "",
    note: "",
  },
};
type Action =
  | { type: "SET_COUT"; payload: number }
  | { type: "SET_NOTE"; payload: string }
  | { type: "SET_UNITE"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "RESET" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        ingredient: { ...state.ingredient, nom: action.payload },
      };
    case "SET_UNITE":
      return {
        ...state,
        ingredient: { ...state.ingredient, unite: action.payload },
      };

    case "SET_NOTE":
      return {
        ...state,
        ingredient: { ...state.ingredient, note: action.payload },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};
export const CreateIngredient: React.FC<
  UseModalFormReturnType<IIngredients, HttpError, IIngredients>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  refineCore: { onFinish },
  handleSubmit,
  formState: { errors },
}) => {
  const [{ ingredient }, dispatch] = useReducer(reducer, initialState);

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { width: "100%", height: "800px" } }}
    >
      <Create
        saveButtonProps={saveButtonProps}
        title={<Typography fontSize={24}>Ajouter Ingredient</Typography>}
        breadcrumb={<div style={{ display: "none" }} />}
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
            <form onSubmit={handleSubmit(onFinish)}>
              <Stack gap="10px" marginTop="10px">
                <FormControl>
                  <FormLabel required>Nom d'Ingredient</FormLabel>
                  <OutlinedInput
                    id="Nom"
                    value={ingredient.nom}
                    {...register("nom", {
                      required: "This field is required",
                    })}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_NAME",
                        payload: e.target.value,
                      })
                    }
                  />
                  {errors.nom && (
                    <FormHelperText error>{errors.nom.message}</FormHelperText>
                  )}
                </FormControl>

                {/* Unitées de mesure */}
                <FormControl>
                  <FormLabel>Unité de mesure</FormLabel>
                  <OutlinedInput
                    value={ingredient.unite}
                    id="unite"
                    {...register("unite")}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_UNITE",
                        payload: e.target.value,
                      })
                    }
                  />
                  {errors.unite && (
                    <FormHelperText error>
                      {errors.unite.message}
                    </FormHelperText>
                  )}
                </FormControl>
                {/* Note */}
                <FormControl>
                  <FormLabel>Note</FormLabel>
                  <OutlinedInput
                    id="note"
                    value={ingredient.note}
                    {...register("note")}
                    multiline
                    minRows={5}
                    maxRows={5}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_NOTE",
                        payload: e.target.value,
                      })
                    }
                  />
                  {errors.note && (
                    <FormHelperText error>{errors.note.message}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <SaveButton
            {...saveButtonProps}
            // onClick={() => {
            //   onFinish(ingredient as any);
            //   dispatch({ type: "RESET" });
            // }}
          />

          {/* <Button onClick={close}>Annuler</Button> */}
        </DialogActions>
      </Create>
    </Dialog>
  );
};
