import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CategoryOutlined } from '@mui/icons-material';
import { Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Iservicio } from '../../../interface';
import { listPages, validations } from '../../../utils';
import { useServicio } from '../../../hooks';
import { LoadingCircular } from '../../../components';
import Tiptap from '../../../components/ui/Tiptap';

const formdata: Iservicio = {
    title: '',
    price: 0,
    reser: 0,
    description: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Monna"}]}]}',
    category: '',
    estado: false
}

const ServicioRegistroPage: NextPage = () => {

    const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<Iservicio>({ defaultValues: { ...formdata } });

    const { isLoaded, createServicio } = useServicio()

    useEffect(() => {
        reset({ ...formdata });
    }, [reset])

    const handleContentChange = (jsonContent: any) => setValue('description', JSON.stringify(jsonContent))

    const handleRegister = (data: Iservicio) => {
        createServicio(data);
    }

    return (
        <AdminLayout
            title={'Servicio'}
            subTitle='Registro de servicio'
            icon={<CategoryOutlined />}
        >
            <Container>
                <LoadingCircular loading={isLoaded} />
                <Card sx={{ mt: 1 }}>
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
                                </Grid>
                                <Grid item xs={6} sm={6} md={4} lg={4}>
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
                                </Grid>
                                <Grid item xs={6} sm={6} md={4} lg={4}>
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
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="dormitorio-selects">Categoria</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            {...register('category')}
                                            defaultValue={'Promo del mes'}
                                            label="Categoria"
                                        >
                                            {
                                                listPages.categorias.map(est => (
                                                    <MenuItem key={est.name} value={est.name}>{est.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <Tiptap
                                        onChange={(newContent: string) => handleContentChange(newContent)}
                                        initialContent={`${getValues('description')}`}
                                    />
                                </Grid>
                            </Grid>
                            <Typography component='div' style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', marginBottom: '5px' }}>
                                <Button
                                    type='submit'
                                    style={{ textAlign: 'center' }}
                                    size='medium'
                                    variant='contained'
                                    color='success'
                                >
                                    Registrar servicio
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