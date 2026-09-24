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

export interface GSK_VARIABLE_STRING {
  type: "string";
  name: string;
  values: string;
  options: string[];
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
}

export interface GSK_VARIABLE_DATE_TIME {
  type: "date-time";
  name: string;
  range: [Date, Date];
  format: string;
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
}
