const path = require('path');
const fs = require('fs/promises');

async function encodeImageToBase64(imagePath) 
{
  try 
  {
    const absolutePath = path.join(process.cwd(), 'public', imagePath);
    const imageBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(imagePath).replace('.', '');

    return `data:image/${ext};base64,${imageBuffer.toString('base64')}`;
  } 
  
  catch (err) { throw err }
}

module.exports = encodeImageToBase64;