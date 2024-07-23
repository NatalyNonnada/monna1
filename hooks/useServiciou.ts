import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { CartContext, NonnaContext } from '../context';
import { tesloApi } from '../api';
import { IHour, Iservicio, IUserReserva } from '../interface';
import { errorAlert } from '../alerts';

interface controlErr { message: '' }

export const useServiciou = () => {

    const { listService, isLoaded, setService, setLoading } = useContext(NonnaContext);
    const [listaData, setListaData] = useState<IHour[]>([]);
    const { cart, selectedDate } = useContext(CartContext);
    const router = useRouter();

    const getServicios = async () => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/servicios',
                method: 'GET'
            });

            const listServicio = data as Iservicio[];

            setService(listServicio, 'list');
            setLoading(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setService([], 'list');
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setService([], 'list');
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setService([], 'list');
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setService([], 'list');
            }
        }
    }

    const getColaHours = async () => {
        try {

            if (cart === undefined) {
                return;
            }

            setLoading(true);

            const { data } = await tesloApi({
                url: `/colaboradores/?categoria=${cart?.category}&selectedDate=${selectedDate}`,
                method: 'GET'
            });

            setListaData(data as IHour[]);
            setLoading(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setService([], 'list');
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setService([], 'list');
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setService([], 'list');
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setService([], 'list');
            }
        }
    }

    const getOderExis = async (id: string): Promise<{ hasError: boolean, data: IUserReserva | undefined }> => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: `/orders/?id=${id}`,
                method: 'GET'
            });

            return { hasError: false, data: data as IUserReserva }

        } catch (error) {
            router.replace('/');
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    return { hasError: false, data: undefined }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    return { hasError: false, data: undefined }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    return { hasError: false, data: undefined }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                return { hasError: false, data: undefined }
            }
        }
    }

    return {
        getServicios,
        getColaHours,
        getOderExis,
        listService,
        isLoaded,
        listaData
    }
}
