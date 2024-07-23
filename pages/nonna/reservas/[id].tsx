import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CreditCardOutlined } from '@mui/icons-material';
import { Container } from '@mui/material';
import { dbReserva } from '../../../database';
import { IReserva } from '../../../interface';
import { DetailReserva } from '../../../components';

interface Props { reserva: IReserva; }

const ReservaPage: NextPage<Props> = ({ reserva }) => {
    return (
        <AdminLayout
            title={'Reserva'}
            subTitle='detalle de la reserva'
            icon={<CreditCardOutlined />}
        >
            <Container>
                <DetailReserva reserva={reserva} />
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