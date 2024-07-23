import { IHour } from '../interface';
import validator from 'validator'

export const isValidNumber = (value: string): boolean => {
    return validator.isNumeric(value)
};

export const isPrice = (val1: string): string | undefined => {
    return isValidNumber(`${val1}`)
        ? undefined
        : 'Solo números';
}

export const isTitle = (val1: string): string | undefined => {
    return validator.isAlpha(val1, 'es-ES', { ignore: ' ' })
        ? undefined
        : 'Nombre no valido';
}

export const isTitleReg = (val1: string): string | undefined => {
    return validator.isAlphanumeric(val1, 'es-ES', { ignore: ' /.:)(-%°;+,' })
        ? undefined
        : 'Nombre no valido';
}


const isValidPassword = (password: string): boolean => {
    return validator.isAlphanumeric(password, 'es-ES', { ignore: '._-#%&' })
};

export const islas = (val1: string): string | undefined => {
    return validator.isAlpha(val1, 'es-ES', { ignore: '' })
        ? undefined
        : 'Apellido no valido';
}

export const isFull = (val1: string): string | undefined => {
    return validator.isAlpha(val1, 'es-ES', { ignore: ' ' })
        ? undefined
        : 'Apellido no valido';
}

export const isEmail = (val1: string): string | undefined => {
    return validator.isEmail(val1)
        ? undefined
        : 'Correo no valido';
}

export const isPhone = (val1: string): string | undefined => {
    return validator.isMobilePhone(val1, 'es-PE')
        ? undefined
        : 'Celular no valido';
}

export const isTag = (val1: string): boolean => validator.isAlpha(val1, 'es-ES');

interface shippingAddress {
    firstName: string,
    lastName: string
    email: string
    phone: string
}

interface orderv {
    date: string;
    selectedDate: Date;
    total: number;
    Servicio?: string;
}

export const ValidAddress = (data: shippingAddress | undefined): boolean => {
    if (data === undefined) {
        return true;
    }

    if (islas(data.firstName) || islas(data.lastName) || isEmail(data.email) || isPhone(data.phone)) {
        return true;
    } else {
        return false;
    }
}

export const isPassword = (password: string): string | undefined => {
    return isValidPassword(password)
        ? undefined
        : 'El password no es válido';
}

export const ValidOrder = (data: orderv | undefined): boolean => {
    if (data === undefined) {
        return true;
    }

    if (!validator.isAlphanumeric(data.date, 'es-ES', { ignore: ' ' }) ||
        isNaN(data.selectedDate.getTime()) ||
        !validator.isNumeric(`${data.total}`) ||
        !validator.isAlphanumeric(`${data.Servicio}`)
    ) {
        return true;
    } else {
        return false;
    }
}

export const ValidHour = (data: IHour | undefined): boolean => {
    if (data === undefined) {
        return true;
    }

    if (!validator.isAlphanumeric(data.hour, 'es-ES', { ignore: ' :' }) ||
        !validator.isAlphanumeric(`${data._id}`)
    ) {
        return true;
    } else {
        return false;
    }
}
