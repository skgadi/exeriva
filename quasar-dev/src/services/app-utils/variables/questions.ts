import {
  GSK_QUESTION_PAPER_DRAFT,
  GSK_DRAFT_ELEMENT,
} from "@/library/types/questions";

const getValueWithLimits = (
  value: number,
  min: number,
  max: number,
  defaultVal: number,
) => {
  try {
    if (isNaN(value)) {
      return defaultVal;
    }
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  } catch {
    return defaultVal;
  }
};

const getNumberOfRepeats = (inElement: GSK_DRAFT_ELEMENT) => {
  return getValueWithLimits(inElement.numberOfRepeats, 1, Infinity, 1);
};

export const getCreditsPerQuestion = (inElement: GSK_DRAFT_ELEMENT) => {
  return (
    inElement.variables.reduce((total, variable) => {
      if (variable.type === "expression" && variable.studentAnswer) {
        return (
          total +
          getValueWithLimits(variable.studentAnswer.credit, 0, Infinity, 0)
        );
      }
      return total;
    }, 0) * getNumberOfRepeats(inElement)
  );
};

export const getTotalCredits = (
  inQuestions: GSK_QUESTION_PAPER_DRAFT["questions"],
) => {
  return inQuestions.reduce((total, element) => {
    return total + getCreditsPerQuestion(element.question);
  }, 0);
};

export const getExpectedTimePerQuestion = (inElement: GSK_DRAFT_ELEMENT) => {
  return (
    inElement.variables.reduce((total, variable) => {
      if (variable.type === "expression" && variable.studentAnswer) {
        return (
          total +
          getValueWithLimits(
            variable.studentAnswer.expectedTime,
            0,
            Infinity,
            0,
          )
        );
      }
      return total;
    }, 0) * getNumberOfRepeats(inElement)
  );
};

export const getTotalExpectedTime = (
  inQuestions: GSK_QUESTION_PAPER_DRAFT["questions"],
) => {
  return inQuestions.reduce((total, element) => {
    return total + getExpectedTimePerQuestion(element.question);
  }, 0);
};

export const getTotalQuestions = (
  inQuestions: GSK_QUESTION_PAPER_DRAFT["questions"],
) => {
  return inQuestions.reduce((total, element) => {
    return total + getNumberOfRepeats(element.question);
  }, 0);
};
