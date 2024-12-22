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

interface FigmaImageResponse {
  images: Record<string, string>;
}

const fetchFigmaFile = async (fileId: string): Promise<FigmaFile> => {
  if (!process.env.FIGMA_ACCESS_TOKEN) {
    throw new Error('FIGMA_ACCESS_TOKEN is required');
  }

  const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: {
      'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
    }
  });

  const data = await response.json() as FigmaFile;
  return data;
};

const fetchFigmaImages = async (fileId: string, nodeIds: string[]): Promise<Record<string, string>> => {
  if (!process.env.FIGMA_ACCESS_TOKEN) {
    throw new Error('FIGMA_ACCESS_TOKEN is required');
  }

  const response = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${nodeIds.join(',')}`,
    {
      headers: {
        'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
      }
    }
  );

  const data = await response.json() as FigmaImageResponse;
  return data.images;
};

const findImageNodes = (node: FigmaNode): FigmaNode[] => {
  const images: FigmaNode[] = [];
  
  if (node.type === 'FRAME' || node.type === 'GROUP') {
    node.children?.forEach(child => {
      images.push(...findImageNodes(child));
    });
  } else if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    images.push(node);
  }
  
  return images;
};

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

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
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
    const figmaFile = await fetchFigmaFile(FIGMA_FILE_ID);

    const imageNodes = findImageNodes(figmaFile.document);
    console.log(`Found ${imageNodes.length} image nodes`);

    const nodeIds = imageNodes.map(node => node.id);
    const imageUrls = await fetchFigmaImages(FIGMA_FILE_ID, nodeIds);

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