import fabric from 'fabric';



// Function to load a resume template onto the canvas
export const loadResumeTemplate = (template) => {
  const canvas = document.querySelector('canvas');
  const fabricCanvas = new fabric.Canvas(canvas);

  fabricCanvas.clear();
  fabricCanvas.loadFromJSON(template.templateData, () => {
    fabricCanvas.renderAll();
  });
};

// Function to load a slide onto the canvas
export const loadSlide = (index, slides, canvas) => {
  const fabricCanvas = new fabric.Canvas(canvas);
  
  fabricCanvas.clear();
  fabricCanvas.loadFromJSON(slides[index].content, () => {
    fabricCanvas.renderAll();
  });
};

// Function for Next Slide
export const nextSlide = (currentSlideIndex, slides, canvas) => {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    loadSlide(currentSlideIndex, slides, canvas);
  }
};

// Function for Previous Slide
export const prevSlide = (currentSlideIndex, slides, canvas) => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    loadSlide(currentSlideIndex, slides, canvas);
  }
};

// Function to toggle between Resume and Slides view
export const toggleView = (view, currentView) => {
  currentView.value = view;
};
