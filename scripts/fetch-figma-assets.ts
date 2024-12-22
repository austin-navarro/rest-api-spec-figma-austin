import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_ID) {
  console.error('Error: FIGMA_ACCESS_TOKEN and FIGMA_FILE_ID must be set in .env file');
  process.exit(1);
}

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const COMPONENTS_DIR = path.join(__dirname, '../src/components/icons');

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaFile {
  document: {
    children: FigmaNode[];
  };
}

async function getFigmaFile(): Promise<FigmaFile> {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma file: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Figma file:', error);
    throw error;
  }
}

async function getImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  try {
    const response = await fetch(
      `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${nodeIds.join(',')}&format=svg`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image URLs: ${response.statusText}`);
    }

    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error fetching image URLs:', error);
    throw error;
  }
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
  } catch (error) {
    console.error(`Error downloading image to ${filepath}:`, error);
    throw error;
  }
}

function findImageNodes(node: FigmaNode, images: FigmaNode[] = []): FigmaNode[] {
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    images.push(node);
  }

  if (node.children) {
    node.children.forEach(child => findImageNodes(child, images));
  }

  return images;
}

function sanitizeComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[a-z]/, letter => letter.toUpperCase());
}

async function generateReactComponent(node: FigmaNode): Promise<string> {
  const componentName = sanitizeComponentName(node.name);

  return `import React from 'react';
import { cn } from '@/lib/utils';

interface ${componentName}Props extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const ${componentName} = React.forwardRef<SVGSVGElement, ${componentName}Props>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <use href="/assets/icons/${node.name}.svg#icon" />
      </svg>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function main() {
  try {
    // Create directories
    await Promise.all([
      ensureDirectoryExists(ASSETS_DIR),
      ensureDirectoryExists(IMAGES_DIR),
      ensureDirectoryExists(ICONS_DIR),
      ensureDirectoryExists(COMPONENTS_DIR),
    ]);

    console.log('Fetching Figma file...');
    const figmaFile = await getFigmaFile();

    const imageNodes = findImageNodes(figmaFile.document);
    console.log(`Found ${imageNodes.length} image nodes`);

    const nodeIds = imageNodes.map(node => node.id);
    const imageUrls = await getImageUrls(nodeIds);

    for (const node of imageNodes) {
      const imageUrl = imageUrls[node.id];
      if (!imageUrl) {
        console.warn(`No URL found for node ${node.name}`);
        continue;
      }

      const filename = `${node.name}.svg`;
      const filepath = path.join(
        node.type === 'COMPONENT' ? ICONS_DIR : IMAGES_DIR,
        filename
      );

      console.log(`Downloading ${filename}...`);
      await downloadImage(imageUrl, filepath);

      if (node.type === 'COMPONENT') {
        const componentCode = await generateReactComponent(node);
        const componentPath = path.join(
          COMPONENTS_DIR,
          `${sanitizeComponentName(node.name)}.tsx`
        );
        await fs.writeFile(componentPath, componentCode);
      }
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 