import React from 'react';
import { ICaisse } from '../../../../interfaces';
import { UseModalFormReturnType } from '@refinedev/react-hook-form';
import { HttpError } from '@refinedev/core';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { SaveButton } from '@refinedev/mui';

export const CreateCaisse: React.FC<
  UseModalFormReturnType<ICaisse, HttpError, ICaisse>
> = ({
  saveButtonProps,
  modal: { visible, close },
  register,
  formState: { errors },
}) => {
  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <DialogTitle>
        {' '}
        {<Typography fontSize={24}>Ajouter Caisse</Typography>}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField
            id="nom"
            {...register('nom', {
              required: 'This field is required',
            })}
            error={!!errors.nom}
            helperText={errors.nom?.message}
            margin="normal"
            fullWidth
            label="Title"
            name="nom"
            InputProps={{
              inputProps: {
                style: { textTransform: 'capitalize' },
                maxLength: 50,
                onChange: (event) => {
                  const target = event.target as HTMLInputElement;
                  target.value =
                    target.value.charAt(0).toUpperCase() +
                    target.value.slice(1);
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <SaveButton {...saveButtonProps} />
        <Button onClick={close}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
