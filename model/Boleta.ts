import mongoose, { Schema, Document, model } from 'mongoose';
import { Model } from 'mongoose';

interface Items {
    servicio: string;
    quanty: string;
    price: string;
    subttota: string;
}

interface IBoleta extends Document {
    documen: string;
    fecha: string;
    clienete: string;
    ventas: Items[];
    subttota: string
    descuento: string;
    total: string;
}

const boletaSchema = new Schema({
    documen: { type: String, required: true, default: '' },
    fecha: { type: String, required: true, default: '' },
    clienete: { type: String, required: true, default: '' },
    ventas: [{
        servicio: { type: String, required: true, default: '' },
        quanty: { type: String, required: true, default: '' },
        price: { type: String, required: true, default: '' },
        subttota: { type: String, required: true, default: '' },
    }],

    subttota: { type: String, required: true, default: '' },
    descuento: { type: String, required: true, default: '' },
    total: { type: String, required: true, default: '' },
}, {
    timestamps: true,
})

const Boleta: Model<IBoleta> = mongoose.models.Boleta || model('Boleta', boletaSchema);

export default Boleta;