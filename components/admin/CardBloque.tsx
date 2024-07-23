import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import Swal from 'sweetalert2';

interface hors {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}

interface nHoras {
    idh: string,
    id: string
}

interface Props {
    horas: hors[];
    id: string;
    handleDelete: (horas: nHoras) => Promise<{
        hasError: boolean;
    }>
    handleLoging: (value: boolean) => void;
}
export const CardBloque = ({ horas, id, handleDelete, handleLoging }: Props) => {

    const handleHora = async (idh: string) => {
        Swal.fire({
            title: "!Atención!",
            icon: "warning",
            text: 'No podras revertir esto',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si eliminalo"
        }).then(async (result) => {
            if (result.isConfirmed) {
                handleLoging(true)
                const { hasError } = await handleDelete({ id, idh })
                if (hasError) {
                    handleLoging(true)
                } else {
                    handleLoging(false)
                }
            }
        });
    }

    return (
        <Grid container spacing={1}>
            {
                horas.map(da => (
                    <Grid key={da._id} item xs={6} sm={4} md={6} lg={4}>
                        <Card onClick={() => handleHora(da._id || '')}>
                            <CardContent sx={{ cursor: 'pointer' }}>
                                <Typography>{da.fecha} - {da.hora}</Typography>
                                <Typography>Motivo: {da.servicio}</Typography>
                                <Divider sx={{ my: 1 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }

        </Grid>
    )
}
