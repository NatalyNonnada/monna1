import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { Colaborador, Order, Reserva, Servicio } from '../../../../model';
import { isValidObjectId } from 'mongoose';
import { Iservicio } from '../../../../interface';

const esNumero = (valor: any): boolean => {
    if (typeof valor === 'number') {
        return !isNaN(valor);
    }

    const numero = Number(valor);
    return !isNaN(numero);
}

interface datar {
    colaborador: string;
    orden: string;
    nureserva: number;
    careserva: number;
    hora: string;
    iniPago: string;
}


export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getReservas(req, res);

        case 'POST':
            return createReserva(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getReservas = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        await db.checkConnection();

        const reservas = await Reserva.find().populate({
            path: 'colaborador',
            select: 'fullnames _id'
        }).select('_id colaborador shoppingAddress servicio hora fecha total careserva nureserva iniPago isPaid cafinal finPago nufinal');

        res.status(200).json(reservas);

    } catch (error) {
        res.status(400).json({
            message: 'contacte a CinCout, no se pudo cargar las reservas'
        })
    }

}

const createReserva = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { colaborador, orden, nureserva, careserva, hora, iniPago } = req.body as datar;

        if (!esNumero(careserva)) {
            return res.status(400).json({ message: 'La cantidad ingresada no es valida' });
        }

        if (!esNumero(nureserva)) {
            return res.status(400).json({ message: 'El numero de operación no es valida' });
        }

        if (!isValidObjectId(colaborador)) {
            return res.status(400).json({ message: 'Colaborador no válido' });
        }

        if (!isValidObjectId(orden)) {
            return res.status(400).json({ message: 'Orden no válido' });
        }

        if (!isValidObjectId(hora)) {
            return res.status(400).json({ message: 'Hora no válida' });
        }

        if (iniPago !== 'Efectivo' && parseInt(`${nureserva}`) === 0) {
            return res.status(400).json({ message: 'Número de reserva no válido' });
        }

        await db.checkConnection();

        const dbOrden = await Order.findById({ _id: orden }).populate('Servicio').lean();

        if (!dbOrden) {

            return res.status(400).json({ message: 'No existe la orden' });
        }

        const servicr: Iservicio = {
            ...dbOrden.Servicio as unknown as Iservicio
        };


        const dbServicio = await Servicio.findById({ _id: servicr._id?.toString() });

        if (!dbServicio) {

            return res.status(400).json({ message: 'No existe el servicio' });
        }

        if (careserva < dbServicio.reser) {

            return res.status(400).json({ message: `Para confirmar la reserva el monto tiene que ser igual o mayor a S/${dbServicio.reser}` });
        }

        const dbColaborador = await Colaborador.findById({ _id: colaborador });
        if (!dbColaborador) {

            return res.status(400).json({ message: 'No existe el colaborador' });
        }

        const existTma = dbColaborador.morshift.find(p => p._id?.toString() === hora.toString());
        const existTta = dbColaborador.aftshift.find(p => p._id?.toString() === hora.toString());

        if (existTma && existTta) {

            return res.status(400).json({ message: 'Hora no valida' });
        }

        const newCode = `${dbOrden.date}${existTma?.hour || existTta?.hour}`.replace(/\s+/g, '');

        const obDate = dbColaborador.date.find(a => a === newCode);

        if (obDate !== undefined) {

            return res.status(400).json({ message: 'El colaborador esta ocupada para la hora y fecha' });
        }

        if (nureserva !== 0) {
            const dbReserva = await Reserva.findOne({ nureserva: nureserva });

            if (dbReserva !== null) {
                if (dbReserva.nureserva !== 0) {

                    return res.status(400).json({ message: `El número de operación: ${nureserva} ya esta registrado` });
                }
            }
        }

        let controlPa = 0;
        let controlTip = '';
        let controlNum = 0;
        let controlPai = false;


        if (parseInt(`${careserva}`) === parseInt(`${dbServicio.price}`)) {
            controlPa = careserva;
            controlTip = iniPago
            controlNum = nureserva;
            controlPai = true;
        }

        const newReserva = new Reserva({
            ...req.body,
            colaborador: dbColaborador._id,
            idServicio: dbOrden._id?.toString(),
            shoppingAddress: dbOrden.shippingAddress,

            servicio: servicr.title,
            category: servicr.category,

            hora: { hour: existTma?.hour || existTta?.hour, _id: hora },
            fecha: dbOrden.date,
            fechan: dbOrden.selectedDate,
            total: dbServicio.price,

            isConfi: true,
            isPaid: controlPai,
            nufinal: controlNum,
            cafinal: controlPa,
            finPago: controlTip,
        })

        await newReserva.save();

        let newDates = dbColaborador.date;
        newDates.push(newCode)

        let newDateHo = dbColaborador.listHd;
        newDateHo.push({ fecha: `${dbOrden.date}`, hora: `${existTma?.hour || existTta?.hour}`, servicio: dbServicio.title })

        const cola = await Colaborador.findById({ _id: colaborador });

        if (cola) {
            cola.date = newDates;
            cola.listHd = newDateHo;
            await cola.save();
        }

        await Order.deleteOne({ _id: orden });

        res.status(200).json('newReserva');

    } catch (error) {
        res.status(400).json({
            message: 'contacte con CinCout. No ser puedo crear la reserva'
        })
    }
}
