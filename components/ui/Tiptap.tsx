"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Container, Typography } from "@mui/material";
import MenuBar from "./MenuBar";

interface Props {
  onChange: any;
  initialContent?: string;
}

const jsonString = `{
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": " "
          }
        ]
      }
    ]
  }`;

const Tiptap = ({ onChange, initialContent = jsonString }: Props) => {

  const parsedContent = JSON.parse(initialContent);

  const handleChange = (newContent: any) => {
    onChange(newContent);
  };

  const editor: any = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "text-mult",
      }
    },
    content: parsedContent,
    onUpdate: ({ editor }) => {
      handleChange(editor.getJSON())
    }
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h1' component='h1' textAlign='center'>
        Información detallada
      </Typography>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Container>
  );
};

export default Tiptap;