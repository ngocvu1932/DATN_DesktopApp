// src/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      savePdf: (pdfData: string) => Promise<string>;
    };
  }
}
