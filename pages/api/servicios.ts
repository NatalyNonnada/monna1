import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../database';
import { Servicio } from '../../model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getServicios(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getServicios = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        await db.connect();

        const servicios = await Servicio.find({ estado: true }, { createdAt: 0, updatedAt: 0, reser: 0 });

        res.status(200).json(servicios);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: 'contacte a monna'
        })
    }

}