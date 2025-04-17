import CodeBlockBase from "@tiptap/extension-code-block";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import { NodeViewWrapper } from "@tiptap/react";

// Create a React component for rendering the code block with copy button
const CodeBlockView = ({ node }) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    const code = node.textContent;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper my-2">
      <div className="relative">
        <pre className="bg-slate-500 text-white p-4 rounded-md font-mono">
          <code>{node.textContent}</code>
        </pre>
        <button
          onClick={copyCode}
          className="absolute top-2 right-2 bg-white text-slate-700 rounded px-2 py-1 text-xs font-medium hover:bg-slate-100"
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
    </NodeViewWrapper>
  );
};

// Extend the original CodeBlock extension
const ImprovedCodeBlock = CodeBlockBase.extend({
  // Set default options for styling
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "bg-slate-500 text-white p-4 rounded-md font-mono",
      },
    };
  },

  // Add nodeView to use our custom React component
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },

  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    return {
      // Preserve existing shortcuts from the base extension
      ...this.parent?.(),

      // Add or modify shortcuts as needed
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),

      // Custom shortcut to exit code block with command+enter
      "Mod-Enter": ({ editor }) => {
        if (!editor.isActive(this.name)) {
          return false;
        }

        return editor.commands.insertContentAt(editor.state.selection.anchor, {
          type: "paragraph",
        });
      },
    };
  },
});

export default ImprovedCodeBlock;
