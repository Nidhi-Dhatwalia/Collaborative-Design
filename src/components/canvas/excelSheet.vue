<template>
  <v-app>
    <v-app-bar color="indigo-darken-3" dark>
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Realtime Excel Sheet</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="d-flex pa-0">
        <!-- Sidebar -->
        <v-navigation-drawer
          app
          permanent
          width="240"
          color="slate-darken-2"
          class="pa-4 text-white"
        >
          <div class="sidebar-title">Cell Styles</div>

          <v-divider class="my-2"></v-divider>

          <v-btn
            block
            color="indigo"
            class="mb-2"
            @click="toggleBold"
          >
            Bold
          </v-btn>
          <v-btn
            block
            color="indigo"
            class="mb-2"
            @click="toggleItalic"
          >
            Italic
          </v-btn>
          <v-btn
            block
            color="indigo"
            class="mb-4"
            @click="toggleUnderline"
          >
            Underline
          </v-btn>

          <v-select
            v-model="alignment"
            :items="alignments"
            label="Text Align"
            variant="solo-filled"
            color="indigo"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="fontSize"
            :items="[12, 14, 16, 18, 20, 24, 28]"
            label="Font Size"
            variant="solo-filled"
            color="indigo"
          ></v-select>

          <v-btn
            block
            color="yellow-darken-2"
            class="mt-6"
            @click="saveToLocalStorage"
          >
            Save to Local
          </v-btn>
        </v-navigation-drawer>

        <!-- Excel Sheet -->
        <v-container fluid class="excel-wrapper">
          <!-- Column Headers -->
          <div class="row">
            <div class="cell row-header"></div>
            <div
              v-for="col in columns"
              :key="'header-' + col"
              class="cell col-header"
            >
              {{ String.fromCharCode(65 + col) }}
            </div>
          </div>

          <!-- Sheet Rows -->
          <div
            v-for="(row, rowIndex) in rows"
            :key="'row-' + rowIndex"
            class="row"
          >
            <div class="cell row-header">{{ rowIndex + 1 }}</div>
            <div
              v-for="(col, colIndex) in columns"
              :key="rowIndex + '-' + colIndex"
              class="cell"
              :class="{ selected: selectedCell.row === rowIndex && selectedCell.col === colIndex }"
              @click="selectCell(rowIndex, colIndex)"
              :style="getCellStyle(rowIndex, colIndex)"
            >
              <input
                class="cell-input"
                v-model="sheetData[rowIndex][colIndex]"
                @input="autoSaveCell(rowIndex, colIndex)"
              />
            </div>
          </div>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { ref as dbRef, onValue, set } from "firebase/database";

// Constants
const rows = 20;
const columns = 10;
const router = useRouter();

const sheetData = ref(Array.from({ length: rows }, () => Array(columns).fill("")));
const cellStyles = ref(
  Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 14,
      alignment: "center",
    }))
  )
);

const selectedCell = reactive({ row: null, col: null });

// Realtime sync
onValue(dbRef(db, "sheetData"), (snapshot) => {
  if (snapshot.exists()) {
    sheetData.value = snapshot.val();
  }
});

onValue(dbRef(db, "cellStyles"), (snapshot) => {
  if (snapshot.exists()) {
    cellStyles.value = snapshot.val();
  }
});

// Selection and formatting
const selectCell = (row, col) => {
  selectedCell.row = row;
  selectedCell.col = col;
};

const getCellStyle = (row, col) => {
  const style = cellStyles.value[row][col];
  return {
    fontWeight: style.isBold ? "bold" : "normal",
    fontStyle: style.isItalic ? "italic" : "normal",
    textDecoration: style.isUnderline ? "underline" : "none",
    fontSize: `${style.fontSize}px`,
    textAlign: style.alignment,
  };
};

const fontSize = ref(14);
watch(fontSize, (newSize) => {
  const { row, col } = selectedCell;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].fontSize = newSize;
    set(dbRef(db, `cellStyles/${row}/${col}/fontSize`), newSize).catch(console.error);
  }
});

const alignment = ref("center");
const alignments = ["left", "center", "right"];
watch(alignment, (newAlign) => {
  const { row, col } = selectedCell;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].alignment = newAlign;
    set(dbRef(db, `cellStyles/${row}/${col}/alignment`), newAlign).catch(console.error);
  }
});

const toggleBold = () => {
  const { row, col } = selectedCell;
  if (row !== null && col !== null) {
    const current = cellStyles.value[row][col].isBold;
    cellStyles.value[row][col].isBold = !current;
    set(dbRef(db, `cellStyles/${row}/${col}/isBold`), !current).catch(console.error);
  }
};

const toggleItalic = () => {
  const { row, col } = selectedCell;
  if (row !== null && col !== null) {
    const current = cellStyles.value[row][col].isItalic;
    cellStyles.value[row][col].isItalic = !current;
    set(dbRef(db, `cellStyles/${row}/${col}/isItalic`), !current).catch(console.error);
  }
};

const toggleUnderline = () => {
  const { row, col } = selectedCell;
  if (row !== null && col !== null) {
    const current = cellStyles.value[row][col].isUnderline;
    cellStyles.value[row][col].isUnderline = !current;
    set(dbRef(db, `cellStyles/${row}/${col}/isUnderline`), !current).catch(console.error);
  }
};

const autoSaveCell = (row, col) => {
  set(dbRef(db, `sheetData/${row}/${col}`), sheetData.value[row][col]).catch(console.error);
};

const saveToLocalStorage = () => {
  localStorage.setItem("excelSheet", JSON.stringify(sheetData.value));
  localStorage.setItem("excelStyles", JSON.stringify(cellStyles.value));
};

const goBack = () => {
  router.push("/home");
};
</script>

<style scoped>
.excel-wrapper {
  overflow: auto;
  background-color: #f1f5f9;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  width: 120px;
  height: 32px;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 8px;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: inherit;
}

.row-header {
  width: 50px;
  background-color: #e2e8f0;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.col-header {
  background-color: #e2e8f0;
  font-weight: bold;
  text-align: center;
}

.selected {
  background-color: #e0e7ff !important;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  color: #facc15;
}
</style>
