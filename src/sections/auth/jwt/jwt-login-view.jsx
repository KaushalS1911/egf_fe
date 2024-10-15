import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Logo from 'src/components/logo';
import { useAuthContext } from '../../../auth/hooks';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 1 }}>
      <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Logo /></Typography>
    </Stack>
  );

  return (
    <>
      {renderHead}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <RHFTextField name='email' label='Email address' />
          <RHFTextField
            name='password'
            label='Password'
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={password.onToggle} edge='end'>
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack>
            <Link component={RouterLink} href={paths.auth.jwt.forgotPassword} variant='subtitle2'>
              Forgot Password?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            color='inherit'
            size='large'
            type='submit'
            variant='contained'
            loading={isSubmitting}
          >
            Login
          </LoadingButton>

          <Stack sx={{ textAlign: 'center', mt: '10px' }}>
            <Typography variant='body2'>Don't have an account?</Typography>
            <Link component={RouterLink} href={paths.auth.jwt.register} variant='subtitle2' sx={{ mt: '8px' }}>
              Create an account
            </Link>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
}
