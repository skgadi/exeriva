import * as math from "mathjs";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";

export const interpretUserInput = (input: string): math.MathNumericType => {
  // Implementation for interpreting user input
  // clear the mathjs parser and evaluate the input
  const parser = math.parser();
  try {
    const result = parser.evaluate(input);
    // if result is not MathNumericType, return NaN
    if (
      !(
        math.typeOf(result) === "number" ||
        math.typeOf(result) === "Complex" ||
        math.typeOf(result) === "BigNumber" ||
        math.typeOf(result) === "Fraction"
      )
    ) {
      return NaN;
    }
    return result;
  } catch (error) {
    console.warn(`Error interpreting user input: ${input}`, error);
    return NaN;
  }
};

export const isCorrectAnswer = (
  inExpression: GSK_VARIABLE_EXPRESSION,
): boolean => {
  if (!inExpression.studentAnswer) {
    return false;
  }
  const studentInput = inExpression.studentAnswer.studentInput;
  const requiredPrecision = inExpression.studentAnswer.requiredPrecision;

  const studentValue = interpretUserInput(studentInput);
  if (isNaN(studentValue as number)) {
    return false;
  }

  const correctValue = inExpression.variableValue;
  const absoluteDifference = math.abs(
    math.subtract(studentValue, correctValue),
  );

  const isSmaller = math.smallerEq(
    absoluteDifference,
    math.pow(10, -requiredPrecision),
  );
  console.log(
    inExpression.variableValue,
    studentValue,
    isSmaller,
    absoluteDifference,
    math.pow(10, -requiredPrecision),
  );
  return !!isSmaller;
};
