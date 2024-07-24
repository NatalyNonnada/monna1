import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { IOrder } from '../../../../interface';
import { Order } from '../../../../model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getOrder(req, res);

        case 'PUT':
            return updateOrder(req, res);

        case 'DELETE':
            return deleteOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {


    try {

        await db.connect();

        const Orderes = await Order.find().populate('Servicio')

        await db.disconnect();

        res.status(200).json(Orderes);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar la orden'
        })
    }

}

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const {
            _id,
        } = req.body as IOrder;


        await db.connect();

        const dbOrder = await Order.findOne({ _id });

        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el Order' });
        }

        await dbOrder.save();
        await db.disconnect();

        res.status(200).json(dbOrder);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con CinCout, no se puedo actualizar la orden'
        })
    }
}


const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        await db.connect();

        const _id = (req.query.id as string) || '';

        const dbOrder = await Order.findById(_id);

        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el Order' });
        }

        await dbOrder.deleteOne({ _id })

        await db.disconnect();

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se puedo eliminar la orden'
        })
    }
}
