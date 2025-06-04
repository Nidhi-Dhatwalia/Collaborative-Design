<template>
  <transition name="slide-fade">
    <div v-if="isChatOpen" class="chat-sidebar">
      <div class="chat-header">
        <h2><v-icon>mdi-chat-plus</v-icon> Chat Room</h2>
        <p class="text-caption text-grey-darken-1">
          Logged in as: <strong>{{ currentEmail }}</strong>
        </p>
      </div>

      <div class="chat-messages" ref="chatContainer">
        <div
          v-for="(msg, index) in comments"
          :key="index"
          :class="['chat-bubble', msg.sender === currentEmail ? 'from-me' : 'from-other']"
        >
          <v-card
            class="pa-3 rounded-lg chat-message-card"
            elevation="1"
            :color="msg.sender === currentEmail ? '#e5f1f7' : '#ddd7ed'"
          >
            <div class="message-content">
              <div class="text-body-2 text-grey-darken-4">
                <strong>{{ msg.sender }}:</strong> {{ msg.text }}
              </div>

              <v-icon
                v-if="msg.sender === currentEmail"
                small
                color="black"
                class="delete-btn"
                @click="deleteComment(index)"
                title="Delete message"
              >
                mdi-delete
              </v-icon>
            </div>
          </v-card>
        </div>
      </div>

      <div class="chat-input">
        <v-text-field
          v-model="newComment"
          placeholder="Type your message..."
          variant="outlined"
          hide-details
          density="compact"
          @keyup.enter="saveComment"
          class="input-field"
          clearable
        />

        <v-btn
          color="primary"
          icon
          @click="saveComment"
          :disabled="!newComment.trim()"
          class="send-button"
        >
          <v-icon>mdi-send-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getDatabase, ref as dbRef, set, onValue } from 'firebase/database'

// Firebase configuration (already present in your case)
const db = getDatabase()

const STORAGE_CHAT_KEY = 'chat_comments_with_email'
const STORAGE_EMAIL_KEY = 'userEmail'

const props = defineProps({
  open: Boolean,
})

const currentEmail = ref('')
const newComment = ref('')
const comments = ref([])
const chatContainer = ref(null)

const isChatOpen = ref(props.open)

watch(
  () => props.open,
  (newVal) => {
    isChatOpen.value = newVal
    if (newVal) {
      setTimeout(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      }, 100)
    }
  }
)

// Function to save a comment
const saveComment = () => {
  if (!newComment.value.trim() || !currentEmail.value) return

  // Push the new comment to Firebase
  const commentsRef = dbRef(db, 'comments')
  const newMessage = {
    text: newComment.value.trim(),
    sender: currentEmail.value,
    timestamp: Date.now(), // Add a timestamp for better ordering
  }

  // Update Firebase Realtime Database
  set(commentsRef, [...comments.value, newMessage])
  
  // Clear input after sending
  newComment.value = ''
  scrollToBottom()
}

// Function to delete a comment
const deleteComment = (index) => {
  if (comments.value[index].sender === currentEmail.value) {
    comments.value.splice(index, 1)
    updateLocalStorage()
  }
}

// Function to scroll to the bottom of chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Function to sync comments with Firebase
const syncCommentsWithFirebase = () => {
  const commentsRef = dbRef(db, 'comments')

  // Listen for changes in the Firebase comments node
  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      comments.value = data
    }
  })
}
 
onMounted(() => {
  const savedComments = sessionStorage.getItem(STORAGE_CHAT_KEY)
  const email = sessionStorage.getItem(STORAGE_EMAIL_KEY)

  if (savedComments) {
    comments.value = JSON.parse(savedComments)
  }

  if (email) {
    currentEmail.value = email
  } else {
    currentEmail.value = 'anonymous@example.com'
  }

 
  syncCommentsWithFirebase()
})

</script>


 


<style scoped>
.chat-sidebar {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 350px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.15);
  border-radius: 8px;
  overflow: hidden;
  z-index: 9999;
}

.chat-wrapper {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;
  gap: 8px;
}

 
.toggle-chat-btn {
  background-color: #1976d2;
  color: white;
  box-shadow: 0 2px 5px rgb(25 118 210 / 0.5);
  border-radius: 50%;
  width: 44px;
  height: 44px;
}

  
.chat-sidebar {
  width: 350px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.15);
  border-radius: 8px;
  overflow: hidden;
}

 
.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-header h2 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fafafa;
  scroll-behavior: smooth;
}

.chat-bubble .delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.chat-bubble:hover .delete-btn {
  opacity: 1;
  pointer-events: auto;
}
.from-me {
  align-self: flex-start;
  justify-content: flex-start;
}

.from-other {
  align-self: flex-end;
  justify-content: flex-end;
}

.chat-message-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.delete-btn {
  flex-shrink: 0;
  cursor: pointer;
}

.chat-input {
  padding: 14px 16px;
  border-top: 1px solid #ddd;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-field {
  flex-grow: 1;
}

.send-button {
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-grey-darken-1 {
  color: #555;
}

.text-grey-darken-4 {
  color: #222;
}

@media (min-width: 769px) {
  .chat-sidebar {
    width: 350px;
    height: 500px;
  }

  .chat-header h2 {
    font-size: 22px;
  }

  .chat-header p {
    font-size: 16px;
  }

  .chat-messages {
    padding: 16px;
    gap: 12px;
  }

  .chat-input {
    padding: 14px 16px;
  }

  .input-field {
    font-size: 16px;
  }

  .send-button {
    min-width: 44px;
    min-height: 44px;
  }
}
 
@media (max-width: 768px) {
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toggle-chat-btn {
    position: fixed;
    bottom: 30px;
    right: 20px;
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    box-shadow: 0 2px 5px rgba(25, 118, 210, 0.5);
    z-index: 999;
  }
}
 
@media (max-width: 768px) {
  .chat-sidebar {
    display: none;
  }

  .chat-sidebar.open {
    display: flex;
  }
}
</style>
