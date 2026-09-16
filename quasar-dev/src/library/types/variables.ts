export interface GSK_NUMBER_TYPE {
  type:
    | "integer"
    | "decimal"
    | "fraction"
    | "mixed-fraction";
  showFormat: "engineering" | "scientific" | "decimal";
  roundTo: number;
}

export interface GSK_VARIABLE_NUMBER {
  name: string;
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
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
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
}

export interface GSK_VARIABLE_DATE_TIME {
  name: string;
  range: [Date, Date];
  format: string;
  size: [number, number]; // [rows, columns] for matrix, [1, 1] for scalar
}
