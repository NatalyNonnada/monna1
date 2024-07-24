import { IHour } from '../../interface';
import { Card, CardContent, Grid, Typography } from '@mui/material';

interface Props {
    horas: IHour[];
    handleChangeDate: (da: IHour) => void;
}

export const GridHoras = ({ horas, handleChangeDate }: Props) => {
    return (
        <Grid container spacing={1} style={{ animation: 'fadeIn', animationDuration: '1s' }}>
            {
                horas?.map(da => (
                    <Grid key={da._id} item xs={12} sm={12} md={12} lg={12}>
                        <Card className='card-hora'>
                            <CardContent className='cardCont-hora'>
                                <Typography
                                    className='title-hora'
                                    onClick={() => handleChangeDate(da)}
                                >
                                    {da.hour}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    )
}
