import { ref } from 'vue';

export function useImageUtils(canvas) {
  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && canvas.value) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Ensure fabric.Image is created correctly in Fabric.js 6.x
          const fabricImage = new fabric.Image(img, {
            left: 50,  // Set default position, modify as per need
            top: 50,
            selectable: true
          });

          // Add the image to canvas and re-render
          canvas.value.add(fabricImage);
          canvas.value.renderAll();

          // Save the canvas state to localStorage
          saveCanvasToLocalStorage();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger image upload via an input element
  const triggerImageUpload = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();
  
    inputElement.addEventListener('change', handleImageUpload);
  };

  // Save the canvas state to localStorage
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
      // toDataURL is still valid in Fabric 6.x
      const dataUrl = canvas.value.toDataURL({
        format: 'png', // Ensure format is supported
        quality: 1, // You can adjust the quality if needed
      });

      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas-design.png';  // File name
      link.click();
    } else {
      console.error('Canvas is not initialized yet!');
    }
  };

  return { handleImageUpload, triggerImageUpload, saveCanvasAsImage };
}
