<template>
  <div ref="texContainer">
    {{ props.texContent }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  texContent: {
    type: String,
    required: true
  }
});

import { ref, watch, onMounted, nextTick } from "vue";
import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";

const texContainer = ref<HTMLDivElement | null>(null);

const renderMath = async () => {
  await nextTick();
  if (!texContainer.value) {
    return;
  }

  renderMathInElement(texContainer.value, {
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

watch(
  () => props.texContent,
  () => {
    renderMath();
    console.log("Rendered math for texContent:", props.texContent);
  }
);
onMounted(() => {
  renderMath();
});
</script>
