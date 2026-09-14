<template>
  <codemirror
    v-model="draft"
    :placeholder="'Write your markdown here...'"
    :style="{ height: '100%', border: '1px solid #ccc' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
  />
</template>

<script setup lang="ts">
const draft = defineModel({
  type: String,
  required: true
});

import { Codemirror } from "vue-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

const extensions = [
  markdown({ base: markdownLanguage }),
  EditorView.lineWrapping
  // oneDark // Uncomment if you installed and want the dark theme
];
</script>
