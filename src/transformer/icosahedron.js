export function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
}

export function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  });
}

export function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal);
}

export function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

export const prepareIcosahedron = (frequencyData) => {
  // PREPARE AUDIO DATA
  const lowerHalfArray = frequencyData.slice(0, frequencyData.length / 2 - 1);

  const upperHalfArray = frequencyData.slice(
    frequencyData.length / 2 - 1,
    frequencyData.length - 1
  );

  const overallAvg = avg(frequencyData);

  const lowerMax = max(lowerHalfArray);
  const lowerAvg = avg(lowerHalfArray);
  const upperMax = max(upperHalfArray);
  const upperAvg = avg(upperHalfArray);

  const lowerMaxFr = lowerMax / lowerHalfArray.length;
  const lowerAvgFr = lowerAvg / lowerHalfArray.length;
  const upperMaxFr = upperMax / upperHalfArray.length;
  const upperAvgFr = upperAvg / upperHalfArray.length;

  // console.log(lowerMax, lowerAvg);

  return {
    lowerHalfArray,
    upperHalfArray,
    lowerAvg,
    upperAvg,
  };
};
