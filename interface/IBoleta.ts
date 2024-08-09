interface Items {
    servicio: string;
    quanty: number;
    price: number;
    subttota: number;
}

export interface IBoleta {
    idReserva: string;
    tipodoc: string;
    fecha: string;
    clienete: string;
    ventas: Items[];
    subttota: number
    descuento: number;
    total: number;
}