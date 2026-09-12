<template>
  <q-expansion-item
    class="shadow-1 overflow-hidden"
    style="border-radius: 30px"
    :icon="colorLabelLookup[props.section]?.icon || 'mdi-help'"
    :label="colorLabelLookup[props.section]?.label || 'Unknown'"
    :header-class="
      colorLabelLookup[props.section]?.headerClass || 'bg-grey-3 text-black'
    "
    expand-icon-class="text-white"
    default-opened
  >

  <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab no-caps name="draft" label="Draft"/>
        <q-tab no-caps name="variables" label="Variables"/>
        <q-tab no-caps name="preview" label="Preview"/>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="draft" class="q-pa-none">
          <editor-box v-model="draftElement.text" />
        </q-tab-panel>

        <q-tab-panel name="variables">
          <div class="text-h6">variables</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="preview" >
          <viewer-box :draft-text="draftElement.text" />
        </q-tab-panel>
      </q-tab-panels>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
      </template>
      <template v-slot:after>
      </template>
    </q-splitter>
  </q-expansion-item>
</template>

<script setup lang="ts">
const props = defineProps({
  section: {
    type: String as () => "header" | "question" | "answer" | "footer",
    required: true
  }
});

const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import EditorBox from "@/components/QuestionsDraft/EditorBox.vue";
import viewerBox from "@/components/QuestionsDraft/ViewerBox.vue";

import { ref } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";

const splitterModel = ref(50);
const tab = ref("draft");

const colorLabelLookup = {
  header: {
    headerClass: "bg-primary text-white",
    label: "Header",
    icon: "mdi-page-layout-header"
  },
  question: {
    headerClass: "bg-secondary text-white",
    label: "Question",
    icon: "mdi-help"
  },
  answer: {
    headerClass: "bg-accent text-white",
    label: "Answer",
    icon: "mdi-message-reply-text-outline"
  },
  footer: {
    headerClass: "bg-negative text-white",
    label: "Footer",
    icon: "mdi-page-layout-footer"
  }
};
</script>
