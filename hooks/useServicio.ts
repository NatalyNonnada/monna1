import { useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { NonnaContext } from '../context';
import { tesloApi } from '../api';
import { Iservicio } from '../interface';
import { errorAlert, successAlert } from '../alerts';

interface controlErr {
    message: '';
}

interface CretPagin {
    newDoc: Iservicio;
}

export const useServicio = () => {

    const { listService, isLoaded, setService, setLoading } = useContext(NonnaContext);
    const router = useRouter();


    const getServicios = async () => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/nonna/servicio',
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

    const createServicio = async (form: Iservicio) => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/nonna/servicio',
                method: 'POST',
                data: form
            });

            const { newDoc } = data as CretPagin;

            setService(newDoc, 'new');

            setTimeout(() => {
                setLoading(false);
                successAlert(`${newDoc.title} registrado`);
                router.push('/nonna/servicios');
            }, 900);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
            }
        }
    }

    const updateServicio = async (form: Iservicio): Promise<{ hasError: boolean }> => {
        try {

            setLoading(true);

            await tesloApi({
                url: '/nonna/servicio',
                method: 'PUT',
                data: form
            });

            router.reload();

            return { hasError: false }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    return { hasError: true }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    return { hasError: true }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    return { hasError: true }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                return { hasError: true }
            }
        }
    }

    return {
        getServicios,
        createServicio,
        setLoading,
        updateServicio,
        listService,
        isLoaded
    }
}
