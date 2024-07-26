import axios from 'axios';
import { tesloApi } from '../api';
import { IReserva, Iservicio } from '../interface';
import { errorAlert } from '../alerts';
import { useRouter } from 'next/router';

interface controlErr { message: '' }

interface datar {
    id: string;
    nufinal: number;
    cafinal: number;
    finPago: string;
}

export const useReserva = () => {

    const { reload } = useRouter();

    const getReservas = async (): Promise<{ hasError: boolean, listData: IReserva[] }> => {
        try {

            const { data } = await tesloApi({
                url: '/nonna/reserva',
                method: 'GET'
            });

            const listData = data as IReserva[];

            return { hasError: false, listData }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: true, listData: [] }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: true, listData: [] }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: true, listData: [] }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: true, listData: [] }
            }
        }
    }

    const confiReserva = async (upda: datar): Promise<{ hasError: boolean }> => {
        try {

            await tesloApi({
                url: '/nonna/reserva/confirmar',
                method: 'PUT',
                data: upda
            });

            reload();

            return { hasError: true }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: false }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: false }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: false }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: false }
            }
        }
    }

    const getAdicionales = async (): Promise<{ hasError: boolean, adicionales: Iservicio[] }> => {
        try {

            const { data } = await tesloApi({
                url: '/nonna/seradicionales',
                method: 'GET'
            });

            const adicionales = data as Iservicio[];

            return { hasError: false, adicionales }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: true, adicionales: [] }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: true, adicionales: [] }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: true, adicionales: [] }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: true, adicionales: [] }
            }
        }
    }

    return {
        getReservas,
        confiReserva,
        getAdicionales
    }
}
