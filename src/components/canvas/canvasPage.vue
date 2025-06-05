<template>
  <v-app fluid>
    <navBar />

    <v-main>
      <input
        type="file"
        ref="imageInput"
        @change="handleImageUpload"
        style="display: none"
        accept="image/*"
      />
      <v-container fluid class="d-flex pa-0">

    <v-navigation-drawer width="100" color="#f0f1f5" >
      <v-list dense nav>
        <template v-for="(item, index) in iconsList" :key="index" >
      
            <router-link
            v-if="item.actionType === 'route'"
            :to="item.action"
            @click="selectedIndex = index"
            style="text-decoration: none; color: inherit">
        
            <v-list-item>
              <v-btn outlined icon  color="#f0f1f5">
                <v-icon >
                  {{ item.icon }}
                </v-icon>
              </v-btn>
              <v-list-item-title :style="{ color: 'black' }" >{{ item.label }}</v-list-item-title>
            </v-list-item>
            </router-link>

          <v-list-item v-else @click="() => handleAction(item)" >
            <v-btn outlined icon   color="#f0f1f5">
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-btn>
              <v-list-item-title :style="{ color: 'black' }" >{{ item.label }}</v-list-item-title>
          </v-list-item>

        </template>
      </v-list>
    </v-navigation-drawer>


    <v-slide-x-transition>
      <div v-show="showShapesMenu"  class="custom-sidebar" >
        <elementsPage />
      </div>
    </v-slide-x-transition>

      <drawingComponent v-if="isDrawingMode"  @applyDrawingSettings="handleDrawingSettings" />
    
        <v-container fluid class="canvas-container">
          <div class="canvas-wrapper">
            <canvas id="my-canvas" width="1000" height="600"></canvas>
              <div v-if="isLoading" class="loading-overlay">
                <v-progress-circular  indeterminate   color="primary"  size="64"  width="6" >     </v-progress-circular>
              </div>
          </div>
        </v-container>

        <!-- comment SideBar  -->
        <div  >
           <commentSidebar  />
        </div>


      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, onMounted,provide } from "vue";
import { db } from "@/firebase.js";

import { useGlobalCanvas } from "@/composables/globalCanvas";
import { useDesignUtils } from "@/utils/designUtils";
import { useDrawingUtils } from "@/utils/drawingUtils";
import { useImageUtils } from "@/utils/imageUtils"; 

const { canvas, initCanvas } = useGlobalCanvas();
const { toggleMode, drawingMode, applySettings } = useDrawingUtils();
const { triggerImageUpload } = useImageUtils(canvas);



//canvas Component 
import navBar from '../canvas/navBar.vue';
import commentSidebar from '../canvas/commentSidebar.vue';

import elementsPage from "../canvas/elementsPage.vue";
import drawingComponent from "../canvas/drawingComponent.vue";


import { ref as firebaseRef, set, onValue } from "firebase/database";

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
const loadCanvasFromFirebase = () => {
    isLoading.value = true; 
    const canvasRef = firebaseRef(db, 'canvasDesigns');
    // console.log("Loading canvas data from Firebase...");
    onValue(canvasRef, (snapshot) => {
      if (snapshot.exists()) {
        isDataLoadingFromFirebase = true;
        const canvasData = snapshot.val();

        console.log("Firebase data received:", canvasData);

        canvas.value.off('object:added');
        canvas.value.off('object:modified');
        canvas.value.off('object:removed');

        if (!canvas.value) {
          console.error("canvas.value is NULL before load");
              isLoading.value = false;
          isDataLoadingFromFirebase = false;
          return;
        }

      isDataLoadingFromFirebase = true;
      let timeoutTriggered = false;

        const timeout = setTimeout(() => {
          console.log("loadFromJSON callback NOT triggered in 3s, resetting flag manually");
          isDataLoadingFromFirebase = false;
              isLoading.value = false;
          timeoutTriggered = true;
        }, 3000);

    // Ensure the data is properly structured
        if (canvasData && canvasData.objects) {
          canvas.value.loadFromJSON(canvasData, () => {

    console.log("loadFromJSON callback triggered");

      setTimeout(() => {
      canvas.value.renderAll();  
    
      // Ensure events are set after render
      canvas.value.on('object:added', saveCanvasState);
      canvas.value.on('object:modified', saveCanvasState);
      canvas.value.on('object:removed', saveCanvasState);

      isDataLoadingFromFirebase = false;
          isLoading.value = false;
      console.log("Canvas fully loaded. Flag reset:", isDataLoadingFromFirebase);
    }, 100);

    });
      }  
      } else {
        console.log("Firebase: No canvas data found");
        isDataLoadingFromFirebase = false;
            isLoading.value = false;
      }
    });
};

       

// Create a new design
const createNewDesign = () => {
  canvas.value.off('object:added');
    canvas.value.off('object:modified');
    canvas.value.off('object:removed');
    canvas.value.clear();
    syncCanvasWithFirebase(canvas.value.toJSON());
    localStorage.removeItem("savedDesign");
    canvas.value.on('object:added', saveCanvasState);
    canvas.value.on('object:modified', saveCanvasState);
    canvas.value.on('object:removed', saveCanvasState);
};

  
  // Toggle shapes menu visibility
  const toggleShapesMenu = () => (
      showShapesMenu.value = !showShapesMenu.value);
  
    // Download canvas as an image
  const downloadCanvas = () => {
      const dataUrl = canvas.value.toDataURL({ format: "png", quality: 1 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "canvas-design.png";
      link.click();
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
      ? "crosshair" : "default";
};



// Apply drawing settings to the canvas
const handleDrawingSettings = (settings) => {
    if (!canvas.value) {
      console.warn("Canvas is not initialized. Cannot apply drawing settings.");
      return;
    }
    applySettings(canvas.value, settings);
};


// Upload the design to local storage
const upload = () => {
    canvas.value.off("object:added");
    canvas.value.off("object:modified");
    canvas.value.off("object:removed");
    const designData = canvas.value.toJSON();
    const localDesigns = JSON.parse(localStorage.getItem("savedDesigns")) || [];
    localDesigns.push(designData);
    alert("Your Design Saved Successfully !");
    localStorage.setItem("savedDesigns", JSON.stringify(localDesigns));
    canvas.value.clear();
    canvas.value.on("object:added", saveCanvasState);
    canvas.value.on("object:modified", saveCanvasState);
    canvas.value.on("object:removed", saveCanvasState);
   
};

// Handle action based on menu item
const handleAction = (item) => { 
      if (item.actionType === "function" && typeof item.action === "function") {
      item.action();
    }
  };
 
// Icons list for the menu
const iconsList = ref([ 
    { icon: "mdi-file-plus",label: "New Design",actionType: "function",action: createNewDesign, },
    {icon: "mdi-shape",label: "Shapes",actionType: "function",action: toggleShapesMenu, },
    {icon: "mdi-draw",label: "Draw",actionType: "function",action: toggleDrawingModeHandler, },
    {icon: "mdi-image",label: "Media",actionType: "function",action: triggerImageUpload,},  
    {icon: "mdi-content-save", label: "Saved Designs",actionType: "route",action: "/save",  },
]);

 
provide('upload', upload);
provide('downloadCanvas',downloadCanvas);
 
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

  //Load Data from Firebase 
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
  background-color: #f9f9fc;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

/* Navigation Drawer */
.v-navigation-drawer:first-of-type {
  width: 100px !important;
  background-color: #f0f1f5 !important;
  border-right: 1px solid #d3d3d3;
  padding-top: 20px;
}

.v-list-item {
  padding: 10px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.v-list-item:hover {
  background-color: #e0e0e0;
}

.v-btn {
  background-color: white !important;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.v-btn:hover {
  background-color: #e7e8eb !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.v-icon {
  font-size: 24px;
}

.v-list-item-title {
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
  color: #333;
  font-weight: 500;
}

/* Canvas Styling */
.canvas-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
}

.canvas-wrapper {
  border: 2px solid #dcdcdc;
  background-color: white;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

canvas#my-canvas {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Custom Sidebar (Shapes) */
.custom-sidebar {
  width: 120px;
  background-color: #fafafa;
  border-left: 1px solid #d3d3d3;
  padding: 10px;
  height: 100vh;
  position: sticky;
  top: 0;
  box-shadow: -1px 0 3px rgba(0, 0, 0, 0.05);
}

/* Mobile Responsive Adjustments */
@media (max-width: 1024px) {
  .canvas-wrapper {
    max-width: 90%;
  }

  .v-navigation-drawer:first-of-type {
    width: 90px !important;
  }
}

@media (max-width: 600px) {
  .v-navigation-drawer:first-of-type {
    width: 100% !important;
    height: 56px !important;
    position: fixed !important;
    top: 0;
    left: 0;
    flex-direction: row !important;
    display: flex !important;
    justify-content: flex-start;
    align-items: center;
    overflow-x: auto;
    z-index: 1000;
    padding: 0 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .v-navigation-drawer:first-of-type .v-list {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .v-navigation-drawer:first-of-type .v-list-item {
    min-width: 60px;
    padding: 5px;
    flex-direction: column;
    align-items: center;
  }

  .canvas-wrapper {
    margin-top: 70px;
    border: none;
    padding: 0;
  }

  canvas#my-canvas {
    max-height: none;
  }

  .custom-sidebar {
    display: none;
  }
}
</style>