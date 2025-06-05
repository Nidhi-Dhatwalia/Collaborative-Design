<template>
  <div>
    <v-app-bar flat class="toolbar">
      <router-link to="/home">
        <v-icon class="icon" title="Menu" style="cursor: pointer">
          mdi-menu
        </v-icon>
      </router-link>

      <v-divider vertical class="mx-8" />

      <div class="icon-group">
        <!-- <v-icon class="icon" title="Undo" >mdi-undo</v-icon>
        <v-icon class="icon" title="Redo"  >mdi-redo</v-icon> -->
        <v-icon class="icon" title="Save to Cloud" @click="upload">
          mdi-cloud-upload-outline
        </v-icon>
      </div>

      <v-divider vertical class="mx-10" />

      <v-toolbar-title class="text-white text-h6 font-weight-medium">
        Canvas Whiteboard
      </v-toolbar-title>

      <v-spacer />

      <div class="right-icons">
        <v-icon
          class="chat-toggle-icon"
          style="cursor: pointer; font-size: 28px; color: white"
          title="Toggle Chat"
          @click="toggleChat"
        >
          {{ isChatVisible ? "mdi-close" : "mdi-chat-plus" }}
        </v-icon>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="action-button"
              elevation="0"
              title="Share"
              style="text-transform: none"
            >
              <v-icon left style="margin-right: 8px">mdi-share-variant</v-icon>
              Share
            </v-btn>
          </template>

          <div class="share-row">
            <div
              v-for="(item, index) in shareItems"
              :key="index"
              class="share-item"
              :title="item.title"
              @click="item.action"
            >
              <v-icon
                :color="item.color ? item.color : ''"
                class="share-icon"
              >
                {{ item.icon }}
              </v-icon>
              <span class="share-label">{{ item.label }}</span>
            </div>
          </div>
        </v-menu>
      </div>
    </v-app-bar>

    <commentSidebar :open="isChatVisible" />
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import commentSidebar from "../canvas/commentSidebar.vue";

const upload = inject("upload");
const downloadCanvas = inject("downloadCanvas");

const isChatVisible = ref(false);

 
const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value; 
};

const shareUrl = "https://example.com/canvas";

const shareWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
  window.open(url, "_blank");
};

const shareInstagram = () => {
  window.open("https://www.instagram.com/", "_blank");
};

const copyLink = () => {
  navigator.clipboard.writeText(shareUrl);
  alert("Link copied to clipboard!");
};

const shareItems = [
  {
    label: "WhatsApp",
    icon: "mdi-whatsapp",
    color: "#25D366",
    title: "Share on WhatsApp",
    action: shareWhatsApp,
  },
  {
    label: "Instagram",
    icon: "mdi-instagram",
    color: "#C13584",
    title: "Share on Instagram",
    action: shareInstagram,
  },
  {
    label: "Copy Link",
    icon: "mdi-content-copy",
    title: "Copy Link",
    action: copyLink,
  },
  {
    label: "Download",
    icon: "mdi-download",
    title: "Download",
    action: downloadCanvas,
  },
];
</script>

<style scoped>
.toolbar {
  background: linear-gradient(to right, #03bfcc, #3680d8, #713ce5);
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  color: white;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.icon:hover {
  color: #e0f7fa;
  transform: scale(1.1);
}

.right-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-button {
  background-color: white;
  color: #3f51b5;
  font-weight: 500;
  margin-left: 8px;
  transition: background-color 0.3s;
  text-transform: none;
}

.action-button:hover {
  background-color: #e3f2fd;
}

.share-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  user-select: none;
  min-width: 280px;
  justify-content: center;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(2, 2, 2);
  cursor: pointer;
  font-size: 13px;
  transition: color 0.3s, transform 0.2s;
}

.share-item:hover {
  color: #b39ddb;
  transform: scale(1.1);
}

.share-icon {
  font-size: 32px !important;
  margin-bottom: 6px;
}

.share-label {
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Media Queries */
@media (max-width: 768px) {
  .toolbar {
    padding: 0 8px;
  }

  .icon-group {
    gap: 8px;
  }

  .right-icons {
    gap: 8px;
  }

  .icon {
    font-size: 20px;
  }

  .action-button {
    font-size: 14px;
  }

  .share-row {
    flex-direction: column;
    padding: 8px 16px;
    gap: 12px;
  }

  .share-item {
    font-size: 12px;
  }

  .share-icon {
    font-size: 28px !important;
  }
}

@media (max-width: 480px) {
  .toolbar {
    padding: 0 4px;
  }

  .icon-group {
    gap: 6px;
  }

  .icon {
    font-size: 18px;
  }

  .action-button {
    font-size: 12px;
  }

  .right-icons {
    gap: 6px;
  }

  .share-row {
    flex-direction: column;
    padding: 6px 12px;
    gap: 8px;
  }

  .share-item {
    font-size: 11px;
  }

  .share-icon {
    font-size: 24px !important;
  }
}
</style>
