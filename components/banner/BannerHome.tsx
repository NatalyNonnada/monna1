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
            </Grid>
        </>
    )
}
