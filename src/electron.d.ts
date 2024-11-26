// src/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      savePdf: (pdfData: string, title: string) => Promise<any>;
      showAlertDialog: (message: string) => Promise<any>;
    };
  }
}
