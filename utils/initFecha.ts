type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

import { es } from 'date-fns/locale';
import { add } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';


const combineDateAndTime = (date: Date, time: Date): Date => {
    // Obtener el año, mes y día de la fecha proporcionada
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Obtener la hora, minutos y segundos del tiempo actual
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Crear una nueva fecha con la combinación de fecha y hora
    return new Date(year, month, day, hours, minutes, seconds);
};

const formatZonedDate = (date: Date): string => {
    const timeZone = 'America/Lima';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'EEE MMM dd yyyy HH:mm:ss XXX', { timeZone: 'America/Lima' });
};

const zoneTimea = () => {
    const now = new Date(); // Obtiene la fecha y hora actuales en UTC
    const timeZone = 'America/Lima'; // Zona horaria deseada
    return toZonedTime(now, timeZone);
}

export const mindata = () => {
    // const minDate = new Date;
    // let options = { timeZone: 'America/Lima' };
    // let eastCoastTime = minDate.toLocaleDateString('es-PE', options).split("/").reverse().join("-");
    // return new Date(`${eastCoastTime}`);
    return new Date(format(zoneTimea(), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Lima' }))
}

export const mindataFor = () => {
    return format(mindata(), 'EEEE d MMMM yyy', { locale: es })
}

const addOneHour = (date: Date): Date => {
    return add(date, { hours: 1 }); // Suma una hora a la fecha proporcionada
};

export const mindataSelec = () => {
    return addOneHour(mindata())
}

export const mindataClick = (date: Date) => {
    const combinedDate = combineDateAndTime(date, zoneTimea());
    const formattedDate = formatZonedDate(combinedDate);
    const updatedDate = addOneHour(new Date(formattedDate));
    return updatedDate;
}


// export const mindata = () => {
//     const minDate = new Date;
//     let options = { timeZone: 'America/Lima' };
//     let eastCoastTime = minDate.toLocaleDateString('es-PE', options).split("/").reverse().join("-");
//     return new Date(`${eastCoastTime}`);
// }

export const fomatDatea = (date: Value) => {

    if (date === null) {
        return '';
    }

    if (Array.isArray(date)) {
        return date.map(d => (d ? format(d, 'EEEE d MMMM yyy', { locale: es }) : 'Invalid date')).join(', ');
    }

    return format(date, 'EEEE d MMMM yyy', { locale: es });
}