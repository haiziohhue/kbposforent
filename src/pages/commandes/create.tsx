import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  List,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { HttpError, IResourceComponentsProps, useList } from '@refinedev/core';
import { Create, useAutocomplete } from '@refinedev/mui';
import React, { useContext, useEffect, useState } from 'react';
import { ICaisse, IOrder, ITable } from '../../interfaces';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { Cart } from './cart';
import { CartContext } from '../../contexts/cart/CartProvider';

export const CreateOrder: React.FC<IResourceComponentsProps> = () => {
  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IOrder, HttpError, IOrder>();

  //
  const { autocompleteProps } = useAutocomplete<ITable>({
    resource: 'tables',
  });

  //

  const { data: caisses, isLoading } = useList<ICaisse>({
    resource: 'caisses',
  });
  const [selctedCaisse, setSelectedCaisse] = useState<number>(1); // to change the default value based on the user
  const handleListItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    caisseId: number
  ) => {
    setSelectedCaisse(caisseId);
  };
  useEffect(() => {
    setValue('caisse', selctedCaisse);
  }, [selctedCaisse, setValue]);

  //

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={<div style={{ display: 'none' }} />}
      goBack={<div style={{ display: 'none' }} />}
      footerButtonProps={{
        sx: {
          display: 'none',
        },
      }}
      // wrapperProps={{ sx: { overflowY: 'scroll', height: '100vh' } }}
    >
      {/* <CaisseFilter /> */}
      <form onSubmit={handleSubmit(onFinish)}>
        <Stack gap="10px" marginTop="10px">
          {/* Caisse */}
          <Stack>
            <List
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {caisses?.data.map((caisse: ICaisse) => (
                <Button
                  key={caisse.id}
                  onClick={(
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => handleListItemClick(event, caisse?.id)}
                  variant={
                    selctedCaisse === caisse.id ? 'contained' : 'outlined'
                  }
                  sx={{
                    borderRadius: '30px',
                  }}
                  disabled={isLoading}
                >
                  <ListItemText primary={caisse.nom} />
                  <input
                    type="hidden"
                    {...register('caisse')}
                    value={caisse?.id}
                  />
                </Button>
              ))}
            </List>
          </Stack>
          {/* Table */}
          <FormControl>
            <Controller
              control={control}
              name="table"
              rules={{
                required: 'This field is required',
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
                    return item.nom ? item.nom : '';
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined ||
                    option?.id?.toString() === (value?.id ?? value)?.toString()
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
          {/* Type */}
          <FormControl fullWidth>
            <Controller
              control={control}
              name="type"
              rules={{
                required: 'This field is required',
              }}
              // defaultValue={'sur place'}
              render={({ field }) => (
                <Autocomplete
                  size="medium"
                  {...field}
                  onChange={(_, value) => {
                    field.onChange(value);
                  }}
                  options={['Sur Place', 'Emporté']}
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
        </Stack>
        <Cart />
        <button type="submit">Submit</button>
      </form>
    </Create>
  );
};
