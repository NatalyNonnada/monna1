import { NextPage } from 'next'
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Container, Divider, Grid } from '@mui/material';
import { SummaryTile } from '../../components';
import { AttachMoneyOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import BadgeIcon from '@mui/icons-material/Badge';
import { useDashboard } from '../../hooks';
import { useEffect, useState } from 'react';

type Data = {
    numberOfReservas: number;
    paidOrders: number; // isPad true
    numberOfService: number;
    numberOfColabor: number;
}

const data: Data = {
    numberOfReservas: 0,
    paidOrders: 0,
    numberOfService: 0,
    numberOfColabor: 0
}

const HomeNonaPage: NextPage = () => {

    const { getSummary } = useDashboard();
    const [summary, setSummary] = useState<Data>(data)

    const { push } = useRouter();

    const handleOpt = (dest: string) => {
        push(`/${dest}`)
    }

    useEffect(() => {

        const consultar = async () => {
            const data = await getSummary();
            setSummary({ ...data })
        }

        consultar();
    }, [])

    // const [refreshIn, setRefreshIn] = useState(30);

    // useEffect(() => {
    //   const interval = setInterval(()=>{
    //     console.log('Tick');
    //     setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30 );
    //   }, 1000 );

    //   return () => clearInterval(interval)
    // }, []);


    return (
        <AdminLayout
            title={'Dashboard'}
            subTitle='Estadisticas generales'
            icon={<DashboardOutlined />}
        >
            <Container>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    <SummaryTile
                        title={summary.numberOfReservas}
                        subTitle="Reservas"
                        icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
                        handleOpt={handleOpt}
                        dest='nonna/reservas'
                    />

                    <SummaryTile
                        title={summary.numberOfService}
                        subTitle="Servicios"
                        icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                        handleOpt={handleOpt}
                        dest='nonna/servicios'
                    />

                    <SummaryTile
                        title={summary.numberOfColabor}
                        subTitle="Colaboradores"
                        icon={<BadgeIcon color="error" sx={{ fontSize: 40 }} />}
                        handleOpt={handleOpt}
                        dest='nonna/colaboradores'
                    />

                    <SummaryTile
                        title={summary.paidOrders}
                        subTitle="Ordenes por confirmar"
                        dest='nonna/ordenes'
                        icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                        handleOpt={handleOpt}
                    />

                </Grid>
            </Container>
        </AdminLayout>
    )
}
export default HomeNonaPage;