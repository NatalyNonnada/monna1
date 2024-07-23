import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { validations } from '../../utils';
import { AuthLayout } from '../../components/layout/AuthLayout';

type FormData = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const [isPosting, setIsPosting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onLoginUser = async ({ email, password }: FormData) => {
        setIsPosting(true);
        await signIn('credentials', { email, password });
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center' }} variant='h1' component="h1">Iniciar Sesión</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail

                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isPassword,
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <span style={{ display: isPosting ? 'inline-flex' : 'none', marginTop: '5px' }} className="loader"></span>
                            <Button
                                type="submit"
                                color="secondary"
                                style={{ display: isPosting ? 'none' : 'inline-flex' }}
                                className='circular-btn'
                                size='large'
                                fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    const { p = '/nonna' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: {}
    }
}

export default LoginPage