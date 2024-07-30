import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { IReserva, Iservicio } from '../../../interface';
import { initFecha, listPages, priceBodyTemplate, validations } from '../../../utils';
import { useReserva, useVenta } from '../../../hooks';
import { LoadingCircular } from '../../../components/ui';
import { SaleContext } from '../../../context';
import { IColaborador } from '../../../interface/IColaborador';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Add } from '@mui/icons-material';
import { ModalAdicional } from '../servicios';
import { TableSale } from './TableSale';

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
    fecha: string;
    hora: string;
    codigo: string;
    celular: string;
    servicio: string;
    total: number;
    quanty: number;
}

export const DetailReserva = ({ reserva }: Props) => {

    const { _id, colaborador, shoppingAddress, servicio, hora, fecha, total, careserva, nureserva, iniPago, isPaid, cafinal, finPago, nufinal } = { ...reserva }
    const { hour } = { ...hora }
    const { fullnames, _id: cola } = { ...colaborador as IColaborador }
    const { phone, lastName, firstName } = { ...shoppingAddress }

    const [loading, setLoading] = useState(false);
    const [adicional, setAdicionales] = useState<Iservicio[]>([]);
    const [listItem, setListItem] = useState<Items[]>([]);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<datar>({ defaultValues: { ...black } });
    const { addSaleToCart, addAdicionales, addSaleLoaded, clearVenta, ventas, total: subTotal } = useContext(SaleContext);
    const { confiReserva, getAdicionales } = useReserva();
    const { saveVenta } = useVenta();

    const handleConfi = async (data: datar) => {
        //add carrito y confirma
        setLoading(true)
        const { hasError } = await confiReserva({ ...data, id: _id || '' });

        setLoading(hasError);

        addSaleToCart({
            _id: _id || '',
            cola: cola || '',
            fecha: `${initFecha.mindataFor()}`,
            hora: hour,
            codigo: fecha,
            quanty: 1,
            celular: `${phone}`,
            servicio: servicio,
            total: total,
        })
    }

    const handleConfir = () => {
        addSaleToCart({
            _id: _id || '',
            cola: cola || '',
            fecha: `${initFecha.mindataFor()}`,
            hora: hour,
            codigo: fecha,
            quanty: 1,
            celular: `${phone}`,
            servicio: servicio,
            total: total,
        })
    }

    useEffect(() => {
        addSaleLoaded({ id: reserva?._id || '', celular: `${phone}` })
    }, [reserva])

    const generatePDF = async () => {
        const element = document.getElementById('receipt-content');
        const fechacon = document.getElementById('fecha-content') as HTMLElement;
        const titleCell = document.getElementsByClassName('tablefon') as HTMLCollectionOf<HTMLElement>;

        fechacon.style.marginTop = "250px";
        for (var i = 0; i < titleCell.length; i++) {
            titleCell[i].classList.add('nueva-clase');
        }

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
                pdf.addImage(logoImg, 'PNG', 15, 1, 50, 15);
                const pdfBlob = pdf.output('blob');
                const blobUrl = URL.createObjectURL(pdfBlob);
                const newWindow = window.open(blobUrl, '_blank');

                if (newWindow) {
                    newWindow.addEventListener('load', () => {
                        newWindow.print();
                    });
                }
            };
        }
        clearVenta();
    }

    const handleFin = async () => {

        if (subTotal > 0) {

            setLoading(true);

            const { hasError } = await saveVenta({
                servicios: ventas as Items[]
            })

            if (hasError) {
                generatePDF();
            }
        }
    }

    useEffect(() => {

        const cargarAdici = async () => {
            const { adicionales } = await getAdicionales();
            setAdicionales(adicionales);
        }
        cargarAdici();
    }, [])

    const handleClose = () => setOpen(false);

    const addAdicional = (ser: Items[]) => {
        setOpen(false);
        addAdicionales(ser);
    }

    useEffect(() => {

        if (adicional.length > 0) {
            adicional.map(item => {
                const existser = listItem.some(event => event._id === item._id);
                if (!existser) {
                    listItem.push({
                        _id: item._id,
                        cola: '-',
                        fecha: '-',
                        hora: '-',
                        codigo: '-',
                        celular: phone || '',
                        servicio: item.title,
                        total: item.price,
                        quanty: 1
                    });
                }
            });
        }
    }, [adicional]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4} lg={12}>
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
                <Grid item xs={12} sm={12} md={8} lg={12}>
                    <Card>
                        <CardContent>
                            <IconButton onClick={() => setOpen(true)}>Agregar un adicional<Add /></IconButton>
                            <div id="receipt-content" style={{ margin: '0px auto' }}>
                                <div style={{ padding: '20px' }}>
                                    <p className='tablefon' id='fecha-content'><strong>NOTA DE VENTA</strong></p>
                                    <p className='tablefon'>Fecha: {initFecha.mindataFor()} </p>
                                    <p className='tablefon'>Cliente: {`${firstName} ${lastName}`}</p>
                                    <TableSale ventas={ventas} subTotal={subTotal} />
                                </div>
                            </div>
                            <br />
                            <Typography component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    color='success'
                                    onClick={handleFin}
                                    disabled={!isPaid}
                                >
                                    Finalizar servicio
                                </Button>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <ModalAdicional open={open} adicional={listItem} handleClose={handleClose} addAdicional={addAdicional} />
            <LoadingCircular loading={loading} />
        </>
    )
}
