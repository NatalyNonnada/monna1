import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Card, FormControl, TextField, Typography } from '@mui/material';
import { IHour, IShoppingAddress } from '../../interface';
import { validations } from '../../utils';
import { LoadingCircular } from '../ui';

const formdata: IShoppingAddress = {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    email: Cookies.get('email') || '',
    phone: Cookies.get('phone') || ''
}

interface Props {
    updateAddress: (address: IShoppingAddress) => void,
    date: string;
    hour?: IHour;
}

export const Address = ({ updateAddress, date, hour }: Props) => {

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<IShoppingAddress>({ defaultValues: { ...formdata } });

    const { push } = useRouter();

    useEffect(() => {
        reset({ ...formdata });
    }, []);

    const handleRegister = (form: IShoppingAddress) => {
        if (date !== '' && hour?.hour !== '') {
            setLoading(true)
            updateAddress({ ...form, email: '-' });
            push('/checkout');
        }
        return;
    }

    return (
        <>
            <LoadingCircular loading={loading} />
            <Card className='card-form' style={{ animation: 'fadeIn', animationDuration: '1s', padding: '10px' }}>
                <form className='gqJTdB' onSubmit={handleSubmit(handleRegister)} noValidate>
                    <div className="dIevbP">
                        <br />
                        <Typography>Te notificaremos sobre tu cita al celular que escribas aquí</Typography>
                        <br />
                        <div className='cLkOZc' style={{ padding: '10px' }} >
                            <div className='cGnOjO'>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Nombre"
                                        variant='outlined'
                                        {...register('firstName', {
                                            required: 'Este campo es requido',
                                            validate: validations.isTitle,
                                            minLength: { value: 3, message: 'Nombre no valido' },
                                            max: { value: 30, message: 'Nombre no valido' }
                                        })}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                </FormControl>
                            </div>
                            <div className='cGnOjO'>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Apellido"
                                        variant='outlined'
                                        {...register('lastName', {
                                            required: 'Este campo es requido',
                                            validate: validations.islas,
                                            minLength: { value: 3, message: 'Apellido no valido' },
                                            maxLength: { value: 40, message: 'Apellido no valido' },
                                        })}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                </FormControl>
                            </div>
                            <div className='cGnOjO'>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Celular"
                                        variant='outlined'
                                        {...register('phone', {
                                            required: 'Este campo es requido',
                                            validate: validations.isPhone,
                                        })}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <button id='sumitarr' style={{ display: 'none' }} type='submit'>d</button>
                </form>
            </Card>
        </>
    )
}
