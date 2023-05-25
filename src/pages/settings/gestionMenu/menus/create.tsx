// import { UseModalFormReturnType } from '@refinedev/react-hook-form';
// import React, { useState } from 'react';
// import { ICategory, IMenu } from '../../../../interfaces';
// import { HttpError } from '@refinedev/core';
// import {
//   Autocomplete,
//   Avatar,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   FormLabel,
//   Input,
//   InputAdornment,
//   OutlinedInput,
//   Radio,
//   RadioGroup,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { SaveButton, useAutocomplete } from '@refinedev/mui';
// import { Controller } from 'react-hook-form';
// import { API_URL, TOKEN_KEY } from '../../../../constants';
// import { getValueProps, mediaUploadMapper } from '@refinedev/strapi-v4';

// import axios from 'axios';

// export const CreateMenu: React.FC<
//   UseModalFormReturnType<IMenu, HttpError, IMenu>
// > = ({
//   saveButtonProps,
//   control,
//   setValue,
//   watch,
//   modal: { visible, close },
//   register,
//   refineCore: { onFinish },
//   handleSubmit,
//   formState: { errors },
// }) => {
//   const { autocompleteProps } = useAutocomplete<ICategory>({
//     resource: 'categories',
//   });
//   const [isUploadLoading, setIsUploadLoading] = useState(false);
//   const [imageURL, setImageURL] = useState('');
//   // Menu Image
//   const imageInput = watch('image');

//   const onChangeHandler = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const formData = new FormData();

//     const target = event.target;
//     const file: File = (target.files as FileList)[0];

//     formData.append('files', file);
//     console.log(file);
//     // const res = await axios.post<{ url: string }>(
//     //   `${API_URL}/upload`,
//     //   formData,
//     //   {
//     //     withCredentials: true,
//     //   }
//     // );
//     const res = await axios.post(`${API_URL}/upload`, formData, {
//       // headers: {
//       //   Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
//       // },
//     });
//     setImageURL(`${API_URL}${res.data[0].url}`);
//     setValue('image', res.data[0].id, { shouldValidate: true });
//     // const { name, size, type, lastModified } = file;

//     // eslint-disable-next-line
//     // const imagePaylod: any = [
//     //   {
//     //     name,
//     //     size,
//     //     type,
//     //     lastModified,
//     //     url: res.data.url,
//     //   },
//     // ];
//   };

//   return (
//     <Dialog
//       open={visible}
//       onClose={close}
//       PaperProps={{ sx: { minWidth: 500 } }}
//     >
//       <DialogTitle>
//         {' '}
//         {<Typography fontSize={24}>Ajouter Menu</Typography>}
//       </DialogTitle>
//       <DialogContent>
//         <Box
//           component="form"
//           autoComplete="off"
//           sx={{ display: 'flex', flexDirection: 'column' }}
//         >
//           <form onSubmit={handleSubmit(onFinish)}>
//             <FormControl sx={{ width: '100%' }}>
//               <FormLabel required>Image</FormLabel>
//               <Stack
//                 display="flex"
//                 alignItems="center"
//                 border="1px dashed  "
//                 borderColor="primary.main"
//                 borderRadius="5px"
//                 padding="10px"
//                 marginTop="5px"
//               >
//                 <label htmlFor="images-input">
//                   <Input
//                     id="images-input"
//                     type="file"
//                     sx={{
//                       display: 'none',
//                     }}
//                     onChange={onChangeHandler}
//                   />
//                   <input
//                     id="file"
//                     {...register('image', {
//                       required: 'This field is required',
//                     })}
//                     type="hidden"
//                   />

//                   <Avatar
//                     sx={{
//                       cursor: 'pointer',
//                       width: {
//                         xs: 100,
//                         md: 180,
//                       },
//                       height: {
//                         xs: 100,
//                         md: 180,
//                       },
//                     }}
//                     // src={imageInput && imageInput.url}
//                     alt="Menu Image"
//                   />
//                 </label>
//                 <Typography
//                   variant="body2"
//                   style={{
//                     fontWeight: 800,
//                     marginTop: '8px',
//                   }}
//                 >
//                   Ajouter une Image
//                 </Typography>
//                 <Typography style={{ fontSize: '12px' }}>
//                   must be 1080x1080 px
//                 </Typography>
//               </Stack>
//               {errors.image && (
//                 <FormHelperText error>{errors.image.message}</FormHelperText>
//               )}
//             </FormControl>
//             <Stack gap="10px" marginTop="10px">
//               <FormControl>
//                 <FormLabel required>Nom</FormLabel>
//                 <OutlinedInput
//                   id="titre"
//                   {...register('titre', {
//                     required: 'This field is required',
//                   })}
//                   style={{ height: '40px' }}
//                 />
//                 {errors.titre && (
//                   <FormHelperText error>{errors.titre.message}</FormHelperText>
//                 )}
//               </FormControl>
//               <FormControl>
//                 <FormLabel required>Description</FormLabel>
//                 <OutlinedInput
//                   id="description"
//                   {...register('description', {
//                     required: 'This field is required',
//                   })}
//                   multiline
//                   minRows={5}
//                   maxRows={5}
//                 />
//                 {errors.description && (
//                   <FormHelperText error>
//                     {errors.description.message}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//               <FormControl>
//                 <FormLabel required>Prix</FormLabel>
//                 <OutlinedInput
//                   id="prix"
//                   {...register('prix', {
//                     required: 'This field is required',
//                   })}
//                   type="number"
//                   style={{
//                     width: '150px',
//                     height: '40px',
//                   }}
//                   startAdornment={
//                     <InputAdornment position="start">$</InputAdornment>
//                   }
//                 />
//                 {errors.prix && (
//                   <FormHelperText error>{errors.prix.message}</FormHelperText>
//                 )}
//               </FormControl>
//               <FormControl>
//                 <Controller
//                   control={control}
//                   name="categorie"
//                   rules={{
//                     required: 'This field is required',
//                   }}
//                   render={({ field }) => (
//                     <Autocomplete
//                       disablePortal
//                       {...autocompleteProps}
//                       {...field}
//                       onChange={(_, value) => {
//                         field.onChange(value);
//                       }}
//                       getOptionLabel={(item) => {
//                         return item.nom ? item.nom : '';
//                       }}
//                       isOptionEqualToValue={(option, value) =>
//                         value === undefined ||
//                         option?.id?.toString() ===
//                           (value?.id ?? value)?.toString()
//                       }
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Category"
//                           variant="outlined"
//                           error={!!errors.categorie?.message}
//                           required
//                         />
//                       )}
//                     />
//                   )}
//                 />
//                 {errors.categorie && (
//                   <FormHelperText error>
//                     {errors.categorie.message}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//               <FormControl>
//                 <FormLabel sx={{ marginTop: '10px' }} required>
//                   Active
//                 </FormLabel>
//                 <Controller
//                   control={control}
//                   {...register('isActive')}
//                   defaultValue={false}
//                   render={({ field }) => (
//                     <RadioGroup
//                       id="isActive"
//                       {...field}
//                       onChange={(event) => {
//                         const value = event.target.value === 'true';

//                         setValue('isActive', value, {
//                           shouldValidate: true,
//                         });

//                         return value;
//                       }}
//                       row
//                     >
//                       <FormControlLabel
//                         value={true}
//                         control={<Radio />}
//                         label={'Enable'}
//                       />
//                       <FormControlLabel
//                         value={false}
//                         control={<Radio />}
//                         label={'Disable'}
//                       />
//                     </RadioGroup>
//                   )}
//                 />
//                 {errors.isActive && (
//                   <FormHelperText error>
//                     {errors.isActive.message}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//             </Stack>
//           </form>
//           {/* <TextField
//             id="nom"
//             {...register('nom', {
//               required: 'This field is required',
//             })}
//             error={!!errors.nom}
//             helperText={errors.nom?.message}
//             margin="normal"
//             fullWidth
//             label="Title"
//             name="nom"
//             InputProps={{
//               inputProps: {
//                 style: { textTransform: 'capitalize' },
//                 maxLength: 50,
//                 onChange: (event) => {
//                   const target = event.target as HTMLInputElement;
//                   target.value =
//                     target.value.charAt(0).toUpperCase() +
//                     target.value.slice(1);
//                 },
//               },
//             }}
//           /> */}
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <SaveButton {...saveButtonProps} />
//         <Button onClick={close}>Cancel</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

import { useState } from 'react';
import axios from 'axios';
import { Edit } from '@refinedev/mui';
import { Box, Input, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HttpError } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ICategory, IMenu } from '../../../../interfaces';
import { API_URL } from '../../../../constants';

export const CreateMenu: React.FC = () => {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [imageURL, setImageURL] = useState('');

  const {
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm<IMenu, HttpError, IMenu & { category: ICategory; cover: any }>();

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setIsUploadLoading(true);

      const formData = new FormData();

      const target = event.target;
      const file: File = (target.files as FileList)[0];

      formData.append('files', file);

      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        // },
      });

      setImageURL(`${API_URL}${res.data[0].url}`);
      setValue('cover', res.data[0].id, { shouldValidate: true });

      setIsUploadLoading(false);
    } catch (error) {
      setError('cover', { message: 'Upload failed. Please try again.' });
      setIsUploadLoading(false);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column' }}
        autoComplete="off"
      >
        <Stack
          direction="row"
          gap={4}
          flexWrap="wrap"
          sx={{ marginTop: '16px' }}
        >
          <label htmlFor="images-input">
            <Input
              id="images-input"
              type="file"
              sx={{ display: 'none' }}
              onChange={onChangeHandler}
            />
            <input
              id="file"
              {...register('cover', {
                required: 'This field is required',
              })}
              type="hidden"
            />
            <LoadingButton
              loading={isUploadLoading}
              loadingPosition="end"
              endIcon={<FileUploadIcon />}
              variant="contained"
              component="span"
            >
              Upload
            </LoadingButton>
            <br />
            {errors.cover && (
              <Typography variant="caption" color="#fa541c">
                {errors.cover?.message?.toString()}
              </Typography>
            )}
          </label>
          {imageURL && (
            <Box
              component="img"
              sx={{
                maxWidth: 250,
                maxHeight: 250,
              }}
              src={imageURL}
              alt="Post image"
            />
          )}
        </Stack>
      </Box>
    </Edit>
  );
};
