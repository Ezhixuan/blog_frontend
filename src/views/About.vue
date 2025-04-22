<template>
  <div class="about-container">
    <div class="about-card">
      <!-- 个人信息部分 -->
      <div class="profile-section">
        <div class="avatar-container">
          <img 
            src="https://cdn.jsdelivr.net/gh/Ezhixuan/myPic/images202502262314619.jpg" 
            alt="Profile Avatar" 
            class="avatar-image"
          />
        </div>
        <div class="profile-info">
          <h1 class="name-title">关于我</h1>
          <p class="job-title">后端java开发工程师</p>
          <p class="about-paragraph">
            你好，我是一名充满激情的开发者，热爱构建后端服务。我喜欢使用现代技术工作，并分享我在开发过程中学到的知识。
          </p>
          
          <div class="social-links">
            <a href="https://github.com/your-username" target="_blank" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.337-.012 2.416-.012 2.744 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://twitter.com/your-username" target="_blank" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 003.96 9.824a4.647 4.647 0 01-2.11-.583v.06a4.66 4.66 0 003.737 4.568 4.692 4.692 0 01-2.104.08 4.661 4.661 0 004.352 3.234 9.348 9.348 0 01-5.786 1.995 9.5 9.5 0 01-1.112-.065 13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 002.323-2.41z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/your-username" target="_blank" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 技能部分 -->
      <h2 class="skills-title">专业技能</h2>
      <div class="skills-section">
        <div class="skill-category">
          <h3 class="skill-heading">前端开发</h3>
          <div class="skill-items">
            <div class="skill-item">
              <div class="skill-name">Vue.js</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 95%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">React</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 85%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">TypeScript</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 80%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">Tailwind CSS</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 90%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="skill-category">
          <h3 class="skill-heading">后端开发</h3>
          <div class="skill-items">
            <div class="skill-item">
              <div class="skill-name">Node.js</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 85%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">Python</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 70%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">PostgreSQL</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 75%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">MongoDB</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 80%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="skill-category">
          <h3 class="skill-heading">开发工具</h3>
          <div class="skill-items">
            <div class="skill-item">
              <div class="skill-name">Git</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 90%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">Docker</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 80%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">Linux</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 85%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">VS Code</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 95%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工作经历部分
      <h2 class="experience-title">工作经历</h2>
      <div class="experience-section">
        <div class="experience-item">
          <div class="experience-header">
            <h3 class="company-name">某科技有限公司</h3>
            <span class="date-range">2021 - 至今</span>
          </div>
          <div class="job-position">高级前端工程师</div>
          <p class="job-description">
            负责公司核心产品的前端开发和维护，优化用户体验，提高应用性能。使用Vue.js和TypeScript构建高效、可扩展的前端架构。
          </p>
        </div>

        <div class="experience-item">
          <div class="experience-header">
            <h3 class="company-name">某网络科技公司</h3>
            <span class="date-range">2018 - 2021</span>
          </div>
          <div class="job-position">全栈开发工程师</div>
          <p class="job-description">
            参与多个Web应用的全栈开发，使用React和Node.js技术栈。负责从需求分析到部署上线的全过程，同时协助团队改进开发流程。
          </p>
        </div>
      </div> -->

      <!-- 项目展示部分
      <h2 class="projects-title">项目展示</h2>
      <div class="projects-section">
        <div class="project-card">
          <div class="project-info">
            <h3 class="project-name">个人博客系统</h3>
            <p class="project-description">
              一个使用Vue 3和TypeScript开发的现代化博客系统，支持Markdown编辑、代码高亮和暗色模式。
            </p>
            <div class="project-tags">
              <span class="project-tag">Vue 3</span>
              <span class="project-tag">TypeScript</span>
              <span class="project-tag">Tailwind CSS</span>
            </div>
          </div>
          <div class="project-links">
            <a href="#" class="project-link">查看详情</a>
            <a href="https://github.com/username/project" class="project-link">GitHub</a>
          </div>
        </div>

        <div class="project-card">
          <div class="project-info">
            <h3 class="project-name">在线记事本应用</h3>
            <p class="project-description">
              一个简洁高效的在线笔记应用，支持实时保存、标签分类和全文搜索功能。
            </p>
            <div class="project-tags">
              <span class="project-tag">React</span>
              <span class="project-tag">Node.js</span>
              <span class="project-tag">MongoDB</span>
            </div>
          </div>
          <div class="project-links">
            <a href="#" class="project-link">查看详情</a>
            <a href="https://github.com/username/project" class="project-link">GitHub</a>
          </div>
        </div>
      </div> -->

      <!-- 教育背景部分
      <h2 class="education-title">教育背景</h2>
      <div class="education-section">
        <div class="education-item">
          <div class="education-header">
            <h3 class="university-name">某知名大学</h3>
            <span class="date-range">2014 - 2018</span>
          </div>
          <div class="degree">计算机科学与技术 学士学位</div>
          <p class="education-description">
            主修计算机科学与技术，掌握了扎实的编程基础和计算机理论知识。
          </p>
        </div>
      </div> -->

      <!-- 联系方式部分 -->
      <h2 class="contact-title">联系我</h2>
      <div class="contact-section">
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <a href="mailto:1248909111@qq.com" class="contact-link">1248909111@qq.com</a>
        </div>
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"/>
          </svg>
          <span class="contact-text">中国，福州</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可在此添加所需的交互逻辑
</script>

<style scoped>
.about-container {
  @apply flex justify-center py-8 px-4;
}

.about-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 w-full max-w-4xl;
}

/* 个人信息部分 */
.profile-section {
  @apply flex flex-col md:flex-row items-center md:items-start gap-6 mb-10;
}

.avatar-container {
  @apply w-32 h-32 md:w-40 md:h-40 flex-shrink-0;
}

.avatar-image {
  @apply w-full h-full rounded-full object-cover border-4 border-indigo-100 dark:border-gray-700;
}

.profile-info {
  @apply flex-1;
}

.name-title {
  @apply text-3xl font-bold text-gray-800 dark:text-white mb-2;
}

.job-title {
  @apply text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-4;
}

.about-paragraph {
  @apply text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed;
}

.social-links {
  @apply flex gap-4;
}

.social-link {
  @apply text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors;
}

.social-icon {
  @apply w-6 h-6;
}

/* 技能部分 */
.skills-title, .experience-title, .projects-title, .education-title, .contact-title {
  @apply text-2xl font-bold text-gray-800 dark:text-white mt-10 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700;
}

.skills-section {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.skill-category {
  @apply bg-gray-50 dark:bg-gray-700 rounded-xl p-5;
}

.skill-heading {
  @apply text-xl font-semibold mb-4 text-gray-800 dark:text-white;
}

.skill-items {
  @apply space-y-4;
}

.skill-item {
  @apply space-y-1;
}

.skill-name {
  @apply text-gray-700 dark:text-gray-300 font-medium;
}

.skill-bar {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden;
}

.skill-level {
  @apply h-full bg-indigo-500 dark:bg-indigo-400 rounded-full;
}

/* 工作经历部分 */
.experience-section {
  @apply space-y-8;
}

.experience-item {
  @apply bg-gray-50 dark:bg-gray-700 rounded-xl p-5;
}

.experience-header {
  @apply flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 mb-2;
}

.company-name {
  @apply text-xl font-semibold text-gray-800 dark:text-white;
}

.date-range {
  @apply text-gray-500 dark:text-gray-400 text-sm md:text-base;
}

.job-position {
  @apply text-indigo-600 dark:text-indigo-400 font-medium mb-3;
}

.job-description {
  @apply text-gray-600 dark:text-gray-300;
}

/* 项目展示部分 */
.projects-section {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.project-card {
  @apply bg-gray-50 dark:bg-gray-700 rounded-xl p-5;
}

.project-info {
  @apply mb-4;
}

.project-name {
  @apply text-xl font-semibold text-gray-800 dark:text-white mb-2;
}

.project-description {
  @apply text-gray-600 dark:text-gray-300 mb-3;
}

.project-tags {
  @apply flex flex-wrap gap-2;
}

.project-tag {
  @apply text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md;
}

.project-links {
  @apply flex gap-4;
}

.project-link {
  @apply text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium;
}

/* 教育背景部分 */
.education-section {
  @apply space-y-6;
}

.education-item {
  @apply bg-gray-50 dark:bg-gray-700 rounded-xl p-5;
}

.education-header {
  @apply flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 mb-2;
}

.university-name {
  @apply text-xl font-semibold text-gray-800 dark:text-white;
}

.degree {
  @apply text-indigo-600 dark:text-indigo-400 font-medium mb-3;
}

.education-description {
  @apply text-gray-600 dark:text-gray-300;
}

/* 联系方式部分 */
.contact-section {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.contact-item {
  @apply flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4;
}

.contact-icon {
  @apply w-5 h-5 text-indigo-500 dark:text-indigo-400;
}

.contact-link, .contact-text {
  @apply text-gray-700 dark:text-gray-300;
}

.contact-link:hover {
  @apply text-indigo-600 dark:text-indigo-300;
}
</style>