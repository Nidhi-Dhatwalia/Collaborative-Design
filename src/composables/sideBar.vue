<template>
  <v-navigation-drawer app width="100px">
    <v-list>
      <v-list-item
        v-for="(item, index) in sidebarItems"
        :key="index"
        :to="item.to"
        class="sidebar-item"
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
        { icon: 'mdi-home', label: 'Home', to: '/' },
        { icon: 'mdi-file-document', label: 'Resume', to: '/resume' },
        { icon: 'mdi-table', label: 'Sheet', to: '/sheet' },
        { icon: 'mdi-clipboard-outline', label: 'Whiteboard', to: '/canvas' },
        { icon: 'mdi-content-save', label: 'Saved Design', to: '/save' }
      ]
    };
  }
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
}

.sidebar-item:hover {
  background-color: #34495e;
  cursor: pointer;
  transform: translateX(10px);  
}

.sidebar-item:hover .sidebar-icon {
  background-color: #2980b9;
}

.sidebar-icon {
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  padding: 16px;
  font-size: 24px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;
}

.sidebar-text {
  font-size: 16px;
  color: rgb(0, 0, 0);
  font-weight: 500;
  text-align: center;
  transition: color 0.3s ease;
}

 
.v-list-item-title {
  padding: 0;
}
</style>
