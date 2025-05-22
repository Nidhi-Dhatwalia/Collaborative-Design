
<template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar-title class="text-h4" style="color: white">
        Collabie
      </v-toolbar-title>
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
                  <v-list-item-title>{{ item.label }}</v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item v-else @click="() => handleAction(item)">
                <v-btn outlined icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer width="100">
          <elementsPage v-if="showShapesMenu" />
        </v-navigation-drawer>

        <drawingComponent v-if="isDrawingMode" @applyDrawingSettings="handleDrawingSettings" />

        <v-container fluid class="canvas-container">
          <div class="canvas-wrapper">
            <canvas id="my-canvas" width="600" height="500"></canvas>
          </div>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, onMounted } from 'vue'; 
import { db } from '@/firebase.js';
import { useGlobalCanvas } from '@/composables/globalCanvas'; 
import { useDesignUtils } from '@/utils/designUtils';
import { useDrawingUtils } from '@/utils/drawingUtils';
import { useImageUtils } from '@/utils/imageUtils';
import elementsPage from '../canvas/elementsPage.vue';
import drawingComponent from '../canvas/drawingComponent.vue'
import { ref as firebaseRef, set, onValue } from 'firebase/database';
 

const { canvas, initCanvas } = useGlobalCanvas(); 
const { toggleMode, drawingMode, applySettings } = useDrawingUtils();

const showShapesMenu = ref(false);
const isDrawingMode = ref(false);
const imageInput = ref(null);
const isCanvasReady = ref(false);

let isDataLoadingFromFirebase = false;

// Save data to Firebase
const syncCanvasWithFirebase = (canvasState) => {
  if (isDataLoadingFromFirebase) { 
    return;
  }

  const canvasRef = firebaseRef(db, 'canvasDesigns');

    // console.log("canvasRef",canvasRef)
  set(canvasRef, canvasState)
    .then(() => {
      console.log('Canvas data saved to Firebase.');
    })
    .catch((error) => {
      console.error('Error saving canvas to Firebase:', error);
    });
};

// Remove undefined values from the canvas state
const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = removeUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
};

// Save Canvas Data  
const saveCanvasState = () => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Skipping save.");
    return;
  }
 
  canvas.value.getObjects().forEach(obj => {
    if (obj.type === 'path') {
      obj.set({ fill: 'transparent' });
    }
  });

  const rawCanvasState = canvas.value.toJSON();
  const cleanedState = removeUndefined(rawCanvasState);
  syncCanvasWithFirebase(cleanedState);
};


// Load Data from Firebase
const loadCanvasFromFirebase = () => {
  const canvasRef = firebaseRef(db, 'canvasDesigns');
  // console.log("Loading canvas data from Firebase...");
  onValue(canvasRef, (snapshot) => {
    if (snapshot.exists()) {
      const canvasData = snapshot.val();

      console.log("Firebase data received:", canvasData);

      if (!canvas.value) {
        console.error("canvas.value is NULL before load");
        isDataLoadingFromFirebase = false;
        return;
      }

      isDataLoadingFromFirebase = true;
      let timeoutTriggered = false;

      const timeout = setTimeout(() => {
        console.warn("loadFromJSON callback NOT triggered in 3s, resetting flag manually");
        isDataLoadingFromFirebase = false;
        timeoutTriggered = true;
      }, 3000);

      // Ensure the data is properly structured
      if (canvasData && canvasData.objects) {
        canvas.value.loadFromJSON(canvasData, () => {
  if (!timeoutTriggered) {
    clearTimeout(timeout);
  } else {
    console.warn("Callback triggered after timeout!");
  }

  console.log("loadFromJSON callback triggered");

  // Fix all paths fill here 
  canvas.value.getObjects().forEach(obj => {
    if (obj.type === 'path' && (obj.fill === 'black' || obj.fill === null || obj.fill === undefined)) {
      obj.set({ fill: 'transparent' });  
    }
  });

  setTimeout(() => {
    canvas.value.renderAll(); 
    // Ensure events are set after render
    canvas.value.on('object:added', saveCanvasState);
    canvas.value.on('object:modified', saveCanvasState);
    canvas.value.on('object:removed', saveCanvasState);

    isDataLoadingFromFirebase = false;
    console.log("Canvas fully loaded. Flag reset:", isDataLoadingFromFirebase);
  }, 100);

});

      }  
    } else {
      console.log("Firebase: No canvas data found");
      isDataLoadingFromFirebase = false;
    }
  });
};


// Toggle shapes menu visibility
const toggleShapesMenu = () => showShapesMenu.value = !showShapesMenu.value;

// Download canvas as an image
const downloadCanvas = () => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot download.");
    return;
  }
  const dataUrl = canvas.value.toDataURL({ format: 'png', quality: 1 });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'canvas-design.png';
  link.click();
};

// Create a new design  
const createNewDesign = () => {

  //  Save current design to localStorage before clearing
  const currentDesign = canvas.value.toJSON();
  const existingDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
  existingDesigns.push(currentDesign);
  localStorage.setItem('savedDesigns', JSON.stringify(existingDesigns));

  //   Remove event listeners
  canvas.value.off('object:added');
  canvas.value.off('object:modified');
  canvas.value.off('object:removed');

  //  Clear canvas
  canvas.value.clear();

  //  Sync blank canvas to Firebase
const canvasRef = firebaseRef(db, 'canvasDesigns');
  set(canvasRef, {})  
    .then(() => {
      console.log('Firebase cleared'); 
      syncCanvasWithFirebase(canvas.value.toJSON());
    });

  //  Re-attach event listeners
  canvas.value.on('object:added', saveCanvasState);
  canvas.value.on('object:modified', saveCanvasState);
  canvas.value.on('object:removed', saveCanvasState);
 
};


// Toggle drawing mode
const toggleDrawingModeHandler = () => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot toggle drawing mode.");
    return;
  }
  toggleMode(canvas.value, setCanvasCursor);
  isDrawingMode.value = !isDrawingMode.value;
};

// Set cursor for drawing mode
const setCanvasCursor = () => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot set cursor.");
    return;
  }
  canvas.value.defaultCursor = canvas.value.isDrawingMode ? 'crosshair' : 'default';
};

// Apply drawing settings to the canvas
const handleDrawingSettings = (settings) => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot apply drawing settings.");
    return;
  }
  applySettings(canvas.value, settings);
};

const {
  triggerImageUpload, 
} = useImageUtils(canvas);

// Upload the design to local storage
const upload = () => {
  const designData = canvas.value.toJSON();
  const localDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || [];
  localDesigns.push(designData);
  localStorage.setItem('savedDesigns', JSON.stringify(localDesigns));
  canvas.value.clear();
  canvas.value.renderAll();
};

// Handle action based on menu item
const handleAction = (item) => {
  if (item.actionType === 'function' && typeof item.action === 'function') {
    item.action();
  }
};

// Icons list for the menu
const iconsList = ref([
  { icon: 'mdi-home', label: 'Home', actionType: 'route', action: '/dashboard' },
  { icon: 'mdi-file-plus', label: 'New Design', actionType: 'function', action: createNewDesign },
  { icon: 'mdi-shape', label: 'Shapes', actionType: 'function', action: toggleShapesMenu },
  { icon: 'mdi-pencil', label: 'Draw', actionType: 'function', action: toggleDrawingModeHandler },
  { icon: 'mdi-cloud-upload', label: 'Save', actionType: 'function', action: upload },
  { icon: 'mdi-image', label: 'Media', actionType: 'function', action: triggerImageUpload },
  { icon: 'mdi-content-save', label: 'Saved Designs', actionType: 'route', action: '/save' },
  { icon: 'mdi-download', label: 'Download', actionType: 'function', action: downloadCanvas },
]);

onMounted(() => {
  const initializedCanvas = initCanvas();
  if (!initializedCanvas) {
    console.error('Canvas initialization failed.');
    return;
  }
  console.log('Canvas initialized:', initializedCanvas);
  canvas.value = initializedCanvas;
  isCanvasReady.value = true;
 
  canvas.value.renderAll();

  loadCanvasFromFirebase();

  // Event listeners for object modifications on the canvas
 
  canvas.value.on('object:added', (e) => { 
    saveCanvasState();
  });

  canvas.value.on('object:modified', (e) => { 
    saveCanvasState();
  });

  canvas.value.on('object:removed', (e) => { 
    saveCanvasState();
  });
});
</script>

<style scoped>
.v-main {
  height: 100vh;
}

.v-container {
  flex: 1;
  height: 100%;
  display: flex;
}

.v-list-item {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: #f0f0ff;
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  background-color: white;
  padding: 10px;
}

canvas#my-canvas {
  max-width: 100%;
  max-height: 600px;
}

.v-navigation-drawer {
  position: relative;
  margin: 20px 0px;
}
</style>
 
