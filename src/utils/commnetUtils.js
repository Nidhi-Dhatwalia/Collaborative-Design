// utils/commentUtils.js
import { ref } from 'vue';
import { db } from '../firebase';
import { ref as firebaseRef, set, onValue } from 'firebase/database';

export const comments = ref([]); // This will hold all comments

// Add a new comment
export const addComment = (text, position) => {
  const newComment = {
    text,
    position,
    id: Date.now(), // unique id for each comment
  };
  comments.value.push(newComment);
  syncCommentsWithFirebase(comments.value); // Sync comments with Firebase
};

// Sync comments with Firebase
export const syncCommentsWithFirebase = (comments) => {
  const commentsRef = firebaseRef(db, 'canvasDesigns/comments');
  set(commentsRef, comments)
    .then(() => console.log('Comments synced to Firebase.'))
    .catch((error) => console.error('Firebase sync error:', error));
};

// Load comments from Firebase
export const loadCommentsFromFirebase = () => {
  const commentsRef = firebaseRef(db, 'canvasDesigns/comments');
  onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      comments.value = snapshot.val();
    }
  });
};

// Render comments on canvas
export const renderComments = (canvas) => {
  const context = canvas.getContext('2d');
  comments.value.forEach((comment) => {
    context.fillStyle = 'black';
    context.font = '14px Arial';
    context.fillText(comment.text, comment.position.x, comment.position.y);
  });
};

// Delete a comment
export const deleteComment = (commentId) => {
  comments.value = comments.value.filter(comment => comment.id !== commentId);
  syncCommentsWithFirebase(comments.value); // Update Firebase
};
