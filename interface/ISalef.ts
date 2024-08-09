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

interface Itemsb {
    servicio: string;
    quanty: string;
    price: string;
    subttota: string;
}

export interface ISalef {
    servicios: Items[];
    idReserva: string;
    documen: string;
    fecha: string;
    clienete: string;
    ventas: Itemsb[];
    subttota: string
    descuento: string;
    total: string;

    createdAt?: string;
    updatedAt?: string;
}
