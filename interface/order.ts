import { IHour } from './IHour';
import { Iservicio } from './IServicio';
import { IShoppingAddress } from './ShoppingAddress';

export interface IOrder {
    _id?: string;
    selectedDate: string;
    date: string;
    hour?: string | IHour;
    total: number;
    Servicio: string | Iservicio;
    shippingAddress?: IShoppingAddress;
    createdAt?: string;
    updatedAt?: string;
}
