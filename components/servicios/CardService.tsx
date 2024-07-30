import { useRouter } from 'next/router';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { ContentWithToggle } from '../ui';
import { Iservicio } from '../../interface';
import { priceBodyTemplate } from '../../utils/actionsTable';
import { useCart } from '../../hooks';

interface Props {
    data: Iservicio;
    handleSelect: () => void
}

export const CardService = ({ data, handleSelect }: Props) => {

    const { addDetail } = useCart();

    const router = useRouter();

    const handleSelectService = () => {
        handleSelect();
        addDetail(data);
        setTimeout(() => {
            router.push('/fecha');
        }, 900);
    }

    return (
        <Card className='card-servicio-iten'>
            <CardContent>
                <Typography sx={{ fontSize: '15px', fontWeight: '700' }} color="text.secondary" gutterBottom>
                    {data.title}
                </Typography>
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                    {priceBodyTemplate({ cambio: 'Soles', price: `${data.price}` })}
                </Typography>
                <ContentWithToggle content={JSON.parse(data.description)} initialLength={90} />
            </CardContent>
            <CardActions style={{ justifyContent: 'end' }}>
                {
                    data.category !== 'Adicionales' && (
                        <button onClick={handleSelectService} className='fSJGrc'>Seleccionar servicio</button>
                    )
                }
            </CardActions>
        </Card>
    )
}
