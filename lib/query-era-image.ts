"use server";
// import fs from "fs";
// import path from "path";
import { Theme } from "@/components/themes";
import prisma from "@/lib/db/prisma";


export const getRandomImagePath = async (era?: Theme) => {
   const subDirs = ["hs", "uni", "man"];
   const subDir =
      era && era.imagePath
         ? era.imagePath
         : subDirs[Math.floor(Math.random() * subDirs.length)];


   const query = `
   SELECT file_name FROM era_images
   WHERE era = '${subDir}'
   ORDER BY RANDOM()
   LIMIT 1;
   `
   const imagePath = await prisma.$queryRawUnsafe(query) as { file_name: string }[];
   return '/images/' +  subDir + "/" + imagePath[0].file_name as string;
};