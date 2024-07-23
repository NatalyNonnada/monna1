import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { errorAlert } from '../../alerts';
import { isAfternoonTime, isMorningTime } from '../../utils';
import { Box, Button, Divider, FormControl, Modal, TextField, Typography } from '@mui/material';
import { styleCard } from './styleCard';

interface nHoras {
    idh: string,
    id: string
}

interface hors {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}

interface Props {
    open: boolean;
    listHd: hors[];
    tipo: string;
    id: string;
    handleClose: () => void;
    addHora: (horas: nHoras) => Promise<{
        hasError: boolean;
    }>
    handleLoging: (value: boolean) => void;
}

interface newHor { id: string, hora: string }
const formdata: newHor = { id: '', hora: '' }

export const ModalCardAddHour = ({ open, listHd, tipo, id, handleClose, addHora, handleLoging }: Props) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<newHor>({ defaultValues: { ...formdata } });

    useEffect(() => {
        reset({ ...formdata });
    }, [tipo])

    const handleRegister = async (data: newHor) => {

        handleClose();
        handleLoging(true)

        const exist = listHd.find(p => p.hora === `${data.hora} ${tipo === 'Tarde' ? 'pm' : 'am'}`);

        if (exist) {
            handleClose()
            errorAlert('Hora ya registrada')
        } else {
            const { hasError } = await addHora({ id, idh: `${data.hora} ${tipo === 'Tarde' ? 'pm' : 'am'}` });

            if (hasError) {
                handleClose();
                handleLoging(true)
            } else {
                handleClose();
                handleLoging(false)
            }
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <form onSubmit={handleSubmit(handleRegister)}>
                <Box sx={{ ...styleCard, width: 400, display: 'flex', flexDirection: 'column' }}>
                    <Typography>Nueva hora para el turno: {tipo} - H:MM</Typography>
                    <Divider sx={{ my: 1 }} />
                    {
                        tipo === 'Tarde' ?
                            (
                                <FormControl fullWidth>
                                    <TextField
                                        label={`${tipo}`}
                                        variant="outlined"
                                        {...register('hora', {
                                            required: 'Este campo es requido',
                                            validate: isAfternoonTime
                                        })}
                                        error={!!errors.hora}
                                        helperText={errors.hora?.message}
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />
                                </FormControl>
                            ) : (
                                <FormControl fullWidth>
                                    <TextField
                                        label={tipo}
                                        variant="outlined"
                                        {...register('hora', {
                                            required: 'Este campo es requido',
                                            validate: (d) => isMorningTime(d.toString())
                                        })}
                                        error={!!errors.hora}
                                        helperText={errors.hora?.message}
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />
                                </FormControl>
                            )
                    }
                    <Divider sx={{ my: 1 }} />
                    <Button type='submit' variant='outlined' color='success'>Registrar</Button>
                </Box>
            </form>
        </Modal>
    )
}
