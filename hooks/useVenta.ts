import axios from 'axios';
import { tesloApi } from '../api';
import { errorAlert } from '../alerts';
import { ISalef } from '../interface';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { SaleContext } from '../context';

interface controlErr { message: '' }

export const useVenta = () => {

    const { replace } = useRouter();

    const { setState } = useContext(SaleContext);

    const saveVenta = async (venta: ISalef) => {
        try {

            setState(true, 'lodingReserva');

            await tesloApi({
                url: 'nonna/reserva/confirmar',
                method: 'POST',
                data: venta
            });

            replace('/nonna/reservas');
            setState(false, 'lodingReserva');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const { message } = error.response.data as controlErr;
                    setState(false, 'lodingReserva');
                    errorAlert(message);
                } else if (error.request) {
                    errorAlert('La solicitud fue hecha pero no se recibió respuesta, contacte con CinCout');
                    setState(false, 'lodingReserva');
                } else {
                    errorAlert('Ocurrió un error al configurar la solicitud, contacte con CinCout');
                    setState(false, 'lodingReserva');
                }
            } else {
                errorAlert('Ocurrió un error, contacte con CinCout');
                setState(false, 'lodingReserva');
                return { hasError: true }
            }
        }
    }

    return {
        saveVenta
    }
}
