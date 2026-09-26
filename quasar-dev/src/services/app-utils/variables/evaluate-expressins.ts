import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import * as math from "mathjs";

export const evaluateExpression = (
  variables: GSK_DRAFT_ELEMENT["variables"],
) => {
  const parser = math.parser();
  // the variables names will be changed to x_<index> to avoid conflicts with mathjs reserved words
  // link variable names to their given names
  const linkBetweenVariables = variables.reduce(
    (acc, variable, index) => {
      acc.push({ name: variable.name, index });
      return acc;
    },
    [] as { name: string; index: number }[],
  );
  variables.forEach((variable, index) => {
    if (variable.type === "number") {
      parser.set(`x_${index}`, variable.variableValue);
    }
    if (variable.type === "expression") {
      // Change the text from #variableName to x_<index> for mathjs to evaluate the expression
      const formattedExpression = variable.expression.replace(
        /#(\w+)/g,
        (match, variableName) => {
          const linkedVariable = linkBetweenVariables.find(
            (link) => link.name === variableName,
          );
          if (linkedVariable) {
            return `x_${linkedVariable.index}`;
          } else {
            throw new Error(
              `Variable ${variableName} not found in the draft element.`,
            );
          }
        },
      );
      // Evaluate the expression and set the variableValue
      try {
        const result = parser.evaluate(formattedExpression);
        // if the result is scalar, convert it to a 1x1 matrix
        if (math.isMatrix(result) === false) {
          const scalarMatrix = math.matrix([[result]]);
          parser.set(`x_${index}`, scalarMatrix);
          variable.variableValue = scalarMatrix;
          variable.size = [1, 1];
          return;
        }
        // set the result to x_<index> for future evaluations
        parser.set(`x_${index}`, result);
        variable.variableValue = result;
        variable.size = [result.size()?.[0] || 1, result.size()?.[1] || 1];
      } catch (error) {
        console.warn(
          `Error evaluating expression for variable ${variable.name}:`,
          error,
        );
        parser.set(`x_${index}`, math.matrix([[NaN]]));
        variable.variableValue = math.matrix([[NaN]]);
        variable.size = [1, 1];
      }
    }
  });
};
