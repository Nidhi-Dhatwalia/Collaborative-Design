<template>
  <v-app>
    <v-app-bar color="black lighten-4">
      <v-toolbar-title class="text-h4" style="color: white">Excel Sheet</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="d-flex pa-0">
        <v-navigation-drawer width="150" color="white">
          <v-list dense nav>
            <template v-for="(item, index) in iconsList" :key="index">
              <v-list-item @click="() => handleAction(item)">
                <v-btn outlined icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
                <v-list-item-content>
                  <v-list-item-title>{{ item.label }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-navigation-drawer>

        <!-- Excel Sheet Data Table -->
        <v-container>
          <v-row>
            <v-col v-for="(row, rowIndex) in sheetData" :key="rowIndex" cols="12">
              <v-row>
                <v-col v-for="(cell, colIndex) in row" :key="colIndex" cols="12">
                  <v-text-field
                    v-model="sheetData[rowIndex][colIndex]"
                    outlined
                    label="Cell"
                    @input="saveExcelSheetState"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { ref as firebaseRef, set, onValue } from 'firebase/database';

// Sheet data and styles
const sheetData = ref([]);
const cellStyles = ref([]);
let isDataLoadingFromFirebase = false;

// Save Excel Data to Firebase
const syncExcelDataWithFirebase = (excelData) => {
  if (isDataLoadingFromFirebase) return;

  const excelRef = firebaseRef(db, 'excelSheets');
  set(excelRef, excelData)
    .then(() => console.log('Excel data saved to Firebase.'))
    .catch((error) => console.error('Firebase save error:', error));
};

// Load Excel Data from Firebase
const loadExcelSheetFromFirebase = () => {
  const excelRef = firebaseRef(db, 'excelSheets');
  onValue(excelRef, (snapshot) => {
    if (snapshot.exists()) {
      const excelData = snapshot.val();
      isDataLoadingFromFirebase = true;

      sheetData.value = excelData.sheetData || [];
      cellStyles.value = excelData.cellStyles || [];

      isDataLoadingFromFirebase = false;
    }
  });
};

// Save Excel Sheet State
const saveExcelSheetState = () => {
  if (!isDataLoadingFromFirebase) {
    const excelState = {
      sheetData: sheetData.value,
      cellStyles: cellStyles.value,
    };
    syncExcelDataWithFirebase(excelState);
  }
};

// Action Handlers
const handleAction = (item) => {
  if (item.actionType === 'function' && typeof item.action === 'function') item.action();
};

const iconsList = ref([
  { icon: 'mdi-content-save', label: 'Save', actionType: 'function', action: saveExcelSheetState },
]);

onMounted(() => {
  loadExcelSheetFromFirebase();
});
</script>

<style scoped>
.v-list-item {
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.v-list-item:hover {
  background-color: #f0f0ff;
}
</style>
