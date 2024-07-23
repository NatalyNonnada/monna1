import { FC, useEffect, useState } from 'react';
import { Card, CardContent, Grid, Link, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { CardContacto } from './CardContacto';

interface BackgroundImageComponentProps {
    imageUrl: string;
}

export const BannerHome: FC<BackgroundImageComponentProps> = ({ imageUrl }) => {

    const [open, setOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl
        img.onload = () => setIsLoaded(true);
    }, [imageUrl]);

    return (
        <>
            <Grid container spacing={1} justifyItems='center' >
                <Grid item xs={12} sm={12} md={12} lg={12}
                    style={{
                        display: isLoaded ? 'block' : 'none',
                        backgroundImage: `url(${imageUrl})`,
                        animation: 'fadeIn',
                        animationDuration: '1s'
                    }}
                    className='svg-container' >
                </Grid>
                {/* <Grid item sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }} md={4} lg={4}>
                    <Card>
                        <CardContent>
                            <div className='info-card'>
                                <Link href="http://wa.me/51993759147?" target='_blank'>
                                    <div>
                                        <PlaceIcon style={{ fontSize: '20px' }} />
                                        <Typography className='info-card-text'>Jirón Dos de Mayo 217, Cajamarca, Peru</Typography>
                                    </div>
                                </Link>
                                <div>
                                    <PhoneIcon style={{ fontSize: '20px' }} />
                                    <Typography className='info-card-text'>993 759 147</Typography>
                                </div>
                                <Link href="http://wa.me/51993759147?" target='_blank'>
                                    <div>
                                        <WhatsAppIcon style={{ fontSize: '20px' }} />
                                        <Typography className='info-card-text'>Contáctanos por Whatsapp!</Typography>
                                    </div>
                                </Link>
                                <div onClick={() => setOpen(true)}>
                                    <QueryBuilderIcon style={{ fontSize: '20px' }} />
                                    <Typography className='info-card-text'>Ver horario</Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
            {/* <Grid item sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }} xs={12} sm={12}>
                <div className='panel-Selector' onClick={() => setOpen(true)}>
                    <p className='epvaFE'>Contacto y ubicación</p>
                </div>
            </Grid> */}
            {/* <CardContacto open={open} handleClose={handleClose} /> */}
        </>

    )
}
