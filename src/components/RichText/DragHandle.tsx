import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useState, useRef } from "react";

const DragHandle = ({ updatePosition, getPos }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", getPos().toString());
  };

  return (
    <div
      className="cursor-grab p-1"
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const fromPos = parseInt(e.dataTransfer.getData("text/plain"), 10);
        updatePosition(fromPos, getPos());
      }}
    >
      <RxDragHandleDots2 className="text-gray-800 size-6" />
    </div>
  );
};

const DragItem = Node.create({
  name: "dragItem",
  group: "block",
  content: "block+",
  draggable: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ editor, getPos }) => {
      const [, setUpdate] = useState(0);
      const lastPos = useRef(getPos());

      const updatePosition = (from, to) => {
        if (from === to) return; // Không làm gì nếu vị trí không thay đổi

        const transaction = editor.state.tr;
        const nodeContent = editor.state.doc.nodeAt(from);

        if (!nodeContent) return;

        transaction.delete(from, from + nodeContent.nodeSize);
        transaction.insert(to, nodeContent);
        editor.view.dispatch(transaction);
        lastPos.current = to;
        setUpdate((prev) => prev + 1);
      };

      return (
        <NodeViewWrapper className="flex items-center space-x-2">
          <DragHandle updatePosition={updatePosition} getPos={getPos} />
          <div className="w-full border rounded-md p-2">
            <NodeViewContent /> {/* Nội dung thực tế của node */}
          </div>
        </NodeViewWrapper>
      );
    });
  },
});

export default DragItem;
