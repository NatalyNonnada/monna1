import axios from 'axios';
import { Iservicio, IShoppingAddress } from '../interface';
import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { Order } from '../model';

interface IOrder {
    _id?: string;
    selectedDate: string;
    date: string;
    hour: string;
    total: number;
    Servicio: Iservicio;
    shippingAddress: IShoppingAddress;

    isPaid: boolean;
    opreacion?: string;

    createdAt?: string;
    updatedAt?: string;
}

interface controlErr {
    message: '';
}


export const getOrderById = async (id: string): Promise<IOrder | null> => {

    try {
        if (!isValidObjectId(id)) {
            return null;
        }

        await db.connect();

        const orden = await Order.findById({ _id: id }).populate('Servicio')

        if (!orden) {
            return null;
        }

        return JSON.parse(JSON.stringify(orden));
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
