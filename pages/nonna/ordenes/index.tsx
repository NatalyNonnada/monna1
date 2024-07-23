import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Container, Divider, Grid, IconButton } from '@mui/material';
import { useOrder } from '../../../hooks';
import { BusquedaIten, CardOrder, LoadingCircular } from '../../../components';
import { CreditCardOffOutlined, Refresh } from '@mui/icons-material';
import { IOrder } from '../../../interface';

const OrdenesPage: NextPage = () => {

    const { getOrdenes, isLoading, orders } = useOrder();
    const [fillOrder, setFillOrder] = useState<IOrder[]>([])
    const [recarg, setrecarg] = useState(false);
    const [sear, setSear] = useState('');

    useEffect(() => {
        if (recarg) {
            setrecarg(false);
            getOrdenes();
        }
    }, [recarg])

    useEffect(() => {
        getOrdenes()
    }, []);

    useEffect(() => {
        setFillOrder(orders)
    }, [orders]);

    useEffect(() => {
        if (sear !== '') {
            const bus = fillOrder.filter(p =>
                p.shippingAddress?.phone.includes(sear) ||
                `${p.shippingAddress?.firstName} ${p.shippingAddress?.lastName}`.toLowerCase().includes(sear.toLowerCase())
            )
            setFillOrder(bus)
        } else {
            setFillOrder(orders)
        }
    }, [sear])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSear(event.target.value);
    }

    return (
        <AdminLayout
            title={'Ordenes'}
            subTitle='ordenes por pagar o confirmar'
            icon={<CreditCardOffOutlined />}
        >
            <Container>
                <LoadingCircular loading={isLoading || recarg} />
                <BusquedaIten sear={sear} handleSearchChange={handleSearchChange}>
                    <IconButton onClick={() => setrecarg(true)}>
                        <Refresh style={{ color: 'red', fontSize: '30px' }} />
                    </IconButton>
                </BusquedaIten>

                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {
                        fillOrder.map(data => (
                            <Grid item xs={12} sm={6} md={6} lg={4} key={data._id}>
                                <CardOrder order={data} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </AdminLayout>
    )
}

export default OrdenesPage;