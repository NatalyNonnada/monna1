import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Iservicio } from '../../../interface';
import { Servicio } from '../../../model';
import { isValidObjectId } from 'mongoose';
import { Categ } from './colaborador/servicios';

function isValidCateg(value: any): value is Categ {
    return ['Acrílicas', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'].includes(value);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getServicio(req, res);

        case 'PUT':
            return updateServicio(req, res);

        case 'POST':
            return createServicio(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getServicio = async (req: NextApiRequest, res: NextApiResponse) => {


    try {
        await db.checkConnection();

        const Servicios = await Servicio.find().lean();

        res.status(200).json(Servicios);

    } catch (error) {

        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar los servicios'
        })
    }

}

const updateServicio = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        let { _id, title, price, reser, description, category, estado } = { ...req.body } as Iservicio;

        if (!isValidObjectId(_id)) {
            return res.status(400).json({ message: 'El servicio no es valido' });
        }

        await db.checkConnection();

        const dbServicio = await Servicio.findById({ _id });


        if (!dbServicio) {
            return res.status(400).json({ message: 'No existe el servicio' });
        }

        if (!isValidCateg(category)) {
            return res.status(400).json({ message: 'Categoria no valida' });
        }

        await db.checkConnection();

        dbServicio.title = title;
        dbServicio.price = price;
        dbServicio.description = description;
        dbServicio.category = category;
        dbServicio.estado = estado;

        dbServicio.save();

        res.status(200).json(dbServicio);

    } catch (error) {
        res.status(400).json({
            message: 'contacte con CinCout. No se pudo actualizar el servicio'
        })
    }
}

const createServicio = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { title, category } = req.body as Iservicio;

        await db.connect();

        const dbServicio = await Servicio.findOne({ title });

        if (dbServicio) {
            return res.status(400).json({ message: 'Servicio ya registrado' });
        }

        if (!isValidCateg(category)) {
            return res.status(400).json({ message: 'Categoria no valida' });
        }

        const newServicio = new Servicio({ ...req.body, estado: true });

        await newServicio.save();

        res.status(200).json({ newDoc: newServicio });

    } catch (error) {
        res.status(400).json({
            message: 'contacte con CinCout, no se puedo registrar el servicio'
        })
    }
}