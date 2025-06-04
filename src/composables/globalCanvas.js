import { ref } from "vue";  

const canvas = ref(null);

const initCanvas = (canvasId = "my-canvas") => {
  const canvasElement = document.getElementById(canvasId);
  
  if (!canvasElement) {
    console.error(`Canvas element with id ${canvasId} not found`);
    return null;
  }
  
 
  if (!canvas.value) { 
    canvas.value = new fabric.Canvas(canvasElement, {
      selection: true,  
    });
  }
   
  canvas.value.renderAll();
  
  return canvas.value;
};
 
export const useGlobalCanvas = () => {
  return {
    canvas,
    initCanvas
  };
};
