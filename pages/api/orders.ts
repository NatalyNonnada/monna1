import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { isValidObjectId } from 'mongoose';
import { db } from '../../database';
import { Colaborador, Order, Reserva, Servicio } from '../../model';
import { IHour, IOrder, Iservicio, IUserReserva } from '../../interface';
import { validations } from '../../utils';

const mindata = () => {
    const minDate = new Date;
    let options = { timeZone: 'America/Lima' };
    let eastCoastTime = minDate.toLocaleDateString('es-PE', options).split("/").reverse().join("-");
    return new Date(`${eastCoastTime}`);
}

function esFinDeSemana(fechaIngresada: string): boolean {
    const fechaIngresadaDate = new Date(fechaIngresada);
    const diaSemana = fechaIngresadaDate.getDay();

    return diaSemana === 0;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'POST':
            return postOrder(req, res);

        case 'GET':
            return getOder(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const postOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { Servicio: ids, hour: da, selectedDate, date, total, shippingAddress } = req.body as IOrder;

        if (!ids) {
            return res.status(400).json({ message: 'El servicio es requerido' });
        }

        if (!da) {
            return res.status(400).json({ message: 'El horario es requerido' });
        }

        const { _id, hour } = da as IHour;

        if (!_id) {
            return res.status(400).json({ message: 'El horario es requerido' });
        }

        if (!hour) {
            return res.status(400).json({ message: 'El horario es requerido' });
        }

        if (!selectedDate) {
            return res.status(400).json({ message: 'La fecha es requerida' });
        }

        if (isNaN(new Date(selectedDate).getTime())) {
            return res.status(400).json({ message: 'Fecha no valida' });
        }

        const fechaSelect = new Date(selectedDate);

        const fechaLimite = mindata();
        fechaLimite.setDate(mindata().getDate() + 21);

        if (esFinDeSemana(selectedDate)) {
            await db.disconnect();
            return res.status(400).json({ message: 'No estamos disponibles para estas fechas intenta con otras' });
        }

        if (mindata() >= fechaSelect || fechaLimite <= fechaSelect) {
            await db.disconnect();
            return res.status(400).json({ message: 'No estamos disponibles para estas fechas intenta con otras' });
        }

        // validamos el servicio ID
        if (!isValidObjectId(ids)) {
            return res.status(400).json({ message: 'Servicio no válido' });
        }

        await db.connect();

        const dbServicio = await Servicio.findOne({ _id: ids, estado: true });

        if (!dbServicio) {
            await db.disconnect();
            return res.status(400).json({ message: 'El servicio fue dado de baja' });
        }

        // validamos el ID de la hora
        if (!isValidObjectId(_id)) {
            await db.disconnect();
            return res.status(400).json({ message: 'Hora seleccionada no válida' });
        }

        if (validations.ValidAddress(shippingAddress)) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ocurrio un error, disculpa las molestias' });
        } else if (validations.ValidOrder({ date, selectedDate: new Date(selectedDate), total, Servicio: ids as string })) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ocurrio un error, disculpa las molestias' });
        } else if (validations.ValidHour(da as IHour)) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ocurrio un error, disculpa las molestias' });
        }

        const existeHour = await Colaborador.findOne({
            category: dbServicio.category,
            state: true,
            $or: [
                { 'morshift._id': _id },
                { 'aftshift._id': _id }
            ]
        }).select('_id morshift aftshift date hour category').lean();

        if (!existeHour) {
            await db.disconnect();
            return res.status(400).json({ message: 'Hora no valida' });
        }

        const hourMor = existeHour.morshift.find(obj => obj._id?.toString() === _id);
        const hourAft = existeHour.aftshift.find(obj => obj._id?.toString() === _id);

        const codigo = `${format(fechaSelect, 'EEEE d MMMM yyy', { locale: es })} ${hourMor?.hour || hourAft?.hour}`.replace(/\s/g, "");

        if (existeHour.date.find(a => a === codigo)) {
            await db.disconnect();
            return res.status(400).json({ message: 'La hora ya fue reservada, intente con otra hora' });
        }

        const newOrder = new Order({
            ...req.body,
            total: dbServicio.price,
            hour: hourMor?.hour || hourAft?.hour,
            Servicio: ids
        });

        await newOrder.save();

        await db.disconnect();

        return res.status(201).json(newOrder._id);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a monna, no se pudo registrar la orden'
        })
    }
}

const getOder = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { id } = req.query;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Reserva no valida' });
        }

        const existOr = await Order.findById({ _id: id }).populate('Servicio').lean();

        const servicr: Iservicio = {
            ...existOr?.Servicio as unknown as Iservicio
        };

        if (existOr) {

            await db.disconnect();

            const newOrder: IUserReserva = {
                _id: existOr._id.toString(),
                idServicio: existOr._id.toString(),
                shoppingAddress: { ...existOr.shippingAddress },
                servicio: servicr.title || '',
                hora: existOr.hour,
                fecha: existOr.date,
                estado: false,
                total: existOr.total,
            }

            return res.status(201).json(newOrder);
        }

        const existReser = await Reserva.findOne({ idServicio: id });

        if (existReser) {

            await db.disconnect();

            const newReser: IUserReserva = {
                _id: existReser._id.toString(),
                idServicio: existReser.idServicio,
                shoppingAddress: { ...existReser.shoppingAddress },
                servicio: existReser.servicio,
                hora: existReser.hora.hour,
                total: existReser.total,
                fecha: existReser.fecha,
                estado: existReser.isConfi
            }

            return res.status(201).json(newReser);
        }

        await db.disconnect();

        return res.status(400).json({
            message: 'La reserva fue eliminada'
        })

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a monna, no se pudor cargar su reserva'
        })
    }

}