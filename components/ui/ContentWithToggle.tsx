import { FC, useState } from 'react';
import { Button } from '@mui/material';
import { RenderContent } from './RenderContent';

interface ContentWithToggleProps {
    content: any;
    initialLength: number;
}

export const ContentWithToggle: FC<ContentWithToggleProps> = ({ content, initialLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    const getTextContent = (content: any): string => {
        let text = '';
        const extractText = (node: any) => {
            if (node.type === 'text') {
                text += node.text;
            } else if (node.content) {
                node.content.forEach(extractText);
            }
        };
        content.content.forEach(extractText);
        return text;
    };

    const textContent = getTextContent(content);
    const displayedText = isExpanded ? textContent : textContent.substring(0, initialLength) + '...';

    return (
        <>
            <div>{isExpanded ? <RenderContent content={content} /> : <p>{displayedText}</p>}</div>
            <Button onClick={toggleText} size="small">{isExpanded ? 'Mostrar menos' : 'Más informacion'}</Button>
        </>
    );
};
