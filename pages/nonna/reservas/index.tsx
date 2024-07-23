import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Container, Divider, Grid, IconButton } from '@mui/material';
import { BusquedaIten, CardReserva, LoadingCircular } from '../../../components';
import { CreditCardOutlined, Refresh } from '@mui/icons-material';
import { useReserva } from '../../../hooks';
import { IReserva } from '../../../interface';

const ReservasPage: NextPage = () => {

    const [recarg, setrecarg] = useState(false);
    const [fillReserva, setFillReserva] = useState<IReserva[]>([])
    const [reservas, setReservas] = useState<IReserva[]>([])
    const [sear, setSear] = useState('');

    const { getReservas } = useReserva()

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSear(event.target.value);
    }

    useEffect(() => {
        if (!recarg) {
            setrecarg(true);
            const obtResevas = async () => {
                const { hasError, listData } = await getReservas();
                if (!hasError) {
                    setReservas(listData)
                    return;
                }
            }
            obtResevas();
        }
    }, [recarg]);

    useEffect(() => {
        setFillReserva(reservas);
    }, [reservas]);

    useEffect(() => {
        if (sear !== '') {
            const bus = reservas.filter(p =>
                p.shoppingAddress?.phone.includes(sear) ||
                p.fecha.toLowerCase().includes(sear) ||
                p.hora.hour.toLowerCase().includes(sear) ||
                `${p.shoppingAddress?.firstName} ${p.shoppingAddress?.lastName}`.toLowerCase().includes(sear.toLowerCase())
            )
            setFillReserva(bus);
        } else {
            setFillReserva(reservas);
        }
    }, [sear])

    return (
        <AdminLayout
            title={'Reservas'}
            subTitle='lista de reservas'
            icon={<CreditCardOutlined />}
        >
            <Container>
                <LoadingCircular loading={!recarg} />
                <BusquedaIten sear={sear} handleSearchChange={handleSearchChange}>
                    <IconButton onClick={() => setrecarg(false)}>
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