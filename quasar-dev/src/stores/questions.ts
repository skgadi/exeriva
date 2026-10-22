import { defineStore, acceptHMRUpdate } from "pinia";
import * as math from "mathjs";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

export const useQuestionsStore = defineStore("questions", {
  persist: true,
  state: () => ({
    questionPaperDrafts: [] as GSK_QUESTION_PAPER_DRAFT[],
  }),

  getters: {
    getQuestionPaperDisplay: (state) => {
      return JSON.stringify(state.questionPaperDrafts, math.replacer);
    },
  },

  actions: {
    saveQuestionPaperDraft(inDraft: GSK_QUESTION_PAPER_DRAFT) {
      // if Draft exists, update its content (copy), else add its copy
      const index = this.questionPaperDrafts.findIndex(
        (d) => d.id === inDraft.id,
      );
      if (index !== -1) {
        this.questionPaperDrafts[index] = JSON.parse(
          JSON.stringify(inDraft, math.replacer),
          math.reviver,
        );
      } else {
        this.questionPaperDrafts.push(
          JSON.parse(JSON.stringify(inDraft, math.replacer), math.reviver),
        );
      }
    },
    deleteQuestionPaperDraft(id: string) {
      const index = this.questionPaperDrafts.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.questionPaperDrafts.splice(index, 1);
      }
    },
    getANewQuestionPaperDraft(): GSK_QUESTION_PAPER_DRAFT {
      const newDraft: GSK_QUESTION_PAPER_DRAFT = {
        id: crypto.randomUUID(),
        title: "",
        shortTitle: "",
        access: {
          editPassword: "",
          answerPassword: "",
          solutionPassword: "",
          showAnswersPassword: "",
        },
        header: {
          text: "",
          variables: [],
          numberOfRepeats: 1,
        },
        questions: [],
        footer: {
          text: "",
          variables: [],
          numberOfRepeats: 1,
        },
        settings: {
          shuffleQuestions: false,
          maintainStrictTimeLimit: false,
          showSolutionAfterSubmission: false,
          showSolutionAfterEachQuestion: false,
          showAnswersAfterSubmission: false,
          showAnswersAfterEachQuestion: false,
          displayQuestionsInOnePage: false,
          allowChangingAnswers: false,
          allowSeeingPreviousAnswers: false,
          finishInOneSession: false,
          allowSkippingQuestions: false,
        },
      };
      return newDraft;
    },
    getCopyOrCreateNewDraft(id: string | null): GSK_QUESTION_PAPER_DRAFT {
      const draft = this.questionPaperDrafts.find((d) => d.id === id);
      if (draft) {
        return JSON.parse(JSON.stringify(draft, math.replacer), math.reviver);
      } else {
        return this.getANewQuestionPaperDraft();
      }
    },
    getDraftById(id: string): GSK_QUESTION_PAPER_DRAFT | undefined {
      return this.questionPaperDrafts.find((d) => d.id === id);
    },
    isDraftSaved(id: string, draft: GSK_QUESTION_PAPER_DRAFT): boolean {
      const savedDraft = this.questionPaperDrafts.find((d) => d.id === id);
      if (!savedDraft) {
        return false;
      }
      return (
        JSON.stringify(savedDraft, math.replacer) ===
        JSON.stringify(draft, math.replacer)
      );
    },
    getAccessPasswords(id: string): {
      editPassword: string;
      answerPassword: string;
      solutionPassword: string;
    } | null {
      const draft = this.questionPaperDrafts.find((d) => d.id === id);
      if (draft) {
        return {
          editPassword: draft.access.editPassword,
          answerPassword: draft.access.answerPassword,
          solutionPassword: draft.access.solutionPassword,
        };
      }
      return null;
    },
    updateQuestionPaperDraft(updatedDraft: GSK_QUESTION_PAPER_DRAFT) {
      const index = this.questionPaperDrafts.findIndex(
        (d) => d.id === updatedDraft.id,
      );
      // if exists, ask confirmation to overwrite. Proceed only if confirmed. If not exists, add it.
      const isSafeToUpdate = !this.questionPaperDrafts.some(
        (d) => d.id === updatedDraft.id,
      );
      if (!isSafeToUpdate) {
        const userConfirmed = window.confirm(
          "Are you sure you want to overwrite the existing draft?",
        );
        if (!userConfirmed) {
          return;
        }
      }
      if (index !== -1) {
        this.questionPaperDrafts[index] = JSON.parse(
          JSON.stringify(updatedDraft, math.replacer),
          math.reviver,
        );
      } else {
        this.questionPaperDrafts.push(
          JSON.parse(JSON.stringify(updatedDraft, math.replacer), math.reviver),
        );
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot));
}
