<template>
  <v-card>
    <v-card-title>
      Text Settings
    </v-card-title>

    <v-card-text>
      <!-- Text Input -->
      <v-text-field v-model="text" label="Enter Text" />

      <!-- Font Size -->
      <v-slider
        v-model="fontSize"
        :min="10"
        :max="72"
        label="Font Size"
        step="1"
        thumb-label
        class="mt-4"
      >
        <template #prepend>
          <v-icon>mdi-format-size</v-icon>
        </template>
      </v-slider>

      <!-- Font Family Dropdown -->
      <v-select
        v-model="fontFamily"
        :items="fontOptions"
        label="Font Family"
        class="mt-4"
        dense
      />

      <!-- Bold / Italic Toggles -->
      <v-btn-toggle v-model="fontStyle" class="mt-4">
        <v-btn value="bold">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn value="italic">
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
      </v-btn-toggle>

      <!-- Uppercase / Lowercase Toggle -->
      <v-switch
        v-model="isUpperCase"
        label="Uppercase"
        class="mt-4"
      />

      <!-- Color Picker -->
      <v-color-picker
        v-model="color"
        hide-canvas
        hide-inputs
        class="mt-4"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="applySettings">Apply</v-btn>
      <v-btn text @click="$emit('close')">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['apply', 'close']);

const text = ref('');
const color = ref('#000000');
const fontSize = ref(24);
const fontFamily = ref('Arial');
const fontStyle = ref(null); // 'bold' or 'italic'
const isUpperCase = ref(false);

const fontOptions = [
  'Arial',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Roboto',
  'Tahoma',
];

const applySettings = () => {
  let finalText = isUpperCase.value ? text.value.toUpperCase() : text.value;

  const styles = {
    fontSize: fontSize.value,
    fill: color.value,
    fontFamily: fontFamily.value,
  };

  if (fontStyle.value === 'bold') {
    styles.fontWeight = 'bold';
  }
  if (fontStyle.value === 'italic') {
    styles.fontStyle = 'italic';
  }

  emit('apply', {
    text: finalText,
    color: color.value,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    fontWeight: styles.fontWeight || 'normal',
    fontStyle: styles.fontStyle || 'normal',
  });
};
</script>
