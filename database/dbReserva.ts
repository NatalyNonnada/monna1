import axios from 'axios';
import { IReserva } from '../interface';
import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { Order, Reserva } from '../model';

interface controlErr {
    message: '';
}

export const getReservaById = async (id: string): Promise<IReserva | null> => {

    try {
        if (!isValidObjectId(id)) {
            return null;
        }

        await db.connect();

        const reserva = await Reserva.findById({ _id: id }).populate('colaborador');

        if (!reserva) {
            return null;
        }

        return JSON.parse(JSON.stringify(reserva));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { message } = error.response.data as controlErr;
                console.log(message)
                return null;
            } else if (error.request) {
                console.log(error.request)
                return null;
            } else {
                console.log(error.code)
                return null;
            }
        } else {
            return null;
        }

    }
}
