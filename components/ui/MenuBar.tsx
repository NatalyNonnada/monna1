"use client";
import React from "react";
import { type Editor } from "@tiptap/react";
import { AppBar, Toolbar, IconButton, ButtonGroup } from '@mui/material';
import { FormatBold, FormatItalic, FormatStrikethrough, FormatListBulleted, FormatListNumbered, HorizontalRule } from '@mui/icons-material';

type Props = {
    editor: Editor | null;
};

const MenuBar = ({ editor }: Props) => {
    if (!editor) {
        return null;
    }
    return (
        <AppBar position="static" color="default">
            <Toolbar style={{ justifyContent: 'center', marginTop: '15px' }}>
                <ButtonGroup variant="contained">
                    <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                        <FormatBold />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                        <FormatItalic />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleStrike().run()} color={editor.isActive('strike') ? 'primary' : 'default'}>
                        <FormatStrikethrough />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>
                        <FormatListBulleted />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>
                        <FormatListNumbered />
                    </IconButton>
                    <IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <HorizontalRule />
                    </IconButton>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
};

export default MenuBar;