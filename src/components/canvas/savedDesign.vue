<template>
  <v-container class="saved-designs" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h3>Saved Designs</h3>
        <p v-if="savedDesigns.length === 0" class="no-designs">
          No saved designs yet. Create some on the Canvas page.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="design-preview">
      <v-col cols="12" md="10">
        <v-card elevation="3" class="pa-3">
          <canvas id="preview-canvas" width="750" height="550"></canvas>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      v-for="(design, index) in savedDesigns"
      :key="index"
      justify="center"
      class="mb-4"
    >
      <v-col cols="auto">
        <v-btn color="primary" @click="loadDesign(design)">
          Load Design {{ index + 1 }}
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="error" @click="deleteDesign(index)">
          Delete Design {{ index + 1 }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="auto" v-if="isModified">
        <v-btn color="secondary" @click="saveCurrentDesign">
          Save Current Design
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn color="success" @click="$router.push('/canvas')">
          Back to Canvas
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue' 

let canvasInstance = null
const savedDesigns = ref([])
const isModified = ref(false)

onMounted(() => {
  // Safe localStorage load
  let storedDesigns = []
  try {
    storedDesigns = JSON.parse(localStorage.getItem('savedDesigns')) || []
  } catch (e) {
    console.error('Invalid savedDesigns in localStorage', e)
  }
  savedDesigns.value = storedDesigns

  const canvasElement = document.getElementById('preview-canvas')
  if (canvasElement) {
    canvasInstance = new fabric.Canvas(canvasElement)

    // Mark as modified on changes
    canvasInstance.on('object:modified', () => {
      isModified.value = true
    })
    canvasInstance.on('object:added', () => {
      isModified.value = true
    })
    canvasInstance.on('object:removed', () => {
      isModified.value = true
    })
  }

  // Load first design if exists
  if (savedDesigns.value.length > 0) {
    loadDesign(savedDesigns.value[0])
  }
})

const loadDesign = (design) => {
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

    // If deleted design was loaded, clear preview or load another
    if (savedDesigns.value.length > 0) {
      loadDesign(savedDesigns.value[0])
    } else if (canvasInstance) {
      canvasInstance.clear()
      isModified.value = false
    }
  }
}

const fitCanvasToViewport = () => {
  const canvasElement = document.getElementById('preview-canvas')
  canvasElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })

  if (canvasInstance) {
    const scale = 1
    canvasInstance.setZoom(scale)
  }
}

const saveCurrentDesign = () => {
  if (canvasInstance) {
    const currentDesign = canvasInstance.toJSON()

    // Check for duplicate
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
</script>

<style scoped>
.saved-designs {
  padding-top: 30px;
}

h3 {
  font-size: 32px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 16px;
}

.no-designs {
  font-style: italic;
  color: #757575;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>