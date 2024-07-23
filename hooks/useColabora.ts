import { useContext } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import { NonnaContext } from '../context';
import { tesloApi } from '../api';
import { IColaborador } from '../interface';
import { errorAlert, successAlert } from '../alerts';

interface controlErr {
    message: '';
}

interface CretPagin {
    newDoc: IColaborador;
}

interface nfechas {
    fecha: string,
    hora: string,
    id: string
}


interface nHoras {
    idh: string,
    id: string
}

interface bodyre {
    id: string;
    lstservicios: string[];
}

export const useColabora = () => {

    const { listContrib, isLoaded, setContrib, setLoading } = useContext(NonnaContext);
    const router = useRouter();


    const getColaboradores = async () => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/nonna/colaborador',
                method: 'GET'
            });

            const listColabo = data as IColaborador[];

            setContrib(listColabo, 'list');
            setLoading(false);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setContrib([], 'list');
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setContrib([], 'list');
            }
        }
    }

    const createColaborador = async (form: IColaborador) => {
        try {

            setLoading(true);

            const { data } = await tesloApi({
                url: '/nonna/colaborador',
                method: 'POST',
                data: form
            });

            const { newDoc } = data as CretPagin;

            setContrib(newDoc, 'new');

            setTimeout(() => {
                successAlert(`${newDoc.fullnames} registrado`);
                router.push('/nonna/colaboradores');
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

    const blocHora = async (horas: nfechas): Promise<{ hasError: boolean }> => {
        try {

            setLoading(true);

            await tesloApi({
                url: '/nonna/colaborador/horios',
                method: 'PUT',
                data: horas
            });

            router.reload()

            return { hasError: true }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: true }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: true }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: true }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setContrib([], 'list');
                return { hasError: true }
            }
        }
    }

    const deleteHora = async (horas: nHoras): Promise<{ hasError: boolean }> => {
        try {

            setLoading(true);

            await tesloApi({
                url: `/nonna/colaborador/horios/?id=${horas.id}&idh=${horas.idh}`,
                method: 'DELETE'
            });

            router.reload()

            return { hasError: true }

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setContrib([], 'list');
                return { hasError: false }
            }
        }
    }

    const addHora = async (horas: nHoras): Promise<{ hasError: boolean }> => {
        try {

            setLoading(true);

            await tesloApi({
                url: '/nonna/colaborador/horios',
                method: 'POST',
                data: { id: horas.id, hora: horas.idh }
            });

            router.reload();

            return { hasError: true }

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setContrib([], 'list');
                return { hasError: false }
            }
        }
    }

    const addServicios = async (value: bodyre): Promise<{ hasError: boolean }> => {
        try {

            await tesloApi({
                url: '/nonna/colaborador/servicios',
                method: 'POST',
                data: value
            });

            router.reload();

            return { hasError: true }

        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setLoading(false);
                    setContrib([], 'list');
                    return { hasError: false }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setLoading(false);
                setContrib([], 'list');
                return { hasError: false }
            }
        }
    }

    return {
        getColaboradores,
        createColaborador,
        blocHora,
        deleteHora,
        addHora,
        addServicios,
        listContrib,
        isLoaded
    }
}
