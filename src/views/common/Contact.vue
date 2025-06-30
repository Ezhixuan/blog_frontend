<template>
  <div class="contact-container">
    <div class="contact-card">
      <h1 class="contact-title">Contact Me</h1>
      <form class="contact-form">
        <div class="form-group">
          <label for="name" class="form-label">Name</label>
          <input 
            type="text" 
            id="name" 
            class="form-input"
            placeholder="Your name"
          >
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-input"
            placeholder="your@email.com"
          >
        </div>
        <div class="form-group">
          <label for="message" class="form-label">Message</label>
          <textarea 
            id="message" 
            rows="4" 
            class="form-input"
            placeholder="Your message..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          class="submit-button"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无需要的逻辑
</script>

<style scoped>
.contact-container {
  @apply space-y-8;
}

.contact-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8;
}

.contact-title {
  @apply text-3xl font-bold mb-6 dark:text-white;
}

.contact-form {
  @apply max-w-lg;
}

.form-group {
  @apply mb-6;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.submit-button {
  @apply w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors;
}
</style>