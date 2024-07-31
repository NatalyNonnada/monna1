import { Box, Button, CardContent, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import { styleCard } from '../styleCard';
import { useForm } from 'react-hook-form';
import { validations } from '../../../utils';
import { useEffect } from 'react';

interface Props {
    open: boolean;
    total: number;
    handleClose: () => void;
    addDescuento: (descu: number) => void;
}

interface Idescuen {
    desc: number;
}


export const DescuentoM = ({ open, total, handleClose, addDescuento }: Props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Idescuen>({ defaultValues: { desc: 0 } });

    const handleRegister = (data: Idescuen) => {
        addDescuento(data.desc);
        reset({ desc: 0 });
        handleClose();
    }

    useEffect(() => {
        reset({ desc: 0 });
    }, [reset])


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <CardContent>
                <Box
                    sx={{ ...styleCard, width: 300 }}
                >
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <TextField
                            label='Descuento'
                            fullWidth
                            variant='outlined'
                            {...register('desc', {
                                required: 'Este campo es requido',
                                validate: (val) => validations.isPrice(`${val}`),
                                min: { value: 1, message: 'Tine que ser mayor que cero' },
                                max: { value: total, message: 'No puede ser mayor que el total' }
                            })}
                            error={!!errors.desc}
                            helperText={errors.desc?.message}
                        />

                        <Typography component='div' style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
                            <Button type='submit' fullWidth variant='outlined' color='warning'>Agregar</Button>
                        </Typography>
                    </form>
                </Box>

            </CardContent>
        </Modal >
    )
}
