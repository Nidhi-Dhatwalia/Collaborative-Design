<template>
  <v-navigation-drawer app width="100px"  class="container">
    <v-list>
      <v-list-item
        v-for="(item, index) in sidebarItems"
        :key="index"
        :to="item.to"
        class="sidebar-item"
        link
      >
        <v-icon class="sidebar-icon">{{ item.icon }}</v-icon>
        <v-list-item-title class="sidebar-text">{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      sidebarItems: [
        { icon: 'mdi-home', label: 'Home', to: '/dashboard' },
        { icon: 'mdi-file-document', label: 'Resume', to: '/resume' },
        { icon: 'mdi-table', label: 'Sheet', to: '/sheet' },
        { icon: 'mdi-clipboard-outline', label: 'Whiteboard', to: '/canvas' },
        { icon: 'mdi-content-save', label: 'Canvas Designs', to: '/save' },
        { icon: 'mdi-table', label: 'Excel Data', to: '/excel' }
      ]
    }
  }
}
</script>

<style scoped>
.container {
   margin-top:70px;
  background-color: #f4f1fd; 
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px;
  margin-top: 10px;
  text-decoration: none; 
  border-radius: 12px;
  color: #4a3d66;  
}

.sidebar-icon {
  background-color: #924ef7;
  color: white;
  border-radius: 50%;
  padding: 20px;
  font-size: 26px; 
  box-shadow: 0 4px 6px rgba(139, 61, 255, 0.4); 
}

.sidebar-item:hover {
  background-color: #dcd6f7;  
  cursor: pointer; 
  box-shadow: 0 8px 12px rgba(139, 61, 255, 0.3);
}

.sidebar-item:hover .sidebar-icon {
  background-color: #6e2cff;
  box-shadow: 0 6px 10px rgba(110, 44, 255, 0.6);
}

.sidebar-text {
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: #4a3d66;
  user-select: none;
  letter-spacing: 0.5px;
}

@media (max-width: 600px) {
  .sidebar-text {
    display: none;
  }
  .sidebar-icon {
    padding: 14px;
    font-size: 22px;
    margin-bottom: 0;
  }
  .sidebar-item {
    padding: 12px 0;
    margin-top: 16px;
  }
}
</style>
