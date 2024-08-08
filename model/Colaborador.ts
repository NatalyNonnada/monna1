import { IHour } from '../interface';
import mongoose, { Schema, Document, model } from 'mongoose';
import { Model } from 'mongoose';

interface ListHdItem {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}


interface IColaborador extends Document {
    _id: string;
    fullnames: string;
    morshift: IHour[];
    aftshift: IHour[];
    category: string[];
    state: boolean;
    date: string[];
    listHd: ListHdItem[];
    createdAt?: string;
    updatedAt?: string;
}

const colaboradorSchema = new Schema({
    fullnames: { type: String, required: true, default: '', unique: true },
    morshift: [{
        type: {
            hour: String,
            estate: Boolean,
        }
    }],
    aftshift: [{
        type: {
            hour: String,
            estate: Boolean,
        }
    }],
    category: [
        {
            type: String,
            enum: {
                values: ['Promo del mes', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'],
                message: '{VALUE} no es un categoria válida'
            }
        }
    ],
    state: { type: Boolean, required: true, default: false },
    date: [{ type: String }],
    listHd: [{
        type: {
            fecha: String,
            hora: String,
            servicio: String
        }
    }],
}, {
    timestamps: true,
})

colaboradorSchema.index({ fullnames: 'text' });

const Colaborador: Model<IColaborador> = mongoose.models.Colaborador || model('Colaborador', colaboradorSchema);

export default Colaborador;