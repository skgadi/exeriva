<template>
  <div ref="content" class="q-px-xs">
    <q-markdown :src="contentToDisplay" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  draftText: {
    type: String,
    required: true
  },
  variables: {
    type: Object as () => GSK_DRAFT_ELEMENT["variables"],
    required: true
  }
});
import { computed, nextTick, ref } from "vue";
import { changeVariableNamesToValues } from "@/services/app-utils/variables/viewer";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";

import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";
import "@quasar/quasar-ui-qmarkdown/dist/index.css";

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
    props.variables
  );
  renderMath();
  return updatedContent || "No content to display";
});
</script>
