<template>
    <div class="flashcard-grid p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Flashcard
        v-for="card in flashcards"
        :key="card.id"
        :id="card.id"
        :question="card.question"
        :answer="card.answer"
        :is-expanded="expandedCardId === card.id"
        @expand="handleCardExpand"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Flashcard from './Flashcard.vue'; // Adjust path as needed
  
  const flashcards = ref([
    { id: 1, question: 'What is Vue?', answer: 'A progressive JavaScript framework.' },
    { id: 2, question: 'What is `ref()` in Vue 3?', answer: 'A function to create reactive data.' },
    { id: 3, question: 'What is `teleport`?', answer: 'A component to render content in a different part of the DOM.' },
    // ... more cards
  ]);
  
  const expandedCardId = ref(null);
  
  const handleCardExpand = (payload) => {
    if (payload.expand) {
      expandedCardId.value = payload.id;
    } else {
      if (expandedCardId.value === payload.id) {
        expandedCardId.value = null;
      }
    }
  };
  </script>
  
  <style>
  /* Add any global styles for the grid if needed */
  </style>