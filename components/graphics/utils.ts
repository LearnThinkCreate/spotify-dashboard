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


  export { 
    formatXAxis, 
    percentFormatter, 
    decibelFormatter, 
    tempoFormatter,
    hoursFormatter, 
  }