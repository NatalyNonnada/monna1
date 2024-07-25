import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../database';
import { IHour, Iservicio } from '../../../../interface';
import { Colaborador, Order, Servicio } from '../../../../model';
import { isValidObjectId } from 'mongoose';


interface Infechas {
    fecha: string,
    horas: string[],
    id: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            return getColaborador(req, res);
        case 'PUT':
            return updateHora(req, res);
        case 'DELETE':
            return deleteHora(req, res);
        case 'POST':
            return addHora(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}


const getColaborador = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'La categoría es requerida' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Orden no válida' });
        }

        await db.connect();

        const dbOrder = await Order.findOne({ _id: id }).populate('Servicio').lean();

        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la orden' });
        }

        const servicr: Iservicio = {
            ...dbOrder.Servicio as unknown as Iservicio
        };

        const dbServicio = await Servicio.findOne({ _id: servicr._id?.toString() });

        if (!dbServicio) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el Servicio' });
        }

        const colaboradores = await Colaborador.find({ category: dbServicio.category }).select('_id fullnames morshift aftshift date hour service listHd').lean();

        await db.disconnect();




        const colaboradoresFiltrados = colaboradores.map(colaborador => {

            const newLish = colaborador.listHd.filter(a => a.fecha === dbOrder.date);

            if (newLish.length > 0) {
                const set: Set<string> = new Set(colaborador.date);

                const newListMor: IHour[] = [];
                const newListAff: IHour[] = [];

                const newMorshift = colaborador.morshift.filter(p => p.hour !== dbOrder.hour);
                const newaftshift = colaborador.aftshift.filter(p => p.hour !== dbOrder.hour);

                newLish.forEach(da => {

                    const checkAndPushShift = (shiftList: IHour[], newShiftList: IHour[], shiftType: string) => {
                        const found: boolean = set.has(`${dbOrder.date}${da.hora}`.replace(/\s/g, ""));
                        if (!found) {
                            const findShift = shiftList.find(p => p.hour === dbOrder.hour);
                            if (findShift) {
                                console.log(`agrego ${shiftType}`);
                                newShiftList.push(findShift);
                            }
                        }
                    };

                    if (newMorshift.length > 0) {
                        checkAndPushShift(newMorshift, newListMor, '1');
                    }

                    if (newaftshift.length > 0) {
                        checkAndPushShift(newaftshift, newListAff, '2');
                    }
                });

                return {
                    _id: colaborador._id.toString(),
                    fullnames: colaborador.fullnames,
                    morshift: newListMor,
                    aftshift: newListAff
                };
            } else {
                return {
                    _id: colaborador._id.toString(),
                    fullnames: colaborador.fullnames,
                    morshift: colaborador.morshift,
                    aftshift: colaborador.aftshift
                };
            }
        });

        res.status(200).json(colaboradoresFiltrados.filter(a => a !== undefined));
        // res.status(200).json(colaboradores.filter(a => a !== undefined));

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudor cargar los horarios'
        })
    }

}

const updateHora = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { id, fecha, horas } = req.body as Infechas;

        if (!id) {
            return res.status(400).json({ message: 'El colaborador es requerida' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'El colaborador no  es válido' });
        }

        if (horas.length === 0) {
            console.log('Termino')
            return res.status(200).json({ message: 'ok' });
        }

        await db.checkConnection();

        const dbOrder = await Colaborador.findById({ _id: id })


        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la orden' });
        }

        const newHoras: string[] = [];

        horas.forEach(da => {
            const filter = dbOrder.listHd.some(p => p.hora.toString() === da.toString() && p.fecha.toString() === fecha.toString());
            if (!filter) {
                newHoras.push(da);
            }
        })

        const newDates = dbOrder.date;

        newHoras.forEach(h => {
            const newCode = `${fecha}${h}`.replace(/\s+/g, '')
            newDates.push(newCode);
        })

        const newLisths = dbOrder.listHd;

        newHoras.forEach(lh => {
            const newListh = {
                fecha,
                hora: lh,
                servicio: 'Bloqueado'
            }

            newLisths.push(newListh)

        });


        await db.checkConnection();

        await dbOrder.updateOne({
            date: newDates,
            listHd: newLisths,
        })

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se puedo actualizar la hora'
        })
    }

}

const deleteHora = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { id, idh } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'El colaborador es requerida' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'El colaborador no  es válido' });
        }

        if (!idh) {
            return res.status(400).json({ message: 'La hora no es valida' });
        }

        if (!isValidObjectId(idh)) {
            return res.status(400).json({ message: 'La hora no es valida' });
        }

        await db.connect();

        const dbOrder = await Colaborador.findById({ _id: id })

        if (!dbOrder) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe la orden' });
        }

        const filter = dbOrder.listHd.filter(p => p._id?.toString() !== idh);
        const fillcode = dbOrder.listHd.find(p => p._id?.toString() !== idh);

        const newCode = `${fillcode?.fecha}${fillcode?.hora}`.replace(/\s+/g, '');

        const newDates = dbOrder.date.filter(p => p !== newCode);

        await dbOrder.updateOne({
            date: newDates,
            listHd: filter,
        })

        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudo eliminar la hora'
        })
    }

}

const addHora = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { id, hora } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'El colaborador es requerida' });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'El colaborador no  es válido' });
        }

        await db.connect();

        const existeHour = await Colaborador.findOne({
            _id: id,
            $or: [
                { 'morshift.hour': hora },
                { 'aftshift.hour': hora }
            ]
        })

        if (existeHour) {
            await db.disconnect();
            return res.status(400).json({ message: 'Hora ya registrada' });
        }

        const simb = `${hora}`.includes('pm')
        const cola = await Colaborador.findById({ _id: id });

        if (simb) {
            const newAff = cola?.aftshift;
            newAff?.push({ hour: hora, estate: false })
            await cola?.updateOne({ aftshift: newAff })
            await db.disconnect();
            return res.status(200).json({ message: 'ok' });
        }

        const newMor = cola?.morshift;
        newMor?.push({ hour: hora, estate: false })
        await cola?.updateOne({ morshift: newMor })
        await db.disconnect();
        res.status(200).json({ message: 'ok' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({
            message: 'contacte a CinCout, no se pudo agregar la hora'
        })
    }

}
