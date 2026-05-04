# Procesador de Texto — Esc. 2-006 Helen Keller

Procesador de texto accesible para niños con discapacidad visual.
Compatible con lector de pantalla **NVDA** y configuración de teclado **español latinoamérica**.

## 🚀 Instalación rápida

```bash
npm install
npm run dev
```

Luego abrí [http://localhost:3000](http://localhost:3000) en el navegador.

## 🖼️ Logo de la escuela

Colocá el archivo `logo-escuela.png` en la carpeta `/public/`.  
El footer lo cargará automáticamente.

## ✨ Funcionalidades

- **Procesador de texto** estilo Word con barra de herramientas completa
- **Fuentes**: Nunito, Arial, Georgia, Times New Roman, Courier New, Comic Sans MS, Verdana, Trebuchet MS
- **Estilos**: Negrita (Ctrl+N), Cursiva (Ctrl+K), Subrayado (Ctrl+S)
- **Tamaño de fuente**: ajustable con botones A+ / A- o escribiendo el número
- **Alineación**: izquierda, centrado, derecha, justificado
- **Corrector ortográfico** nativo del navegador en español (se activa/desactiva)
- **Guardar como**: `.docx`, `.pdf`, `.txt`
- **Contador de palabras y caracteres** en tiempo real
- **Accesibilidad completa**: roles ARIA, live regions, focus visible, soporte NVDA

## ♿ Accesibilidad

- Todos los controles tienen `aria-label` descriptivo en español
- Botones con `aria-pressed` para indicar estado activo
- Live region anuncia cambios importantes al lector de pantalla
- Navegación completa por teclado (Tab, Enter, Space)
- Contraste de color optimizado
- Compatible con NVDA en Firefox/Chrome

## 🛠️ Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **docx** — exportación a Word
- **jsPDF + html2canvas** — exportación a PDF
- **file-saver** — descarga de archivos

## 📦 Build para producción

```bash
npm run build
npm start
```

---

Desarrollado por **Dante Ezequiel Basilici** para la Esc. 2-006 Helen Keller.
