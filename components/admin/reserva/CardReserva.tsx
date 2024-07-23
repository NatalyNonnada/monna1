import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Card, CardActions, Divider, Typography } from '@mui/material';
import { IColaborador, IReserva } from '../../../interface';
import { priceBodyTemplate } from '@/utils';

interface Props {
    reserva: IReserva;
}

export const CardReserva = ({ reserva }: Props) => {

    const { servicio, total, hora, fecha, isConfi, shoppingAddress, colaborador, _id, isPaid } = { ...reserva }
    const { fullnames } = { ...colaborador as IColaborador }
    const { firstName, lastName, email, phone } = { ...shoppingAddress };

    return (
        <Card sx={{ padding: 2, width: '100%', animation: 'fadeIn', animationDuration: '1s' }} className='respo-card-info'>
            <Card className='card-servicio' style={{ background: isPaid ? '#FFB3C6' : '#F6E8E7' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography className='reser-title' >Servicio: <strong>{servicio}</strong></Typography>
                    <Typography className='reser-title' >Colaboradora: <strong>{fullnames}</strong></Typography>
                    <Typography className='reser-title'>Fecha: <strong>{fecha}</strong></Typography>
                    <Typography className='reser-title'>Hora: <strong>{hora.hour}</strong></Typography>
                    <Typography className='reser-title'>Precio: <strong>{priceBodyTemplate({ cambio: 'Soles', price: `${total}` })}</strong></Typography>
                    <Typography className='reser-title'>Estado: <strong>{isConfi ? 'Pagado' : 'Por paga'}</strong></Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography className='reser-title'><strong>{firstName} {lastName}</strong></Typography>
                    <Typography className='reser-title'><strong>{email}</strong></Typography>
                    <Typography className='reser-title'><strong>{phone}</strong></Typography>
                    <Divider sx={{ my: 1 }} />
                    <Link href={`/nonna/reservas/${_id}`}>
                        <Button style={{ width: '100%' }} color='primary'>Ver reserva</Button>
                    </Link>
                </Box>
            </Card>
        </Card>
    )
}
