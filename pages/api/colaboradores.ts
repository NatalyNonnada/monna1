import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../database';
import { Colaborador } from '../../model';
import { startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { IHour } from '../../interface';
import { toZonedTime, format } from 'date-fns-tz';

type Categ = 'Promo del mes' | 'Manicure' | 'Pedicure' | 'Cejas' | 'Pestañas' | 'Adicionales'

function isValidCateg(value: any): value is Categ {
    return ['Promo del mes', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'].includes(value);
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

// Función para convertir una hora en formato 'h:mm am/pm' a un objeto Date
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

        const fechaSelect = new Date(`${data.selectedDate}`);

        const fechaLimite = new Date();
        fechaLimite.setDate(mindata().getDate() + 21);

        if (esFinDeSemana(`${data.selectedDate}`)) {
            return res.status(400).json({ message: 'No estamos disponibles para estas fechas intenta con otras' });
        }

        if (mindata() >= fechaSelect || fechaLimite <= fechaSelect) {
            return res.status(400).json({ message: 'No estamos disponibles para estas fechas intenta con otras' });
        }

        const codigo = `${format(fechaSelect, 'EEEE d MMMM yyy', { locale: es })}`;

        await db.connect();

        const colaboradores = await Colaborador.find({
            category: categoria,
            state: true
        }).lean();

        console.log(colaboradores)

        await db.disconnect();

        const uniqueHours: { [key: string]: boolean } = {};
        const result: IHour[] = [];

        colaboradores.map(colaborador => {

            const exist = colaborador.listHd.filter(p => p.fecha === codigo);

            if (exist.length > 0) {

                exist.map(da => {

                    if (colaborador.morshift.length > 0) {

                        const find = colaborador.date.find(a => a === `${codigo}${da.hora}`.replace(/\s/g, ""))

                        if (!find) {
                            colaborador.morshift.forEach(turno => {
                                if (!uniqueHours[turno.hour]) {
                                    uniqueHours[turno.hour] = true;
                                    result.push(turno);
                                }
                            });
                        }
                    }

                    if (colaborador.aftshift.length > 0) {

                        const find = colaborador.date.find(a => a === `${codigo}${da.hora}`.replace(/\s/g, ""))

                        if (!find) {
                            colaborador.aftshift.forEach(turno => {
                                if (!uniqueHours[turno.hour]) {
                                    uniqueHours[turno.hour] = true;
                                    result.push(turno);
                                }
                            });
                        }
                    }

                })
            } else {
                colaborador.morshift.forEach(turno => {
                    if (!uniqueHours[turno.hour]) {
                        uniqueHours[turno.hour] = true;
                        result.push(turno);
                    }
                });

                colaborador.aftshift.forEach(turno => {
                    if (!uniqueHours[turno.hour]) {
                        uniqueHours[turno.hour] = true;
                        result.push(turno);
                    }
                });
            }
        });


        console.log(colaboradores);

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
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a monna'
        })
    }
}