<template>
  <v-container class="pa-4">
    <h2 class="text-h5 font-weight-bold mb-4">Saved Excel Sheets</h2>

    <v-btn color="secondary" class="mb-4" @click="goBack">Back</v-btn> 

    <div v-if="savedSheets.length === 0">
      <p>No saved sheets found.</p>
    </div>

    <v-list class="mb-6">
      <v-list-item
        v-for="sheet in savedSheets"
        :key="sheet.key"
      >
        <v-btn color="green" size="small" @click="() => loadSheet(sheet.key)">
          Load {{ savedSheets.indexOf(sheet) + 1 }}
        </v-btn>

        <v-btn
          color="red"
          size="small"
          class="ml-2"
          @click="() => deleteSheet(sheet.key)"
        >
          Delete
        </v-btn>
      </v-list-item>
    </v-list>

 
    <div v-if="sheetData.length" class="excel-wrapper">
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
          v-for="(col, colIndex) in colLabels"
          :key="colIndex"
          :style="{
            fontWeight: cellStyles[rowIndex]?.[colIndex]?.isBold ? 'bold' : 'normal',
            fontStyle: cellStyles[rowIndex]?.[colIndex]?.isItalic ? 'italic' : 'normal',
            textDecoration: cellStyles[rowIndex]?.[colIndex]?.isUnderline ? 'underline' : 'none',
            fontSize: (cellStyles[rowIndex]?.[colIndex]?.fontSize || 16) + 'px',
            textAlign: cellStyles[rowIndex]?.[colIndex]?.alignment || 'center',
          }"
        >
          {{ row[colIndex] || '' }}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const savedSheets = ref([]);
const sheetData = ref([]);
const cellStyles = ref([]);
 
const colLabels = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

 
const fetchSavedSheets = () => {
  savedSheets.value = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("excelSheetData_")) {
      savedSheets.value.push({
        key,
        date: new Date(key.replace("excelSheetData_", "")).toLocaleString(),
      });
    }
  }

  savedSheets.value.reverse();
};

// Load a selected sheet
const loadSheet = (key) => {
  const data = localStorage.getItem(key);
  const styleKey = key.replace("excelSheetData_", "excelCellStyles_");
  const styles = localStorage.getItem(styleKey);

  if (data) {
    try {
      sheetData.value = JSON.parse(data);
    } catch (e) {
      sheetData.value = [];
      console.error("Error parsing sheet data", e);
    }
  } else {
    sheetData.value = [];
  }

  if (styles) {
    try {
      cellStyles.value = JSON.parse(styles);
    } catch (e) {
      cellStyles.value = [];
      console.error("Error parsing cell styles", e);
    }
  } else {
    cellStyles.value = [];
  }
};

// Delete a saved sheet
const deleteSheet = (key) => {
  const styleKey = key.replace("excelSheetData_", "excelCellStyles_");

  localStorage.removeItem(key);
  localStorage.removeItem(styleKey);

  if (sheetData.value.length && key === savedSheets.value.find(s => s.key === key)?.key) {
    sheetData.value = [];
    cellStyles.value = [];
  }

  fetchSavedSheets();
};

 
const goBack = () => {
  router.push("/sheet");
};

 
onMounted(fetchSavedSheets);
</script>

<style scoped>
.excel-wrapper {
  max-height: 70vh;
  overflow: auto;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
  user-select: none;
}

.row {
  display: flex;
  min-width: max-content;
}

.cell {
  border: 1px solid #ccc;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background-color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-header,
.col-header {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
