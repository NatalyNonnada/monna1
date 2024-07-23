import { useState } from 'react';
import Link from 'next/link';
import { Box, Card, CardActions, Divider, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { IHour, IOrder, Iservicio, } from '../../interface';
import { LoadingCircular } from '../ui';

interface Props {
    order: IOrder;
}

export const CardOrder = ({ order }: Props) => {

    const { date, hour, _id, Servicio, total, shippingAddress } = { ...order };
    const { title } = Servicio as Iservicio;

    const [isLoading, setIsLoading] = useState(false)

    return (
        <Card sx={{ padding: 2, width: '100%', animation: 'fadeIn', animationDuration: '1s' }} className='respo-card-info'>
            <LoadingCircular loading={isLoading} />
            {/* <Typography className='rfsFFFCOCard' textAlign='center'>Resumen de la orden</Typography> */}
            <br />
            <Card className='card-servicio'>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ mb: 1 }} className='rfsFFFCOCard' variant='subtitle2'>{title}</Typography>
                    <div className='iQpGXx'>
                        <CreditCardIcon style={{ color: 'var(--color-princi)' }} />
                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>S/{total}</Typography>
                    </div>
                    {
                        date !== '' &&
                        (
                            <div className='iQpGXx'>
                                <CalendarMonthIcon style={{ color: 'var(--color-princi)' }} />
                                <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{date}</Typography>
                            </div>
                        )
                    }

                    <div className='iQpGXx'>
                        <QueryBuilderIcon style={{ color: 'var(--color-princi)' }} />
                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{hour as string}</Typography>
                    </div>
                </Box>
            </Card>
            <Divider sx={{ my: 1 }} />
            <Card className='card-servicio'>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.email} </Typography>
                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.phone}</Typography>
                </Box>
            </Card>
            <Divider sx={{ my: 1 }} />
            <br />
            <CardActions className='checkout' style={{ justifyContent: 'center', animation: 'fadeIn', animationDuration: '1s' }}>
                <Link onClick={() => setIsLoading(true)} href={`/nonna/ordenes/${_id?.toString()}`}>
                    <button className='fSJGrc'>Ver orden</button>
                </Link>
            </CardActions>
        </Card>
    )
}
