import mongoose, { Schema, model, Model } from 'mongoose';
import { IColaborador, IHour, IShoppingAddress } from '../interface';

interface IReserva extends Document {
    _id?: string;

    colaborador: string | IColaborador;
    idServicio?: string;
    shoppingAddress: IShoppingAddress;
    servicio: string;
    category: string;

    hora: IHour;
    fecha: string;
    fechan: string;
    total: number;

    isConfi: boolean;
    nureserva: number;
    careserva: number;
    iniPago: string;

    isPaid: boolean;
    nufinal: number;
    cafinal: number;
    finPago: string;

    createdAt?: string;
    updatedAt?: string;
}

const reservaSchema = new Schema({

    colaborador: { type: Schema.Types.ObjectId, ref: 'Colaborador', required: true },
    idServicio: { type: String, required: true, default: '' },
    shoppingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    servicio: { type: String, required: true, default: '' },
    category: { type: String, required: true, default: '' },

    hora: {
        hour: { type: String, required: true },
        estate: { type: Boolean, required: true, default: false },
        _id: { type: Schema.Types.ObjectId, required: true }
    },

    fecha: { type: String, require: true, default: '' },
    fechan: { type: String, require: true, default: '' },
    total: { type: Number, required: true },

    isConfi: { type: Boolean, required: true, default: false },
    nureserva: { type: Number, default: 0 },
    careserva: { type: Number, default: 0 },
    iniPago: { type: String, require: true, default: '' },

    isPaid: { type: Boolean, required: true, default: false },
    nufinal: { type: Number, default: 0 },
    cafinal: { type: Number, default: 0 },
    finPago: { type: String, default: '' },
}, {
    timestamps: true,
})

reservaSchema.index({ fecha: 'text' });

const Reserva: Model<IReserva> = mongoose.models.Reserva || model('Reserva', reservaSchema);

export default Reserva;