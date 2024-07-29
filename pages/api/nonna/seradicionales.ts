import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Servicio } from '../../../model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getServicio(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getServicio = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await db.checkConnection();

        const Servicios = await Servicio.find({ category: 'Adicionales' }).select('_id price title category').lean();

        await db.disconnect();

        res.status(200).json(Servicios);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar los servicios'
        })
    }

}
