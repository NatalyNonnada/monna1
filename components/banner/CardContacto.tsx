import { Box, Card, CardContent, Collapse, Link, List, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material';
import { styleCard } from '../admin/styleCard';
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

interface Props {
    open: boolean;
    handleClose: () => void;
}

export const CardContacto = ({ open, handleClose }: Props) => {

    const [opencl, setOpencl] = useState(true);

    const handleClick = () => {
        setOpencl(!opencl);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...styleCard, width: 400, display: 'flex', flexDirection: 'column' }}>
                <List>
                    <Card>
                        <CardContent>
                            <div className='info-card'>
                                <Link href="http://wa.me/51993759147?" target='_blank'>
                                    <div>
                                        <PlaceIcon style={{ fontSize: '20px' }} />
                                        <Typography className='info-card-text'>Jirón Dos de Mayo 217, Cajamarca, Peru</Typography>
                                    </div>
                                </Link>
                                <div>
                                    <PhoneIcon style={{ fontSize: '20px' }} />
                                    <Typography className='info-card-text'>993 759 147</Typography>
                                </div>
                                <Link href="http://wa.me/51993759147?" target='_blank'>
                                    <div>
                                        <WhatsAppIcon style={{ fontSize: '20px' }} />
                                        <Typography className='info-card-text'>Contáctanos por Whatsapp!</Typography>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <QueryBuilderIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ver horario" />
                        {opencl ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={opencl} timeout="auto" unmountOnExit>
                        <div className="schedule">
                            <div className="day">
                                <span className="name">Lunes</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Martes</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Miercoles</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Jueves</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Viernes</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Sábado</span>
                                <span className="hours">9:00 am a 1:00 pm / 3:00 pm</span>
                            </div>
                            <div className="day">
                                <span className="name">Domingo</span>
                                <span className="hours">Cerrado</span>
                            </div>
                        </div>
                    </Collapse>
                </List>
            </Box>
        </Modal >
    )
}
