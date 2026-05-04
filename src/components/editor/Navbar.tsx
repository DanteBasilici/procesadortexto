"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, FontFamily } from "./EditorContext";
import { SaveModal } from "./SaveModal";

const FONTS: FontFamily[] = [
  "Nunito",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Comic Sans MS",
  "Verdana",
  "Trebuchet MS",
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

export function Navbar() {
  const { state, setState, execCommand, editorRef } = useEditor();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState(String(state.fontSize));
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const fontDropRef = useRef<HTMLDivElement>(null);
  const sizeDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFontSizeInput(String(state.fontSize));
  }, [state.fontSize]);

  // Toggle alto contraste en <html>
  const toggleContrast = useCallback(() => {
    setHighContrast((v) => {
      const next = !v;
      document.documentElement.setAttribute("data-contrast", next ? "high" : "normal");
      return next;
    });
  }, []);

  // Cerrar dropdowns al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontDropRef.current && !fontDropRef.current.contains(e.target as Node))
        setShowFontDropdown(false);
      if (sizeDropRef.current && !sizeDropRef.current.contains(e.target as Node))
        setShowSizeDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Guardar con Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setShowSaveModal(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const applyFont = useCallback((font: FontFamily) => {
    setState((s) => ({ ...s, fontFamily: font }));
    setShowFontDropdown(false);
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("fontName", false, font);
  }, [setState, editorRef]);

  const applySize = useCallback((size: number) => {
    setState((s) => ({ ...s, fontSize: size }));
    setFontSizeInput(String(size));
    setShowSizeDropdown(false);
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      try { range.surroundContents(span); } catch { /* selección parcial */ }
    } else {
      editor.style.fontSize = `${size}px`;
    }
  }, [setState, editorRef]);

  const applyFontSizeInput = useCallback(() => {
    const v = parseInt(fontSizeInput);
    if (!isNaN(v) && v >= 8 && v <= 144) applySize(v);
  }, [fontSizeInput, applySize]);

  const toggleBold = () => {
    execCommand("bold");
    setState((s) => ({ ...s, bold: !s.bold }));
  };
  const toggleItalic = () => {
    execCommand("italic");
    setState((s) => ({ ...s, italic: !s.italic }));
  };
  const toggleUnderline = () => {
    execCommand("underline");
    setState((s) => ({ ...s, underline: !s.underline }));
  };
  const setAlign = (align: "left" | "center" | "right" | "justify") => {
    const cmds = { left: "justifyLeft", center: "justifyCenter", right: "justifyRight", justify: "justifyFull" };
    execCommand(cmds[align]);
    setState((s) => ({ ...s, textAlign: align }));
  };

  const CELESTE = "#2196d4";
  const ROJO = "#e02020";
  const AMARILLO = "#f5c800";

  return (
    <>
      <header className="navbar" role="banner">
        {/* Franja tricolor top — colores del logo */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${ROJO} 0%, ${ROJO} 33%, ${AMARILLO} 33%, ${AMARILLO} 66%, ${CELESTE} 66%, ${CELESTE} 100%)` }} aria-hidden="true" />

        {/* Título */}
        <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, ${CELESTE}, ${ROJO})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: `0 2px 8px rgba(33,150,212,0.35)`,
            }}
            aria-hidden="true"
          >
            <span style={{ fontSize: 17 }}>✏️</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0d2a3f", letterSpacing: "-0.3px" }}>
              Procesador de Texto
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "#2a5070", fontWeight: 500 }}
              aria-live="polite" aria-atomic="true">
              {state.documentName}
            </p>
          </div>
        </div>

        {/* Toolbar principal */}
        <nav
          aria-label="Barra de herramientas del editor"
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: "8px 20px 10px" }}
        >
          {/* GUARDAR */}
          <button
            className="glass-btn"
            onClick={() => setShowSaveModal(true)}
            aria-label="Guardar como... Abrir menú de guardado. Atajo de teclado: Control S"
            style={{
              padding: "7px 14px", fontWeight: 700, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6,
              background: `rgba(33,150,212,0.15)`,
              border: `1px solid rgba(33,150,212,0.35)`,
              color: CELESTE,
            }}
          >
            <span aria-hidden="true">💾</span>
            <span>Guardar como…</span>
          </button>

          <div className="toolbar-sep" aria-hidden="true" />

          {/* FUENTE */}
          <div ref={fontDropRef} style={{ position: "relative" }}>
            <button
              className="glass-btn"
              onClick={() => { setShowFontDropdown((v) => !v); setShowSizeDropdown(false); }}
              aria-label={`Fuente: ${state.fontFamily}. Presioná Enter para cambiar`}
              aria-haspopup="listbox"
              aria-expanded={showFontDropdown}
              style={{ padding: "7px 12px", fontSize: 13, fontFamily: state.fontFamily, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}
            >
              <span>{state.fontFamily}</span>
              <span style={{ fontSize: 10, opacity: 0.5 }} aria-hidden="true">▾</span>
            </button>
            {showFontDropdown && (
              <div className="dropdown-glass" style={{ position: "absolute", top: "110%", left: 0, zIndex: 50, minWidth: 175 }} role="listbox" aria-label="Seleccionar fuente">
                {FONTS.map((f) => (
                  <div key={f} className="dropdown-item" role="option" aria-selected={state.fontFamily === f}
                    tabIndex={0} style={{ fontFamily: f }}
                    onClick={() => applyFont(f)} onKeyDown={(e) => e.key === "Enter" && applyFont(f)}>
                    {state.fontFamily === f && <span style={{ color: CELESTE }} aria-hidden="true">✓</span>}
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TAMAÑO */}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button className="glass-btn" style={{ padding: "7px 9px", fontSize: 16, lineHeight: 1, fontWeight: 700 }}
              aria-label="Reducir tamaño de fuente"
              onClick={() => { const s = FONT_SIZES.filter((s) => s < state.fontSize).pop() || 10; applySize(s); }}>
              A<sub style={{ fontSize: "0.55em" }}>−</sub>
            </button>
            <input type="number" className="glass-input" value={fontSizeInput} min={8} max={144}
              aria-label={`Tamaño de fuente: ${state.fontSize} puntos`}
              onChange={(e) => setFontSizeInput(e.target.value)}
              onBlur={applyFontSizeInput}
              onKeyDown={(e) => e.key === "Enter" && applyFontSizeInput()}
              style={{ width: 54 }} />
            <button className="glass-btn" style={{ padding: "7px 9px", fontSize: 16, lineHeight: 1, fontWeight: 700 }}
              aria-label="Aumentar tamaño de fuente"
              onClick={() => { const s = FONT_SIZES.find((s) => s > state.fontSize) || 72; applySize(s); }}>
              A<sup style={{ fontSize: "0.55em" }}>+</sup>
            </button>
          </div>

          <div className="toolbar-sep" aria-hidden="true" />

          {/* NEGRITA / CURSIVA / SUBRAYADO */}
          <button className={`glass-btn ${state.bold ? "active" : ""}`}
            aria-label={state.bold ? "Quitar negrita" : "Aplicar negrita. Atajo: Control N"}
            aria-pressed={state.bold} onClick={toggleBold}
            style={{ padding: "7px 13px", fontWeight: 900, fontSize: 15 }}>N</button>

          <button className={`glass-btn ${state.italic ? "active" : ""}`}
            aria-label={state.italic ? "Quitar cursiva" : "Aplicar cursiva. Atajo: Control K"}
            aria-pressed={state.italic} onClick={toggleItalic}
            style={{ padding: "7px 13px", fontStyle: "italic", fontWeight: 700, fontSize: 15 }}>K</button>

          <button className={`glass-btn ${state.underline ? "active" : ""}`}
            aria-label={state.underline ? "Quitar subrayado" : "Aplicar subrayado. Atajo: Control S"}
            aria-pressed={state.underline} onClick={toggleUnderline}
            style={{ padding: "7px 13px", textDecoration: "underline", fontWeight: 700, fontSize: 15 }}>S</button>

          <div className="toolbar-sep" aria-hidden="true" />

          {/* ALINEACIÓN */}
          {([
            { align: "left" as const, label: "Alinear a la izquierda" },
            { align: "center" as const, label: "Centrar texto" },
            { align: "right" as const, label: "Alinear a la derecha" },
            { align: "justify" as const, label: "Justificar texto" },
          ]).map(({ align, label }) => (
            <button key={align} className={`glass-btn ${state.textAlign === align ? "active" : ""}`}
              aria-label={label} aria-pressed={state.textAlign === align}
              onClick={() => setAlign(align)} style={{ padding: "7px 9px" }}>
              {align === "left" && <AlignIcon type="left" />}
              {align === "center" && <AlignIcon type="center" />}
              {align === "right" && <AlignIcon type="right" />}
              {align === "justify" && <AlignIcon type="justify" />}
            </button>
          ))}

          <div className="toolbar-sep" aria-hidden="true" />

          {/* ORTOGRAFÍA */}
          <button className={`glass-btn ${state.spellCheck ? "active" : ""}`}
            aria-label={state.spellCheck ? "Corrector ortográfico activado. Presionar para desactivar" : "Corrector ortográfico desactivado. Presionar para activar"}
            aria-pressed={state.spellCheck}
            onClick={() => setState((s) => ({ ...s, spellCheck: !s.spellCheck }))}
            style={{ padding: "7px 12px", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
            <span aria-hidden="true">📝</span>
            <span>Ortografía</span>
          </button>

          {/* ALTO CONTRASTE */}
          <button className={`glass-btn ${highContrast ? "active" : ""}`}
            aria-label={highContrast ? "Alto contraste activado. Presionar para volver al modo normal" : "Activar modo alto contraste: fondo negro con letras amarillas"}
            aria-pressed={highContrast}
            onClick={toggleContrast}
            style={{
              padding: "7px 12px", fontSize: 13,
              display: "flex", alignItems: "center", gap: 5,
              ...(highContrast ? {
                background: "#f5c800",
                border: "1px solid #c9a200",
                color: "#000",
              } : {
                background: `rgba(245,200,0,0.15)`,
                border: `1px solid rgba(245,200,0,0.45)`,
                color: "#7a5f00",
              })
            }}>
            <span aria-hidden="true">{highContrast ? "🌙" : "☀️"}</span>
            <span>Alto contraste</span>
          </button>

          {/* Atajos de teclado */}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#64748b", whiteSpace: "nowrap", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["Ctrl+N","Negrita"],["Ctrl+K","Cursiva"],["Ctrl+S","Guardar"]].map(([k,v]) => (
              <span key={k}>
                <kbd style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(203,213,225,0.8)", borderRadius: 4, padding: "1px 5px", fontSize: 10 }}>{k}</kbd> {v}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {showSaveModal && <SaveModal onClose={() => setShowSaveModal(false)} />}
    </>
  );
}

function AlignIcon({ type }: { type: "left" | "center" | "right" | "justify" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      {type === "left" && (<><rect x="0" y="2" width="16" height="2" rx="1"/><rect x="0" y="7" width="10" height="2" rx="1"/><rect x="0" y="12" width="14" height="2" rx="1"/></>)}
      {type === "center" && (<><rect x="0" y="2" width="16" height="2" rx="1"/><rect x="3" y="7" width="10" height="2" rx="1"/><rect x="1" y="12" width="14" height="2" rx="1"/></>)}
      {type === "right" && (<><rect x="0" y="2" width="16" height="2" rx="1"/><rect x="6" y="7" width="10" height="2" rx="1"/><rect x="2" y="12" width="14" height="2" rx="1"/></>)}
      {type === "justify" && (<><rect x="0" y="2" width="16" height="2" rx="1"/><rect x="0" y="7" width="16" height="2" rx="1"/><rect x="0" y="12" width="16" height="2" rx="1"/></>)}
    </svg>
  );
}
