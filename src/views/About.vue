<template>
  <div class="about-container">
    <!-- 添加技术轮播图横幅 -->
    <div class="tech-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h2 class="banner-title">生活明朗</h2>
          <h2 class="banner-subtitle">万物可爱。</h2>
          <p class="banner-domain">Ezhixuan.xyz</p>
        </div>

        <!-- 浮动技术图标 -->
        <div class="floating-icons">
          <div class="tech-icon java" style="--delay: 0s; --duration: 8s">
            <svg viewBox="0 0 128 128">
              <path
                fill="#0074BD"
                d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"
              ></path>
              <path
                fill="#EA2D2E"
                d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"
              ></path>
              <path
                fill="#0074BD"
                d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"
              ></path>
              <path
                fill="#EA2D2E"
                d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"
              ></path>
              <path
                fill="#0074BD"
                d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"
              ></path>
            </svg>
          </div>
          <div class="tech-icon redis" style="--delay: 2s; --duration: 9s">
            <svg viewBox="0 0 128 128">
              <path
                fill="#A41E11"
                d="M121.8 93.1c-6.7 3.5-41.4 17.7-48.8 21.6-7.4 3.9-11.5 3.8-17.3 1S13 98.1 6.3 94.9c-3.3-1.6-5-2.9-5-4.2V78s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9v12.5c0 1.3-1.5 2.7-4.9 4.4z"
              ></path>
              <path
                fill="#D82C20"
                d="M121.8 80.5C115.1 84 80.4 98.2 73 102.1c-7.4 3.9-11.5 3.8-17.3 1-5.8-2.8-42.7-17.7-49.4-20.9C-.3 79-.5 76.8 6 74.3c6.5-2.6 43.2-17 51-19.7 7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.9z"
              ></path>
              <path
                fill="#A41E11"
                d="M121.8 72.5C115.1 76 80.4 90.2 73 94.1c-7.4 3.8-11.5 3.8-17.3 1C49.9 92.3 13 77.4 6.3 74.2c-3.3-1.6-5-2.9-5-4.2V57.3s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9V68c0 1.3-1.5 2.7-4.9 4.5z"
              ></path>
              <path
                fill="#D82C20"
                d="M121.8 59.8c-6.7 3.5-41.4 17.7-48.8 21.6-7.4 3.8-11.5 3.8-17.3 1C49.9 79.6 13 64.7 6.3 61.5s-6.8-5.4-.3-7.9c6.5-2.6 43.2-17 51-19.7 7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.9z"
              ></path>
              <path
                fill="#A41E11"
                d="M121.8 51c-6.7 3.5-41.4 17.7-48.8 21.6-7.4 3.8-11.5 3.8-17.3 1C49.9 70.9 13 56 6.3 52.8c-3.3-1.6-5.1-2.9-5.1-4.2V35.9s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9v12.5c.1 1.3-1.4 2.6-4.8 4.4z"
              ></path>
              <path
                fill="#D82C20"
                d="M121.8 38.3C115.1 41.8 80.4 56 73 59.9c-7.4 3.8-11.5 3.8-17.3 1S13 43.3 6.3 40.1s-6.8-5.4-.3-7.9c6.5-2.6 43.2-17 51-19.7 7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.8z"
              ></path>
              <path
                fill="#fff"
                d="M80.4 26.1l-10.8 1.2-2.5 5.8-3.9-6.5-12.5-1.1 9.3-3.4-2.8-5.2 8.8 3.4 8.2-2.7L72 23zM66.5 54.5l-20.3-8.4 29.1-4.4z"
              ></path>
              <ellipse
                fill="#fff"
                cx="38.4"
                cy="35.4"
                rx="15.5"
                ry="6"
              ></ellipse>
              <path fill="#7A0C00" d="M93.3 27.7l17.2 6.8-17.2 6.8z"></path>
              <path fill="#AD2115" d="M74.3 35.3l19-7.6v13.6l-1.9.8z"></path>
            </svg>
          </div>
          <div class="tech-icon rabbitmq" style="--delay: 1s; --duration: 10s">
            <svg viewBox="0 0 128 128">
              <path
                fill="#ff6600"
                d="M119.517 51.188H79.291a3.641 3.641 0 0 1-3.64-3.642V5.62A5.605 5.605 0 0 0 70.028 0H55.66a5.606 5.606 0 0 0-5.627 5.62v41.646a3.913 3.913 0 0 1-3.92 3.925l-13.188.047c-2.176 0-3.972-1.75-3.926-3.926l.094-41.687A5.606 5.606 0 0 0 23.467 0H9.1a5.61 5.61 0 0 0-5.626 5.625V122.99c0 2.737 2.22 5.01 5.01 5.01h111.033a5.014 5.014 0 0 0 5.008-5.011V56.195a4.975 4.975 0 0 0-5.008-5.007zM100.66 95.242a6.545 6.545 0 0 1-6.525 6.524H82.791a6.545 6.545 0 0 1-6.523-6.524V83.9a6.545 6.545 0 0 1 6.523-6.524h11.343a6.545 6.545 0 0 1 6.525 6.523zm0 0"
              ></path>
            </svg>
          </div>
          <div class="tech-icon docker" style="--delay: 3s; --duration: 7s">
            <svg viewBox="0 0 128 128">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#3A4D54"
                d="M73.8 50.8h11.3v11.5h5.7c2.6 0 5.3-.5 7.8-1.3 1.2-.4 2.6-1 3.8-1.7-1.6-2.1-2.4-4.7-2.6-7.3-.3-3.5.4-8.1 2.8-10.8l1.2-1.4 1.4 1.1c3.6 2.9 6.5 6.8 7.1 11.4 4.3-1.3 9.3-1 13.1 1.2l1.5.9-.8 1.6c-3.2 6.2-9.9 8.2-16.4 7.8-9.8 24.3-31 35.8-56.8 35.8-13.3 0-25.5-5-32.5-16.8l-.1-.2-1-2.1c-2.4-5.2-3.1-10.9-2.6-16.6l.2-1.7h9.6V50.8h11.3V39.6h22.5V28.3h13.5v22.5z"
              ></path>
              <path
                fill="#00AADA"
                d="M110.4 55.1c.8-5.9-3.6-10.5-6.4-12.7-3.1 3.6-3.6 13.2 1.3 17.2-2.8 2.4-8.5 4.7-14.5 4.7H18.6c-.6 6.2.5 11.9 3 16.8l.8 1.5c.5.9 1.1 1.7 1.7 2.6 3 .2 5.7.3 8.2.2 4.9-.1 8.9-.7 12-1.7.5-.2.9.1 1.1.5.2.5-.1.9-.5 1.1-.4.1-.8.3-1.3.4-2.4.7-5 1.1-8.3 1.3h-.6c-1.3.1-2.7.1-4.2.1-1.6 0-3.1 0-4.9-.1 6 6.8 15.4 10.8 27.2 10.8 25 0 46.2-11.1 55.5-35.9 6.7.7 13.1-1 16-6.7-4.5-2.7-10.5-1.8-13.9-.1z"
              ></path>
              <path
                fill="#28B8EB"
                d="M110.4 55.1c.8-5.9-3.6-10.5-6.4-12.7-3.1 3.6-3.6 13.2 1.3 17.2-2.8 2.4-8.5 4.7-14.5 4.7h-68c-.3 9.5 3.2 16.7 9.5 21 4.9-.1 8.9-.7 12-1.7.5-.2.9.1 1.1.5.2.5-.1.9-.5 1.1-.4.1-.8.3-1.3.4-2.4.7-5.2 1.2-8.5 1.4l-.1-.1c8.5 4.4 20.8 4.3 35-1.1 15.8-6.1 30.6-17.7 40.9-30.9-.2.1-.4.1-.5.2z"
              ></path>
              <path
                fill="#028BB8"
                d="M18.7 71.8c.4 3.3 1.4 6.4 2.9 9.3l.8 1.5c.5.9 1.1 1.7 1.7 2.6 3 .2 5.7.3 8.2.2 4.9-.1 8.9-.7 12-1.7.5-.2.9.1 1.1.5.2.5-.1.9-.5 1.1-.4.1-.8.3-1.3.4-2.4.7-5.2 1.2-8.5 1.4h-.4c-1.3.1-2.7.1-4.1.1-1.6 0-3.2 0-4.9-.1 6 6.8 15.5 10.8 27.3 10.8 21.4 0 40-8.1 50.8-26H18.7v-.1z"
              ></path>
              <path
                fill="#019BC6"
                d="M23.5 71.8c1.3 5.8 4.3 10.4 8.8 13.5 4.9-.1 8.9-.7 12-1.7.5-.2.9.1 1.1.5.2.5-.1.9-.5 1.1-.4.1-.8.3-1.3.4-2.4.7-5.2 1.2-8.6 1.4 8.5 4.4 20.8 4.3 34.9-1.1 8.5-3.3 16.8-8.2 24.2-14.1H23.5z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#00ACD3"
                d="M28.4 52.7h9.8v9.8h-9.8v-9.8zm.8.8h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm3-12h9.8v9.8h-9.8v-9.8zm.9.8h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#23C2EE"
                d="M39.6 52.7h9.8v9.8h-9.8v-9.8zm.9.8h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#00ACD3"
                d="M50.9 52.7h9.8v9.8h-9.8v-9.8zm.8.8h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#23C2EE"
                d="M50.9 41.5h9.8v9.8h-9.8v-9.8zm.8.8h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm3.1 10.4H72v9.8h-9.8v-9.8zm.8.8h.8v8.1H63v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#00ACD3"
                d="M62.2 41.5H72v9.8h-9.8v-9.8zm.8.8h.8v8.1H63v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#23C2EE"
                d="M62.2 30.2H72V40h-9.8v-9.8zm.8.8h.8v8.1H63V31zm1.5 0h.8v8.1h-.8V31zm1.4 0h.8v8.1h-.8V31zm1.5 0h.8v8.1h-.8V31zm1.5 0h.8v8.1h-.8V31z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#00ACD3"
                d="M73.5 52.7h9.8v9.8h-9.8v-9.8zm.8.8h.8v8.1h-.8v-8.1zm1.4 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1zm1.5 0h.8v8.1h-.8v-8.1z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#D4EEF1"
                d="M48.8 78.3c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#3A4D54"
                d="M48.8 79.1c.2 0 .5 0 .7.1-.2.1-.4.4-.4.7 0 .4.4.8.8.8.3 0 .6-.2.7-.4.1.2.1.5.1.7 0 1.1-.9 1.9-1.9 1.9-1.1 0-1.9-.9-1.9-1.9 0-1 .8-1.9 1.9-1.9M1.1 72.8h125.4c-2.7-.7-8.6-1.6-7.7-5.2-5 5.7-16.9 4-20 1.2-3.4 4.9-23 3-24.3-.8-4.2 5-17.3 5-21.5 0-1.4 3.8-21 5.7-24.3.8-3 2.8-15 4.5-20-1.2 1.1 3.5-4.9 4.5-7.6 5.2"
              ></path>
              <path
                fill="#BFDBE0"
                d="M56 97.8c-6.7-3.2-10.3-7.5-12.4-12.2-2.5.7-5.5 1.2-8.9 1.4-1.3.1-2.7.1-4.1.1-1.7 0-3.4 0-5.2-.1 6 6 13.6 10.7 27.5 10.8H56z"
              ></path>
              <path
                fill="#D4EEF1"
                d="M46.1 89.9c-.9-1.3-1.8-2.8-2.5-4.3-2.5.7-5.5 1.2-8.9 1.4 2.3 1.2 5.7 2.4 11.4 2.9z"
              ></path>
            </svg>
          </div>
          <div class="tech-icon es" style="--delay: 1.5s; --duration: 11s">
            <svg viewBox="0 0 128 128">
              <path
                fill="#343741"
                d="M4 64c0 5.535.777 10.879 2.098 16H84c8.836 0 16-7.164 16-16s-7.164-16-16-16H6.098A63.738 63.738 0 0 0 4 64"
              ></path>
              <path
                fill="#fec514"
                d="M111.695 30.648A61.485 61.485 0 0 0 117.922 24C106.188 9.379 88.199 0 68 0 42.715 0 20.957 14.71 10.574 36H98.04a20.123 20.123 0 0 0 13.652-5.352"
              ></path>
              <path
                fill="#00bfb3"
                d="M98.04 92H10.577C20.961 113.29 42.715 128 68 128c20.2 0 38.188-9.383 49.922-24a61.1 61.1 0 0 0-6.227-6.648A20.133 20.133 0 0 0 98.04 92"
              ></path>
            </svg>
          </div>
          <div class="tech-icon Spring" style="--delay: 0.5s; --duration: 9s">
            <svg viewBox="0 0 128 128">
              <path
                d="M116.452 6.643a59.104 59.104 0 01-6.837 12.136A64.249 64.249 0 0064.205-.026C28.984-.026 0 28.982 0 64.242a64.316 64.316 0 0019.945 46.562l2.368 2.1a64.22 64.22 0 0041.358 15.122c33.487 0 61.637-26.24 64.021-59.683 1.751-16.371-3.051-37.077-11.24-61.7zM29.067 111.17a5.5 5.5 0 01-4.269 2.034c-3.018 0-5.487-2.484-5.487-5.502 0-3.017 2.485-5.501 5.487-5.501 1.25 0 2.485.433 3.452 1.234 2.351 1.9 2.718 5.384.817 7.735zm87.119-19.238c-15.843 21.122-49.68 14.003-71.376 15.02 0 0-3.852.234-7.721.867 0 0 1.45-.617 3.335-1.334 15.226-5.301 22.43-6.335 31.685-11.086 17.427-8.869 34.654-28.274 38.24-48.463-6.637 19.422-26.75 36.11-45.077 42.895-12.557 4.635-35.238 9.136-35.238 9.136l-.917-.484c-15.442-7.518-15.91-40.977 12.157-51.78 12.291-4.735 24.048-2.134 37.323-5.302 14.175-3.367 30.568-14.004 37.238-27.874 7.471 22.19 16.46 56.932.35 78.405z"
                fill="#77bc1f"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

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
            <a
              href="https://github.com/your-username"
              target="_blank"
              class="social-link"
            >
              <svg
                class="social-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.337-.012 2.416-.012 2.744 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/your-username"
              target="_blank"
              class="social-link"
            >
              <svg
                class="social-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 003.96 9.824a4.647 4.647 0 01-2.11-.583v.06a4.66 4.66 0 003.737 4.568 4.692 4.692 0 01-2.104.08 4.661 4.661 0 004.352 3.234 9.348 9.348 0 01-5.786 1.995 9.5 9.5 0 01-1.112-.065 13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 002.323-2.41z"
                />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/your-username"
              target="_blank"
              class="social-link"
            >
              <svg
                class="social-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
                />
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
              <div class="skill-name">rabbitmq.js</div>
              <div class="skill-bar">
                <div class="skill-level" style="width: 95%"></div>
              </div>
            </div>
            <div class="skill-item">
              <div class="skill-name">java</div>
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
              <div class="skill-name">Spring</div>
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
              <div class="skill-name">redis</div>
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

      <!-- 联系方式部分 -->
      <h2 class="contact-title">联系我</h2>
      <div class="contact-section">
        <div class="contact-item">
          <svg
            class="contact-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          <a href="mailto:1248909111@qq.com" class="contact-link"
            >1248909111@qq.com</a
          >
        </div>
        <div class="contact-item">
          <svg
            class="contact-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"
            />
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
  @apply flex flex-col items-center py-0 px-0;
}

/* 技术轮播图横幅 */
.tech-banner {
  @apply w-full bg-gray-100 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300;
  height: 280px;
}

.banner-content {
  @apply relative w-full h-full flex items-center justify-start px-8 sm:px-16;
}

.banner-text {
  @apply z-10 text-gray-800 dark:text-white transition-colors duration-300;
}

.banner-title {
  @apply text-3xl sm:text-4xl font-bold mb-0;
}

.banner-subtitle {
  @apply text-3xl sm:text-4xl font-bold mb-2;
}

.banner-domain {
  @apply text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300;
}

.floating-icons {
  @apply absolute inset-0 w-full h-full pointer-events-none;
}

.tech-icon {
  @apply absolute w-12 h-12 sm:w-16 sm:h-16 opacity-80;
  animation: float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

.tech-icon svg {
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
}

.java {
  right: 20%;
  top: 20%;
}

.redis {
  right: 40%;
  top: 50%;
}

.rabbitmq {
  right: 30%;
  top: 30%;
}

.docker {
  right: 15%;
  top: 60%;
}

.es {
  right: 50%;
  top: 15%;
}

.Spring {
  right: 60%;
  top: 40%;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

/* 原有样式 */
.about-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 w-full max-w-4xl my-8;
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
.skills-title,
.experience-title,
.projects-title,
.education-title,
.contact-title {
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

.contact-link,
.contact-text {
  @apply text-gray-700 dark:text-gray-300;
}

.contact-link:hover {
  @apply text-indigo-600 dark:text-indigo-300;
}
</style>
