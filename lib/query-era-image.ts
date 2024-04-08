import fs from 'fs';
import path from 'path';

export const getRandomImagePath = () => {
    const subDirs = ['hs', 'uni',  'man']; // Add your subdirectories here
    const randomSubDir = subDirs[Math.floor(Math.random() * subDirs.length)]; // Pick a random subdirectory
  
    // Construct the path to the subdirectory
    const dirPath = path.join(process.cwd(), 'public', 'images', randomSubDir);
    
    // Read the directory contents
    const files = fs.readdirSync(dirPath);
  
    // Filter out non-image files if necessary
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  
    // Pick a random image file
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
  
    // Return the path to be used in the image src attribute
    return `/images/${randomSubDir}/${randomImage}`;
  };