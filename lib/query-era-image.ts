"use server";
import fs from "fs";
import path from "path";
import { Theme } from "@/components/themes";

export const getRandomImagePath = async (era?: Theme) => {
   // console.log("Server Action: getRandomImagePath")
   async function doStuff() {
      // const originalPath = path.join(process.cwd(), "public", "images").replace("./public", "")
      // const newPath = path.resolve(originalPath)


      const subDirs = ["hs", "uni", "man"];
      const subDir =
         era && era.imagePath
            ? era.imagePath
            : subDirs[Math.floor(Math.random() * subDirs.length)];
      process.env.pu
      const dirPath = path.join(process.cwd(), "public/images", subDir);
      const originalPath = dirPath.replace("./public", "");
      const newPath = path.resolve(originalPath);
      try {
         fs.accessSync(newPath);

      }
      catch (e) {
         console.log("Error: ", e)
      }
      try {
         const files = fs.readdirSync(newPath);
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
         return "/images/hs/2E659CA0-9183-4D48-ACC5-1D51885CB809.jpeg.jpg"
      }

   }

   return {
      promise: doStuff(),
   };
};
