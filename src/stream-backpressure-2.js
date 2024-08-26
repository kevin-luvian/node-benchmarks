const {
  promises: { pipeline },
  Writable,
  Readable,
} = require("stream");
const Bluebird = require("bluebird");
const { mockData } = require("./utils");

class MockReadable extends Readable {
  async _read(size) {
    for (let i = 0; i < 3_000_000; i++) {
      this.push(mockData(i));
      if (i % 1000 == 0) console.log(`pushed ${i} rows`);
    }
    this.push(null);
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
