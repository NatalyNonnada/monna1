import { useState } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ContentWithToggle } from '../ui';
import { Iservicio } from '../../interface';
import { priceBodyTemplate } from '../../utils/actionsTable';
import { ServicioDetail } from './servicios';

interface Props {
    data: Iservicio;
    setLoading: (estado: boolean) => void;
    updateServicio: (form: Iservicio) => Promise<{
        hasError: boolean;
    }>
}

export const CardServiceAd = ({ data, setLoading, updateServicio }: Props) => {

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    return (
        <>
            <Card className='card-servicio-iten'>
                <CardContent >
                    <Typography sx={{ fontSize: '15px', fontWeight: '700', color: data ? 'black' : 'red' }} gutterBottom>
                        {data.title} - {data.category}
                    </Typography>
                    <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                        {priceBodyTemplate({ cambio: 'Soles', price: `${data.price}` })}
                    </Typography>
                    <ContentWithToggle content={JSON.parse(data.description)} initialLength={90} />
                </CardContent>
                <CardActions style={{ justifyContent: 'end' }}>
                    <Button onClick={() => setOpen(true)} className='fSJGrc'>Seleccionar servicio</Button>
                </CardActions>
            </Card>
            {open && (<ServicioDetail open={open} servicio={data} handleClose={handleClose} handleLoging={setLoading} updateServicio={updateServicio} />)}
        </>
    )
}
