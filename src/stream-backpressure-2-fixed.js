const {
  promises: { pipeline },
  Writable,
  Readable,
} = require("stream");
const Bluebird = require("bluebird");
const { mockData } = require("./utils");

class MockReadable extends Readable {
  count = 0;

  async _read(size) {
    for (let i = 0; i < size; i++) {
      if (this.count++ > 3_000_000) return this.push(null);

      this.push(mockData(this.count));
      if (this.count % 1000 == 0) console.log(`pushed ${this.count} rows, size: ${size}`);
    }
  }
}

const main = async () => {
  await Bluebird.delay(2000);
  await pipeline(
    new MockReadable({ objectMode: true }),
    new Writable({
      objectMode: true,
      write: (_chunk, _ec, callback) => {
        callback();
      },
    })
  );
};

console.log("process started");
main()
  .catch(console.error)
  .finally(() => console.log("process finished"));
