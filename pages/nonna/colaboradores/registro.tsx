import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Box, Button, Card, CardContent, Checkbox, Chip, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, RadioGroup, TextField, Typography } from '@mui/material';
import { IColaborador, IHour } from '../../../interface';
import { isAfternoonTime, isMorningTime, listPages, validations } from '../../../utils';
import BadgeIcon from '@mui/icons-material/Badge';
import { useColabora } from '../../../hooks';
import { LoadingCircular } from '../../../components';

const formHour: IHour = { hour: '', estate: false }

const formdata: IColaborador = {
    fullnames: '',
    morshift: [],
    aftshift: [],
    category: [],
    state: false,
    date: [],
    listHd: [{ fecha: '', hora: '', servicio: '' }]
}

const ServicioRegistroPage: NextPage = () => {

    const { register, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<IColaborador>({ defaultValues: { ...formdata } });
    const [newTagValue, setNewTagValue] = useState<IHour>(formHour);
    const [newTagAfte, setNewTagAfte] = useState<IHour>(formHour);
    const [control, setControl] = useState(true);
    const { createColaborador, isLoaded } = useColabora();


    useEffect(() => {
        setControl(true)
        reset({ ...formdata });
    }, [reset]);

    const onNewTag = () => {
        const newHour = newTagValue;
        const currentTags = getValues('morshift').find(p => p.hour === `${newHour.hour} am`);
        setNewTagValue(formHour);
        if (currentTags?.hour.includes(newHour.hour)) {
            return;
        }
        if (newHour.hour === '') return;
        if (isMorningTime(newHour.hour.trim())) {
            setValue('morshift', [...getValues('morshift'), { ...newHour, hour: `${newHour.hour.trim()} am` }], { shouldValidate: true })
        }
    }

    const onNewTagAfte = () => {
        const newHour = newTagAfte;
        const currentTags = getValues('aftshift').find(p => p.hour === `${newHour.hour} pm`);
        setNewTagAfte(formHour);
        if (currentTags?.hour.includes(newHour.hour)) {
            return;
        }
        if (newHour.hour === '') return;
        if (isAfternoonTime(newHour.hour.trim())) {
            setValue('aftshift', [...getValues('aftshift'), { ...newHour, hour: `${newHour.hour.trim()} pm` }], { shouldValidate: true })
        }
    }

    const onSetTag = (val: string) => {
        if (val === '') {
            setNewTagValue({ hour: '', estate: false });
            return
        }
        setNewTagValue({ hour: val, estate: false });
    }

    const onSetTagAfte = (val: string) => {
        if (val === '') {
            setNewTagAfte({ hour: '', estate: false });
            return
        };
        setNewTagAfte({ hour: val, estate: false });
    }

    const onDeleteTag = (tag: IHour) => {
        const updatedTags = getValues('morshift').filter(t => t.hour !== tag.hour);
        setValue('morshift', updatedTags, { shouldValidate: true })
    }

    const onDeleteTagAfte = (tag: IHour) => {
        const updatedTags = getValues('aftshift').filter(t => t.hour !== tag.hour);
        setValue('aftshift', updatedTags, { shouldValidate: true })
    }

    const onChangeSize = (size: string) => {
        const currentSizes = getValues('category');
        if (currentSizes.includes(size)) {
            return setValue('category', currentSizes.filter(s => s !== size), { shouldValidate: true });
        }

        setValue('category', [...currentSizes, size], { shouldValidate: true });

    }

    const handleRegister = (data: IColaborador) => {
        if (control || getValues('category').length > 0) {
            createColaborador(data);
        }
    }

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'morshift' || name === 'aftshift') {
                if (value.morshift?.length || 0 > 0 || value.aftshift?.length || 0 > 0) {
                    setControl(false)
                } else {
                    setControl(true)
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue])

    return (
        <AdminLayout
            title={'Colaborador'}
            subTitle='Registro de colaborador'
            icon={<BadgeIcon />}
        >
            <Container sx={{ width: { sm: '30rem', md: '35rem', lg: '35rem' } }}>
                <LoadingCircular loading={isLoaded} />
                <Card className='cart-col'>
                    <CardContent >
                        <Typography sx={{ mb: 2, mt: 1 }} textAlign='center'>Datos de colaborador</Typography>
                        <form onSubmit={handleSubmit(handleRegister)}>
                            <Grid container spacing={2} justifyContent='center'>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Nombres completos"
                                            variant='outlined'
                                            {...register('fullnames', {
                                                required: 'Este campo es requido',
                                                validate: validations.isFull,
                                            })}
                                            error={!!errors.fullnames}
                                            helperText={errors.fullnames?.message}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2} justifyContent='center'>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Chip
                                        label="Es necesario al menos un servicio"
                                        color='error'
                                        variant='outlined'
                                        sx={{ display: getValues('category').length <= 0 ? 'flex' : 'none' }}
                                    />
                                    <br />
                                    <FormControl sx={{ mb: 1 }}>
                                        <FormLabel>Servicios en los que colabora</FormLabel>
                                        {
                                            listPages.categorias.map(size => (
                                                <FormControlLabel
                                                    key={size.name}
                                                    control={<Checkbox checked={getValues('category').includes(size.name)} />}
                                                    label={size.name}
                                                    onChange={() => onChangeSize(size.name)}
                                                />
                                            ))
                                        }
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2} justifyContent='center'>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Typography sx={{ mb: 1 }} textAlign='center'>Turno mañana</Typography>
                                    <Chip
                                        label="Es necesario al menos una hora"
                                        color='error'
                                        variant='outlined'
                                        sx={{ display: control ? 'flex' : 'none' }}
                                    />
                                    <br />
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Horaio"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ mb: 1 }}
                                            helperText="Presiona [spacebar] para agregar"
                                            value={newTagValue.hour}
                                            onChange={({ target }) => onSetTag(target.value)}
                                            onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
                                        />
                                    </FormControl>

                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        listStyle: 'none',
                                        p: 0,
                                        m: 0,
                                    }}
                                        component="ul">
                                        {
                                            getValues('morshift').map((tag) => {
                                                return (
                                                    <Chip
                                                        key={tag.hour}
                                                        label={tag.hour}
                                                        onDelete={() => onDeleteTag(tag)}
                                                        color="primary"
                                                        size='small'
                                                        sx={{ ml: 1, mt: 1 }}
                                                    />
                                                );
                                            })}
                                        <Divider sx={{ my: 2 }} />
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2} justifyContent='center'>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Typography sx={{ mb: 1 }} textAlign='center'>Turno tarde</Typography>
                                    <Chip
                                        label="Es necesario al menos una hora"
                                        color='error'
                                        variant='outlined'
                                        sx={{ display: control ? 'flex' : 'none' }}
                                    />
                                    <br />
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Horaio"
                                            variant="outlined"
                                            fullWidth
                                            sx={{ mb: 1 }}
                                            helperText="Presiona [spacebar] para agregar"
                                            value={newTagAfte.hour}
                                            onChange={({ target }) => onSetTagAfte(target.value)}
                                            onKeyUp={({ code }) => code === 'Space' ? onNewTagAfte() : undefined}
                                        />
                                    </FormControl>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        listStyle: 'none',
                                        p: 0,
                                        m: 0,
                                    }}
                                        component="ul">
                                        {
                                            getValues('aftshift').map((tag) => {
                                                return (
                                                    <Chip
                                                        key={tag.hour}
                                                        label={tag.hour}
                                                        onDelete={() => onDeleteTagAfte(tag)}
                                                        color="primary"
                                                        size='small'
                                                        sx={{ ml: 1, mt: 1 }}
                                                    />
                                                );
                                            })}
                                        <Divider sx={{ my: 2 }} />
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                            </Grid>

                            <Typography component='div' style={{ display: 'flex', justifyContent: 'center', marginTop: '5px', marginBottom: '5px' }}>
                                <Button
                                    type='submit'
                                    style={{ textAlign: 'center' }}
                                    size='medium'
                                    variant='contained'
                                    color='success'
                                    disabled={control || getValues('category').length <= 0}
                                >
                                    Registrar colaborador
                                </Button>
                            </Typography>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </AdminLayout>
    )
}

export default ServicioRegistroPage;