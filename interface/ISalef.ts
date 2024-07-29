interface Items {
    _id?: string;
    cola: string;
    fecha: string;
    hora: string;
    codigo: string;
    celular: string;
    servicio: string;
    total: number;
}

export interface ISalef {

    servicios: Items[];

    createdAt?: string;
    updatedAt?: string;
}
