import { Box, Card, CardActions, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { IHour } from '../../interface';

interface Props {
    total: number;
    date: string;
    hour?: IHour;
    tap?: number;
    title: string;
}

export const OrderSummary = ({ total, date, hour, title, tap = 0 }: Props) => {

    const handlerCheck = () => {
        let butt = document.getElementById("sumitarr");
        if (butt) {
            if (date !== '' && hour?.hour !== '') {
                butt.click();
                return;
            }
        }
    }

    return (
        <Card sx={{ padding: 2 }} className='respo-card-info'>
            <Typography className='title-cita' textAlign='center'>Información del servicio</Typography>
            <br />
            <Card className='card-servicio' >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography className='rfsFFFCOCard' variant='subtitle2'>{title}</Typography>
                    <div className='iQpGXx'>
                        <CreditCardIcon style={{ color: 'var(--color-princi)' }} />
                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>S/{total}</Typography>
                    </div>
                    {
                        date !== '' &&
                        (
                            <div className='iQpGXx'>
                                <CalendarMonthIcon style={{ color: 'var(--color-princi)' }} />
                                <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{date}</Typography>
                            </div>
                        )
                    }
                    {
                        hour && (
                            <div className='iQpGXx'>
                                {
                                    hour.hour !== '' && (
                                        <>
                                            <QueryBuilderIcon style={{ color: 'var(--color-princi)' }} />
                                            <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{hour?.hour}</Typography>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                </Box>
            </Card>
            <br />
            <CardActions
                className='checkout'
                style={{ justifyContent: 'center', display: tap > 0 ? 'flex' : 'none', animation: 'fadeIn', animationDuration: '1s' }}
            >
                <button
                    onClick={handlerCheck}
                    className={date === '' || hour?.hour === '' ? `fdfdbuttdis` : 'fSJGrc'}>
                    Siguiente
                </button>
            </CardActions>
        </Card>
    )
}
