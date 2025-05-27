
<template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar flat class="gradient-toolbar px-4 py-2">
        <v-row align="center" justify="space-between" class="w-100">
          <router-link to="/home">
            <v-btn icon style="color: white">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </router-link>

          <v-toolbar-title class="text-white font-weight-bold">
            Canvas Design
          </v-toolbar-title>
        </v-row>
      </v-toolbar>
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

        <drawingComponent
          v-if="isDrawingMode"
          @applyDrawingSettings="handleDrawingSettings"
        />

        <v-container fluid class="canvas-container">
          <div class="canvas-wrapper">
            <canvas id="my-canvas" width="1000" height="600"></canvas>
            <div v-if="isLoading" class="loading-overlay">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                width="6"
              ></v-progress-circular>
            </div>
          </div>
        </v-container>

        <div class="right-sidebar">
          <v-btn class="btn-style" block @click="upload">Save</v-btn>
          <v-btn class="btn-style" block @click="downloadCanvas"
            >Download</v-btn
          >
          <v-btn class="btn-style" block @click="clearAll">Clear All</v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase.js";
import { useGlobalCanvas } from "@/composables/globalCanvas";
import { useDesignUtils } from "@/utils/designUtils";
import { useDrawingUtils } from "@/utils/drawingUtils";
import { useImageUtils } from "@/utils/imageUtils"; 
import elementsPage from "../canvas/elementsPage.vue";
import drawingComponent from "../canvas/drawingComponent.vue";
import { ref as firebaseRef, set, onValue } from "firebase/database";

const { canvas, initCanvas } = useGlobalCanvas();
const { toggleMode, drawingMode, applySettings } = useDrawingUtils();

const showShapesMenu = ref(false);
const isDrawingMode = ref(false);
const imageInput = ref(null);
const isCanvasReady = ref(false);

const isLoading = ref(false);
let isDataLoadingFromFirebase = false;

// Save data to Firebase
const syncCanvasWithFirebase = (canvasState) => {
  if (isDataLoadingFromFirebase) {
    return;
  }

  const canvasRef = firebaseRef(db, "canvasDesigns");

  // console.log("canvasRef",canvasRef)
  set(canvasRef, canvasState)
    .then(() => {
      console.log("Canvas data saved to Firebase.");
    })
    .catch((error) => {
      console.error("Error saving canvas to Firebase:", error);
    });
};

// Remove undefined values from the canvas state
const removeUndefined = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (typeof obj === "object" && obj !== null) {
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

  canvas.value.getObjects().forEach((obj) => {
    if (obj.type === "path") {
      obj.set({ fill: "transparent" });
    }
  });

  const rawCanvasState = canvas.value.toJSON();
  const cleanedState = removeUndefined(rawCanvasState);
  syncCanvasWithFirebase(cleanedState);
};

// Load Data from Firebase
// Load Data from Firebase
const loadCanvasFromFirebase = () => {
  isLoading.value = true;
  const canvasRef = firebaseRef(db, "canvasDesigns");
  
  onValue(canvasRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        isDataLoadingFromFirebase = true;
        const canvasData = snapshot.val();

        console.log("Firebase data received:", canvasData);

          canvas.value.off("object:added", saveCanvasState);
          canvas.value.off("object:modified", saveCanvasState);
          canvas.value.off("object:removed", saveCanvasState);

        if (!canvas.value) {
          console.error("canvas.value is NULL before load");
          isLoading.value = false;
          return;
        }

        let timeoutTriggered = false;
        const timeout = setTimeout(() => {
          console.warn("loadFromJSON timeout - proceeding without callback");
          timeoutTriggered = true;
          isLoading.value = false;
        }, 2000);

        canvas.value.loadFromJSON(canvasData, () => {
          if (timeoutTriggered) return;
          clearTimeout(timeout);
          
          console.log("Canvas loaded successfully");
          canvas.value.renderAll();
          
          // Reattach event listeners
          canvas.value.on("object:added", saveCanvasState);
          canvas.value.on("object:modified", saveCanvasState);
          canvas.value.on("object:removed", saveCanvasState);
          
          isDataLoadingFromFirebase = false;
          isLoading.value = false;
        });
      } else {
        console.log("No data in Firebase - initializing empty canvas");
        if (canvas.value) {
          canvas.value.clear();
          // Initialize with empty state if needed
          const emptyState = {
            objects: [],
            background: 'white'
          };
          canvas.value.loadFromJSON(emptyState, () => {
            canvas.value.renderAll();
          });
        }
        isLoading.value = false;
      }
    } catch (error) {
      console.error("Error loading canvas:", error);
      isLoading.value = false;
    }
  }, (error) => {
    console.error("Firebase read failed:", error);
    isLoading.value = false;
  });
};

// Toggle shapes menu visibility
const toggleShapesMenu = () => (showShapesMenu.value = !showShapesMenu.value);

// Download canvas as an image
const downloadCanvas = () => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot download.");
    return;
  }
  const dataUrl = canvas.value.toDataURL({ format: "png", quality: 1 });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "canvas-design.png";
  link.click();
};

// Create a new design
const createNewDesign = () => {
  //  Save current design to localStorage before clearing
  const currentDesign = canvas.value.toJSON();
  const existingDesigns =
    JSON.parse(localStorage.getItem("savedDesigns")) || [];
  existingDesigns.push(currentDesign);
  localStorage.setItem("savedDesigns", JSON.stringify(existingDesigns));

  //   Remove event listeners
  canvas.value.off("object:added");
  canvas.value.off("object:modified");
  canvas.value.off("object:removed");

  //  Clear canvas
  canvas.value.clear();

  //  Sync blank canvas to Firebase
  const canvasRef = firebaseRef(db, "canvasDesigns");
  set(canvasRef, {}).then(() => {
    console.log("Firebase cleared");
    syncCanvasWithFirebase(canvas.value.toJSON());
  });

  //  Re-attach event listeners
  canvas.value.on("object:added", saveCanvasState);
  canvas.value.on("object:modified", saveCanvasState);
  canvas.value.on("object:removed", saveCanvasState);
};
const clearAll = () => {
  if (canvas.value) {
    canvas.value.clear();
    saveCanvasState();
  }
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
  canvas.value.defaultCursor = canvas.value.isDrawingMode
    ? "crosshair"
    : "default";
};

// Apply drawing settings to the canvas
const handleDrawingSettings = (settings) => {
  if (!canvas.value) {
    console.warn("Canvas is not initialized. Cannot apply drawing settings.");
    return;
  }
  applySettings(canvas.value, settings);
};

const { triggerImageUpload } = useImageUtils(canvas);

// Upload the design to local storage
const upload = () => {
  canvas.value.off("object:added");
  canvas.value.off("object:modified");
  canvas.value.off("object:removed");
  const designData = canvas.value.toJSON();
  const localDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];
  localDesigns.push(designData);
  localStorage.setItem("savedDesigns", JSON.stringify(localDesigns));
  canvas.value.clear();
  canvas.value.on("object:added", saveCanvasState);
  canvas.value.on("object:modified", saveCanvasState);
  canvas.value.on("object:removed", saveCanvasState);
  exitDrawingMode();
};

// Handle action based on menu item
const handleAction = (item) => {
  if (item.actionType === "function" && typeof item.action === "function") {
    item.action();
  }
};
const exitDrawingMode = () => {
  if (!canvas.value) return;
  canvas.value.isDrawingMode = false;
  canvas.value.defaultCursor = "default";
  isDrawingMode.value = false;
};

// Icons list for the menu
const iconsList = ref([
  { icon: "mdi-file-plus",label: "New Design",actionType: "function",action: createNewDesign, },
  {icon: "mdi-shape",label: "Shapes",actionType: "function",action: toggleShapesMenu, },
  {icon: "mdi-draw",label: "Draw",actionType: "function",action: toggleDrawingModeHandler, },
  {icon: "mdi-image",label: "Media",actionType: "function",action: triggerImageUpload,},
  {icon: "mdi-content-save", label: "Saved Designs",actionType: "route",action: "/save",  },
]);

onMounted(() => {
  const initializedCanvas = initCanvas();
  if (!initializedCanvas) {
    console.error("Canvas initialization failed.");
    return;
  }

  console.log("Canvas initialized:", initializedCanvas);
  canvas.value = initializedCanvas;
  isCanvasReady.value = true;

  canvas.value.renderAll();

  loadCanvasFromFirebase();

  // Event listeners for object modifications on the canvas

  canvas.value.on("object:added", saveCanvasState);
  canvas.value.on("object:modified", saveCanvasState);
  canvas.value.on("object:removed", saveCanvasState);
 
});
</script>

<style scoped>
.v-main {
  height: 100vh;
  overflow: auto;
}
.gradient-toolbar {
  background-color: #7f7fd5;
  color: white;
}

.main-container {
  display: flex;
  height: 100%;
  flex-wrap: nowrap;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;  
}

.nav-list-left {
  padding-top: 10px;
}

.nav-list-item-action,
.nav-link {
  cursor: pointer;
}

.nav-link {
  text-decoration: none;
  color: inherit;
}

.v-list-item {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: #f0f0ff;
}

.canvas-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  overflow: auto;
}

.canvas-wrapper {
  border: 1px solid black;

  height: auto;
  margin-top: 40px;
}

canvas#my-canvas {
  width: 100%;
  display: block;
  margin: 0 auto;
}

.v-navigation-drawer:first-of-type {
  width: 150px !important;
  position: relative;
  margin: 20px 0;
}

.v-navigation-drawer:nth-of-type(2) {
  width: 100px !important;
}

.right-sidebar {
  width: 150px;
  height: 10px;
  background-color: white;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  position: sticky;
  top: 14px;
}

/* Button styles */
.btn-style {
  background-color: #7f7fd5;
  color: white;
}

@media (max-width: 1024px) {
  .v-navigation-drawer:first-of-type {
    width: 120px !important;
    margin: 10px 0;
  }
  .v-navigation-drawer:nth-of-type(2) {
    width: 80px !important;
  }

  .canvas-wrapper {
    width: 800px;
    margin-top: 20px;
  }
}

@media (max-width: 600px) {
  .main-container {
    flex-direction: column;
    height: auto;
  }

  .v-navigation-drawer:nth-of-type(2) {
    display: none !important;
  }

  .v-navigation-drawer:first-of-type {
    width: 100% !important;
    height: 50px !important;
    margin: 0;
    flex-shrink: 0;
    position: fixed !important;
    top: 0;
    left: 0;
    flex-direction: row !important;
    overflow-x: auto;
    display: flex !important;
    align-items: center;
    padding-left: 10px;
    z-index: 1000;
  }

  .v-navigation-drawer:first-of-type .v-list {
    display: flex !important;
    flex-direction: row !important;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .v-navigation-drawer:first-of-type .v-list-item {
    min-width: 60px;
    margin-right: 10px;
    padding: 0 5px;
  }

  .canvas-wrapper {
    width: 100% !important;
    margin-top: 10px !important;
    border: none !important;
  }

  canvas#my-canvas {
    max-height: none;
  }
}
</style>
