import type {
  GSK_VARIABLE_NUMBER,
  GSK_VARIABLE_STRING,
  GSK_VARIABLE_DATE_TIME,
} from "./variables";

export interface GSK_QUESTION_PAPER_DRAFT {
  id: string;
  title: string;
  shortTitle: string;
  editPassword: string;
  answerPassword: string;
  solutionPassword: string;
  header: GSK_DRAFT_ELEMENT;
  questions: {
    question: GSK_DRAFT_ELEMENT;
    answers: GSK_DRAFT_ELEMENT_FOR_ANSWER;
    solution: GSK_DRAFT_ELEMENT;
  }[];
  footer: GSK_DRAFT_ELEMENT;
}

export interface GSK_DRAFT_ELEMENT {
  text: string;
  variables: Array<
    GSK_VARIABLE_NUMBER | GSK_VARIABLE_STRING | GSK_VARIABLE_DATE_TIME
  >;
}

export interface GSK_DRAFT_ELEMENT_FOR_ANSWER extends GSK_DRAFT_ELEMENT {
  inputElements: GSK_INPUT_ELEMENT[];
}

export interface GSK_QUESTION_PAPER_DISPLAY {
  id: string;
  title: string;
  shortTitle: string;
  header: string;
  elements: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    credit: number;
    solution: string;
  }[];
  footer: string;
}

export interface GSK_QUESTION_PAPER_SUBMISSION {
  id: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export interface GSK_INPUT_ELEMENT {
  numberType: "number" | "string" | "options" | "date" | "time" | "datetime";
  dimension: [number, number]; // [rows, columns] for text area, [1, 1] for scalar input
  options?: string[]; // for options input
  tolerance: number;
  correctAnswer: Array<Array<number | string | Date>>; // 2D array for text area, 1D array for scalar input
  toleranceType: "absolute" | "relative"; // absolute: |x - y| <= tolerance, relative: |x - y| / |y| <= tolerance
}

export interface GSK_QUESTION_PAPER_ANSWER_INPUT {
  id: string;
  title: string;
  shortTitle: string;
  header: string;
  elements: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    credit: number;
    solution: string;
    answerInput: GSK_INPUT_ELEMENT[];
  }[];
  footer: string;
}
