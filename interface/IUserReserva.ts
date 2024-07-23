import { IShoppingAddress } from './ShoppingAddress';

export interface IUserReserva {
    _id?: string;
    idServicio?: string;
    shoppingAddress: IShoppingAddress;
    servicio: string;
    hora: string;
    total: number;
    fecha: string;
    estado: boolean;
}