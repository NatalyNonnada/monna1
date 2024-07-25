type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

import { es } from 'date-fns/locale';
import { add } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';


const combineDateAndTime = (date: Date, time: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return new Date(year, month, day, hours, minutes, seconds);
};

const formatZonedDate = (date: Date): string => {
    const timeZone = 'America/Lima';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'EEE MMM dd yyyy HH:mm:ss XXX', { timeZone: 'America/Lima' });
};

const zoneTimea = () => {
    const now = new Date();
    const timeZone = 'America/Lima';
    return toZonedTime(now, timeZone);
}

export const mindata = () => {
    return new Date(format(zoneTimea(), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Lima' }))
}

export const mindataFor = () => {
    return format(mindata(), 'EEEE d MMMM yyy', { locale: es })
}

const addOneHour = (date: Date): Date => {
    return add(date, { hours: 1 });
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

export const fomatDatea = (date: Value) => {

    if (date === null) {
        return '';
    }

    if (Array.isArray(date)) {
        return date.map(d => (d ? format(d, 'EEEE d MMMM yyy', { locale: es }) : 'Invalid date')).join(', ');
    }

    return format(date, 'EEEE d MMMM yyy', { locale: es });
}