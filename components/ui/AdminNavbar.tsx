'use client';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { listPages } from '../../utils';

export const AdminNavbar = () => {

    const { push } = useRouter();


    const accept = async () => {
        signOut();
    }

    const onExitToApp = async () => {
        Swal.fire({
            title: "Estas seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí"
        }).then(async (result) => {
            if (result.isConfirmed) {
                accept()
            }
        });
    }

    const handleHref = (path: string) => {
        push(`${path}`);
    }

    return (
        <AppBar color='default'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        onClick={() => handleHref('/nonna')}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            cursor: 'pointer',
                            textDecoration: 'none',
                        }}
                    >
                        Monna
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/nonna"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        NONNA
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {listPages.navbarp.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleHref(page.ruta)}
                                sx={{ my: 2, display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Salir">
                            <IconButton
                                onClick={onExitToApp}
                                sx={{ p: 0 }}
                            >
                                <ExitToAppIcon sx={{ fontSize: '25px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
