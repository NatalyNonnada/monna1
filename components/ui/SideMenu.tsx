'use client';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Drawer, Box, ListItem, List, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { UiContext } from '../../context';
import PersonIcon from '@mui/icons-material/Person';
import ContactsIcon from '@mui/icons-material/Contacts';
import KingBedIcon from '@mui/icons-material/KingBed';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useUi } from '../../hooks';

export const SideMenu = () => {

    const { asPath, push } = useRouter();
    const { isSideMenu, sideMenu } = useUi();

    const navigateTo = (url: string) => {
        sideMenu();
        // push(`${url}`)
    }

    return (
        <Drawer
            open={isSideMenu}
            anchor='right'
            onClose={sideMenu}
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 2 }}>
                <List>
                    <ListItem
                        className='cursor_item'
                    >
                        <ListItemIcon >
                            <Avatar src='/images/hotel-san-martin.png' />
                        </ListItemIcon>
                        <ListItemText primary='Hotel San Martín' />
                    </ListItem>
                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/')}
                    >
                        <ListItemIcon color='' >
                            <HomeIcon color={asPath === '/' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Inicio' />
                    </ListItem>
                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/nosotros')}
                    >
                        <ListItemIcon>
                            <PersonIcon color={asPath === '/nosotros' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Nosotros' />
                    </ListItem>

                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/contacto')}
                    >
                        <ListItemIcon >
                            <ContactsIcon color={asPath === '/contacto' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Contacto' />
                    </ListItem>

                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/reservacion')}
                    >
                        <ListItemIcon >
                            <PanToolAltIcon color={asPath === '/reservacion' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Reservar' />
                    </ListItem>
                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/habitaciones')}
                    >
                        <ListItemIcon >
                            <KingBedIcon color={asPath === '/habitaciones' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Habitaciones' />
                    </ListItem>
                    <ListItem
                        className='cursor_item'
                        onClick={() => navigateTo('/auditorio')}
                    >
                        <ListItemIcon >
                            <AccessibilityNewIcon color={asPath === '/auditorio' ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText primary='Auditorio' />
                    </ListItem>
                </List>
            </Box>
        </Drawer >
    )
}
