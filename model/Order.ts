import mongoose, { Schema, model, Model } from 'mongoose';
import { IShoppingAddress } from '../interface';

interface IOrder extends Document {
    _id?: string;
    selectedDate: string;
    date: string;
    hour: string;
    total: number;
    Servicio: string;
    shippingAddress: IShoppingAddress;
    createdAt?: string;
    updatedAt?: string;
}

const orderSchema = new Schema({
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },

    selectedDate: { type: String, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    total: { type: Number, required: true },
    Servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
}, {
    timestamps: true,
})

const Order: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

export default Order;