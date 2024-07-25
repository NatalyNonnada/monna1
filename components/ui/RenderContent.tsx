import { FC } from 'react';

interface ContentProps {
    content: any;
}

export const RenderContent: FC<ContentProps> = ({ content }) => {

    const renderNode = (node: any, key: number) => {
        switch (node.type) {
            case 'paragraph':
                return <p key={key}>{node.content.map(renderText)}</p>;
            case 'bulletList':
                return <ul key={key}>{node.content.map(renderListItem)}</ul>;
            case 'orderedList':
                return <li key={key}>{node.content.map(renderNode)}</li>;
            case 'listItem':
                return <li key={key}>{node.content.map(renderNode)}</li>;
            case 'horizontalRule':
                return <li key={key}>{node.content.map(renderNode)}</li>;
            default:
                return null;
        }
    };

    const renderText = (textNode: any, key: number) => {
        if (textNode.type === 'text') {
            let text = textNode.text;
            if (textNode.marks) {
                return textNode.marks.reduce((acc: React.ReactNode, mark: any) => {
                    switch (mark.type) {
                        case 'bold':
                            text = `<strong>${text}</strong>`;
                            break;
                        case 'italic':
                            text = `<em>${text}</em>`;
                            break;
                        case 'strike':
                            text = `<s>${text}</s>`;
                            break;
                        default:
                            return acc;
                    }
                }, text);
            }
            return text;
        }
        return null;
    };

    const renderListItem = (listItemNode: any, key: number) => {
        return <li key={key}>{listItemNode.content.map(renderNode)}</li>;
    };

    if (!content || !content.content) {
        return null;
    }

    return <div>{content.content.map(renderNode)}</div>;
};
