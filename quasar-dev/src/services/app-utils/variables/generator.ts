import type {
  GSK_NUMBER_TYPE,
  GSK_VARIABLE_NUMBER,
} from "@/library/types/variables";
import * as math from "mathjs";
import { displayVariable } from "@/services/app-utils/variables/viewer";

export const extractVariablesFromText = (text: string) => {
  // Variable is indicated when a word starts with #
  // If it starts with \# it means the # is escaped and should not be treated as a variable
  const variableRegex = /(?<!\\)#(\w+)/g;
  const variables: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = variableRegex.exec(text)) !== null) {
    const variableName = match[1];
    if (variableName !== undefined && !variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
};

export const getRandomNumber = (
  range: [number, number],
  type: GSK_NUMBER_TYPE,
) => {
  try {
    const [min, max] = range;
    if (min === max) {
      return min;
    }
    if (min > max) {
      throw new Error("Invalid range: min is greater than max");
    }
    switch (type.type) {
      case "integer": {
        return math.randomInt(min, max + 1);
      }
      case "decimal": {
        const number = math.random(min, max);
        return math.round(number, type.roundTo);
      }
      case "rational": {
        // Numerator of size round to
        const numerator = math.randomInt(
          1,
          Math.pow(10, type.fractionNumeratorDigits),
        );

        const denominatorAbsoluteMax = Math.pow(
          10,
          type.fractionNumeratorDigits + 1,
        );
        const denominatorClosestToZero = 1 / denominatorAbsoluteMax;
        const denominatorRangeMax = getValueBetweenRangeForDenominator(
          numerator / range[0],
          denominatorAbsoluteMax,
          denominatorClosestToZero,
        );
        const denominatorRangeMin = getValueBetweenRangeForDenominator(
          numerator / range[1],
          denominatorAbsoluteMax,
          denominatorClosestToZero,
        );
        /*
      const denominatorRangeCalcMin =
        math.sign(denominatorRangeMin) *
        Math.min(math.abs(denominatorRangeMin), denominatorAbsoluteMax);
      const denominatorRangeCalcMax =
        math.sign(denominatorRangeMax) *
        Math.min(math.abs(denominatorRangeMax), denominatorAbsoluteMax);
        */
        // Thre will be two ranges.
        const denominatorRangeFinalRange = getDenominatorsRange(
          [denominatorRangeMin, denominatorRangeMax],
          denominatorAbsoluteMax,
          denominatorClosestToZero,
        );

        const denominator = selectANumberFromRangeOnLogScale(
          denominatorRangeFinalRange,
        );
        const denFactor =
          math.abs(denominator) < 1 ? 1 / math.abs(denominator) : 1;
        const finalDenominator = math.round(denominator * denFactor) | 1;
        const finalNumerator = math.round(numerator * denFactor);
        return math.fraction(finalNumerator, finalDenominator);
      }
    }
  } catch (error) {
    console.error("Error in getRandomNumber:", error);
    return math.random(range[0], range[1]); // Fallback to a random number in the range
  }
};

const getValueBetweenRangeForDenominator = (
  a: number,
  absoluteMax: number,
  closestToZero: number,
) => {
  if (a < 0) {
    if (a > -closestToZero) {
      return -closestToZero;
    }
    if (a < -absoluteMax) {
      return -absoluteMax;
    }
    return a;
  }
  if (a > 0) {
    if (a < closestToZero) {
      return closestToZero;
    }
    if (a > absoluteMax) {
      return absoluteMax;
    }
    return a;
  }
  return 0;
};

const getDenominatorsRange = (
  denominatorRange: [number, number],
  absoluteMax: number,
  closestToZero: number,
): [number, number] => {
  const [denominatorMin, denominatorMax] = denominatorRange;

  if (denominatorMax === 0) {
    return [denominatorMin, -closestToZero];
  }
  if (denominatorMin === 0) {
    return [closestToZero, denominatorMax];
  }
  if (
    (denominatorMax < 0 && denominatorMin < 0) ||
    (denominatorMax > 0 && denominatorMin > 0)
  ) {
    return [denominatorMin, denominatorMax];
  }
  // The only case left is when range is crossing zero
  // As per the configuration the negative number is with denominatorMax and the positive number is with denominatorMin
  const absNegative = math.abs(denominatorMax);
  const absPositive = math.abs(denominatorMin);
  // Give more weight to the larger range.
  const weight = absNegative / (absNegative + absPositive);
  if (math.random() < weight) {
    // Choose negative range

    return [-absoluteMax, denominatorMax];
  }
  // Choose positive range
  return [denominatorMin, absoluteMax];
};

const selectANumberFromRangeOnLogScale = (range: [number, number]): number => {
  const [min, max] = range;
  // the both range should be same sign and not zero
  if (min === 0 || max === 0 || (min < 0 && max > 0) || min > max) {
    throw new Error("Invalid range for log scale");
  }
  const sign = min < 0 ? -1 : 1;
  const logMin = math.log(math.abs(min));
  const logMax = math.log(math.abs(max));
  const randomLogValue = math.random(logMin, logMax);
  return sign * math.exp(randomLogValue);
};

export const generateRandomNumber = (inVariable: GSK_VARIABLE_NUMBER) => {
  inVariable.variableValue = math.zeros(
    inVariable.size[0],
    inVariable.size[1],
  ) as math.Matrix;
  for (let i = 0; i < inVariable.size[0]; i++) {
    for (let j = 0; j < inVariable.size[1]; j++) {
      const realPart = getRandomNumber(
        inVariable.rangeReal,
        inVariable.typeReal,
      );
      if (inVariable.isComplex) {
        const imaginaryPart = getRandomNumber(
          inVariable.rangeImaginary,
          inVariable.typeImaginary,
        );
        inVariable.variableValue.set(
          [i, j],
          math.complex(math.number(realPart), math.number(imaginaryPart)),
        );
      } else {
        inVariable.variableValue.set([i, j], realPart);
      }
    }
  }
  //console.log("Generated variable value:", inVariable.variableValue);
  displayVariable(inVariable);
};
