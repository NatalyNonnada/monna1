import mongoose, { Schema, Document, model } from 'mongoose';
import { Model } from 'mongoose';

interface Items {
    servicio: string;
    colaboradora: string;
    tipagou: string;
    nrpagou: Number;
    topagou: number;

    tipagod: string;
    nrpagod: Number;
    topagod: number;
}

interface ISale extends Document {
    _id: string;

    colaboradora: string;
    fecha: string;
    celular: string;
    total: number;

    servicios: Items[];

    createdAt?: string;
    updatedAt?: string;
}

const ventaSchema = new Schema({
    colaboradora: { type: String, required: true, default: '' },
    fecha: { type: String, required: true, default: '' },
    celular: { type: String, required: true, default: '' },
    total: { type: Number, required: true, default: 0 },

    servicios: [{
        type: {

            servicio: String,
            colaboradora: String,
            tipagou: String,
            nrpagou: Number,
            topagou: Number,

            tipagod: String,
            nrpagod: Number,
            topagod: Number,
        }
    }],
}, {
    timestamps: true,
})

const Venta: Model<ISale> = mongoose.models.Venta || model('Venta', ventaSchema);

export default Venta;