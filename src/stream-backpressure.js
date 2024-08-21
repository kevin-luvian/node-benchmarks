const {
  promises: { pipeline },
  Writable,
} = require("stream");
const fs = require("fs");
const csv = require("csv");
const Bluebird = require("bluebird");
const { CSV_500MB } = require("./consts");

class SlowWritable extends Writable {
  constructor() {
    super({ objectMode: true, highWaterMark: Number.MAX_SAFE_INTEGER });
  }

  _write(_ch, _ec, callback) {
    // Artificially delay the processing of each chunk
    setTimeout(() => {
      console.log("Finished accessing chunk, writable length:", this.writableLength);
      callback();
    }, 100);
    return true;
  }
}

const main = async () => {
  await Bluebird.delay(2000);
  await pipeline(
    fs.createReadStream(CSV_500MB),
    csv.parse({
      columns: true,
      delimiter: ",",
      encoding: "utf8",
      relaxColumnCount: true,
    }),
    new SlowWritable()
  );
};

console.log("process started");
main()
  .catch(console.error)
  .finally(() => console.log("process finished"));
