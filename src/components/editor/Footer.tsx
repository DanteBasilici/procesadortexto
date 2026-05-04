"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label="Pie de página de la escuela"
      style={{ padding: "14px 24px" }}
    >
      <div style={{
        maxWidth: 860, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        {/* Logo + nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Contenedor del logo — fondo blanco suave para que se vea bien en alto contraste */}
          <div style={{
            width: 72, height: 72,
            borderRadius: 14,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(33,150,212,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(33,150,212,0.12)",
            overflow: "hidden",
            padding: 4,
          }}>
            <Image
              src="/logo-escuela.png"
              alt="Logo de la Escuela de Educación Especial Helen Keller: dos figuras con los brazos en alto dentro de un círculo amarillo"
              width={64}
              height={64}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
              priority={false}
            />
          </div>

          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "#0d2a3f", lineHeight: 1.3 }}>
              Esc. 2-006 Helen Keller
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#2196d4", fontWeight: 600 }}>
              Escuela de Educación Especial
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              Mendoza, Argentina
            </p>
          </div>
        </div>

        {/* Centro: accesibilidad */}
        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textAlign: "center" }}
          aria-label="Aplicación compatible con lector de pantalla NVDA, configuración español latinoamérica">
          ♿ Accesible · NVDA compatible · Español latinoamérica
        </p>

        {/* Crédito */}
        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}
          aria-label="Desarrollado por Dante Ezequiel Basilici">
          Desarrollado por{" "}
          <span style={{ fontWeight: 700, color: "#2196d4" }}>
            Dante Ezequiel Basilici
          </span>
        </p>
      </div>
    </footer>
  );
}
