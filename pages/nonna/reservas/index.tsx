import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Container, Divider, Grid, IconButton } from '@mui/material';
import { BusquedaIten, CardReserva, LoadingCircular } from '../../../components';
import { CreditCardOutlined, Refresh } from '@mui/icons-material';
import { useReserva } from '../../../hooks';
import { IReserva } from '../../../interface';

const ReservasPage: NextPage = () => {

    const [fillReserva, setFillReserva] = useState<IReserva[]>([])
    const [sear, setSear] = useState('');

    const { getReservas, setState, lsReservas, lodingReserva, chargeReserva } = useReserva()

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSear(event.target.value);
    }

    useEffect(() => {
        if (!chargeReserva) {
            const obtResevas = async () => {
                await getReservas();
            }
            obtResevas();
        }
    }, [chargeReserva]);

    useEffect(() => {
        setFillReserva(lsReservas);
    }, [lsReservas]);

    useEffect(() => {
        if (sear !== '') {
            const bus = lsReservas.filter(p =>
                p.shoppingAddress?.phone.includes(sear) ||
                p.fecha.toLowerCase().includes(sear) ||
                p.hora.hour.toLowerCase().includes(sear) ||
                `${p.shoppingAddress?.firstName} ${p.shoppingAddress?.lastName}`.toLowerCase().includes(sear.toLowerCase())
            )
            setFillReserva(bus);
        } else {
            setFillReserva(lsReservas);
        }
    }, [sear])

    return (
        <AdminLayout
            title={'Reservas'}
            subTitle='lista de reservas'
            icon={<CreditCardOutlined />}
        >
            <Container>
                <LoadingCircular loading={lodingReserva} />
                <BusquedaIten sear={sear} handleSearchChange={handleSearchChange}>
                    <IconButton onClick={() => setState(false, 'chargeReserva')}>
                        <Refresh style={{ color: 'red', fontSize: '30px' }} />
                    </IconButton>
                </BusquedaIten>

                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {
                        fillReserva.map(data => (
                            <Grid item xs={12} sm={6} md={6} lg={4} key={data._id}>
                                <CardReserva reserva={data} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </AdminLayout>
    )
}

export default ReservasPage;