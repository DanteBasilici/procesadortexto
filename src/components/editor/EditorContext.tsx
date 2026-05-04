"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";

export type FontFamily =
  | "Nunito"
  | "Georgia"
  | "Courier New"
  | "Arial"
  | "Times New Roman"
  | "Comic Sans MS"
  | "Verdana"
  | "Trebuchet MS";

export interface EditorState {
  fontFamily: FontFamily;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: "left" | "center" | "right" | "justify";
  spellCheck: boolean;
  wordCount: number;
  charCount: number;
  hasContent: boolean;
  documentName: string;
}

export interface EditorContextType {
  editorRef: React.RefObject<HTMLDivElement | null>;
  state: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  execCommand: (command: string, value?: string) => void;
  updateCounts: () => void;
  setDocumentName: (name: string) => void;
  toggleSpellCheck: () => void;
}

const defaultState: EditorState = {
  fontFamily: "Nunito",
  fontSize: 16,
  bold: false,
  italic: false,
  underline: false,
  textAlign: "left",
  spellCheck: true,
  wordCount: 0,
  charCount: 0,
  hasContent: false,
  documentName: "Documento sin título",
};

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<EditorState>(defaultState);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      if (value !== undefined) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false);
      }
    },
    []
  );

  const updateCounts = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const text = editor.innerText || "";
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    setState((s) => ({
      ...s,
      wordCount: words,
      charCount: text.length,
      hasContent: text.trim().length > 0,
    }));
  }, []);

  const setDocumentName = useCallback((name: string) => {
    setState((s) => ({ ...s, documentName: name }));
  }, []);

  const toggleSpellCheck = useCallback(() => {
    setState((s) => ({ ...s, spellCheck: !s.spellCheck }));
  }, []);

  return (
    <EditorContext.Provider
      value={{ editorRef, state, setState, execCommand, updateCounts, setDocumentName, toggleSpellCheck }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be inside EditorProvider");
  return ctx;
}
