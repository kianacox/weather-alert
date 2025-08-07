import fs from "fs";
import readline from "readline";

const input = readline.createInterface({
  input: fs.createReadStream("../data/cities5000.txt"),
  crlfDelay: Infinity,
});

const output = [];

input.on("line", (line) => {
  const parts = line.split("\t");
  const city = parts[1];
  const country = parts[8];
  const lat = parseFloat(parts[4]);
  const lon = parseFloat(parts[5]);
  const population = parseInt(parts[14]);

  if (city && country && lat && lon) {
    output.push({ city, country, lat, lon, population });
  }
});

input.on("close", () => {
  // Sort by population descending
  output.sort((a, b) => b.population - a.population);
  // Trim to top 1000 cities
  const topCities = output
    .slice(0, 1000)
    .map(({ population, ...rest }) => rest);
  fs.writeFileSync("../public/cities.json", JSON.stringify(topCities, null, 2));
  console.log("Saved cities.json");
});
