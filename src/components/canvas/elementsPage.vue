<template>
  <v-container class="d-flex justify-center">
    <v-row class="pa-0 ma-0" justify="center">
      <!-- Shape Buttons -->
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('rectangle')">
          <v-icon size="x-large">mdi-rectangle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('circle')">
          <v-icon size="x-large">mdi-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('triangle')">
          <v-icon size="x-large">mdi-triangle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="createShape('text')">
          <v-icon size="x-large">mdi-format-text</v-icon>
        </v-btn>
      </v-col>
      <!-- Zoom Buttons -->
      <v-col cols="auto" class="mx-2">
        <v-btn @click="zoomIn">
          <v-icon size="x-large">mdi-magnify-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="mx-2">
        <v-btn @click="zoomOut">
          <v-icon size="x-large">mdi-magnify-minus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Color Picker for Selected Object -->
  <div v-show="isObjectSelected" class="color-picker-container">
    <input type="color" v-model="selectedColor" @input="updateColor" />
  </div>

  <!-- Edit/Delete Buttons -->
  <div class="button-container">
    <v-btn v-show="isObjectSelected" @click="deleteSelected">
      <v-icon size="x-large">mdi-delete</v-icon>
    </v-btn>
    <v-btn v-show="isObjectSelected" @click="editSelected">
      <v-icon size="x-large">mdi-pencil</v-icon>
    </v-btn>
  </div>

  <!-- Text Settings Dialog -->
  <v-dialog v-model="showTextDialog" max-width="500px">
    <textSettings @apply="handleTextApply" @close="showTextDialog = false" />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as fabric from 'fabric';

import { useGlobalCanvas } from '@/composables/globalCanvas';
import textSettings from '../dashboard/dashboardPage.vue';

 
const { canvas, initCanvas } = useGlobalCanvas();
const selectedColor = ref('#000000');
const isObjectSelected = ref(false);
const showTextDialog = ref(false);

// Save the current canvas state to localStorage
const saveCanvasState = () => {
  try {
    const currentState = canvas.value.toJSON();
    const jsonState = JSON.stringify(currentState);
    localStorage.setItem('savedDesign', jsonState);
    console.log('Canvas saved to localStorage');
  } catch (error) {
    console.error('Error saving canvas state:', error);
  }
};

// Initialize the canvas on mounted
onMounted(() => {
  initCanvas();
  canvas.value.renderAll();

  // Load saved design from localStorage  
  const savedDesign = localStorage.getItem('savedDesign');
  if (savedDesign) {
    const savedState = JSON.parse(savedDesign);
    canvas.value.loadFromJSON(savedState, () => {
      canvas.value.renderAll();
    });
  }

  // Event listeners for object selection
  canvas.value.on('selection:created', () => {
    isObjectSelected.value = true;
  });
  canvas.value.on('selection:updated', () => {
    isObjectSelected.value = true;
  });
  canvas.value.on('selection:cleared', () => {
    isObjectSelected.value = false;
  });

  // Mouse wheel zoom
  canvas.value.on('mouse:wheel', (opt) => {
    const delta = opt.e.deltaY;
    delta > 0 ? zoomOut() : zoomIn();
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
});

 
watch(selectedColor, (newColor) => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ fill: newColor });
    canvas.value.renderAll();
    saveCanvasState();
  }
});

// Find an empty position on the canvas 
const findEmptyPosition = (width, height) => {
  const margin = 20;
  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;

  let x, y;
  let overlap = true;
  let attempts = 0;

   
  while (overlap && attempts < 100) {
    x = Math.random() * (canvasWidth - width - margin);
    y = Math.random() * (canvasHeight - height - margin);

    overlap = canvas.value.getObjects().some(obj => {
      return (
        x < obj.left + obj.width + margin &&
        x + width + margin > obj.left &&
        y < obj.top + obj.height + margin &&
        y + height + margin > obj.top
      );
    });

    attempts++;
  }

  if (attempts >= 100) {
    console.warn('Unable to find empty position after 100 attempts.');
  }

  return { x, y };
};

 
const createShape = (type) => {
  if (!canvas.value) {
    console.warn('Canvas is not initialized. Cannot add shape.');
    return;
  }

  let shape = null;
  let position = { x: 50, y: 50 };

  if (type !== 'text') {
    position = findEmptyPosition(100, 100);
  }

  // Create shape based on type
  if (type === 'rectangle') {
    shape = new fabric.Rect({
      width: 100,
      height: 100,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
      selectable: true,
    });
  } else if (type === 'circle') {
    shape = new fabric.Circle({
      radius: 50,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
      selectable: true,
    });
  } else if (type === 'triangle') {
    shape = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: selectedColor.value,
      left: position.x,
      top: position.y,
    });
  } else if (type === 'text') {
    showTextDialog.value = true;
  }

  if (shape) {
    shape.set({ selectable: true });
    canvas.value.add(shape);
    canvas.value.renderAll();
    saveCanvasState();
  }
};

// Handle  text settings
const handleTextApply = ({ text, color, fontSize, fontFamily, fontWeight, fontStyle, textBaseline }) => {
  const validTextBaseline = ['alphabetic', 'middle', 'ideographic'];
  const finalTextBaseline = validTextBaseline.includes(textBaseline) ? textBaseline : 'alphabetic';

  if (!text || !color || !fontSize || !fontFamily) {
    console.error('Invalid text settings');
    return;
  }

  const textbox = new fabric.Textbox(text, {
    left: 250,
    top: 150,
    width: 300,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fill: color,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textBaseline: finalTextBaseline,
    hasBorders: true,
    hasControls: true,
  });

  textbox.set({ selectable: true });
  canvas.value.add(textbox);
  canvas.value.renderAll();
  saveCanvasState();
  showTextDialog.value = false;
};

// Zoom the active object  
const zoomObject = (scaleFactor) => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.scaleX *= scaleFactor;
    activeObject.scaleY *= scaleFactor;
    activeObject.setCoords();
    canvas.value.renderAll();
    saveCanvasState();
  } else {
    console.warn('No object selected for zoom operation.');
  }
};

// Zoom in/out functionality
const zoomIn = () => zoomObject(1.1);
const zoomOut = () => zoomObject(0.9);

// Edit the selected object  
const editSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    activeObject.set({ stroke: 'yellow', strokeWidth: 5 });
    canvas.value.renderAll();
    saveCanvasState();
  }
};

// Delete the selected object
const deleteSelected = () => {
  const activeObject = canvas.value.getActiveObject();
  if (activeObject) {
    canvas.value.remove(activeObject);
    canvas.value.discardActiveObject();
    canvas.value.requestRenderAll();
    isObjectSelected.value = false;
    saveCanvasState();
  }
};
</script>

<style scoped>
.v-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid black;
  margin: 0px 12px;
}

.v-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.v-row {
  margin-top: 20px;
}

.v-col {
  display: flex;
  justify-content: center;
}

.color-picker-container {
  margin-top: 20px;
  text-align: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input[type='color'] {
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
}
</style>
