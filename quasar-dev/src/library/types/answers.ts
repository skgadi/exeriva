import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

export interface GSK_ANSWER_ELEMENT {
  questionIndex: number;
  answeredVariable: string;
}

export interface GSK_ANSWER_QUESTION_SEEN {
  questionIndex: number;
  dateTime: number; // Unix timestamp in milliseconds
}

export interface GSK_ANSWER_ANSWERED {
  element: GSK_ANSWER_ELEMENT;
  dateTime: number; // Unix timestamp in milliseconds
}

export interface GSK_ANSWER_SEEN {
  element: GSK_ANSWER_ELEMENT;
  dateTime: number; // Unix timestamp in milliseconds
}

export interface GSK_SOLUTION_SEEN {
  questionIndex: number;
  dateTime: number; // Unix timestamp in milliseconds
}

export interface GSK_ANSWERING_SESSION {
  startTime: string;
  endTime: string;
}

export interface GSK_ANSWER_TO_QUESTION_PAPER {
  id: string;
  studentName: string;
  questionPaper: GSK_QUESTION_PAPER_DRAFT;
  state: {
    isSubmitted: boolean;
    displayingQuestionIndex: number;
    percentageFinished: number;
    percentageSeen: number;
    gradeInPercentage: number;
    percentageAnswered: number;
    timeSpentInSeconds: number;
    totalExpectedTimeInSeconds: number;
  };
  log: {
    answered: GSK_ANSWER_ANSWERED[];
    seen: GSK_ANSWER_SEEN[];
    solutionSeen: GSK_SOLUTION_SEEN[];
    questionSeen: GSK_ANSWER_QUESTION_SEEN[];
    sessions: GSK_ANSWERING_SESSION[];
  };
}
