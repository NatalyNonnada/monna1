type cam = 'Soles' | 'Dolar'

interface props {
    cambio?: cam;
    price: string;
}

export const priceBodyTemplate = ({ cambio = 'Soles', price }: props) => {
    switch (cambio) {
        case 'Soles':
            return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseInt(price));

        case 'Dolar':
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseInt(price));

        default:
            return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseInt(price));
    }
};