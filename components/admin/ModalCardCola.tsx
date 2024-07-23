import { Box, Divider, Modal, Typography } from '@mui/material';
import { styleCard } from './styleCard';

interface hors {
    fecha: string;
    hora: string;
    servicio: string;
    _id?: string;
}

interface Props {
    open: boolean;
    listHd: hors[];
    handleClose: () => void;
}

export const ModalCardCola = ({ open, listHd, handleClose }: Props) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...styleCard, width: 400, display: 'flex', flexDirection: 'column' }}>
                {
                    listHd.map(hd => (
                        <div key={hd?._id}>
                            <Typography>Servicio: <strong>{hd.servicio}</strong></Typography>
                            <Typography>Fecha y hora: <strong>{hd.fecha} {hd.hora}</strong></Typography>
                            <Divider sx={{ my: 1 }} />
                        </div>
                    ))
                }
            </Box>
        </Modal>
    )
}
