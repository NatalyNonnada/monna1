import { Boleta } from '../../model';
import { db } from '../../database';
import type { NextApiRequest, NextApiResponse } from 'next';

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

        await db.checkConnection();

        const boletas = await Boleta.find().lean();

        res.status(200).json(boletas);

    } catch (error) {
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar la orden'
        })
    }

}

const deleteBoleta = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        await db.checkConnection();

        const { id } = req.query;

        const dbOrder = await Boleta.findById({ _id: id });

        if (!dbOrder) {
            return res.status(400).json({ message: 'No existe la boleta' });
        }

        await Boleta.deleteOne({ _id: id })

        res.status(200).json({ message: 'ok' });

    } catch (error) {

        res.status(400).json({
            message: 'contacte a CinCout, no se puedo eliminar la boleta'
        })
    }
}
