<template>
  <div ref="content" class="q-px-xs">
    <component :is="ViewBoxComponent" />
    <q-item>Hello, World!</q-item>
    <q-markdown :src="contentToDisplay" />
  </div>
</template>

<script setup lang="ts">
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
import { computed, nextTick, ref, h } from "vue";
import {
  changeVariableNamesToValues,
  variablePassingTextSignature
} from "@/services/app-utils/variables/viewer";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";

import { QInput } from "quasar";

import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";
import "@quasar/quasar-ui-qmarkdown/dist/index.css";
import {
  variableRegex,
  extractVariablesFromText
} from "@/services/app-utils/variables/generator";

import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";

const content = ref<HTMLElement | null>(null);

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
    throwOnError: false
  });
};

const contentToDisplay = computed(() => {
  const updatedContent = changeVariableNamesToValues(
    props.draftText,
    variables.value
  );
  renderMath();
  return updatedContent || "No content to display";
});

const ViewBoxComponent = computed(() => {
  return {
    setup() {
      return () => {
        const rawContent = props.draftText;

        const variables1 = extractVariablesFromText(rawContent);
        // filter out odd parts to extract text and variables separately
        const finalOut = changeVariableNamesToValues(
          rawContent,
          variables.value
        );
        // Split the finalOut into parts based on the variable signature
        const parts = finalOut.split(variablePassingTextSignature);
        // Replace the variable placeholders with QInput components for each variable

        console.log("parts", parts);

        return h(
          "div",
          {},
          parts.map((part, index) => {
            if (part.trim() === "") {
              return null; // Skip empty parts
            }
            if (index % 2 === 0) {
              // Even index: regular text
              return part;
            }
            // if the part is not a variable name, return it as text
            const variableIdx = variables.value.findIndex(
              variable => variable.name === part.trim()
            );
            if (variableIdx === -1) {
              return part; // Return the part as text if it's not a variable
            }
            const variable = variables.value[
              variableIdx
            ] as GSK_VARIABLE_EXPRESSION;
            if (
              !(variables.value[variableIdx] as GSK_VARIABLE_EXPRESSION)
                ?.studentAnswer
            ) {
              return part;
            }

            return h(QInput, {
              dense: true,
              placeholder: "Enter your answer",
              modelValue: variable.studentAnswer?.studentInput,
              "onUpdate:modelValue": (val: string | number | null) => {
                if (variable.studentAnswer) {
                  variable.studentAnswer.studentInput = val as string;
                }
              },
              outlined: true,
              style: "display: inline-flex; width: 120px; margin: 0 4px;"
            });
          })
        );
      };
    }
  };
});
</script>
