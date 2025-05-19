import { ref, onMounted } from "vue";  

const canvas = ref(null);

const initCanvas = (canvasId = "my-canvas", width = 800, height = 600) => {
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
   
  canvas.value.setWidth(width);
  canvas.value.setHeight(height);
   
  canvas.value.renderAll();
  
  return canvas.value;
};
 
export const useGlobalCanvas = () => {
  return {
    canvas,
    initCanvas
  };
};
