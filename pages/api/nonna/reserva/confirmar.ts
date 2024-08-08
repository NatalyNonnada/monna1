import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { Colaborador, Reserva } from '../../../../model';
import { isValidObjectId } from 'mongoose';
import { ISalef } from '../../../../interface';


interface datar {
    id: string;
    nufinal: number;
    cafinal: number;
    finPago: string;
}

interface ListHdItem {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {

        case 'PUT':
            return confirmReserva(req, res);

        case 'POST':
            return finReserva(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const confirmReserva = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { id } = req.body as datar;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Reserva no valida' });
        }

        await db.checkConnection();

        const dbReserva = await Reserva.findById({ _id: id });

        if (!dbReserva) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la reserva' });
        }

        dbReserva.isPaid = true;
        dbReserva.nufinal = dbReserva.nureserva;
        dbReserva.cafinal = dbReserva.total;
        dbReserva.finPago = dbReserva.iniPago;

        await db.checkConnection();

        await dbReserva.save();

        await db.disconnect();

        res.status(200).json(dbReserva);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con CinCout. No ser pudo confirmar la reserva'
        })
    }
}

const finReserva = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { servicios, idReserva } = req.body as ISalef;

        if (servicios.length <= 0) {
            return res.status(400).json({ message: 'Faltan servicios' });
        }


        await db.connect();

        await Promise.all(servicios.map(async da => {
            if (da.codigo !== '-') {
                const cod = `${da.codigo}${da.hora}`.replace(/\s+/g, '');

                const cola = await Colaborador.findById(da.cola);

                if (cola) {
                    const newHd = cola.listHd.filter(p => !(p.fecha.toString() === da.codigo && p.hora.toString() === da.hora.toString()));
                    const newDate = cola.date.filter(p => p !== cod);

                    cola.listHd = newHd;
                    cola.date = newDate;

                    await cola.save();
                    await Reserva.deleteOne({ _id: da._id }); // Asegúrate de que idReserva esté definido
                }
            }
        }));

        await db.disconnect();

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con el CinCout, no se puedo finalizar la reserva'
        })
    }
}
