import { useEffect, useState } from 'react';
import { addDays, format, startOfWeek, isBefore, isSameDay, isSunday, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { capitalize, initFecha } from '../../utils';
import { IHour, Iservicio, ISummary } from '../../interface';
import { GridHoras } from './GridHoras';

const mindata = () => {
    try {
        const minDate = new Date;
        let options = { timeZone: 'America/Lima' };
        let eastCoastTime = minDate.toLocaleDateString('es-PE', options).split("/").reverse().join("-");
        return new Date(`${eastCoastTime}`);
    } catch (error) {
        console.log('error 1')
        return new Date()
    }
}

let today = mindata();

interface Props {
    total: number;
    date: string;
    selectedDate?: string;
    hour?: IHour;
    cart?: Iservicio;
    updateInfo: (info: ISummary) => void;
    handleChandate: () => void;
    listaData: IHour[];
}

export const SelectDate = ({ total, date, hour = {
    hour: '',
    estate: false
}, selectedDate = '', listaData, updateInfo, handleChandate }: Props) => {


    const [currentDate, setCurrentDate] = useState(mindata());
    const [controlDay, setcontrolDay] = useState(0);
    const [fillter, setFillter] = useState<IHour[]>([]);
    console.log(today)

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

    const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
        addDays(startOfCurrentWeek, index)
    );

    const handleNextWeek = () => {
        if (controlDay <= 2) {
            setFillter([]);
            setCurrentDate(addDays(currentDate, 7));
            setcontrolDay(controlDay + 1);
            updateInfo({ date: '', hour, total, selectedDate: '' })
        }
    };

    const handlePreviousWeek = () => {
        if (controlDay > 0) {
            setFillter([]);
            const newDate = addDays(currentDate, -7);
            setCurrentDate(newDate);
            setcontrolDay(controlDay - 1);
            updateInfo({ date: '', hour, total, selectedDate: '' })
        }
    };

    const handleDayClick = (day: Date) => {
        if (isSameDay(selectedDate, day)) {
            return;
        } else {
            setFillter([]);
            updateInfo({ date: format(day, 'EEEE d MMMM yyy', { locale: es }), hour, total, selectedDate: `${initFecha.mindataClick(day)}` })
        }
    };

    const handleChangeDate = (da: IHour) => {
        updateInfo({ date, hour: da, total, selectedDate: `${selectedDate}` });
        handleChandate();
    }

    useEffect(() => {
        setFillter(listaData)
    }, [listaData])

    return (
        <Card style={{ animation: 'fadeIn', animationDuration: '1s' }}>
            <Typography className='title-cita'>
                {capitalize(`${format(currentDate, 'MMMM yyy', { locale: es })}`)}
            </Typography>
            <div className="jGNtAt">
                <IconButton className='lhqeuQ' onClick={handlePreviousWeek} disabled={controlDay <= 0}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
                {daysOfWeek.map(day => (
                    <div key={day.toISOString()} >
                        {!isSunday(day) && (
                            <div className="bjxqdS">
                                <button
                                    onClick={() => !isBefore(day, startOfDay(today)) && handleDayClick(day)}
                                    className={`${"bBsbgX"}  ${isSameDay(day, selectedDate) ? "hDvcjI" : ''} ${isBefore(day, startOfDay(today)) ? "iYVmrx" : ''}`}
                                >
                                    <div className='heKMRP'>
                                        <p className={`${"hCfkWR"} ${isSunday(day) ? " hCfkGRIS" : ''}   ${isSameDay(day, today) ? " hCfkBL" : ''} ${isSameDay(day, selectedDate) ? "hCfkWI" : ''} ${isBefore(day, startOfDay(today)) ? "hCfkGRIS" : ''}`}>
                                            {capitalize(format(day, 'EEE', { locale: es }))}
                                        </p>
                                        <p
                                            className={`${"hCfkWR"}  ${isSunday(day) ? " hCfkGRIS" : ''} ${isSameDay(day, today) ? " hCfkBL" : ''} ${isSameDay(day, selectedDate) ? "hCfkWI" : ''} ${isBefore(day, startOfDay(today)) ? "hCfkGRIS" : ''}`}
                                            style={{ fontWeight: 700 }}
                                        >
                                            {format(day, 'd', { locale: es })}</p>
                                    </div>
                                </button>
                            </div>
                        )
                        }
                    </div>

                ))}
                <IconButton
                    className='eJjuPu'
                    onClick={handleNextWeek}
                    disabled={controlDay >= 4}
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </div>
            <Divider sx={{ my: 1 }} />

            {
                fillter.length > 0 ? (
                    <GridHoras horas={listaData} handleChangeDate={handleChangeDate} />
                ) : (
                    <div style={{ animation: 'fadeIn', animationDuration: '1s' }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div>
                                <picture>
                                    <img style={{ blockSize: '100px' }} src='/illustration-calendar.png' />
                                </picture>
                            </div>
                        </Box>
                    </div>
                )
            }
            <Divider sx={{ my: 4 }} />
        </Card>
    )
}
