import { SyntheticEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AndLayout } from "../../components/layout/AndLayout";
import { Box, Container, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Address, CustomTabPanel, LoadingCircular, OrderSummary, SelectDate } from '../../components';
import { a11yProps } from '../../utils';
import { useCart, useServiciou } from '../../hooks';

const FechaHoraPage: NextPage = () => {

    const [value, setValue] = useState<number>(0);
    const { total, hour, date, cart, selectedDate, updateInfo, updateAddress, clearCard } = useCart();
    const { getColaHours, isLoaded, listaData } = useServiciou();

    const [loading, setLoading] = useState(true);

    const { replace } = useRouter();

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!cart) {
            clearCard();
            replace('/');
        } else {
            setLoading(false);
            if (date !== '') {
                getColaHours();
            }
        }
    }, [cart, date]);

    const handleChandate = () => setValue(1);

    return (
        <AndLayout title={"MONNA | Fecha y Hora"} pageDescription={"Agenda aquí tu próxima cita con Monna Beauty Studio, especialistas en Acrílicas esculpidas y extensiones de pestañas"}>
            <Container>
                <LoadingCircular loading={isLoaded || loading} />
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Typography className='title-cab'>Fecha y hora del servicio</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab label="Fecha y hora" className='respon-Tab' {...a11yProps(0)} />
                        <Tab label="Datos de contacto" className='respon-Tab'{...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Grid container spacing={2} className='respon-grid'>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            <SelectDate
                                total={total}
                                date={date}
                                hour={hour}
                                cart={cart}
                                selectedDate={selectedDate}
                                updateInfo={updateInfo}
                                handleChandate={handleChandate}
                                listaData={listaData}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <OrderSummary total={total} date={date} hour={hour} title={cart?.title || ''} />
                        </Grid>
                    </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Grid container spacing={2} >
                        <Grid item sm={12} md={8} lg={8}>
                            <Address date={date} hour={hour} updateAddress={updateAddress} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <OrderSummary total={total} date={date} hour={hour} tap={value} title={cart?.title || ''} />
                        </Grid>
                    </Grid>
                </CustomTabPanel>
            </Container>
        </AndLayout>
    )
}

export default FechaHoraPage;