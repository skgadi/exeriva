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
      // Display math first.
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
 * Convert paragraph boundaries into line breaks so text
 * surrounding QInput components can remain inline.
 */
const renderHtmlFragment = (html: string) => {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, "<br>")
    .replace(/^\s*<p[^>]*>/i, "")
    .replace(/<\/p>\s*$/i, "");
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

            // Render a real, reactive Quasar input.
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

<style scoped>
.answer-content {
  display: inline-block;
}

.answer-expression {
  line-height: 2.5;
}

.answer-text {
  display: inline;
}

.inline-answer-input {
  vertical-align: middle;
}

.inline-answer-input :deep(.q-field__control) {
  border-radius: 6px;
  background-color: #f5f9ff;
}

.inline-answer-input :deep(.q-field__native) {
  padding-left: 8px;
  padding-right: 8px;
}

.inline-answer-input :deep(.q-field__control:before) {
  border-color: #9dbbe8;
}

.inline-answer-input :deep(.q-field--focused .q-field__control:after) {
  border-color: var(--q-primary);
}
</style>
