"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useEditor } from "./EditorContext";

function EditorInner() {
  const { editorRef, state, setState, updateCounts } = useEditor();
  const announcerRef = useRef<HTMLDivElement>(null);

  // Announce word count changes periodically for screen readers
  const lastAnnouncedCount = useRef(0);
  useEffect(() => {
    if (
      state.wordCount !== lastAnnouncedCount.current &&
      state.wordCount % 10 === 0 &&
      state.wordCount > 0
    ) {
      lastAnnouncedCount.current = state.wordCount;
      if (announcerRef.current) {
        announcerRef.current.textContent = `${state.wordCount} palabras escritas`;
      }
    }
  }, [state.wordCount]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b" || e.key === "n" || e.key === "B" || e.key === "N") {
          e.preventDefault();
          document.execCommand("bold");
          setState((s) => ({ ...s, bold: !s.bold }));
        }
        if (e.key === "i" || e.key === "k" || e.key === "I" || e.key === "K") {
          e.preventDefault();
          document.execCommand("italic");
          setState((s) => ({ ...s, italic: !s.italic }));
        }
        if (e.key === "u" || e.key === "s" || e.key === "U" || e.key === "S") {
          e.preventDefault();
          document.execCommand("underline");
          setState((s) => ({ ...s, underline: !s.underline }));
        }
      }
      updateCounts();
    },
    [setState, updateCounts]
  );

  const handleInput = useCallback(() => {
    updateCounts();
  }, [updateCounts]);

  // Track selection to update toolbar state
  const handleSelectionChange = useCallback(() => {
    const bold = document.queryCommandState("bold");
    const italic = document.queryCommandState("italic");
    const underline = document.queryCommandState("underline");
    setState((s) => {
      if (s.bold === bold && s.italic === italic && s.underline === underline)
        return s;
      return { ...s, bold, italic, underline };
    });
  }, [setState]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "32px 20px",
        gap: 16,
      }}
    >
      {/* ARIA live region for screen readers */}
      <div
        ref={announcerRef}
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}
      />

      {/* Page sheet */}
      <div
        className="glass-strong"
        style={{
          maxWidth: 860,
          width: "100%",
          margin: "0 auto",
          borderRadius: 20,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 20px 60px rgba(31, 38, 135, 0.1), 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Page header accent */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa)",
            borderRadius: "20px 20px 0 0",
          }}
          aria-hidden="true"
        />

        {/* The editor */}
        <div
          ref={editorRef}
          className="editor-area"
          contentEditable
          suppressContentEditableWarning
          spellCheck={state.spellCheck}
          lang="es"
          role="textbox"
          aria-multiline="true"
          aria-label="Área de escritura. Escribí tu texto aquí. El corrector ortográfico está activo en español."
          data-placeholder="Comenzá a escribir tu texto aquí…"
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          style={{
            fontFamily: state.fontFamily,
            fontSize: state.fontSize,
            textAlign: state.textAlign,
            flex: 1,
            caretColor: "#34d399",
          }}
        />
      </div>

      {/* Status bar */}
      <div
        style={{
          maxWidth: 860,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
        role="status"
        aria-label={`Estado del documento: ${state.wordCount} palabras, ${state.charCount} caracteres`}
        aria-live="off"
      >
        <span className="status-pill">
          <span aria-label={`${state.wordCount} palabras`}>
            📊 {state.wordCount} {state.wordCount === 1 ? "palabra" : "palabras"}
          </span>
        </span>
        <span className="status-pill">
          <span aria-label={`${state.charCount} caracteres`}>
            {state.charCount} {state.charCount === 1 ? "carácter" : "caracteres"}
          </span>
        </span>
        <span className="status-pill">
          <span aria-label={`Fuente: ${state.fontFamily}, tamaño ${state.fontSize}`}>
            🔤 {state.fontFamily} {state.fontSize}px
          </span>
        </span>
        {state.spellCheck && (
          <span
            className="status-pill"
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
              color: "#059669",
            }}
            aria-label="Corrector ortográfico en español activado"
          >
            ✓ Ortografía activa (es)
          </span>
        )}

        {/* Accessibility hint */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#94a3b8",
            fontStyle: "italic",
          }}
          aria-hidden="true"
        >
          Compatible con NVDA · Español latinoamérica
        </span>
      </div>
    </div>
  );
}

export function EditorArea() {
  return <EditorInner />;
}
