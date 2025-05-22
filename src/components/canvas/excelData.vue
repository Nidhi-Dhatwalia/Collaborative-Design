<template>
  <v-app>
    <v-container fluid class="pa-4">
      <h2 class="text-h5 font-weight-bold mb-4">Saved Excel Data</h2>

      <div v-if="!sheetData.length">
        <p>No saved sheet data found in localStorage.</p>
      </div>

      <div v-else class="excel-wrapper">
        <div class="row header-row">
          <div class="cell row-header"></div>
          <div class="cell col-header" v-for="col in colLabels" :key="col">
            {{ col }}
          </div>
        </div>

        <div class="row" v-for="(row, rowIndex) in sheetData" :key="rowIndex">
          <div class="cell row-header">{{ rowIndex + 1 }}</div>
          <div
            class="cell"
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :style="{
              fontWeight:
                cellStyles[rowIndex]?.[colIndex]?.isBold ? 'bold' : 'normal',
              fontStyle:
                cellStyles[rowIndex]?.[colIndex]?.isItalic ? 'italic' : 'normal',
              textDecoration:
                cellStyles[rowIndex]?.[colIndex]?.isUnderline
                  ? 'underline'
                  : 'none',
              fontSize:
                (cellStyles[rowIndex]?.[colIndex]?.fontSize || 16) + 'px',
              textAlign: cellStyles[rowIndex]?.[colIndex]?.alignment || 'center',
            }"
          >
            {{ cell }}
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const rows = 50;
const cols = 26;
const colLabels = Array.from({ length: cols }, (_, i) =>
  String.fromCharCode(65 + i)
);

const sheetData = ref([]);
const cellStyles = ref([]);

onMounted(() => {
  const data = localStorage.getItem("excelSheetData");
  const styles = localStorage.getItem("excelCellStyles");

  if (data) {
    try {
      sheetData.value = JSON.parse(data);
    } catch (e) {
      sheetData.value = [];
      console.error("Invalid sheet data in localStorage");
    }
  }

  if (styles) {
    try {
      cellStyles.value = JSON.parse(styles);
    } catch (e) {
      cellStyles.value = [];
      console.error("Invalid cell styles in localStorage");
    }
  }
});
</script>

<style scoped>
.excel-wrapper {
  max-height: 80vh;
  overflow: auto;
  border: 1px solid #ccc;
  min-width: 100%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  user-select: none;
}

.row {
  display: flex;
  min-width: max-content;
  flex-wrap: nowrap;
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
  background-color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-header {
  background-color: #f0f0f0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-header {
  background-color: #f0f0f0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

h2 {
  margin-left: 12px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

p {
  margin-left: 12px;
  font-style: italic;
  color: #666;
}
</style>
