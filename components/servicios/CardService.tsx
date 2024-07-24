import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { TextToggle } from '../ui';
import { Iservicio } from '../../interface';
import { priceBodyTemplate } from '../../utils/actionsTable';

interface Props {
    data: Iservicio;
    handleSelect: (sel: Iservicio) => void
}

export const CardService = ({ data, handleSelect }: Props) => {
    return (
        <Card className='card-servicio-iten'>
            <CardContent>
                <Typography sx={{ fontSize: '15px', fontWeight: '700' }} color="text.secondary" gutterBottom>
                    {data.title}
                </Typography>
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                    {priceBodyTemplate({ cambio: 'Soles', price: `${data.price}` })}
                </Typography>
                <TextToggle text={data.description} initialLength={60} />
            </CardContent>
            <CardActions style={{ justifyContent: 'end' }}>
                {
                    data.category !== 'Adicionales' && (
                        <button onClick={() => handleSelect(data)} className='fSJGrc'>Seleccionar servicio</button>
                    )
                }
            </CardActions>
        </Card>
    )
}
