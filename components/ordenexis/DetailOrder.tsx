import { useEffect, useState } from 'react';
import { useServiciou } from '../../hooks';
import { IUserReserva } from '../../interface';
import { Badge, Card, CardContent, Divider, Grid, IconButton, Link, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { AnimationsLoad } from '../ui';

interface Props {
    codigo: string;
}

export const DetailOrder = ({ codigo }: Props) => {

    const { getOderExis } = useServiciou();
    const [ordenus, setOrdenus] = useState<IUserReserva>()

    useEffect(() => {
        if (codigo !== undefined) {
            const obtenerOr = async () => {
                const { data } = await getOderExis(codigo);
                setOrdenus(data)
            }
            obtenerOr();
        }
    }, [codigo])

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={11} sm={9} md={6} lg={6}>
                <Card>
                    <CardContent>
                        {
                            ordenus ? (
                                <>
                                    <Typography textAlign='center' className='title-cab'>Detalle de tu cita</Typography>
                                    <Divider sx={{ my: 1, color: 'red' }} />
                                    <p>Hora y fecha: <strong>{ordenus?.fecha} {ordenus?.hora}</strong></p>
                                    <p>Servicio: <strong>{ordenus?.servicio}</strong></p>
                                    <p>Estado: <strong>{ordenus?.estado ? 'Pagado' : 'Por pagar'}</strong></p>
                                    <Divider sx={{ my: 1 }} />
                                    <p>Nombre: <strong>{ordenus?.shoppingAddress.firstName} {ordenus?.shoppingAddress.lastName}</strong></p>
                                    <Divider sx={{ my: 1 }} />
                                    {
                                        !ordenus.estado && (
                                            <>
                                                <p style={{ textAlign: 'center' }}>Para poder agendarte deberás abonar  <strong>S/20.00 NO REEMBOLSABLE</strong> a través de cualquiera de estos medios:</p>
                                                <p style={{ textAlign: 'center' }}>
                                                    <strong>📲993 759 147 YAPE ó PLIN</strong>
                                                </p>
                                                <p style={{ textAlign: 'center' }}>🏷️Transferencia bancaria BCP ahorros <strong>245-91016425-0-08.</strong></p>
                                                <p style={{ textAlign: 'center' }}>Todo a nombre de: <strong>NATALY ARACELLI CERQUIN PEÑA</strong></p>
                                                <p style={{ textAlign: 'center' }}>
                                                    Enviar voucher o pantallazo
                                                    <Link href="http://wa.me/51993759147?" target='_blank'>
                                                        <IconButton>
                                                            <Badge>
                                                                <WhatsAppIcon color='success' />
                                                            </Badge>
                                                        </IconButton>
                                                    </Link>
                                                    gracias por tu comprensión y preferencia</p>
                                                <p style={{ textAlign: 'center' }}>♡Para no perder tu abono recuerda avisar con 24h antes para reprogramar y asistir a tiempo a tu cita</p>
                                                <p style={{ textAlign: 'center' }}>la tolerancia máxima sobre la hora es  <strong>10mim</strong></p>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <AnimationsLoad />
                            )
                        }

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
