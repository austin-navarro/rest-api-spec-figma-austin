import * as dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const fileId = process.env.FIGMA_FILE_ID;
const token = process.env.FIGMA_ACCESS_TOKEN;

console.log('Using File ID:', fileId);
console.log('Using Token:', token ? token.substring(0, 10) + '...' : 'undefined');

const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${fileId}`,
  method: 'GET',
  headers: {
    'X-Figma-Token': token
  }
};

console.log('Making request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response data:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.error('Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end(); 