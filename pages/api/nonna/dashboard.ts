import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Reserva, Order, Servicio, Colaborador } from '../../../model';

type Data = {
    numberOfReservas: number;
    paidOrders: number; // isPad true
    numberOfService: number;
    numberOfColabor: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    const [
        numberOfReservas,
        paidOrders,
        numberOfService,
        numberOfColabor,
    ] = await Promise.all([
        Reserva.countDocuments(),
        Order.countDocuments(),
        Servicio.countDocuments(),
        Colaborador.countDocuments(),
    ]);

    res.status(200).json({
        numberOfReservas,
        paidOrders,
        numberOfService,
        numberOfColabor,
    })
}