import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Button, Container, Grid, Typography } from '@mui/material';
import { CategoryOutlined } from '@mui/icons-material';
import { CardServiceAd, ItemListNr, ItemListResp, LoadingCircular } from '../../../components';
import { listPages } from '../../../utils';
import { useServicio } from '../../../hooks';
import { Iservicio } from '../../../interface';

const ServiciosPage: NextPage = () => {

    const [categ, setCateg] = useState('Todos');
    const { listService, isLoaded, getServicios, setLoading, updateServicio } = useServicio();
    const [fillter, setFillter] = useState<Iservicio[]>([]);

    const handleOption = (op: string) => {
        setCateg(op);
    }

    useEffect(() => {
        getServicios();
    }, [])

    useEffect(() => {
        setFillter(listService);
    }, [listService])

    useEffect(() => {
        if (categ === 'Todos') {
            setFillter(listService)
            return;
        }
        const newData = listService.filter(da => da.category === categ);
        if (newData.length === 0) {
            setFillter([]);
            return;
        } else {
            setFillter(newData);
            return;
        }
    }, [categ]);

    return (
        <AdminLayout
            title={'Servicios'}
            subTitle='Mantenimiento de servicios'
            icon={<CategoryOutlined />}
        >
            <Container>
                <LoadingCircular loading={isLoaded} />
                <Link href='/nonna/servicios/registro'>
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{ mb: 1, mt: 2 }}
                    >
                        Registar nuevo servicio
                    </Button>
                </Link>
                <ItemListResp handleOption={handleOption} selectOpt={categ} categorias={listPages.categorias} />
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={3} lg={2} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                        <ItemListNr handleOption={handleOption} selectOpt={categ} categorias={listPages.categorias} />
                    </Grid>
                    <Grid container spacing={1} item xs={12} sm={12} md={9} lg={9}>

                        {
                            fillter.length > 0 ? (
                                <>
                                    {
                                        fillter.map(da => (
                                            <Grid key={da._id} item xs={12} sm={6} md={6}>
                                                <CardServiceAd data={da} setLoading={setLoading} updateServicio={updateServicio} />
                                            </Grid>
                                        ))
                                    }
                                </>
                            ) : (
                                <Grid style={{ animation: 'fadeIn', animationDuration: '1s' }} item xs={12} sm={12} md={12}>
                                    <br />
                                    <br />
                                    <br />
                                    <Typography variant='h2' textAlign='center'>No cuentas con servicios registrados</Typography>
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>

            </Container>
        </AdminLayout>
    )
}

export default ServiciosPage;