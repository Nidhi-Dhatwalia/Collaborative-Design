<template>
  <v-container class="pa-4" fluid>
    <v-card
      class="mx-auto text-settings-card"
      max-width="600"
      max-height="600"
    >
      <v-card-title class="text-h6">Text Settings</v-card-title>

      <v-card-text class="scrollable-content">
        <v-row dense>
          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-text-field
              v-model="text"
              label="Enter Text"
              :error="!!textError"
              :error-messages="textError"
              @input="textError = ''"
                @keydown.enter.prevent="applySettings"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-slider
              v-model="fontSize"
              :min="10"
              :max="72"
              step="1"
              thumb-label
              dense
            >
              <template #prepend>
                <v-icon small>mdi-format-size</v-icon>
              </template>
              <template #append>
                <span class="font-size-label">{{ fontSize }}px</span>
              </template>
            </v-slider>
          </v-col>

          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-select
              v-model="fontFamily"
              :items="fontOptions"
              label="Font Family"
              dense
              outlined
            />
          </v-col>

          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-btn-toggle
              v-model="fontStyle"
              divided
              density="comfortable"
              multiple
            >
              <v-btn value="bold" small>
                <v-icon small>mdi-format-bold</v-icon>
              </v-btn>
              <v-btn value="italic" small>
                <v-icon small>mdi-format-italic</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-switch
              v-model="isUpperCase"
              label="Uppercase"
              dense
            />
          </v-col>

          <v-col cols="12" sm="8" md="6" class="mb-2">
            <v-color-picker
              v-model="color" 
              hide-inputs
              width="100%" 
              flat
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="applySettings" dense>Apply</v-btn>
        <v-btn variant="text" @click="$emit('close')" dense>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['apply', 'close']);

const text = ref('');
const color = ref('#000000');
const fontSize = ref(24);
const fontFamily = ref('Arial');
const fontStyle = ref(null);
const isUpperCase = ref(false);
const textError = ref('');  

const fontOptions = [
  'Arial',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Roboto',
  'Tahoma',
  'Ubuntu',
];

const applySettings = () => {
  if (!text.value.trim()) {
    textError.value = 'Text cannot be empty';
    return;
  }

  let finalText = isUpperCase.value ? text.value.toUpperCase() : text.value;

  const styles = {
    fontSize: fontSize.value,
    fill: color.value,
    fontFamily: fontFamily.value,
  };

  if (fontStyle.value?.includes('bold')) {
    styles.fontWeight = 'bold';
  }
  if (fontStyle.value?.includes('italic')) {
    styles.fontStyle = 'italic';
  }

  const textBaseline = 'alphabetic';

 
  const textbox = new fabric.Textbox(finalText, {
    left: 100,
    top: 100,
    fontSize: styles.fontSize,
    fontFamily: styles.fontFamily,
    fill: styles.fill,
    fontWeight: styles.fontWeight || 'normal',
    fontStyle: styles.fontStyle || 'normal',
    textBaseline: textBaseline,
    hasBorders: true,
    hasControls: true,
  });

  const canvasData = {
    text: finalText,
    color: color.value,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    fontWeight: styles.fontWeight || 'normal',
    fontStyle: styles.fontStyle || 'normal',
    textBaseline: textBaseline,
  };

  emit('apply', canvasData);
};
</script>

<style scoped>
.text-settings-card {
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

 
.scrollable-content {
  overflow-y: auto;
  max-height: 450px; 
  padding-right: 8px;  
}

 
.font-size-label {
  font-size: 0.9rem;
}

 
@media (max-width: 600px) {
  .text-settings-card {
    max-width: 100% !important;
    margin-left: 8px !important;
    margin-right: 8px !important;
  }

 
  .v-container.pa-4 {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  
  .v-btn {
    font-size: 0.9rem;
    min-width: 36px;
    height: 36px;
  }
 
  .v-icon {
    font-size: 18px !important;
  }

 
  .v-row > .v-col {
    margin-bottom: 12px;
  }
}
</style>
