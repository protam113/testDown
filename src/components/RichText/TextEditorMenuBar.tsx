import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiMarkPenLine,
  RiListOrdered2,
  RiDoubleQuotesL,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiCodeSSlashLine,
  RiLink,
  RiImageLine,
} from "react-icons/ri";
import { AiOutlineRedo, AiOutlineUndo } from "react-icons/ai";
import { IoListOutline } from "react-icons/io5";
import { useState } from "react";

const Button = ({
  onClick,
  isActive,
  disabled = false, // Giá trị mặc định nếu không truyền vào
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2 ${isActive ? "bg-violet-500 text-white rounded-md" : ""}`}
  >
    {children}
  </button>
);

export default function TextEditorMenuBar({ editor }) {
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  if (!editor) return null;

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const formattingButtons = [
    {
      icon: <RiBold className="size-5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <RiItalic className="size-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <RiStrikethrough className="size-5" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: <RiMarkPenLine className="size-5" />,
      onClick: () =>
        editor.chain().focus().toggleHighlight({ color: "#FFFF00" }).run(),
      isActive: editor.isActive("highlight", { color: "#FFFF00" }),
    },
  ];

  const listAndQuoteButtons = [
    {
      icon: <IoListOutline className="size-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <RiListOrdered2 className="size-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <RiDoubleQuotesL className="size-5" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
  ];

  const alignmentButtons = [
    {
      icon: <RiAlignLeft className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive("textAlign", { textAlign: "left" }),
    },
    {
      icon: <RiAlignCenter className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive("textAlign", { textAlign: "center" }),
    },
    {
      icon: <RiAlignRight className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive("textAlign", { textAlign: "right" }),
    },
  ];

  const headingButtons = [
    {
      icon: "H1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: "H2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: "H3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
  ];

  const advancedButtons = [
    {
      icon: <RiCodeSSlashLine className="size-5" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
    {
      icon: <RiLink className="size-5" />,
      onClick: () => {
        const url = prompt("Nhập đường dẫn:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: editor.isActive("link"),
    },
    {
      icon: <RiImageLine className="size-5" />,
      onClick: () => setShowImageInput(!showImageInput),
      isActive: false,
    },
  ];

  const undoRedoButtons = [
    {
      icon: <AiOutlineUndo className="size-5" />,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: <AiOutlineRedo className="size-5" />,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className="mb-2 flex flex-wrap space-x-2">
      {[
        ...formattingButtons,
        ...listAndQuoteButtons,
        ...alignmentButtons,
        ...headingButtons,
        ...advancedButtons,
        ...undoRedoButtons,
      ].map(({ icon, onClick, isActive }, index, array) => (
        <div key={index} className="flex items-center">
          <Button onClick={onClick} isActive={isActive}>
            {icon}
          </Button>
          {index < array.length - 1 && <span className="mx-2">|</span>}{" "}
          {/* Sửa lại dùng array.length */}
        </div>
      ))}

      {showImageInput && (
        <div className="flex items-center space-x-2 ml-2">
          <input
            type="text"
            placeholder="Nhập URL hình ảnh..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border px-2 py-1 rounded-md"
          />
          <button
            onClick={addImage}
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            Thêm
          </button>
        </div>
      )}
    </div>
  );
}
