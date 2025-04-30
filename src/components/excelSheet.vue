<template>
  <v-app>
    <sideBar />
    <v-container fluid class="pa-0">
      <div class="toolbar">
        <h2 class="text-h5 font-weight-bold">Excel Style Sheet</h2>
        <v-btn color="primary" @click="saveToLocalStorage">Save</v-btn>
      </div>

      <div
        v-if="selectedCell.row !== null && selectedCell.col !== null"
        class="format-toolbar"
      >
        <v-btn @click="toggleBold" color="secondary">Bold</v-btn>
        <v-select
          v-model="fontSize"
          :items="fontSizes"
          label="Font Size"
          dense
        />
      </div>

      <div class="excel-wrapper">
        <div class="row header-row">
          <div class="cell row-header"></div>
          <div class="cell col-header" v-for="col in colLabels" :key="col">
            {{ col }}
          </div>
        </div>

        <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div class="cell row-header">{{ rowIndex + 1 }}</div>
          <div
            class="cell"
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :class="{
              selected:
                selectedCell.row === rowIndex && selectedCell.col === colIndex,
            }"
          >
            <input
              type="text"
              v-model="sheetData[rowIndex][colIndex]"
              class="cell-input"
              :style="{
                fontWeight: selectedCell.row === rowIndex && selectedCell.col === colIndex && isBold ? 'bold' : 'normal',
                fontSize: selectedCell.row === rowIndex && selectedCell.col === colIndex ? fontSize + 'px' : '16px',
              }"
              @click="selectCell(rowIndex, colIndex)"
            />
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import sideBar from "../composables/sideBar.vue";

const colLabels = [];
for (let i = 0; i < 26; i++) {
  colLabels.push(String.fromCharCode(65 + i));
}

const rows = 50;
const cols = 26;

const sheetData = ref([]);
for (let i = 0; i < rows; i++) {
  const row = [];
  for (let j = 0; j < cols; j++) {
    row.push('');
  }
  sheetData.value.push(row);
}

const STORAGE_KEY = "excel-sheet-data";

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    sheetData.value = JSON.parse(saved);
  }
});

const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheetData.value));
  alert("Sheet saved!");
};

const selectedCell = ref({ row: null, col: null });

const fontSizes = [12, 14, 16, 18, 20, 24];

const fontSize = ref(16);

const isBold = ref(false);

const selectCell = (row, col) => {
  selectedCell.value = { row, col };
};

const toggleBold = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    isBold.value = !isBold.value;
  }
};
</script>


<style scoped>
html, body, .v-container {
  height: 100%;
  margin: 0;
  padding: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-left: 120px;
  background-color: #f5f5f5;
}

.format-toolbar {
  display: flex;
  gap: 10px;
  margin: 12px 0 12px 120px;
  align-items: center;
}

.excel-wrapper {
  height: calc(100vh - 140px);
  overflow: auto;
  border: 1px solid #ccc;
  margin-left: 120px;
}

.row {
  display: flex;
  min-width: max-content;
}

.cell {
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  text-align: center;
}

.row-header {
  background-color: #f0f0f0;
  font-weight: bold;
  position: sticky;
  left: 0;
  z-index: 1;
}

.col-header {
  background-color: #e0e0e0;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}

.selected {
  outline: 2px solid #1976d2;
}
</style>
