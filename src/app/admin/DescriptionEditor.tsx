"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { uploadEditorImage } from "./actions";

// Rich-text editor for a product's "Mô tả" field. Content is stored as HTML in the same
// `description` text column that used to hold plain text — old plain-text descriptions still
// render fine (Tiptap treats them as one paragraph). The hidden input mirrors the editor's HTML
// on every change so the surrounding <form action={serverAction}> picks it up like any other field.
function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded text-sm font-medium ${active ? "bg-[var(--color-purple)] text-white" : "bg-black/5 hover:bg-black/10"}`;

  async function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.set("file", file);
      try {
        const url = await uploadEditorImage(fd);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Tải ảnh thất bại");
      }
    };
    input.click();
  }

  function insertLink() {
    const url = window.prompt("Dán URL:");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertYoutube() {
    const url = window.prompt("Dán URL video YouTube:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }

  return (
    <div className="flex flex-wrap gap-1.5 border border-black/15 border-b-0 rounded-t-lg bg-black/[0.02] p-2">
      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
        Đậm
      </button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
        Nghiêng
      </button>
      <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Gạch chân
      </button>
      <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
        Gạch ngang
      </button>
      <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        Tiêu đề lớn
      </button>
      <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        Tiêu đề nhỏ
      </button>
      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Danh sách
      </button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        Danh sách số
      </button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        Trích dẫn
      </button>
      <button type="button" className={btn(editor.isActive("link"))} onClick={insertLink}>
        Liên kết
      </button>
      <button type="button" className={btn(false)} onClick={insertImage}>
        Chèn ảnh
      </button>
      <button type="button" className={btn(false)} onClick={insertYoutube}>
        YouTube
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        Bảng
      </button>
    </div>
  );
}

export default function DescriptionEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TiptapImage,
      Youtube,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: { class: "rich-content min-h-[180px] px-3 py-2 focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      if (inputRef.current) inputRef.current.value = editor.getHTML();
    },
  });

  // Keep the hidden input in sync even if the form is submitted before any onUpdate fires
  // (e.g. the admin never touched the description on a fresh "new product" form).
  useEffect(() => {
    if (editor && inputRef.current) inputRef.current.value = editor.getHTML();
  }, [editor]);

  return (
    <div>
      <input ref={inputRef} type="hidden" name={name} defaultValue={defaultValue} />
      {editor && <Toolbar editor={editor} />}
      <div className="border border-black/15 rounded-b-lg">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
