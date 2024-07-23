import { NextPage } from 'next'
import { AndLayout } from "../../components/layout/AndLayout";
import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DetailOrder } from '../../components';

const MyOrdenPage: NextPage = () => {

    const router = useRouter();

    const [codigo, setCodigo] = useState<string | null>(null);

    useEffect(() => {
        if (router.asPath) {
            const pathParts = router.asPath.split('/');
            const lastPart = pathParts[pathParts.length - 1];
            setCodigo(lastPart);
        }
    }, [router.asPath]);

    return (
        <AndLayout title={"MONNA | Mi cita"} pageDescription={"Agenda aquí tu próxima cita con Monna Beauty Studio, especialistas en Acrilicas esculpidas y extensiones de pestañas"}>
            <Container>
                <br />
                {codigo !== null && codigo !== '[id]' && <DetailOrder codigo={codigo} />}
            </Container>
        </AndLayout>
    )
}

export default MyOrdenPage;