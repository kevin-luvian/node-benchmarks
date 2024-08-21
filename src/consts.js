const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "../output");
const CSV_10K = path.join(OUTPUT_DIR, "file10k.csv");
const CSV_100MB = path.join(OUTPUT_DIR, "file100mb.csv");
const CSV_500MB = path.join(OUTPUT_DIR, "file500mb.csv");

module.exports = {
  OUTPUT_DIR,
  CSV_10K,
  CSV_100MB,
  CSV_500MB,
};
