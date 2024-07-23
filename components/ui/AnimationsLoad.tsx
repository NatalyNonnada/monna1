import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const AnimationsLoad = () => {
    return (
        <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </Box>
    )
}
