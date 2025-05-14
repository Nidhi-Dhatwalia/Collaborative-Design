import { ref } from 'vue';
import * as fabric from "fabric";
 
const saveCanvasState = (canvas) => {
  if (!canvas) return;

  // Get the current state of the canvas as a JSON object
  const currentState = canvas.toJSON(); 

  localStorage.setItem("savedDesign", JSON.stringify(currentState));
};

const loadCanvasState = (canvas) => {
  if (!canvas) return; 
  const savedState = localStorage.getItem("savedDesign");
  if (savedState) {
    const parsedState = JSON.parse(savedState); 
    canvas.loadFromJSON(parsedState, () => { 
      canvas.renderAll();
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
    saveState,  
    loadState,  
  };
};
