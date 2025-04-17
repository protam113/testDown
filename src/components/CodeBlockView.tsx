import React from "react";
import { NodeViewWrapper } from "@tiptap/react";

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

export default CodeBlockView;
