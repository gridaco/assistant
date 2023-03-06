import React, { useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import ExtensionMention from "@tiptap/extension-mention";
import ExtensionLink from "@tiptap/extension-link";
import ExtensionBubbleMenu from "@tiptap/extension-bubble-menu";
import ExtensionCodeBlock from "@tiptap/extension-code-block-lowlight";
import ExtensionPlaceholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight/lib/core";
import suggestion from "./suggestion";
import { CommandExtension } from "./command";

const DEFAULT_THEME_FONT_FAMILY = `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";`;

export default React.forwardRef(function TiptapInput(
  {
    readonly = false,
    onChange,
    onSubmit,
    placeholder,
    autofocus = true,
    value = "",
    onBlur,
    onFocus,
  }: {
    onChange?: (value: string) => void;
    onSubmit?: (editor: Editor) => void;
    placeholder?: string;
    autofocus?: boolean;
    readonly?: boolean;
    value?: string;
    onBlur?: () => void;
    onFocus?: () => void;
  },
  ref?: React.Ref<Editor>
) {
  const editor = useEditor({
    editorProps: {
      handleKeyDown: (view, event) => {
        // emmit onSubmit when press enter
        if (event.key === "Enter" && event.metaKey) {
          event.preventDefault();
          emmitOnSubmit();
          return false;
        }
      },
    },
    extensions: [
      StarterKit,
      ExtensionPlaceholder.configure({
        placeholder: ({ pos }) => (pos === 0 ? placeholder : undefined),
      }),
      CommandExtension.configure({
        // @ts-ignore
        suggestion: suggestion,
      }),
      ExtensionMention.configure({
        suggestion: suggestion,
        HTMLAttributes: {
          class: "mention",
        },
      }),
      ExtensionLink.configure({}),
      ExtensionBubbleMenu.configure({}),
      ExtensionCodeBlock.configure({
        lowlight,
      }),
    ],
    content: value,
    autofocus,
    editable: readonly !== true,
  });

  // ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(editor);
    } else {
      // @ts-ignore
      ref.current = editor;
    }
  }, [editor]);

  // useEffect(() => {
  //   if (!editor) return;
  //   editor.commands.setContent(value);
  // }, [value]);

  const emmitOnSubmit = useCallback(() => {
    onSubmit?.(editor);
  }, [editor]);

  // chain onChange
  useEffect(() => {
    if (!editor) return;

    const emmitOnChange = () => {
      onChange?.(editor.getText());
    };

    editor.on("update", emmitOnChange);
    return () => {
      editor.off("update", emmitOnChange);
    };
  }, [editor]);

  return (
    <EditorContentInstance
      //
      editor={editor}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
});

const EditorContentInstance = styled(EditorContent)`
  .mention {
    border: 1px solid #000;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  /* font */
  .ProseMirror {
    outline: none;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      color: rgba(0, 0, 0, 0.87);
      font-family: ${DEFAULT_THEME_FONT_FAMILY};
      line-height: 110%;
    }

    h1,
    h2,
    h3 {
      line-height: 180%;
    }

    h1 {
      font-size: 30px;
    }

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 20px;
    }

    /* p only */
    p {
      font-size: 16px;
      line-height: 150%;
    }

    img {
      border-radius: 2px;
      width: 100%;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    video {
      width: 100%;
      height: auto;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    img,
    video {
      margin-bottom: 4px;
      &.ProseMirror-selectednode {
        outline: 2px solid rgba(0, 0, 0, 0.2);
        cursor: grab;
      }
      background-color: rgba(0, 0, 0, 0.2);
    }

    iframe {
      width: 100%;
      height: 400px;
    }

    hr {
      display: flex;
      cursor: default;
      height: 13px;
      outline: none;
      margin: 0;
      padding: 0;
      border: none;
      align-items: center;
      :after {
        display: inline-block;
        content: "";
        width: 100%;
        height: 1px;
        border-bottom: solid 1px rgba(0, 0, 0, 0.12);
      }
      &.ProseMirror-selectednode {
        :after {
          border-bottom: solid 1px rgba(0, 0, 0, 0.3);
        }
      }
    }
  }

  /* placeholder's style - https://www.tiptap.dev/api/extensions/placeholder/#placeholder*/
  .ProseMirror p.is-editor-empty:first-of-type::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    height: 0;
  }

  /* ================================================================ */
  /* region placeholder */
  /* Placeholder (only at the top) */
  .ProseMirror .is-editor-empty:first-of-type::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    height: 0;
  }

  /* Placeholder (on every new line) */
  .ProseMirror .is-empty::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    height: 0;
  }
  /* endregion placeholder */
  /* ================================================================ */

  .ProseMirror {
    /* ================================================================ */
    /* codeblock - https://www.tiptap.dev/api/nodes/code-block-lowlight */
    /*  */
    pre {
      background: #5c5c5c;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }

      .hljs-comment,
      .hljs-quote {
        color: #616161;
      }

      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f98181;
      }

      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #fbbc88;
      }

      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #b9f18d;
      }

      .hljs-title,
      .hljs-section {
        color: #faf594;
      }

      .hljs-keyword,
      .hljs-selector-tag {
        color: #70cff8;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: 700;
      }
    }
    /* ================================================================ */
    /* ================================================================ */

    /* ================================================================ */
    /* blockquote - https://www.tiptap.dev/api/nodes/blockquote */
    /* FIXME - not border-left working */
    blockquote {
      padding-left: 1rem;
      border-left: 2px solid #b0b0b0;
    }
    /* ================================================================ */
    /* ================================================================ */
  }

  /* Give a remote user a caret */
  .collaboration-cursor__caret {
    border-left: 1px solid #0d0d0d;
    border-right: 1px solid #0d0d0d;
    margin-left: -1px;
    margin-right: -1px;
    pointer-events: none;
    position: relative;
    word-break: normal;
  }

  /* Render the username above the caret */
  .collaboration-cursor__label {
    border-radius: 3px 3px 3px 0;
    color: #0d0d0d;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    left: -1px;
    line-height: normal;
    padding: 0.1rem 0.3rem;
    position: absolute;
    top: -1.4em;
    user-select: none;
    white-space: nowrap;
  }
`;
