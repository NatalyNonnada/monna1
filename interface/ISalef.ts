interface Items {
    _id?: string;
    cola: string;

    hora: string,
    codigo: string,

    servicio: string;
    tipagou: string;
    nrpagou: Number;
    topagou: number;

    tipagod: string;
    nrpagod: Number;
    topagod: number;
}

export interface ISalef {
    colaboradora: string;
    fecha: string;
    celular: string;
    total: number;

    servicios: Items[];

    createdAt?: string;
    updatedAt?: string;
}
