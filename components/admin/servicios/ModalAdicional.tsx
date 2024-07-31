import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Modal, TextField, Typography } from '@mui/material';
import { priceBodyTemplate } from '../../../utils';
import { styleCardReserva } from '../styleCardReserva';
import { useState } from 'react';
import { ItemCounter } from '../../../components';

interface Item {
    _id?: string;
    cola: string;
    fecha: string;
    hora: string;
    codigo: string;
    celular: string;
    careserva: number,
    quanty: number;
    servicio: string;
    total: number;
}

interface Props {
    open: boolean;
    adicional: Item[];
    handleClose: () => void;
    addAdicional: (servicio: Item[]) => void;
}

export const ModalAdicional = ({ open, adicional, handleClose, addAdicional }: Props) => {

    const [newListArr, setNewListArr] = useState<Item[]>([]);
    const [searchText, setSearchText] = useState('');

    const onChangeSize = (size: Item) => {
        size.quanty = 1;

        if (newListArr.some(p => p._id === size._id)) {
            return setNewListArr([...newListArr.filter(s => s._id !== size._id)])
        }

        setNewListArr([...newListArr, size])
    }

    const updatedQuantity = (size: Item, newQuantityValue: number) => {
        size.quanty = newQuantityValue;
        setNewListArr(newListArr.map(product => {
            if (product._id !== size._id) return product;
            return size;
        }))
    }

    const handleCloseMo = () => {
        handleClose();
        setNewListArr([])
    }

    const handleAdd = () => {
        setNewListArr([])
        addAdicional(newListArr);
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const filteredListHd = adicional.filter(hd =>
        hd.servicio.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal
            open={open}
            onClose={handleCloseMo}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Card sx={{ ...styleCardReserva }}>
                <CardContent>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar..."
                        fullWidth
                        value={searchText}
                        onChange={handleSearchChange}
                        sx={{ marginBottom: 2 }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            maxHeight: '400px',
                        }}
                    >

                        {
                            filteredListHd.map(size => (
                                <div key={size._id}>
                                    <FormControlLabel
                                        control={<Checkbox checked={newListArr.some(p => p._id?.toString() === size._id?.toString())} />}
                                        label={`${size.servicio} - ${priceBodyTemplate({ price: `${size.total}` })}`}
                                        onChange={() => onChangeSize(size)}
                                    />
                                    {
                                        newListArr.some(p => p._id?.toString() === size._id?.toString()) && (
                                            <ItemCounter
                                                currentValue={size.quanty}
                                                updatedQuantity={(value) => updatedQuantity(size, value)}
                                                stock={10}
                                                acstokc={false}
                                            />
                                        )
                                    }
                                </div>
                            ))
                        }
                    </Box>
                    <br />
                    <Typography component='div' textAlign='center'>
                        <Button onClick={handleAdd} size='large' color='primary'>Agregar</Button>
                    </Typography>
                </CardContent>
            </Card>
        </Modal>
    )
}
