import { promises as fs } from 'fs';
import path from 'path';
import { createSafeId } from '../utils';

export interface FigmaData {
  document: {
    children: any[];
  };
  styles: Record<string, unknown>;
  imageAssets?: Record<string, string>;
}

export async function saveFigmaData(data: FigmaData, fileId: string): Promise<void> {
  try {
    // Create json directory if it doesn't exist
    const jsonDir = path.join(process.cwd(), 'json');
    await fs.mkdir(jsonDir, { recursive: true });

    // Save the Figma data
    const jsonPath = path.join(jsonDir, `figma-file-${createSafeId(fileId)}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Saved Figma data to ${jsonPath}`);

    // Create assets directory if it doesn't exist
    const assetsDir = path.join(process.cwd(), 'public', 'assets', 'figma');
    await fs.mkdir(assetsDir, { recursive: true });
  } catch (error) {
    console.error('Error saving Figma data:', error);
    throw error;
  }
}

export async function loadFigmaData(fileId: string): Promise<FigmaData> {
  try {
    const jsonPath = path.join(process.cwd(), 'json', `figma-file-${createSafeId(fileId)}.json`);
    const data = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading Figma data:', error);
    throw error;
  }
} 