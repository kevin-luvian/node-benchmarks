/**
 * @param {number} d
 * @return {string}
 */
const msToHms = (d) => {
  const totalMilliseconds = Number(d);
  const milliseconds = totalMilliseconds % 1000;

  d = Math.floor(totalMilliseconds / 1000);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  // Combine seconds and milliseconds into one value
  const sCombined = s + milliseconds / 1000;

  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = sCombined > 0 ? sCombined.toFixed(2) + " seconds" : "";

  return hDisplay + mDisplay + sDisplay;
};

const highlandToPromise = (stream) => {
  return new Promise((resolve, reject) => {
    stream.stopOnError(reject).done(resolve);
  });
};

module.exports = { msToHms,highlandToPromise };
