const {
  promises: { pipeline },
  Duplex,
  Writable,
} = require("stream");
const fs = require("fs");
const csv = require("csv");
const { CSV_10K } = require("./consts");

class Throttle extends Duplex {
  constructor(time, opts) {
    super({ objectMode: true, ...opts });
    this.delay = time;
  }
  _read() {}
  _write(chunk, _ec, callback) {
    this.push(chunk);
    setTimeout(callback, this.delay);
  }
  _final() {
    this.push(null);
  }
}

class Batch extends Duplex {
  internalBuffer = [];
  constructor(size, opts) {
    super({ objectMode: true, ...opts });
    this.size = size;
  }
  _read() {}
  _write(chunk, _ec, callback) {
    if (this.internalBuffer.length < this.size) {
      this.internalBuffer.push(chunk);
    } else {
      this.push(this.internalBuffer);
      this.internalBuffer = [];
    }
    callback();
  }
  _final() {
    if (this.internalBuffer.length > 0) {
      this.push(this.internalBuffer);
    }
    this.push(null);
  }
}

const main = async () => {
  await pipeline(
    fs.createReadStream(CSV_10K),
    csv.parse({ columns: true }),
    new Batch(200),
    new Throttle(500),
    new Writable({
      objectMode: true,
      write: (chunk, _ec, callback) => {
        console.info(chunk.at(0));
        callback();
      },
    })
  );
};

main().catch(console.error);
