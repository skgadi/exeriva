import { defineStore, acceptHMRUpdate } from "pinia";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

export const useQuestionsStore = defineStore("questions", {
  persist: true,
  state: () => ({
    questionPaperDrafts: [] as GSK_QUESTION_PAPER_DRAFT[],
  }),

  getters: {
    getQuestionpaperDisplay: (state) => {
      return JSON.stringify(state.questionPaperDrafts);
    },

  },

  actions: {
    saveQuestionPaperDraft(inDraft: GSK_QUESTION_PAPER_DRAFT) {
      // if Draft exists, update its content (copy), else add its copy
      const index = this.questionPaperDrafts.findIndex(
        (d) => d.id === inDraft.id
      );
      if (index !== -1) {
        this.questionPaperDrafts[index] = JSON.parse(JSON.stringify(inDraft));
      } else {
        this.questionPaperDrafts.push(JSON.parse(JSON.stringify(inDraft)));
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
        editPassword: "",
        answerPassword: "",
        solutionPassword: "",
        header: {
          text: "",
          variables: [],
        },
        questions: [],
        footer: {
          text: "",
          variables: [],
        },
      };
      return newDraft;
    },
    getCopyOrCreateNewDraft(id: string|null): GSK_QUESTION_PAPER_DRAFT {
      const draft = this.questionPaperDrafts.find((d) => d.id === id);
      if (draft) {
        return JSON.parse(JSON.stringify(draft));
      } else {
        return this.getANewQuestionPaperDraft();
      }
    },
    getDraftById(id: string): GSK_QUESTION_PAPER_DRAFT | undefined {
      return this.questionPaperDrafts.find((d) => d.id === id);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot));
}
