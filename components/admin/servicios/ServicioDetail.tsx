import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { Iservicio } from '../../../interface';
import { listPages, validations } from '../../../utils';
import { styleCard } from '../styleCard';
import Tiptap from '../../../components/ui/Tiptap';

interface Props {
    open: boolean;
    servicio: Iservicio
    handleClose: () => void;
    handleLoging: (value: boolean) => void;
    updateServicio: (form: Iservicio) => Promise<{
        hasError: boolean;
    }>
}

export const ServicioDetail = ({ open, servicio, handleClose, handleLoging, updateServicio }: Props) => {

    const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm<Iservicio>({ defaultValues: { ...servicio } });

    useEffect(() => {
        reset({ ...servicio })
    }, [reset])

    const onChangeSize = (size: boolean) => {
        const currentSizes = getValues('estado');
        if (currentSizes === size) {
            return setValue('estado', size, { shouldValidate: true });
        }
        setValue('estado', size, { shouldValidate: true });
    }

    const handleContentChange = (jsonContent: any) => setValue('description', JSON.stringify(jsonContent))

    const handleRegister = (data: Iservicio) => {
        handleClose();
        handleLoging(true)
        updateServicio(data);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Card sx={{ ...styleCard }}>
                <CardContent>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Titulo"
                                        variant='outlined'
                                        {...register('title', {
                                            required: 'Este campo es requido',
                                            validate: validations.isTitleReg,
                                        })}
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                </FormControl>
                                <Divider sx={{ my: 1 }} />
                                <FormControl fullWidth>
                                    <TextField
                                        label="Precio"
                                        variant='outlined'
                                        {...register('price', {
                                            required: 'Este campo es requido',
                                            validate: (p) => validations.isPrice(`${p}`),
                                            min: { value: 1, message: 'No puede ser cero' }
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                </FormControl>
                                <Divider sx={{ my: 1 }} />
                                <FormControl fullWidth>
                                    <TextField
                                        label="Reserva"
                                        variant='outlined'
                                        {...register('reser', {
                                            required: 'Este campo es requido',
                                            validate: (p) => validations.isPrice(`${p}`),
                                            min: { value: 1, message: 'No puede ser cero' }
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                </FormControl>
                                <Divider sx={{ my: 1 }} />
                                <FormControl fullWidth>
                                    <InputLabel id="dormitorio-selects">Categoria</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        {...register('category')}
                                        defaultValue={`${servicio.category}`}
                                        label="Categoria"
                                    >
                                        {
                                            listPages.categorias.map(est => (
                                                <MenuItem key={est.name} value={est.name}>{est.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Divider sx={{ my: 1 }} />
                                <p>{getValues('description')}</p>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Descripción"
                                        variant='outlined'
                                        {...register('description', {
                                            required: 'Este campo es requido',
                                            // validate: validations.isTitleReg,
                                        })}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                    <Tiptap
                                        onChange={(newContent: string) => handleContentChange(newContent)}
                                        initialContent={`{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Monna"}]}]}`}
                                    />
                                </FormControl>

                                <FormControlLabel
                                    control={<Checkbox checked={getValues('estado')} />}
                                    label='Estado'
                                    onChange={() => onChangeSize(!servicio.estado)}
                                />
                            </Grid>
                        </Grid>
                        <Typography
                            component='div'
                            style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', marginBottom: '5px' }}>
                            <Button
                                type='submit'
                                style={{ textAlign: 'center' }}
                                size='medium'
                                variant='contained'
                                color='success'
                            >
                                Actualizar
                            </Button>
                        </Typography>
                    </form>
                </CardContent>
            </Card>
        </Modal>
    )
}
