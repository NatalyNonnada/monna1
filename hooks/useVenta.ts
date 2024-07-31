import axios from 'axios';
import { tesloApi } from '../api';
import { errorAlert } from '../alerts';
import { ISalef } from '../interface';
import { useRouter } from 'next/router';

interface controlErr { message: '' }


export const useVenta = () => {

    const { replace } = useRouter();

    const saveVenta = async (venta: ISalef): Promise<{ hasError: boolean }> => {
        try {

            await tesloApi({
                url: 'nonna/reserva/confirmar',
                method: 'POST',
                data: venta
            });

            setTimeout(() => {
                replace('/nonna/reservas');
            }, 900);

            return { hasError: true }


        } catch (error) {

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    errorAlert(message);
                    return { hasError: true }
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    return { hasError: true }
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    return { hasError: true }
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                return { hasError: true }
            }
        }
    }

    return {
        saveVenta
    }
}
