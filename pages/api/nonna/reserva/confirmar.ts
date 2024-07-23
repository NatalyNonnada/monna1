import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { Colaborador, Reserva, Venta } from '../../../../model';
import { isValidObjectId } from 'mongoose';
import { ISalef } from '../../../../interface';

const esNumero = (valor: any): boolean => {
    if (typeof valor === 'number') {
        return !isNaN(valor);
    }

    const numero = Number(valor);
    return !isNaN(numero);
}

interface datar {
    id: string;
    nufinal: number;
    cafinal: number;
    finPago: string;
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

        const { id, nufinal, cafinal, finPago } = req.body as datar;

        if (!esNumero(cafinal)) {
            return res.status(400).json({ message: 'La cantidad ingresada no es valida' });
        }

        if (!esNumero(nufinal)) {
            return res.status(400).json({ message: 'El numero de operación no es valida' });
        }


        //validamos el colaborador ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Reserva no valida' });
        }

        if (finPago !== 'Efectivo' && parseInt(`${nufinal}`) === 0) {
            return res.status(400).json({ message: 'Número de reserva no válido' });
        }

        await db.connect();
        //verificamos si existe la reserva
        const dbReserva = await Reserva.findById({ _id: id });

        if (!dbReserva) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la reserva' });
        }

        const saldo = dbReserva.total - dbReserva.careserva;

        //verficamos si el monto final es correcto
        if (parseFloat(`${cafinal}`) !== parseFloat(`${saldo}`)) {
            await db.disconnect();
            return res.status(400).json({ message: `Para finalizar la reserva el monto tiene que ser igual a S/${saldo}` });
        }


        if (nufinal !== 0) {
            const dbReserva = await Reserva.findOne({ nureserva: nufinal });

            if (dbReserva !== null) {
                if (dbReserva.nureserva !== 0) {
                    await db.disconnect();
                    return res.status(400).json({ message: `El número de operación: ${nufinal} ya esta registrado` });
                }
            }
        }

        await dbReserva?.updateOne({
            isPaid: true,
            nufinal: nufinal,
            cafinal: cafinal,
            finPago: finPago,
        })

        await db.disconnect();

        res.status(200).json('newReserva');

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con el admin'
        })
    }
}

const finReserva = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { servicios } = req.body as ISalef;

        if (servicios.length <= 0) {
            return res.status(400).json({ message: 'Faltan servicios' });
        }

        await db.connect()

        servicios.map(async da => {
            const cod = `${da.codigo}${da.hora}`.replace(/\s+/g, '')
            const cola = await Colaborador.findById({ _id: da.cola }).select('_id fullnames date listHd');

            if (cola) {

                const newHd = cola.listHd.filter(p => !(p.fecha.toString() === da.codigo && p.hora.toString() === da.hora.toString()))
                const newDate = cola.date.filter(p => p !== cod);

                // Actualizar
                await cola.updateOne({
                    listHd: newHd,
                    date: newDate
                })

                //eliminar reserva
                await Reserva.deleteOne({ _id: da._id })
            }

        })

        const newVenta = new Venta({
            ...req.body
        })

        await newVenta.save();

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte con el admin'
        })
    }
}
