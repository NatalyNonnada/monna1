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

        await db.connect();

        const reservas = await Reserva.find().populate('colaborador');

        await db.disconnect();

        res.status(200).json(reservas);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar los departametos'
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


        //validamos el colaborador ID
        if (!isValidObjectId(colaborador)) {
            return res.status(400).json({ message: 'Colaborador no válido' });
        }
        //validamos la orden ID
        if (!isValidObjectId(orden)) {
            return res.status(400).json({ message: 'Orden no válido' });
        }
        //validamos de la hora ID
        if (!isValidObjectId(hora)) {
            return res.status(400).json({ message: 'Hora no válida' });
        }

        if (iniPago !== 'Efectivo' && parseInt(`${nureserva}`) === 0) {
            return res.status(400).json({ message: 'Número de reserva no válido' });
        }

        //verificamos si existe la orden
        const dbOrden = await Order.findById({ _id: orden }).populate('Servicio').lean();

        if (!dbOrden) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la orden' });
        }

        const servicr: Iservicio = {
            ...dbOrden.Servicio as unknown as Iservicio
        };

        await db.connect();
        //verificamos si existe el servicio solicitado
        const dbServicio = await Servicio.findById({ _id: servicr._id?.toString() });
        if (!dbServicio) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el servicio' });
        }

        //verficamos si el monto de reserva es el correcto
        if (careserva < dbServicio.reser) {
            await db.disconnect();
            return res.status(400).json({ message: `Para confirmar la reserva el monto tiene que ser igual o mayor a S/${dbServicio.reser}` });
        }

        //verificamos si existe el colaborador solicitado
        const dbColaborador = await Colaborador.findById({ _id: colaborador });
        if (!dbColaborador) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el colaborador' });
        }

        //verificamos que el colaborador este disponible
        // para la fecha  y hora solicitada existe

        const existTma = dbColaborador.morshift.find(p => p._id?.toString() === hora.toString());
        const existTta = dbColaborador.aftshift.find(p => p._id?.toString() === hora.toString());

        if (existTma && existTta) {
            await db.disconnect();
            return res.status(400).json({ message: 'Hora no valida' });
        }

        const newCode = `${dbOrden.date}${existTma?.hour || existTta?.hour}`.replace(/\s+/g, '');

        const obDate = dbColaborador.date.find(a => a === newCode);

        if (obDate !== undefined) {
            await db.disconnect();
            return res.status(400).json({ message: 'El colaborador esta ocupada para la hora y fecha' });
        }

        //verficamos si el numero de operacion existe
        if (nureserva !== 0) {
            const dbReserva = await Reserva.findOne({ nureserva: nureserva });

            if (dbReserva !== null) {
                if (dbReserva.nureserva !== 0) {
                    await db.disconnect();
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

        //una ves registrado

        //Actualizamos colaborador


        //agregamos las fechas para el control del admin
        let newDates = dbColaborador.date;
        newDates.push(newCode)

        //agregamos las fechas para filtral las fechas y horas disponibles 
        //para los usuarios

        let newDateHo = dbColaborador.listHd;
        newDateHo.push({ fecha: `${dbOrden.date}`, hora: `${existTma?.hour || existTta?.hour}`, servicio: dbServicio.title })

        const cola = await Colaborador.findById({ _id: colaborador });

        await cola?.updateOne({
            date: newDates,
            listHd: newDateHo,
            hour: `${dbOrden.date} ${existTma?.hour || existTta?.hour}`
        })

        //Eliminamos la orden
        const orde = await Order.findById({ _id: orden });

        await orde?.deleteOne()

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
