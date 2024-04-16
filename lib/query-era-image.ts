"use server";
// import fs from "fs";
import * as fs from 'fs/promises';
import path from "path";
import { Theme } from "@/components/themes";

export const getRandomImagePath = async (era?: Theme) => {
   // console.log("Server Action: getRandomImagePath")
   async function doStuff() {
      // const originalPath = path.join(process.cwd(), "public", "images").replace("./public", "")
      // const newPath = path.resolve(originalPath)

      const currentDir = process.cwd();
      const filesAndDirs = await fs.readdir(currentDir);

      for (const item of filesAndDirs) {
         const fullPath = path.join(currentDir, item);
         const isDir = await fs.stat(fullPath).then(stat => stat.isDirectory());
         if (isDir) {
            console.log(item);  // This prints the directory name
         }
      }

      console.log('------------------')

      const subDirs = ["hs", "uni", "man"];
      const subDir =
         era && era.imagePath
            ? era.imagePath
            : subDirs[Math.floor(Math.random() * subDirs.length)];
      process.env.pu
      const dirPath = path.resolve(process.cwd(), "era-images", subDir);
      try {
         // fs.accessSync(dirPath);
         // fs.readdir(path.resolve(process.cwd(), "era-images", subDir))
      }
      catch (e) {
         console.log("Error: ", e)
      }
      try {
         const files = await fs.readdir(path.resolve(process.cwd(), "era-images", subDir))
         const imageFiles = files.filter((file) =>
            /\.(jpg|jpeg|png|gif)$/i.test(file)
         );
         const randomImage =
            imageFiles[Math.floor(Math.random() * imageFiles.length)];
         const imagePath = `/images/${subDir}/${randomImage}`;
         return imagePath;
      }
      catch (e) {
         console.log("Error: ", e)
         return "/images/hs/2E659CA0-9183-4D48-ACC5-1D51885CB809.jpeg"
      }

   }

   return {
      promise: doStuff(),
   };
};
