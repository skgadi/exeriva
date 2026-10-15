import * as math from "mathjs";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";

export const interpretUserInput = (input: string): math.MathNumericType => {
  try {
    const parser = math.parser();
    const result = parser.evaluate(input);

    const type = math.typeOf(result);

    if (
      type !== "number" &&
      type !== "Complex" &&
      type !== "BigNumber" &&
      type !== "Fraction"
    ) {
      return NaN;
    }

    return result as math.MathNumericType;
  } catch (error) {
    console.warn(`Error interpreting user input: ${input}`, error);
    return NaN;
  }
};

const isValidNumericValue = (value: math.MathNumericType): boolean => {
  switch (math.typeOf(value)) {
    case "number":
      return Number.isFinite(value as number);

    case "Complex": {
      const z = value as math.Complex;
      return Number.isFinite(z.re) && Number.isFinite(z.im);
    }

    case "BigNumber":
      return (value as math.BigNumber).isFinite();

    case "Fraction":
      return true;

    default:
      return false;
  }
};

export const isCorrectAnswer = (
  inExpression: GSK_VARIABLE_EXPRESSION,
): boolean => {
  try {
    if (!inExpression.studentAnswer) {
      return false;
    }

    const { studentInput, requiredPrecision } = inExpression.studentAnswer;

    if (!studentInput.trim() || !Number.isFinite(requiredPrecision)) {
      return false;
    }

    const studentValue = interpretUserInput(studentInput);
    const correctValue = inExpression.variableValue;

    if (
      !isValidNumericValue(studentValue) ||
      !isValidNumericValue(correctValue)
    ) {
      return false;
    }

    // For complex numbers, math.abs returns the magnitude:
    // |a + bi| = sqrt(a² + b²)
    const absoluteDifference = math.abs(
      math.subtract(studentValue, correctValue),
    );

    const tolerance = math.pow(10, -requiredPrecision);

    return math.smallerEq(absoluteDifference, tolerance) as boolean;
  } catch (error) {
    console.warn("[SKGadi]", "Error checking answer correctness", error);
    return false;
  }
};
