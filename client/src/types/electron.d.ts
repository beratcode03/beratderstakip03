/**
 * BERAT CANKIR - YKS ANALİZ TAKİP SİSTEMİ
 * @author Berat Cankır
 * @copyright © 2025 Berat Cankır. Tüm hakları saklıdır.
 */

interface ElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  toggleFullscreen: () => void;
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => void;
  isElectron: boolean;
}

interface Window {
  electronAPI?: ElectronAPI;
}

// CANKIR