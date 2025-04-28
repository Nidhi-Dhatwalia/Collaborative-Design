import { ref } from 'vue';

// Function to handle drawing mode settings
const handleDrawingSettings = (canvas, settings) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = settings.color;
  canvas.freeDrawingBrush.width = settings.weight;
  setCanvasCursor(canvas);
};

// Function to toggle drawing mode
const toggleDrawingMode = (canvas, setCanvasCursor) => {
  canvas.isDrawingMode = !canvas.isDrawingMode; // Toggle the drawing mode on the canvas
  setCanvasCursor(canvas); // Update cursor style based on drawing mode
  setCanvasSelectionState(canvas, canvas.isDrawingMode); // Update selection state
};

const setCanvasCursor = (canvas) => {
  canvas.defaultCursor = canvas.isDrawingMode ? "crosshair" : "default";
};

const setCanvasSelectionState = (canvas, isDrawingMode) => {
  canvas.selection = !isDrawingMode;
};

// useDrawingUtils hook
export const useDrawingUtils = () => {
  const drawingMode = ref(false); // Reactive state for drawing mode

  const applySettings = (canvas, settings) => {
    handleDrawingSettings(canvas, settings);
  };

  const toggleMode = (canvas, setCanvasCursor) => {
    toggleDrawingMode(canvas, setCanvasCursor);
    drawingMode.value = !drawingMode.value;
  };

  return {
    drawingMode,
    applySettings,
    toggleMode,
  };
};
