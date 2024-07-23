import { useState } from 'react'
import axios from 'axios';
import { tesloApi } from '../api';
import { errorAlert, successAlert } from '../alerts';
import { IColaborador, IOrder } from '../interface';

interface controlErr { message: '' }

interface datar {
    colaborador: string;
    orden: string;
    nureserva: number;
    careserva: number;
    hora: string;
    iniPago: string;
}

export const useOrder = () => {

    const [isLoading, setLoading] = useState(false)
    const [orders, setOrders] = useState<IOrder[]>([])

    const getOrdenes = async () => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/nonna/orders',
                method: 'GET'
            });

            const listOrders = data as IOrder[];

            setOrders(listOrders);
            setLoading(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setOrders([]);
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setOrders([]);
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setOrders([]);
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setOrders([]);
            }
        }
    }

    const getCola = async (id: string, date: string, hour: string): Promise<{ hasError: boolean; message?: string, data?: IColaborador[]; }> => {
        try {

            const { data } = await tesloApi({
                url: `/nonna/colaborador/horios?id=${id}&date=${date}&hour=${hour}`,
                method: 'GET'
            });

            const colaboradores = data as IColaborador[];

            return { hasError: false, data: colaboradores };

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    return { hasError: true, message: message };
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    return { hasError: true, message: '' };
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    return { hasError: true, message: '' };
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                return { hasError: false, message: '' };
            }
        }
    }

    const deleteOrder = async (id: string): Promise<{ hasError: boolean; message: string }> => {
        try {

            await tesloApi.delete(`/nonna/orders/categoria/?id=${id}`);
            successAlert('Eliminado');
            return { hasError: false, message: '' }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: true, message: message }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: true, message: 'La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout' }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: true, message: 'Ocurrió un error al configurar la solicitud, contacte con CinCout' }

                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: true, message: 'Ocurrió un error, contacte con CinCout' }
            }
        }
    }

    const createReserva = async (reser: datar): Promise<{ hasError: boolean; message: string }> => {
        try {

            await tesloApi({
                url: '/nonna/reserva',
                method: 'POST',
                data: reser
            });

            successAlert('Orden confirmada');

            return { hasError: false, message: '' }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: true, message: message }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: true, message: 'La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout' }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: true, message: 'Ocurrió un error al configurar la solicitud, contacte con CinCout' }

                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: true, message: 'Ocurrió un error, contacte con CinCout' }
            }
        }
    }

    return {
        getOrdenes,
        getCola,
        deleteOrder,
        createReserva,
        isLoading,
        orders,
    }
}
