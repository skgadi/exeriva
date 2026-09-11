export interface GSK_NUMBER_TYPE {
  type:
    | "natural"
    | "whole"
    | "integer"
    | "decimal"
    | "fraction"
    | "mixed-fraction";
  showFormat: "engineering" | "scientific" | "decimal";
  roundTo: number;
}

export interface GSK_VARIABLE_NUMBER {
  name: string;
  rangeReal: [number, number];
  rangeComplex: [number, number];
  typeReal: GSK_NUMBER_TYPE;
  typeComplex: GSK_NUMBER_TYPE;
  isComplex: boolean;
}

export interface GSK_VARIABLE_STRING {
  name: string;
  values: string;
  options: string[];
}

export interface GSK_VARIABLE_DATE_TIME {
  name: string;
  range: [Date, Date];
  format: string;
}
