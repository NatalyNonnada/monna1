import { FC } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

interface Props {
    title: string | number;
    dest?: string;
    subTitle: string;
    icon: JSX.Element;
    handleOpt: (dest: string) => void
}

export const SummaryTile: FC<Props> = ({ title, subTitle, icon, dest = 'nonna', handleOpt }) => {
    return (
        <Grid item xs={12} sm={6} md={3} >
            <Card
                sx={{ display: 'flex', cursor: 'pointer' }}
                onClick={() => handleOpt(dest)}
            >
                <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {icon}
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h3'>{title}</Typography>
                    <Typography variant='caption'>{subTitle}</Typography>
                </CardContent>
            </Card>

        </Grid>
    )
}
