import { ref } from 'vue';
import * as fabric from 'fabric';

export function useImageUtils(canvas) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && canvas.value) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const fabricImage = new fabric.Image(img, {
            left: 50,
            top: 50,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });

          canvas.value.add(fabricImage);
          canvas.value.renderAll();
        };
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
