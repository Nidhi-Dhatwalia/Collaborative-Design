<template>
  <v-container fluid class="saved-designs pa-6">
    <v-row class=" elevation-8 bg-white">
      <!-- Sidebar -->
      <v-col cols="12" md="2" class="sidebar d-flex flex-column justify-space-between py-6 px-4">
        <div>
          <h3 class="mb-4 text-primary font-weight-bold text-h5"> Saved Designs</h3>
          <v-list class="design-list">
            <v-list-item
              v-for="(design, index) in savedDesigns"
              :key="index"
              :class="{ selected: selectedDesignIndex === index }"
              class="mb-2 rounded-md transition-all"
              elevation="1"
            >
              <div
                class="design-item d-flex justify-space-between align-center w-100"
                @click="loadDesign(design, index)"
              >
                <div class="design-title font-weight-medium">Design {{ index + 1 }}</div>
                <v-icon
                  color="red"
                  class="delete-icon"
                  @click.stop="deleteDesign(index)"
                  aria-label="Delete design"
                >
                  mdi-delete
                </v-icon>
              </div>
            </v-list-item>
          </v-list>
        </div>

        <!-- Back to Canvas Button in Sidebar bottom -->
        <v-btn
          color="success"
          class="mt-6 small-btn"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/canvas')"
        >
          Back to Canvas
        </v-btn>
      </v-col>

      <!-- Canvas Preview Area -->
      <v-col cols="12" md="10" class="canvas-wrapper py-6 px-6">
        <div class="canvas-area">
          <div v-if="selectedDesignIndex===null" class="text-center my-6 justify-center">
            <v-icon size="64" color="grey lighten-2">mdi-image</v-icon>
            <h4 class="mt-2">No Design Selected</h4>
             
          
          <p> Please select a design from the sidebar to preview it.</p> 
          </div>
          <canvas id="preview-canvas" width="900" height="500"></canvas>


          
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let canvasInstance = null

const savedDesigns = ref([])
const selectedDesignIndex = ref(null)
const isModified = ref(false)

onMounted(() => {
  try {
    savedDesigns.value = JSON.parse(localStorage.getItem('savedDesigns')) || []
  } catch (e) {
    console.error('Error loading designs:', e)
  }

  const canvasElement = document.getElementById('preview-canvas')
  if (canvasElement) {
    canvasInstance = new fabric.Canvas(canvasElement)

    canvasInstance.on('object:modified', () => isModified.value = true)
    canvasInstance.on('object:added', () => isModified.value = true)
    canvasInstance.on('object:removed', () => isModified.value = true)
  }
 
})

const loadDesign = (design, index) => {
  selectedDesignIndex.value = index
  if (canvasInstance) {
    canvasInstance.clear()
    canvasInstance.loadFromJSON(design, () => {
      setTimeout(() => {
        canvasInstance.renderAll()
        fitCanvasToViewport()
        isModified.value = false
      }, 100)
    })
  }
}

const deleteDesign = (index) => {
  if (confirm('Are you sure you want to delete this design?')) {
    savedDesigns.value.splice(index, 1)
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns.value))

    if (selectedDesignIndex.value === index) {
      selectedDesignIndex.value = null
      canvasInstance.clear()
    } else if (savedDesigns.value.length > 0) {
      const nextIndex = index === 0 ? 0 : index - 1
      loadDesign(savedDesigns.value[nextIndex], nextIndex)
    }
  }
}

const saveCurrentDesign = () => {
  if (canvasInstance) {
    const currentDesign = canvasInstance.toJSON()

    const alreadyExists = savedDesigns.value.some(
      (design) => JSON.stringify(design) === JSON.stringify(currentDesign)
    )

    if (!alreadyExists) {
      savedDesigns.value.push(currentDesign)
      localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns.value))
      isModified.value = false
      alert('Design saved successfully.')
    } else {
      alert('This design is already saved.')
    }
  }
}

const fitCanvasToViewport = () => {
  const canvasElement = document.getElementById('preview-canvas')
  canvasElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (canvasInstance) {
    canvasInstance.setZoom(1)
  }
}
</script>
 

<style scoped>
.saved-designs {
  background-color: #ffffff;
  min-height: 100vh;
}

.sidebar {
  border-right: 1px solid #eee;
  background-color: #d8e8f1;
  border-radius: 12px 0 0 12px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 24px;
}

.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 32px;
}

.canvas-area {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #000000;
  border-radius: 12px;
  padding: 16px;
  background-color: #fffdfd;
}

canvas {
  max-width: 100%;
  height: auto; 
  margin: 0 auto; 
}

.v-list-item.selected {
  background-color: #b7e2f3 !important;
  border-left: 4px solid #1976d2;
  transition: 0.3s;
}

.v-list-item:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.design-item {
  cursor: pointer;
  user-select: none;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 0 transparent;
}

.design-item:hover {
  background-color: #e3f2fd;
  box-shadow: 0 2px 8px rgb(25 118 210 / 0.2);
}

.design-title {
  font-size: 1rem;
}

.delete-icon {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.2s;
}

.delete-icon:hover {
  color: #b00020;
}

.small-btn {
  font-size: 0.8rem;
  height: 32px;
  min-width: auto;
  padding-left: 12px;
  padding-right: 12px;
}
</style>