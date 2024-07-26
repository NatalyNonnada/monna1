
import { Card, CardContent, Checkbox, FormControlLabel, Modal, Typography } from '@mui/material';
import { styleCard } from '../styleCard';
import { Iservicio, IVenta } from '../../../interface';
import { useForm } from 'react-hook-form';
import { priceBodyTemplate } from '@/utils';

interface Props {
    open: boolean;
    adicional: Iservicio[];
    handleClose: () => void;
    addAdicional: (horas: Iservicio) => void;
}

interface newHor { id: string, hora: string }
const formdata: newHor = { id: '', hora: '' }


export const ModalAdicional = ({ open, adicional, handleClose, addAdicional }: Props) => {

    const ventasSelc: Iservicio[] = [];

    const onChangeSize = (size: Iservicio) => {
        const currentSizes = ventasSelc
        // if (currentSizes.includes(size)) {
        //   return setValue('horas', currentSizes.filter(s => s !== size), { shouldValidate: true });
        // }

        // setValue('horas', [...currentSizes, size], { shouldValidate: true });
        ventasSelc.push(size)

    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Card sx={{ ...styleCard }}>
                <CardContent>
                    {
                        adicional.map(size => (

                            <FormControlLabel
                                key={size._id}
                                control={<Checkbox checked={ventasSelc.includes(size)} />}
                                label={`${size.title} - ${priceBodyTemplate({ price: `${size.price}` })}`}
                                onChange={() => onChangeSize(size)}
                            />
                        ))
                    }

                </CardContent>
            </Card>
        </Modal>
    )
}
