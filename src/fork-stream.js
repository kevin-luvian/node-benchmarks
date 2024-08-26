const {
  promises: { pipeline, finished },
  Writable,
  PassThrough,
} = require("stream");
const fs = require("fs");
const csv = require("csv");
const _ = require("highland");
const { msToHms, highlandToPromise } = require("./utils");
const { CSV_10K } = require("./consts");

class WritableDB extends Writable {
  _write(_chunk, _ec, callback) {
    callback();
  }
}

class WritableS3 extends Writable {
  _write(_chunk, _ec, callback) {
    callback();
  }
}

const writeDB = () => {};

const writeS3 = () => {};

const runHighland = async () => {
  const source = _(
    fs.createReadStream(CSV_10K).pipe(
      csv.parse({
        columns: true,
        delimiter: ",",
        encoding: "utf8",
        relaxColumnCount: true,
      })
    )
  );
  const hStream = _([source.fork().map(writeDB), source.fork().map(writeS3)]).merge();
  await highlandToPromise(hStream);
};

const run = async () => {
  const source = fs.createReadStream(CSV_10K).pipe(
    csv.parse({
      columns: true,
      delimiter: ",",
      encoding: "utf8",
      relaxColumnCount: true,
    })
  );
  const forkStream = new PassThrough({ objectMode: true });
  await Promise.all([
    pipeline(forkStream, new WritableDB()),
    pipeline(forkStream, new WritableS3()),
    pipeline(source, forkStream), // there are no backpressure to 'source'
  ]);
  await finished(source);
};

runHighland();
