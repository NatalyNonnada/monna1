import { useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { IReserva } from '../../../interface';
import { initFecha, listPages, priceBodyTemplate, validations } from '../../../utils';
import { useReserva, useVenta } from '../../../hooks';
import { LoadingCircular } from '../../../components/ui';
import { useContext, useEffect, useState } from 'react';
import { SaleContext } from '../../../context';
import { IColaborador } from '../../../interface/IColaborador';
import { Receipt } from '../Receipt';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props { reserva: IReserva; }

interface datar {
    id: string;
    nufinal: number;
    cafinal: number;
    finPago: string;
}

const black: datar = {
    id: '',
    nufinal: 0,
    cafinal: 0,
    finPago: 'Yape'
}

interface Items {
    _id?: string;
    cola: string;
    hora: string;
    codigo: string;
    servicio: string;
    tipagou: string;
    nrpagou: Number;
    topagou: number;

    tipagod: string;
    nrpagod: Number;
    topagod: number;
}

export const DetailReserva = ({ reserva }: Props) => {

    const { _id, colaborador, shoppingAddress, servicio, hora, fecha, total, careserva, nureserva, iniPago, isPaid, cafinal, finPago, nufinal } = { ...reserva }
    const { hour } = { ...hora }
    const { fullnames, _id: cola } = { ...colaborador as IColaborador }
    const { phone, lastName, firstName } = { ...shoppingAddress }

    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<datar>({ defaultValues: { ...black } });
    const { addSaleToCart, addSaleLoaded, clearVenta, ventas, total: subTotal } = useContext(SaleContext);
    const { confiReserva } = useReserva();
    const { saveVenta } = useVenta();

    const handleConfi = async (data: datar) => {
        setLoading(true)
        const { hasError } = await confiReserva({ ...data, id: _id || '' });

        setLoading(hasError);

        addSaleToCart({
            _id: _id || '',
            colaboradora: fullnames,
            cola: cola || '',
            fecha: `${initFecha.mindataFor()}`,
            hora: hour,
            codigo: fecha,
            celular: `${phone}`,
            servicio: servicio,
            total: total,

            tipagou: iniPago,
            nrpagou: nureserva,
            topagou: careserva,

            tipagod: finPago,
            nrpagod: nufinal,
            topagod: cafinal,
        })

    }

    const handleConfir = () => {
        addSaleToCart({
            _id: _id || '',
            colaboradora: fullnames,
            cola: cola || '',
            fecha: `${initFecha.mindataFor()}`,
            hora: hour,
            codigo: fecha,
            celular: `${phone}`,
            servicio: servicio,
            total: total,

            tipagou: iniPago,
            nrpagou: nureserva,
            topagou: careserva,

            tipagod: finPago,
            nrpagod: nufinal,
            topagod: cafinal,
        })
    }

    useEffect(() => {
        addSaleLoaded({ id: reserva?._id || '', celular: `${phone}` })
    }, [reserva])

    const generatePDF = async () => {
        const element = document.getElementById('receipt-content');
        if (element) {
            const canvas = await html2canvas(element, { scale: 4 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 80]
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const logoUrl = '/logo-monna.png';
            const logoImg = new Image();
            logoImg.src = logoUrl;
            logoImg.onload = () => {
                pdf.addImage(logoImg, 'PNG', 27, 1, 50, 15);
                pdf.save('receipt.pdf');

            };
            clearVenta();
        }
    }

    const handleFin = async () => {
        setLoading(true);
        const { hasError } = await saveVenta({
            colaboradora: fullnames,
            fecha: initFecha.mindataFor(),
            celular: phone || '',
            total: subTotal,
            servicios: ventas as Items[]
        })

        if (hasError) {
            generatePDF();
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Card className='card-servicio-iten'>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>{fullnames}</Typography>
                                <Typography>{servicio} - {priceBodyTemplate({ price: `${total}` })}</Typography>
                                <Typography>{fecha} - {hour}</Typography>
                                <Typography>Reservado con: {priceBodyTemplate({ price: `${careserva}` })} - {iniPago}</Typography>
                                <Typography sx={{ display: iniPago === 'Efectivo' ? 'none' : 'flex' }}>N° operación: {nureserva}</Typography>

                                <Divider sx={{ my: 1 }} />
                                <Typography>{firstName} {lastName}</Typography>
                                <Typography>{phone}</Typography>

                                <Divider sx={{ my: 1 }} />
                                {
                                    isPaid ? (
                                        <>
                                            <Typography>Reserva cancelada:{priceBodyTemplate({ price: `${cafinal}` })} - {finPago}</Typography>
                                            <Typography sx={{ display: finPago === 'Efectivo' ? 'none' : 'flex' }}>N° operación: {nufinal}</Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Button onClick={handleConfir} color='primary'>Agregar al carrito</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Typography>Falta pagar: {priceBodyTemplate({ price: `${total - careserva}` })} - {iniPago}</Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <form onSubmit={handleSubmit(handleConfi)}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        variant='outlined'
                                                        label="Número de operación"
                                                        {...register('nufinal', {
                                                            required: 'Este campo es requido',
                                                            validate: (d) => validations.isPrice(`${d}`),
                                                        })}
                                                        error={!!errors.nufinal}
                                                        helperText={errors.nufinal?.message}
                                                    />
                                                </FormControl>
                                                <Divider sx={{ my: 1 }} />
                                                <FormControl fullWidth>
                                                    <TextField
                                                        variant='outlined'
                                                        label="Saldo"
                                                        {...register('cafinal', {
                                                            required: 'Este campo es requido',
                                                            validate: (d) => validations.isPrice(`${d}`),
                                                            min: { value: total - careserva, message: 'Tine que cancelar por completo' }
                                                        })}
                                                        error={!!errors.cafinal}
                                                        helperText={errors.cafinal?.message}
                                                    />
                                                </FormControl>
                                                <Divider sx={{ my: 1 }} />
                                                <FormControl fullWidth>
                                                    <InputLabel id="dormitorio-selects">Tipo de pago</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        {...register('finPago')}
                                                        defaultValue={`Yape`}
                                                        label="Tipo de pago"
                                                    >
                                                        <MenuItem value="">Tipo de pago</MenuItem>
                                                        {
                                                            listPages.pagos.map(est => (
                                                                <MenuItem key={est} value={est}>{est}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                                <Divider sx={{ my: 1 }} />
                                                <FormControl fullWidth>
                                                    <Button
                                                        type='submit'
                                                        size='large'
                                                        variant='contained'
                                                        color='success'>
                                                        Confirmar
                                                    </Button>
                                                </FormControl>
                                            </form>
                                        </>
                                    )
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Card>
                        <CardContent>
                            {/* <Receipt items={ventas} total={subTotal} date={initFecha.mindataFor()} customerName={`${firstName} ${lastName}`} /> */}

                            <div id="receipt-content" style={{ maxWidth: '600px', margin: '0px auto' }}>
                                <div style={{ padding: '20px' }}>
                                    <h1>MONNA</h1>
                                    <p>Fecha: {initFecha.mindataFor()}</p>
                                    <p>Nombre del Cliente: {`${firstName} ${lastName}`}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', padding: '8px 0' }}>
                                        <span style={{ fontWeight: 'bold' }}>Descripción</span>
                                        <span style={{ fontWeight: 'bold' }}>Precio</span>
                                    </div>
                                    {ventas.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '8px 0' }}>
                                            <span>{item.servicio}</span>
                                            <span>{priceBodyTemplate({ price: `${item.total}` })}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold' }}>
                                        <span>Total:</span>
                                        <span>{priceBodyTemplate({ price: `${subTotal}` })}</span>
                                    </div>
                                </div>
                            </div>
                            <Typography component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button variant='contained' color='success' onClick={handleFin}>Finalizar servicio</Button>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <LoadingCircular loading={loading} />
        </>
    )
}
