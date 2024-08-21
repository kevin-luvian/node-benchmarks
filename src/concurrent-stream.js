const {
  promises: { pipeline },
  Writable,
} = require("stream");
const fs = require("fs");
const csv = require("csv");
const { msToHms, highlandToPromise } = require("./utils");
const { CSV_10K } = require("./consts");
const _ = require("highland");

const run = async () => {
  const startTime = performance.now();
  let count = 0;
  const hStream = _(
    fs.createReadStream(CSV_10K).pipe(
      csv.parse({
        columns: true,
        delimiter: ",",
        encoding: "utf8",
        relaxColumnCount: true,
      })
    )
  )
    .map(
      _.wrapCallback(async (data, cb) => {
        setTimeout(() => {
          count++;
          cb(null, data);
        }, 1);
      })
    )
    .parallel(5);
  await highlandToPromise(hStream);
  const elapsedTime = performance.now() - startTime;
  console.log(`Finished processing ${count} rows, took: ${msToHms(elapsedTime)}`);
  return elapsedTime;
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
