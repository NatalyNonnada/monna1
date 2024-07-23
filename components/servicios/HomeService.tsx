import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Divider, Grid, Typography } from '@mui/material';
import { listPages } from '../../utils';
import { CardService } from './CardService';
import { Iservicio } from '../../interface';
import { useCart, useServiciou } from '../../hooks';
import { LoadingCircular } from '../ui';
import { ItemListResp } from './ItemListResp';
import { ItemListNr } from './ItemListNr';
import { CardServiceLoading } from './CardServiceLoading';

export const HomeService = () => {

    const [selectCat, setSelectCat] = useState('Todos')
    const [fillter, setFillter] = useState<Iservicio[]>([]);
    const [loading, setLoading] = useState(false);
    const { addDetail } = useCart();
    const { listService, isLoaded, getServicios } = useServiciou();

    const router = useRouter();

    useEffect(() => {
        getServicios();
    }, []);

    const handleSelect = (sel: Iservicio) => {
        addDetail(sel);
        setLoading(true);
        router.push('/fecha');
    }

    const handleOption = (opt: string) => {
        setSelectCat(opt)
    }

    useEffect(() => {
        setFillter(listService);
    }, [listService])

    useEffect(() => {
        if (selectCat === 'Todos') {
            setFillter(listService)
            return;
        }
        const newData = listService.filter(da => da.category === selectCat);
        if (newData.length === 0) {
            setFillter([]);
            return;
        } else {
            setFillter(newData);
            return;
        }
    }, [selectCat]);

    return (
        <>
            <LoadingCircular loading={loading || isLoaded} />
            <Typography className='title-cab' sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}>Seleccionar servicios</Typography>
            <Divider sx={{ my: 1, display: { xs: 'flex', sm: 'flex', md: 'none' } }} />
            <ItemListResp handleOption={handleOption} selectOpt={selectCat} categorias={listPages.categorias} />
            <Divider sx={{ my: 1, display: { xs: 'flex', sm: 'flex', md: 'none' } }} />
            <Grid container >
                <Grid item xs={10} sm={10} md={12} lg={12}>
                    <div>
                        <Typography sx={{ my: 1, display: { xs: 'none', sm: 'none', md: 'flex' } }} className='title-cab'>Seleccionar servicios</Typography>
                        <Divider sx={{ my: 1, display: { xs: 'none', sm: 'none', md: 'flex' } }} />
                        <br />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                    <ItemListNr handleOption={handleOption} selectOpt={selectCat} categorias={listPages.categorias} />
                </Grid>
                <Grid container spacing={1} item xs={12} sm={12} md={9} lg={9} justifyContent='center'>
                    {
                        !isLoaded ? (
                            <>
                                {
                                    fillter.map(da => (
                                        <Grid key={da._id} item xs={12} sm={6} md={6}>
                                            <CardService data={da} handleSelect={handleSelect} />
                                        </Grid>
                                    ))
                                }
                            </>
                        ) : (
                            <>
                                {
                                    listService.length <= 0 && (
                                        <Grid container spacing={2} style={{ animation: 'fadeIn', animationDuration: '1s' }} item xs={12} sm={12} md={12}>
                                            <Grid item xs={12} sm={6} md={6}><CardServiceLoading /></Grid>
                                            <Grid item xs={12} sm={6} md={6}> <CardServiceLoading /></Grid>
                                        </Grid>
                                    )
                                }
                            </>

                        )
                    }
                </Grid>
            </Grid>
        </>
    )
}
