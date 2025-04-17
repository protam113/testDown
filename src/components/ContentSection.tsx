import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditorMenuBar from "./RichText/TextEditorMenuBar";
import React, { useEffect } from "react";
import { LuPen, LuPenOff } from "react-icons/lu";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import DragItem from "./RichText/DragHandle";

export default function ContentSection() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      DragItem,
      Image,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-400 pl-4 italic text-gray-600",
        },
      }),
      Strike,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder:
          "Write something … It’ll be shared with everyone else looking at this example.",
      }),
    ],
    content: "## Chào mừng bạn đến với RichText Demo!",
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] cursor-text rounded-md border p-5 ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ",
      },
    },
  });

  const [isEditable, setIsEditable] = React.useState(true);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  const handleSave = () => {
    if (!editor) {
      console.error("Editor chưa sẵn sàng!");
      return;
    }

    const markdownContent = editor.storage.markdown?.getMarkdown
      ? editor.storage.markdown.getMarkdown()
      : "⚠ Không thể lấy Markdown";

    const htmlContent = editor.getHTML();
    const textContent = editor.getText();

    console.log("📜 Markdown Content:", markdownContent);
    console.log("🌐 HTML Content:", htmlContent);
    console.log("📝 Plain Text:", textContent);
  };

  return (
    <>
      <button
        onClick={() => setIsEditable(!isEditable)}
        className={`mb-3 p-2 rounded border transition-colors flex items-center justify-center ${
          isEditable ? "bg-white text-black" : "bg-red-500 text-white"
        }`}
      >
        {isEditable ? <LuPen size={20} /> : <LuPenOff size={20} />}
        <span className="ml-2">{isEditable ? "Chỉnh sửa" : "Chế độ xem"}</span>
      </button>

      <button
        onClick={handleSave}
        className="mb-3 ml-3 p-2 rounded border bg-blue-500 text-white"
      >
        Lưu
      </button>

      <div>
        <TextEditorMenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
