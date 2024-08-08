import axios from 'axios';
import { IColaborador } from '../interface';
import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { Colaborador } from '../model';

interface controlErr {
    message: '';
}

export const getColaById = async (id: string): Promise<IColaborador | null> => {

    try {
        if (!isValidObjectId(id)) {
            return null;
        }

        await db.connect();

        const colabora = await Colaborador.findById({ _id: id }).lean();

        if (!colabora) {
            return null;
        }

        return JSON.parse(JSON.stringify(colabora));

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
