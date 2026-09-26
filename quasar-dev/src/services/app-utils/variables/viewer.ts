import * as math from "mathjs";

import type {
  GSK_VARIABLE_EXPRESSION,
  GSK_VARIABLE_NUMBER,
} from "@/library/types/variables";
import { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import { variableRegex } from "@/services/app-utils/variables/generator";

const displayNumber = (
  value: math.MathNumericType,
  type: GSK_VARIABLE_NUMBER["typeReal"],
  isImaginary: boolean,
) => {
  switch (type.showFormat) {
    case "decimal": {
      if (isImaginary) {
        const valueToDisplay = math.abs(math.round(value, type.displayRoundTo));
        const sign = math.smaller(value, 0) ? "-" : "+";
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math.abs(math.round(value, type.displayRoundTo)).toString()}`;
      } else {
        return math.round(value, type.displayRoundTo).toString();
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
        const valueToDisplay = math.abs(Number(value));
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math
          .format(valueToDisplay, {
            notation: "engineering",
            precision: type.displayRoundTo,
          })
          .replace(/e[+-]0+$/i, "")
          .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}")}`;
      }

      return math
        .format(math.number(value as number), {
          notation: "engineering",
          fraction: "decimal",
          precision: type.displayRoundTo,
        })
        .replace(/e[+-]0+$/i, "")
        .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}");
    }
    case "scientific": {
      if (isImaginary) {
        const sign = math.smaller(value, 0) ? "-" : "+";
        const valueToDisplay = math.abs(Number(value));
        if (valueToDisplay === 0) {
          return "";
        }
        if (valueToDisplay === 1) {
          return `${sign}i`;
        }
        return `${sign}i${math
          .format(math.number(valueToDisplay), {
            notation: "exponential",
            fraction: "decimal",
            precision: type.displayRoundTo,
          })
          .replace(/e[+-]0+$/i, "")
          .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}")}`;
      }
      return math
        .format(math.number(value as number), {
          notation: "exponential",
          fraction: "decimal",
          precision: type.displayRoundTo,
        })
        .replace(/e[+-]0+$/i, "")
        .replace(/e\+?(-?\d+)/i, " \\times 10^{$1}");
    }
    default:
      return "";
  }
};

export const displayVariable = (
  inVariable: GSK_VARIABLE_NUMBER | GSK_VARIABLE_EXPRESSION,
) => {
  try {
    if (math.isComplex(inVariable.variableValue)) {
      const realPartOfValue = (inVariable.variableValue as math.Complex).re;
      const imaginaryPartOfValue = (inVariable.variableValue as math.Complex)
        .im;
      inVariable.variableDisplayValue =
        `${displayNumber(realPartOfValue, inVariable.typeReal, false)} ${displayNumber(imaginaryPartOfValue, inVariable.typeImaginary, true)}`.trim();
    }
    inVariable.variableDisplayValue = `${displayNumber(inVariable.variableValue, inVariable.typeReal, false)}`;
  } catch {
    //console.warn("Error displaying variable:", error);
    inVariable.variableDisplayValue = "Error";
  }
};

export const changeVariableNamesToValues = (
  inContent: string,
  variables: GSK_DRAFT_ELEMENT["variables"],
) => {
  const outContent = inContent.replace(variableRegex, (match, variableName) => {
    const variable = variables.find((v) => v.name === variableName);
    if (variable) {
      return variable.variableDisplayValue;
    }
    return match; // If variable not found, return the original match
  });
  return outContent;
};
