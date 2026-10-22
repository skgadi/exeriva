import {
  GSK_QUESTION_PAPER_DRAFT,
  GSK_DRAFT_ELEMENT,
} from "@/library/types/questions";
import * as math from "mathjs";
import { encryptText, decryptText } from "@/services/app-utils/common/encrypt";
import { useQuestionsStore } from "@/stores/questions";

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

const passwordToEncrypt = "}rr#+56gE:YR%|Ej3.*f8MJ>]aP(]Hs]Qd%P*%(6U[Xev>T~I}"; // This is used only to make the document unable to read. It is not really giving a lot of security because it is available for public. It is not hack proof.

/**
 * The question paper uses math.js related variables. So should be downloaded accordingly. Also, the download question paper should be not easy to read or manipulate. So, it should be encrypted. The following function uses math.js's inbuilt way to convert into JSON and then save to a text filed after encoding with a long password.
 */
export const downloadQuestionPaper = async (
  questionPaper: GSK_QUESTION_PAPER_DRAFT,
) => {
  // Implementation for downloading the question paper
  const jsonString = JSON.stringify(questionPaper, math.replacer);
  const encryptedString = await encryptText(jsonString, passwordToEncrypt);
  const blob = new Blob([encryptedString], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${questionPaper.title}.xrva`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const uploadQuestionPaper = async () => {
  // Implementation for uploading the question paper
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xrva";
  input.onchange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const encryptedString = e.target?.result as string;
        try {
          const decryptedString = await decryptText(
            encryptedString,
            passwordToEncrypt,
          );
          const questionPaper: GSK_QUESTION_PAPER_DRAFT = JSON.parse(
            decryptedString,
            math.reviver,
          );
          useQuestionsStore().updateQuestionPaperDraft(questionPaper);
          // Now you can use the questionPaper object as needed
        } catch (error) {
          console.error(
            "Failed to decrypt or parse the question paper:",
            error,
          );
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};
