import { IColaborador } from './IColaborador';
import { IHour } from './IHour';
import { IShoppingAddress } from './ShoppingAddress';

export interface IReserva {
    _id?: string;

    colaborador?: IColaborador | string;
    shoppingAddress?: IShoppingAddress;
    idServicio?: string;
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
