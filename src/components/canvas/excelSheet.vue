<template>
  <v-app>
    <sideBar />
    <v-container fluid class="pa-0">
      <div class="toolbar">
        <h2 class="text-h5 font-weight-bold">Excel Style Sheet</h2>
      </div>

      <div
        v-if="selectedCell.row !== null && selectedCell.col !== null"
        class="format-toolbar"
      >
        <v-btn
          @click="toggleBold"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isBold ? 'primary' : 'secondary'"
          class="format-btn"
          small
          >Bold</v-btn
        >
        <v-btn
          @click="toggleItalic"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isItalic ? 'primary' : 'secondary'"
          class="format-btn"
          small
          >Italic</v-btn
        >
        <v-btn
          @click="toggleUnderline"
          :color="cellStyles[selectedCell.row]?.[selectedCell.col]?.isUnderline ? 'primary' : 'secondary'"
          class="format-btn"
          small
          >Underline</v-btn
        >
        <v-select
          v-model="fontSize"
          :items="fontSizes"
          label="Font Size"
          dense
          class="format-select"
          hide-details
        />
        <v-select
          v-model="alignment"
          :items="alignments"
          label="Align"
          dense
          class="format-select"
          hide-details
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
                fontWeight:
                  cellStyles[rowIndex]?.[colIndex]?.isBold ? 'bold' : 'normal',
                fontStyle:
                  cellStyles[rowIndex]?.[colIndex]?.isItalic ? 'italic' : 'normal',
                textDecoration:
                  cellStyles[rowIndex]?.[colIndex]?.isUnderline
                    ? 'underline'
                    : 'none',
                fontSize:
                  cellStyles[rowIndex]?.[colIndex]?.fontSize + 'px' || '16px',
                textAlign: cellStyles[rowIndex]?.[colIndex]?.alignment || 'center',
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
import { db } from "@/firebase";
import { ref as dbRef, set, onValue } from "firebase/database";
import sideBar from "@/composables/sideBar.vue";

const rows = 50;
const cols = 26;
const colLabels = Array.from({ length: cols }, (_, i) =>
  String.fromCharCode(65 + i)
);

const sheetData = ref([]);
const cellStyles = ref([]);

for (let i = 0; i < rows; i++) {
  sheetData.value.push(Array.from({ length: cols }, () => ""));
  cellStyles.value.push(
    Array.from({ length: cols }, () => ({
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    }))
  );
}

onMounted(() => {
  const dataRef = dbRef(db, "sheetData");
  const styleRef = dbRef(db, "cellStyles");

  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      const fetchedData = snapshot.val();
      sheetData.value = Array.from({ length: rows }, (_, i) =>
        fetchedData[i] || Array(cols).fill("")
      );
    }
  });

  onValue(styleRef, (snapshot) => {
    if (snapshot.exists()) {
      const fetchedStyles = snapshot.val();
      cellStyles.value = Array.from({ length: rows }, (_, i) =>
        fetchedStyles[i] ||
        Array.from({ length: cols }, () => ({
          isBold: false,
          isItalic: false,
          isUnderline: false,
          fontSize: 16,
          alignment: "center",
        }))
      );
    }
  });
});

const selectedCell = ref({ row: null, col: null });

const selectCell = (row, col) => {
  selectedCell.value = { row, col };

  if (!cellStyles.value[row]) {
    cellStyles.value[row] = [];
  }
  if (!cellStyles.value[row][col]) {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
  }

  fontSize.value = cellStyles.value[row][col].fontSize || 16;
  alignment.value = cellStyles.value[row][col].alignment || "center";
};

const fontSizes = [12, 14, 16, 18, 20, 24];
const fontSize = ref(16);

watch(fontSize, (newSize) => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].fontSize = newSize;
    set(dbRef(db, `cellStyles/${row}/${col}/fontSize`), newSize);
  }
});

const alignments = ["left", "center", "right"];
const alignment = ref("center");

watch(alignment, (newAlign) => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    cellStyles.value[row][col].alignment = newAlign;
    set(dbRef(db, `cellStyles/${row}/${col}/alignment`), newAlign);
  }
});

const toggleBold = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newBold = !cellStyles.value[row][col].isBold;
    cellStyles.value[row][col].isBold = newBold;
    set(dbRef(db, `cellStyles/${row}/${col}/isBold`), newBold);
  }
};

const toggleItalic = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newItalic = !cellStyles.value[row][col].isItalic;
    cellStyles.value[row][col].isItalic = newItalic;
    set(dbRef(db, `cellStyles/${row}/${col}/isItalic`), newItalic);
  }
};

const toggleUnderline = () => {
  const { row, col } = selectedCell.value;
  if (row !== null && col !== null) {
    const newUnderline = !cellStyles.value[row][col].isUnderline;
    cellStyles.value[row][col].isUnderline = newUnderline;
    set(dbRef(db, `cellStyles/${row}/${col}/isUnderline`), newUnderline);
  }
};

const autoSaveCell = (row, col) => {
  const value = sheetData.value[row][col];

  if (!cellStyles.value[row]) {
    cellStyles.value[row] = [];
  }
  if (!cellStyles.value[row][col]) {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
  }

  if (value === "") {
    cellStyles.value[row][col] = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: 16,
      alignment: "center",
    };
    set(dbRef(db, `cellStyles/${row}/${col}`), cellStyles.value[row][col]);
  }

  set(dbRef(db, `sheetData/${row}/${col}`), value);
};
</script>

<style scoped>
html,
body,
.v-container {
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
.format-btn {
  font-size: 14px;
  min-width: 60px;
  height: 32px;
}
.format-select {
  width: 120px;
}
.excel-wrapper {
  height: calc(100vh - 140px);
  overflow: auto;
  border: 1px solid #ccc;
  margin-left: 120px;
  min-width: 100%;
  box-sizing: border-box;
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
}
.cell-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  text-align: center;
  box-sizing: border-box;
  background: transparent;
  font-family: Arial, sans-serif;
}
.row-header {
  background-color: #ddd;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.col-header {
  background-color: #ddd;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selected {
  border: 2px solid #1976d2;
  padding: 3px;
  background-color: #e3f2fd;
}
</style>
