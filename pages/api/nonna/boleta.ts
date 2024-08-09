import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order } from '../../../model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getBoleta(req, res);

        case 'DELETE':
            return deleteBoleta(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getBoleta = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        await db.connect();

        const Orderes = await Order.find().populate('Servicio').lean();

        res.status(200).json(Orderes);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar la orden'
        })
    }

}

const deleteBoleta = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        await db.checkConnection();

        const _id = (req.query.id as string) || '';

        const dbOrder = await Order.findById(_id);

        if (!dbOrder) {

            return res.status(400).json({ message: 'No existe el Order' });
        }

        await db.checkConnection();

        await Order.deleteOne({ _id: _id })

        res.status(200).json({ message: 'ok' });

    } catch (error) {

        res.status(400).json({
            message: 'contacte a CinCout, no se puedo eliminar la orden'
        })
    }
}
