import { Grid } from '@mui/material';
import { IHour } from '@/interface';

interface Props { horas: IHour[] }

export const GridHora = ({ horas }: Props) => {
    return (
        <Grid container spacing={1}>
            {
                horas.map(da => (
                    <Grid key={da._id} item xs={3} sm={2} md={3} lg={2}>
                        <div className='eguxKp'>
                            <button
                                style={{ fontSize: '17px', padding: '5px' }}
                                className={`hRqpUZ`}
                            >
                                {da.hour}
                            </button>
                        </div>
                    </Grid>
                ))
            }
        </Grid>
    )
}
