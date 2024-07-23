import { useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Button, Container, Divider, Grid } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import { useColabora } from '../../../hooks';
import { CardColaborador, LoadingCircular } from '../../../components';

const ColaboradoresPage: NextPage = () => {

    const { getColaboradores, listContrib, isLoaded } = useColabora();

    useEffect(() => {
        getColaboradores()
    }, []);

    return (
        <AdminLayout
            title={'Colaboradores'}
            subTitle='Mantenimiento de colaboradores'
            icon={<BadgeIcon />}
        >
            <Container>
                <LoadingCircular loading={isLoaded} />
                <Link href='/nonna/colaboradores/registro'>
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{ mb: 1, mt: 2 }}
                    >
                        Registar nuevo colaborador
                    </Button>
                </Link>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {
                        listContrib.map(data => (
                            <Grid item xs={12} sm={6} md={6} lg={4} key={data._id}>
                                <CardColaborador colaborador={data} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </AdminLayout>
    )
}

export default ColaboradoresPage;