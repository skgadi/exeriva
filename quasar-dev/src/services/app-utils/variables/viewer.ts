import * as math from "mathjs";

import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";

const displayNumber = (
  value: math.MathNumericType,
  type: GSK_VARIABLE_NUMBER["typeReal"],
  isImaginary: boolean,
) => {
  switch (type.showFormat) {
    case "decimal": {
      if (isImaginary) {
        const valueToDisplay = math.abs(math.round(value, type.roundTo));
        const sign = math.smaller(value, 0) ? "-" : "+";
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math.abs(math.round(value, type.roundTo)).toString()}`;
      } else {
        return math.round(value, type.roundTo).toString();
      }
    }
    case "fraction": {
      const fraction = math.fraction(value as number);
      if (isImaginary) {
        const sign = math.smaller(value, 0) ? "-" : "+";
        if (fraction.n === 0n) {
          return "";
        }
        if (fraction.n === fraction.d) {
          return `${sign}i`;
        }
        return `${sign}\\frac{i${fraction.n}}{${fraction.d}}`;
      } else {
        if (fraction.n === fraction.d) {
          return "1";
        }
        return `\\frac{${fraction.n}}{${fraction.d}}`;
      }
    }
    case "mixed-fraction": {
      const wholeNumber = Math.floor(Number(value));
      const fractionalPart = Number(value) - wholeNumber;
      if (isImaginary) {
        const sign = math.smaller(value, 0) ? "-" : "+";
        // if it is zero or 1 we have special cases
        if (wholeNumber === 0 && fractionalPart === 0) {
          return "";
        }
        if (wholeNumber === 0 && fractionalPart === 1) {
          return `${sign}i`;
        }
        if (wholeNumber === 1 && fractionalPart === 0) {
          return `${sign}i`;
        }
        if (fractionalPart === 0) {
          return `${sign}${wholeNumber}i`;
        }
        if (wholeNumber === 0) {
          return `${sign}\\frac{i${math.fraction(fractionalPart).n}}{${math.fraction(fractionalPart).d}}`;
        }
        return `${sign}i\\left(${wholeNumber}\\frac{${math.fraction(fractionalPart).n}}{${math.fraction(fractionalPart).d}}\\right)`;
      } else {
        if (fractionalPart === 0) {
          return wholeNumber.toString();
        }
        if (wholeNumber === 0) {
          return `\\frac{${math.fraction(fractionalPart).n}}{${math.fraction(fractionalPart).d}}`;
        }
        return `${wholeNumber}\\frac{${math.fraction(fractionalPart).n}}{${math.fraction(fractionalPart).d}}`;
      }
    }
    case "engineering": {
      if (isImaginary) {
        const sign = math.smaller(value, 0) ? "-" : "+";
        const valueToDisplay = math.abs(value);
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math
          .format(valueToDisplay, { notation: "engineering" })
          .replace(/e[+-]0+$/i, "")
          .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}")}`;
      }
      return math
        .format(value, { notation: "engineering" })
        .replace(/e[+-]0+$/i, "")
        .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}");
    }
    case "scientific": {
      if (isImaginary) {
        const sign = math.smaller(value, 0) ? "-" : "+";
        const valueToDisplay = math.abs(value);
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math
          .format(valueToDisplay, { notation: "exponential" })
          .replace(/e[+-]0+$/i, "")
          .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}")}`;
      }
      return math
        .format(value, { notation: "exponential" })
        .replace(/e[+-]0+$/i, "")
        .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}");
    }
    default:
      return "";
  }
};

export const displayVariable = (inVariable: GSK_VARIABLE_NUMBER) => {
  try {
    // make sure the variableValue is a mathjs matrix
    inVariable.variableValue = math.matrix(inVariable.variableValue);
    const valuesToDisplay = math.map(
      inVariable.variableValue,
      (value: math.MathNumericType) => {
        //return value.toString(2); // Display the value with 2 decimal places
        // if it is complex number, seperate the real and imaginary part and display them separately
        if (math.isComplex(value)) {
          const realPartOfValue = (value as math.Complex).re;
          const imaginaryPartOfValue = (value as math.Complex).im;
          return `${displayNumber(realPartOfValue, inVariable.typeReal, false)} ${displayNumber(imaginaryPartOfValue, inVariable.typeImaginary, true)}`.trim();
        }
        return `${displayNumber(value, inVariable.typeReal, false)}`;
      },
    );
    // Convert the matrix of display values to latex format
    if (inVariable.size[0] === 1 && inVariable.size[1] === 1) {
      inVariable.variableDisplayValue = valuesToDisplay.get([0, 0]);
    } else {
      let finalDisplayValue = "\\begin{bmatrix}";
      for (let i = 0; i < inVariable.size[0]; i++) {
        for (let j = 0; j < inVariable.size[1]; j++) {
          finalDisplayValue += valuesToDisplay.get([i, j]);
          if (j < inVariable.size[1] - 1) {
            finalDisplayValue += " & ";
          }
        }
        if (i < inVariable.size[0] - 1) {
          finalDisplayValue += " \\\\ ";
        }
      }
      finalDisplayValue += "\\end{bmatrix}";
      inVariable.variableDisplayValue = finalDisplayValue;
    }
  } catch (error) {
    console.error("Error displaying variable:", error);
    inVariable.variableDisplayValue = "Error";
  }
};
