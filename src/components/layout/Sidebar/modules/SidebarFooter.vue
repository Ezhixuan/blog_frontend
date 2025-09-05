<template>
  <div>
    <div class="social-links">
      <a href="https://github.com" class="social-link" target="_blank" rel="noopener noreferrer">
        <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
        </svg>
      </a>
      <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
        <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
        </svg>
      </a>
    </div>

    <div class="theme-toggle-section">
      <button
        @click="toggleTheme"
        class="theme-toggle-btn"
        :class="{ dark: currentTheme === 'dark' }"
      >
        <svg v-show="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="theme-icon sun" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
        <svg v-show="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="theme-icon moon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
        <span class="theme-toggle-text">
          {{ currentTheme === 'light' ? '亮色模式' : '暗色模式' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/utils/helpers/theme';

const { currentTheme, toggleTheme } = useTheme();
</script>

<style scoped>
.social-links {
  @apply flex justify-center space-x-4 mb-8;
  @apply animate-fade-slow;
}

.social-link {
  @apply text-gray-600 transition-colors duration-300;
  @apply hover:text-gray-900;
  @apply dark:text-gray-400 dark:hover:text-white;
}

.social-icon {
  @apply w-6 h-6;
}

.theme-toggle-section {
  @apply mb-8 flex justify-center;
}

.theme-toggle-btn {
  @apply flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 transition-all duration-300;
  @apply hover:bg-slate-100;
  @apply dark:border-gray-700 dark:hover:bg-gray-800;
}
.theme-toggle-btn.dark {
  @apply dark:bg-gray-800;
}

.theme-icon {
  @apply h-5 w-5;
}
.theme-icon.sun {
  @apply text-yellow-500;
}
.theme-icon.moon {
  @apply text-blue-300;
}

.theme-toggle-text {
  @apply text-sm font-medium dark:text-gray-300;
}

.animate-fade-slow {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
