import { Editor } from "@tinymce/tinymce-react";
import React from "react";

interface EditorCustomProps {
  initialValue?: string;
  onEditorChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  disabled?: boolean;
}

const EditorCustom: React.FC<EditorCustomProps> = ({
  initialValue = "",
  onEditorChange,
  placeholder = "Nhập nội dung...",
  height = 300,
  minHeight = 200,
  maxHeight = 600,
  disabled = false,
}) => {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      initialValue={initialValue}
      init={{
        height,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
          "autoresize",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        placeholder,
        branding: false,
        elementpath: false,
        resize: true,
        statusbar: false,
        readonly: disabled,
        autoresize_bottom_margin: 50,
        min_height: minHeight,
        max_height: maxHeight,
      }}
      onEditorChange={onEditorChange}
      disabled={disabled}
    />
  );
};

export default EditorCustom;
