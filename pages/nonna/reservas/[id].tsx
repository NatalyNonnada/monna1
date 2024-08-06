import React, { useContext, useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CreditCardOutlined } from '@mui/icons-material';
import { Container } from '@mui/material';
import { dbReserva } from '../../../database';
import { IReserva } from '../../../interface';
import { DetailReserva } from '../../../components';
import { SaleContext } from '../../../context';

interface Props { reserva: IReserva; }

const ReservaPage: NextPage<Props> = ({ reserva }) => {

    const { setReserva, viewReserva } = useContext(SaleContext);

    useEffect(() => {
        setReserva(reserva, 'ver');
    }, [reserva])

    return (
        <AdminLayout
            title={'Reserva'}
            subTitle='detalle de la reserva'
            icon={<CreditCardOutlined />}
        >
            <Container>
                {viewReserva.fecha !== '' && (<DetailReserva reserva={viewReserva} />)}
            </Container>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { id = '' } = query;

    const data = await dbReserva.getReservaById(id.toString());

    if (!data) {
        return {
            redirect: {
                destination: '/nonna/reservas',
                permanent: false,
            }
        }
    }

    return {
        props: {
            reserva: data
        }
    }
}


export default ReservaPage;