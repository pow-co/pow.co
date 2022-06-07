import { useState, useRef } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import {
  Stack,
  Grid,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
// utils
import { fData } from '../../../../utils/formatNumber';
import { fTimestamp } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/Iconify';
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox,
  RHFEditor,
} from '../../../../components/hook-form';
//
import { FormValuesProps, FormSchema, defaultValues } from '.';

// ----------------------------------------------------------------------

export default function ReactHookForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<FormValuesProps>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const values = watch();

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickAttachPhoto = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(
      JSON.stringify(
        {
          ...data,
          photo: data.photo?.name,
          startDate: data.startDate && fTimestamp(data.startDate),
          endDate: data.endDate && fTimestamp(data.endDate),
        },
        null,
        2
      )
    );
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <RHFTextField name="fullName" label="Full Name" />
            <RHFTextField name="email" label="Email address" />
            <RHFTextField name="age" label="Age" />

            <Stack spacing={{ xs: 2, sm: 3 }} direction={{ xs: 'column', sm: 'row' }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Start date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="End date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Stack>

            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <RHFEditor name="editor" />

            <div>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={handleClickAttachPhoto}
                  startIcon={<Iconify icon={'eva:cloud-upload-fill'} />}
                >
                  Upload photo
                </Button>

                <div>
                  {values.photo?.name && (
                    <Typography variant="subtitle2">{values.photo.name}</Typography>
                  )}
                  {values.photo?.size && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {fData(values.photo.size)}
                    </Typography>
                  )}
                </div>

                <input
                  {...register('photo')}
                  ref={fileInputRef}
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setValue('photo', file);
                  }}
                  style={{ display: 'none' }}
                />
              </Stack>

              {errors.photo && (
                <FormHelperText sx={{ px: 2, display: 'block' }} error>
                  {errors.photo.message}
                </FormHelperText>
              )}
            </div>

            <div>
              <RHFCheckbox name="terms" label=" Terms and Conditions" />

              {errors.terms && (
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.terms.message}
                </FormHelperText>
              )}
            </div>

            <LoadingButton
              fullWidth
              color="info"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Submit
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
