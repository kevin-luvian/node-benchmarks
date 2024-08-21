const fs = require("fs");
const path = require("path");
const {
  promises: { pipeline, finished },
  Readable,
  Transform,
} = require("stream");
const csv = require("csv");
const through2Batch = require("through2-batch");
const { faker } = require("@faker-js/faker");

const OUTPUT_DIR = path.resolve(__dirname, "../output");
const CSV_10K = path.join(OUTPUT_DIR, "file10K.csv");
const CSV_100MB = path.join(OUTPUT_DIR, "file100mb.csv");
const CSV_500MB = path.join(OUTPUT_DIR, "file500mb.csv");

const generateCSV10K = async () => {
  if (fs.existsSync(CSV_10K)) return;
  console.log("Generating CSV 10K");

  let count = 0;
  const writer = fs.createWriteStream(CSV_10K);
  await pipeline(
    Readable.from(new Array(10_000)),
    new Transform({
      objectMode: true,
      transform: (_ch, _ec, cb) => {
        cb(null, {
          no: ++count,
          name: faker.person.fullName(),
          birthday: faker.date.birthdate(),
          uuid: faker.string.uuid(),
          description: faker.lorem.paragraphs(3),
          date: faker.date.anytime().toString(),
        });
      },
    }),
    csv.stringify({ header: true, delimiter: "," }),
    through2Batch.obj({ batchSize: 10_000 }),
    new Transform({
      objectMode: true,
      transform: (batch, _ec, cb) => {
        cb(null, Buffer.concat(batch));
      },
    }),
    writer
  );
  await finished(writer);
};

const generateCSV100MB = async () => {
  if (fs.existsSync(CSV_100MB)) return;
  console.log("Generating CSV 100MB");

  let count = 0;
  const writer = fs.createWriteStream(CSV_100MB);
  await pipeline(
    Readable.from(new Array(200_000)),
    new Transform({
      objectMode: true,
      transform: (_ch, _ec, cb) => {
        cb(null, {
          no: ++count,
          name: faker.person.fullName(),
          birthday: faker.date.birthdate(),
          uuid: faker.string.uuid(),
          description: faker.lorem.paragraphs(3),
          date: faker.date.anytime().toString(),
        });
      },
    }),
    csv.stringify({ header: true, delimiter: "," }),
    through2Batch.obj({ batchSize: 10_000 }),
    new Transform({
      objectMode: true,
      transform: (batch, _ec, cb) => {
        cb(null, Buffer.concat(batch));
      },
    }),
    writer
  );
  await finished(writer);
};

const generateCSV500MB = async () => {
  if (fs.existsSync(CSV_500MB)) return;
  console.log("Generating CSV 500MB");

  let count = 0;
  const writer = fs.createWriteStream(CSV_500MB);
  await pipeline(
    Readable.from(new Array(1_000_000)),
    new Transform({
      objectMode: true,
      transform: (_ch, _ec, cb) => {
        cb(null, {
          no: ++count,
          name: faker.person.fullName(),
          birthday: faker.date.birthdate(),
          uuid: faker.string.uuid(),
          description: faker.lorem.paragraphs(3),
          date: faker.date.anytime().toString(),
        });
      },
    }),
    csv.stringify({ header: true, delimiter: "," }),
    through2Batch.obj({ batchSize: 10_000 }),
    new Transform({
      objectMode: true,
      transform: (batch, _ec, cb) => {
        cb(null, Buffer.concat(batch));
      },
    }),
    writer
  );
  await finished(writer);
};

const main = async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  await generateCSV10K();
  await generateCSV100MB();
  await generateCSV500MB();
};

main()
  .then(() => console.log("ok"))
  .catch((err) => console.error(err))
  .finally(() => console.log("process finished"));
