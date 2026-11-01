import * as math from "mathjs";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";
import type {
  GSK_QUESTION_PAPER_DRAFT,
  GSK_DRAFT_ELEMENT,
} from "@/library/types/questions";
import { generateRandomNumber } from "@/services/app-utils/variables/generator";
import { evaluateExpression } from "@/services/app-utils/variables/evaluate-expressions";
import { updateSolutionVariables } from "@/services/app-utils/variables/handle-variable-manipulation";
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

export const interpretUserInput = (input: string): math.MathNumericType => {
  try {
    const parser = math.parser();
    const result = parser.evaluate(input);

    const type = math.typeOf(result);

    if (
      type !== "number" &&
      type !== "Complex" &&
      type !== "BigNumber" &&
      type !== "Fraction"
    ) {
      return NaN;
    }

    return result as math.MathNumericType;
  } catch (error) {
    console.warn(`Error interpreting user input: ${input}`, error);
    return NaN;
  }
};

const isValidNumericValue = (value: math.MathNumericType): boolean => {
  switch (math.typeOf(value)) {
    case "number":
      return Number.isFinite(value as number);

    case "Complex": {
      const z = value as math.Complex;
      return Number.isFinite(z.re) && Number.isFinite(z.im);
    }

    case "BigNumber":
      return (value as math.BigNumber).isFinite();

    case "Fraction":
      return true;

    default:
      return false;
  }
};

export const isCorrectAnswer = (
  inExpression: GSK_VARIABLE_EXPRESSION,
): boolean => {
  try {
    if (!inExpression.studentAnswer) {
      return false;
    }

    const { studentInput, requiredPrecision } = inExpression.studentAnswer;

    if (!studentInput.trim() || !Number.isFinite(requiredPrecision)) {
      return false;
    }

    const studentValue = interpretUserInput(studentInput);
    const correctValue = inExpression.variableValue;

    if (
      !isValidNumericValue(studentValue) ||
      !isValidNumericValue(correctValue)
    ) {
      return false;
    }

    // For complex numbers, math.abs returns the magnitude:
    // |a + bi| = sqrt(a² + b²)
    const absoluteDifference = math.abs(
      math.subtract(studentValue, correctValue),
    );

    const tolerance = math.pow(10, -requiredPrecision);

    return math.smallerEq(absoluteDifference, tolerance) as boolean;
  } catch (error) {
    console.warn("[SKGadi]", "Error checking answer correctness", error);
    return false;
  }
};

const makeStudentInputsEmpty = (element: GSK_DRAFT_ELEMENT) => {
  element.variables.forEach((variable) => {
    if (variable.type !== "expression") {
      return;
    }
    if (!variable.studentAnswer) {
      return;
    }
    variable.studentAnswer.studentInput = "";
  });
};

const prepareQuestionElementForAnswering = (element: GSK_DRAFT_ELEMENT) => {
  element.variables.forEach((variable) => {
    if (variable.type === "number") {
      generateRandomNumber(variable);
    }
  });
  evaluateExpression(element.variables);
  makeStudentInputsEmpty(element);
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // The exclamation marks (!) tell TypeScript that these indices are guaranteed to exist
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled;
}

/**
 * The following should be achieved:
 * 1. Fix the question paper draft to a single value by resolving any random numbers.
 * 2. Remove fields where the student needs to provide input.
 * 3. if questions requires to be repeated, here is the place to repeat them and make a single question paper ready for answering.
 * 4. Establish the times to be 60s if the question is not having any time limit specified
 * The question paper draft has several possible values because of random numbers, here we fix to a single value to make the question paper ready for answering. This function will also remove fields where student needs to fill
 * @param questionPaper The question paper draft is input here
 */
export const prepareQuestionPaperForAnswering = (
  questionPaper: GSK_QUESTION_PAPER_DRAFT,
): GSK_QUESTION_PAPER_DRAFT => {
  const fixedQuestionPaper: GSK_QUESTION_PAPER_DRAFT = JSON.parse(
    JSON.stringify(questionPaper, math.replacer),
    math.reviver,
  );
  // remove all the questions
  fixedQuestionPaper.questions = [];
  // Add questions based on number of repeats
  questionPaper.questions.forEach((question) => {
    for (let i = 0; i < question.question.numberOfRepeats; i++) {
      const questionCopy: GSK_QUESTION_PAPER_DRAFT["questions"][number] =
        JSON.parse(JSON.stringify(question, math.replacer), math.reviver);
      // Generate the question variables to a single value by resolving any random numbers
      prepareQuestionElementForAnswering(questionCopy.question);

      // Generate the solution variables to a single value by resolving any random numbers
      questionCopy.solution.variables.forEach((variable) => {
        if (variable.type === "number") {
          generateRandomNumber(variable);
        }
      });
      // Copy the question variables to the solution variables
      questionCopy.solution.variables = updateSolutionVariables(
        questionCopy.question.variables,
        questionCopy.solution.variables,
      );
      // evaluate the solution expressions
      evaluateExpression(questionCopy.solution.variables);
      // Remove student inputs
      makeStudentInputsEmpty(questionCopy.solution);

      // Make header and footers prepared
      prepareQuestionElementForAnswering(fixedQuestionPaper.header);
      prepareQuestionElementForAnswering(fixedQuestionPaper.footer);

      fixedQuestionPaper.questions.push(questionCopy);
    }
  });

  // Shuffle the questions if the setting is enabled
  if (fixedQuestionPaper.settings.shuffleQuestions) {
    fixedQuestionPaper.questions = shuffleArray(fixedQuestionPaper.questions);
  }
  return fixedQuestionPaper;
};

const getViewedCount = (answerSheet: GSK_ANSWER_TO_QUESTION_PAPER): number => {
  const getUniqueViewedQuestions = new Set<number>();
  answerSheet.log.seen.forEach((seen) => {
    getUniqueViewedQuestions.add(seen.element.questionIndex);
  });
  return getUniqueViewedQuestions.size;
};

const getAnsweredCount = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): number => {
  const getUniqueAnsweredQuestions = new Set<number>();
  answerSheet.log.answered.forEach((answered) => {
    getUniqueAnsweredQuestions.add(answered.element.questionIndex);
  });
  return getUniqueAnsweredQuestions.size;
};

const getSolutionViewedCount = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): number => {
  const getUniqueSolutionViewedQuestions = new Set<number>();
  answerSheet.log.solutionSeen.forEach((solutionSeen) => {
    getUniqueSolutionViewedQuestions.add(solutionSeen.questionIndex);
  });
  return getUniqueSolutionViewedQuestions.size;
};

export const getTotalQuestionsCount = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): number => {
  return answerSheet.questionPaper.questions.length;
};

export const getSessionCount = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): number => {
  return answerSheet.log.sessions.length;
};

export const updateAnswerSheetState = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): void => {
  const totalQuestions = getTotalQuestionsCount(answerSheet);
  const answeredCount = getAnsweredCount(answerSheet);
  const viewedCount = getViewedCount(answerSheet);
  const solutionViewedCount = getSolutionViewedCount(answerSheet);

  answerSheet.state.percentageFinished =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  answerSheet.state.percentageSeen =
    totalQuestions > 0 ? (viewedCount / totalQuestions) * 100 : 0;
  answerSheet.state.gradeInPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  answerSheet.state.percentageAnswered =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  answerSheet.state.percentageSolutionSeen =
    totalQuestions > 0 ? (solutionViewedCount / totalQuestions) * 100 : 0;
};

export const isCurrentQuestionAnswered = (
  answerSheet: GSK_ANSWER_TO_QUESTION_PAPER,
): boolean => {
  if (answerSheet.state.displayingQuestionIndex < 0 || answerSheet.state.displayingQuestionIndex >= getTotalQuestionsCount(answerSheet)) {
    return false;
  }
  const currentQuestion = answerSheet.questionPaper.questions[answerSheet.state.displayingQuestionIndex];
  if (!currentQuestion) {
    return false;
  }
  return currentQuestion.question.variables.every((variable) => {
    if (variable.type !== "expression") {
      return true;
    }
    if (!variable.studentAnswer) {
      return true;
    }
    return variable.studentAnswer.studentInput.trim() !== "";
  });
}
