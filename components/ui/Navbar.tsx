'use client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AdbIcon from '@mui/icons-material/Adb';

export const Navbar = () => {

    const { push } = useRouter();

    const handleHref = (path: string) => {
        push(`${path}`);
    }

    return (
        <AppBar style={{ color: 'black', backgroundColor: '#F6E8E7' }}>
            <Toolbar>
                <IconButton sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                    <Avatar alt="Monna" src="/icono-logo.png" />
                </IconButton>
                <Typography
                    variant="h6"
                    onClick={() => handleHref('/')}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        mr: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'inherit',
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}
                >
                    MONNA
                </Typography>
                <Box flex={1} />
                <Box flex={1} />
                <Box flex={1} />
                <IconButton sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                    <Avatar alt="Monna" src="/icono-logo.png" />
                </IconButton>
                <Typography
                    variant="h6"
                    onClick={() => handleHref('/')}
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    MONNA
                </Typography>
                <Box flex={1} />
                <Link href="https://www.instagram.com/monna.beautystudio?igsh=bTR5aGJ5aGViZW5i&utm_source=qr" target='_blank'>
                    <IconButton>
                        <Badge >
                            <InstagramIcon color='warning' />
                        </Badge>
                    </IconButton>
                </Link>
                <Link href="http://wa.me/51993759147?" target='_blank'>
                    <IconButton>
                        <Badge>
                            <WhatsAppIcon color='success' />
                        </Badge>
                    </IconButton>
                </Link>
            </Toolbar>
        </AppBar >
    )
}
