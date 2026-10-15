<template>
  <div ref="content" class="q-px-xs answer-content">
    <component :is="ViewBoxComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, h, watch } from "vue";

import { marked } from "marked";
import { QInput } from "quasar";

import {
  changeVariableNamesToValues,
  variablePassingTextSignature
} from "@/services/app-utils/variables/viewer";

import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";

import "@/css/components/answer-content.scss";

import "@quasar/quasar-ui-qmarkdown/dist/index.css";
import "katex/dist/katex.min.css";

import renderMathInElement from "katex/contrib/auto-render";

const props = defineProps({
  draftText: {
    type: String,
    required: true
  }
});

const variables = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT["variables"],
  required: true
});

const content = ref<HTMLElement | null>(null);

/**
 * Render math after Vue has updated the DOM.
 */
const renderMath = async () => {
  await nextTick();

  if (!content.value) {
    return;
  }

  renderMathInElement(content.value, {
    delimiters: [
      {
        left: "$$",
        right: "$$",
        display: true
      },
      {
        left: "$",
        right: "$",
        display: false
      }
    ],
    throwOnError: false,
    ignoredTags: [
      "script",
      "noscript",
      "style",
      "textarea",
      "pre",
      "code",
      "input",
      "option"
    ]
  } as Parameters<typeof renderMathInElement>[1]);
};

/**
 * Convert Markdown HTML into a fragment that supports inline QInput
 * components while preserving block-level headings and separators.
 */
const renderHtmlFragment = (html: string): string => {
  return (
    html
      // Remove paragraph wrappers while preserving their text inline.
      .replace(/<p(?:\s[^>]*)?>/gi, "")
      .replace(/<\/p>/gi, "<br>")

      // Preserve headings as block elements.
      .replace(/<h([1-6])(?:\s[^>]*)?>/gi, "<h$1>")
      .replace(/<\/h([1-6])>/gi, "</h$1>")

      // Normalize whitespace between adjacent headings.
      .replace(/<\/h([1-6])>\s*<h([1-6])>/gi, "</h$1><h$2>")

      // Preserve horizontal rules as block elements.
      .replace(/<hr\s*\/?>/gi, "<hr>")
  );
};

/**
 * Re-render mathematics when the draft or variables change.
 */
watch(
  [() => props.draftText, () => variables.value],
  async () => {
    await nextTick();
    await renderMath();
  },
  {
    deep: true,
    flush: "post",
    immediate: true
  }
);

const ViewBoxComponent = computed(() => {
  return {
    setup() {
      return () => {
        const rawContent = marked.parse(props.draftText, {
          async: false
        });

        const finalOut = changeVariableNamesToValues(
          rawContent,
          variables.value
        );

        const parts = finalOut.split(variablePassingTextSignature);

        return h(
          "div",
          {
            class: "answer-expression"
          },
          parts.map((part, index) => {
            if (part === "") {
              return null;
            }

            // Even indexes contain ordinary HTML.
            if (index % 2 === 0) {
              return h("span", {
                class: "answer-text",
                innerHTML: renderHtmlFragment(part)
              });
            }

            // Odd indexes contain variable names.
            const variableIdx = variables.value.findIndex(
              variable => variable.name === part.trim()
            );

            if (variableIdx === -1) {
              return h("span", {
                class: "answer-text",
                innerHTML: renderHtmlFragment(part)
              });
            }

            const variable = variables.value[
              variableIdx
            ] as GSK_VARIABLE_EXPRESSION;

            if (!variable?.studentAnswer) {
              return h("span", {
                class: "answer-text",
                innerHTML: renderHtmlFragment(part)
              });
            }

            // Keep a real, reactive Quasar input.
            return h(QInput, {
              key: variable.name,
              dense: true,
              placeholder: "Your answer",
              modelValue: variable.studentAnswer.studentInput,

              "onUpdate:modelValue": (val: string | number | null) => {
                if (variable.studentAnswer) {
                  variable.studentAnswer.studentInput = val as string;
                }
              },

              outlined: true,
              class: "inline-answer-input",

              style: {
                display: "inline-flex",
                verticalAlign: "middle",
                width: "120px",
                margin: "0 4px"
              }
            });
          })
        );
      };
    }
  };
});
</script>
