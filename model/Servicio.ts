import mongoose, { Schema, Document, model } from 'mongoose';
import { Model } from 'mongoose';

interface Iservicio extends Document {
    _id: string;
    title: string;
    price: number;
    reser: number;
    description: string;
    category: string;
    estado: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const servicioSchema = new Schema({
    title: { type: String, required: true, default: '', unique: true },
    price: { type: Number, required: true },
    reser: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: '' },
    category: {
        type: String,
        enum: {
            values: ['Acrílicas', 'Promo del mes', 'Manicure', 'Pedicure', 'Cejas', 'Pestañas', 'Adicionales'],
            message: '{VALUE} no es un categoria válida'
        }
    },
    estado: { type: Boolean, required: true, default: false }
}, {
    timestamps: true,
})

servicioSchema.index({ title: 'text' });

const Servicio: Model<Iservicio> = mongoose.models.Servicio || model('Servicio', servicioSchema);

export default Servicio;