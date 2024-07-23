import { Box, Button } from '@mui/material';
import { IPages } from '../../interface/IPages';

interface Props {
    handleOption: (opt: string) => void;
    selectOpt: string;
    categorias: IPages[];
}

export const ItemListResp = ({ handleOption, selectOpt, categorias }: Props) => {
    return (
        <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none', marginBottom: '15px' } }}>
            <div className='eXeTmM' >
                <div className='eguOPT'>
                    <Button
                        className={`${selectOpt === 'Todos' ? 'selectcolor' : ''}`}
                        onClick={() => handleOption('Todos')}
                    >
                        Todos
                    </Button>
                </div>
                {
                    categorias.map(data => (
                        <div className='eguOPT' key={data.name}>
                            <Button
                                className={`${selectOpt === data.name ? 'selectcolor' : ''}`}
                                onClick={() => handleOption(data.name)}
                            >
                                {data.name}
                            </Button>
                        </div>
                    ))
                }
            </div>
        </Box>
    )
}
