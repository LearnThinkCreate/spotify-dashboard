"use server";
import fs from "fs";
import path from "path";
import { Theme } from "@/components/themes";
import { dir } from "console";

export const getRandomImagePath = async (era?: Theme) => {
   // console.log("Server Action: getRandomImagePath")
   async function doStuff() {
      // const originalPath = path.join(process.cwd(), "public", "images").replace("./public", "")
      // const newPath = path.resolve(originalPath)

      printDirectories(__dirname)
      printDirectories(__dirname + '/../')
      printDirectories(__dirname + '/../app')
      printDirectories(__dirname + '/../app/content')
      printDirectories(__dirname + '/../../')
      printDirectories(__dirname + '/../era-images')





      const subDirs = ["hs", "uni", "man"];
      const subDir =
         era && era.imagePath
            ? era.imagePath
            : subDirs[Math.floor(Math.random() * subDirs.length)];
      process.env.pu
      const dirPath = path.join(process.cwd(), "public/images", subDir);
      const originalPath = dirPath.replace("./public", "");
      const newPath = path.resolve(originalPath);
      const files = fs.readdirSync(__dirname + '/../');
      const imageFiles = files.filter((file) =>
         /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
      const randomImage =
         imageFiles[Math.floor(Math.random() * imageFiles.length)];
      const imagePath = `/images/${subDir}/${randomImage}`;
      return imagePath;
   }

   return {
      promise: doStuff(),
   };
};


const printDirectories = (dirPath) => {
   console.log('-----------------------')
   console.log('')

   const filesAndDirs = fs.readdirSync(dirPath);
 
   filesAndDirs.forEach(item => {
     const fullPath = path.join(dirPath, item);
     if (fs.statSync(fullPath).isDirectory()) {
       console.log(item);  // This prints the directory name
     }
   });
   console.log('')
 };