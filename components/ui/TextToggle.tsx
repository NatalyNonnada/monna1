import { Button } from '@mui/material';
import { FC, useState } from 'react';

type TextToggleProps = {
    text: string;
    initialLength: number;
};

export const TextToggle: FC<TextToggleProps> = ({ text, initialLength }) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    const displayedText = isExpanded ? text : text.substring(0, initialLength) + '...';

    return (
        <>
            <p>{displayedText}</p>
            <Button onClick={toggleText} size="small"> {isExpanded ? 'Mostrar menos' : 'Más informacion'}</Button>
        </>
    )
}
