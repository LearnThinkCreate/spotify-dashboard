import { themes, Theme } from "@/components/themes";

const formatXAxis = (tickItem: string) => {
  // Convert the date string to a Date object
  const date = new Date(tickItem);
  // Return the year part
  return date.getFullYear();
};

const percentFormatter = (value: string) => (parseFloat(value) * 100).toFixed(0) + "%" as string;

const decibelFormatter = (value: string) => parseFloat(value).toFixed(2) + "dB" as string;

const tempoFormatter = (value: string) => parseFloat(value).toFixed(0) + " BPM" as string;

const hoursFormatter = (value: string) => parseFloat(value).toFixed(2) as string;

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and pad with zeros
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const getHexCodes = (theme: Theme, mode: string) => {
  if (!theme) return {};
  let hexCodes = {};
  for (const key in theme.cssVars[mode]) {
      const [h, s, l] = theme.cssVars[mode][key].split(' ').map(element => parseFloat(element.replace('%', '')));;
      hexCodes[key] = hslToHex(h, s, l);
    }
  return hexCodes;
}

  export { 
    formatXAxis, 
    percentFormatter, 
    decibelFormatter, 
    tempoFormatter,
    hoursFormatter, 
    hslToHex, 
    toTitleCase,
    getHexCodes  
  }