import { tesloApi } from '../api';

type Data = {
    numberOfReservas: number;
    paidOrders: number; // isPad true
    notPaidOrders: number;
    numberOfService: number;
    numberOfColabor: number;
}

export const useDashboard = () => {

    const getSummary = async () => {
        const { data } = await tesloApi({
            url: '/nonna/dashboard',
            method: 'GET'
        });

        return data as Data
    }

    return {
        getSummary
    }
}
