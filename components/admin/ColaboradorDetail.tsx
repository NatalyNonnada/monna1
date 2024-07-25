import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, Checkbox, Container, Divider, FormControl, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material';
import { IColaborador } from '../../interface';
import { initFecha } from '../../utils';
import { CalendarCola } from './CalendarCola';
import { useColabora } from '../../hooks';
import { LoadingCircular } from '../ui';
import { ModalCardCola } from './ModalCardCola';
import { CardBloque } from './CardBloque';
import { ModalCardAddHour } from './ModalCardAddHour';
import { Add } from '@mui/icons-material';
import { CardColaServicio } from './CardColaServicio';
import { GridHora } from './colaServicio/GridHora';

interface Props { colaborador: IColaborador; }

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface nfechas {
  fecha: string,
  horas: string[],
}

const blackData: nfechas = {
  fecha: '',
  horas: [],
}

interface hors {
  fecha: string;
  hora: string;
  servicio: string;
  _id?: string;
}


export const ColaboradorDetail = ({ colaborador }: Props) => {

  const { register, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm<nfechas>({ defaultValues: { ...blackData } });
  const { blocHora, deleteHora, addHora, addServicios } = useColabora();
  const [bloqueos, setBloqueos] = useState<hors[]>([]);
  const [servicios, setServicios] = useState<hors[]>([])
  const [isLoading, setSetIsLoaing] = useState(false);
  const [tipo, setTipo] = useState('');
  const [open, setOpen] = useState(false);
  const [openHora, setOpenHora] = useState(false);

  const handleOpenHora = (tipo: string) => {
    setTipo(tipo)
    setOpenHora(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseHora = () => {
    setTipo('');
    setOpenHora(false)
  }

  const selectData = (dato: Value) => {
    setValue('horas', [], { shouldValidate: true });
    setValue('fecha', initFecha.fomatDatea(dato), { shouldValidate: true })
  }


  const onChangeSize = (size: string) => {
    const currentSizes = getValues('horas');
    if (currentSizes.includes(size)) {
      return setValue('horas', currentSizes.filter(s => s !== size), { shouldValidate: true });
    }

    setValue('horas', [...currentSizes, size], { shouldValidate: true });

  }

  useEffect(() => {
    reset({ ...blackData })
  }, [reset]);

  const handleLoging = (value: boolean) => {
    setSetIsLoaing(value)
  }

  const handleRegister = async (bloc: nfechas) => {
    setSetIsLoaing(true);
    const newHoras: string[] = [];

    bloc.horas.forEach(da => {

      const filter = colaborador.listHd.some(p => p.hora.toString() === da.toString() && p.fecha.toString() === bloc.fecha.toString());
      if (!filter) {
        newHoras.push(da);
      }
    })

    setTimeout(async () => {
      setSetIsLoaing(true);
      const { hasError } = await blocHora({ ...bloc, horas: newHoras, id: colaborador._id || '' });
      setSetIsLoaing(hasError)
    }, 800);

  }

  useEffect(() => {
    const fillblo = colaborador.listHd.filter(p => p.servicio === 'Bloqueado')
    const fillser = colaborador.listHd.filter(p => p.servicio !== 'Bloqueado')
    setBloqueos(fillblo);
    setServicios(fillser);
  }, [colaborador])

  return (
    <Container>
      <LoadingCircular loading={isLoading} />
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card className='card-servicio-iten'>
            <CardContent>
              <Typography
                sx={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: colaborador.state ? 'green' : 'red',
                  cursor: 'pointer'
                }}
                gutterBottom
              >
                {colaborador.fullnames.toUpperCase()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography onClick={handleOpen} sx={{ cursor: 'pointer', }}>Total de servicios pendientes: <strong>{servicios.length} </strong> </Typography>
              <Divider sx={{ my: 1 }} />
              {
                colaborador.category.length > 0 ? (
                  <CardColaServicio
                    id={colaborador._id || ''}
                    category={colaborador.category}
                    handleLoging={handleLoging}
                    addServicios={addServicios}
                  />
                ) : (
                  <Typography style={{ fontSize: '17px', fontWeight: '700' }}>No se asignaron servicios</Typography>
                )
              }
              <Divider sx={{ my: 1 }} />
              <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                Turno mañana
                <IconButton onClick={() => handleOpenHora('Mañana')}>
                  <Add />
                </IconButton>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {
                  colaborador.morshift.length > 0 && (<GridHora horas={colaborador.morshift} />)
                }
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography style={{ fontSize: '17px', fontWeight: '700' }}>
                Turno tarde
                <IconButton onClick={() => handleOpenHora('Tarde')}>
                  <Add />
                </IconButton>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {
                  colaborador.aftshift.length > 0 && (<GridHora horas={colaborador.aftshift} />)
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* aqui */}
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardContent>
                  <Typography sx={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: 'salmon',
                    mb: 1
                  }}
                    textAlign='center'
                  >
                    Registrar nuevas fechas
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CalendarCola selectData={selectData} />
                  </Box>

                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card className='card-servicio-iten'>
            <CardContent>
              <Typography sx={{
                fontSize: '17px',
                fontWeight: '700',
                color: colaborador.date.length > 0 ? 'red' : 'green'
              }}
                textAlign='center'
              >
                FECHAS NO DISPONIBLES
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
                {
                  bloqueos.length > 0 && (
                    <CardBloque horas={bloqueos} id={colaborador._id || ''} handleDelete={deleteHora} handleLoging={handleLoging} />
                  )
                }
              </Box>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(handleRegister)}>
                <Typography style={{ fontSize: '17px', fontWeight: '700' }}>Fecha que no trabaja</Typography>
                <FormControl fullWidth>
                  <TextField
                    disabled={true}
                    variant='filled'
                    {...register('fecha', {
                      required: 'Este campo es requido',
                    })}
                    error={!!errors.fecha}
                    helperText={errors.fecha?.message}
                  />
                </FormControl>
                <Divider sx={{ my: 2 }} />
                <FormControl sx={{ mb: 1 }}>
                  {
                    colaborador.morshift.map(size => (

                      <FormControlLabel
                        key={size.hour}
                        control={<Checkbox checked={getValues('horas').includes(size.hour)} />}
                        label={size.hour}
                        onChange={() => onChangeSize(size.hour)}
                      />
                    ))
                  }
                  {
                    colaborador.aftshift.map(size => (
                      <FormControlLabel
                        key={size.hour}
                        control={<Checkbox checked={getValues('horas').includes(size.hour)} />}
                        label={size.hour}
                        onChange={() => onChangeSize(size.hour)}
                      />
                    ))
                  }
                </FormControl>
                <Divider sx={{ my: 2 }} />
                <FormControl fullWidth>
                  <Button
                    type='submit'
                    size='large'
                    variant='contained'
                    color='success'
                    disabled={getValues('horas').length <= 0}
                  >
                    Bloquear horas
                  </Button>
                </FormControl>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ModalCardCola open={open} listHd={servicios} handleClose={handleClose} />
      {openHora && (
        <ModalCardAddHour
          open={openHora}
          listHd={servicios}
          tipo={tipo}
          id={colaborador._id || ''}
          handleClose={handleCloseHora}
          addHora={addHora}
          handleLoging={handleLoging}
        />
      )}
    </Container>
  )
}
