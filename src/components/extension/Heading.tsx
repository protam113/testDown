import { mergeAttributes, Node } from "@tiptap/core";

const CustomHeading = Node.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
    };
  },
  group: "block",
  content: "inline*",
  defining: true,
  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: (element) => {
          return parseInt(element.tagName[1]) || 1;
        },
        renderHTML: (attributes) => {
          return { tag: `h${attributes.level}` };
        },
      },
    };
  },
  parseHTML() {
    return this.options.levels.map((level) => ({
      tag: `h${level}`,
    }));
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      `h${node.attrs.level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setHeading:
        (attrs) =>
        ({ commands }) => {
          return commands.setNode(this.name, attrs);
        },
      toggleHeading:
        (attrs) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", attrs);
        },
    };
  },
});

export default CustomHeading;
