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
import jsPDF, { TilingPattern } from 'jspdf';
import { Add } from '@mui/icons-material';
import { ModalAdicional } from '../servicios';
import { TableSale } from './TableSale';
import { DescuentoM } from './DescuentoM';

interface Props { reserva: IReserva; }


interface Itemsb {
    servicio: string;
    quanty: string;
    price: string;
    subttota: string;
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
    careserva: number;
    quanty: number;
}

const splitTextToFit = (pdf: jsPDF, text: string, maxWidth: number): string[] => {
    const lines: string[] = [];
    const words = text.split(' ');
    let line = '';

    words.forEach((word) => {
        const testLine = line + (line ? ' ' : '') + word;
        const { w: width } = pdf.getTextDimensions(testLine);

        if (width > maxWidth) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    });

    lines.push(line);
    return lines;
};


const calculateContentHeight = (pdf: jsPDF, ventas: Items[]): number => {
    let height = 0;
    const lineHeight = 10;
    height += 25;
    ventas.forEach((da) => {
        const lines = splitTextToFit(pdf, da.servicio, 70);
        height += lines.length * lineHeight;
        height += lineHeight;
    });

    height += 20;

    return height;
};

function eliminarTildes(texto: string) {
    return texto.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

const formatVenta = (data: Items): Itemsb => ({
    servicio: eliminarTildes(data.servicio).toUpperCase(),
    quanty: `${data.quanty}`,
    price: `${priceBodyTemplate({ price: `${data.total}` })}`.replace(/\s+/g, ''),
    subttota: `${priceBodyTemplate({ price: `${data.total * data.quanty}` })}`.replace(/\s+/g, ''),
});


export const DetailReserva = ({ reserva }: Props) => {

    const { _id, colaborador, shoppingAddress, servicio, hora, fecha, total, careserva, nureserva, iniPago, isPaid, cafinal, finPago, nufinal } = { ...reserva }
    const { hour } = { ...hora }
    const { fullnames, _id: cola } = { ...colaborador as IColaborador }
    const { phone, lastName, firstName } = { ...shoppingAddress }

    const [adicional, setAdicionales] = useState<Iservicio[]>([]);
    const [listItem, setListItem] = useState<Items[]>([]);
    const [open, setOpen] = useState(false);
    const [openDes, setOpenDes] = useState(false);
    const { addSaleToCart, addAdicionales, addSaleLoaded, clearVenta, addDescuento, ventas, total: totalg, subTotalg, desc } = useContext(SaleContext);
    const { confiReserva, getAdicionales, lodingReserva } = useReserva();
    const { saveVenta } = useVenta();

    const handleConfi = async () => {

        await confiReserva({ id: reserva._id || '' });

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
            careserva: careserva,
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
            careserva: careserva
        })
    }

    useEffect(() => {
        addSaleLoaded({ id: reserva?._id || '', celular: `${phone}` })
    }, [reserva])


    const generatePDF = async () => {
        try {
            const element = document.getElementById('receipt-content');
            const fechacon = document.getElementById('fecha-content') as HTMLElement;
            const titleCell = document.getElementsByClassName('tablefon') as HTMLCollectionOf<HTMLElement>;

            fechacon.style.marginTop = "230px";
            for (var i = 0; i < titleCell.length; i++) {
                titleCell[i].classList.add('nueva-clase');
            }

            if (element) {
                const canvas = await html2canvas(element, { scale: 4 });
                const imgData = canvas.toDataURL('image/png');

                let pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [80, 80]
                });

                let contentHeight = calculateContentHeight(pdf, ventas);

                if (ventas.length <= 1) {
                    contentHeight += 10;
                }


                pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [80, contentHeight]
                });

                pdf.setFontSize(8);

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

                const logoUrl = '/logo-monna.png';
                const logoImg = new Image();
                logoImg.src = logoUrl;
                logoImg.onload = () => {
                    pdf.addImage(logoImg, 'PNG', 15, 10, 50, 15);
                    pdf.save('receipt.pdf');
                };
            }

            clearVenta();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };


    const handleFin = async () => {
        if (subTotalg > 0) {

            const newVentasb: Itemsb[] = ventas.map(formatVenta);

            const { hasError } = await saveVenta({
                servicios: ventas as Items[],
                idReserva: reserva._id || '',
                documen: 'NOTA DE VENTA',
                fecha: eliminarTildes(initFecha.mindataFor()).toUpperCase(),
                clienete: eliminarTildes(`${firstName} ${lastName}`).toUpperCase(),
                ventas: newVentasb,
                subttota: `${priceBodyTemplate({ price: `${subTotalg}` })}`.replace(/\s+/g, ''),
                descuento: `${priceBodyTemplate({ price: `${desc}` })}`.replace(/\s+/g, ''),
                total: `${priceBodyTemplate({ price: `${totalg}` })}`.replace(/\s+/g, ''),
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
                        careserva: 0,
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
                <Grid item xs={12} sm={12} md={12} lg={4}>
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
                                            <Button
                                                type='submit'
                                                onClick={handleConfi}
                                                size='large'
                                                variant='contained'
                                                color='success'>
                                                Confirmar
                                            </Button>
                                        </>
                                    )
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8}>
                    <Card>
                        <CardContent>
                            <IconButton onClick={() => setOpen(true)}>Agregar un adicional<Add /></IconButton>
                            <IconButton onClick={() => setOpenDes(true)}>Agregar descuento<Add /></IconButton>
                            <div id="receipt-content" style={{ margin: '0px auto' }}>
                                <div style={{ padding: '20px' }}>
                                    <p className='tablefon' id='fecha-content'><strong>NOTA DE VENTA</strong></p>
                                    <p className='tablefon'>Fecha: {initFecha.mindataFor()} </p>
                                    <p className='tablefon'>Cliente: {`${firstName} ${lastName}`}</p>
                                    <TableSale ventas={ventas} desc={desc} subTotalg={subTotalg} total={totalg} />
                                </div>
                            </div>
                            <br />
                            <Typography component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant='contained'
                                    color='success'
                                    onClick={handleFin}
                                    disabled={!ventas.some(a => a._id === _id)}
                                >
                                    Finalizar servicio
                                </Button>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <ModalAdicional open={open} adicional={listItem} handleClose={handleClose} addAdicional={addAdicional} />
            <DescuentoM open={openDes} total={totalg} handleClose={() => setOpenDes(false)} addDescuento={addDescuento} />
            <LoadingCircular loading={lodingReserva} />
        </>
    )
}
