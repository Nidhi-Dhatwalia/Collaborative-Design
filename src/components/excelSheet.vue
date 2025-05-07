<template>
  <v-app>
    <sideBar />
    <v-container fluid class="pa-0">
      <div class="toolbar">
        <h2 class="text-h5 font-weight-bold">Excel Style Sheet</h2>
      </div>

      <div v-if="selectedCell.row !== null && selectedCell.col !== null" class="format-toolbar">
        <v-btn @click="toggleBold" color="secondary">Bold</v-btn>
        <v-select v-model="fontSize" :items="fontSizes" label="Font Size" dense />
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
            :class="{ selected: selectedCell.row === rowIndex && selectedCell.col === colIndex }"
          >
            <input
              type="text"
              v-model="sheetData[rowIndex][colIndex]"
              class="cell-input"
              :style="{
                fontWeight: cellStyles[rowIndex][colIndex].isBold ? 'bold' : 'normal',
                fontSize: cellStyles[rowIndex][colIndex].fontSize + 'px',
              }"
              @click="selectCell(rowIndex, colIndex)"
              @input="autoSaveCell(rowIndex, colIndex)"
            />
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "../firebase";
import { ref as dbRef, set, onValue } from "firebase/database";
import sideBar from "../composables/sideBar.vue";

// Spreadsheet config
const rows = 50;
const cols = 26;
const colLabels = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i));

// Data and styles
const sheetData = ref([]);
const cellStyles = ref([]);

for (let i = 0; i < rows; i++) {
  sheetData.value.push(Array.from({ length: cols }, () => ''));
  cellStyles.value.push(Array.from({ length: cols }, () => ({ isBold: false, fontSize: 16 })));
}

onMounted(() => {
  const dataRef = dbRef(db, "sheetData");
  const styleRef = dbRef(db, "cellStyles");

  console.log("Fetching data from Firebase...");

  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      sheetData.value = snapshot.val();
    } else {
      console.warn("No sheetData found in Firebase.");
    }
  });

  onValue(styleRef, (snapshot) => {
    if (snapshot.exists()) {
      cellStyles.value = snapshot.val();
    } else {
      console.warn("No cellStyles found in Firebase.");
    }
  });
});

// 🔄 Realtime Auto-save per Cell Edit
const autoSaveCell = (row, col) => {
  const value = sheetData.value[row][col];
  const style = cellStyles.value[row][col];
  set(dbRef(db, `sheetData/${row}/${col}`), value);
  set(dbRef(db, `cellStyles/${row}/${col}`), style);
  console.log(`Auto-saved cell (${row}, ${col}) to Firebase`);
};

// 🔁 Optional manual save (not needed now)
const saveToFirebase = () => {
  set(dbRef(db, "sheetData"), sheetData.value);
  set(dbRef(db, "cellStyles"), cellStyles.value);
  alert("Sheet synced with Firebase!");
};

// Cell selection & formatting
const selectedCell = ref({ row: null, col: null });
const selectCell = (row, col) => {
  selectedCell.value = { row, col };
  fontSize.value = cellStyles.value[row][col].fontSize;
};

const fontSizes = [12, 14, 16, 18, 20, 24];
const fontSize = ref(16);

// 🔁 Watch font size changes and auto-save
watch(fontSize, (newSize) => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].fontSize = newSize;
    set(dbRef(db, `cellStyles/${row}/${col}/fontSize`), newSize);
    console.log(`Font size updated & saved for cell (${row}, ${col}): ${newSize}px`);
  }
});

// 🔁 Toggle bold and auto-save
const toggleBold = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newBold = !cellStyles.value[row][col].isBold;
    cellStyles.value[row][col].isBold = newBold;
    set(dbRef(db, `cellStyles/${row}/${col}/isBold`), newBold);
    console.log(`Bold state toggled & saved for cell (${row}, ${col}): ${newBold}`);
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
