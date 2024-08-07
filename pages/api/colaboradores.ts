import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../database';
import { Colaborador } from '../../model';
import { startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { IHour } from '../../interface';
import { toZonedTime, format } from 'date-fns-tz';
import { Categ } from './nonna/colaborador/servicios';


function isValidCateg(value: any): value is Categ {
    return ['Acrílicas', 'Promo del mes', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'].includes(value);
}

const zoneTimea = () => {
    const now = new Date();
    const timeZone = 'America/Lima';
    return toZonedTime(now, timeZone);
}

const mindata = () => {
    return new Date(format(zoneTimea(), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Lima' }))
}

function esFinDeSemana(fechaIngresada: string): boolean {
    const fechaIngresadaDate = new Date(fechaIngresada);
    const diaSemana = fechaIngresadaDate.getDay();
    return diaSemana === 0;
}

function parseTimeToDate(time: string): Date {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'pm' && hours < 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    return new Date(mindata().getFullYear(), mindata().getMonth() + 1, mindata().getDay(), hours, minutes);
}

interface ICola {
    categoria: string | string[];
    date: string | string[],
    selectedDate: string | string[];
}

function convertTo24Hour(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'pm' && hours !== 12) {
        hours += 12;
    }
    if (modifier === 'am' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getColaborador(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getColaborador = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { categoria, date, selectedDate } = req.query;

        const data: ICola = {
            categoria: categoria || '',
            date: date || '',
            selectedDate: selectedDate || ''
        }

        if (!data.categoria) {
            return res.status(400).json({ message: 'La categoría es requerida' });
        }

        if (!isValidCateg(data.categoria)) {
            return res.status(400).json({ message: 'Categoría no valida' });
        }

        if (!data.selectedDate) {
            return res.status(400).json({ message: 'La fecha es requerida' });
        }

        if (!data.date) {
            return res.status(400).json({ message: 'La fecha es requerida' });
        }

        const fechaSelect = new Date(`${data.selectedDate}`);
        const fechaCalend = new Date(`${data.date}`);

        const fechaLimite = new Date();
        fechaLimite.setDate(mindata().getDate() + 21);

        if (esFinDeSemana(`${data.selectedDate}`)) {
            return res.status(400).json({ message: 'Fecha aún no disponible' });
        }

        if (mindata() >= fechaSelect || fechaLimite <= fechaSelect) {
            return res.status(400).json({ message: 'Fecha aún no disponible' });
        }

        const codigoCalen = `${format(fechaCalend, 'EEEE d MMMM yyy', { locale: es })}`;

        await db.checkConnection();

        const colaboradores = await Colaborador.find({
            category: categoria,
            state: true
        })

        const uniqueHours = new Set<string>();
        const result: IHour[] = [];

        colaboradores.forEach(colaborador => {

            const exist = colaborador.listHd.filter(p => p.fecha === codigoCalen);

            if (exist.length > 0) {
                const existSet = new Set(exist.map(e => e.hora));
                colaborador.morshift.forEach(turno => {
                    if (!existSet.has(turno.hour) && !uniqueHours.has(turno.hour)) {
                        uniqueHours.add(turno.hour);
                        result.push(turno);
                    }
                });

                colaborador.aftshift.forEach(turno => {
                    if (!existSet.has(turno.hour) && !uniqueHours.has(turno.hour)) {
                        uniqueHours.add(turno.hour);
                        result.push(turno);
                    }
                });

            } else {
                colaborador.morshift.forEach(turno => {
                    if (!uniqueHours.has(turno.hour)) {
                        uniqueHours.add(turno.hour);
                        result.push(turno);
                    }
                });
                colaborador.aftshift.forEach(turno => {
                    if (!uniqueHours.has(turno.hour)) {
                        uniqueHours.add(turno.hour);
                        result.push(turno);
                    }
                });
            }
        });

        const hourMap = new Map<string, string>();

        result.forEach(obj => {
            hourMap.set(obj.hour, convertTo24Hour(obj.hour));
        });

        result.sort((a, b) => {
            const timeA = hourMap.get(a.hour)!;
            const timeB = hourMap.get(b.hour)!;
            return timeA.localeCompare(timeB);
        });

        if (startOfDay(fechaSelect).toISOString() === startOfDay(mindata()).toISOString()) {
            const nowTime = mindata().getHours() * 60 + mindata().getMinutes();
            const thresholdMinutes = 60;
            const thresholdTime = nowTime + thresholdMinutes;
            const filteredShifts = result.filter(shift => {
                const shiftTime = parseTimeToDate(shift.hour);
                const shiftMinutes = shiftTime.getHours() * 60 + shiftTime.getMinutes();
                return shiftMinutes >= thresholdTime;
            });

            return res.status(200).json(filteredShifts);
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            message: 'contacte a monna'
        })
    }
}