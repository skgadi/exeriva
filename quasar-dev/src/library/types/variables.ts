import type { MathNumericType } from "mathjs";

export interface GSK_NUMBER_TYPE {
  type: "integer" | "rational" | "decimal";
  showFormat:
    | "engineering"
    | "scientific"
    | "decimal"
    | "fraction"
    | "mixed-fraction";
  roundTo: number;
  fractionNumeratorDigits: number;
  displayRoundTo: number;
}

interface GSK_VARIABLE_BASE {
  name: string;
  type: "number" | "expression" | "string" | "date-time";
  variableValue: MathNumericType | string | Date; // a mathjs representation of the variable value
  variableDisplayValue: string; // a LaTeX representation of the variableValue
}

export interface GSK_VARIABLE_NUMBER extends GSK_VARIABLE_BASE {
  type: "number";
  rangeReal: [number, number];
  rangeImaginary: [number, number];
  typeReal: GSK_NUMBER_TYPE;
  typeImaginary: GSK_NUMBER_TYPE;
  isComplex: boolean;
  variableValue: MathNumericType; // a mathjs representation of the variable value
}

// A mathematical expression with numerical values as output upon evaulated
export interface GSK_VARIABLE_EXPRESSION extends GSK_VARIABLE_BASE {
  type: "expression";
  name: string;
  expression: string;
  variableValue: MathNumericType; // a mathjs representation of the variable value
  variableDisplayValue: string; // a LaTeX representation of the variableValue
  typeReal: GSK_NUMBER_TYPE;
  typeImaginary: GSK_NUMBER_TYPE;
  studentAnswer?: GSK_STUDENT_ANSWER;
}

export interface GSK_VARIABLE_STRING extends GSK_VARIABLE_BASE {
  type: "string";
  name: string;
  values: string;
  options: string[];
  variableDisplayValue: string;
  variableValue: string;
}

export interface GSK_VARIABLE_DATE_TIME extends GSK_VARIABLE_BASE {
  type: "date-time";
  name: string;
  range: [Date, Date];
  format: string;
  variableDisplayValue: string;
  variableValue: Date;
}

export interface GSK_STUDENT_ANSWER {
  studentInput: string;
  requiredPrecision: number;
  style: {
    width: number;
    widthUnit: string;
    backgroundColor: string;
    textColor: string;
    fontSize: number;
    fontSizeUnit: string;
    zoom: number;
    textAlign: string;
    borderRadius: number;
    borderRadiusUnit: string;
    borderThickness: number;
    borderThicknessUnit: string;
    borderStyle:
      | "solid"
      | "dashed"
      | "dotted"
      | "double"
      | "groove"
      | "ridge"
      | "inset"
      | "outset";
    borderColor: string;
  }; // css style for the input box
  credit: number;
  isCorrect: boolean;
}
