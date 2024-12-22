import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { saveFigmaData, type FigmaData } from './saveFigmaData';

if (!process.env.FIGMA_ACCESS_TOKEN || !process.env.FIGMA_FILE_ID) {
  throw new Error('Missing required environment variables: FIGMA_ACCESS_TOKEN or FIGMA_FILE_ID');
}

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

interface FigmaImage {
  url: string;
  fileName: string;
}

async function downloadImage(url: string, fileName: string): Promise<void> {
  const assetsDir = path.join(process.cwd(), 'public', 'assets', 'figma');
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    await fs.writeFile(path.join(assetsDir, fileName), response.data);
    console.log(`Downloaded: ${fileName}`);
  } catch (error) {
    console.error(`Error downloading image ${fileName}:`, error);
    throw error;
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

export async function fetchFigmaData(): Promise<FigmaData> {
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
    
    await Promise.all(imageDownloads);
    console.log('All images downloaded successfully');
    
    // Add image URLs to the Figma data
    figmaData.imageAssets = imageUrls;

    // Save the Figma data
    await saveFigmaData(figmaData, FIGMA_FILE_ID);

    return figmaData;
  } catch (error) {
    console.error('Error fetching Figma data:', error);
    throw error;
  }
} 