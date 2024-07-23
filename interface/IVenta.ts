export interface IVenta {
    _id?: string;
    colaboradora: string;
    cola: string;
    fecha: string;
    hora: string;
    codigo: string;
    celular: string;
    servicio: string;

    total: number;

    tipagou: string;
    nrpagou: number;
    topagou: number;

    tipagod: string;
    nrpagod: number;
    topagod: number;

    createdAt?: string;
    updatedAt?: string;
}
