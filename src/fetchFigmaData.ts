import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN is not set in .env file');
  process.exit(1);
}

async function fetchFigmaFile(fileId: string) {
  try {
    const response = await axios.get(`https://api.figma.com/v1/files/${fileId}`, {
      headers: {
        'X-Figma-Token': FIGMA_ACCESS_TOKEN
      }
    });

    // Create json directory if it doesn't exist
    const jsonDir = path.join(process.cwd(), 'json');
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir);
    }

    // Save the response to a JSON file
    const filePath = path.join(jsonDir, `figma-file-${fileId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    
    console.log(`Successfully saved Figma file data to ${filePath}`);
  } catch (error: any) {
    if (error?.response?.data) {
      console.error('Error fetching Figma file:', error.response.data);
    } else {
      console.error('Error:', error?.message || 'Unknown error occurred');
    }
  }
}

const fileId = 'v74HvPqSUwK5i6fhfIbU2z';
fetchFigmaFile(fileId); 