<template>
  <v-card>
    <v-card-title>
      Text Settings
    </v-card-title>

    <v-card-text> 
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

const validateCanvasData = (canvasData) => {
  canvasData.objects.forEach((object, index) => {
    if (!object.path) {
      console.error(`Object at index ${index} is missing a path.`);
      // Optionally, set a default path or handle it in another way
      object.path = object.path || 'default-path'; // Example default
    }
  });
};

const saveToFirebase = (canvasData) => {
  const validData = validateFirebaseData(canvasData);
  firebase.database().ref('canvasDesigns').set(validData); // Save valid data
};

const applySettings = () => {
  console.log('applySettings triggered');

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

  const textBaseline = 'alphabetic';

  const canvasData = {
    text: finalText,
    color: color.value,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    fontWeight: styles.fontWeight || 'normal',
    fontStyle: styles.fontStyle || 'normal',
    textBaseline: textBaseline,
    objects: [
      {
        path: 'some-path', // Ensure this is valid
      },
    ]
  };

  // Validate canvas data before emitting it
  validateCanvasData(canvasData);

  emit('apply', canvasData); // Emit the data to the parent component
  console.log(canvasData);
};


</script>
