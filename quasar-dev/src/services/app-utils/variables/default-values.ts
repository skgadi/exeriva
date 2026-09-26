import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type {
  GSK_VARIABLE_DATE_TIME,
  GSK_VARIABLE_EXPRESSION,
  GSK_VARIABLE_NUMBER,
  GSK_VARIABLE_STRING,
} from "@/library/types/variables";
import * as math from "mathjs";

const generateEmptyNumber = (): GSK_VARIABLE_NUMBER => {
  return {
    type: "number",
    name: "",
    size: [1, 1],
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
    variableValue: math.matrix([[1]]),
    variableDisplayValue: "1",
  };
};

const generateEmptyExpression = (): GSK_VARIABLE_EXPRESSION => {
  return {
    type: "expression",
    name: "",
    expression: "1+1",
    variableValue: math.matrix([[2]]),
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
    size: [1, 1],
  };
};

const generateEmptyString = (): GSK_VARIABLE_STRING => {
  return {
    type: "string",
    name: "",
    values: "",
    options: [],
    size: [1, 1],
  };
};

const generateEmptyDateTime = (): GSK_VARIABLE_DATE_TIME => {
  return {
    type: "date-time",
    name: "",
    range: [new Date(), new Date()],
    format: "YYYY-MM-DD",
    size: [1, 1],
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
