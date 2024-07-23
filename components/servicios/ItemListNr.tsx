import { Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { IPages } from '../../interface';

interface Props {
    handleOption: (opt: string) => void;
    selectOpt: string;
    categorias: IPages[];
}

export const ItemListNr = ({ handleOption, selectOpt, categorias }: Props) => {
    return (
        <List>
            <ListItem
                className={`${selectOpt === "Todos" ? 'selectcolor' : 'baseColor'}`}
                disablePadding onClick={() => handleOption('Todos')}
            >
                <ListItemButton>
                    <ListItemText primary="Todos" />
                </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            {
                categorias.map(data => (
                    <div key={data.name}>
                        <ListItem
                            className={`${selectOpt === data.name ? 'selectcolor' : 'baseColor'}`}
                            disablePadding onClick={() => handleOption(data.name)}
                        >
                            <ListItemButton>
                                <ListItemText primary={data.name} />
                            </ListItemButton>
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                    </div>
                ))
            }
        </List>
    )
}
