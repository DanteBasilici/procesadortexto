"use client";

import { EditorProvider } from "@/components/editor/EditorContext";
import { Navbar } from "@/components/editor/Navbar";
import { EditorArea } from "@/components/editor/EditorArea";
import { Footer } from "@/components/editor/Footer";

export function AppShell() {
  return (
    <EditorProvider>
      <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
        <Navbar />
        <main
          className="flex-1 flex flex-col"
          id="main-content"
          role="main"
          aria-label="Área principal del procesador de texto"
        >
          <EditorArea />
        </main>
        <Footer />
      </div>
    </EditorProvider>
  );
}
