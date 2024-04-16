"use server";
import fs from 'fs';
import path from 'path';

export const getRandomImagePath = async (era) => {
    async function doStuff() {
        try {
            const subDirs = ["hs", "uni", "man"];
            const subDir = era && era.imagePath ? era.imagePath : subDirs[Math.floor(Math.random() * subDirs.length)];

            let files;
            try {
                files = fs.readdirSync('public/images/' + subDir);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.error('public/images/' + subDir + ' not found.');
                    return; // Optionally return a default image path or handle as needed
                }
                throw error;
            }

            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
            if (imageFiles.length === 0) {
                console.error('No image files found.');
                return; // Optionally handle the case where no images are found
            }

            const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
            return `/images/${subDir}/${randomImage}`;
        } catch (error) {
            console.error('Failed to get random image path:', error);
            // Handle or re-throw the error as needed
        }
    }

    return {
        promise: doStuff(),
    };
};
