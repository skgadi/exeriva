<template>
  <div ref="content" class="q-px-xs answer-content">
    <component
      :is="ViewBoxComponent"
      :key="`${draftText}-${variablesRenderKey}`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, h, watch, VNodeChild } from "vue";

import { marked } from "marked";
import { QIcon, QInput } from "quasar";

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
import {
  getOuterStyleFromInputStyle,
  getInnerStyleFromInputStyle
} from "@/services/app-utils/variables/styles";

const props = defineProps({
  draftText: {
    type: String,
    required: true
  },
  showCorrectTick: {
    type: Boolean,
    required: false,
    default: false
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
 * Re-render mathematics when the draft or variables change.
 */
watch([() => props.draftText, () => variables.value], renderMath, {
  deep: true,
  flush: "post",
  immediate: true
});

/**
 * Escape a string for use in a regular expression.
 */
const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Render Markdown HTML while preserving its structure.
 *
 * Answerable variables are converted into placeholder elements before
 * HTML parsing. During recursive rendering, each placeholder becomes
 * a reactive Quasar QInput inside its original HTML parent.
 */
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

        // Map placeholder IDs to variable names.
        const variableNames = new Map<string, string>();
        let placeholderIndex = 0;

        // Match a complete answerable-variable signature pair.
        const signatureRegex = new RegExp(
          `${escapeRegExp(variablePassingTextSignature)}([\\s\\S]*?)${escapeRegExp(variablePassingTextSignature)}`,
          "g"
        );

        // Replace answerable variables with HTML-safe placeholders
        // before parsing the HTML.
        const htmlWithPlaceholders = finalOut.replace(
          signatureRegex,
          (_match, variableName: string) => {
            const id = String(placeholderIndex++);

            variableNames.set(id, variableName.trim());

            return `<gsk-variable-placeholder data-variable-id="${id}"></gsk-variable-placeholder>`;
          }
        );

        // Parse the HTML while preserving tables and their cells.
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlWithPlaceholders, "text/html");

        /**
         * Recursively convert DOM nodes into Vue VNodes.
         */
        const renderNode = (node: Node): VNodeChild => {
          // Preserve text exactly as it appears in the HTML.
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent ?? "";
          }

          if (node.nodeType !== Node.ELEMENT_NODE) {
            return null;
          }

          const element = node as HTMLElement;
          const tag = element.tagName.toLowerCase();

          // Replace a variable placeholder with its reactive QInput.
          if (tag === "gsk-variable-placeholder") {
            const id = element.getAttribute("data-variable-id");
            const variableName = id ? variableNames.get(id) : undefined;

            if (!variableName) {
              return null;
            }

            const variableIdx = variables.value.findIndex(
              variable => variable.name === variableName
            );

            if (variableIdx === -1) {
              return variableName;
            }

            const variable = variables.value[
              variableIdx
            ] as GSK_VARIABLE_EXPRESSION;

            if (!variable.studentAnswer) {
              return variableName;
            }

            return [
              h(QInput, {
                key: `answer-${variable.name}`,
                dense: true,
                outlined: true,
                modelValue: variable.studentAnswer.studentInput,
                style: getOuterStyleFromInputStyle(
                  variable.studentAnswer.style
                ),
                inputStyle: getInnerStyleFromInputStyle(
                  variable.studentAnswer.style
                ),
                // Delay model updates so the re-render doesn't fire on every keystroke
                debounce: 1500,
                "onUpdate:modelValue": (val: string | number | null) => {
                  if (variable.studentAnswer) {
                    variable.studentAnswer.studentInput = val as string;
                  }
                },

                class: "inline-answer-input"
              }),
              h(QIcon, {
                key: `tick-${variable.name}`,
                name: variable.studentAnswer.isCorrect
                  ? "mdi-check-circle"
                  : "mdi-close-circle",
                color: variable.studentAnswer.isCorrect
                  ? "positive"
                  : "negative",
                class: [
                  "inline-answer-tick",
                  props.showCorrectTick ? "visible" : "invisible"
                ]
              })
            ];
          }

          /**
           * Preserve TikZJax source scripts, but do not render ordinary scripts.
           */
          if (tag === "script") {
            const type = element.getAttribute("type")?.toLowerCase();

            if (type === "text/tikz") {
              const scriptAttrs: Record<string, string> = {};

              // Preserve every TikZJax configuration attribute.
              for (const attribute of Array.from(element.attributes)) {
                scriptAttrs[attribute.name] = attribute.value;
              }

              // Preserve the original TikZ/TeX source.
              return h("script", scriptAttrs, element.textContent ?? "");
            }

            // Do not render ordinary scripts from the supplied HTML.
            return null;
          }

          // Do not allow arbitrary style elements from the fragment.
          if (tag === "style") {
            return null;
          }

          // Preserve every HTML attribute, including table attributes.
          const attrs: Record<string, string> = {};

          for (const attribute of Array.from(element.attributes)) {
            attrs[attribute.name] = attribute.value;
          }

          // Recursively render the children inside their original parents.
          const children = Array.from(element.childNodes).map(renderNode);

          return h(tag, attrs, children);
        };

        const children = Array.from(doc.body.childNodes).map(renderNode);

        // Keep the existing CSS selectors working.
        return h(
          "div",
          {
            class: "answer-expression"
          },
          [
            h(
              "span",
              {
                class: "answer-text"
              },
              children
            )
          ]
        );
      };
    }
  };
});

const variablesRenderKey = computed(() =>
  JSON.stringify(
    variables.value.map(variable => ({
      name: variable.name,
      value: "value" in variable ? variable.value : variable.variableValue,
      studentInput:
        "studentAnswer" in variable
          ? variable.studentAnswer?.studentInput
          : undefined,
      style:
        "studentAnswer" in variable ? variable.studentAnswer?.style : undefined
    }))
  )
);
</script>
