import { ref } from 'vue';

const handleDrawingSettings = (canvas, settings) => {
  if (!settings) {
    console.warn("No drawing settings provided.");
    return;
  }

  // Ensure that the brush is created and configured correctly
  if (!canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);  // PencilBrush is appropriate for line drawing
  }

  // Set drawing mode and configure brush
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = settings.color || 'black';  // Default to black if no color provided
  canvas.freeDrawingBrush.width = settings.weight || 12;       // Default weight if not specified

  // Set brush fill (you can change this as needed for other brush types)
  canvas.freeDrawingBrush.fill = 'transparent';  // This is fine for PencilBrush as it won't have fill
  console.log("Brush fill color is set to:", canvas.freeDrawingBrush.fill);

  // Apply cursor and selection logic
  setCanvasCursor(canvas);
};

const toggleDrawingMode = (canvas, setCanvasCursor) => {
  // Toggle drawing mode state
  canvas.isDrawingMode = !canvas.isDrawingMode; 
  setCanvasCursor(canvas);  // Update the cursor based on mode
  setCanvasSelectionState(canvas, canvas.isDrawingMode);  // Update selection state based on mode
};

const setCanvasCursor = (canvas) => {
  // Set cursor style based on whether drawing mode is active
  canvas.defaultCursor = canvas.isDrawingMode ? "crosshair" : "default";
};

const setCanvasSelectionState = (canvas, isDrawingMode) => {
  // Disable selection when in drawing mode
  canvas.selection = !isDrawingMode;
};

export const useDrawingUtils = () => {
  const drawingMode = ref(false);  // Track whether drawing mode is on or off

  const applySettings = (canvas, settings) => {
    handleDrawingSettings(canvas, settings);  // Apply drawing settings (color, weight)
  };

  const toggleMode = (canvas, setCanvasCursor) => {
    toggleDrawingMode(canvas, setCanvasCursor);  // Toggle drawing mode
    drawingMode.value = !drawingMode.value;  // Update drawingMode state
  };

  return {
    drawingMode,  // Current state of drawing mode (true or false)
    applySettings, // Function to apply drawing settings
    toggleMode,    // Function to toggle drawing mode
  };
};
