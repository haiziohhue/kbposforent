import React from 'react';
import axios from 'axios';

import InputMask from 'react-input-mask';
import {
  IResourceComponentsProps,
  useTranslate,
  useApiUrl,
  HttpError,
  useCustom,
} from '@refinedev/core';
import { Create, SaveButton, useAutocomplete } from '@refinedev/mui';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepButton from '@mui/material/StepButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Input from '@mui/material/Input';
import type { TextFieldProps } from '@mui/material/TextField';

import { useStepsForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { ICaisse, IRole, IUser } from '../../../interfaces';

export const CreateUser: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const stepTitles = [
    t('couriers.steps.content'),
    t('couriers.steps.relations'),
  ];
  const apiUrl = useApiUrl();

  const {
    refineCore: { onFinish, formLoading },
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IUser, HttpError, IUser>({
    stepsProps: {
      isBackValidate: false,
    },
    warnWhenUnsavedChanges: true,
  });

  const imageInput = watch('photo');

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formData = new FormData();

    const target = event.target;
    const file: File = (target.files as FileList)[0];

    formData.append('file', file);

    const res = await axios.post<{ url: string }>(
      `${apiUrl}/media/upload`,
      formData,
      {
        withCredentials: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    const { name, size, type, lastModified } = file;

    // eslint-disable-next-line
    const imagePaylod: any = [
      {
        name,
        size,
        type,
        lastModified,
        url: res.data.url,
      },
    ];
    setValue('photo', imagePaylod, {
      shouldDirty: true,
    });
  };

  //

  const { autocompleteProps: caissesAutocompleteProps } =
    useAutocomplete<ICaisse>({
      resource: 'caisses',
    });

  //   const { autocompleteProps: rolesAutocompleteProps } = useAutocomplete({
  //     resource: `users-permissions/roles`,
  //   });
  //   console.log(rolesAutocompleteProps);
  const { data } = useCustom<IRole>({
    url: `${apiUrl}/users-permissions/roles`,
    method: 'get',
  });
  const rolesAutocompleteProps = data?.data;

  console.log(data);
  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid
              container
              sx={{
                marginX: { xs: '0px' },
              }}
            >
              <Grid item xs={12} md={4}>
                <Stack gap={1} justifyContent="center" alignItems="center">
                  <label htmlFor="avatar-input">
                    <Input
                      id="avatar-input"
                      type="file"
                      sx={{
                        display: 'none',
                      }}
                      onChange={onChangeHandler}
                    />
                    <input id="file" {...register('photo')} type="hidden" />
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        width: {
                          xs: '120px',
                          md: '160px',
                          lg: '200px',
                        },
                        height: {
                          xs: '120px',
                          md: '160px',
                          lg: '200px',
                        },
                      }}
                      src={imageInput && imageInput[0].url}
                      alt="User Picture"
                    />
                  </label>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    {t('couriers.fields.images.description')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>
                    {t('couriers.fields.images.validation')}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container>
                  <Grid item paddingX={4} xs={12} md={6}>
                    <Stack gap="24px">
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            color: 'text.primary',
                          }}
                        >
                          {t('couriers.fields.name')}
                        </FormLabel>
                        <TextField
                          {...register('nom', {
                            required: t('errors.required.field', {
                              field: 'Name',
                            }),
                          })}
                          size="small"
                          margin="none"
                          variant="outlined"
                        />
                        {errors.nom && (
                          <FormHelperText error>
                            {errors.nom.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            color: 'text.primary',
                          }}
                        >
                          {t('couriers.fields.surname')}
                        </FormLabel>
                        <TextField
                          {...register('prenom', {
                            required: t('errors.required.field', {
                              field: 'prenom',
                            }),
                          })}
                          size="small"
                          margin="none"
                          variant="outlined"
                        />
                        {errors.prenom && (
                          <FormHelperText error>
                            {errors.prenom.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      {/* Role */}
                      <FormControl fullWidth>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            color: 'text.primary',
                          }}
                        >
                          {t('couriers.fields.gender.label')}
                        </FormLabel>
                        <Controller
                          control={control}
                          name="role"
                          rules={{
                            required: t('errors.required.field', {
                              field: 'Gender',
                            }),
                          }}
                          render={({ field }) => (
                            <Autocomplete
                              {...rolesAutocompleteProps}
                              size="small"
                              {...field}
                              onChange={(_, value) => {
                                field.onChange(value);
                              }}
                              options={['Male', 'Female']}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  error={!!errors.gender}
                                  required
                                />
                              )}
                            />
                          )}
                        />
                        {errors.gender && (
                          <FormHelperText error>
                            {errors.gender.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item paddingX={4} xs={12} md={6}>
                    <Stack gap="24px">
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            color: 'text.primary',
                          }}
                        >
                          {t('stores.fields.gsm')}
                        </FormLabel>
                        <InputMask
                          mask="(999) 999 99 99"
                          disabled={false}
                          {...register('phone', {
                            required: t('errors.required.field', {
                              field: 'Phone',
                            }),
                          })}
                        >
                          {(props: TextFieldProps) => (
                            <TextField
                              {...props}
                              size="small"
                              margin="none"
                              variant="outlined"
                            />
                          )}
                        </InputMask>
                        {errors.phone && (
                          <FormHelperText error>
                            {errors.phone.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          required
                          sx={{
                            marginBottom: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            color: 'text.primary',
                          }}
                        >
                          {t('couriers.fields.email')}
                        </FormLabel>
                        <TextField
                          {...register('email', {
                            required: t('errors.required.field', {
                              field: 'Email',
                            }),
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: t('errors.required.invalidMail'),
                            },
                          })}
                          size="small"
                          margin="none"
                          variant="outlined"
                        />
                        {errors.email && (
                          <FormHelperText error>
                            {errors.email.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid
                  item
                  paddingX={4}
                  paddingY={4}
                  xs={12}
                  md={12}
                  justifyContent="flex-end"
                >
                  <FormControl fullWidth>
                    <FormLabel
                      required
                      sx={{
                        marginBottom: '8px',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: 'text.primary',
                      }}
                    >
                      {t('stores.fields.address')}
                    </FormLabel>
                    <TextField
                      {...register('address', {
                        required: t('errors.required.field', {
                          field: 'Address',
                        }),
                      })}
                      margin="none"
                      variant="outlined"
                      multiline
                      minRows={5}
                      required
                      fullWidth
                    />
                    {errors.address && (
                      <FormHelperText error>
                        {errors.address.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid container item xs={12} md={12} gap={5}>
                <Grid item xs={8} md={6}>
                  <FormControl fullWidth>
                    <FormLabel
                      required
                      sx={{
                        marginBottom: '8px',
                        fontWeight: '700',
                        fontSize: '14px',
                        color: 'text.primary',
                      }}
                    >
                      {t('couriers.fields.store')}
                    </FormLabel>
                    <Controller
                      control={control}
                      name="caisse"
                      rules={{
                        required: 'Store required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          size="small"
                          {...caissesAutocompleteProps}
                          {...field}
                          onChange={(_, value) => {
                            field.onChange(value);
                          }}
                          getOptionLabel={(item) => {
                            return item.nom ? item.nom : '';
                          }}
                          isOptionEqualToValue={(option, value) =>
                            value === undefined ||
                            option?.id?.toString() ===
                              (value?.id ?? value)?.toString()
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              error={!!errors.caisse?.message}
                              required
                            />
                          )}
                        />
                      )}
                    />
                    {errors.caisse && (
                      <FormHelperText error>
                        {errors.caisse.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={4} md={5}>
                  abla
                </Grid>
              </Grid>
              <Grid item xs={4} md={6}>
                abla
              </Grid>
            </Grid>
          </>
        );
    }
  };

  return (
    <Create
      isLoading={formLoading}
      footerButtons={
        <>
          {currentStep > 0 && (
            <Button
              onClick={() => {
                gotoStep(currentStep - 1);
              }}
            >
              {t('buttons.previousStep')}
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && (
            <Button onClick={() => gotoStep(currentStep + 1)}>
              {t('buttons.nextStep')}
            </Button>
          )}
          {currentStep === stepTitles.length - 1 && (
            <SaveButton onClick={handleSubmit(onFinish)} />
          )}
        </>
      }
    >
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
        autoComplete="off"
      >
        <Stepper nonLinear activeStep={currentStep}>
          {stepTitles.map((label, index) => (
            <Step
              key={label}
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '18px',
                  lineHeight: '32px',
                },
              }}
            >
              <StepButton onClick={() => gotoStep(index)}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {renderFormByStep(currentStep)}
      </Box>
    </Create>
  );
};
