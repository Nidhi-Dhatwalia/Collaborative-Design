import { ref } from 'vue';

 
export function useImageUtils(canvas) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && canvas.value) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const fabricImage = new fabric.Image(img);
          canvas.value.add(fabricImage);
          canvas.value.renderAll();
        };
        saveCanvasToLocalStorage();
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();
  
    inputElement.addEventListener('change', handleImageUpload);
  };
  


  const saveCanvasToLocalStorage = () => {
    if (canvas.value) {
      const canvasState = JSON.stringify(canvas.value.toJSON());
      localStorage.setItem("savedDesign", canvasState);
      console.log('Canvas saved to localStorage');
    }
  };

  // New function to save the canvas as an image
  const saveCanvasAsImage = () => {
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

  return { handleImageUpload, triggerImageUpload, saveCanvasAsImage };
}