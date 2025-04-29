<template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar-title class="text-h4" style="color: white">Collabie</v-toolbar-title>
      <v-btn @click="undoAction" icon>
        <v-icon>mdi-undo</v-icon>
      </v-btn>
      <v-btn @click="redoAction" icon>
        <v-icon>mdi-redo</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
 
      <input
        type="file"
        ref="imageInput"
        @change="handleImageUpload"
        style="display: none"
        accept="image/*"
      />
      <v-container fluid class="d-flex pa-0">
        <v-navigation-drawer width="150" color="white">
          <v-list dense nav>
            <template v-for="(item, index) in iconsList" :key="index">
              <router-link v-if="item.actionType === 'route'" :to="item.action">
                <v-list-item>
                  <v-btn outlined icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-btn>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
              <v-list-item v-else @click="handleAction(item.action)">
                <v-btn outlined icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
                <v-list-item-content>
                  <v-list-item-title>{{ item.label }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer width="100">
          <elementsPage v-if="showShapesMenu" />
        </v-navigation-drawer>

        <drawingComponent v-if="isDrawingMode" @applyDrawingSettings="handleDrawingSettings" />

        <div class="dashboard-container">
          <div class="canvas-wrapper">
            <canvas id="my-canvas" width="600" height="500"></canvas>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'; 
 import { useGlobalCanvas } from  '../composables/globalCanvas';

import { useCanvasUtils } from  '../utils/canvasUtils'
import { useDesignUtils } from  '../utils/designUtils'
import { useDrawingUtils } from '../utils/drawingUtils'
import { useImageUtils } from '../utils/imageUtils'
import elementsPage from '../components/elementsPage.vue';
import drawingComponent from  '../components/drawingComponent.vue';

const { canvas, initCanvas } = useGlobalCanvas();
const { undoAction, redoAction } = useCanvasUtils(canvas);
const { uploadCanvas, createNew } = useDesignUtils();
const { toggleMode, drawingMode, applySettings } = useDrawingUtils();
const { handleImageUpload, triggerImageUpload } = useImageUtils(canvas);

const savedDesigns = ref([]);
const isObjectSelected = ref(false);
const showShapesMenu = ref(false);
const isDrawingMode = ref(false);
const imageInput = ref(null);

const saveCanvasState = () => {
  if (canvas.value) {
    const canvasState = canvas.value.toJSON();
    localStorage.setItem('savedDesign', JSON.stringify(canvasState));
    console.log('Canvas state saved.');
  } else {
    console.error('Canvas is not initialized yet!');
  }
};

const toggleShapesMenu = () => {
  showShapesMenu.value = !showShapesMenu.value;
};

const downloadCanvas = () => {
  if (canvas.value) {
    const dataUrl = canvas.value.toDataURL({
      format: 'png',
      quality: 1,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas-design.png';
    link.click();
  } else {
    console.error('Canvas is not initialized yet!');
  }
};

const createNewDesign = () => {
  if (canvas.value && canvas.value.isInitialized) {
    canvas.value.clear();
    localStorage.removeItem("savedDesign");
  } else {
    console.error('Canvas is not initialized yet.');
  }
};

const toggleDrawingModeHandler = () => {
  if (canvas.value) {
    toggleMode(canvas.value, setCanvasCursor);
    isDrawingMode.value = true;
  }
};

const handleDrawingSettings = (settings) => {
  if (canvas.value) {
    applySettings(canvas.value, settings);
  }
};

const upload = () => {
  if (canvas.value) {
    const designData = canvas.value.toJSON();
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
    savedDesigns.push(designData);   
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
    canvas.value.clear();
  } else {
    console.error('Canvas is not initialized yet!');
  }
};


const actions = {
  createNewDesign,
  toggleShapesMenu,
  toggleDrawingModeHandler,
  downloadCanvas,
  triggerImageUpload,
  upload,
};

const iconsList = ref([
  {
    icon: 'mdi-home',
    label: 'Home',
    actionType: 'route',
    action: '/',
  },
  {
    icon: 'mdi-plus',
    label: 'New Design',
    actionType: 'function',
    action: createNewDesign,
  },
  {
    icon: 'mdi-shape-outline',
    label: 'Elements',
    actionType: 'function',
    action: toggleShapesMenu,
  },
  {
    icon: 'mdi-pencil',
    label: 'Draw',
    actionType: 'function',
    action: toggleDrawingModeHandler,
  },
  {
    icon: 'mdi-cloud-upload',
    label: 'Upload',
    actionType: 'function',
    action: upload,
  },
  {
    icon: 'mdi-image',
    label: 'Media',
    actionType: 'function',
    action: triggerImageUpload,
  },
  {
    icon: 'mdi-content-save',
    label: 'Saved Designs',
    actionType: 'route',
    action: '/save',
  },
  {
    icon: 'mdi-download',
    label: 'Download',
    actionType: 'function',
    action: downloadCanvas,
  }, 
]);

onMounted(() => {
  const initializedCanvas = initCanvas();  
  canvas.value = initializedCanvas;
 
  initializedCanvas.on('after:render', () => { 
    canvas.value.isInitialized = true;   
  });

  const savedDesign = localStorage.getItem('savedDesign');
  if (savedDesign) {
    canvas.value.loadFromJSON(JSON.parse(savedDesign), () => {
      canvas.value.renderAll();
      console.log('Canvas loaded from saved design.');
    });
  } else {
    console.log('No saved design found.');
  }

  initializedCanvas.on('object:added', () => {
    if (canvas.value.isDrawingMode) {
      switchToSelectionMode();
    }
  });

  initializedCanvas.on('selection:created', () => {
    if (!canvas.value.isDrawingMode) {
      console.log('Object selected');
    }
  });

  initializedCanvas.on('selection:cleared', () => {
    console.log('Selection cleared');
  });

  canvas.value.isDrawingMode = false;
  setCanvasCursor();

  initializedCanvas.on('object:added', saveCanvasState);
  initializedCanvas.on('object:modified', saveCanvasState);
  initializedCanvas.on('object:removed', saveCanvasState);
});

const switchToSelectionMode = () => {
  canvas.value.isDrawingMode = false;
  setCanvasCursor();
  setCanvasSelectionState();
};

const setCanvasCursor = () => {
  if (canvas.value) {
    canvas.value.defaultCursor = canvas.value.isDrawingMode ? 'crosshair' : 'default';
  }
};

const setCanvasSelectionState = () => {
  if (canvas.value) {
    canvas.value.selection = !canvas.value.isDrawingMode;
  }
};

const handleAction = (actionName) => {
  if (typeof actionName === 'function') {
    actionName();
  } else {
    console.warn(`Action ${actionName} not found.`);
  }
};
</script>


<style scoped>
.v-list-item {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.v-list-item:hover {
  background-color: #f0f0ff;
}
.canvas-wrapper {
  border: 1px solid black;
  margin-top: 40px;
}
.v-navigation-drawer {
  position: relative;
  margin: 20px 0px;
}
</style>
