import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import { IColaborador } from '../../interface';
import { ModalCardCola } from './ModalCardCola';
import { LoadingCircular } from '../ui';

interface Props {
    colaborador: IColaborador;
}

interface hors {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}

export const CardColaborador = ({ colaborador }: Props) => {

    const [open, setOpen] = useState(false);
    const [servicios, setServicios] = useState<hors[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        const fillser = colaborador.listHd.filter(p => p.servicio !== 'Bloqueado')
        setServicios(fillser);
    }, [colaborador])

    return (
        <Card className='card-servicio-iten'>
            <CardContent>
                <LoadingCircular loading={isLoading} />
                <Typography
                    sx={{
                        fontSize: '17px',
                        fontWeight: '700',
                        color: servicios.length > 0 ? 'red' : 'green'
                    }}
                    gutterBottom
                >
                    {colaborador.fullnames.toUpperCase()}
                </Typography>
                {
                    colaborador.date.length > 0 &&
                    (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <Typography onClick={handleOpen} sx={{ cursor: 'pointer', }}>Total de servicios pendientes: <strong>{servicios.length} </strong> </Typography>
                        </>
                    )
                }
                <Divider sx={{ my: 1 }} />
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>Colabora en:</Typography>
                {
                    colaborador.category.map(da => (
                        <div key={da} className='eguxKp'>
                            <Typography>{da}</Typography>
                        </div>
                    ))
                }
                <Divider sx={{ my: 1 }} />
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>Turno mañana</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {
                        colaborador.morshift.map(da => (
                            <div key={da.hour} className='eguxKp'>
                                <button
                                    style={{ fontSize: '17px', padding: '5px' }}
                                    className={`hRqpUZ ${da.estate ? 'selhrcolor' : ''} `}
                                >
                                    {da.hour}
                                </button>
                            </div>
                        ))
                    }
                </Box>

                <Divider sx={{ my: 1 }} />
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>Turno tarde</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {
                        colaborador.aftshift.map(da => (
                            <div key={da.hour} className='eguxKp'>
                                <button
                                    style={{ fontSize: '17px', padding: '5px' }}
                                    className={`hRqpUZ ${da.estate ? 'selhrcolor' : ''} `}
                                >
                                    {da.hour}
                                </button>
                            </div>
                        ))
                    }
                </Box>

            </CardContent>
            <ModalCardCola open={open} listHd={servicios} handleClose={handleClose} />
            <CardActions >
                {/* <button className='fSJGrc'>Ver colaborador</button> */}
                <Link onClick={() => setIsLoading(true)} href={`/nonna/colaboradores/${colaborador._id?.toString()}`}>
                    <button className='fSJGrc'>Ver colaborador</button>
                </Link>
            </CardActions>
        </Card>
    )
}
