"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditor } from "./EditorContext";
import { saveAsTxt, saveAsPdf, saveAsDocx } from "@/lib/exportUtils";

type Format = "docx" | "pdf" | "txt";

interface SaveModalProps {
  onClose: () => void;
}

export function SaveModal({ onClose }: SaveModalProps) {
  const { editorRef, state, setDocumentName } = useEditor();
  const [format, setFormat] = useState<Format>("docx");
  const [filename, setFilename] = useState(state.documentName === "Documento sin título" ? "mi-documento" : state.documentName);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    setSaving(true);
    try {
      const name = filename.trim() || "mi-documento";
      setDocumentName(name);

      if (format === "txt") {
        await saveAsTxt(editor.innerHTML, name);
      } else if (format === "pdf") {
        await saveAsPdf(editor, name);
      } else {
        await saveAsDocx(editor.innerHTML, name);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar el archivo. Por favor intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const formats: { value: Format; label: string; desc: string; icon: string }[] = [
    {
      value: "docx",
      label: "Word (.docx)",
      desc: "Compatible con Microsoft Word y LibreOffice",
      icon: "📄",
    },
    {
      value: "pdf",
      label: "PDF (.pdf)",
      desc: "Documento listo para imprimir o compartir",
      icon: "🖨️",
    },
    {
      value: "txt",
      label: "Texto simple (.txt)",
      desc: "Solo el texto, sin formato",
      icon: "📃",
    },
  ];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-glass" style={{ minWidth: 360, maxWidth: 480 }}>
        <h2
          id="modal-title"
          style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#1e293b" }}
        >
          💾 Guardar documento
        </h2>

        {/* Filename */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="filename-input"
            style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}
          >
            Nombre del archivo
          </label>
          <input
            ref={firstInputRef}
            id="filename-input"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(203,213,225,0.7)",
              background: "rgba(255,255,255,0.7)",
              fontSize: 14,
              color: "#1e293b",
              outline: "none",
            }}
            aria-label="Nombre del archivo a guardar"
            placeholder="mi-documento"
          />
        </div>

        {/* Format selection */}
        <fieldset style={{ border: "none", padding: 0, margin: "0 0 24px" }}>
          <legend
            style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}
          >
            Formato de archivo
          </legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {formats.map((f) => (
              <label
                key={f.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: `2px solid ${format === f.value ? "rgba(52,211,153,0.5)" : "rgba(203,213,225,0.5)"}`,
                  background:
                    format === f.value
                      ? "rgba(52,211,153,0.08)"
                      : "rgba(255,255,255,0.4)",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={f.value}
                  checked={format === f.value}
                  onChange={() => setFormat(f.value)}
                  style={{ accentColor: "#34d399" }}
                  aria-label={`Guardar como ${f.label}: ${f.desc}`}
                />
                <span style={{ fontSize: 20 }} aria-hidden="true">{f.icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
                    {f.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{f.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            className="glass-btn"
            onClick={onClose}
            style={{ padding: "10px 20px", fontSize: 14, color: "#64748b" }}
            aria-label="Cancelar y cerrar el diálogo"
          >
            Cancelar
          </button>
          <button
            className="glass-btn"
            onClick={handleSave}
            disabled={saving || success}
            aria-label={saving ? "Guardando, por favor esperá" : success ? "Guardado con éxito" : `Guardar como ${format}`}
            aria-live="polite"
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 700,
              background: success
                ? "linear-gradient(135deg, rgba(52,211,153,0.5), rgba(52,211,153,0.3))"
                : "linear-gradient(135deg, rgba(52,211,153,0.35), rgba(96,165,250,0.25))",
              border: "1px solid rgba(52,211,153,0.5)",
              color: success ? "#059669" : "#0f766e",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Guardando…" : success ? "✓ ¡Guardado!" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
