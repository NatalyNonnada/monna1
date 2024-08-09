import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { Colaborador } from '../../../../model';
import { isValidObjectId } from 'mongoose';

export type Categ = 'Acrílicas' | 'Manicure' | 'Pedicure' | 'Cejas' | 'Pestañas' | 'Adicionales'

function isValidCateg(value: any): value is Categ {
    return ['Acrílicas', 'Promo del mes', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'].includes(value);
}

interface bodyre {
    id: string;
    lstservicios: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'POST':
            return updateServicios(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const updateServicios = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { id, lstservicios } = req.body as bodyre;

        if (!id) {
            return res.status(400).json({ message: 'El colaborador es requerida' });
        }

        if (!lstservicios) {
            return res.status(400).json({ message: 'Los servicios son requeridos' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'El colaborador no  es válido' });
        }

        if (!Array.isArray(lstservicios)) {
            return res.status(400).json({ message: 'Servicios no  es válidos' });
        }

        if (lstservicios.length <= 0) {
            return res.status(400).json({ message: 'Los servicios son requeridos' });
        }

        let valid = false;

        for (let data of lstservicios as string[]) {
            if (!isValidCateg(data)) {
                valid = true;
                break;
            }
        }

        if (valid) {
            return res.status(400).json({ message: 'Servicios no validos' });
        }

        await db.checkConnection();

        const dbOrder = await Colaborador.findById({ _id: id })

        if (!dbOrder) {

            return res.status(400).json({ message: 'No existe el colaborador' });
        }

        dbOrder.category = lstservicios;

        await dbOrder.save();

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        res.status(400).json({
            message: 'contacte a CinCout, no se pudo actualizar el servicio'
        })
    }

}
