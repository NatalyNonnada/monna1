import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { Order } from '../../../../model';
import { isValidObjectId } from 'mongoose';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getOrder(req, res);
        case 'DELETE':
            return deleteOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { id } = req.query;

        await db.connect();

        const orden = await Order.findById({ _id: id }).populate('Servicio');

        await db.disconnect();

        res.status(200).json(orden);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar los departametos'
        })
    }

}

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { id } = req.query;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'El id de la orden no es válido' });
        }

        await db.connect();

        const dbOrder = await Order.findById({ _id: id });

        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la orden' });
        }

        await dbOrder.deleteOne({ _id: id })

        await db.disconnect();

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudo eliminar la orden'
        })
    }

}
