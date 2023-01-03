function realTimeMovingAverage(data, period) {
  const movingAverage = [];
  let dataToFloat = data.map((element) => parseFloat(element));

  for (let i = 0; i < dataToFloat.length; i++) {
    const start = Math.max(0, i - period);
    const end = i;
    const subset = dataToFloat.slice(start, end + 1);
    const sum = subset.reduce((a, b) => a + b, 0);
    movingAverage.push(sum / subset.length);
  }

  return movingAverage;
}

console.log(
  realTimeMovingAverage(
    [
      "-216.00",
      "-176.00",
      "-304.00",
      "-252.00",
      "-192.00",
      "-284.00",
      "-196.00",
      "-300.00",
      "-292.00",
      "-272.00",
    ].map((element) => parseFloat(element))
  ),
  5
);

export { realTimeMovingAverage };
