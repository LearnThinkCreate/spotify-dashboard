"use server";
import prisma from "@/lib/db/prisma";
import { Theme } from "@/components/themes";
import { eraFilters } from "@/lib/db/query-utils";

export const getEnergyLevel = async (era: Theme) => {
   console.log("Server Action: getEnergyLevel")
   async function doStuff () {
      const filter = eraFilters(era);
      const eraFilter = filter ? `where ${filter.join(' AND ')}` : '';
      const sigma = 0.1;
      const n = 10000;
      const numBins = 30;
  
     const energyQuery = `
     select 
        Sum(energy * hours_played) / SUM(hours_played) as value
     from spotify_data_overview
     `;
  
     const historicEnergy = await prisma.$queryRawUnsafe(energyQuery) as { value: number }[];
  
     if (!eraFilter) {
        return {
           value: (historicEnergy[0].value * 100).toFixed(0),
           delta: 0,
           data: generateSkewedDataAndBins(historicEnergy[0].value, sigma, n, numBins),
        }
     }
     
     const energy = await prisma.$queryRawUnsafe(energyQuery + ' ' + eraFilter) as { value: number }[];
  
     return {
        value: (energy[0].value * 100).toFixed(0) ,
        delta: ((energy[0].value - historicEnergy[0].value) / historicEnergy[0].value * 100).toFixed(0),
        data: generateSkewedDataAndBins(energy[0].value, sigma, n, numBins),
     }
   }

   return {
      promise: doStuff(),
    }
}


function skewedNormal(mu, sigma, alpha) {
    const u = Math.random();
    const v = Math.random();
    const z1 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
    const z2 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
 
    const delta = alpha / Math.sqrt(1 + alpha ** 2);
 
    const z = z1 * delta + z2 * (1 - delta * delta) ** 0.5;
    return mu + sigma * z;
 }
 
 function getSkewnessFactor(mu) {
    const k = 4; // Adjust 'k' to control skewness intensity
    return k * (mu - 0.5);
 }
 
 function generateSkewedData(mu, sigma, count) {
    const alpha = getSkewnessFactor(mu);
    const data = [] as any[];
 
    for (let i = 0; i < count; i++) {
       data.push(skewedNormal(mu, sigma, alpha));
    }
 
    for (let i = 0; i < count; i++) {
       data.push(skewedNormal(mu, sigma, alpha));
    }
    return data;
 }
 
 function generateSkewedDataAndBins(mu, sigma, count, numBins) {
    const data = generateSkewedData(mu, sigma, count);
 
    // Binning logic
    const binWidth = 1 / numBins;
    const bins = Array(numBins).fill(0); // Initialize bins with counts of 0
 
    for (let i = 0; i < data.length; i++) {
       const binIndex = Math.min(Math.floor(data[i] / binWidth), numBins - 1);
       bins[binIndex]++;
    }
 
    // Format for ReCharts
    const formattedData = bins.map((count, index) => ({
       binStart: index * binWidth, // Optional, if you want to display bin ranges
       value: count,
    }));
 
    return formattedData;
 }
 