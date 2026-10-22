<template>
  <q-btn
    round
    flat
    :class="props.class"
    title="Copy to clipboard"
    :size="props.size"
    :icon="copied ? props.iconWhenCopied : props.icon"
    @click="copyToClipboard"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  textToCopy: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: "mdi-content-copy"
  },
  iconWhenCopied: {
    type: String,
    default: "mdi-check"
  },
  timeOut: {
    type: Number,
    default: 2000
  }, // Time in milliseconds to show the "copied" icon before reverting back to the original icon
  showNotification: {
    type: Boolean,
    default: true
  }, // Whether to show a notification when the text is copied
  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg" | "xl">,
    default: "md"
  }, // Size of the button (e.g., 'sm', 'md', 'lg')
  class: {
    type: String,
    default: ""
  }
});

import { ref, type PropType } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.textToCopy);
    copied.value = true;
    $q.notify({
      type: "positive",
      message: "Copied to clipboard!"
    });
    setTimeout(() => {
      copied.value = false;
    }, props.timeOut);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    $q.notify({
      type: "negative",
      message: "Failed to copy to clipboard."
    });
  }
};
</script>
