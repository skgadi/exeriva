import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type {
  GSK_VARIABLE_DATE_TIME,
  GSK_VARIABLE_EXPRESSION,
  GSK_VARIABLE_NUMBER,
  GSK_VARIABLE_STRING,
} from "@/library/types/variables";
import { extractVariablesFromText } from "@/services/app-utils/variables/generator";

const generateEmptyNumber = (): GSK_VARIABLE_NUMBER => {
  return {
    type: "number",
    name: "",
    rangeReal: [1, 9],
    rangeImaginary: [1, 9],
    typeReal: {
      type: "integer",
      showFormat: "decimal",
      roundTo: 2,
      displayRoundTo: 2,
      fractionNumeratorDigits: 1,
    },
    typeImaginary: {
      type: "integer",
      showFormat: "decimal",
      roundTo: 2,
      displayRoundTo: 2,
      fractionNumeratorDigits: 1,
    },
    isComplex: false,
    variableValue: 1,
    variableDisplayValue: "1",
  };
};

const generateEmptyExpression = (): GSK_VARIABLE_EXPRESSION => {
  return {
    type: "expression",
    name: "",
    expression: "1+1",
    variableValue: 2,
    variableDisplayValue: "2",
    typeReal: {
      type: "integer",
      showFormat: "decimal",
      roundTo: 2,
      displayRoundTo: 2,
      fractionNumeratorDigits: 1,
    },
    typeImaginary: {
      type: "integer",
      showFormat: "decimal",
      roundTo: 2,
      displayRoundTo: 2,
      fractionNumeratorDigits: 1,
    },
  };
};

const generateEmptyString = (): GSK_VARIABLE_STRING => {
  return {
    type: "string",
    name: "",
    values: "",
    options: [],
    variableDisplayValue: "",
    variableValue: "",
  };
};

const generateEmptyDateTime = (): GSK_VARIABLE_DATE_TIME => {
  return {
    type: "date-time",
    name: "",
    range: [new Date(), new Date()],
    format: "YYYY-MM-DD",
    variableDisplayValue: "",
    variableValue: new Date(),
  };
};

export const getDefaultValue = (
  type: GSK_DRAFT_ELEMENT["variables"][0]["type"],
): GSK_DRAFT_ELEMENT["variables"][0] => {
  switch (type) {
    case "number":
      return generateEmptyNumber();
    case "expression":
      return generateEmptyExpression();
    case "string":
      return generateEmptyString();
    case "date-time":
      return generateEmptyDateTime();
  }
};

export const updateVariables = (inElement: GSK_DRAFT_ELEMENT) => {
  const variablesInElement = extractVariablesFromText(inElement.text);
  // variablesInElement is the correct one. We keep the order from draftElements.variables
  // but we also add any new variables that are in the text but not in the variables array
  // We also remove any variables that are in the variables array but not in the text
  const newVariables = variablesInElement.filter(
    (variable) => !inElement.variables.some((v) => v.name === variable),
  );
  const removedVariables = inElement.variables.filter(
    (variable) => !variablesInElement.includes(variable.name),
  );
  inElement.variables = [
    ...inElement.variables.filter(
      (variable) => !removedVariables.some((v) => v.name === variable.name),
    ),

    ...newVariables.map((variable) => {
      const newVariable = getDefaultValue("number");
      newVariable.name = variable;
      return newVariable;
    }),
  ];
};
