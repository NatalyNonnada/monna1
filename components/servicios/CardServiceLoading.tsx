import { Card, CardContent, } from '@mui/material';
import { AnimationsLoad } from '../ui';

export const CardServiceLoading = () => {
    return (
        <Card className='card-servicio-iten'>
            <CardContent>
                <AnimationsLoad />
            </CardContent>
        </Card>
    )
}
