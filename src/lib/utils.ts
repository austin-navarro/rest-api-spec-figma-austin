import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFigmaTokenName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function pxToRem(px: number): string {
  return `${px / 16}rem`
}

export function colorToRGB(color: { r: number; g: number; b: number; a?: number }): string {
  const { r, g, b, a = 1 } = color;
  const rgb = `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`;
  return a === 1 ? `rgb(${rgb})` : `rgba(${rgb} / ${a})`;
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function createSafeId(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getImageDimensions(
  width: number,
  height: number,
  maxWidth: number = 1200,
  maxHeight: number = 800
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
} 