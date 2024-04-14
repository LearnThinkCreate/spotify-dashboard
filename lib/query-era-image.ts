"use server"
import fs from 'fs';
import path from 'path';
import { Theme } from "@/components/themes";

export const getRandomImagePath = (era?: Theme) => {
  const subDirs = ['hs', 'uni',  'man'];
  const subDir = era && era.imagePath ? era.imagePath : subDirs[Math.floor(Math.random() * subDirs.length)];
  const dirPath = path.join(process.cwd(), 'public', 'images', subDir);
  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
  const imagePath = `/images/${subDir}/${randomImage}`;
  return imagePath;
}