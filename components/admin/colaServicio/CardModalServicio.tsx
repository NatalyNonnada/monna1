import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Modal } from '@mui/material'
import { styleCard } from '../styleCard';
import { listPages } from '../../../utils';
import { errorAlert } from '../../../alerts';

interface bodyre {
    id: string;
    lstservicios: string[];
}

const blackBo: bodyre = {
    id: '',
    lstservicios: []
}

interface Props {
    open: boolean;
    category: string[];
    id: string;
    handleClose: () => void;
    handleLoging: (value: boolean) => void;
    addServicios: (value: bodyre) => Promise<{
        hasError: boolean;
    }>
}

export const CardModalServicio = ({ open, category, id, handleClose, addServicios, handleLoging }: Props) => {

    const { register, handleSubmit, getValues, reset, setValue, formState: { errors } } = useForm<bodyre>({ defaultValues: { ...blackBo, lstservicios: category } });

    const onChangeSize = (size: string) => {
        const currentSizes = getValues('lstservicios');
        if (currentSizes.includes(size)) {
            return setValue('lstservicios', currentSizes.filter(s => s !== size), { shouldValidate: true });
        }
        setValue('lstservicios', [...currentSizes, size], { shouldValidate: true });
    }

    const handleRegister = async (serv: bodyre) => {
        if (serv.lstservicios.length <= 0) {
            handleClose();
            errorAlert('Seleccione al menos un servicio');
            return;
        }

        handleClose();
        handleLoging(true);

        const { hasError } = await addServicios({ id, lstservicios: serv.lstservicios });

        if (!hasError) {
            handleLoging(false);
        }
    }

    useEffect(() => {
        reset({ id: '', lstservicios: category })
    }, [reset])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <form onSubmit={handleSubmit(handleRegister)}>
                <Box sx={{ ...styleCard, width: 400, display: 'flex', flexDirection: 'column' }}>
                    <FormControl sx={{ mb: 1 }}>
                        <FormLabel style={{ color: 'black', fontWeight: 700 }}>Servicios en los que colabora</FormLabel>
                        {
                            listPages.categorias.map(size => (
                                <FormControlLabel
                                    key={size.name}
                                    control={<Checkbox checked={getValues('lstservicios').includes(size.name)} />}
                                    label={size.name}
                                    onChange={() => onChangeSize(size.name)}
                                />
                            ))
                        }
                    </FormControl>
                    <Button type='submit' variant='outlined' color='success'>Actualizar</Button>
                </Box>
            </form>
        </Modal>
    )
}
