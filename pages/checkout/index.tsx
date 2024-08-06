import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { AndLayout } from "../../components/layout/AndLayout";
import { Box, Card, Container, Typography, CardActions, Divider } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Swal from 'sweetalert2';
import { validations } from '../../utils';
import { LoadingCircular } from '../../components';
import { CartContext } from '../../context';

const CheckoutPage: NextPage = () => {

    const { total, date, hour, cart, selectedDate, shippingAddress, createOrder } = useContext(CartContext);
    const [loading, setLoading] = useState(false);
    const { replace } = useRouter();

    useEffect(() => {
        if (validations.ValidAddress(shippingAddress)) {
            replace('/');
        } else if (validations.ValidOrder({ date, selectedDate: new Date(selectedDate), total, Servicio: cart?._id?.toString() })) {
            replace('/');
        } else if (validations.ValidHour(hour)) {
            replace('/');
        } else {
            setLoading(true)
        }
    }, [])

    const handleRegister = () => {
        Swal.fire({
            title: "!Atención!",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            width: 1000,
            html: `
            <p class="alert-title">Para poder agendarte deberás abonar  <strong>S/20.00 NO REEMBOLSABLE</strong> a través de cualquiera de estos medios:</p>
            <p class="alert-title"> <strong>YAPE ó PLIN al 📲993 759 147 </strong></p>
            <p class="alert-title">Transferencia bancaria BCP ahorros <strong>245-91016425-0-08</strong></p>
            <p class="alert-title">Todo a nombre de: <strong>NATALY ARACELLI CERQUIN PEÑA</strong></p>
            <p class="alert-title"><strong>Enviar pantallazo del abono al whatsapp</strong></p>
            `,
            confirmButtonText: "Confirmar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(false)
                const { hasError, message } = await createOrder();
                if (!hasError) {
                    Swal.fire({
                        title: "Registrado!",
                        text: "Orden registrado",
                        icon: "success"
                    });
                    replace(`/my-orden/${message}`);
                } else {
                    setLoading(true)
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `No pudimos procesar tu orden. Intentalo más tarde`,
                    });
                }
            }
        });
    }

    return (
        <AndLayout title={"Monna | Confirmar cita"} pageDescription={"Agenda aquí tu próxima cita con Monna Beauty Studio, especialistas en Acrilicas esculpidas y extensiones de pestañas"}>
            <Container className='containerche'>
                <LoadingCircular loading={!loading} />
                <br />
                {
                    loading && (
                        <Card sx={{ padding: 2, width: '100%' }} className='respo-card-info'>
                            <Typography className='title-cita' textAlign='center'>Resumen de la orden</Typography>
                            <br />
                            <Card className='card-servicio' >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mb: 1 }} className='rfsFFFCOCard' variant='subtitle2'>{cart?.title}</Typography>
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
                                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{hour?.hour}</Typography>
                                    </div>
                                </Box>
                            </Card>
                            <Divider sx={{ my: 1 }} />
                            <Card className='card-servicio' >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.phone}</Typography>
                                </Box>
                            </Card>
                            <Divider sx={{ my: 1 }} />
                            <br />
                            <CardActions className='checkout' style={{ justifyContent: 'center', animation: 'fadeIn', animationDuration: '1s' }}>
                                <button onClick={handleRegister} className='fSJGrc'>Confirmar orden</button>
                            </CardActions>
                        </Card>
                    )
                }
            </Container>
        </AndLayout>
    )
}

export default CheckoutPage;