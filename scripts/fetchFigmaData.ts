import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envResult = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (envResult.error) {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

console.log('Environment loaded:', {
  hasAccessToken: !!process.env.FIGMA_ACCESS_TOKEN,
  hasFileId: !!process.env.FIGMA_FILE_ID,
  envPath: path.resolve(process.cwd(), '.env'),
  cwd: process.cwd()
});

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_ID) {
  throw new Error('Missing required environment variables. Please ensure FIGMA_ACCESS_TOKEN and FIGMA_FILE_ID are set in your .env file');
}

interface FigmaImage {
  url: string;
  fileName: string;
}

async function downloadImage(url: string | null, fileName: string): Promise<void> {
  // Skip if URL is null or invalid
  if (!url) {
    console.log(`Skipping ${fileName} - No valid URL provided`);
    return;
  }

  try {
    // Validate URL
    new URL(url);
  } catch (error) {
    console.log(`Skipping ${fileName} - Invalid URL format`);
    return;
  }

  const assetsDir = path.join(process.cwd(), 'public', 'assets', 'figma');
  
  // Create assets directory if it doesn't exist
  try {
    await fs.mkdir(assetsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
    return;
  }

  const filePath = path.join(assetsDir, fileName);
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 10000 // 10 second timeout
    });

    await fs.writeFile(filePath, response.data);
    console.log(`Downloaded: ${fileName}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`Error downloading ${fileName}: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
      }
    } else {
      console.log(`Error saving ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

async function getImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/images/${FIGMA_FILE_ID}?ids=${nodeIds.join(',')}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    );
    return response.data.images;
  } catch (error) {
    console.error('Error fetching image URLs:', error);
    throw error;
  }
}

function collectImageNodes(node: any, images: Set<string> = new Set()): string[] {
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    images.add(node.id);
  }

  if (node.children) {
    node.children.forEach((child: any) => collectImageNodes(child, images));
  }

  return Array.from(images);
}

async function main() {
  try {
    // Fetch Figma file data
    console.log('Fetching Figma file data...');
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_ID}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN
        }
      }
    );

    const figmaData = fileResponse.data;
    
    // Collect all image nodes
    const imageNodeIds = collectImageNodes(figmaData.document);
    console.log(`Found ${imageNodeIds.length} image nodes`);
    
    // Get image URLs
    console.log('Fetching image URLs...');
    const imageUrls = await getImageUrls(imageNodeIds);
    console.log(`Retrieved ${Object.keys(imageUrls).length} image URLs`);
    
    // Download all images
    console.log('Downloading images...');
    const imageDownloads: Promise<void>[] = [];
    
    for (const [nodeId, url] of Object.entries(imageUrls)) {
      const fileName = `${nodeId}.png`;
      imageDownloads.push(downloadImage(url, fileName));
    }
    
    // Wait for all downloads to complete, even if some fail
    await Promise.allSettled(imageDownloads);
    console.log('Image download process completed');
    
    // Add image URLs to the Figma data
    figmaData.imageAssets = imageUrls;

    // Save the complete Figma data
    const jsonDir = path.join(process.cwd(), 'json');
    try {
      await fs.mkdir(jsonDir, { recursive: true });
    } catch (error) {
      console.error('Error creating json directory:', error);
      throw error;
    }

    const jsonPath = path.join(jsonDir, `figma-file-${FIGMA_FILE_ID}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(figmaData, null, 2));
    console.log(`Saved Figma data to ${jsonPath}`);

    console.log('Successfully fetched Figma data and processed images!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 