const {
  promises: { pipeline },
  Writable,
} = require("stream");
const fs = require("fs");
const csv = require("csv");
const { msToHms } = require("./utils");
const { CSV_10K } = require("./consts");

const run = async () => {
  const startTime = performance.now();
  let count = 0;
  await pipeline(
    fs.createReadStream(CSV_10K),
    csv.parse({
      columns: true,
      delimiter: ",",
      encoding: "utf8",
      relaxColumnCount: true,
    }),
    new Writable({
      objectMode: true,
      write: (data, _ec, cb) => {
        setTimeout(() => {
          count++;
          cb(null, data);
        }, 1);
      },
    })
  );
  const elapsedTime = performance.now() - startTime;
  console.log(`Finished processing ${count} rows, took: ${msToHms(elapsedTime)}`);
};

const main = async () => {
  const startTime = performance.now();
  const retries = 3;
  for (let i = 0; i < retries; i++) {
    await run();
  }
  console.log(`Finished processing ${retries} times, on average took: ${msToHms((performance.now() - startTime) / retries)}`);
};

console.log("process started");
main()
  .catch(console.error)
  .finally(() => console.log("process finished"));
