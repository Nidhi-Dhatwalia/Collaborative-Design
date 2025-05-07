import { ref } from 'vue';

const saveCanvasState = (canvas) => {
  if (!canvas) return;

  // Get the current state of the canvas
  const currentState = canvas.toJSON();

  // Save state to localStorage for persistence
  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

const loadCanvasState = (canvas) => {
  if (!canvas) return;

  // Retrieve the saved canvas state from localStorage
  const savedState = localStorage.getItem("savedDesign");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    canvas.loadFromJSON(parsedState, () => {
      canvas.renderAll(); // Re-render the canvas after loading the saved state
    });
  }
};

export const useCanvasUtils = () => {
  const saveState = (canvas) => {
    saveCanvasState(canvas);
  };

  const loadState = (canvas) => {
    loadCanvasState(canvas);
  };

  return {
    saveState, // Function to save the canvas state
    loadState, // Function to load the saved canvas state
  };
};
