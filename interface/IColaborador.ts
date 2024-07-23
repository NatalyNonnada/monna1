import { IHour } from "./IHour";

export interface IColaborador {
    _id?: string;
    fullnames: string;
    morshift: IHour[];
    aftshift: IHour[];
    category: string[];
    state: boolean;
    date: string[];
    listHd: [{ fecha: string, hora: string, servicio: string, _id?: string }];
    createdAt?: string;
    updatedAt?: string;
} 