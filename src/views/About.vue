<template>
  <div class="about-card">
    <h1 class="about-title">About Me</h1>
    <div class="about-content">
      <p class="about-paragraph">
        Hi, I'm a passionate developer who loves building things for the web. 
        I enjoy working with modern technologies and sharing what I learn along the way.
      </p>
      <h2 class="skills-title">Skills</h2>
      <div class="skills-grid">
        <div class="skill-card">
          <h3 class="skill-heading">Frontend</h3>
          <ul class="skill-list">
            <li>Vue.js</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
        <div class="skill-card">
          <h3 class="skill-heading">Backend</h3>
          <ul class="skill-list">
            <li>Node.js</li>
            <li>Python</li>
            <li>PostgreSQL</li>
            <li>MongoDB</li>
          </ul>
        </div>
        <div class="skill-card">
          <h3 class="skill-heading">Tools</h3>
          <ul class="skill-list">
            <li>Git</li>
            <li>Docker</li>
            <li>Linux</li>
            <li>VS Code</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无需要的逻辑
</script>

<style scoped>
.about-card {
  @apply bg-white rounded-2xl shadow-sm p-8;
}

.about-title {
  @apply text-3xl font-bold mb-6;
}

.about-content {
  @apply w-full max-w-none text-base;
}

.about-paragraph {
  @apply text-gray-600 mb-4;
}

.skills-title {
  @apply text-2xl font-semibold mt-8 mb-4;
}

.skills-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-4;
}

.skill-card {
  @apply bg-slate-50 p-4 rounded-lg;
}

.skill-heading {
  @apply font-semibold mb-2;
}

.skill-list {
  @apply text-gray-600 space-y-1;
}
</style>