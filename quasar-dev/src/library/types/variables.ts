import type { Matrix } from "mathjs";

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

export interface GSK_VARIABLE_NUMBER {
  type: "number";
  name: string;
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
  rangeReal: [number, number];
  rangeImaginary: [number, number];
  typeReal: GSK_NUMBER_TYPE;
  typeImaginary: GSK_NUMBER_TYPE;
  isComplex: boolean;
  variableValue: Matrix; // a mathjs representation of the variable value
  variableDisplayValue: string; // a LaTeX representation of the variableValue
}

// A mathematical expression with numerical values as output upon evaulated
export interface GSK_VARIABLE_EXPRESSION {
  type: "expression";
  name: string;
  expression: string;
  variableValue: Matrix; // a mathjs representation of the variable value
  variableDisplayValue: string; // a LaTeX representation of the variableValue
  typeReal: GSK_NUMBER_TYPE;
  typeImaginary: GSK_NUMBER_TYPE;
  size: [number, number]; // This will be calculated based on the expression
}

export interface GSK_VARIABLE_STRING {
  type: "string";
  name: string;
  values: string;
  options: string[];
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
  variableDisplayValue: string;
}

export interface GSK_VARIABLE_DATE_TIME {
  type: "date-time";
  name: string;
  range: [Date, Date];
  format: string;
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
  variableDisplayValue: string;
}
