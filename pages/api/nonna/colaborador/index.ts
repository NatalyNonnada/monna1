import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { IColaborador } from '../../../../interface';
import { Colaborador } from '../../../../model';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getColaborador(req, res);

        case 'POST':
            return createColaborador(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getColaborador = async (req: NextApiRequest, res: NextApiResponse) => {


    try {

        await db.checkConnection();

        const colaboradores = await Colaborador.find().lean();

        await db.disconnect();

        res.status(200).json(colaboradores);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar al colaborador'
        })
    }

}

const createColaborador = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { fullnames } = req.body as IColaborador;

        await db.checkConnection();

        const dbColaborador = await Colaborador.findOne({ fullnames });

        if (dbColaborador) {
            await db.disconnect();
            return res.status(400).json({ message: 'Colaborador ya registrado' });
        }

        const newColaborador = new Colaborador({ ...req.body, date: [], hour: '', service: '', listHd: [], state: true });

        await db.checkConnection();

        await newColaborador.save();

        await db.disconnect();

        res.status(200).json({ newDoc: newColaborador });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con CinCout, no se puedo registrar'
        })
    }
}
