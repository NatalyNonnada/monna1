import { Box, Divider, Modal, TextField, Typography } from '@mui/material';
import { styleCard } from './styleCard';
import { useState } from 'react';

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

    const [searchText, setSearchText] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const filteredListHd = listHd.filter(hd =>
        hd.servicio.toLowerCase().includes(searchText.toLowerCase()) ||
        hd.fecha.toLowerCase().includes(searchText.toLowerCase()) ||
        hd.hora.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box
                sx={{
                    ...styleCard,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    maxHeight: '400px',
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: 2 }}
                />
                {
                    filteredListHd.map(hd => (
                        <div key={hd?._id}>
                            <Typography>Servicio: <strong>{hd.servicio}</strong></Typography>
                            <Typography>Fecha y hora: <strong>{hd.fecha} {hd.hora}</strong></Typography>
                            <Divider sx={{ my: 1 }} />
                        </div>
                    ))
                }
            </Box>
        </Modal >
    )
}
