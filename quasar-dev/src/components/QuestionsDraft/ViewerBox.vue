<template>
  <div ref="content" class="q-px-xs">
    <q-markdown :src="draftText" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";
import "@quasar/quasar-ui-qmarkdown/dist/index.css";

import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";

const props = defineProps({
  draftText: {
    type: String,
    required: true
  }
});

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

watch(() => props.draftText, renderMath, { immediate: true });
</script>
