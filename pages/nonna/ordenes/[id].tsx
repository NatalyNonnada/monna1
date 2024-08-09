import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Box, Button, Card, CardActions, CircularProgress, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { CreditCardOffOutlined } from '@mui/icons-material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useOrder } from '../../../hooks';
import { IColaborador, IHour, IOrder, Iservicio } from '../../../interface';
import { dbOrders } from '../../../database';
import { LoadingCircular } from '../../../components';
import { listPages, validations } from '../../../utils';

interface datar {
    colaborador: string;
    orden: string;
    nureserva: number;
    careserva: number;
    hora: string;
    iniPago: string;
}

const black: datar = {
    colaborador: '',
    orden: '',
    nureserva: 0,
    careserva: 0,
    hora: '',
    iniPago: 'Yape'
}

interface Props { order: IOrder; }

type targetva = { name: '', value: '' }

const OrderPorPage: NextPage<Props> = ({ order }) => {

    const { date, hour, shippingAddress, Servicio, _id } = { ...order };
    const { price, title } = { ...Servicio as Iservicio }
    const [colabora, setColabora] = useState<IColaborador[]>([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<datar>({ defaultValues: { ...black } });
    const [selectCola, setSelectCola] = useState<IColaborador | undefined>();
    const [selectHour, setSelectHour] = useState<IHour | undefined>();
    const [isLoading, setSetisLoading] = useState(false);
    const router = useRouter();

    const { getCola, deleteOrder, createReserva } = useOrder();

    useEffect(() => {
        const obgg = async () => {
            const { data } = await getCola(order._id?.toString() || '', date, hour as string);
            if (data) {
                setColabora(data);
            }
        }
        obgg();
    }, [date, hour])

    const handleConfi = async (data: datar) => {

        setSetisLoading(true)

        const { hasError } = await createReserva({
            ...data,
            colaborador: selectCola?._id?.toString() || '',
            orden: order._id?.toString() || '',
            hora: selectHour?._id?.toString() || '',
        });

        if (hasError) {
            setSetisLoading(false)
        } else {
            router.replace('/nonna/ordenes/');
        }
    }

    useEffect(() => { reset(black) }, [reset]);

    const handleOnchage = ({ target }: any) => {
        const { value } = target as targetva;
        setSelectHour(undefined);
        if (value !== '' && colabora.length > 0) {
            const newCol = colabora.find(a => a._id?.toString() === value);
            if (newCol) {
                setSelectCola(newCol)
            } else {
                setSelectCola(undefined);
            }
        } else {
            setSelectCola(undefined);
        }
    }

    const handleChangeDate = (data: IHour) => {
        setSelectHour(data)
    }

    const handleDelete = async () => {
        Swal.fire({
            title: "Estas segura?",
            text: 'No podras revertir esto',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "¡Sí, eliminalo!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setSetisLoading(true)
                const { hasError } = await deleteOrder(_id?.toString() || '');
                if (!hasError) {
                    router.replace('/nonna/ordenes/');
                } else {
                    setSetisLoading(false);
                }
            }
        });
    }

    return (
        <AdminLayout
            title={'Colaboradores'}
            subTitle='Mantenimiento de colaboradores'
            icon={<CreditCardOffOutlined />}
        >
            <Container>
                <LoadingCircular loading={isLoading} />
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Card sx={{ padding: 2, width: '100%' }} className='respo-card-info'>
                            <Typography className='rfsFFFCOCard' textAlign='center'>Resumen de la orden</Typography>
                            <br />
                            <Card className='card-servicio' >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ mb: 1 }} className='rfsFFFCOCard' variant='subtitle2'>{title}</Typography>
                                    <div className='iQpGXx'>
                                        <CreditCardIcon style={{ color: 'var(--color-princi)' }} />
                                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>S/{price}</Typography>
                                    </div>
                                    {
                                        date !== '' &&
                                        (
                                            <div className='iQpGXx'>
                                                <CalendarMonthIcon style={{ color: 'var(--color-princi)' }} />
                                                <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{date}</Typography>
                                            </div>
                                        )
                                    }
                                    <div className='iQpGXx'>
                                        <QueryBuilderIcon style={{ color: 'var(--color-princi)' }} />
                                        <Typography style={{ fontSize: '17px' }} variant='subtitle2'>{hour as string}</Typography>
                                    </div>
                                </Box>
                            </Card>
                            <Divider sx={{ my: 1 }} />
                            <Card className='card-servicio' >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.email} </Typography>
                                    <Typography style={{ fontSize: '16px' }} variant='subtitle2'>{shippingAddress?.phone}</Typography>
                                </Box>
                            </Card>
                            <Divider sx={{ my: 1 }} />
                            <br />
                            <CardActions className='checkout' style={{ justifyContent: 'center', animation: 'fadeIn', animationDuration: '1s' }}>
                                <button onClick={handleDelete} className='fSJGrc'>Eliminar orden</button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Grid container spacing={2} sx={{ p: 5 }} justifyContent='center'>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="dormitorio-selects">Seleccione colaboradora</InputLabel>
                                    {
                                        colabora !== undefined ? (
                                            <Select
                                                labelId="demo-simple-select-label"
                                                name='colaborador'
                                                onChange={handleOnchage}
                                                defaultValue={``}
                                                label="Seleccione colaboradora"
                                            >
                                                <MenuItem value="">Colaboradora</MenuItem>
                                                {
                                                    colabora.map(est => (
                                                        <MenuItem key={est._id} value={est._id}>{est.fullnames}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        ) : (
                                            <CircularProgress color="inherit" />
                                        )
                                    }
                                </FormControl>
                                <Divider sx={{ my: 1 }} />
                                {
                                    selectCola && (
                                        <>
                                            <Divider sx={{ my: 1 }} >Mañana</Divider>
                                            <div className='eXeTmM'>
                                                {
                                                    selectCola.morshift.map(da => (
                                                        <div key={da._id} className='eguxKp'>
                                                            <button
                                                                onClick={() => handleChangeDate(da)}
                                                                className={`hRqpUZ ${da._id?.toString() === selectHour?._id?.toString() ? 'selhrcolor' : ''} `}
                                                            >
                                                                {da.hour}
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    selectCola && (
                                        <>
                                            <Divider sx={{ my: 1 }} >Tarde</Divider>
                                            <div className='eXeTmM'>
                                                {
                                                    selectCola.aftshift.map(da => (
                                                        <div key={da._id} className='eguxKp'>
                                                            <button
                                                                onClick={() => handleChangeDate(da)}
                                                                className={`hRqpUZ ${da._id?.toString() === selectHour?._id?.toString() ? 'selhrcolor' : ''} `}
                                                            >
                                                                {da.hour}
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                                }
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <form onSubmit={handleSubmit(handleConfi)}>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            label="Número de operación"
                                            {...register('nureserva', {
                                                required: 'Este campo es requido',
                                                validate: (d) => validations.isPrice(`${d}`),
                                            })}
                                            error={!!errors.nureserva}
                                            helperText={errors.nureserva?.message}
                                        />
                                    </FormControl>
                                    <Divider sx={{ my: 1 }} />
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            label="Adelanto"
                                            {...register('careserva', {
                                                required: 'Este campo es requido',
                                                validate: (d) => validations.isPrice(`${d}`),
                                            })}
                                            error={!!errors.careserva}
                                            helperText={errors.careserva?.message}
                                        />
                                    </FormControl>
                                    <Divider sx={{ my: 1 }} />
                                    <FormControl fullWidth>
                                        <InputLabel id="dormitorio-selects">Tipo de pago</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            {...register('iniPago')}
                                            defaultValue={`Efectivo`}
                                            label="Tipo de pago"
                                        >
                                            <MenuItem value="">Tipo de pago</MenuItem>
                                            {
                                                listPages.pagos.map(est => (
                                                    <MenuItem key={est} value={est}>{est}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Divider sx={{ my: 1 }} />
                                    <FormControl fullWidth>
                                        <Button
                                            type='submit'
                                            size='large'
                                            variant='contained'
                                            disabled={!!!colabora}
                                            color='success'>
                                            Confirmar
                                        </Button>
                                    </FormControl>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </AdminLayout >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {


    const { id = '' } = query;
    const data = await dbOrders.getOrderById(id.toString());

    if (!data) {
        return {
            redirect: {
                destination: '/nonna/ordenes',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order: data
        }
    }
}

export default OrderPorPage;